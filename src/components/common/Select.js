import React from 'react';
import cn from '../../utils/cn';

/**
 * Shared Select component for consistent dropdown styling.
 *
 * Matches the styling of BaseTextInput for visual consistency.
 *
 * @param {Object} props
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.label] - Optional visible label text
 * @param {string} [props.value] - Current selected value
 * @param {Function} [props.onChange] - Change handler (receives event)
 * @param {Array<string|{value: string, label: string}>} [props.options] - Options list
 * @param {string} [props.placeholder] - Placeholder text for the empty option
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.required] - Whether the field is required
 * @param {boolean} [props.disabled] - Whether the field is disabled
 * @param {string} [props.className] - Additional class names for the select
 * @param {React.ReactNode} [props.children] - Custom option elements (alternative to options prop)
 */
const Select = React.forwardRef(({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required,
  disabled,
  className = '',
  children,
  ...rest
}, ref) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-required={required}
        className={cn(
          'w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          disabled && 'bg-gray-100 cursor-not-allowed',
          error && 'border-red-500',
          className
        )}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children || options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
