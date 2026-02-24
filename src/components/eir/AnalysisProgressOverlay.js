/**
 * Analysis Progress Overlay Component
 *
 * Shows a stepper with progress bar during EIR document analysis.
 * Keeps users engaged with animated progress and rotating messages.
 *
 * CSS Animations required in global styles:
 * @keyframes shimmer {
 *   0% { transform: translateX(-100%); }
 *   100% { transform: translateX(200%); }
 * }
 * @keyframes gradient-flow {
 *   0% { background-position: 0% 50%; }
 *   50% { background-position: 100% 50%; }
 *   100% { background-position: 0% 50%; }
 * }
 */

import { useState, useEffect } from 'react';
import { FileText, Brain, Sparkles, CheckCircle, Loader2, X, Clock } from 'lucide-react';

// Inject keyframes if not already in global CSS
if (typeof document !== 'undefined') {
  const styleId = 'analysis-progress-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
      @keyframes gradient-flow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-shimmer {
        animation: shimmer 2.5s infinite;
      }
      .animate-gradient-flow {
        animation: gradient-flow 3s ease infinite;
      }
    `;
    document.head.appendChild(style);
  }
}

// Analysis stages configuration
const STAGES = [
  {
    id: 'extracting',
    label: 'Extracting Text',
    description: 'Reading document content',
    icon: FileText,
    checks: [
      'Detecting page structure',
      'Reading text and tables',
      'Preserving section headings'
    ],
    messages: [
      'Reading your document...',
      'Extracting text from pages...',
      'Processing tables and content...',
      'Preparing text for analysis...'
    ]
  },
  {
    id: 'processing',
    label: 'Processing',
    description: 'Preparing for AI analysis',
    icon: Brain,
    checks: [
      'Organizing requirements',
      'Grouping by ISO 19650 areas',
      'Preparing AI context'
    ],
    messages: [
      'Organizing document structure...',
      'Identifying key sections...',
      'Preparing content chunks...',
      'Optimizing for analysis...'
    ]
  },
  {
    id: 'analyzing',
    label: 'AI Analysis',
    description: 'Extracting BIM requirements',
    icon: Sparkles,
    checks: [
      'Extracting objectives and standards',
      'Identifying roles and deliverables',
      'Mapping to BEP sections'
    ],
    messages: [
      'Identifying BIM objectives...',
      'Extracting ISO 19650 requirements...',
      'Analyzing delivery milestones...',
      'Mapping roles and responsibilities...',
      'Identifying software requirements...',
      'Extracting CDE specifications...',
      'Analyzing quality requirements...',
      'Processing naming conventions...'
    ]
  },
  {
    id: 'finalizing',
    label: 'Finalizing',
    description: 'Generating summary',
    icon: CheckCircle,
    checks: [
      'Building summary',
      'Preparing BEP suggestions',
      'Final checks'
    ],
    messages: [
      'Generating analysis summary...',
      'Preparing suggestions for BEP...',
      'Almost done...'
    ]
  }
];

// Map backend status to stage index
const STATUS_TO_STAGE = {
  'uploaded': 0,
  'extracting': 0,
  'extracted': 1,
  'analyzing': 2,
  'analyzed': 3
};

// Rotating tips to keep users engaged
const TIPS = [
  "Larger documents may take longer to process. The analysis follows ISO 19650 standards.",
  "Did you know? ISO 19650 emphasizes clear information requirements early in projects.",
  "BIM Execution Plans (BEP) should respond directly to EIR requirements.",
  "Good EIRs define clear roles, responsibilities, and delivery milestones.",
  "Pro tip: Clear EIRs can reduce project rework by up to 30% — we're checking yours now!"
];

const AnalysisProgressOverlay = ({
  isOpen,
  currentStatus = 'extracting',
  documentName = 'Document',
  elapsedTime = 0,
  progressOverride = null,
  onClose = null,
  canClose = false,
  showBackgroundHint = false
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Get current stage index with fallback
  const currentStageIndex = STATUS_TO_STAGE[currentStatus] ?? 0;
  const currentStage = STAGES[currentStageIndex] ?? STAGES[0];

  // Reset message index when stage changes
  useEffect(() => {
    setMessageIndex(0);
  }, [currentStageIndex]);

  // Rotate messages every 3 seconds
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setMessageIndex(prev => {
        const messages = currentStage?.messages || [];
        return (prev + 1) % Math.max(messages.length, 1);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, currentStage]);

  // Rotate tips every 7 seconds
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Calculate progress
  const baseProgress = currentStageIndex * 25;
  const intraProgress = Math.min(20, (elapsedTime % 60) / 3);
  const calculatedProgress = Math.min(99, baseProgress + intraProgress);
  const progress = progressOverride ?? calculatedProgress;

  // Format elapsed time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (!isOpen) return null;

  const currentMessage = currentStage?.messages?.[messageIndex] || 'Processing...';

  const getEtaSeconds = () => {
    if (!progress || progress <= 1) return null;
    const totalEstimate = elapsedTime / (progress / 100);
    const remaining = Math.max(0, Math.round(totalEstimate - elapsedTime));
    if (Number.isNaN(remaining) || remaining === Infinity) return null;
    return Math.min(60 * 10, remaining);
  };

  const etaSeconds = getEtaSeconds();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analysis-title"
    >
      {/* Screen reader announcement */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {currentStage.label}: {currentMessage}. Progress {Math.round(progress)} percent.
      </div>

      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full mx-4 overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 text-white flex-shrink-0">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 id="analysis-title" className="font-semibold text-lg leading-tight">Analyzing Document</h3>
                <p className="text-purple-100 text-sm truncate">{documentName}</p>
              </div>
            </div>
            {canClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 inline-flex items-center gap-2 text-xs font-medium bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition"
              >
                <X className="w-3.5 h-3.5" />
                Continue in background
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">

          {/* Progress bar */}
          <div className="mb-7">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-sm font-medium text-gray-600">Analysis Progress</span>
              <div className="flex items-center gap-3">
                {etaSeconds !== null && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{formatTime(etaSeconds)} remaining
                  </span>
                )}
                <span className="text-purple-600 font-bold text-xl tabular-nums">{Math.round(progress)}%</span>
              </div>
            </div>

            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              {/* Filled gradient */}
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-[length:200%_100%] animate-gradient-flow shadow-lg shadow-purple-500/40"
                style={{ width: `${progress}%` }}
              />
              {/* Shimmer sweep */}
              <div
                className="absolute inset-y-0 left-0 opacity-40 pointer-events-none"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Stepper — insight and checks are embedded into the active step */}
          <div className="mb-7">
            {STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;

              return (
                <div key={stage.id}>
                  <div
                    className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                      isCurrent
                        ? 'bg-purple-50 border border-purple-200'
                        : isCompleted
                          ? 'bg-green-50/50'
                          : 'opacity-40'
                    }`}
                  >
                    {/* Step icon */}
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                      ${isCompleted ? 'bg-green-100 text-green-600' : isCurrent ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isCurrent ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold text-sm ${
                          isCompleted ? 'text-green-700' : isCurrent ? 'text-purple-900' : 'text-gray-500'
                        }`}>
                          {stage.label}
                        </span>
                        {isCompleted && (
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                            Done
                          </span>
                        )}
                      </div>

                      <p className={`text-sm ${isCurrent ? 'text-purple-700 font-medium' : 'text-gray-400'}`}>
                        {isCurrent ? currentMessage : stage.description}
                      </p>

                      {/* Active step: show what we're checking as pills */}
                      {isCurrent && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {stage.checks.map(check => (
                            <span
                              key={check}
                              className="text-[11px] text-purple-600 bg-white border border-purple-200 px-2 py-0.5 rounded-full"
                            >
                              {check}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connector line */}
                  {index < STAGES.length - 1 && (
                    <div className="ml-5 flex">
                      <div className={`w-0.5 h-4 transition-colors duration-300 ${
                        index < currentStageIndex ? 'bg-green-300' : 'bg-gray-200'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time elapsed */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span>Time elapsed: <span className="font-medium text-gray-700">{formatTime(elapsedTime)}</span></span>
          </div>

          {/* Rotating tip */}
          <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs text-amber-700 text-center">
              <span className="font-semibold">Tip:</span> {TIPS[tipIndex]}
            </p>
          </div>

          {/* Background hint */}
          {showBackgroundHint && (
            <p className="mt-3 text-[11px] text-gray-400 text-center">
              You can continue working — analysis will keep running in the background.
            </p>
          )}

          {/* Completion hint */}
          {currentStatus === 'analyzed' && (
            <p className="mt-3 text-xs text-green-700 text-center font-medium">
              All set. Preparing your summary and BEP suggestions now…
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgressOverlay;
