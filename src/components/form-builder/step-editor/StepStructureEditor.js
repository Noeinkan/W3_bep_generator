/**
 * StepStructureEditor Component
 *
 * Main component for editing the step structure.
 * Displays the draggable step list, add button, and hidden steps list.
 */

import React, { useState, useCallback } from 'react';
import { Plus, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useFormBuilder } from '../FormBuilderContext';
import StepListDraggable from './StepListDraggable';
import StepEditorModal from './StepEditorModal';

/**
 * StepStructureEditor
 *
 * @param {Object} props
 * @param {string} props.selectedStepId - Currently selected step ID
 * @param {Function} props.onSelectStep - Called when a step is selected
 */
export default function StepStructureEditor({
  selectedStepId,
  onSelectStep
}) {
  const {
    isEditMode,
    steps,
    visibleSteps,
    hiddenSteps,
    createStep,
    updateStep,
    deleteStep,
    reorderSteps,
    toggleStepVisibility,
    resetToDefault,
    hasCustomStructure
  } = useFormBuilder();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [showHiddenSteps, setShowHiddenSteps] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Handle add step
  const handleAddStep = useCallback(() => {
    setEditingStep(null);
    setIsModalOpen(true);
  }, []);

  // Handle edit step
  const handleEditStep = useCallback((step) => {
    setEditingStep(step);
    setIsModalOpen(true);
  }, []);

  // Handle save step
  const handleSaveStep = useCallback(async (stepData) => {
    if (editingStep) {
      await updateStep(editingStep.id, stepData);
    } else {
      await createStep(stepData);
    }
    setIsModalOpen(false);
  }, [editingStep, createStep, updateStep]);

  // Handle delete step
  const handleDeleteStep = useCallback(async (stepId) => {
    if (window.confirm('Are you sure you want to delete this step? All fields in this step will also be deleted.')) {
      await deleteStep(stepId);
    }
  }, [deleteStep]);

  // Handle reset to default
  const handleResetToDefault = useCallback(async () => {
    if (window.confirm('This will reset all steps and fields to the default ISO 19650 template. Any customizations will be lost. Continue?')) {
      setIsResetting(true);
      try {
        await resetToDefault();
      } finally {
        setIsResetting(false);
      }
    }
  }, [resetToDefault]);

  // Handle step selection
  const handleSelectStep = useCallback((step) => {
    onSelectStep?.(step);
  }, [onSelectStep]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        {isEditMode && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Structure Editor
            </span>
            {hasCustomStructure && (
              <button
                onClick={handleResetToDefault}
                disabled={isResetting}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                title="Reset to default template"
              >
                <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
                <span>Reset</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Step List */}
      <div className="flex-1 overflow-y-auto">
        <StepListDraggable
          steps={visibleSteps}
          selectedStepId={selectedStepId}
          isEditMode={isEditMode}
          onSelectStep={handleSelectStep}
          onEditStep={handleEditStep}
          onDeleteStep={handleDeleteStep}
          onToggleVisibility={toggleStepVisibility}
          onReorderSteps={reorderSteps}
        />

        {/* Hidden Steps */}
        {isEditMode && hiddenSteps.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowHiddenSteps(!showHiddenSteps)}
              className="flex items-center justify-between w-full text-sm text-gray-500 hover:text-gray-700"
            >
              <span>Hidden Steps ({hiddenSteps.length})</span>
              {showHiddenSteps ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showHiddenSteps && (
              <div className="mt-2 space-y-2">
                {hiddenSteps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                        {step.step_number}
                      </span>
                      <span className="text-sm text-gray-500">{step.title}</span>
                    </div>
                    <button
                      onClick={() => toggleStepVisibility(step.id)}
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
      </div>

      {/* Add Step Button (edit mode only) */}
      {isEditMode && (
        <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleAddStep}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Step</span>
          </button>
        </div>
      )}

      {/* Step Editor Modal */}
      <StepEditorModal
        isOpen={isModalOpen}
        step={editingStep}
        nextOrderIndex={steps.length}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStep}
      />
    </div>
  );
}
