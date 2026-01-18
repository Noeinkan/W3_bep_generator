import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft, Eye, Save, ChevronDown } from 'lucide-react';
import CONFIG from '../../../../config/bepConfig';
import useOutsideClick from '../../../../hooks/useOutsideClick';

/**
 * BEP Form header component with navigation and save controls
 * @param {Object} props
 * @param {number} props.currentStep - Current step index
 * @param {boolean} props.isFirstStep - Whether on first step
 * @param {boolean} props.isLastStep - Whether on last step
 * @param {Function} props.onNext - Handler for next button
 * @param {Function} props.onPrevious - Handler for previous button
 * @param {Function} props.onPreview - Handler for preview button
 * @param {Function} props.onSave - Handler for save button
 * @param {Function} props.onSaveAs - Handler for save as button
 * @param {boolean} props.showSaveDropdown - Whether save dropdown is open
 * @param {Function} props.onToggleSaveDropdown - Handler to toggle dropdown
 * @param {Function} props.onCloseSaveDropdown - Handler to close dropdown
 * @param {boolean} props.savingDraft - Whether draft is being saved
 * @param {Object} props.user - Current user object
 */
const BepHeader = ({
  currentStep,
  isFirstStep,
  isLastStep,
  onNext,
  onPrevious,
  onPreview,
  onSave,
  onSaveAs,
  showSaveDropdown,
  onToggleSaveDropdown,
  onCloseSaveDropdown,
  savingDraft,
  user,
}) => {
  const saveDropdownRef = useRef(null);
  const totalSteps = CONFIG.steps?.length || 0;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  useOutsideClick(saveDropdownRef, onCloseSaveDropdown, showSaveDropdown);

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-white to-gray-50 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left side: Title and progress */}
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {CONFIG.steps[currentStep]?.title}
            </h2>
            <p className="text-sm text-gray-600">
              {isLastStep ? 'Ready for preview' : `Step ${currentStep + 1} of ${totalSteps}`}
            </p>
          </div>
          {/* Progress indicator */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center space-x-2">
          {/* Navigation arrows */}
          <button
            onClick={onPrevious}
            disabled={isFirstStep}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden xl:inline">Previous</span>
          </button>

          <button
            onClick={onNext}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
          >
            <span className="hidden xl:inline">{isLastStep ? 'Preview' : 'Next'}</span>
            <ChevronRight className="w-4 h-4 xl:ml-1" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block w-px h-8 bg-gray-300 mx-1" />

          {/* Save Dropdown */}
          <div className="relative" ref={saveDropdownRef}>
            <button
              onClick={onToggleSaveDropdown}
              disabled={savingDraft || !user}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Save Options"
            >
              <Save className="w-4 h-4" />
              <span className="hidden lg:inline ml-2">
                {savingDraft ? 'Saving...' : 'Save'}
              </span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            {showSaveDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    onCloseSaveDropdown();
                    onSave();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={onSaveAs}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save As...
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onPreview}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md transition-all duration-200"
            title="Preview BEP"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden lg:inline ml-2">Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BepHeader;
