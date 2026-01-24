/**
 * StepEditorModal Component
 *
 * Modal for adding or editing a step.
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

// Category options
const CATEGORIES = [
  { value: 'Commercial', label: 'Commercial', color: 'blue' },
  { value: 'Management', label: 'Management', color: 'green' },
  { value: 'Technical', label: 'Technical', color: 'purple' }
];

/**
 * StepEditorModal
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Object|null} props.step - Step to edit (null for new step)
 * @param {number} props.nextOrderIndex - Next order index for new steps
 * @param {Function} props.onClose - Called when modal is closed
 * @param {Function} props.onSave - Called when step is saved
 */
export default function StepEditorModal({
  isOpen,
  step,
  nextOrderIndex = 0,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    step_number: '',
    title: '',
    description: '',
    category: 'Management',
    bep_type: 'both'
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!step;

  // Reset form when modal opens/closes or step changes
  useEffect(() => {
    if (isOpen) {
      if (step) {
        setFormData({
          step_number: step.step_number || '',
          title: step.title || '',
          description: step.description || '',
          category: step.category || 'Management',
          bep_type: step.bep_type || 'both'
        });
      } else {
        setFormData({
          step_number: String(nextOrderIndex + 1),
          title: '',
          description: '',
          category: 'Management',
          bep_type: 'both'
        });
      }
      setErrors({});
    }
  }, [isOpen, step, nextOrderIndex]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.step_number.trim()) {
      newErrors.step_number = 'Step number is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
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
        order_index: isEditing ? step.order_index : nextOrderIndex
      });
      onClose();
    } catch (error) {
      console.error('Error saving step:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Step' : 'Add New Step'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Step Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Step Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="step_number"
              value={formData.step_number}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.step_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 1, 2, 3..."
            />
            {errors.step_number && (
              <p className="text-red-500 text-sm mt-1">{errors.step_number}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Project Information"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Brief description of the step..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="flex space-x-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                    formData.category === cat.value
                      ? `border-${cat.color}-500 bg-${cat.color}-50 text-${cat.color}-700`
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                  style={{
                    borderColor: formData.category === cat.value
                      ? cat.color === 'blue' ? '#3b82f6'
                        : cat.color === 'green' ? '#22c55e'
                        : '#a855f7'
                      : undefined,
                    backgroundColor: formData.category === cat.value
                      ? cat.color === 'blue' ? '#eff6ff'
                        : cat.color === 'green' ? '#f0fdf4'
                        : '#faf5ff'
                      : undefined,
                    color: formData.category === cat.value
                      ? cat.color === 'blue' ? '#1d4ed8'
                        : cat.color === 'green' ? '#15803d'
                        : '#7e22ce'
                      : undefined
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* BEP Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Applies To
            </label>
            <select
              name="bep_type"
              value={formData.bep_type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="both">Both BEP Types</option>
              <option value="pre-appointment">Pre-Appointment Only</option>
              <option value="post-appointment">Post-Appointment Only</option>
            </select>
          </div>

          {/* Error message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50 rounded-b-xl">
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
                <span>{isEditing ? 'Save Changes' : 'Add Step'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
