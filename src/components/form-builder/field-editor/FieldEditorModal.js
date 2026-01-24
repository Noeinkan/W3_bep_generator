/**
 * FieldEditorModal Component
 *
 * Modal for adding or editing a field.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Plus, Settings } from 'lucide-react';
import FieldTypeSelector from './FieldTypeSelector';
import { getFieldType } from '../FieldTypeRegistry';

/**
 * FieldEditorModal
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Object|null} props.field - Field to edit (null for new field)
 * @param {string} props.stepId - Step ID to add field to
 * @param {number} props.nextOrderIndex - Next order index for new fields
 * @param {Function} props.onClose - Called when modal is closed
 * @param {Function} props.onSave - Called when field is saved
 */
export default function FieldEditorModal({
  isOpen,
  field,
  stepId,
  nextOrderIndex = 0,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    field_id: '',
    label: '',
    type: 'text',
    number: '',
    placeholder: '',
    is_required: false,
    config: {}
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isEditing = !!field;

  // Get field type definition
  const fieldTypeDef = useMemo(() => getFieldType(formData.type), [formData.type]);

  // Reset form when modal opens/closes or field changes
  useEffect(() => {
    if (isOpen) {
      if (field) {
        setFormData({
          field_id: field.field_id || '',
          label: field.label || '',
          type: field.type || 'text',
          number: field.number || '',
          placeholder: field.placeholder || '',
          is_required: field.is_required || false,
          config: field.config || {}
        });
      } else {
        setFormData({
          field_id: '',
          label: '',
          type: 'text',
          number: '',
          placeholder: '',
          is_required: false,
          config: {}
        });
      }
      setErrors({});
      setShowAdvanced(false);
    }
  }, [isOpen, field]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle type selection
  const handleTypeSelect = (type) => {
    const typeDef = getFieldType(type);
    setFormData(prev => ({
      ...prev,
      type,
      config: typeDef?.defaultConfig || {}
    }));
  };

  // Handle config change
  const handleConfigChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  // Generate field_id from label
  const generateFieldId = (label) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  };

  // Auto-generate field_id when label changes (only for new fields)
  useEffect(() => {
    if (!isEditing && formData.label && !formData.field_id) {
      setFormData(prev => ({
        ...prev,
        field_id: generateFieldId(prev.label)
      }));
    }
  }, [formData.label, isEditing]);

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.field_id.trim()) {
      newErrors.field_id = 'Field ID is required';
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.field_id)) {
      newErrors.field_id = 'Field ID must start with a letter and contain only letters, numbers, and underscores';
    }

    if (!formData.label.trim()) {
      newErrors.label = 'Label is required';
    }

    // Validate table columns if field type has columns
    if (fieldTypeDef?.hasColumns && (!formData.config.columns || formData.config.columns.length === 0)) {
      newErrors.columns = 'At least one column is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        step_id: stepId,
        order_index: isEditing ? field.order_index : nextOrderIndex,
        is_required: formData.is_required ? 1 : 0
      });
      onClose();
    } catch (error) {
      console.error('Error saving field:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Field' : 'Add New Field'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Field Type Selector (only for new fields) */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field Type <span className="text-red-500">*</span>
              </label>
              <FieldTypeSelector
                selectedType={formData.type}
                onSelect={handleTypeSelect}
                showUtility={true}
              />
            </div>
          )}

          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.label ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Project Name"
            />
            {errors.label && (
              <p className="text-red-500 text-sm mt-1">{errors.label}</p>
            )}
          </div>

          {/* Field Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Number
            </label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1.1, 2.3"
            />
          </div>

          {/* Required Toggle */}
          {fieldTypeDef?.isFormField !== false && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_required"
                name="is_required"
                checked={formData.is_required}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_required" className="ml-2 text-sm text-gray-700">
                Required field
              </label>
            </div>
          )}

          {/* Placeholder (if supported) */}
          {fieldTypeDef?.hasPlaceholder && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                name="placeholder"
                value={formData.placeholder}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Placeholder text..."
              />
            </div>
          )}

          {/* Table Columns (if field type has columns) */}
          {fieldTypeDef?.hasColumns && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Table Columns <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {(formData.config.columns || []).map((col, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={col}
                      onChange={(e) => {
                        const newColumns = [...(formData.config.columns || [])];
                        newColumns[index] = e.target.value;
                        handleConfigChange('columns', newColumns);
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Column ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newColumns = (formData.config.columns || []).filter((_, i) => i !== index);
                        handleConfigChange('columns', newColumns);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newColumns = [...(formData.config.columns || []), ''];
                    handleConfigChange('columns', newColumns);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Column
                </button>
              </div>
              {errors.columns && (
                <p className="text-red-500 text-sm mt-1">{errors.columns}</p>
              )}
            </div>
          )}

          {/* Advanced Settings Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <Settings className="w-4 h-4 mr-1" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </button>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              {/* Field ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="field_id"
                  value={formData.field_id}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                    errors.field_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., project_name"
                />
                {errors.field_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.field_id}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Used to store field data. Auto-generated from label.
                </p>
              </div>
            </div>
          )}

          {/* Error message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isEditing ? 'Save Changes' : 'Add Field'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
