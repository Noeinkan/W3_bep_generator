import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import InputFieldRHF from '../forms/base/InputFieldRHF';
import CONFIG from '../../config/bepConfig';
import { getFullWidthFieldTypes } from '../form-builder/FieldTypeRegistry';

// Field types that should span all 3 columns
const THREE_COLUMN_FIELD_TYPES = ['standardsTable'];

/**
 * Form step component using React Hook Form
 * Renders fields for a specific step using the form context.
 * Full-width metadata is sourced from FieldTypeRegistry.
 */
const FormStepRHF = ({ stepIndex, bepType }) => {
  const { formState: { errors } } = useFormContext();
  const fullWidthTypes = useMemo(() => getFullWidthFieldTypes(), []);

  // Safety check - ensure we have the required props
  if (!bepType) {
    return <div>Loading...</div>;
  }

  const stepConfig = CONFIG.getFormFields(bepType, stepIndex);

  if (!stepConfig) {
    return <div>No configuration found for step {stepIndex}</div>;
  }

  if (!stepConfig.fields) {
    return <div>No fields configured for this step</div>;
  }

  // Determine grid layout based on step
  // Appendices step (13) uses 3-column layout for landscape A4 equivalent
  // All other steps use 2-column layout for portrait A4 equivalent
  const isAppendicesStep = stepIndex === 13;
  const gridColsClass = isAppendicesStep ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{stepConfig.number} {stepConfig.title}</h3>

      <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
        {stepConfig.fields.map(field => {
          // Get error for this field from React Hook Form
          const fieldError = errors[field.name];

          return (
            <div key={field.name} className={
              isAppendicesStep ? 'md:col-span-3' :
              THREE_COLUMN_FIELD_TYPES.includes(field.type) ? 'md:col-span-3' :
              fullWidthTypes.includes(field.type) ? 'md:col-span-2' : ''
            }>
              <InputFieldRHF
                field={field}
                error={fieldError?.message || ''}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormStepRHF;
