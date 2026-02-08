import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Wand2,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle as AlertCircleIcon,
  FileText,
  BookOpen,
  Shield
} from 'lucide-react';
import GuidedAIWizardTab from './GuidedAIWizardTab';

/**
 * AIAssistantTab — Unified tab merging Quick AI and Guided AI into one view.
 *
 * Shows two approach cards on the landing screen:
 *   1. Quick AI   – one-click generate/improve (delegates to existing handlers)
 *   2. Guided AI  – step-by-step Q&A wizard   (delegates to GuidedAIWizardTab)
 *
 * Props forwarded from SmartHelpDialog.
 */
const AIAssistantTab = ({
  editor,
  fieldName,
  fieldType,
  fieldState,
  helpContent,
  onClose,
  // Quick AI shared state from SmartHelpDialog
  aiLoading,
  aiError,
  aiSuccess,
  handleAIGenerate,
  handleAIImprove,
  improveOptions,
  setImproveOptions
}) => {
  // 'pick' = landing with two cards | 'quick' = inline quick flow | 'guided' = wizard
  const [mode, setMode] = useState('pick');

  // ── Landing: two approach cards ──
  if (mode === 'pick') {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-purple-900 mb-1">AI Content Assistant</h4>
              <p className="text-sm text-purple-800">
                {fieldState === 'empty'
                  ? 'Choose how you\'d like the AI to generate content for this field.'
                  : 'Choose how you\'d like the AI to improve your content.'}
              </p>
            </div>
          </div>
        </div>

        {/* Approach cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quick AI Card */}
          <button
            type="button"
            onClick={() => setMode('quick')}
            className="group text-left p-5 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 group-hover:bg-blue-500 flex items-center justify-center transition-colors">
                <Zap className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Quick AI</h5>
                <span className="text-xs text-blue-600 font-medium">Fastest</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {fieldState === 'empty'
                ? 'One-click AI generation — instantly creates professional, ISO 19650-compliant content.'
                : 'One-click improvement — polishes grammar, tone, and terminology in seconds.'}
            </p>
          </button>

          {/* Guided AI Card */}
          <button
            type="button"
            onClick={() => setMode('guided')}
            className="group text-left p-5 rounded-xl border-2 border-gray-200 bg-white hover:border-purple-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 group-hover:bg-purple-500 flex items-center justify-center transition-colors">
                <Wand2 className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Guided AI</h5>
                <span className="text-xs text-purple-600 font-medium">Most tailored</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Answer a few project-specific questions so the AI can craft content tailored to your exact situation.
            </p>
          </button>
        </div>
      </div>
    );
  }

  // ── Back button (shared by Quick & Guided) ──
  const BackButton = () => (
    <button
      type="button"
      onClick={() => setMode('pick')}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 -mt-1 transition-colors"
    >
      <ArrowLeft size={14} /> Back to options
    </button>
  );

  // ── Guided AI mode ──
  if (mode === 'guided') {
    return (
      <div>
        <BackButton />
        <GuidedAIWizardTab
          editor={editor}
          fieldName={fieldName}
          fieldType={fieldType}
          helpContent={helpContent}
          onClose={onClose}
        />
      </div>
    );
  }

  // ── Quick AI mode ──
  if (mode === 'quick') {
    return (
      <div>
        <BackButton />
        {fieldState === 'empty' ? (
          <QuickGenerateView
            onGenerate={handleAIGenerate}
            isLoading={aiLoading}
            error={aiError}
            success={aiSuccess}
          />
        ) : (
          <QuickImproveView
            fieldState={fieldState}
            improveOptions={improveOptions}
            setImproveOptions={setImproveOptions}
            onImprove={handleAIImprove}
            isLoading={aiLoading}
            error={aiError}
            success={aiSuccess}
          />
        )}
      </div>
    );
  }

  return null;
};

// ============================================================================
// QUICK GENERATE (empty field)
// ============================================================================
const QuickGenerateView = ({ onGenerate, isLoading, error, success }) => (
  <div className="space-y-4">
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-3">
        <Sparkles className="text-blue-600 flex-shrink-0 mt-1" size={20} />
        <div>
          <h4 className="font-semibold text-blue-900 mb-1">Quick AI Generation</h4>
          <p className="text-sm text-blue-800">
            Generate professional, ISO 19650-compliant content tailored to this field in one click.
          </p>
        </div>
      </div>
    </div>

    {isLoading && (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Loader2 size={20} className="animate-spin text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Generating content...</p>
            <p className="text-xs text-blue-700 mt-0.5">AI is analysing and creating content for you</p>
          </div>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    )}

    {error && (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertCircleIcon className="text-red-600 flex-shrink-0" size={20} />
        <div>
          <h4 className="font-semibold text-red-900 mb-1">Error</h4>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    )}

    {success && (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
        <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
        <div>
          <h4 className="font-semibold text-green-900 mb-1">Success!</h4>
          <p className="text-sm text-green-800">Content generated successfully.</p>
        </div>
      </div>
    )}

    <button
      type="button"
      onClick={onGenerate}
      disabled={isLoading || success}
      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <><Loader2 size={20} className="animate-spin" /> Generating...</>
      ) : (
        <><Sparkles size={20} /> Generate Content with AI</>
      )}
    </button>
  </div>
);

