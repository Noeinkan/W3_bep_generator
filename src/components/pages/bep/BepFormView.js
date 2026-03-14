import { useCallback, useEffect, useRef, useContext, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Save, ChevronDown, Eye, Zap, FolderOpen, Upload, Sparkles, CheckCircle } from 'lucide-react';
import { useBepForm } from '../../../contexts/BepFormContext';
import FormStepRHF from '../../steps/FormStepRHF';
import { FormBuilderProvider, DynamicFormStepRHF, FormBuilderContext } from '../../form-builder';
import CONFIG from '../../../config/bepConfig';
import { useAuth } from '../../../contexts/AuthContext';
import { useProject } from '../../../contexts/ProjectContext';
import SaveDraftDialog from '../drafts/SaveDraftDialog';
import HiddenComponentsRenderer from '../../export/HiddenComponentsRenderer';
import useStepNavigation from '../../../hooks/useStepNavigation';
import useDraftSave from '../../../hooks/useDraftSave';
import { useDocumentHistory } from '../../../hooks/useDocumentHistory';
import { SuccessToast } from './components';
import DocumentStatusWidget from './components/DocumentStatusWidget';
import { DocumentEditorLayout, DocumentEditorSidebar, DocumentEditorHeader, DocumentEditorFooter } from '../../document-editor';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { cn } from '../../../utils/cn';
import { ROUTES } from '../../../constants/routes';
import { EirStepWrapper } from '../../eir';
import { bepUi } from './bepUiClasses';
import { useEir } from '../../../contexts/EirContext';
import apiService from '../../../services/apiService';

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

