import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { OirFormProvider, useOirForm } from '../../../contexts/OirFormContext';
import OIR_CONFIG from '../../../config/oirConfig';
import FormStepRHF from '../../steps/FormStepRHF';
import apiService from '../../../services/apiService';
import toast from 'react-hot-toast';
import { cn } from '../../../utils/cn';

const OIR_STEPS = OIR_CONFIG.steps;
const TOTAL_STEPS = OIR_STEPS.length;

/**
 * OIR editor content — step navigation, sidebar, save. Must be inside OirFormProvider.
 */
const OirFormViewContent = ({ draftId, draftTitle }) => {
  const navigate = useNavigate();
  const { stepIndex: stepParam } = useParams();
  const contentRef = useRef(null);

  const {
    setCurrentDraft,
    getFormData,
    completedSections,
    validateStep,
    markStepCompleted,
  } = useOirForm();

  const currentStep = Math.min(Math.max(parseInt(stepParam, 10) || 0, 0), TOTAL_STEPS - 1);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  const stepConfig = OIR_CONFIG.getFormFields(currentStep);

  const navigateToStep = useCallback((step) => {
    const next = Math.min(Math.max(step, 0), TOTAL_STEPS - 1);
    navigate(`/oir-manager/${draftId}/edit/step/${next}`);
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

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const data = getFormData();
      await apiService.updateOirDraft(draftId, { data });
      setCurrentDraft((prev) => (prev ? { ...prev, title: draftTitle } : { id: draftId, title: draftTitle }));
      toast.success('OIR saved');
    } catch (err) {
      toast.error(err?.message || 'Failed to save OIR');
    } finally {
      setSaving(false);
    }
  }, [draftId, draftTitle, getFormData, setCurrentDraft]);

  return (
    <div className="flex h-screen bg-gray-50" data-page-uri={`/oir-manager/${draftId}/edit`}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 truncate" title={draftTitle}>{draftTitle || 'OIR'}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{TOTAL_STEPS} sections</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {OIR_STEPS.map((step, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleStepClick(idx)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                currentStep === idx
                  ? 'bg-indigo-100 text-indigo-900'
                  : 'text-gray-700 hover:bg-gray-100',
                completedSections.has(idx) && currentStep !== idx && 'text-indigo-700'
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
              onClick={() => navigate('/oir-manager')}
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
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
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
            className="inline-flex items-center gap-2 px-4 py-2 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 disabled:pointer-events-none rounded-lg transition-colors"
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
 * OIR Form View — load draft, wrap in OirFormProvider, render editor.
 */
const OirFormView = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!draftId) {
      navigate('/oir-manager');
      return;
    }
    let cancelled = false;
    setLoading(true);
    apiService
      .getOirDraft(draftId)
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
        <p className="text-gray-500">Loading OIR…</p>
      </div>
    );
  }

  if (!draft) {
    navigate('/oir-manager');
    return null;
  }

  const initialData = draft.data && typeof draft.data === 'object' ? draft.data : undefined;

  return (
    <OirFormProvider initialData={initialData}>
      <OirFormViewContent
        draftId={draft.id}
        draftTitle={draft.title || 'Untitled OIR'}
      />
    </OirFormProvider>
  );
};

export default OirFormView;
