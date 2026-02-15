import axios from 'axios';

// Use relative URL to leverage proxy configuration
// The proxy in package.json forwards requests to http://localhost:3001
const BASE_URL = '/api';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const debugLog = (...args) => {
  if (!IS_PRODUCTION) {
    console.log(...args);
  }
};

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    debugLog(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    debugLog(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    return response;
  },
  (error) => {
    const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 0;
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, error.response?.data);

    // Handle common HTTP errors
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

class ApiService {
  // ======================
  // Internal helpers
  // ======================

  async _request(fn, errorMsg) {
    try {
      return await fn();
    } catch (error) {
      throw this.handleError(error, errorMsg);
    }
  }

  _get(url, errorMsg, config) {
    return this._request(async () => {
      const response = await apiClient.get(url, config);
      return response.data;
    }, errorMsg);
  }

  _post(url, data, errorMsg, config) {
    return this._request(async () => {
      const response = await apiClient.post(url, data, config);
      return response.data;
    }, errorMsg);
  }

  _put(url, data, errorMsg) {
    return this._request(async () => {
      const response = await apiClient.put(url, data);
      return response.data;
    }, errorMsg);
  }

  _delete(url, errorMsg) {
    return this._request(async () => {
      const response = await apiClient.delete(url);
      return response.data;
    }, errorMsg);
  }

  _postBlob(url, data, errorMsg, filename) {
    return this._request(async () => {
      const response = await apiClient.post(url, data, { responseType: 'blob' });
      return this.downloadFile(response, filename);
    }, errorMsg);
  }

  // ======================
  // TIDP Services
  // ======================

  getAllTIDPs(projectId = null) {
    const params = projectId ? { projectId } : {};
    return this._get('/tidp', 'Failed to fetch TIDPs', { params });
  }

  getTIDP(id) {
    return this._get(`/tidp/${id}`, `Failed to fetch TIDP ${id}`);
  }

  createTIDP(tidpData) {
    return this._post('/tidp', tidpData, 'Failed to create TIDP');
  }

  importTIDPsFromExcel(excelData, projectId) {
    return this._post('/tidp/import/excel', { data: excelData, projectId }, 'Failed to import TIDPs from Excel');
  }

  importTIDPsFromCSV(csvData, projectId) {
    return this._post('/tidp/import/csv', { data: csvData, projectId }, 'Failed to import TIDPs from CSV');
  }

  getTIDPImportTemplate() {
    return this._get('/tidp/template/excel', 'Failed to fetch TIDP import template');
  }

  updateTIDP(id, updateData) {
    return this._put(`/tidp/${id}`, updateData, `Failed to update TIDP ${id}`);
  }

  deleteTIDP(id) {
    return this._delete(`/tidp/${id}`, `Failed to delete TIDP ${id}`);
  }

  validateTIDPDependencies(id) {
    return this._post(`/tidp/${id}/validate-dependencies`, undefined, `Failed to validate TIDP dependencies for ${id}`);
  }

  getTIDPSummary(id) {
    return this._get(`/tidp/${id}/summary`, `Failed to get TIDP summary for ${id}`);
  }

  generateDependencyMatrix(projectId) {
    return this._get(`/tidp/project/${projectId}/dependency-matrix`, `Failed to generate dependency matrix for project ${projectId}`);
  }

  getResourceAllocation(projectId) {
    return this._get(`/tidp/project/${projectId}/resource-allocation`, `Failed to get resource allocation for project ${projectId}`);
  }

  createTIDPBatch(tidps) {
    return this._post('/tidp/batch', { tidps }, 'Failed to create TIDPs in batch');
  }

  updateTIDPBatch(updates) {
    return this._put('/tidp/batch', { updates }, 'Failed to update TIDPs in batch');
  }

  // ======================
  // MIDP Services
  // ======================

  getAllMIDPs() {
    return this._get('/midp', 'Failed to fetch MIDPs');
  }

  getMIDP(id) {
    return this._get(`/midp/${id}`, `Failed to fetch MIDP ${id}`);
  }

  createMIDPFromTIDPs(midpData, tidpIds) {
    return this._post('/midp/from-tidps', { midpData, tidpIds }, 'Failed to create MIDP from TIDPs');
  }

  autoGenerateMIDP(projectId, midpData = {}) {
    return this._post(`/midp/auto-generate/${projectId}`, midpData, 'Failed to auto-generate MIDP');
  }

  autoGenerateMIDPAll(midpData = {}) {
    return this._post('/midp/auto-generate', midpData, 'Failed to auto-generate MIDP from all TIDPs');
  }

  getMIDPEvolution(id) {
    return this._get(`/midp/${id}/evolution`, 'Failed to fetch MIDP evolution');
  }

  getMIDPDeliverablesDashboard(id) {
    return this._get(`/midp/${id}/deliverables-dashboard`, 'Failed to fetch MIDP deliverables dashboard');
  }

  updateMIDPFromTIDPs(id, tidpIds) {
    return this._put(`/midp/${id}/update-from-tidps`, { tidpIds }, `Failed to update MIDP ${id} from TIDPs`);
  }

  deleteMIDP(id) {
    return this._delete(`/midp/${id}`, `Failed to delete MIDP ${id}`);
  }

  getMIDPDeliverySchedule(id) {
    return this._get(`/midp/${id}/delivery-schedule`, `Failed to get delivery schedule for MIDP ${id}`);
  }

  getMIDPRiskRegister(id) {
    return this._get(`/midp/${id}/risk-register`, `Failed to get risk register for MIDP ${id}`);
  }

  getMIDPDependencyMatrix(id) {
    return this._get(`/midp/${id}/dependency-matrix`, `Failed to get dependency matrix for MIDP ${id}`);
  }

  getMIDPResourcePlan(id) {
    return this._get(`/midp/${id}/resource-plan`, `Failed to get resource plan for MIDP ${id}`);
  }

  getMIDPAggregatedData(id) {
    return this._get(`/midp/${id}/aggregated-data`, `Failed to get aggregated data for MIDP ${id}`);
  }

  getMIDPQualityGates(id) {
    return this._get(`/midp/${id}/quality-gates`, `Failed to get quality gates for MIDP ${id}`);
  }

  getMIDPMilestones(id) {
    return this._get(`/midp/${id}/milestones`, `Failed to get milestones for MIDP ${id}`);
  }

  refreshMIDP(id) {
    return this._post(`/midp/${id}/refresh`, undefined, `Failed to refresh MIDP ${id}`);
  }

  getMIDPDashboard(id) {
    return this._get(`/midp/${id}/dashboard`, `Failed to get dashboard for MIDP ${id}`);
  }

  getMIDPCascadingImpact(id) {
    return this._get(`/midp/${id}/cascading-impact`, `Failed to get cascading impact for MIDP ${id}`);
  }

  getMIDPTrends(id) {
    return this._get(`/midp/${id}/trends`, `Failed to get trends for MIDP ${id}`);
  }

  // ======================
  // Responsibility Matrix Services
  // ======================

  // IM Activities (Matrix 1)
  getIMActivities(projectId) {
    return this._get('/responsibility-matrix/im-activities', 'Failed to fetch IM activities', { params: { projectId } });
  }

  getIMActivity(id) {
    return this._get(`/responsibility-matrix/im-activities/${id}`, `Failed to fetch IM activity ${id}`);
  }

  createIMActivity(activityData) {
    return this._post('/responsibility-matrix/im-activities', activityData, 'Failed to create IM activity');
  }

  updateIMActivity(id, updates) {
    return this._put(`/responsibility-matrix/im-activities/${id}`, updates, `Failed to update IM activity ${id}`);
  }

  deleteIMActivity(id) {
    return this._delete(`/responsibility-matrix/im-activities/${id}`, `Failed to delete IM activity ${id}`);
  }

  bulkCreateIMActivities(activities) {
    return this._post('/responsibility-matrix/im-activities/bulk', { activities }, 'Failed to bulk create IM activities');
  }

  // Information Deliverables (Matrix 2)
  getDeliverables(projectId, filters = {}) {
    return this._get('/responsibility-matrix/deliverables', 'Failed to fetch deliverables', { params: { projectId, ...filters } });
  }

  getDeliverablesGroupedByStage(projectId) {
    return this._get('/responsibility-matrix/deliverables/grouped-by-stage', 'Failed to fetch grouped deliverables', { params: { projectId } });
  }

  getDeliverablesByTIDP(tidpId) {
    return this._get(`/responsibility-matrix/deliverables/by-tidp/${tidpId}`, `Failed to fetch deliverables for TIDP ${tidpId}`);
  }

  getDeliverable(id) {
    return this._get(`/responsibility-matrix/deliverables/${id}`, `Failed to fetch deliverable ${id}`);
  }

  createDeliverable(deliverableData) {
    return this._post('/responsibility-matrix/deliverables', deliverableData, 'Failed to create deliverable');
  }

  updateDeliverable(id, updates) {
    return this._put(`/responsibility-matrix/deliverables/${id}`, updates, `Failed to update deliverable ${id}`);
  }

  deleteDeliverable(id) {
    return this._delete(`/responsibility-matrix/deliverables/${id}`, `Failed to delete deliverable ${id}`);
  }

  // TIDP Synchronization
  syncTIDPs(projectId, options = {}) {
    return this._post('/responsibility-matrix/sync-tidps', { projectId, ...options }, 'Failed to sync TIDPs');
  }

  syncSingleTIDP(tidpId, projectId, options = {}) {
    return this._post(`/responsibility-matrix/sync-tidps/${tidpId}`, { projectId, ...options }, `Failed to sync TIDP ${tidpId}`);
  }

  getSyncStatus(projectId) {
    return this._get('/responsibility-matrix/sync-status', 'Failed to get sync status', { params: { projectId } });
  }

  unsyncTIDP(tidpId) {
    return this._delete(`/responsibility-matrix/sync-tidps/${tidpId}`, `Failed to unsync TIDP ${tidpId}`);
  }

  // Responsibility Matrix Exports
  exportResponsibilityMatricesExcel(projectId, projectName, options = {}) {
    const filename = `Responsibility_Matrices_${projectName?.replace(/\s+/g, '_') || 'Project'}.xlsx`;
    return this._postBlob('/export/responsibility-matrix/excel', { projectId, projectName, options }, 'Failed to export responsibility matrices to Excel', filename);
  }

  exportResponsibilityMatricesPDF(projectId, projectName, options = {}) {
    const filename = `Responsibility_Matrices_${projectName?.replace(/\s+/g, '_') || 'Project'}.pdf`;
    return this._postBlob('/export/responsibility-matrix/pdf', { projectId, projectName, options }, 'Failed to export responsibility matrices to PDF', filename);
  }

  // ======================
  // Export Services
  // ======================

  exportTIDPToExcel(id, template = null) {
    return this._postBlob(`/export/tidp/${id}/excel`, template ? { template } : {}, `Failed to export TIDP ${id} to Excel`, `TIDP_${id}.xlsx`);
  }

  exportTIDPToPDF(id, template = null) {
    return this._postBlob(`/export/tidp/${id}/pdf`, template ? { template } : {}, `Failed to export TIDP ${id} to PDF`, `TIDP_${id}.pdf`);
  }

  exportMIDPToExcel(id, template = null) {
    return this._postBlob(`/export/midp/${id}/excel`, template ? { template } : {}, `Failed to export MIDP ${id} to Excel`, `MIDP_${id}.xlsx`);
  }

  exportMIDPToPDF(id, template = null) {
    return this._postBlob(`/export/midp/${id}/pdf`, template ? { template } : {}, `Failed to export MIDP ${id} to PDF`, `MIDP_${id}.pdf`);
  }

  exportConsolidatedProject(projectId, midpId) {
    return this._postBlob(`/export/project/${projectId}/consolidated-excel`, { midpId }, `Failed to export consolidated project ${projectId}`, `Project_${projectId}_Consolidated.xlsx`);
  }

  getExportFormats() {
    return this._get('/export/formats', 'Failed to get export formats');
  }

  getExportTemplates() {
    return this._get('/export/templates', 'Failed to get export templates');
  }

  getTIDPExportPreview(id, format, template = null) {
    const body = template ? { format, template } : { format };
    return this._post(`/export/preview/tidp/${id}`, body, `Failed to get TIDP ${id} export preview`);
  }

  getMIDPExportPreview(id, format, template = null) {
    const body = template ? { format, template } : { format };
    return this._post(`/export/preview/midp/${id}`, body, `Failed to get MIDP ${id} export preview`);
  }

  // ======================
  // Validation Services
  // ======================

  validateTIDP(id) {
    return this._post(`/validation/tidp/${id}`, undefined, `Failed to validate TIDP ${id}`);
  }

  validateMIDP(id) {
    return this._post(`/validation/midp/${id}`, undefined, `Failed to validate MIDP ${id}`);
  }

  validateProjectComprehensive(projectId, midpId) {
    return this._post(`/validation/project/${projectId}/comprehensive`, { midpId }, `Failed to validate project ${projectId} comprehensively`);
  }

  getISO19650Standards() {
    return this._get('/validation/standards/iso19650', 'Failed to get ISO 19650 standards');
  }

  // ======================
  // Utility Methods
  // ======================

  downloadFile(response, defaultFilename) {
    try {
      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      let filename = defaultFilename;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          filename = fileNameMatch[1];
        }
      }

      // Create blob and download
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error) {
      console.error('Failed to download file:', error);
      throw new Error('Failed to download file');
    }
  }

  handleError(error, defaultMessage) {
    // If server responded with structured error, prefer that
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }

    // Validation error with details
    if (error.response?.data?.details) {
      const details = error.response.data.details;
      const detailMessages = Array.isArray(details)
        ? details.map(d => d.message || d).join(', ')
        : details;
      return new Error(`${defaultMessage}: ${detailMessages}`);
    }

    // Network errors (no response)
    if (error.request && !error.response) {
      const code = error.code ? ` (${error.code})` : '';
      return new Error(`${defaultMessage}: Network error${code} - unable to reach server at ${BASE_URL}`);
    }

    // Fallback to any message present
    if (error.message) {
      return new Error(`${defaultMessage}: ${error.message}`);
    }

    return new Error(defaultMessage);
  }

  // ======================
  // IDRM (Information Deliverables Responsibility Matrix) Services
  // ======================

  // IM Activities
  getAllIMActivities(projectId = null) {
    const params = projectId ? { projectId } : {};
    return this._get('/idrm/im-activities', 'Failed to fetch IM activities', { params });
  }

  getIDRMIMActivity(id) {
    return this._get(`/idrm/im-activities/${id}`, `Failed to fetch IM activity ${id}`);
  }

  createIDRMIMActivity(activityData) {
    return this._post('/idrm/im-activities', activityData, 'Failed to create IM activity');
  }

  updateIDRMIMActivity(id, activityData) {
    return this._put(`/idrm/im-activities/${id}`, activityData, `Failed to update IM activity ${id}`);
  }

  deleteIDRMIMActivity(id) {
    return this._delete(`/idrm/im-activities/${id}`, `Failed to delete IM activity ${id}`);
  }

  // Deliverables
  getAllDeliverables(projectId = null) {
    const params = projectId ? { projectId } : {};
    return this._get('/idrm/deliverables', 'Failed to fetch deliverables', { params });
  }

  getIDRMDeliverable(id) {
    return this._get(`/idrm/deliverables/${id}`, `Failed to fetch deliverable ${id}`);
  }

  createIDRMDeliverable(deliverableData) {
    return this._post('/idrm/deliverables', deliverableData, 'Failed to create deliverable');
  }

  updateIDRMDeliverable(id, deliverableData) {
    return this._put(`/idrm/deliverables/${id}`, deliverableData, `Failed to update deliverable ${id}`);
  }

  deleteIDRMDeliverable(id) {
    return this._delete(`/idrm/deliverables/${id}`, `Failed to delete deliverable ${id}`);
  }

  // Templates
  getAllIDRMTemplates() {
    return this._get('/idrm/templates', 'Failed to fetch IDRM templates');
  }

  getIDRMTemplate(id) {
    return this._get(`/idrm/templates/${id}`, `Failed to fetch IDRM template ${id}`);
  }

  createIDRMTemplate(templateData) {
    return this._post('/idrm/templates', templateData, 'Failed to create IDRM template');
  }

  updateIDRMTemplate(id, templateData) {
    return this._put(`/idrm/templates/${id}`, templateData, `Failed to update IDRM template ${id}`);
  }

  deleteIDRMTemplate(id) {
    return this._delete(`/idrm/templates/${id}`, `Failed to delete IDRM template ${id}`);
  }

  // Export
  exportIDRMMatrix(type = 'all', projectId = null) {
    const params = { type };
    if (projectId) params.projectId = projectId;
    return this._get('/idrm/export', 'Failed to export IDRM matrix', { params, responseType: 'blob' });
  }

  // ======================
  // Migration
  // ======================

  migrateTIDPsToDatabase(tidps) {
    return this._post('/migrate/tidps', { tidps }, 'Failed to migrate TIDPs to database');
  }

  // ======================
  // Health Check
  // ======================

  healthCheck() {
    return this._request(async () => {
      // Health endpoint is at root (not /api)
      const response = await axios.get('/health', { timeout: 5000 });
      return response.data;
    }, 'Health check failed');
  }

  // ======================
  // Batch Operations
  // ======================

  async batchOperation(operations) {
    return this._request(async () => {
      if (!Array.isArray(operations)) {
        throw new Error('Operations must be an array');
      }

      const allowedMethods = new Set([
        'createTIDPBatch',
        'updateTIDPBatch',
        'bulkCreateIMActivities',
        'syncTIDPs',
        'syncSingleTIDP',
        'unsyncTIDP'
      ]);

      const promises = operations.map(async (operation) => {
        try {
          const method = operation?.method;
          const args = Array.isArray(operation?.args) ? operation.args : [];

          if (!allowedMethods.has(method)) {
            return { success: false, operation: operation?.id, error: `Operation method is not allowed: ${method}` };
          }

          const methodFn = this[method];
          if (typeof methodFn !== 'function') {
            return { success: false, operation: operation?.id, error: `Operation method is unavailable: ${method}` };
          }

          const result = await methodFn.apply(this, args);
          return { success: true, operation: operation?.id, result };
        } catch (error) {
          return { success: false, operation: operation?.id, error: error.message };
        }
      });

      return await Promise.all(promises);
    }, 'Batch operation failed');
  }

  // ======================
  // Cache Management
  // ======================

  clearCache() {
    // Clear any cached data if implementing caching
    console.log('🗑️ API cache cleared');
  }

  // ======================
  // Configuration
  // ======================

  getConfig() {
    return {
      baseURL: BASE_URL,
      timeout: apiClient.defaults.timeout,
      headers: apiClient.defaults.headers
    };
  }

  updateConfig(config) {
    Object.assign(apiClient.defaults, config);
  }

  // ======================
  // Authentication Services
  // ======================

  register(email, password, name) {
    return this._post('/auth/register', { email, password, name }, 'Failed to register');
  }

  async login(email, password) {
    return this._request(async () => {
      const response = await apiClient.post('/auth/login', { email, password });

      // Store token
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }

      return response.data;
    }, 'Failed to login');
  }

  async logout() {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('authToken');
      return { success: true };
    } catch (error) {
      // Even if the API call fails, remove the token locally
      localStorage.removeItem('authToken');
      throw this.handleError(error, 'Failed to logout');
    }
  }

  getCurrentUser() {
    return this._get('/auth/me', 'Failed to get current user');
  }

  forgotPassword(email) {
    return this._post('/auth/forgot-password', { email }, 'Failed to request password reset');
  }

  resetPassword(token, password) {
    return this._post('/auth/reset-password', { token, password }, 'Failed to reset password');
  }

  verifyEmail(token) {
    return this._post('/auth/verify-email', { token }, 'Failed to verify email');
  }

  resendVerification(email) {
    return this._post('/auth/resend-verification', { email }, 'Failed to resend verification email');
  }
}

const apiServiceInstance = new ApiService();

export default apiServiceInstance;
