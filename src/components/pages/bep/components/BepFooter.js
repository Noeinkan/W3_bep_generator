import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import CONFIG from '../../../../config/bepConfig';
import bepUi from '../bepUiClasses';

/**
 * BEP Form footer component with navigation buttons
 * @param {Object} props
 * @param {number} props.currentStep - Current step index
 * @param {boolean} props.isFirstStep - Whether on first step
 * @param {boolean} props.isLastStep - Whether on last step
 * @param {Function} props.onNext - Handler for next button
 * @param {Function} props.onPrevious - Handler for previous button
 */
const BepFooter = ({
  currentStep,
  isFirstStep,
  isLastStep,
  onNext,
  onPrevious,
}) => {
  const totalSteps = CONFIG.steps?.length || 0;
  const quietButtonClass = bepUi.btnQuiet || bepUi.btnSecondary;

  return (
    <div className={`${bepUi.panel} border-t border-ui-border px-6 py-4 flex-shrink-0`}>
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className={`${quietButtonClass} inline-flex items-center px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
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
            className={`${bepUi.btnPrimary} inline-flex items-center px-6 py-3 rounded-lg`}
          >
            {isLastStep ? 'Preview' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BepFooter;
