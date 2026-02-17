import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft, Eye, Save, ChevronDown } from 'lucide-react';
import CONFIG from '../../../../config/bepConfig';
import useOutsideClick from '../../../../hooks/useOutsideClick';
import { cn } from '../../../../utils/cn';
import { bepUi } from '../bepUiClasses';

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
    <div
      className={cn(
        bepUi.header,
        'sticky top-0 z-10 px-6 py-4 rounded-none border-x-0 border-t-0 border-b border-ui-border shadow-card'
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left side: Title and progress */}
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-lg font-semibold text-ui-text">
              {CONFIG.steps[currentStep]?.title}
            </h2>
            <p className="text-sm text-ui-text-muted">
              {isLastStep ? 'Ready for preview' : `Step ${currentStep + 1} of ${totalSteps}`}
            </p>
          </div>
          {/* Progress indicator */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-32 bg-ui-muted rounded-full h-2">
              <div
                className="bg-ui-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-ui-text-soft font-medium">
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
            className={cn(bepUi.btnSecondary, 'px-3 py-2 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed')}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden xl:inline">Previous</span>
          </button>

          <button
            onClick={onNext}
            className={cn(bepUi.btnSecondary, 'px-3 py-2 rounded-md shadow-sm')}
          >
            <span className="hidden xl:inline">{isLastStep ? 'Preview' : 'Next'}</span>
            <ChevronRight className="w-4 h-4 xl:ml-1" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block w-px h-8 bg-ui-border mx-1" />

          {/* Save Dropdown */}
          <div className="relative" ref={saveDropdownRef}>
            <button
              onClick={onToggleSaveDropdown}
              disabled={savingDraft || !user}
              className={cn(
                bepUi.btnSecondary,
                'px-3 py-2 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              title="Save Options"
            >
              <Save className="w-4 h-4" />
              <span className="hidden lg:inline ml-2">
                {savingDraft ? 'Saving...' : 'Save'}
              </span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            {showSaveDropdown && (
              <div className={cn(bepUi.panel, 'absolute right-0 mt-1 w-40 py-1 z-50 shadow-card')}>
                <button
                  onClick={() => {
                    onCloseSaveDropdown();
                    onSave();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-ui-text-muted hover:bg-ui-muted flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={onSaveAs}
                  className="w-full text-left px-4 py-2 text-sm text-ui-text-muted hover:bg-ui-muted flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save As...
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onPreview}
            className={cn(bepUi.btnPrimary, 'px-3 py-2 rounded-md shadow-sm')}
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
