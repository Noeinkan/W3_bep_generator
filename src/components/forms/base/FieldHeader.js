import React from 'react';
import FieldHelpTooltip from '../controls/FieldHelpTooltip';
import { getHelpContent } from '../../../data/helpContent';
import { typography } from '../../../config/theme';

/**
 * Standardized field header component with label, number, required indicator, and help tooltip
 * Used across InputField and IntroTableField for consistency
 *
 * When asSectionHeader is true, renders with prominent section header styling
 */
const normalizeLabel = (label, fieldName, number) => {
  if (!label) return label;
  const trailingZeroFields = new Set(['projectDescription', 'deliveryApproach']);
  const isAffectedNumber = typeof number === 'string' && (number.startsWith('1.8') || number.startsWith('1.9'));
  if (trailingZeroFields.has(fieldName) || isAffectedNumber) {
    return label.replace(/[\s\u00A0]*0[\s\u00A0]*$/, '');
  }
  return label;
};

const FieldHeader = ({
  fieldName,
  label,
  number,
  required = false,
  htmlFor,
  asSectionHeader = false
}) => {
  const helpContent = getHelpContent(fieldName);
  const displayLabel = normalizeLabel(label, fieldName, number);
  const isRequired = Boolean(required);

  // Section header style (for subsections like 9.2.1, 9.2.2, etc.)
  if (asSectionHeader) {
    return (
      <div className={typography.sectionHeaderWrapper}>
        <div className="flex items-center gap-2">
          <h4 className={typography.sectionHeader}>
            {number && <span className={typography.sectionHeaderNumber}>{number} </span>}
            {displayLabel}
            {isRequired && <span className={typography.required}>*</span>}
          </h4>
          {helpContent && (
            <FieldHelpTooltip fieldName={fieldName} helpContent={helpContent} />
          )}
        </div>
      </div>
    );
  }

  // Standard field header style
  return (
    <div className={typography.fieldLabelWrapper}>
      <label htmlFor={htmlFor} className={typography.fieldLabel}>
        {number && <span className={typography.fieldLabelNumber}>{number} </span>}
        {displayLabel}
        {isRequired && <span className={typography.required}>*</span>}
      </label>
      {helpContent && (
        <FieldHelpTooltip fieldName={fieldName} helpContent={helpContent} />
      )}
    </div>
  );
};

export default FieldHeader;
