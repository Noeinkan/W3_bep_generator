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
import { FileText, Brain, Sparkles, CheckCircle, Loader2, X, Clock, Info } from 'lucide-react';

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

  // Reset message index when stage changes (CRITICAL FIX)
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

  // Rotate tips every 7 seconds (faster for longer analyses)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Calculate progress (CSS handles smooth transitions - BUGGY RAF REMOVED)
  const baseProgress = currentStageIndex * 25;
  const intraProgress = Math.min(20, (elapsedTime % 60) / 3);
  const calculatedProgress = Math.min(99, baseProgress + intraProgress); // Cap at 99%
  const progress = progressOverride ?? calculatedProgress;

  // Format elapsed time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (!isOpen) return null;

  const currentMessage = currentStage?.messages?.[messageIndex] || 'Processing...';
  const currentChecks = currentStage?.checks || [];

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

      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 id="analysis-title" className="font-semibold text-lg">Analyzing Document</h3>
              <p className="text-purple-100 text-sm truncate max-w-xs">{documentName}</p>
            </div>
            </div>
            {canClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs font-medium bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition"
              >
                <X className="w-3.5 h-3.5" />
                Continue in background
              </button>
            )}
          </div>
        </div>

        {/* Progress content */}
        <div className="p-6">
          {/* Premium Progress Bar with Animations */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-600 font-medium">Analysis Progress</span>
              <span className="text-purple-600 font-bold text-lg">{Math.round(progress)}%</span>
            </div>

            {/* Track */}
            <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner">

              {/* Filled portion with moving gradient + glow */}
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-4
                  bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600
                  bg-[length:200%_100%] animate-gradient-flow
                  shadow-lg shadow-purple-500/50
                  ${currentStageIndex === 2 ? 'animate-pulse' : ''}`}
                style={{ width: `${progress}%` }}
              >
                {/* Show percentage inside bar when >20% */}
                {progress > 20 && (
                  <span className="text-white text-xs font-bold drop-shadow-md">
                    {Math.round(progress)}%
                  </span>
                )}
              </div>

              {/* Shimmer overlay - the sweeping shine effect */}
              <div
                className="absolute inset-y-0 left-0 w-full opacity-40 pointer-events-none"
                style={{ width: `${progress}%` }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 animate-shimmer"
                />
              </div>

              {/* Extra sparkles in analyzing stage - floating magic */}
              {currentStageIndex === 2 && progress > 50 && (
                <div className="absolute inset-0 flex items-center justify-around px-4 pointer-events-none">
                  <Sparkles className="w-4 h-4 text-white/60 animate-pulse" style={{ animationDelay: '75ms' }} />
                  <Sparkles className="w-5 h-5 text-white/80 animate-pulse" />
                  <Sparkles className="w-4 h-4 text-white/60 animate-pulse" style={{ animationDelay: '150ms' }} />
                </div>
              )}
            </div>
          </div>

          {/* Insight + ETA */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
                <Sparkles className="w-3.5 h-3.5" />
                Live insight
              </div>
              <p className="mt-1 text-sm text-purple-900">
                {currentMessage}
              </p>
              <p className="mt-1 text-[11px] text-purple-700/80">
                We match findings to BEP sections as we go.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Clock className="w-3.5 h-3.5" />
                Estimated time remaining
              </div>
              <p className="mt-1 text-sm text-gray-900">
                {etaSeconds !== null ? formatTime(etaSeconds) : 'Calculating...'}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Best‑effort estimate based on document size and model load.
              </p>
            </div>
          </div>

          {/* What we're checking */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <Info className="w-3.5 h-3.5" />
              What we’re checking now
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentChecks.map((check) => (
                <span
                  key={check}
                  className="text-[11px] text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-full"
                >
                  {check}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              Your document stays in this workspace and is only used to generate your analysis.
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-6">
            {STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isPending = index > currentStageIndex;

              return (
                <div key={stage.id}>
                  <div
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                      isCurrent
                        ? 'bg-purple-50 border border-purple-200'
                        : isCompleted
                          ? 'bg-green-50/50'
                          : 'opacity-50'
                    }`}
                  >
                    {/* Step indicator */}
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${isCompleted
                        ? 'bg-green-100 text-green-600'
                        : isCurrent
                          ? 'bg-purple-100 text-purple-600 animate-pulse'
                          : 'bg-gray-100 text-gray-400'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 transition-transform duration-300" />
                      ) : isCurrent ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm ${
                          isCompleted
                            ? 'text-green-700'
                            : isCurrent
                              ? 'text-purple-900'
                              : 'text-gray-500'
                        }`}>
                          {stage.label}
                        </span>
                        {isCompleted && (
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            Done
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${
                        isCurrent ? 'text-purple-600' : 'text-gray-400'
                      }`}>
                        {isCurrent ? currentMessage : stage.description}
                      </p>
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
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span>Time elapsed: <span className="font-medium text-gray-700">{formatTime(elapsedTime)}</span></span>
          </div>

          {/* Rotating Tips */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl transition-all duration-500">
            <p className="text-xs text-amber-700 text-center">
              <span className="font-medium">Tip:</span> {TIPS[tipIndex]}
            </p>
          </div>

          {/* Background hint */}
          {showBackgroundHint && (
            <div className="mt-3 text-[11px] text-gray-500 text-center">
              You can continue working — analysis will keep running in the background.
            </div>
          )}

          {/* Next step hint */}
          {currentStatus === 'analyzed' && (
            <div className="mt-3 text-xs text-green-700 text-center">
              All set. Preparing your summary and BEP suggestions now…
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgressOverlay;
