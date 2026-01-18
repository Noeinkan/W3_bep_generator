import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBepStepRoute, getBepPreviewRoute } from '../constants/routes';

/**
 * Hook to manage BEP form step navigation
 * @param {Object} options - Configuration options
 * @param {number} options.currentStep - Current step index
 * @param {number} options.totalSteps - Total number of steps
 * @param {Function} options.getDocumentSlug - Function to get current document slug
 * @param {Function} options.validateStep - Function to validate a step
 * @param {Function} options.markStepCompleted - Function to mark step as completed
 * @returns {Object} Navigation state and handlers
 */
const useStepNavigation = ({
  currentStep,
  totalSteps,
  getDocumentSlug,
  validateStep,
  markStepCompleted,
}) => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const navigateToStep = useCallback((stepIndex) => {
    const docSlug = getDocumentSlug();
    setIsTransitioning(true);

    requestAnimationFrame(() => {
      navigate(getBepStepRoute(docSlug, stepIndex));
      setTimeout(() => setIsTransitioning(false), 150);
    });
  }, [getDocumentSlug, navigate]);

  const handleNext = useCallback(() => {
    // Validate current step (except on last step)
    if (!isLastStep) {
      const stepErrors = validateStep(currentStep);
      if (Object.keys(stepErrors).length > 0) {
        return false;
      }
    }

    // Mark current step as completed
    markStepCompleted(currentStep);

    if (isLastStep) {
      // Navigate to preview
      navigate(getBepPreviewRoute(getDocumentSlug()));
    } else {
      navigateToStep(currentStep + 1);
    }
    return true;
  }, [currentStep, isLastStep, validateStep, markStepCompleted, navigate, getDocumentSlug, navigateToStep]);

  const handlePrevious = useCallback(() => {
    if (!isFirstStep) {
      navigateToStep(currentStep - 1);
    }
  }, [currentStep, isFirstStep, navigateToStep]);

  const handlePreview = useCallback(() => {
    navigate(getBepPreviewRoute(getDocumentSlug()));
  }, [navigate, getDocumentSlug]);

  const handleStepClick = useCallback((stepIndex) => {
    navigateToStep(stepIndex);
  }, [navigateToStep]);

  return {
    isTransitioning,
    isLastStep,
    isFirstStep,
    handleNext,
    handlePrevious,
    handlePreview,
    handleStepClick,
  };
};

export default useStepNavigation;
