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
 *
 * Optional EIR authoring: when eirAiSuggestFieldNames (array) and onEirSuggest (fn) are passed,
 * fields whose name is in the array get an "Ask AI" button that calls onEirSuggest(fieldName, fieldLabel).
 */
const FormStepRHF = ({
  stepIndex,
  bepType,
  stepConfig: stepConfigProp,
  eirAiSuggestFieldNames,
  onEirSuggest,
}) => {
  const { formState: { errors } } = useFormContext();
  const fullWidthTypes = useMemo(() => getFullWidthFieldTypes(), []);
  const { snippetMap } = useSnippets();

  const stepConfig = stepConfigProp ?? (bepType ? CONFIG.getFormFields(bepType, stepIndex) : null);
  const showEirAi = Array.isArray(eirAiSuggestFieldNames) && eirAiSuggestFieldNames.length > 0 && typeof onEirSuggest === 'function';

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
          const hasEirAi = showEirAi && field.name && eirAiSuggestFieldNames.includes(field.name);

          return (
            <div
              key={field.name || `${stepConfig.number}-${idx}`}
              className={
                isAppendicesStep ? 'md:col-span-3' :
                THREE_COLUMN_FIELD_TYPES.includes(field.type) ? 'md:col-span-3' :
                fullWidthTypes.includes(field.type) ? 'md:col-span-2' : ''
              }
            >
              {hasEirAi ? (
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <InputFieldRHF
                      field={resolvedField}
                      error={fieldError?.message || ''}
                    />
                  </div>
                  <EirAskAiButton
                    fieldName={field.name}
                    fieldLabel={resolvedField.label || field.name}
                    onSuggest={onEirSuggest}
                  />
                </div>
              ) : (
                <InputFieldRHF
                  field={resolvedField}
                  error={fieldError?.message || ''}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Small "Ask AI" button for EIR authoring fields. Calls onSuggest(fieldName, fieldLabel) when clicked.
 */
function EirAskAiButton({ fieldName, fieldLabel, onSuggest }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSuggest(fieldName, fieldLabel);
    } catch (err) {
      setError(err?.message || 'Suggestion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shrink-0 flex flex-col items-end gap-0.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Ask AI for a suggestion"
      >
        {loading ? (
          <span className="inline-block w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <SparklesIcon className="w-3.5 h-3.5" />
            Ask AI
          </>
        )}
      </button>
      {error && (
        <span className="text-xs text-red-600 max-w-[120px] truncate" title={error}>{error}</span>
      )}
    </div>
  );
}

// Sparkles icon inline to avoid pulling lucide into FormStepRHF if not already (BEP uses it via CONFIG)
const SparklesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

export default FormStepRHF;
