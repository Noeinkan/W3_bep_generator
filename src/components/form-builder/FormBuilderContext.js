/**
 * FormBuilderContext
 *
 * Provides state management for the dynamic form builder:
 * - Edit mode toggle
 * - Steps and fields structure from API
 * - CRUD operations for steps and fields
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useBepStructure } from './useBepStructure';

const FormBuilderContext = createContext(null);

/**
 * FormBuilderProvider
 *
 * @param {Object} props
 * @param {string} props.projectId - Project ID (null for default template)
 * @param {string} props.bepType - BEP type ('pre-appointment' or 'post-appointment')
 * @param {React.ReactNode} props.children
 */
export function FormBuilderProvider({ projectId, bepType, children }) {
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  // Use the BEP structure hook for data management
  const {
    steps,
    fields,
    fieldTypes,
    isLoading,
    error,
    hasCustomStructure,
    refetch,
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
  } = useBepStructure(projectId, bepType);

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  // Enter edit mode
  const enterEditMode = useCallback(() => {
    setIsEditMode(true);
  }, []);

  // Exit edit mode
  const exitEditMode = useCallback(() => {
    setIsEditMode(false);
  }, []);

  // Get fields for a specific step
  const getFieldsForStep = useCallback((stepId) => {
    return fields.filter(f => f.step_id === stepId);
  }, [fields]);

  // Get visible steps only
  const visibleSteps = useMemo(() => {
    return steps.filter(s => s.is_visible);
  }, [steps]);

  // Get hidden steps
  const hiddenSteps = useMemo(() => {
    return steps.filter(s => !s.is_visible);
  }, [steps]);

  // Get visible fields for a step
  const getVisibleFieldsForStep = useCallback((stepId) => {
    return fields.filter(f => f.step_id === stepId && f.is_visible);
  }, [fields]);

  // Get hidden fields for a step
  const getHiddenFieldsForStep = useCallback((stepId) => {
    return fields.filter(f => f.step_id === stepId && !f.is_visible);
  }, [fields]);

  // Context value
  const value = useMemo(() => ({
    // State
    isEditMode,
    isLoading,
    error,
    hasCustomStructure,
    projectId,
    bepType,

    // Data
    steps,
    visibleSteps,
    hiddenSteps,
    fields,
    fieldTypes,

    // Edit mode controls
    toggleEditMode,
    enterEditMode,
    exitEditMode,

    // Data accessors
    getFieldsForStep,
    getVisibleFieldsForStep,
    getHiddenFieldsForStep,

    // Refresh
    refetch,

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
  }), [
    isEditMode,
    isLoading,
    error,
    hasCustomStructure,
    projectId,
    bepType,
    steps,
    visibleSteps,
    hiddenSteps,
    fields,
    fieldTypes,
    toggleEditMode,
    enterEditMode,
    exitEditMode,
    getFieldsForStep,
    getVisibleFieldsForStep,
    getHiddenFieldsForStep,
    refetch,
    createStep,
    updateStep,
    deleteStep,
    reorderSteps,
    toggleStepVisibility,
    createField,
    updateField,
    deleteField,
    reorderFields,
    toggleFieldVisibility,
    moveFieldToStep,
    cloneTemplate,
    resetToDefault
  ]);

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
}

/**
 * useFormBuilder hook
 *
 * @returns {Object} Form builder context value
 */
export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
}

export default FormBuilderContext;
