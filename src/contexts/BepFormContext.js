import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fullBepSchema, getSchemaForStep, validateStepData } from '../schemas/bepValidationSchemas';
import { getEmptyBepData } from '../data/templateRegistry';

const BepFormContext = createContext(null);

export const useBepForm = () => {
  const context = useContext(BepFormContext);
  if (!context) {
    throw new Error('useBepForm must be used within BepFormProvider');
  }
  return context;
};

export const BepFormProvider = ({ children, initialData = null, bepType = '' }) => {
  const defaultValues = initialData || getEmptyBepData();

  // Initialize form with React Hook Form
  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(fullBepSchema),
    defaultValues,
    shouldUnregister: false, // Keep values when fields unmount
  });

  const {
    formState: { errors, isDirty, isValid, dirtyFields },
    reset,
    getValues,
    setValue,
    trigger,
  } = methods;

  // Track completed sections
  const [completedSections, setCompletedSections] = React.useState(new Set());
  const [bepTypeState, setBepTypeState] = React.useState(bepType);
  const [currentDraft, setCurrentDraft] = React.useState(null);

  // Update form data when initial data changes (e.g., loading draft or template)
  useEffect(() => {
    if (initialData) {
      reset(initialData, { keepDirty: false });
    }
  }, [initialData, reset]);

  // Update bepType when it changes
  useEffect(() => {
    setBepTypeState(bepType);
  }, [bepType]);

  // Save to sessionStorage whenever form data changes
  useEffect(() => {
    const subscription = methods.watch((data) => {
      if (bepTypeState) {
        try {
          // Get fresh completedSections without including it in dependencies
          setCompletedSections((currentCompleted) => {
            sessionStorage.setItem('bep-temp-state', JSON.stringify({
              formData: data,
              bepType: bepTypeState,
              completedSections: Array.from(currentCompleted),
              currentDraft,
              timestamp: Date.now(),
            }));
            return currentCompleted; // Return unchanged to avoid state update
          });
        } catch (error) {
          console.error('Failed to save BEP state:', error);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, bepTypeState, currentDraft]);

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem('bep-temp-state');
      if (savedState) {
        const {
          formData: savedFormData,
          bepType: savedBepType,
          completedSections: savedCompleted,
          currentDraft: savedDraft,
          timestamp,
        } = JSON.parse(savedState);

        const oneHour = 60 * 60 * 1000;
        if (timestamp && Date.now() - timestamp < oneHour) {
          // Always restore currentDraft if it exists
          if (savedDraft && !currentDraft) {
            setCurrentDraft(savedDraft);
          }
          // Only restore form data and bepType if not already set
          if (!bepTypeState && savedBepType) {
            reset(savedFormData, { keepDirty: false });
            setBepTypeState(savedBepType);
            setCompletedSections(new Set(savedCompleted || []));
          }
        }
      }
    } catch (error) {
      console.error('Failed to restore BEP state:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate specific step
  const validateStep = useCallback((stepIndex) => {
    const formData = getValues();
    const result = validateStepData(stepIndex, formData);
    return result.errors;
  }, [getValues]);

  // Mark step as completed
  const markStepCompleted = useCallback((stepIndex) => {
    setCompletedSections((prev) => new Set(prev).add(stepIndex));
  }, []);

  // Update form field
  const updateField = useCallback((fieldName, value) => {
    setValue(fieldName, value, { shouldDirty: true, shouldValidate: true });
  }, [setValue]);

  // Reset form to empty state
  const resetForm = useCallback(() => {
    reset(getEmptyBepData(), { keepDirty: false });
    setCompletedSections(new Set());
    setCurrentDraft(null);
    sessionStorage.removeItem('bep-temp-state');
  }, [reset]);

  // Load draft or template data
  const loadFormData = useCallback((data, type, draftInfo = null) => {
    reset(data, { keepDirty: false });
    setBepTypeState(type);
    setCompletedSections(new Set());
    if (draftInfo) {
      setCurrentDraft({ id: draftInfo.id, name: draftInfo.name });
    } else {
      setCurrentDraft(null);
    }
  }, [reset]);

  // Get all form data
  const getFormData = useCallback(() => {
    return getValues();
  }, [getValues]);

  // Trigger validation for all fields
  const validateAllFields = useCallback(async () => {
    return await trigger();
  }, [trigger]);

  const contextValue = {
    // React Hook Form methods
    methods,
    errors,
    isDirty,
    isValid,
    dirtyFields,

    // Custom methods
    validateStep,
    markStepCompleted,
    updateField,
    resetForm,
    loadFormData,
    getFormData,
    validateAllFields,

    // State
    completedSections,
    bepType: bepTypeState,
    currentDraft,
    setCurrentDraft,
    setBepType: setBepTypeState,
  };

  return (
    <BepFormContext.Provider value={contextValue}>
      <FormProvider {...methods}>{children}</FormProvider>
    </BepFormContext.Provider>
  );
};
