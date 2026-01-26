/**
 * useBepStructure Hook
 *
 * Custom hook for managing BEP structure (steps and fields) via API.
 * Handles fetching, creating, updating, deleting, and reordering.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL
  || (typeof window !== 'undefined' ? window.location.origin : '');

/**
 * useBepStructure
 *
 * @param {string|null} projectId - Project ID or null for default template
 * @param {string} bepType - BEP type ('pre-appointment' or 'post-appointment')
 * @returns {Object} Structure data and operations
 */
export function useBepStructure(projectId = null, bepType = null) {
  // State
  const [steps, setSteps] = useState([]);
  const [fields, setFields] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasCustomStructure, setHasCustomStructure] = useState(false);

  // Ref for abort controller
  const abortControllerRef = useRef(null);

  // ========================================
  // API HELPERS
  // ========================================

  const apiCall = useCallback(async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}/api/bep-structure${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return response.json();
  }, []);

  // ========================================
  // FETCH DATA
  // ========================================

  const fetchStructure = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      if (bepType) params.append('bepType', bepType);

      // Fetch structure for project (or default template)
      let structureData;
      if (projectId) {
        const response = await apiCall(`/project/${projectId}?${params}`);
        structureData = response.data;
        setHasCustomStructure(response.hasCustomStructure);
      } else {
        const response = await apiCall(`/template?${params}`);
        structureData = response.data;
        setHasCustomStructure(false);
      }

      // Extract steps and flatten fields
      const allFields = [];
      const stepsData = structureData.map(step => {
        if (step.fields) {
          allFields.push(...step.fields.map(f => ({
            ...f,
            step_id: step.id
          })));
        }
        const { fields: _, ...stepWithoutFields } = step;
        return stepWithoutFields;
      });

      setSteps(stepsData);
      setFields(allFields);

      // Fetch field types
      const typesResponse = await apiCall('/field-types');
      setFieldTypes(typesResponse.data);

    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      console.error('Error fetching BEP structure:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, bepType, apiCall]);

  // Initial fetch
  useEffect(() => {
    fetchStructure();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchStructure]);

  // ========================================
  // STEP OPERATIONS
  // ========================================

  const createStep = useCallback(async (stepData) => {
    try {
      const response = await apiCall('/steps', {
        method: 'POST',
        body: JSON.stringify({
          ...stepData,
          project_id: projectId
        })
      });
      setSteps(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall, projectId]);

  const updateStep = useCallback(async (stepId, updates) => {
    try {
      const response = await apiCall(`/steps/${stepId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      setSteps(prev => prev.map(s => s.id === stepId ? response.data : s));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall]);

  const deleteStep = useCallback(async (stepId) => {
    try {
      await apiCall(`/steps/${stepId}`, { method: 'DELETE' });
      setSteps(prev => prev.filter(s => s.id !== stepId));
      setFields(prev => prev.filter(f => f.step_id !== stepId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall]);

  const reorderSteps = useCallback(async (orders) => {
    try {
      await apiCall('/steps-reorder', {
        method: 'PUT',
        body: JSON.stringify({ orders })
      });
      // Update local state
      const orderMap = new Map(orders.map(o => [o.id, o.order_index]));
      setSteps(prev => {
        const updated = prev.map(s => ({
          ...s,
          order_index: orderMap.has(s.id) ? orderMap.get(s.id) : s.order_index
        }));
        return updated.sort((a, b) => a.order_index - b.order_index);
      });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall]);

  const toggleStepVisibility = useCallback(async (stepId) => {
    try {
      const response = await apiCall(`/steps/${stepId}/visibility`, { method: 'PUT' });
      setSteps(prev => prev.map(s => s.id === stepId ? { ...s, is_visible: response.data.is_visible } : s));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall]);

  // ========================================
  // FIELD OPERATIONS
  // ========================================

  const createField = useCallback(async (fieldData) => {
    try {
      const response = await apiCall('/fields', {
        method: 'POST',
        body: JSON.stringify({
          ...fieldData,
          project_id: projectId
        })
      });
      setFields(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall, projectId]);

  const updateField = useCallback(async (fieldId, updates) => {
    try {
      const response = await apiCall(`/fields/${fieldId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      setFields(prev => prev.map(f => f.id === fieldId ? response.data : f));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall]);

  const deleteField = useCallback(async (fieldId) => {
    try {
      await apiCall(`/fields/${fieldId}`, { method: 'DELETE' });
      setFields(prev => prev.filter(f => f.id !== fieldId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall]);

  const reorderFields = useCallback(async (orders) => {
    try {
      await apiCall('/fields-reorder', {
        method: 'PUT',
        body: JSON.stringify({ orders })
      });
      // Update local state
      const orderMap = new Map(orders.map(o => [o.id, o.order_index]));
      setFields(prev => {
        const updated = prev.map(f => ({
          ...f,
          order_index: orderMap.has(f.id) ? orderMap.get(f.id) : f.order_index
        }));
        return updated.sort((a, b) => {
          // Sort by step first, then by order_index
          if (a.step_id !== b.step_id) return 0;
          return a.order_index - b.order_index;
        });
      });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall]);

  const toggleFieldVisibility = useCallback(async (fieldId) => {
    try {
      const response = await apiCall(`/fields/${fieldId}/visibility`, { method: 'PUT' });
      setFields(prev => prev.map(f => f.id === fieldId ? { ...f, is_visible: response.data.is_visible } : f));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall]);

  const moveFieldToStep = useCallback(async (fieldId, newStepId, newOrderIndex = 0) => {
    try {
      const response = await apiCall(`/fields/${fieldId}/move`, {
        method: 'PUT',
        body: JSON.stringify({ newStepId, newOrderIndex })
      });
      setFields(prev => prev.map(f => f.id === fieldId ? { ...response.data, step_id: newStepId } : f));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall]);

  // ========================================
  // TEMPLATE OPERATIONS
  // ========================================

  const cloneTemplate = useCallback(async () => {
    if (!projectId) {
      throw new Error('Cannot clone template without a project ID');
    }
    try {
      const response = await apiCall('/clone-template', {
        method: 'POST',
        body: JSON.stringify({ projectId })
      });
      setHasCustomStructure(true);
      await fetchStructure();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall, projectId, fetchStructure]);

  const resetToDefault = useCallback(async () => {
    if (!projectId) {
      throw new Error('Cannot reset without a project ID');
    }
    try {
      const response = await apiCall(`/reset/${projectId}`, { method: 'POST' });
      await fetchStructure();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall, projectId, fetchStructure]);

  return {
    // Data
    steps,
    fields,
    fieldTypes,

    // State
    isLoading,
    error,
    hasCustomStructure,

    // Refresh
    refetch: fetchStructure,

    // Step operations
    createStep,
    updateStep,
    deleteStep,
    reorderSteps,
    toggleStepVisibility,

    // Field operations
    createField,
    updateField,
    deleteField,
    reorderFields,
    toggleFieldVisibility,
    moveFieldToStep,

    // Template operations
    cloneTemplate,
    resetToDefault
  };
}

export default useBepStructure;
