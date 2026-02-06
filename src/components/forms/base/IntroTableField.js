import React from 'react';
import TipTapEditor from '../editors/TipTapEditor';
import EditableTable from './EditableTable';
import FieldHeader from './FieldHeader';
import FieldError from './FieldError';

const IntroTableField = React.memo(({ field, value, onChange, error }) => {
  const { name, label, number, required, introPlaceholder, tableColumns } = field;

  // The value should be an object with 'intro' and 'table' properties
  const currentValue = value || { intro: '', table: [] };
  const introValue = currentValue.intro || '';
  const tableValue = currentValue.table || [];

  const handleIntroChange = (newIntro) => {
    onChange(name, {
      ...currentValue,
      intro: newIntro
    });
  };

  const handleTableChange = (_, newTable) => {
    onChange(name, {
      ...currentValue,
      table: newTable
    });
  };

  return (
    <div className="w-full">
      <FieldHeader 
        fieldName={name}
        label={label}
        number={number}
        required={required}
      />

      {/* Intro Text Editor */}
      <div className="mb-4 w-full">
        <TipTapEditor
          value={introValue}
          onChange={handleIntroChange}
          className="w-full"
          placeholder={introPlaceholder || 'Enter introductory text...'}
          minHeight="72px"
          autoSaveKey={`intro-table-${name}-intro`}
          fieldName={`${name}-intro`}
        />
      </div>

      {/* Table - The EditableTable component has its own mb-8 */}
      <EditableTable
        field={{
          name: `${name}-table`,
          label: '',
          columns: tableColumns
        }}
        value={tableValue}
        onChange={handleTableChange}
        error={null}
      />

      <FieldError error={error} />
    </div>
  );
});

export default IntroTableField;
