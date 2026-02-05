/**
 * DynamicFormStepRHF
 *
 * A form step component that loads fields from the database via FormBuilderContext.
 * Supports both view mode (form rendering) and edit mode (field structure editing).
 */

import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormBuilder } from './FormBuilderContext';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { FieldStructureEditor } from './field-editor';
import { getFullWidthFieldTypes } from './FieldTypeRegistry';

// Field types that should span 3 columns (landscape tables)
const THREE_COLUMN_FIELD_TYPES = ['standardsTable'];

/**
 * DynamicFormStepRHF Component
 *
 * @param {Object} props
 * @param {number} props.stepIndex - Current step index (0-based)
 */
const DynamicFormStepRHF = ({ stepIndex }) => {
  const { watch, setValue, formState: { errors } } = useFormContext();

  const {
    visibleSteps,
    getVisibleFieldsForStep,
    isEditMode,
    exitEditMode,
    isLoading,
    error
  } = useFormBuilder();

  // Get the current step
  const currentStep = visibleSteps[stepIndex];

  // Get fields for current step
  const fields = useMemo(() => {
    if (!currentStep) return [];
    return getVisibleFieldsForStep(currentStep.id);
  }, [currentStep, getVisibleFieldsForStep]);

  // Get full-width field types from registry
  const fullWidthTypes = useMemo(() => getFullWidthFieldTypes(), []);

  // Get form data for dependent fields
  const formData = watch();

  // Handle field change
  const handleFieldChange = (fieldName, value) => {
    setValue(fieldName, value, { shouldDirty: true, shouldTouch: true });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Error Loading Form</h3>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // No step found
  if (!currentStep) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">No configuration found for step {stepIndex + 1}</p>
        </div>
      </div>
    );
  }

  // Edit mode - show field structure editor
  if (isEditMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {currentStep.step_number}. {currentStep.title}
          </h3>
          <button
            onClick={exitEditMode}
            className="px-3 py-1 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-full text-sm font-medium cursor-pointer transition-colors flex items-center gap-1"
            title="Click to exit edit mode"
          >
            Edit Mode ✕
          </button>
        </div>
        {currentStep.description && (
          <p className="text-gray-600">{currentStep.description}</p>
        )}
        <FieldStructureEditor stepId={currentStep.id} stepNumber={currentStep.step_number} />
      </div>
    );
  }

  // Determine grid layout based on step
  // Step 14 (index 13) uses 3-column layout for landscape A4 equivalent
  const isAppendicesStep = stepIndex === 13;
  const gridColsClass = isAppendicesStep ? 'md:grid-cols-3' : 'md:grid-cols-2';

  // View mode - render form fields
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        {currentStep.step_number}. {currentStep.title}
      </h3>
      {currentStep.description && (
        <p className="text-gray-600 text-sm">{currentStep.description}</p>
      )}

      <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
        {fields.map((fieldConfig, fieldIndex) => {
          // Get error for this field from React Hook Form
          const fieldError = errors[fieldConfig.field_id];
          const fieldValue = formData[fieldConfig.field_id];

          // Determine column span
          const isThreeColumn = THREE_COLUMN_FIELD_TYPES.includes(fieldConfig.type);
          const isFullWidth = fullWidthTypes.includes(fieldConfig.type);

          const colSpanClass = isAppendicesStep
            ? 'md:col-span-3'
            : isThreeColumn
              ? 'md:col-span-3'
              : isFullWidth
                ? 'md:col-span-2'
                : '';

          return (
            <div key={fieldConfig.id} className={colSpanClass}>
              <DynamicFieldRenderer
                fieldConfig={fieldConfig}
                value={fieldValue}
                onChange={handleFieldChange}
                error={fieldError?.message || ''}
                formData={formData}
                stepNumber={currentStep.step_number}
                fieldIndex={fieldIndex}
              />
            </div>
          );
        })}
      </div>

      {fields.length === 0 && (
        <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No fields configured for this step.</p>
          <p className="text-sm text-gray-400 mt-1">
            Click the settings icon in the sidebar to add fields.
          </p>
        </div>
      )}
    </div>
  );
};

export default DynamicFormStepRHF;
