import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, FileDown } from 'lucide-react';
import { EirFormProvider, useEirForm } from '../../../contexts/EirFormContext';
import EIR_CONFIG from '../../../config/eirConfig';
import FormStepRHF from '../../steps/FormStepRHF';
import apiService from '../../../services/apiService';
import toast from 'react-hot-toast';
import { DocumentEditorLayout, DocumentEditorSidebar, DocumentEditorHeader, DocumentEditorFooter } from '../../document-editor';
import { bepUi } from '../bep/bepUiClasses';

const EIR_STEPS = EIR_CONFIG.steps;
const TOTAL_STEPS = EIR_STEPS.length;

/**
 * EIR editor content — step navigation, sidebar, save. Must be inside EirFormProvider.
 */
const EirFormViewContent = ({ draftId, draftTitle }) => {
  const navigate = useNavigate();
  const { stepIndex: stepParam } = useParams();
  const contentRef = useRef(null);

  const {
    currentDraft,
    setCurrentDraft,
    getFormData,
    completedSections,
    validateStep,
    markStepCompleted,
  } = useEirForm();

  const currentStep = Math.min(Math.max(parseInt(stepParam, 10) || 0, 0), TOTAL_STEPS - 1);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  const stepConfig = EIR_CONFIG.getFormFields(currentStep);

  const navigateToStep = useCallback((step) => {
    const next = Math.min(Math.max(step, 0), TOTAL_STEPS - 1);
    navigate(`/eir-manager/${draftId}/edit/step/${next}`);
  }, [draftId, navigate]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (!isLastStep) {
      const errors = validateStep(currentStep);
      if (Object.keys(errors).length > 0) return;
      markStepCompleted(currentStep);
      navigateToStep(currentStep + 1);
    }
  }, [currentStep, isLastStep, validateStep, markStepCompleted, navigateToStep]);

  const handlePrevious = useCallback(() => {
    if (!isFirstStep) navigateToStep(currentStep - 1);
  }, [currentStep, isFirstStep, navigateToStep]);

  const handleStepClick = useCallback((step) => {
    navigateToStep(step);
  }, [navigateToStep]);

  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const data = getFormData();
      await apiService.updateEirDraft(draftId, { data });
      setCurrentDraft((prev) => (prev ? { ...prev, title: draftTitle } : { id: draftId, title: draftTitle }));
      toast.success('EIR saved');
    } catch (err) {
      toast.error(err?.message || 'Failed to save EIR');
    } finally {
      setSaving(false);
    }
  }, [draftId, draftTitle, getFormData, setCurrentDraft]);

  const handleExportPdf = useCallback(async () => {
    setExporting(true);
    try {
      const data = getFormData();
      const blob = await apiService.exportEirDocumentPdf(data, draftTitle);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EIR_${draftTitle.replace(/[^a-z0-9]+/gi, '_') || 'document'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch (err) {
      toast.error(err?.message || 'Failed to export PDF');
    } finally {
      setExporting(false);
    }
  }, [draftTitle, getFormData]);

  const headerActions = (
    <>
      <button
        type="button"
        onClick={handleExportPdf}
        disabled={exporting}
        className={`${bepUi.btnSecondary} inline-flex items-center gap-2 px-3 py-2 rounded-md shadow-sm disabled:opacity-50`}
      >
        <FileDown className="w-4 h-4" />
        {exporting ? 'Exporting…' : 'Export PDF'}
      </button>
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={`${bepUi.btnPrimary} inline-flex items-center gap-2 px-3 py-2 rounded-md shadow-sm disabled:opacity-50`}
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving…' : 'Save'}
      </button>
    </>
  );

  return (
    <DocumentEditorLayout
      contentRef={contentRef}
      dataPageUri={`/eir-manager/${draftId}/edit`}
      contentMaxWidth="max-w-[231mm]"
      sidebar={
        <DocumentEditorSidebar
          title="EIR"
          subtitle={`${TOTAL_STEPS} sections`}
          documentName={draftTitle || 'Untitled EIR'}
          steps={EIR_STEPS}
          currentStep={currentStep}
          completedSections={completedSections}
          onStepClick={handleStepClick}
          validateStep={validateStep}
          categories={EIR_CONFIG.categories}
          sidebarIcon={EIR_STEPS[0]?.icon}
        />
      }
      header={
        <DocumentEditorHeader
          stepTitle={EIR_STEPS[currentStep]?.title}
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onBack={() => navigate('/eir-manager')}
          backLabel="Back to list"
          onPrevious={handlePrevious}
          onNext={handleNext}
          showProgressBar
          headerActions={headerActions}
        />
      }
      footer={
        <DocumentEditorFooter
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      }
    >
      <FormStepRHF
        stepIndex={currentStep}
        stepConfig={stepConfig}
      />
    </DocumentEditorLayout>
  );
};

/**
 * EIR Form View — load draft, wrap in EirFormProvider, render editor.
 */
const EirFormView = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!draftId) {
      navigate('/eir-manager');
      return;
    }
    let cancelled = false;
    setLoading(true);
    apiService
      .getEirDraft(draftId)
      .then((res) => {
        if (cancelled) return;
        const d = res?.draft ?? res;
        if (d?.id) {
          setDraft(d);
        } else {
          setDraft(null);
        }
      })
      .catch(() => {
        if (!cancelled) setDraft(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [draftId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading EIR…</p>
      </div>
    );
  }

  if (!draft) {
    navigate('/eir-manager');
    return null;
  }

  const initialData = draft.data && typeof draft.data === 'object' ? draft.data : undefined;

  return (
    <EirFormProvider initialData={initialData}>
      <EirFormViewContent
        draftId={draft.id}
        draftTitle={draft.title || 'Untitled EIR'}
      />
    </EirFormProvider>
  );
};

export default EirFormView;
