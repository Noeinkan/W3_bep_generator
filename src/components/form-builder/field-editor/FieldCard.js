/**
 * FieldCard Component
 *
 * Displays a single field in the field editor with controls.
 * Used in edit mode for reordering, editing, and visibility toggling.
 */

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  MoreVertical,
  CheckCircle,
  Circle
} from 'lucide-react';
import { getFieldType } from '../FieldTypeRegistry';

/**
 * FieldCard
 *
 * @param {Object} props
 * @param {Object} props.field - Field data from database
 * @param {boolean} props.isEditMode - Whether edit mode is active
 * @param {Function} props.onEdit - Called when edit button is clicked
 * @param {Function} props.onDelete - Called when delete button is clicked
 * @param {Function} props.onToggleVisibility - Called when visibility is toggled
 * @param {Function} props.onToggleRequired - Called when required is toggled
 * @param {boolean} props.isDragOverlay - Whether this is rendered in the drag overlay
 */
export default function FieldCard({
  field,
  isEditMode = false,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleRequired,
  isDragOverlay = false
}) {
  const [showMenu, setShowMenu] = useState(false);

  // Get sortable props for drag and drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id, disabled: !isEditMode });

  // Use Translate instead of Transform for smoother movement (avoids scale jitter)
  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 0 : 'auto'
  };

  // Get field type info from registry
  const fieldTypeDef = getFieldType(field.type);
  const TypeIcon = fieldTypeDef?.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group bg-white rounded-lg border transition-all duration-200
        ${isDragging ? 'z-50 shadow-lg border-blue-300' : 'border-gray-200 hover:border-gray-300'}
        ${!field.is_visible ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center p-3">
        {/* Drag Handle */}
        {isEditMode && (
          <div
            {...attributes}
            {...listeners}
            className="mr-2 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        )}

        {/* Field Number */}
        {field.number && (
          <span className="text-xs font-medium text-blue-600 mr-2 min-w-[2rem]">
            {field.number}
          </span>
        )}

        {/* Field Type Icon */}
        {TypeIcon && (
          <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center mr-2">
            <TypeIcon className="w-3.5 h-3.5 text-gray-500" />
          </div>
        )}

        {/* Field Label */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-700 truncate">
            {field.label}
          </h4>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>{fieldTypeDef?.label || field.type}</span>
            {field.config?.columns && (
              <span>• {field.config.columns.length} columns</span>
            )}
          </div>
        </div>

        {/* Controls */}
        {isEditMode && (
          <div className="flex items-center space-x-1 ml-2">
            {/* Visibility Toggle */}
            <button
              onClick={() => onToggleVisibility?.(field.id)}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title={field.is_visible ? 'Hide field' : 'Show field'}
            >
              {field.is_visible ? (
                <Eye className="w-4 h-4 text-gray-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {/* Required Toggle */}
            {fieldTypeDef?.isFormField !== false && (
              <button
                onClick={() => onToggleRequired?.(field.id)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title={field.is_required ? 'Make optional' : 'Make required'}
              >
                {field.is_required ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
              </button>
            )}

            {/* Edit Button */}
            <button
              onClick={() => onEdit?.(field)}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Edit field"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={() => {
                        onDelete?.(field.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Field
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Required indicator (non-edit mode) */}
        {!isEditMode && field.is_required && (
          <span className="text-xs font-medium text-red-500 ml-2">Required</span>
        )}
      </div>
    </div>
  );
}
