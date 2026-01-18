import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

/**
 * AI Suggestion Button Component
 *
 * Provides AI-powered text suggestions for BEP fields.
 * Displays a sparkle icon that users can click to generate suggestions.
 */
const AISuggestionButton = ({
  fieldName,
  fieldType = 'default',
  currentValue = '',
  onSuggestion,
  onReplace,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingSuggestion, setPendingSuggestion] = useState(null);

  const handleGenerateSuggestion = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/api/ai/suggest', {
        field_type: fieldType,
        partial_text: currentValue,
        max_length: 200
      }, {
        timeout: 30000
      });

      if (response.data.success) {
        const suggestion = response.data.text;

        // Check if there's existing content (more than just whitespace)
        const hasContent = currentValue && currentValue.trim().length > 0;

        if (hasContent) {
          // Show confirmation dialog
          setPendingSuggestion(suggestion);
          setShowConfirmDialog(true);
        } else {
          // No content, insert directly
          onSuggestion(suggestion);
        }
      } else {
        setError(response.data.message || 'Failed to generate suggestion');
      }
    } catch (err) {
      console.error('AI suggestion error:', err);

      if (err.code === 'ECONNABORTED') {
        setError('Request timeout - please try again');
      } else if (err.response?.status === 503) {
        setError('AI service unavailable - please start the ML service');
      } else if (err.response) {
        setError(err.response.data?.message || 'Failed to generate suggestion');
      } else if (err.request) {
        setError('Cannot connect to AI service');
      } else {
        setError('An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReplace = () => {
    if (pendingSuggestion && onReplace) {
      onReplace(pendingSuggestion);
    }
    setShowConfirmDialog(false);
    setPendingSuggestion(null);
  };

  const handleConfirmAppend = () => {
    if (pendingSuggestion) {
      onSuggestion(pendingSuggestion);
    }
    setShowConfirmDialog(false);
    setPendingSuggestion(null);
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    setPendingSuggestion(null);
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleGenerateSuggestion}
        disabled={isLoading}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          inline-flex items-center justify-center
          w-8 h-8 rounded-lg
          transition-all duration-200
          ${isLoading
            ? 'bg-blue-100 text-blue-600 cursor-wait'
            : error
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 hover:from-purple-200 hover:to-blue-200 hover:shadow-md'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        `}
        title="Generate AI suggestion"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : error ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && !isLoading && !error && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none">
          Generate AI suggestion
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 whitespace-nowrap z-50 shadow-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-800 hover:text-red-900 font-medium"
          >
            ✕
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Content Already Exists
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This field already contains text. How would you like to add the AI suggestion?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmReplace}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Replace existing content
              </button>
              <button
                onClick={handleConfirmAppend}
                className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                Append to existing content
              </button>
              <button
                onClick={handleConfirmCancel}
                className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISuggestionButton;
