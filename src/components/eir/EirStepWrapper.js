import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useBepForm } from '../../contexts/BepFormContext';
import { useEir } from '../../contexts/EirContext';
import { useEirFill } from '../../hooks/useEirFill';
import { cn } from '../../utils/cn';
import { bepUi } from '../pages/bep/bepUiClasses';
import EirUploadStep from './EirUploadStep';
import EirAnalysisView from './EirAnalysisView';
import EirFillSummaryModal from './EirFillSummaryModal';

/**
 * Wraps the main BEP form content.
 * When the URL step is 'eir' or '-1', renders the EIR upload / analysis pre-step
 * instead of the main wizard. On completion, auto-fills compatible BEP fields.
 */
const EirStepWrapper = ({ children }) => {
  const { step: stepParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentDraft, methods } = useBepForm();
  const { setEirAnalysis, hasAnalysis, analysis, summary, getValueForField, hasDataForField, getValueByPath } = useEir();

  const [showEirStep, setShowEirStep] = useState(false);
  const [showAnalysisView, setShowAnalysisView] = useState(false);

  const { filledSummary, handleUseInBep, handleConfirmApply } = useEirFill({
    methods,
    getValueForField,
    hasDataForField,
    getValueByPath,
    navigate,
    location,
  });

  // Check URL for EIR step
  useEffect(() => {
    if (stepParam === 'eir' || stepParam === '-1') {
      setShowEirStep(true);
    } else {
      setShowEirStep(false);
    }
  }, [stepParam]);

  const handleAnalysisComplete = useCallback((data) => {
    setEirAnalysis(data);
    setShowAnalysisView(true);
  }, [setEirAnalysis]);

  const handleSkipEir = useCallback(() => {
    const basePath = location.pathname.split('/step/')[0];
    navigate(`${basePath}/step/0`);
  }, [navigate, location.pathname]);

  if (showEirStep) {
    return (
      <div className={cn('h-screen flex', bepUi.shell)}>
        <div className="flex-1 flex flex-col">
          <div className={cn('flex-1', bepUi.contentScroll)}>
            <div className="max-w-4xl mx-auto px-4 py-4 lg:py-6">
              <div className={cn(bepUi.panel, 'bg-ui-surface border border-ui-border rounded-xl shadow-sm p-6')}>
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
        {filledSummary && (
          <EirFillSummaryModal filledFields={filledSummary} onConfirm={handleConfirmApply} />
        )}
      </div>
    );
  }

  return children;
};

export default EirStepWrapper;
