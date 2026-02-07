import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Replace,
  PlusCircle,
  Wand2,
  X
} from 'lucide-react';
import axios from 'axios';
import { markdownToTipTapHtml } from '../../../utils/markdownToHtml';

/**
 * GuidedAIWizardTab — Inline wizard that lives inside SmartHelpDialog's tab area.
 *
 * Phases: loading → questions → generating → result → error
 */
const GuidedAIWizardTab = ({ editor, fieldName, fieldType, onClose }) => {
  const [phase, setPhase] = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionsTotal, setQuestionsTotal] = useState(0);
  const [error, setError] = useState(null);

  // ── Fetch questions ──
  const fetchQuestions = useCallback(async () => {
    setPhase('loading');
    setError(null);

    try {
      const response = await axios.post('/api/ai/generate-questions', {
        field_type: fieldType || fieldName,
        field_label: fieldName,
        field_context: null
      }, { timeout: 30000 });

      if (response.data.success && response.data.questions?.length > 0) {
        setQuestions(response.data.questions);
        setCurrentIndex(0);
        setAnswers({});
        setPhase('questions');
      } else {
        setError('No questions were generated. Please try again.');
        setPhase('error');
      }
    } catch (err) {
      console.error('Guided AI — failed to fetch questions:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please check if the AI service is running.');
      } else if (err.response?.status === 503) {
        setError('AI service is unavailable. Please start the ML service.');
      } else {
        setError(err.response?.data?.message || 'Failed to generate questions. Please try again.');
      }
      setPhase('error');
    }
  }, [fieldType, fieldName]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  // ── Generate content ──
  const generateContent = useCallback(async () => {
    setPhase('generating');
    setError(null);

    const answerList = questions.map(q => ({
      question_id: q.id,
      question_text: q.text,
      answer: answers[q.id]?.trim() || null
    }));

    try {
      const response = await axios.post('/api/ai/generate-from-answers', {
        field_type: fieldType || fieldName,
        field_label: fieldName,
        answers: answerList,
        field_context: null
      }, { timeout: 60000 });

      if (response.data.success) {
        setGeneratedContent(response.data.text);
        setQuestionsAnswered(response.data.questions_answered);
        setQuestionsTotal(response.data.questions_total);
        setPhase('result');
      } else {
        setError(response.data.message || 'Content generation failed.');
        setPhase('error');
      }
    } catch (err) {
      console.error('Guided AI — generation failed:', err);
      setError(err.response?.data?.message || 'Content generation failed. Please try again.');
      setPhase('error');
    }
  }, [questions, answers, fieldType, fieldName]);

  // ── Navigation helpers ──
  const handleAnswerChange = (value) => {
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      generateContent();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleSkip = () => {
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: null }));
    handleNext();
  };

  const handleSkipAll = () => {
    setAnswers({});
    generateContent();
  };

  const handleRetry = () => {
    if (questions.length === 0) fetchQuestions();
    else generateContent();
  };

  // ── Content insertion ──
  const handleReplace = () => {
    if (editor && generatedContent) {
      const htmlContent = markdownToTipTapHtml(generatedContent);
      editor.chain().focus().setContent(htmlContent).run();
    }
    onClose();
  };

  const handleAppend = () => {
    if (editor && generatedContent) {
      const htmlContent = markdownToTipTapHtml(generatedContent);
      editor.chain().focus().insertContentAt(editor.state.doc.content.size, htmlContent).run();
    }
    onClose();
  };

  // ╔══════════════════════════════════════════╗
  // ║             RENDER                       ║
  // ╚══════════════════════════════════════════╝

  // ── Loading ──
  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <p className="text-sm text-gray-600">
          Preparing questions for <span className="font-medium">{fieldName}</span>…
        </p>
      </div>
    );
  }

  // ── Error ──
  if (phase === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h4 className="text-lg font-semibold text-red-800 mb-2">Generation Failed</h4>
        <p className="text-sm text-red-600 text-center mb-6 max-w-md">{error}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  // ── Questions ──
  if (phase === 'questions' && questions.length > 0) {
    const q = questions[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === questions.length - 1;

    return (
      <div className="space-y-4">
        {/* Intro */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Wand2 className="text-amber-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Guided AI Content Wizard</h4>
              <p className="text-sm text-amber-800">
                Answer a few questions so the AI can generate content tailored to your project.
                You can skip any question.
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <button
            type="button"
            onClick={handleSkipAll}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          >
            <SkipForward size={12} /> Skip All & Auto-generate
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-1">{q.text}</h4>
          {q.hint && (
            <p className="text-sm text-gray-500 italic">💡 {q.hint}</p>
          )}
        </div>

        {/* Answer */}
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm"
          rows={4}
          placeholder="Type your answer here… (or skip this question)"
          value={answers[q.id] || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleNext(); } }}
          autoFocus
        />

        {/* Nav */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={isFirst}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <SkipForward size={16} /> Skip
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm"
          >
            {isLast ? 'Generate' : 'Next'}
            {!isLast && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    );
  }

  // ── Generating ──
  if (phase === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Generating content…</h4>
        <p className="text-sm text-gray-500">
          Using your answers to create tailored content
        </p>
        <div className="w-48 bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    );
  }

  // ── Result ──
  if (phase === 'result') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h4 className="text-base font-semibold text-gray-900">Content Generated</h4>
          <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Used {questionsAnswered} of {questionsTotal} answers
          </span>
        </div>

        <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 overflow-y-auto max-h-[250px]">
          <div
            className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: generatedContent }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReplace}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Replace size={16} /> Replace
          </button>
          <button
            type="button"
            onClick={handleAppend}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
          >
            <PlusCircle size={16} /> Append
          </button>
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GuidedAIWizardTab;
