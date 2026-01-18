import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useBepForm } from '../../../contexts/BepFormContext';
import FormStepRHF from '../../steps/FormStepRHF';
import CONFIG from '../../../config/bepConfig';
import { useTidpData } from '../../../hooks/useTidpData';
import { useMidpData } from '../../../hooks/useMidpData';
import { useAuth } from '../../../contexts/AuthContext';
import SaveDraftDialog from '../drafts/SaveDraftDialog';
import HiddenComponentsRenderer from '../../export/HiddenComponentsRenderer';
import useStepNavigation from '../../../hooks/useStepNavigation';
import useDraftSave from '../../../hooks/useDraftSave';
import { BepSidebar, BepHeader, BepFooter, SuccessToast } from './components';
import { ROUTES } from '../../../constants/routes';

/**
 * Main form view component for BEP Generator
 * Handles form step navigation and displays the current step
 */
const BepFormView = () => {
  const { slug, step: stepParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const contentRef = useRef(null);

  // Get form context
  const {
    bepType,
    completedSections,
    markStepCompleted,
    validateStep,
    currentDraft,
    setCurrentDraft,
    getFormData,
  } = useBepForm();

  // TIDP and MIDP data
  const { tidps } = useTidpData();
  const { midps } = useMidpData();

  const currentStep = parseInt(stepParam, 10) || 0;
  const totalSteps = CONFIG.steps?.length || 0;

  // Get current form data
  const formData = getFormData();

  // Helper function to create URL-safe document names
  const createDocumentSlug = useCallback((name) => {
    return encodeURIComponent(
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50) || 'untitled'
    );
  }, []);

  // Helper function to get current document slug
  const getDocumentSlug = useCallback(() => {
    if (currentDraft?.name) {
      return createDocumentSlug(currentDraft.name);
    }
    return slug || 'new-document';
  }, [currentDraft, createDocumentSlug, slug]);

  // Step navigation hook
  const {
    isTransitioning,
    isLastStep,
    isFirstStep,
    handleNext,
    handlePrevious,
    handlePreview,
    handleStepClick,
  } = useStepNavigation({
    currentStep,
    totalSteps,
    getDocumentSlug,
    validateStep,
    markStepCompleted,
  });

  // Draft save hook
  const {
    newDraftName,
    setNewDraftName,
    showSaveDraftDialog,
    showSuccessToast,
    existingDraftToOverwrite,
    showSaveDropdown,
    savingDraft,
    newDraftNameValidation,
    handleSaveDraft,
    handleSaveDraftConfirm,
    handleOverwriteDraft,
    handleSaveAsNewDraft,
    handleSaveDraftCancel,
    handleSaveAs,
    toggleSaveDropdown,
    closeSaveDropdown,
  } = useDraftSave({
    user,
    formData,
    bepType,
    currentDraft,
    setCurrentDraft,
    currentStep,
    createDocumentSlug,
  });

  // Scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Redirect if no BEP type selected
  if (!bepType) {
    navigate(ROUTES.BEP_GENERATOR);
    return null;
  }

  return (
    <div className="h-screen bg-gray-50 flex relative" data-page-uri={location.pathname}>
      {/* Sidebar */}
      <BepSidebar
        bepType={bepType}
        currentDraft={currentDraft}
        currentStep={currentStep}
        completedSections={completedSections}
        onStepClick={handleStepClick}
        validateStep={validateStep}
        tidpData={tidps}
        midpData={midps}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <BepHeader
          currentStep={currentStep}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onPreview={handlePreview}
          onSave={handleSaveDraft}
          onSaveAs={handleSaveAs}
          showSaveDropdown={showSaveDropdown}
          onToggleSaveDropdown={toggleSaveDropdown}
          onCloseSaveDropdown={closeSaveDropdown}
          savingDraft={savingDraft}
          user={user}
        />

        {/* Form Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-gray-50">
          <div className={`mx-auto px-6 py-8 ${currentStep === totalSteps - 1 ? 'max-w-[297mm]' : 'max-w-[210mm]'}`}>
            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-8 transition-all duration-300 ease-in-out ${
                isTransitioning ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'
              }`}
            >
              <FormStepRHF stepIndex={currentStep} bepType={bepType} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <BepFooter
          currentStep={currentStep}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>

      {/* Success Toast */}
      <SuccessToast show={showSuccessToast} />

      {/* Save Draft Dialog */}
      <SaveDraftDialog
        show={showSaveDraftDialog}
        newDraftName={newDraftName}
        isNewDraftNameValid={newDraftNameValidation.isValid}
        newDraftNameValidation={newDraftNameValidation}
        onNewDraftNameChange={setNewDraftName}
        onSave={handleSaveDraftConfirm}
        onCancel={handleSaveDraftCancel}
        existingDraft={existingDraftToOverwrite}
        onOverwrite={handleOverwriteDraft}
        onSaveAsNew={handleSaveAsNewDraft}
      />

      {/* Hidden components for PDF screenshot capture */}
      <HiddenComponentsRenderer formData={formData} bepType={bepType} />
    </div>
  );
};

export default BepFormView;
