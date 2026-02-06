import React from 'react';
import FieldHeader from '../forms/base/FieldHeader';
import FieldError from '../forms/base/FieldError';

/**
 * FormField — composition wrapper that combines FieldHeader + input + FieldError.
 *
 * Eliminates the repeated pattern of:
 *   <div>
 *     <FieldHeader ... />
 *     <SomeInput ... />
 *     <FieldError error={error} />
 *   </div>
 *
 * @param {Object} props
 * @param {string} props.name - Field name (used for htmlFor and data attribute)
 * @param {string} props.label - Display label
 * @param {string} [props.number] - Field numbering prefix (e.g. "1.1")
 * @param {boolean} [props.required] - Whether the field is required
 * @param {string} [props.error] - Error message to display below the input
 * @param {boolean} [props.asSectionHeader] - Render as a section header instead
 * @param {string} [props.className] - Additional class names for the wrapper div
 * @param {React.ReactNode} props.children - The input/editor element(s)
 */
const FormField = ({
  name,
  label,
  number,
  required,
  error,
  asSectionHeader = false,
  className = '',
  children,
}) => {
  if (asSectionHeader) {
    return (
      <FieldHeader
        fieldName={name}
        label={label}
        number={number}
        required={required}
        asSectionHeader
      />
    );
  }

  return (
    <div className={className}>
      <FieldHeader
        fieldName={name}
        label={label}
        number={number}
        required={required}
        htmlFor={name}
      />
      {children}
      <FieldError error={error} />
    </div>
  );
};

export default FormField;
