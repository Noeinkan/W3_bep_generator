/**
 * StepCard Component
 *
 * Displays a single step in the sidebar with edit controls.
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
  ChevronRight
} from 'lucide-react';

// Category color mapping
const CATEGORY_COLORS = {
  Commercial: {
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-800',
    badge: 'bg-blue-500'
  },
  Management: {
    bg: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-800',
    badge: 'bg-green-500'
  },
  Technical: {
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-800',
    badge: 'bg-purple-500'
  }
};

/**
 * StepCard
 *
 * @param {Object} props
 * @param {Object} props.step - Step data from database
 * @param {boolean} props.isSelected - Whether this step is currently selected
 * @param {boolean} props.isEditMode - Whether edit mode is active
 * @param {Function} props.onSelect - Called when step is clicked
 * @param {Function} props.onEdit - Called when edit button is clicked
 * @param {Function} props.onDelete - Called when delete button is clicked
 * @param {Function} props.onToggleVisibility - Called when visibility is toggled
 */
export default function StepCard({
  step,
  isSelected = false,
  isEditMode = false,
  onSelect,
  onEdit,
  onDelete,
  onToggleVisibility
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
  } = useSortable({ id: step.id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  // Get category colors
  const colors = CATEGORY_COLORS[step.category] || CATEGORY_COLORS.Management;

  // Handle step click (only in non-edit mode)
  const handleClick = () => {
    if (!isEditMode && onSelect) {
      onSelect(step);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group rounded-lg border transition-all duration-200
        ${isEditMode ? 'cursor-default' : 'cursor-pointer'}
        ${isSelected ? `${colors.bg} ${colors.border} shadow-md` : 'bg-white border-gray-200 hover:border-gray-300'}
        ${isDragging ? 'z-50 shadow-lg' : ''}
        ${!step.is_visible ? 'opacity-50' : ''}
      `}
      onClick={handleClick}
    >
      <div className="flex items-center p-3">
        {/* Drag Handle (edit mode only) */}
        {isEditMode && (
          <div
            {...attributes}
            {...listeners}
            className="mr-2 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        )}

        {/* Step Number Badge */}
        <div className={`
          w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3
          ${colors.badge}
        `}>
          {step.step_number}
        </div>

        {/* Step Title */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium truncate ${isSelected ? colors.text : 'text-gray-700'}`}>
            {step.title}
          </h4>
          {isEditMode && step.description && (
            <p className="text-xs text-gray-500 truncate">{step.description}</p>
          )}
        </div>

        {/* Controls */}
        {isEditMode ? (
          <div className="flex items-center space-x-1 ml-2">
            {/* Visibility Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility?.(step.id);
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title={step.is_visible ? 'Hide step' : 'Show step'}
            >
              {step.is_visible ? (
                <Eye className="w-4 h-4 text-gray-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(step);
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Edit step"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(step.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Step
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Arrow indicator for selected (non-edit mode) */
          isSelected && (
            <ChevronRight className={`w-5 h-5 ${colors.text}`} />
          )
        )}
      </div>

      {/* Category indicator line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${colors.badge}`} />
    </div>
  );
}
