import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fullEirSchema, validateEirStepData } from '../schemas/eirValidationSchemas';
import EMPTY_EIR_DATA from '../data/emptyEirData';

const EirFormContext = createContext(null);

export const useEirForm = () => {
  const context = useContext(EirFormContext);
  if (!context) {
    throw new Error('useEirForm must be used within EirFormProvider');
  }
  return context;
};

const getEmptyEirData = () => ({ ...EMPTY_EIR_DATA });

export const EirFormProvider = ({ children, initialData = null }) => {
  const defaultValues = initialData || getEmptyEirData();

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(fullEirSchema),
    defaultValues,
    shouldUnregister: false,
  });

  const {
    formState: { errors, isDirty, isValid, dirtyFields },
    reset,
    getValues,
    setValue,
    trigger,
  } = methods;

  const [completedSections, setCompletedSections] = React.useState(new Set());
  const [currentDraft, setCurrentDraft] = React.useState(null);

  useEffect(() => {
    if (initialData) {
      reset(initialData, { keepDirty: false });
    }
  }, [initialData, reset]);

  const validateStep = useCallback((stepIndex) => {
    const formData = getValues();
    const result = validateEirStepData(stepIndex, formData);
    return result.errors;
  }, [getValues]);

  const markStepCompleted = useCallback((stepIndex) => {
    setCompletedSections((prev) => new Set(prev).add(stepIndex));
  }, []);

  const updateField = useCallback((fieldName, value) => {
    setValue(fieldName, value, { shouldDirty: true, shouldValidate: true });
  }, [setValue]);

  const resetForm = useCallback(() => {
    reset(getEmptyEirData(), { keepDirty: false });
    setCompletedSections(new Set());
    setCurrentDraft(null);
    sessionStorage.removeItem('eir-temp-state');
  }, [reset]);

  const loadFormData = useCallback((data, draftInfo = null) => {
    reset(data, { keepDirty: false });
    setCompletedSections(new Set());
    if (draftInfo) {
      setCurrentDraft({ id: draftInfo.id, title: draftInfo.title });
    } else {
      setCurrentDraft(null);
    }
  }, [reset]);

  const getFormData = useCallback(() => getValues(), [getValues]);

  const validateAllFields = useCallback(async () => trigger(), [trigger]);

  const contextValue = {
    methods,
    errors,
    isDirty,
    isValid,
    dirtyFields,
    validateStep,
    markStepCompleted,
    updateField,
    resetForm,
    loadFormData,
    getFormData,
    validateAllFields,
    completedSections,
    currentDraft,
    setCurrentDraft,
  };

  return (
    <EirFormContext.Provider value={contextValue}>
      <FormProvider {...methods}>{children}</FormProvider>
    </EirFormContext.Provider>
  );
};