// ============================================================================
// QUICK IMPROVE (has content / has selection)
// ============================================================================
const QuickImproveView = ({ fieldState, improveOptions, setImproveOptions, onImprove, isLoading, error, success }) => {
  const [improvementStyle, setImprovementStyle] = useState('quick-polish');
  const [showCustomOptions, setShowCustomOptions] = useState(false);

  const handleStyleChange = (style) => {
    setImprovementStyle(style);
    if (style === 'quick-polish') {
      setImproveOptions({ grammar: true, professional: false, iso19650: false, expand: false, concise: false });
      setShowCustomOptions(false);
    } else if (style === 'professional') {
      setImproveOptions({ grammar: true, professional: true, iso19650: true, expand: false, concise: false });
      setShowCustomOptions(false);
    } else if (style === 'custom') {
      setShowCustomOptions(true);
    }
  };

  const toggleOption = (key) => {
    setImproveOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="text-indigo-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-indigo-900 mb-1">Quick AI Improvement</h4>
            <p className="text-sm text-indigo-800">
              {fieldState === 'hasSelection'
                ? 'Improve the selected text with AI enhancements.'
                : 'Enhance your existing content with AI-powered improvements.'
              }
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-800 mb-3">Choose improvement style:</h4>
        <div className="space-y-3">
          {/* Quick Polish */}
          <StyleCard
            active={improvementStyle === 'quick-polish'}
            onClick={() => handleStyleChange('quick-polish')}
            icon={Zap}
            title="⚡ Quick Polish"
            description="Fixes grammar and improves clarity"
            color="blue"
          />
          {/* Professional */}
          <StyleCard
            active={improvementStyle === 'professional'}
            onClick={() => handleStyleChange('professional')}
            icon={Sparkles}
            title="💼 Professional"
            description="Formal tone + ISO 19650 terminology"
            color="purple"
          />
          {/* Custom */}
          <StyleCard
            active={improvementStyle === 'custom'}
            onClick={() => handleStyleChange('custom')}
            icon={null}
            customIcon={
              <svg className={`w-5 h-5 ${improvementStyle === 'custom' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            }
            title="🎯 Custom"
            description="Choose specific improvements"
            color="indigo"
          />
        </div>
      </div>

      {/* Custom Options */}
      {showCustomOptions && (
        <div className="space-y-2 animate-fadeIn">
          <h4 className="font-medium text-gray-800 mb-2 text-sm">Select improvements:</h4>
          {[
            { key: 'grammar', label: 'Improve grammar and clarity', icon: BookOpen },
            { key: 'professional', label: 'Make more professional', icon: Sparkles },
            { key: 'iso19650', label: 'Add ISO 19650 terminology', icon: Shield },
            { key: 'expand', label: 'Expand with more details', icon: FileText },
            { key: 'concise', label: 'Make more concise', icon: Zap }
          ].map(option => {
            const Icon = option.icon;
            return (
              <label
                key={option.key}
                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={improveOptions[option.key]}
                  onChange={() => toggleOption(option.key)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <Icon className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            );
          })}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 size={20} className="animate-spin text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Improving content...</p>
              <p className="text-xs text-blue-700 mt-0.5">AI is enhancing your text with professional improvements</p>
            </div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-indigo-500 rounded-full animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircleIcon className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-semibold text-red-900 mb-1">Error</h4>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Success!</h4>
            <p className="text-sm text-green-800">Content improved successfully.</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onImprove(false)}
          disabled={isLoading || success}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <><Loader2 size={20} className="animate-spin" /> Improving...</>
          ) : (
            <><Zap size={20} /> {fieldState === 'hasSelection' ? 'Improve Selection' : 'Append Improved'}</>
          )}
        </button>
        <button
          type="button"
          onClick={() => onImprove(true)}
          disabled={isLoading || success}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <><Loader2 size={20} className="animate-spin" /> Replacing...</>
          ) : (
            <><Sparkles size={20} /> Replace All</>
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// SHARED: Style card for improvement styles
// ============================================================================
const StyleCard = ({ active, onClick, icon: Icon, customIcon, title, description, color }) => {
  const colorMap = {
    blue: { border: 'border-blue-500', bg: 'bg-blue-50', iconBg: 'bg-blue-500', check: 'bg-blue-500' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-50', iconBg: 'bg-purple-500', check: 'bg-purple-500' },
    indigo: { border: 'border-indigo-500', bg: 'bg-indigo-50', iconBg: 'bg-indigo-500', check: 'bg-indigo-500' }
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        active ? `${c.border} ${c.bg} shadow-sm` : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${active ? c.iconBg : 'bg-gray-200'}`}>
          {Icon
            ? <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} />
            : customIcon}
        </div>
        <div className="flex-1">
          <h5 className="font-semibold text-gray-900 mb-1">{title}</h5>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {active && (
          <div className="flex-shrink-0">
            <div className={`w-5 h-5 ${c.check} rounded-full flex items-center justify-center`}>
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default AIAssistantTab;
