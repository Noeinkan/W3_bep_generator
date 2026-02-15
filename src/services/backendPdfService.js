import { apiClient } from './apiService';

/**
 * Generate BEP PDF on server using Puppeteer
 * @param {Object} formData - Form data
 * @param {string} bepType - BEP type (pre-appointment/post-appointment)
 * @param {Array} tidpData - TIDP data
 * @param {Array} midpData - MIDP data
 * @param {Object} componentImages - Map of fieldName -> base64 image
 * @param {Object} options - PDF generation options
 * @returns {Promise<Object>} - Result with success status
 */
export const generateBEPPDFOnServer = async (
  formData,
  bepType,
  tidpData,
  midpData,
  componentImages,
  options = {}
) => {
  try {
    console.log('📤 Sending PDF generation request to server...');
    console.log(`   Project: ${formData.projectName || 'Unknown'}`);
    console.log(`   BEP Type: ${bepType}`);
    console.log(`   Orientation: ${options.orientation || 'portrait'}`);
    console.log(`   Quality: ${options.quality || 'standard'}`);

    // Determine timeout based on quality
    const timeout = options.quality === 'high' ? 120000 : 60000;

    // Send POST request to backend
    const response = await apiClient.post(
      '/export/bep/pdf',
      {
        formData,
        bepType,
        tidpData,
        midpData,
        componentImages,
        options
      },
      {
        responseType: 'blob', // Important for binary PDF data
        timeout: timeout,
        headers: {
          'Content-Type': 'application/json'
        },
        // Track upload progress
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`   Upload progress: ${percentCompleted}%`);
        }
      }
    );

    console.log('✅ PDF received from server');

    // Create download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Extract filename from response headers or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = `BEP_${bepType}_${new Date().toISOString().split('T')[0]}.pdf`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('✅ PDF download started:', filename);

    return {
      success: true,
      filename: filename,
      size: blob.size
    };

  } catch (error) {
    console.error('❌ Server PDF generation failed:', error);

    // Extract error message from response
    let errorMessage = 'Failed to generate PDF on server';

    if (error.response) {
      // Server responded with error
      if (error.response.status === 400) {
        errorMessage = 'Invalid request data. Please check your BEP form.';
      } else if (error.response.status === 413) {
        errorMessage = 'BEP data too large. Please reduce the number of components or images.';
      } else if (error.response.status === 504) {
        errorMessage = 'PDF generation timed out. Try using standard quality instead of high quality.';
      } else if (error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = `Server error (${error.response.status}): ${error.response.statusText}`;
      }
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. The server took too long to respond. Try again with standard quality.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to server. Please ensure the backend server is running.';
      } else {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Check if backend server is available
 * @returns {Promise<boolean>}
 */
export const checkBackendAvailability = async () => {
  try {
    await apiClient.get('/health', { timeout: 5000 });
    return true;
  } catch (error) {
    console.warn('Backend server not available:', error.message);
    return false;
  }
};
