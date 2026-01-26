/**
 * EIR Suggest Button Component
 *
 * A button that appears on form fields when EIR analysis data is available.
 * Clicking it generates AI suggestions based on the EIR analysis.
 */

import { useState } from 'react';
import { Sparkles, Loader2, Check, X } from 'lucide-react';
import { useEir } from '../../contexts/EirContext';

const EirSuggestButton = ({ fieldName, onSuggestion, partialText = '', className = '' }) => {
  const { hasAnalysis, hasDataForField, getSuggestionForField, isLoading } = useEir();
  const [localLoading, setLocalLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState(null);

  // Don't render if no EIR analysis or no data for this field
  if (!hasAnalysis || !hasDataForField(fieldName)) {
    return null;
  }

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLocalLoading(true);
    setError(null);

    try {
      const suggestion = await getSuggestionForField(fieldName, partialText);

      if (suggestion && onSuggestion) {
        onSuggestion(suggestion);
      }
    } catch (err) {
      console.error('EIR suggestion error:', err);
      setError(err.message || 'Suggestion failed');
    } finally {
      setLocalLoading(false);
    }
  };

  const loading = localLoading || isLoading;

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
          rounded-lg transition-all duration-200
          ${loading
            ? 'bg-purple-100 text-purple-400 cursor-wait'
            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800'
          }
          border border-purple-200 hover:border-purple-300
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1
        `}
        title="Suggest from EIR"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Suggest from EIR</span>
      </button>

      {/* Tooltip */}
      {showTooltip && !loading && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50">
          Generate a suggestion based on EIR analysis
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}

      {/* Error tooltip */}
      {error && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg whitespace-nowrap z-50">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 hover:opacity-80"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Inline version of the button (icon only)
 */
export const EirSuggestIcon = ({ fieldName, onSuggestion, partialText = '' }) => {
  const { hasAnalysis, hasDataForField, getSuggestionForField, isLoading } = useEir();
  const [localLoading, setLocalLoading] = useState(false);

  if (!hasAnalysis || !hasDataForField(fieldName)) {
    return null;
  }

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLocalLoading(true);

    try {
      const suggestion = await getSuggestionForField(fieldName, partialText);
      if (suggestion && onSuggestion) {
        onSuggestion(suggestion);
      }
    } catch (err) {
      console.error('EIR suggestion error:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  const loading = localLoading || isLoading;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`
        p-1.5 rounded-md transition-colors
        ${loading
          ? 'text-purple-400 cursor-wait'
          : 'text-purple-500 hover:text-purple-700 hover:bg-purple-50'
        }
      `}
      title="Suggest from EIR"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
    </button>
  );
};

/**
 * Banner version that shows when EIR data is available for the current step
 */
export const EirDataBanner = ({ stepFields = [], onFieldClick }) => {
  const { hasAnalysis, hasDataForField, getFieldsWithData } = useEir();

  if (!hasAnalysis) return null;

  // Check which fields in this step have EIR data
  const fieldsWithData = stepFields.filter(field => hasDataForField(field.name));

  if (fieldsWithData.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-purple-900">
            EIR data available for this section
          </h4>
          <p className="text-sm text-purple-700 mt-1">
            {fieldsWithData.length} field(s) can be pre-filled with data extracted from the EIR:
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {fieldsWithData.map(field => (
              <button
                key={field.name}
                onClick={() => onFieldClick?.(field.name)}
                className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
              >
                {field.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EirSuggestButton;
