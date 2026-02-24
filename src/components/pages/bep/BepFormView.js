import { useCallback, useEffect, useRef, useContext } from 'react';
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
import { useDocumentHistory } from '../../../hooks/useDocumentHistory';
import { BepSidebar, BepHeader, BepFooter, SuccessToast } from './components';
import { cn } from '../../../utils/cn';
import { ROUTES } from '../../../constants/routes';
import { EirStepWrapper } from '../../eir';
import { bepUi } from './bepUiClasses';

/**
 * Decides between static (FormStepRHF) and dynamic (DynamicFormStepRHF) step renderers
 * depending on whether a FormBuilderContext is active.
 */
const FormStepRenderer = ({ stepIndex, bepType }) => {
  const formBuilderContext = useContext(FormBuilderContext);
  if (formBuilderContext) {
    return <DynamicFormStepRHF stepIndex={stepIndex} />;
  }
  return <FormStepRHF stepIndex={stepIndex} bepType={bepType} />;
};

/**
 * Editor shell: sidebar + header + scrollable step content + footer.
 * All domain logic lives in hooks; this component is pure layout.
 */
const BepFormViewContent = () => {
  const { slug, step: stepParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const contentRef = useRef(null);

  const {
    bepType,
    completedSections,
    markStepCompleted,
    validateStep,
    currentDraft,
    setCurrentDraft,
    getFormData,
  } = useBepForm();

  const { documentHistory, handleDocumentHistorySave } = useDocumentHistory({ currentDraft, setCurrentDraft });

  const formBuilderContext = useContext(FormBuilderContext);
  const isDynamicMode = formBuilderContext !== null;

  const { tidps } = useTidpData();
  const { midps } = useMidpData();

  const currentStep = parseInt(stepParam, 10) || 0;

  const totalSteps = isDynamicMode
    ? formBuilderContext.visibleSteps?.length || CONFIG.steps?.length || 0
    : CONFIG.steps?.length || 0;

  const formData = getFormData();

  const createDocumentSlug = useCallback((name) => {
    return encodeURIComponent(
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50) || 'untitled'
    );
  }, []);

  const getDocumentSlug = useCallback(() => {
    if (currentDraft?.name) {
      return createDocumentSlug(currentDraft.name);
    }
    return slug || 'new-document';
  }, [currentDraft, createDocumentSlug, slug]);

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

  if (!bepType) {
    navigate(ROUTES.BEP_GENERATOR);
    return null;
  }

  return (
    <div className={cn('h-screen flex relative', bepUi.shell)} data-page-uri={location.pathname}>
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
        documentHistory={documentHistory}
        onDocumentHistorySave={handleDocumentHistorySave}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
        <div ref={contentRef} className={cn('flex-1', bepUi.contentScroll, 'bg-ui-canvas')}>
          <div className={`mx-auto px-6 py-8 ${currentStep === totalSteps - 1 ? 'max-w-[327mm]' : 'max-w-[231mm]'}`}>
            <div
              className={cn(
                bepUi.panel,
                'bg-ui-surface border border-ui-border rounded-xl shadow-sm p-8 transition-all duration-300 ease-in-out',
                isTransitioning ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'
              )}
            >
              <FormStepRenderer stepIndex={currentStep} bepType={bepType} />
            </div>
          </div>
        </div>

        <BepFooter
          currentStep={currentStep}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>

      <SuccessToast show={showSuccessToast} />

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
 * Root BEP form view.
 * Wraps the editor in FormBuilderProvider (dynamic mode) and EirStepWrapper (EIR pre-step).
 */
const BepFormView = () => {
  const { bepType, currentDraft } = useBepForm();
  const draftId = currentDraft?.id || null;

  return (
    <FormBuilderProvider draftId={draftId} bepType={bepType}>
      <EirStepWrapper>
        <BepFormViewContent />
      </EirStepWrapper>
    </FormBuilderProvider>
  );
};

export default BepFormView;
