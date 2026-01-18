
import React from 'react';
import OrgStructureChart from '../diagrams/diagram-components/OrgStructureChart';
import FieldHeader from '../base/FieldHeader';



const OrgStructureField = ({ value, onChange, field, intro, onIntroChange, formData, exportMode = false }) => {
  // Use value (organizationalStructure field) as the primary data source
  // Fall back to building from formData if needed for backward compatibility
  const chartData = value || formData?.organizationalStructure || {
    id: 'appointing_default',
    name: formData?.appointingParty || 'Appointing Party',
    role: 'Appointing Party',
    leadGroups: []
  };

  return (
    <div className="w-full" style={{ minWidth: 0, maxWidth: '100%' }}>
      <FieldHeader
        fieldName={field.name}
        label={field.label}
        number={field.number}
        required={field.required}
      />
      <OrgStructureChart data={chartData} onChange={onChange} editable={!exportMode} />
    </div>
  );
};

export default OrgStructureField;
