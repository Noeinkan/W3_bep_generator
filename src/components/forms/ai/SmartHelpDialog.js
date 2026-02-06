import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  FileText,
  HelpCircle,
  Zap,
  BookOpen,
  Shield,
  Lightbulb,
  AlertTriangle,
  Loader2,
  CheckCircle,
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import { Modal } from '../../common';
import axios from 'axios';
import COMMERCIAL_OFFICE_TEMPLATE from '../../../data/templates/commercialOfficeTemplate';
import { markdownToTipTapHtml } from '../../../utils/markdownToHtml';
import FIELD_EXAMPLES from '../../../constants/fieldExamples';

/**
 * SmartHelpDialog - Context-aware help dialog
 *
 * Shows different tabs based on field state:
 * - Empty field: Examples (default) → AI Generate → Guidelines
 * - Has content: AI Improve (default) → Guidelines → Examples
 * - Has selection: AI Improve Selection (default) → Guidelines → Examples
 */
const SmartHelpDialog = ({
  editor,
  fieldName,
  fieldType,
  fieldState,
  helpContent,
  onClose
}) => {
  const contentRef = useRef(null);

  // Tab configuration based on field state
  const getTabsConfig = () => {
    if (fieldState === 'empty') {
      return [
        { id: 'examples', label: 'Quick Examples', icon: FileText, priority: 1 },
        { id: 'ai-generate', label: 'AI Generate', icon: Sparkles, priority: 2 },
        { id: 'guidelines', label: 'Guidelines', icon: HelpCircle, priority: 3 }
      ];
    } else {
      return [
        { id: 'ai-improve', label: 'AI Improve', icon: Zap, priority: 1 },
        { id: 'guidelines', label: 'Guidelines', icon: HelpCircle, priority: 2 },
        { id: 'examples', label: 'Reference', icon: FileText, priority: 3 }
      ];
    }
  };

  const tabs = getTabsConfig();
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiSuccess, setAiSuccess] = useState(false);

  // AI Improvement options
  const [improveOptions, setImproveOptions] = useState({
    grammar: true,
    professional: false,
    iso19650: false,
    expand: false,
    concise: false
  });

  // Load example text
  const handleLoadExample = () => {
    if (!editor) return;

    let exampleData = FIELD_EXAMPLES[fieldName] || COMMERCIAL_OFFICE_TEMPLATE.projectDescription;
    const exampleText = typeof exampleData === 'object' && exampleData?.intro
      ? exampleData.intro
      : exampleData;

    const htmlContent = `<p>${exampleText}</p>`;
    editor.commands.setContent(htmlContent);
    onClose();
  };

  // AI Generate (for empty fields)
  const handleAIGenerate = async () => {
    if (!editor) return;

    setAiLoading(true);
    setAiError(null);
    setAiSuccess(false);

    try {
      const response = await axios.post('/api/ai/suggest', {
        field_type: fieldType || fieldName,
        partial_text: '',
        max_length: 200
      }, {
        timeout: 30000
      });

      if (response.data.success) {
        const suggestion = response.data.text;
        const htmlContent = markdownToTipTapHtml(suggestion);
        editor.chain().focus().setContent(htmlContent).run();
        setAiSuccess(true);
        setTimeout(() => onClose(), 1500);
      } else {
        setAiError(response.data.message || 'Failed to generate content');
      }
    } catch (err) {
      console.error('AI generate error:', err);
      setAiError(err.response?.data?.message || 'Cannot connect to AI service');
    } finally {
      setAiLoading(false);
    }
  };

  // AI Improve (for existing content)
  const handleAIImprove = async (replaceAll = false) => {
    if (!editor) return;

    setAiLoading(true);
    setAiError(null);
    setAiSuccess(false);

    try {
      const currentContent = replaceAll
        ? editor.getText()
        : editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to
          ) || editor.getText();

      const isTabularCandidate = (text) => {
        if (!text) return false;
        const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
        const bulletLines = lines.filter((line) => /^([•\-*]|\d+[\.)])\s+/.test(line));

        if (bulletLines.length < 5) return false;

        const bulletContent = bulletLines.map((line) => line.replace(/^([•\-*]|\d+[\.)])\s+/, '').trim());
        const withDelimiter = bulletContent.filter((line) => /:\s+|\s+-\s+|\s+–\s+/.test(line));

        return withDelimiter.length >= Math.max(4, Math.ceil(bulletContent.length * 0.7));
      };

      // Build improvement instructions
      const instructions = [];
      if (improveOptions.grammar) instructions.push('improve grammar and clarity');
      if (improveOptions.professional) instructions.push('make more professional');
      if (improveOptions.iso19650) instructions.push('add ISO 19650 terminology');
      if (improveOptions.expand) instructions.push('expand with more details');
      if (improveOptions.concise) instructions.push('make more concise');

      const tableGuidance = isTabularCandidate(currentContent)
        ? 'If the content has repeated items with consistent fields, convert it into a concise HTML table with a header row. Limit the table to 15 rows total (including header) and a maximum of 6 columns. Use <table>, <thead>, <tbody>, <tr>, <th>, <td>. Otherwise keep as paragraphs or bullet points.'
        : 'Only use a table when the content structure clearly implies tabular data. If you use a table, limit it to 15 rows total (including header) and a maximum of 6 columns, and output HTML table tags.';

      const prompt = instructions.length > 0
        ? `Rewrite the following text to ${instructions.join(', ')}. ${tableGuidance} Output ONLY the improved text without any introduction, explanation, or commentary.\n\nText to improve:\n${currentContent}`
        : `${tableGuidance}\n\n${currentContent}`;

      const response = await axios.post('/api/ai/suggest', {
        field_type: fieldType || fieldName,
        partial_text: prompt,
        max_length: 300
      }, {
        timeout: 30000
      });

      if (response.data.success) {
        const suggestion = response.data.text;
        const htmlContent = markdownToTipTapHtml(suggestion);

        if (replaceAll) {
          editor.chain().focus().clearContent().insertContent(htmlContent).run();
        } else {
          editor.chain().focus().insertContent(htmlContent).run();
        }

        setAiSuccess(true);
        setTimeout(() => onClose(), 1500);
      } else {
        setAiError(response.data.message || 'Failed to improve content');
      }
    } catch (err) {
      console.error('AI improve error:', err);
      setAiError(err.response?.data?.message || 'Cannot connect to AI service');
    } finally {
      setAiLoading(false);
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'examples':
        return <ExamplesTab
          fieldName={fieldName}
          fieldState={fieldState}
          onLoadExample={handleLoadExample}
        />;

      case 'ai-generate':
        return <AIGenerateTab
          onGenerate={handleAIGenerate}
          isLoading={aiLoading}
          error={aiError}
          success={aiSuccess}
        />;

      case 'ai-improve':
        return <AIImproveTab
          fieldState={fieldState}
          improveOptions={improveOptions}
          setImproveOptions={setImproveOptions}
          onImprove={handleAIImprove}
          isLoading={aiLoading}
          error={aiError}
          success={aiSuccess}
        />;

      case 'guidelines':
        return <GuidelinesTab
          fieldName={fieldName}
          helpContent={helpContent}
        />;

      default:
        return null;
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      size="xl"
      className="max-h-[90vh] overflow-hidden flex flex-col"
    >
        {/* Custom gradient header */}
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white p-6 flex-shrink-0 -mx-6 -mt-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Smart Help</h3>
                <p className="text-blue-100 text-sm mt-1">
                  {fieldState === 'empty' ? 'Get started with your content' : 'Improve your content'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Close"
              type="button"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 -mx-6 px-4 flex-shrink-0">
          <div className="flex gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium
                    border-b-2 transition-all
                    ${isActive
                      ? 'border-purple-500 text-purple-700 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  type="button"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.priority === 1 && (
                    <span className="px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                      Recommended
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto -mx-6 -mb-4 p-6">
          {renderTabContent()}
        </div>
    </Modal>
  );
};

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const ExamplesTab = ({ fieldName, fieldState, onLoadExample }) => {
  let exampleData = FIELD_EXAMPLES[fieldName] || COMMERCIAL_OFFICE_TEMPLATE.projectDescription;
  const exampleText = typeof exampleData === 'object' && exampleData?.intro
    ? exampleData.intro
    : exampleData;
  const previewText = exampleText.length > 300 ? exampleText.substring(0, 300) + '...' : exampleText;

  return (
    <div className="space-y-4">
      {fieldState !== 'empty' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">⚠️ Warning</h4>
              <p className="text-sm text-amber-800">
                Loading this example will <strong>replace all current content</strong> in the editor.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded"></span>
          Professional Example for "{fieldName}"
        </h4>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed italic">
            "{previewText}"
          </p>
        </div>
      </div>

      <button
        onClick={onLoadExample}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
        type="button"
      >
        <FileText size={20} />
        Load Example Text
      </button>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> You can edit the example after loading, or use AI to customize it for your project.
        </p>
      </div>
    </div>
  );
};

const AIGenerateTab = ({ onGenerate, isLoading, error, success }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Sparkles className="text-purple-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">AI Content Generation</h4>
            <p className="text-sm text-purple-800">
              Generate professional, ISO 19650-compliant content tailored to this field using AI.
            </p>
          </div>
        </div>
      </div>

      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 size={20} className="animate-spin text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Generating content...</p>
              <p className="text-xs text-blue-700 mt-0.5">AI is analyzing and creating content for you</p>
            </div>
          </div>
          {/* Animated progress bar */}
          <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full animate-pulse"
                 style={{ width: '100%' }}></div>
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
        onClick={onGenerate}
        disabled={isLoading || success}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Generate Content with AI
          </>
        )}
      </button>
    </div>
  );
};

