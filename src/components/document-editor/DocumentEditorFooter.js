import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { bepUi } from '../pages/bep/bepUiClasses';
import { cn } from '../../utils/cn';

/**
 * Shared document editor footer: Previous / Next (or custom next label e.g. "Preview").
 */
const DocumentEditorFooter = ({
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  nextLabel = 'Next',
}) => {
  const quietButtonClass = bepUi.btnQuiet || bepUi.btnSecondary;

  return (
    <div className={cn(bepUi.panel, 'border-t border-ui-border px-6 py-4 flex-shrink-0')}>
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className={cn(quietButtonClass, 'inline-flex items-center px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed')}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-ui-text-muted font-medium">
            {isLastStep ? 'Ready for preview' : `Step ${currentStep + 1} of ${totalSteps}`}
          </span>

          <button
            onClick={onNext}
            className={cn(bepUi.btnPrimary, 'inline-flex items-center px-6 py-3 rounded-lg')}
          >
            {nextLabel}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditorFooter;
