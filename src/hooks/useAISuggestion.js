import { useState, useCallback } from 'react';
import axios from 'axios';

// Use relative URLs to leverage the proxy configuration in package.json
// The proxy in package.json forwards /api/* requests to http://localhost:3001
const API_BASE_URL = '';

/**
 * Custom hook for AI text suggestions
 *
 * Provides an interface to request AI-generated text suggestions
 * for BEP form fields.
 */
export const useAISuggestion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generate a suggestion for a specific field
   */
  const generateSuggestion = useCallback(async (fieldType, partialText = '', maxLength = 200) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/ai/suggest`,
        {
          field_type: fieldType,
          partial_text: partialText,
          max_length: maxLength
        },
        {
          timeout: 30000
        }
      );

      if (response.data.success) {
        return response.data.text;
      } else {
        throw new Error(response.data.message || 'Failed to generate suggestion');
      }
    } catch (err) {
      console.error('AI suggestion error:', err);

      let errorMessage = 'Failed to generate suggestion';

      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - please try again';
      } else if (err.response?.status === 503) {
        errorMessage = 'AI service unavailable';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = 'Cannot connect to AI service';
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generate text based on a custom prompt
   */
  const generateFromPrompt = useCallback(async (prompt, fieldType = null, maxLength = 200) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/ai/generate`,
        {
          prompt,
          field_type: fieldType,
          max_length: maxLength,
          temperature: 0.7
        },
        {
          timeout: 30000
        }
      );

      if (response.data.success) {
        return response.data.text;
      } else {
        throw new Error(response.data.message || 'Failed to generate text');
      }
    } catch (err) {
      console.error('AI generation error:', err);

      let errorMessage = 'Failed to generate text';

      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - please try again';
      } else if (err.response?.status === 503) {
        errorMessage = 'AI service unavailable';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = 'Cannot connect to AI service';
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check if AI service is available
   */
  const checkAIHealth = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/ai/health`, {
        timeout: 5000
      });

      return {
        available: response.data.status === 'ok',
        details: response.data
      };
    } catch (err) {
      return {
        available: false,
        error: err.message
      };
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    generateSuggestion,
    generateFromPrompt,
    checkAIHealth,
    clearError
  };
};

export default useAISuggestion;