const AIImproveTab = ({ fieldState, improveOptions, setImproveOptions, onImprove, isLoading, error, success }) => {
  const [improvementStyle, setImprovementStyle] = useState('quick-polish');
  const [showCustomOptions, setShowCustomOptions] = useState(false);

  // Update improveOptions based on selected style
  const handleStyleChange = (style) => {
    setImprovementStyle(style);

    if (style === 'quick-polish') {
      setImproveOptions({
        grammar: true,
        professional: false,
        iso19650: false,
        expand: false,
        concise: false
      });
      setShowCustomOptions(false);
    } else if (style === 'professional') {
      setImproveOptions({
        grammar: true,
        professional: true,
        iso19650: true,
        expand: false,
        concise: false
      });
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
            <h4 className="font-semibold text-indigo-900 mb-1">AI Content Improvement</h4>
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
          <button
            onClick={() => handleStyleChange('quick-polish')}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              improvementStyle === 'quick-polish'
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
            type="button"
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                improvementStyle === 'quick-polish' ? 'bg-blue-500' : 'bg-gray-200'
              }`}>
                <Zap className={`w-5 h-5 ${improvementStyle === 'quick-polish' ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 mb-1">⚡ Quick Polish</h5>
                <p className="text-sm text-gray-600">Fixes grammar and improves clarity</p>
              </div>
              {improvementStyle === 'quick-polish' && (
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>

          {/* Professional */}
          <button
            onClick={() => handleStyleChange('professional')}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              improvementStyle === 'professional'
                ? 'border-purple-500 bg-purple-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
            type="button"
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                improvementStyle === 'professional' ? 'bg-purple-500' : 'bg-gray-200'
              }`}>
                <Sparkles className={`w-5 h-5 ${improvementStyle === 'professional' ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 mb-1">💼 Professional</h5>
                <p className="text-sm text-gray-600">Formal tone + ISO 19650 terminology</p>
              </div>
              {improvementStyle === 'professional' && (
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>

          {/* Custom */}
          <button
            onClick={() => handleStyleChange('custom')}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              improvementStyle === 'custom'
                ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
            type="button"
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                improvementStyle === 'custom' ? 'bg-indigo-500' : 'bg-gray-200'
              }`}>
                <svg className={`w-5 h-5 ${improvementStyle === 'custom' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 mb-1">🎯 Custom</h5>
                <p className="text-sm text-gray-600">Choose specific improvements</p>
              </div>
              {improvementStyle === 'custom' && (
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Custom Options - Expandable */}
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

      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 size={20} className="animate-spin text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Improving content...</p>
              <p className="text-xs text-blue-700 mt-0.5">AI is enhancing your text with professional improvements</p>
            </div>
          </div>
          {/* Animated progress bar */}
          <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-indigo-500 rounded-full animate-pulse"
                 style={{ width: '100%' }}></div>
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
          onClick={() => onImprove(false)}
          disabled={isLoading || success}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Improving...
            </>
          ) : (
            <>
              <Zap size={20} />
              {fieldState === 'hasSelection' ? 'Improve Selection' : 'Append Improved'}
            </>
          )}
        </button>

        <button
          onClick={() => onImprove(true)}
          disabled={isLoading || success}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Replacing...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Replace All
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const GuidelinesTab = ({ fieldName, helpContent }) => {
  const [activeSubTab, setActiveSubTab] = useState('info');

  if (!helpContent) {
    return (
      <div className="text-center py-8">
        <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No guidelines available for this field.</p>
      </div>
    );
  }

  const subTabs = [
    { id: 'info', label: 'Info', icon: BookOpen, contentKey: 'description' },
    { id: 'iso19650', label: 'ISO 19650', icon: Shield, contentKey: 'iso19650' },
    { id: 'bestPractices', label: 'Best Practices', icon: Lightbulb, contentKey: 'bestPractices' },
    { id: 'examples', label: 'Examples', icon: FileText, contentKey: 'examples' },
    { id: 'commonMistakes', label: 'Common Mistakes', icon: AlertTriangle, contentKey: 'commonMistakes' }
  ].filter(tab => helpContent[tab.contentKey]);

  const renderSubTabContent = () => {
    const currentTab = subTabs.find(tab => tab.id === activeSubTab);
    const content = currentTab ? helpContent[currentTab.contentKey] : null;

    if (!content) {
      return <p className="text-gray-500 italic">No content available for this section.</p>;
    }

    switch (activeSubTab) {
      case 'info':
        return (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{content}</p>
            {helpContent.relatedFields && helpContent.relatedFields.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">Related Fields:</p>
                <div className="flex flex-wrap gap-2">
                  {helpContent.relatedFields.map(field => (
                    <span key={field} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'iso19650':
        return (
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 text-sm mb-2">Standard Reference:</p>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">{content}</p>
              </div>
            </div>
          </div>
        );

      case 'bestPractices':
        return (
          <ul className="space-y-2">
            {Array.isArray(content) ? content.map((practice, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">{practice}</span>
              </li>
            )) : <li className="text-sm text-gray-700">{content}</li>}
          </ul>
        );

      case 'examples':
        if (typeof content === 'object' && !Array.isArray(content)) {
          return (
            <div className="space-y-4">
              {Object.entries(content).map(([projectType, example]) => (
                <div key={projectType} className="border border-purple-200 rounded-lg overflow-hidden">
                  <div className="bg-purple-50 px-3 py-2 border-b border-purple-200">
                    <p className="font-semibold text-purple-900 text-sm">{projectType}</p>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed italic">
                      "{example}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          );
        }
        return <p className="text-sm text-gray-700 italic">"{content}"</p>;

      case 'commonMistakes':
        return (
          <ul className="space-y-2">
            {Array.isArray(content) ? content.map((mistake, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-red-100 text-red-700 rounded-full flex-shrink-0 mt-0.5">
                  <X className="w-3 h-3" />
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">{mistake}</span>
              </li>
            )) : <li className="text-sm text-gray-700">{content}</li>}
          </ul>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub-tabs - Enhanced visibility */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-2 border border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          {subTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                  rounded-md transition-all whitespace-nowrap
                  ${isActive
                    ? 'bg-white text-blue-700 shadow-sm border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 border border-transparent hover:border-gray-200'
                  }
                `}
                type="button"
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab content */}
      <div>
        {renderSubTabContent()}
      </div>
    </div>
  );
};

export default SmartHelpDialog;