/** BEP header actions: Save dropdown + Preview. Used inside DocumentEditorHeader. */
const BepHeaderActions = ({
  onSave,
  onSaveAs,
  showSaveDropdown,
  onToggleSaveDropdown,
  onCloseSaveDropdown,
  savingDraft,
  user,
  onPreview,
}) => {
  const saveDropdownRef = useRef(null);
  useOutsideClick(saveDropdownRef, onCloseSaveDropdown, showSaveDropdown);

  return (
    <>
      <div className="relative" ref={saveDropdownRef}>
        <button
          type="button"
          onClick={onToggleSaveDropdown}
          disabled={savingDraft || !user}
          className={cn(
            bepUi.btnSecondary,
            'px-3 py-2 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="Save Options"
        >
          <Save className="w-4 h-4" />
          <span className="hidden lg:inline ml-2">{savingDraft ? 'Saving...' : 'Save'}</span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>
        {showSaveDropdown && (
          <div className={cn(bepUi.panel, 'absolute right-0 mt-1 w-40 py-1 z-50 shadow-card')}>
            <button
              type="button"
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
              type="button"
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
        type="button"
        onClick={onPreview}
        className={cn(bepUi.btnPrimary, 'px-3 py-2 rounded-md shadow-sm')}
        title="Preview BEP"
      >
        <Eye className="w-4 h-4" />
        <span className="hidden lg:inline ml-2">Preview</span>
      </button>
    </>
  );
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
  const { currentProject } = useProject();
  const contentRef = useRef(null);

  const {
    bepType,
    completedSections,
    markStepCompleted,
    validateStep,
    currentDraft,
    setCurrentDraft,
    getFormData,
    isInitialized,
    methods,
  } = useBepForm();

  const { documentHistory, handleDocumentHistorySave } = useDocumentHistory({ currentDraft, setCurrentDraft });

  const formBuilderContext = useContext(FormBuilderContext);
  const isDynamicMode = formBuilderContext !== null;

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
    projectId: currentProject?.id || null,
  });

  const { setEirAnalysis, clearEirAnalysis, hasAnalysis } = useEir();

  const [eirDrafts, setEirDrafts] = useState([]);
  const [eirDraftsLoading, setEirDraftsLoading] = useState(false);
  const [eirDraftsError, setEirDraftsError] = useState(null);
  const [loadingLinkedEir, setLoadingLinkedEir] = useState(false);

  const linkedEirId = formData?.linkedEirId || null;

  // Load authored EIR drafts for the current project (if any)
  useEffect(() => {
    if (!currentProject?.id) return;
    let cancelled = false;
    setEirDraftsLoading(true);
    setEirDraftsError(null);
    apiService
      .getEirDrafts(currentProject.id)
      .then((res) => {
        if (cancelled) return;
        if (res?.success && Array.isArray(res.drafts)) {
          setEirDrafts(res.drafts);
        } else {
          setEirDrafts([]);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load EIR drafts for BEP linking:', err);
        setEirDraftsError(err?.message || 'Failed to load EIR drafts');
        setEirDrafts([]);
      })
      .finally(() => {
        if (!cancelled) {
          setEirDraftsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentProject?.id]);

  const loadLinkedEirAnalysis = useCallback(
    async (eirId) => {
      if (!eirId) return;
      setLoadingLinkedEir(true);
      try {
        const res = await apiService.getEirDraftAnalysis(eirId);
        if (res?.success) {
          setEirAnalysis(res);
        }
      } catch (err) {
        console.error('Failed to load linked EIR analysis:', err);
      } finally {
        setLoadingLinkedEir(false);
      }
    },
    [setEirAnalysis]
  );

  // On mount / form load, if a linkedEirId exists but no analysis is present yet,
  // fetch the analysis from the authored EIR.
  useEffect(() => {
    if (linkedEirId && !hasAnalysis) {
      loadLinkedEirAnalysis(linkedEirId);
    }
  }, [linkedEirId, hasAnalysis, loadLinkedEirAnalysis]);

  // When EIR drafts are loaded and no EIR is linked yet, pre-select the project's published EIR if exactly one.
  useEffect(() => {
    if (eirDraftsLoading || eirDrafts.length === 0 || linkedEirId) return;
    const published = eirDrafts.filter((d) => d.status === 'published');
    if (published.length === 1) {
      const id = published[0].id;
      methods.setValue('linkedEirId', id, { shouldDirty: true });
      loadLinkedEirAnalysis(id);
    }
  }, [eirDraftsLoading, eirDrafts, linkedEirId, methods, loadLinkedEirAnalysis]);

  const handleChangeLinkedEir = useCallback(
    async (event) => {
      const value = event.target.value;
      const newId = value === '' ? null : value;
      methods.setValue('linkedEirId', newId, { shouldDirty: true });

      if (!newId) {
        clearEirAnalysis();
        return;
      }

      await loadLinkedEirAnalysis(newId);
    },
    [methods, clearEirAnalysis, loadLinkedEirAnalysis]
  );

  // Scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!bepType) {
    navigate(ROUTES.BEP_GENERATOR);
    return null;
  }

  const steps = isDynamicMode ? (formBuilderContext?.visibleSteps ?? CONFIG.steps) : CONFIG.steps;

  const goToEirStep = useCallback(() => {
    const basePath = location.pathname.split('/step/')[0];
    navigate(`${basePath}/step/eir`);
  }, [location.pathname, navigate]);

  const topBanner = currentProject?.id ? (
    <div className="px-6 pt-3">
      <div className="max-w-[231mm] mx-auto">
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-dashed border-amber-300 bg-amber-50/70">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <span className="font-medium text-amber-900">Linked EIR (authored):</span>
            {eirDraftsLoading ? (
              <span className="text-amber-700">Loading EIR drafts…</span>
            ) : eirDrafts.length === 0 ? (
              <span className="text-amber-700">No authored EIR documents for this project yet.</span>
            ) : (
              <select
                value={linkedEirId || ''}
                onChange={handleChangeLinkedEir}
                className="border border-amber-300 rounded-md px-2 py-1 bg-white text-amber-900 text-xs sm:text-sm"
              >
                <option value="">No EIR linked</option>
                {eirDrafts.map((d) => (
                  <option key={d.id} value={d.id}>{d.title || 'Untitled EIR'}</option>
                ))}
              </select>
            )}
            {eirDraftsError && <span className="text-red-600">{eirDraftsError}</span>}
          </div>
          {linkedEirId && (
            <span className="text-amber-800 text-xs">
              {loadingLinkedEir ? 'Loading analysis…' : hasAnalysis ? 'Analysis ready for suggestions & matrix' : 'Link set – analysis pending'}
            </span>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <DocumentEditorLayout
        contentRef={contentRef}
        dataPageUri={location.pathname}
        contentMaxWidth={currentStep === totalSteps - 1 ? 'max-w-[327mm]' : 'max-w-[231mm]'}
        isTransitioning={isTransitioning}
        sidebar={
          <DocumentEditorSidebar
            title="BEP Generator"
            subtitle={CONFIG.bepTypeDefinitions[bepType]?.title}
            documentName={currentDraft?.name}
            steps={steps}
            currentStep={currentStep}
            completedSections={completedSections}
            onStepClick={handleStepClick}
            validateStep={validateStep}
            categories={CONFIG.categories}
            sidebarIcon={Zap}
            children={
              <>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.BEP_DRAFTS)}
                  disabled={!user}
                  className={cn(bepUi.btnSecondary, 'w-full px-3 py-2 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed')}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Drafts
                </button>
                <button
                  type="button"
                  onClick={goToEirStep}
                  className={cn(
                    bepUi.btnBase,
                    'w-full mt-2 px-3 py-2 rounded-md shadow-sm',
                    hasAnalysis
                      ? 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      : 'border-violet-300 text-violet-700 bg-violet-50 hover:bg-violet-100'
                  )}
                >
                  {hasAnalysis ? (
                    <><CheckCircle className="w-4 h-4 mr-2" /> EIR Analyzed</>
                  ) : (
                    <><Upload className="w-4 h-4 mr-2" /> Upload EIR</>
                  )}
                </button>
                {hasAnalysis && (
                  <div className="mt-2 p-2 bg-violet-50 rounded-md border border-violet-200">
                    <div className="flex items-center gap-2 text-xs text-violet-700">
                      <Sparkles className="w-3 h-3" />
                      <span>AI suggestions active</span>
                    </div>
                  </div>
                )}
                {documentHistory && (
                  <div className="pt-2 border-b border-ui-border">
                    <DocumentStatusWidget
                      documentHistory={documentHistory}
                      onSave={handleDocumentHistorySave}
                    />
                  </div>
                )}
              </>
            }
          />
        }
        header={
          <DocumentEditorHeader
            stepTitle={CONFIG.steps[currentStep]?.title}
            currentStep={currentStep}
            totalSteps={totalSteps}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            onPrevious={handlePrevious}
            onNext={handleNext}
            showProgressBar
            headerActions={
              <BepHeaderActions
                onSave={handleSaveDraft}
                onSaveAs={handleSaveAs}
                showSaveDropdown={showSaveDropdown}
                onToggleSaveDropdown={toggleSaveDropdown}
                onCloseSaveDropdown={closeSaveDropdown}
                savingDraft={savingDraft}
                user={user}
                onPreview={handlePreview}
              />
            }
            nextLabel={isLastStep ? 'Preview' : 'Next'}
          />
        }
        footer={
          <DocumentEditorFooter
            currentStep={currentStep}
            totalSteps={totalSteps}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            onPrevious={handlePrevious}
            onNext={handleNext}
            nextLabel={isLastStep ? 'Preview' : 'Next'}
          />
        }
        topBanner={topBanner}
      >
        <FormStepRenderer stepIndex={currentStep} bepType={bepType} />
      </DocumentEditorLayout>

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

      <HiddenComponentsRenderer formData={formData} bepType={bepType} />
    </>
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
