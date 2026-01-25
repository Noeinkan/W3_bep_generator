import { useCallback, useEffect, useRef, useContext, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useBepForm } from '../../../contexts/BepFormContext';
import FormStepRHF from '../../steps/FormStepRHF';
import { FormBuilderProvider, DynamicFormStepRHF, FormBuilderContext } from '../../form-builder';
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
import { EirProvider, useEir } from '../../../contexts/EirContext';
import { EirUploadStep, EirAnalysisView } from '../../eir';

/**
 * Inner component that renders the form content
 * This is separated to allow conditional use of dynamic mode
 */
const FormStepRenderer = ({ stepIndex, bepType }) => {
  // Check if we're in FormBuilder context (dynamic mode)
  const formBuilderContext = useContext(FormBuilderContext);

  if (formBuilderContext) {
    // Dynamic mode - use DynamicFormStepRHF
    return <DynamicFormStepRHF stepIndex={stepIndex} />;
  }

  // Static mode - use original FormStepRHF
  return <FormStepRHF stepIndex={stepIndex} bepType={bepType} />;
};

/**
 * Main form view content component
 * Handles form step navigation and displays the current step
 */
const BepFormViewContent = () => {
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

  // Check if FormBuilder context is available for dynamic step count
  const formBuilderContext = useContext(FormBuilderContext);
  const isDynamicMode = formBuilderContext !== null;

  // TIDP and MIDP data
  const { tidps } = useTidpData();
  const { midps } = useMidpData();

  const currentStep = parseInt(stepParam, 10) || 0;

  // Get total steps - from context if dynamic, from CONFIG if static
  const totalSteps = isDynamicMode
    ? formBuilderContext.visibleSteps?.length || CONFIG.steps?.length || 0
    : CONFIG.steps?.length || 0;

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
              <FormStepRenderer stepIndex={currentStep} bepType={bepType} />
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

/**
 * EIR Step Wrapper Component
 * Shows the EIR upload step before the main wizard if enabled
 */
const EirStepWrapper = ({ children }) => {
  const { step: stepParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { bepType, currentDraft } = useBepForm();
  const { setEirAnalysis, hasAnalysis, analysis, summary } = useEir();

  // Track if we're showing EIR step (step = -1 in URL or 'eir')
  const [showEirStep, setShowEirStep] = useState(false);
  const [showAnalysisView, setShowAnalysisView] = useState(false);

  // Check URL for EIR step
  useEffect(() => {
    if (stepParam === 'eir' || stepParam === '-1') {
      setShowEirStep(true);
    } else {
      setShowEirStep(false);
    }
  }, [stepParam]);

  // Handle analysis completion
  const handleAnalysisComplete = useCallback((data) => {
    setEirAnalysis(data);
    setShowAnalysisView(true);
  }, [setEirAnalysis]);

  // Handle using analysis in BEP
  const handleUseInBep = useCallback(() => {
    // Navigate to step 0 of the wizard
    const basePath = location.pathname.split('/step/')[0];
    navigate(`${basePath}/step/0`);
  }, [navigate, location.pathname]);

  // Handle skip EIR step
  const handleSkipEir = useCallback(() => {
    const basePath = location.pathname.split('/step/')[0];
    navigate(`${basePath}/step/0`);
  }, [navigate, location.pathname]);

  // If showing EIR step
  if (showEirStep) {
    return (
      <div className="h-screen bg-gray-50 flex">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                {showAnalysisView && hasAnalysis ? (
                  <EirAnalysisView
                    analysis={analysis}
                    summary={summary}
                    onUseInBep={handleUseInBep}
                    onReanalyze={() => setShowAnalysisView(false)}
                  />
                ) : (
                  <EirUploadStep
                    draftId={currentDraft?.id}
                    onAnalysisComplete={handleAnalysisComplete}
                    onSkip={handleSkipEir}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise render children (main wizard)
  return children;
};

/**
 * Main form view component for BEP Generator
 * Wraps the content with FormBuilderProvider and EirProvider for dynamic form building
 */
const BepFormView = () => {
  const { bepType } = useBepForm();
  const { currentDraft } = useBepForm();

  // Get project ID from current draft if available
  const projectId = currentDraft?.id || null;

  return (
    <EirProvider>
      <FormBuilderProvider projectId={projectId} bepType={bepType}>
        <EirStepWrapper>
          <BepFormViewContent />
        </EirStepWrapper>
      </FormBuilderProvider>
    </EirProvider>
  );
};

export default BepFormView;
