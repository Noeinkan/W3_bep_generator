import React, { useEffect, useState } from 'react';
import FieldHelpTooltip from '../controls/FieldHelpTooltip';
import { getHelpContent } from '../../../data/helpContent';

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
  className = "block text-sm font-medium mb-2",
  htmlFor,
  asSectionHeader = false
}) => {
  const [helpContent, setHelpContent] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!fieldName) {
      setHelpContent(null);
      return () => {
        isMounted = false;
      };
    }

    getHelpContent(fieldName)
      .then((content) => {
        if (isMounted) {
          setHelpContent(content || null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHelpContent(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fieldName]);

  const displayLabel = normalizeLabel(label, fieldName, number);
  const isRequired = Boolean(required);

  // Section header style (for subsections like 9.2.1, 9.2.2, etc.)
  if (asSectionHeader) {
    return (
      <div className="border-b border-gray-200 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <h4 className="text-base font-semibold text-gray-900">
            {number && <span className="text-blue-600">{number} </span>}
            {displayLabel}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
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
    <div className="flex items-center gap-2 mb-2">
      <label htmlFor={htmlFor} className={className}>
        {number ? `${number} ` : ''}{displayLabel} {isRequired && <span className="text-red-500">*</span>}
      </label>
      {helpContent && (
        <FieldHelpTooltip fieldName={fieldName} helpContent={helpContent} />
      )}
    </div>
  );
};

export default FieldHeader;
