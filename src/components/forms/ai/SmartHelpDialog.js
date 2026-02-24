import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  FileText,
  HelpCircle,
  BookOpen,
  Shield,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { Modal } from '../../common';
import COMMERCIAL_OFFICE_TEMPLATE from '../../../data/templates/commercialOfficeTemplate';
import { markdownToTipTapHtml } from '../../../utils/markdownToHtml';
import FIELD_EXAMPLES from '../../../constants/fieldExamples';
import AIAssistantTab from './AIAssistantTab';
import { useAISuggestion } from '../../../hooks/useAISuggestion';

/**
 * SmartHelpDialog - Context-aware help dialog
 *
 * Three tabs:
 *   1. AI Assistant (Quick AI + Guided AI)
 *   2. Guidelines
 *   3. Examples / Reference
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
    return [
      { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, priority: 1 },
      { id: 'guidelines', label: 'Guidelines', icon: HelpCircle, priority: 2 },
      { id: 'examples', label: fieldState === 'empty' ? 'Examples' : 'Reference', icon: FileText, priority: 3 }
    ];
  };

  const tabs = getTabsConfig();
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // AI State — loading/error/streaming from hook, success is local
  const {
    isLoading: aiLoading,
    error: aiError,
    isStreaming,
    streamingText,
    thinkingStage,
    generateSuggestionStream,
    generateSuggestion,
    clearError
  } = useAISuggestion();
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

  // AI Generate (for empty fields) — streams tokens, falls back to non-streaming on error
  const handleAIGenerate = async () => {
    if (!editor) return;
    clearError();
    setAiSuccess(false);

    const insertAndClose = (text) => {
      const htmlContent = markdownToTipTapHtml(text);
      editor.chain().focus().setContent(htmlContent).run();
      setAiSuccess(true);
      setTimeout(() => onClose(), 1500);
    };

    try {
      await generateSuggestionStream(fieldType || fieldName, '', 200, {
        onDone: insertAndClose
      });
    } catch {
      // Streaming failed — try non-streaming fallback
      try {
        const text = await generateSuggestion(fieldType || fieldName, '', 200);
        insertAndClose(text);
      } catch {
        // hook already set error state
      }
    }
  };

  // AI Improve (for existing content) — streams tokens, falls back to non-streaming on error
  const handleAIImprove = async (replaceAll = false) => {
    if (!editor) return;
    clearError();
    setAiSuccess(false);

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

    const instructions = [];
    if (improveOptions.grammar) instructions.push('improve grammar and clarity');
    if (improveOptions.professional) instructions.push('make more professional');
    if (improveOptions.iso19650) instructions.push('add ISO 19650 terminology');
    if (improveOptions.expand) instructions.push('expand with more details');
    if (improveOptions.concise) instructions.push('make more concise');

    const tableGuidance = isTabularCandidate(currentContent)
      ? 'Convert this content into a concise HTML table with a header row. Limit the table to 15 rows total (including header) and a maximum of 6 columns. Use <table>, <thead>, <tbody>, <tr>, <th>, <td>. Output ONLY the table — do not repeat or restate the same data as prose, headings, or bullet points after the table.'
      : 'Only use a table when the content structure clearly implies tabular data. If you include a table, limit it to 15 rows total (including header) and a maximum of 6 columns, use HTML table tags, and output ONLY the table — do not repeat the same information as prose or bullet points after it.';

    const prompt = instructions.length > 0
      ? `Rewrite the following text to ${instructions.join(', ')}. ${tableGuidance} Output ONLY the final result as a single coherent structure — no introduction, explanation, or commentary, and no duplication of content.\n\nText to improve:\n${currentContent}`
      : `Reformat the following text into a clean, professional structure. ${tableGuidance} Output ONLY the final result — no introduction, commentary, or duplication of content.\n\nText to reformat:\n${currentContent}`;

    const insertAndClose = (text) => {
      const htmlContent = markdownToTipTapHtml(text);
      if (replaceAll) {
        editor.chain().focus().clearContent().insertContent(htmlContent).run();
      } else {
        editor.chain().focus().insertContent(htmlContent).run();
      }
      setAiSuccess(true);
      setTimeout(() => onClose(), 1500);
    };

    try {
      await generateSuggestionStream(fieldType || fieldName, prompt, 300, {
        onDone: insertAndClose
      });
    } catch {
      // Streaming failed — try non-streaming fallback
      try {
        const text = await generateSuggestion(fieldType || fieldName, prompt, 300);
        insertAndClose(text);
      } catch {
        // hook already set error state
      }
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'ai-assistant':
        return <AIAssistantTab
          editor={editor}
          fieldName={fieldName}
          fieldType={fieldType}
          fieldState={fieldState}
          onClose={onClose}
          aiLoading={aiLoading}
          aiError={aiError}
          aiSuccess={aiSuccess}
          handleAIGenerate={handleAIGenerate}
          handleAIImprove={handleAIImprove}
          improveOptions={improveOptions}
          setImproveOptions={setImproveOptions}
          streamingText={streamingText}
          thinkingStage={thinkingStage}
          isStreaming={isStreaming}
        />;

      case 'examples':
        return <ExamplesTab
          fieldName={fieldName}
          fieldState={fieldState}
          onLoadExample={handleLoadExample}
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
        <div ref={contentRef} className="flex-1 min-h-0 overflow-y-auto -mx-6 -mb-4 p-6">
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
