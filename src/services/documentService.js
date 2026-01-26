/**
 * Document Service
 *
 * API client for managing client documents (EIR, etc.)
 * Used for uploading, analyzing, and retrieving document analysis for BEP generation.
 */

import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: '/api/documents',
  timeout: 180000 // 3 minutes default
});

// Longer timeout for AI analysis operations (10 minutes)
const ANALYSIS_TIMEOUT = 600000;

// Timeout configurations
const longTimeoutConfig = { timeout: ANALYSIS_TIMEOUT };

// Create AI client for health checks
const aiClient = axios.create({
  baseURL: '/api/ai',
  timeout: 5000
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Apply auth interceptor to AI client as well
aiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Centralized error handling for API calls
 * @param {Promise} apiCall - The API call promise to execute
 * @returns {Promise<object>} Response data or error object
 */
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall;
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status
    };
  }
};

/**
 * Upload one or more documents
 * @param {File[]} files - Array of File objects to upload
 * @param {string} userId - User ID
 * @param {string} [draftId] - Optional draft ID to link documents to
 * @param {function} [onProgress] - Optional progress callback (0-100)
 * @returns {Promise<{success: boolean, documents: object[]}>}
 */
export const uploadDocuments = async (files, userId, draftId = null, onProgress = null) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('files', file);
  });

  formData.append('userId', userId);
  if (draftId) {
    formData.append('draftId', draftId);
  }

  return handleApiCall(
    apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    })
  );
};

/**
 * Get all documents for a user
 * @param {string} userId - User ID
 * @param {string} [draftId] - Optional draft ID to filter by
 * @returns {Promise<{success: boolean, documents: object[]}>}
 */
export const getDocuments = async (userId, draftId = null) => {
  const params = { userId };
  if (draftId) {
    params.draftId = draftId;
  }

  return handleApiCall(apiClient.get('/', { params }));
};

/**
 * Get a specific document by ID
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, document: object}>}
 */
export const getDocument = async (documentId, userId) => {
  return handleApiCall(
    apiClient.get(`/${documentId}`, {
      params: { userId }
    })
  );
};

/**
 * Delete a document
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteDocument = async (documentId, userId) => {
  return handleApiCall(
    apiClient.delete(`/${documentId}`, {
      params: { userId }
    })
  );
};

/**
 * Extract text from a document
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, data: {textLength: number, pages: number, wordCount: number}}>}
 */
export const extractText = async (documentId, userId) => {
  return handleApiCall(apiClient.post(`/${documentId}/extract`, { userId }));
};

/**
 * Analyze a document with AI (requires text to be extracted first)
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @param {AbortSignal} [signal] - Optional AbortSignal for cancellation
 * @returns {Promise<{success: boolean, data: {analysisJson: object, summaryMarkdown: string}}>}
 */
export const analyzeDocument = async (documentId, userId, signal = null) => {
  return handleApiCall(
    apiClient.post(
      `/${documentId}/analyze`,
      { userId },
      { ...longTimeoutConfig, signal }
    )
  );
};

/**
 * Extract text and analyze in one operation
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @param {AbortSignal} [signal] - Optional AbortSignal for cancellation
 * @returns {Promise<{success: boolean, data: {analysisJson: object, summaryMarkdown: string}}>}
 */
export const extractAndAnalyze = async (documentId, userId, signal = null) => {
  return handleApiCall(
    apiClient.post(
      `/${documentId}/extract-and-analyze`,
      { userId },
      { ...longTimeoutConfig, signal }
    )
  );
};

/**
 * Link a document to a draft
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @param {string} draftId - Draft ID to link to
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const linkDocumentToDraft = async (documentId, userId, draftId) => {
  return handleApiCall(
    apiClient.put(`/${documentId}/link-draft`, {
      userId,
      draftId
    })
  );
};

/**
 * Get analysis data for a document
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<{analysisJson: object, summaryMarkdown: string} | null>}
 */
export const getDocumentAnalysis = async (documentId, userId) => {
  const result = await getDocument(documentId, userId);
  if (result.success && result.document) {
    return {
      analysisJson: result.document.analysisJson,
      summaryMarkdown: result.document.summary_markdown
    };
  }
  return null;
};

/**
 * Get the latest analyzed document for a draft
 * @param {string} userId - User ID
 * @param {string} draftId - Draft ID
 * @returns {Promise<object | null>}
 */
export const getLatestAnalyzedDocument = async (userId, draftId) => {
  const result = await getDocuments(userId, draftId);
  if (result.success && result.documents) {
    // Find the most recent analyzed document with explicit sorting
    const analyzedDocs = result.documents
      .filter(doc => doc.status === 'analyzed')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (analyzedDocs.length > 0) {
      return analyzedDocs[0];
    }
  }
  return null;
};

/**
 * Check if ML service is available
 * @returns {Promise<boolean>}
 */
export const checkMLServiceHealth = async () => {
  try {
    const response = await aiClient.get('/health');
    return response.data.status === 'ok';
  } catch {
    return false;
  }
};
