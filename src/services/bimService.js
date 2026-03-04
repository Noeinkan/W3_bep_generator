/**
 * BIM / IFC import API client.
 * Wraps POST /api/bim/parse-ifc (multipart/form-data).
 */

import axios from 'axios';

const bimClient = axios.create({
  baseURL: '/api',
  timeout: 60000,
  maxContentLength: 52 * 1024 * 1024,
  maxBodyLength: 52 * 1024 * 1024
});

bimClient.interceptors.request.use((config) => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Upload and parse an IFC file. Returns model info and suggested deliverables.
 * @param {File} file - .ifc file from input or drag-drop
 * @returns {Promise<{ projectName, author, organization, ifcSchema, fileDate, description, disciplinesFound, suggestedDeliverables }>}
 */
export async function parseIfcFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await bimClient.post('/bim/parse-ifc', formData);
  return response.data;
}
