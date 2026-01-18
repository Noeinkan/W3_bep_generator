import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import CONFIG from '../../../../config/bepConfig';

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

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg flex-shrink-0">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 font-medium">
            {isLastStep ? 'Ready for preview' : `Step ${currentStep + 1} of ${totalSteps}`}
          </span>

          <button
            onClick={onNext}
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
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
