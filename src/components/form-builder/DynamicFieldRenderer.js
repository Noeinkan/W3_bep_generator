/**
 * DynamicFieldRenderer
 *
 * Renders a field based on its type using the FieldTypeRegistry.
 * This component is used by the dynamic form builder to render fields
 * from the database configuration.
 */

import React, { Suspense, useMemo } from 'react';
import { getFieldType } from './FieldTypeRegistry';
import FieldHeader from '../forms/base/FieldHeader';
import CONFIG from '../../config/bepConfig';

// Loading spinner for lazy-loaded components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-500">Loading...</span>
  </div>
);

/**
 * DynamicFieldRenderer Component
 *
 * @param {Object} props
 * @param {Object} props.fieldConfig - Field configuration from database
 * @param {any} props.value - Current field value
 * @param {Function} props.onChange - Change handler (fieldName, newValue)
 * @param {string} props.error - Error message
 * @param {Object} props.formData - Complete form data (for dependent fields)
 */
const DynamicFieldRenderer = React.memo(({
  fieldConfig,
  value,
  onChange,
  error,
  formData = {}
}) => {
  // Extract field configuration
  const {
    field_id: name,
    label,
    number,
    type,
    is_required: required,
    placeholder,
    config
  } = fieldConfig;

  // Parse config if it's a string
  const parsedConfig = useMemo(() => {
    if (!config) return {};
    if (typeof config === 'string') {
      try {
        return JSON.parse(config);
      } catch {
        return {};
      }
    }
    return config;
  }, [config]);

  // Get field type definition from registry
  const fieldTypeDef = getFieldType(type);

  // Base classes for basic input types
  const baseClasses = "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  // Handle unknown field types
  if (!fieldTypeDef) {
    console.warn(`Unknown field type: ${type}`);
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700">Unknown field type: {type}</p>
      </div>
    );
  }

  // Build field object for components that expect the old format
  const field = {
    name,
    label,
    number,
    type,
    required: !!required,
    placeholder,
    rows: parsedConfig.rows,
    options: parsedConfig.options,
    columns: parsedConfig.columns,
    ...parsedConfig
  };

  // Render based on field type
  switch (type) {
    // ========================================
    // BASIC TYPES (inline rendering)
    // ========================================
    case 'text':
    case 'email':
    case 'number':
    case 'password':
      return (
        <div>
          <FieldHeader
            fieldName={name}
            label={label}
            number={number}
            required={required}
            htmlFor={name}
          />
          <input
            id={name}
            aria-required={required}
            type={type === 'text' ? 'text' : type}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            className={baseClasses}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case 'select': {
      // Get options from config or CONFIG.options reference
      let optionsList = parsedConfig.options;
      if (typeof optionsList === 'string' && CONFIG.options[optionsList]) {
        optionsList = CONFIG.options[optionsList];
      }

      return (
        <div>
          <FieldHeader
            fieldName={name}
            label={label}
            number={number}
            required={required}
            htmlFor={name}
          />
          <select
            id={name}
            aria-required={required}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            className={baseClasses}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {Array.isArray(optionsList) && optionsList.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    case 'section-header':
      return (
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-900 border-b-2 border-gray-300 pb-2">
            {number && <span className="text-blue-600">{number} </span>}
            {label}
          </h4>
        </div>
      );

    // ========================================
    // TEXTAREA (TipTapEditor)
    // ========================================
    case 'textarea': {
      const TipTapEditor = fieldTypeDef.component;
      return (
        <div>
          <FieldHeader
            fieldName={name}
            label={label}
            number={number}
            required={required}
            htmlFor={name}
          />
          <Suspense fallback={<LoadingSpinner />}>
            <TipTapEditor
              id={name}
              aria-required={required}
              value={value || ''}
              onChange={(newValue) => onChange(name, newValue)}
              placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
              minHeight={`${(parsedConfig.rows || 3) * 24}px`}
              autoSaveKey={`tiptap-${name}`}
              fieldName={name}
            />
          </Suspense>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    // ========================================
    // COMPONENT-BASED TYPES
    // ========================================
    default: {
      const Component = fieldTypeDef.component;

      // If no component defined, fall back to text input
      if (!Component) {
        return (
          <div>
            <FieldHeader
              fieldName={name}
              label={label}
              number={number}
              required={required}
              htmlFor={name}
            />
            <input
              id={name}
              aria-required={required}
              type="text"
              value={value || ''}
              onChange={(e) => onChange(name, e.target.value)}
              className={baseClasses}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      }

      // Special handling for orgchart to sync related fields
      if (type === 'orgchart') {
        return (
          <div data-field-name={name} data-component-type="orgchart">
            <Suspense fallback={<LoadingSpinner />}>
              <Component
                field={field}
                value={value}
                onChange={(v) => {
                  if (v && typeof v === 'object') {
                    const treeData = v.tree || v;
                    onChange(name, treeData);

                    if (v.leadAppointedParty !== undefined) {
                      onChange('leadAppointedParty', v.leadAppointedParty);
                    }
                    if (v.finalizedParties !== undefined) {
                      onChange('finalizedParties', v.finalizedParties);
                    }
                  } else {
                    onChange(name, v);
                  }
                }}
                formData={formData}
              />
            </Suspense>
          </div>
        );
      }

      // Special handling for orgstructure-data-table (read-only)
      if (type === 'orgstructure-data-table') {
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Component
              field={field}
              value={value}
              formData={formData}
            />
          </Suspense>
        );
      }

      // Wrap diagram types with data attributes
      if (['fileStructure', 'cdeDiagram', 'mindmap', 'naming-conventions', 'federation-strategy'].includes(type)) {
        return (
          <div data-field-name={name} data-component-type={type}>
            <Suspense fallback={<LoadingSpinner />}>
              <Component
                field={field}
                value={value}
                onChange={onChange}
                error={error}
              />
            </Suspense>
          </div>
        );
      }

      // Standard component rendering
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <Component
            field={field}
            value={value}
            onChange={onChange}
            error={error}
            formData={formData}
          />
        </Suspense>
      );
    }
  }
});

DynamicFieldRenderer.displayName = 'DynamicFieldRenderer';

export default DynamicFieldRenderer;
