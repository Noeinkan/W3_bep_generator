import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fullEirSchema, validateEirStepData, toPlainObject } from '../schemas/eirValidationSchemas';
import EMPTY_EIR_DATA from '../data/emptyEirData';

export const EirFormContext = createContext(null);

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
    resolver: async (values, context, options) => {
      const plain = toPlainObject(values);
      return zodResolver(fullEirSchema)(plain, context, options);
    },
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
    // Use shouldValidate: false to avoid triggering the resolver on programmatic updates.
    // Full validation still runs on submit and via validateStep/trigger when needed.
    setValue(fieldName, value, { shouldDirty: true, shouldValidate: false });
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
