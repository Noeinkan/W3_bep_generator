import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fullOirSchema, validateOirStepData } from '../schemas/oirValidationSchemas';
import EMPTY_OIR_DATA from '../data/emptyOirData';

const OirFormContext = createContext(null);

export const useOirForm = () => {
  const context = useContext(OirFormContext);
  if (!context) {
    throw new Error('useOirForm must be used within OirFormProvider');
  }
  return context;
};

const getEmptyOirData = () => ({ ...EMPTY_OIR_DATA });

export const OirFormProvider = ({ children, initialData = null }) => {
  const defaultValues = initialData || getEmptyOirData();

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(fullOirSchema),
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
    const result = validateOirStepData(stepIndex, formData);
    return result.errors;
  }, [getValues]);

  const markStepCompleted = useCallback((stepIndex) => {
    setCompletedSections((prev) => new Set(prev).add(stepIndex));
  }, []);

  const updateField = useCallback((fieldName, value) => {
    setValue(fieldName, value, { shouldDirty: true, shouldValidate: true });
  }, [setValue]);

  const resetForm = useCallback(() => {
    reset(getEmptyOirData(), { keepDirty: false });
    setCompletedSections(new Set());
    setCurrentDraft(null);
    sessionStorage.removeItem('oir-temp-state');
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
    <OirFormContext.Provider value={contextValue}>
      <FormProvider {...methods}>{children}</FormProvider>
    </OirFormContext.Provider>
  );
};
