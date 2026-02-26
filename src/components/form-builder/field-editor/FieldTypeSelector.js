/**
 * FieldTypeSelector Component
 *
 * Grid of field types for selecting when adding a new field.
 */

import React, { useMemo } from 'react';
import { getFieldTypesByCategory } from '../FieldTypeRegistry';

// Category colors
const CATEGORY_COLORS = {
  basic: { bg: 'bg-blue-50', border: 'border-blue-200', hover: 'hover:border-blue-400' },
  table: { bg: 'bg-green-50', border: 'border-green-200', hover: 'hover:border-green-400' },
  specialized: { bg: 'bg-purple-50', border: 'border-purple-200', hover: 'hover:border-purple-400' },
  diagram: { bg: 'bg-orange-50', border: 'border-orange-200', hover: 'hover:border-orange-400' },
  utility: { bg: 'bg-gray-50', border: 'border-gray-200', hover: 'hover:border-gray-400' }
};

/**
 * FieldTypeSelector
 *
 * @param {Object} props
 * @param {string|null} props.selectedType - Currently selected type
 * @param {Function} props.onSelect - Called when a type is selected
 * @param {boolean} props.showUtility - Whether to show utility types like section-header
 */
export default function FieldTypeSelector({
  selectedType = null,
  onSelect,
  showUtility = false
}) {
  // Get field types grouped by category
  const fieldTypesByCategory = useMemo(() => {
    const grouped = getFieldTypesByCategory();

    // Optionally filter out utility types
    if (!showUtility && grouped.utility) {
      delete grouped.utility;
    }

    return grouped;
  }, [showUtility]);

  return (
    <div className="space-y-3">
      {Object.entries(fieldTypesByCategory).map(([categoryKey, category]) => (
        <div key={categoryKey}>
          {/* Category Header */}
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            {category.name}
          </h4>

          {/* Type Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {category.types.map((fieldType) => {
              const Icon = fieldType.icon;
              const colors = CATEGORY_COLORS[categoryKey];
              const isSelected = selectedType === fieldType.type;

              return (
                <button
                  key={fieldType.type}
                  type="button"
                  onClick={() => onSelect(fieldType.type)}
                  className={`
                    flex flex-col items-center p-2 rounded-lg border-2 transition-all duration-200
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : `${colors.border} ${colors.bg} ${colors.hover}`
                    }
                  `}
                >
                  {Icon && (
                    <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                  )}
                  <span className={`text-xs font-medium text-center ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {fieldType.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
