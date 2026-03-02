import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import InputFieldRHF from '../forms/base/InputFieldRHF';
import CONFIG from '../../config/bepConfig';
import { getFullWidthFieldTypes } from '../form-builder/FieldTypeRegistry';
import { useSnippets } from '../../hooks/useSnippets';
import { resolveSnippetsInField } from '../../utils/snippetUtils';

// Field types that should span all 3 columns
const THREE_COLUMN_FIELD_TYPES = ['standardsTable'];

/**
 * Form step component using React Hook Form
 * Renders fields for a specific step using the form context.
 * Full-width metadata is sourced from FieldTypeRegistry.
 * When stepConfig is passed (e.g. for EIR), it is used directly; otherwise CONFIG.getFormFields(bepType, stepIndex) is used (BEP).
 */
const FormStepRHF = ({ stepIndex, bepType, stepConfig: stepConfigProp }) => {
  const { formState: { errors } } = useFormContext();
  const fullWidthTypes = useMemo(() => getFullWidthFieldTypes(), []);
  const { snippetMap } = useSnippets();

  const stepConfig = stepConfigProp ?? (bepType ? CONFIG.getFormFields(bepType, stepIndex) : null);

  if (!stepConfig) {
    return <div>No configuration found for step {stepIndex}</div>;
  }

  if (!stepConfig.fields) {
    return <div>No fields configured for this step</div>;
  }

  // Determine grid layout: appendices (step 13 for BEP) or last step use 3 columns when desired; EIR step 5 is appendices
  const isAppendicesStep = stepIndex === 13 || stepIndex === 5;
  const gridColsClass = isAppendicesStep ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{stepConfig.number} {stepConfig.title}</h3>

      <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
        {stepConfig.fields.map((field, idx) => {
          const resolvedField = resolveSnippetsInField(field, snippetMap);
          const fieldError = field.name ? errors[field.name] : null;

          return (
            <div
              key={field.name || `${stepConfig.number}-${idx}`}
              className={
                isAppendicesStep ? 'md:col-span-3' :
                THREE_COLUMN_FIELD_TYPES.includes(field.type) ? 'md:col-span-3' :
                fullWidthTypes.includes(field.type) ? 'md:col-span-2' : ''
              }
            >
              <InputFieldRHF
                field={resolvedField}
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
