/**
 * useBepStructure Hook
 *
 * Custom hook for managing BEP structure (steps and fields) via API.
 * Handles fetching, creating, updating, deleting, and reordering.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../../services/apiService';

const buildBepStructurePath = (endpoint = '') => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `/bep-structure${cleanEndpoint}`;
};

const isCancellationError = (error) => {
  if (!error) return false;
  return error.name === 'AbortError'
    || error.name === 'CanceledError'
    || error.code === 'ERR_CANCELED';
};

/**
 * useBepStructure
 *
 * @param {Object} options - Configuration options
 * @param {string|null} options.projectId - Project ID or null for default template (deprecated, use draftId)
 * @param {string|null} options.draftId - Draft ID for draft-specific structure
 * @param {string} options.bepType - BEP type ('pre-appointment' or 'post-appointment')
 * @returns {Object} Structure data and operations
 */
export function useBepStructure({ projectId = null, draftId = null, bepType = null } = {}) {
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
    try {
      let data;
      if (options.body !== undefined) {
        data = typeof options.body === 'string'
          ? JSON.parse(options.body)
          : options.body;
      }

      const response = await apiClient.request({
        url: buildBepStructurePath(endpoint),
        method: options.method || 'GET',
        headers: options.headers,
        data,
        signal: options.signal
      });

      return response.data;
    } catch (error) {
      if (isCancellationError(error)) {
        throw error;
      }
      const errorMessage = error.response?.data?.error || error.message || 'API request failed';
      const apiError = new Error(errorMessage);
      apiError.name = error.name || 'Error';
      apiError.code = error.code;
      throw apiError;
    }
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
      if (bepType) params.append('bepType', bepType);

      // Fetch structure - prioritize draftId over projectId
      let structureData;
      if (draftId) {
        // Draft-level structure
        const response = await apiCall(`/draft/${draftId}?${params}`, { signal: abortControllerRef.current.signal });
        structureData = Array.isArray(response?.data) ? response.data : [];
        setHasCustomStructure(response.hasCustomStructure ?? false);
      } else if (projectId) {
        // Project-level structure (deprecated)
        const response = await apiCall(`/project/${projectId}?${params}`, { signal: abortControllerRef.current.signal });
        structureData = Array.isArray(response?.data) ? response.data : [];
        setHasCustomStructure(response.hasCustomStructure ?? false);
      } else {
        // Default template
        const response = await apiCall(`/template?${params}`, { signal: abortControllerRef.current.signal });
        structureData = Array.isArray(response?.data) ? response.data : [];
        setHasCustomStructure(false);
      }

      if (!Array.isArray(structureData)) {
        structureData = [];
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
      const typesResponse = await apiCall('/field-types', { signal: abortControllerRef.current.signal });
      setFieldTypes(Array.isArray(typesResponse?.data) ? typesResponse.data : []);

    } catch (err) {
      if (isCancellationError(err)) return;
      setError(err.message);
      console.error('Error fetching BEP structure:', err);
    } finally {
      setIsLoading(false);
    }
  }, [draftId, projectId, bepType, apiCall]);

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
          draft_id: draftId,
          project_id: projectId
        })
      });
      setSteps(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall, draftId, projectId]);

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
          draft_id: draftId,
          project_id: projectId
        })
      });
      setFields(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall, draftId, projectId]);

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
    if (!draftId && !projectId) {
      throw new Error('Cannot clone template without a draft ID or project ID');
    }
    try {
      let response;
      if (draftId) {
        response = await apiCall('/clone-to-draft', {
          method: 'POST',
          body: JSON.stringify({ draftId })
        });
      } else {
        response = await apiCall('/clone-template', {
          method: 'POST',
          body: JSON.stringify({ projectId })
        });
      }
      setHasCustomStructure(true);
      await fetchStructure();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall, draftId, projectId, fetchStructure]);

  const resetToDefault = useCallback(async () => {
    if (!draftId && !projectId) {
      throw new Error('Cannot reset without a draft ID or project ID');
    }
    try {
      let response;
      if (draftId) {
        response = await apiCall(`/reset-draft/${draftId}`, { method: 'POST' });
      } else {
        response = await apiCall(`/reset/${projectId}`, { method: 'POST' });
      }
      await fetchStructure();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall, draftId, projectId, fetchStructure]);

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
