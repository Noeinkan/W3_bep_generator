import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { bepUi } from '../pages/bep/bepUiClasses';
import { cn } from '../../utils/cn';

/**
 * Shared document editor header: step title, progress, optional back link, nav arrows, and custom actions.
 * @param {string} stepTitle - Current step/section title
 * @param {number} currentStep - 0-based step index
 * @param {number} totalSteps - Total number of steps
 * @param {boolean} isFirstStep
 * @param {boolean} isLastStep
 * @param {Function} onPrevious
 * @param {Function} onNext
 * @param {boolean} showProgressBar - Show percentage progress bar
 * @param {Function} [onBack] - Optional back navigation (e.g. to list)
 * @param {string} [backLabel] - Label for back button
 * @param {React.ReactNode} [headerActions] - Right-side actions (Save, Export PDF, Preview, etc.)
 * @param {string} [nextLabel] - Label for the Next button in header (e.g. "Next" or "Preview")
 */
const DocumentEditorHeader = ({
  stepTitle,
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  showProgressBar = true,
  onBack,
  backLabel = 'Back to list',
  headerActions,
  nextLabel = 'Next',
}) => {
  const progressPercent = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

  return (
    <div
      className={cn(
        bepUi.header,
        'sticky top-0 z-10 px-6 py-4 rounded-none border-x-0 border-t-0 border-b border-ui-border shadow-card bg-ui-surface'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-ui-text-muted hover:text-ui-text font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {backLabel}
              </button>
              <span className="text-ui-border">|</span>
            </>
          )}
          <div>
            <h2 className="text-lg font-semibold text-ui-text">{stepTitle}</h2>
            <p className="text-sm text-ui-text-muted">
              {isLastStep ? 'Ready for preview' : `Step ${currentStep + 1} of ${totalSteps}`}
            </p>
          </div>
          {showProgressBar && (
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-32 bg-ui-muted rounded-full h-2">
                <div
                  className="bg-ui-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs text-ui-text-soft font-medium">{progressPercent}%</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
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
            <span className="hidden xl:inline">{nextLabel}</span>
            <ChevronRight className="w-4 h-4 xl:ml-1" />
          </button>
          {headerActions != null && (
            <>
              <div className="hidden lg:block w-px h-8 bg-ui-border mx-1" />
              {headerActions}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentEditorHeader;
