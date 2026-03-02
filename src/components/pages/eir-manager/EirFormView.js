import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Save, FileDown } from 'lucide-react';
import { EirFormProvider, useEirForm } from '../../../contexts/EirFormContext';
import EIR_CONFIG from '../../../config/eirConfig';
import FormStepRHF from '../../steps/FormStepRHF';
import apiService from '../../../services/apiService';
import toast from 'react-hot-toast';
import { cn } from '../../../utils/cn';

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

  return (
    <div className="flex h-screen bg-gray-50" data-page-uri={`/eir-manager/${draftId}/edit`}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 truncate" title={draftTitle}>{draftTitle || 'EIR'}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{TOTAL_STEPS} sections</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {EIR_STEPS.map((step, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleStepClick(idx)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                currentStep === idx
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-gray-700 hover:bg-gray-100',
                completedSections.has(idx) && currentStep !== idx && 'text-amber-700'
              )}
            >
              <span className="block truncate">{step.number}. {step.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="shrink-0 flex items-center justify-between gap-4 px-6 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/eir-manager')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to list
            </button>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">
              Section {currentStep + 1} of {TOTAL_STEPS}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-800 font-medium rounded-lg transition-colors"
            >
              <FileDown className="w-4 h-4" />
              {exporting ? 'Exporting…' : 'Export PDF'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </header>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
              <FormStepRHF
                stepIndex={currentStep}
                stepConfig={stepConfig}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="shrink-0 flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastStep}
            className="inline-flex items-center gap-2 px-4 py-2 text-amber-700 hover:bg-amber-50 disabled:opacity-50 disabled:pointer-events-none rounded-lg transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      </div>
    </div>
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
