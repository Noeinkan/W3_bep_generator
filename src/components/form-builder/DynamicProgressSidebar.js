/**
 * DynamicProgressSidebar
 *
 * A progress sidebar that loads steps from the database via FormBuilderContext.
 * Supports both view mode (normal navigation) and edit mode (structure editing).
 */

import React from 'react';
import { CheckCircle, AlertCircle, Settings2 } from 'lucide-react';
import { useFormBuilder } from './FormBuilderContext';
import { StepStructureEditor } from './step-editor';
import * as LucideIcons from 'lucide-react';

/**
 * Get Lucide icon component by name
 */
const getIcon = (iconName) => {
  if (!iconName) return LucideIcons.FileText;
  const Icon = LucideIcons[iconName];
  return Icon || LucideIcons.FileText;
};

/**
 * Category color mapping
 */
const CATEGORY_COLORS = {
  Commercial: { bg: 'bg-blue-100 text-blue-800', border: 'border-blue-200' },
  Management: { bg: 'bg-green-100 text-green-800', border: 'border-green-200' },
  Technical: { bg: 'bg-purple-100 text-purple-800', border: 'border-purple-200' },
  default: { bg: 'bg-gray-100 text-gray-800', border: 'border-gray-200' }
};

/**
 * DynamicProgressSidebar Component
 *
 * @param {Object} props
 * @param {number} props.currentStep - Current step index (0-based)
 * @param {Set} props.completedSections - Set of completed step indices
 * @param {Function} props.onStepClick - Handler when step is clicked
 * @param {Function} props.validateStep - Function to validate a step
 * @param {Array} props.tidpData - TIDP data for status display
 * @param {Array} props.midpData - MIDP data for status display
 */
const DynamicProgressSidebar = React.memo(({
  currentStep,
  completedSections,
  onStepClick,
  validateStep,
  tidpData = [],
  midpData = []
}) => {
  const {
    visibleSteps,
    isEditMode,
    toggleEditMode,
    isLoading,
    error
  } = useFormBuilder();

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-red-500 text-sm">
          <p className="font-medium">Failed to load structure</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Edit mode - show structure editor
  if (isEditMode) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Structure</h2>
          <button
            onClick={toggleEditMode}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
        <StepStructureEditor />
      </div>
    );
  }

  // View mode - show progress sidebar
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Progress Overview</h2>
        <button
          onClick={toggleEditMode}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit form structure"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {visibleSteps.map((step, index) => {
          const isComplete = completedSections.has(index);
          const isValid = validateStep(index);
          const isCurrent = currentStep === index;
          const Icon = getIcon(step.icon);
          const categoryColors = CATEGORY_COLORS[step.category] || CATEGORY_COLORS.default;

          return (
            <div
              key={step.id}
              className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                ${isCurrent ? 'bg-blue-50 border border-blue-200' :
                  isComplete ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50 border border-transparent'}`}
              onClick={() => onStepClick(index)}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                ${isCurrent ? 'bg-blue-600 text-white' :
                  isComplete ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {isComplete ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  isCurrent ? 'text-blue-900' : isComplete ? 'text-green-900' : 'text-gray-900'
                }`}>
                  {step.step_number}. {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{step.description}</p>
                )}
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${categoryColors.bg}`}>
                  {step.category}
                </span>
              </div>
              {!isValid && !isCurrent && (
                <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 pt-4 border-t">
        <div className="text-sm text-gray-600 mb-2">
          BEP Completion: {Math.round((completedSections.size / visibleSteps.length) * 100)}%
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedSections.size / visibleSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* TIDP/MIDP Status */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-sm text-gray-600 mb-2">Information Delivery Status</div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">TIDPs Created:</span>
            <span className={`font-medium ${tidpData.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
              {tidpData.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">MIDPs Generated:</span>
            <span className={`font-medium ${midpData.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
              {midpData.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ISO 19650 Ready:</span>
            <span className={`font-medium ${tidpData.length > 0 && midpData.length > 0 ? 'text-green-600' : 'text-orange-500'}`}>
              {tidpData.length > 0 && midpData.length > 0 ? '✓' : '○'}
            </span>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-xs text-gray-500 space-y-1">
          {['Commercial', 'Management', 'Technical'].map(category => {
            const categorySteps = visibleSteps.filter(s => s.category === category);
            const completedCount = categorySteps.filter((_, i) => {
              const globalIndex = visibleSteps.findIndex(s => s.id === categorySteps[i]?.id);
              return completedSections.has(globalIndex);
            }).length;

            return (
              <div key={category} className="flex justify-between">
                <span>{category}:</span>
                <span>{completedCount}/{categorySteps.length}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

DynamicProgressSidebar.displayName = 'DynamicProgressSidebar';

export default DynamicProgressSidebar;
