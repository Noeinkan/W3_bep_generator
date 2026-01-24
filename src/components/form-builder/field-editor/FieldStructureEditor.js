/**
 * FieldStructureEditor Component
 *
 * Main component for editing the field structure within a step.
 * Displays the draggable field list, add button, and hidden fields list.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useFormBuilder } from '../FormBuilderContext';
import FieldListDraggable from './FieldListDraggable';
import FieldEditorModal from './FieldEditorModal';

/**
 * FieldStructureEditor
 *
 * @param {Object} props
 * @param {string} props.stepId - Current step ID
 * @param {string} props.stepTitle - Current step title
 */
export default function FieldStructureEditor({
  stepId,
  stepTitle
}) {
  const {
    isEditMode,
    getVisibleFieldsForStep,
    getHiddenFieldsForStep,
    createField,
    updateField,
    deleteField,
    reorderFields,
    toggleFieldVisibility
  } = useFormBuilder();

  // Get fields for current step
  const visibleFields = useMemo(
    () => getVisibleFieldsForStep(stepId),
    [getVisibleFieldsForStep, stepId]
  );

  const hiddenFields = useMemo(
    () => getHiddenFieldsForStep(stepId),
    [getHiddenFieldsForStep, stepId]
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [showHiddenFields, setShowHiddenFields] = useState(false);

  // Handle add field
  const handleAddField = useCallback(() => {
    setEditingField(null);
    setIsModalOpen(true);
  }, []);

  // Handle edit field
  const handleEditField = useCallback((field) => {
    setEditingField(field);
    setIsModalOpen(true);
  }, []);

  // Handle save field
  const handleSaveField = useCallback(async (fieldData) => {
    if (editingField) {
      await updateField(editingField.id, fieldData);
    } else {
      await createField(fieldData);
    }
    setIsModalOpen(false);
  }, [editingField, createField, updateField]);

  // Handle delete field
  const handleDeleteField = useCallback(async (fieldId) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      await deleteField(fieldId);
    }
  }, [deleteField]);

  // Handle toggle required
  const handleToggleRequired = useCallback(async (fieldId) => {
    const field = visibleFields.find(f => f.id === fieldId);
    if (field) {
      await updateField(fieldId, { is_required: field.is_required ? 0 : 1 });
    }
  }, [visibleFields, updateField]);

  // Calculate next order index
  const nextOrderIndex = useMemo(() => {
    const allFields = [...visibleFields, ...hiddenFields];
    if (allFields.length === 0) return 0;
    return Math.max(...allFields.map(f => f.order_index || 0)) + 1;
  }, [visibleFields, hiddenFields]);

  if (!isEditMode) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Fields Editor</h3>
          <p className="text-xs text-gray-500">
            {stepTitle} • {visibleFields.length} visible field{visibleFields.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Field List */}
      <FieldListDraggable
        fields={visibleFields}
        isEditMode={isEditMode}
        onEditField={handleEditField}
        onDeleteField={handleDeleteField}
        onToggleVisibility={toggleFieldVisibility}
        onToggleRequired={handleToggleRequired}
        onReorderFields={reorderFields}
      />

      {/* Hidden Fields */}
      {hiddenFields.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowHiddenFields(!showHiddenFields)}
            className="flex items-center justify-between w-full text-sm text-gray-500 hover:text-gray-700"
          >
            <span>Hidden Fields ({hiddenFields.length})</span>
            {showHiddenFields ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showHiddenFields && (
            <div className="mt-2 space-y-2">
              {hiddenFields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-2">
                    {field.number && (
                      <span className="text-xs font-medium text-gray-400">{field.number}</span>
                    )}
                    <span className="text-sm text-gray-500">{field.label}</span>
                    <span className="text-xs text-gray-400">({field.type})</span>
                  </div>
                  <button
                    onClick={() => toggleFieldVisibility(field.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Field Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleAddField}
          className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Field</span>
        </button>
      </div>

      {/* Field Editor Modal */}
      <FieldEditorModal
        isOpen={isModalOpen}
        field={editingField}
        stepId={stepId}
        nextOrderIndex={nextOrderIndex}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveField}
      />
    </div>
  );
}
