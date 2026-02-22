import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

// Use relative URLs to leverage the proxy configuration in package.json
// The proxy in package.json forwards /api/* requests to http://localhost:3001
const API_BASE_URL = '';

const PREFERRED_MODEL_KEY = 'preferredOllamaModel';

function getPreferredModel() {
  return localStorage.getItem(PREFERRED_MODEL_KEY) || undefined;
}

/**
 * Custom hook for AI text suggestions
 *
 * Provides an interface to request AI-generated text suggestions
 * for BEP form fields.
 */
export const useAISuggestion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [thinkingStage, setThinkingStage] = useState('');
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

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
          max_length: maxLength,
          model: getPreferredModel()
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
          temperature: 0.7,
          model: getPreferredModel()
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
   * Stream token-by-token suggestions for a BEP field.
   *
   * @param {string} fieldType - BEP field type
   * @param {string} partialText - Existing text in the field
   * @param {number} maxLength - Max tokens to generate
   * @param {object} callbacks - { onStage, onToken, onDone, onError }
   * @returns {Promise<string>} - Accumulated text on success
   */
  const generateSuggestionStream = useCallback(async (
    fieldType,
    partialText = '',
    maxLength = 200,
    { onStage, onToken, onDone, onError } = {}
  ) => {
    // Cancel any in-flight stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsStreaming(true);
    setIsLoading(true);
    setStreamingText('');
    setThinkingStage('');
    setError(null);

    try {
      const response = await fetch('/api/ai/suggest-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_type: fieldType,
          partial_text: partialText,
          max_length: maxLength,
          model: getPreferredModel()
        }),
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        // SSE events are separated by double newline
        const parts = buffer.split('\n\n');
        buffer = parts.pop(); // keep incomplete chunk

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          let event;
          try { event = JSON.parse(jsonStr); } catch { continue; }

          if (event.type === 'stage') {
            setThinkingStage(event.message);
            onStage?.(event.message);
          } else if (event.type === 'token') {
            accumulated += event.text;
            setStreamingText(accumulated);
            onToken?.(event.text, accumulated);
          } else if (event.type === 'done') {
            setStreamingText(event.fullText);
            onDone?.(event.fullText);
            return event.fullText;
          } else if (event.type === 'error') {
            throw new Error(event.message);
          }
        }
      }

      return accumulated;
    } catch (err) {
      if (err.name === 'AbortError') return '';
      console.error('AI stream error:', err);
      const msg = err.message || 'Streaming failed';
      setError(msg);
      onError?.(msg);
      throw err;
    } finally {
      setIsStreaming(false);
      setIsLoading(false);
      setThinkingStage('');
      abortControllerRef.current = null;
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
    isStreaming,
    streamingText,
    thinkingStage,
    error,
    generateSuggestion,
    generateSuggestionStream,
    generateFromPrompt,
    checkAIHealth,
    clearError
  };
};

export default useAISuggestion;
