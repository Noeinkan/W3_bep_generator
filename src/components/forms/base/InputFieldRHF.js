import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import InputField from './InputField';

/**
 * Wrapper around InputField that integrates with React Hook Form
 * Uses Controller to manage the field value and validation
 */
const InputFieldRHF = ({ field, error }) => {
  const { control, watch, setValue } = useFormContext();

  // Only watch organizationalStructure for components that need it (orgchart and orgstructure-data-table)
  // Using getValues() for initial render, watch() only for reactive updates of specific fields
  const needsOrgStructure = field?.type === 'orgchart' || field?.type === 'orgstructure-data-table';
  const organizationalStructure = watch('organizationalStructure', undefined, { disabled: !needsOrgStructure });

  // Build minimal formData object only when needed
  const formData = React.useMemo(() => {
    if (!needsOrgStructure) return {};
    return { organizationalStructure };
  }, [needsOrgStructure, organizationalStructure]);

  // Safety check: if field doesn't have a name, only allow section-header type
  if (!field) {
    console.warn('InputFieldRHF: field is missing', field);
    return null;
  }

  // Section headers don't need a name (they're not form fields)
  if (!field.name && field.type !== 'section-header') {
    console.warn('InputFieldRHF: field.name is missing for non-section-header field', field);
    return null;
  }

  // Section headers don't need form control - render directly
  if (field.type === 'section-header') {
    return (
      <InputField
        field={field}
        value=""
        onChange={() => {}}
        error=""
        formData={{}}
      />
    );
  }

  // Determine default value based on field type
  const getDefaultValue = () => {
    if (field.type === 'checkbox') return [];
    if (field.type === 'table' || field.type === 'introTable') return [];
    if (field.type === 'orgchart') {
      return {
        id: 'appointing_default',
        name: 'Appointing Party',
        role: 'Appointing Party',
        leadGroups: []
      };
    }
    return '';
  };

  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={getDefaultValue()}
      render={({ field: { value, onChange: rhfOnChange } }) => {
        // Create onChange handler that works with both signatures
        // and supports updating multiple fields (for orgchart)
        const handleChange = (fieldNameOrValue, fieldValue) => {
          // If called with two arguments (fieldName, value)
          if (fieldValue !== undefined) {
            // Use setValue to update a different field
            setValue(fieldNameOrValue, fieldValue, { shouldDirty: true, shouldValidate: true });
          } else {
            // Single argument - update the current field
            rhfOnChange(fieldNameOrValue);
          }
        };

        return (
          <InputField
            field={field}
            value={value}
            onChange={handleChange}
            error={error}
            formData={formData}
          />
        );
      }}
    />
  );
};

export default InputFieldRHF;
