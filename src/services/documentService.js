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
  timeout: 180000 // 3 minutes for long operations like analysis
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

  const response = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    }
  });

  return response.data;
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

  const response = await apiClient.get('/', { params });
  return response.data;
};

/**
 * Get a specific document by ID
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, document: object}>}
 */
export const getDocument = async (documentId, userId) => {
  const response = await apiClient.get(`/${documentId}`, {
    params: { userId }
  });
  return response.data;
};

/**
 * Delete a document
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteDocument = async (documentId, userId) => {
  const response = await apiClient.delete(`/${documentId}`, {
    params: { userId }
  });
  return response.data;
};

/**
 * Extract text from a document
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, data: {textLength: number, pages: number, wordCount: number}}>}
 */
export const extractText = async (documentId, userId) => {
  const response = await apiClient.post(`/${documentId}/extract`, { userId });
  return response.data;
};

/**
 * Analyze a document with AI (requires text to be extracted first)
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, data: {analysisJson: object, summaryMarkdown: string}}>}
 */
export const analyzeDocument = async (documentId, userId) => {
  const response = await apiClient.post(`/${documentId}/analyze`, { userId });
  return response.data;
};

/**
 * Extract text and analyze in one operation
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, data: {analysisJson: object, summaryMarkdown: string}}>}
 */
export const extractAndAnalyze = async (documentId, userId) => {
  const response = await apiClient.post(`/${documentId}/extract-and-analyze`, { userId });
  return response.data;
};

/**
 * Link a document to a draft
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @param {string} draftId - Draft ID to link to
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const linkDocumentToDraft = async (documentId, userId, draftId) => {
  const response = await apiClient.put(`/${documentId}/link-draft`, {
    userId,
    draftId
  });
  return response.data;
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
    // Find the most recent analyzed document
    const analyzedDocs = result.documents.filter(doc => doc.status === 'analyzed');
    if (analyzedDocs.length > 0) {
      return analyzedDocs[0]; // Already sorted by created_at DESC
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
    const response = await axios.get('/api/ai/health', { timeout: 5000 });
    return response.data.status === 'ok';
  } catch {
    return false;
  }
};

// Export all functions as named exports
export default {
  uploadDocuments,
  getDocuments,
  getDocument,
  deleteDocument,
  extractText,
  analyzeDocument,
  extractAndAnalyze,
  linkDocumentToDraft,
  getDocumentAnalysis,
  getLatestAnalyzedDocument,
  checkMLServiceHealth
};
