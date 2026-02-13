import axios from 'axios';

// Use relative URL to leverage proxy configuration
const API_BASE_URL = '/api';

/**
 * API-based Draft Service
 * Manages BEP drafts with server persistence
 */
class DraftApiService {
  /**
   * Get all drafts for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of draft objects
   */
  async getAllDrafts(userId, projectId = null) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const params = { userId };
      if (projectId) params.projectId = projectId;

      const response = await axios.get(`${API_BASE_URL}/drafts`, {
        params
      });

      if (response.data.success) {
        return response.data.drafts;
      } else {
        throw new Error(response.data.message || 'Failed to fetch drafts');
      }
    } catch (error) {
      console.error('Error fetching drafts:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch drafts');
    }
  }

  /**
   * Get a specific draft
   * @param {string} draftId - Draft ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Draft object
   */
  async getDraft(draftId, userId) {
    if (!draftId || !userId) {
      throw new Error('Draft ID and User ID are required');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/drafts/${draftId}`, {
        params: { userId }
      });

      if (response.data.success) {
        return response.data.draft;
      } else {
        throw new Error(response.data.message || 'Failed to fetch draft');
      }
    } catch (error) {
      console.error('Error fetching draft:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch draft');
    }
  }

  /**
   * Create a new draft
   * @param {string} userId - User ID
   * @param {string} title - Draft title
   * @param {string} type - BEP type ('pre-appointment' or 'post-appointment')
   * @param {Object} data - Draft data (form data)
   * @param {string} projectId - Optional project ID
   * @returns {Promise<Object>} Created draft object
   */
  async createDraft(userId, title, type, data, projectId = null) {
    if (!userId || !title || !type || !data) {
      throw new Error('User ID, title, type, and data are required');
    }

    if (type !== 'pre-appointment' && type !== 'post-appointment') {
      throw new Error('Type must be either "pre-appointment" or "post-appointment"');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/drafts`, {
        userId,
        title,
        type,
        data,
        projectId
      });

      if (response.data.success) {
        return response.data.draft;
      } else {
        throw new Error(response.data.message || 'Failed to create draft');
      }
    } catch (error) {
      console.error('Error creating draft:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create draft');
    }
  }

  /**
   * Update an existing draft
   * @param {string} draftId - Draft ID
   * @param {string} userId - User ID
   * @param {Object} updates - Object with fields to update (title, data, projectId)
   * @returns {Promise<Object>} Updated draft object
   */
  async updateDraft(draftId, userId, updates) {
    if (!draftId || !userId) {
      throw new Error('Draft ID and User ID are required');
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/drafts/${draftId}`, {
        userId,
        ...updates
      });

      if (response.data.success) {
        return response.data.draft;
      } else {
        throw new Error(response.data.message || 'Failed to update draft');
      }
    } catch (error) {
      console.error('Error updating draft:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update draft');
    }
  }

  /**
   * Delete a draft
   * @param {string} draftId - Draft ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteDraft(draftId, userId) {
    if (!draftId || !userId) {
      throw new Error('Draft ID and User ID are required');
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/drafts/${draftId}`, {
        params: { userId }
      });

      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to delete draft');
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete draft');
    }
  }

  /**
   * Migrate drafts from localStorage to database
   * @param {string} userId - User ID
   * @param {Object} localStorageDrafts - Drafts from localStorage
   * @returns {Promise<Object>} Migration results
   */
  async migrateDrafts(userId, localStorageDrafts) {
    if (!userId || !localStorageDrafts) {
      throw new Error('User ID and drafts are required');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/drafts/migrate`, {
        userId,
        drafts: localStorageDrafts
      });

      if (response.data.success) {
        return response.data.results;
      } else {
        throw new Error(response.data.message || 'Failed to migrate drafts');
      }
    } catch (error) {
      console.error('Error migrating drafts:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to migrate drafts');
    }
  }

  /**
   * Save or update a draft (convenience method)
   * @param {string} userId - User ID
   * @param {string} title - Draft title
   * @param {string} type - BEP type
   * @param {Object} data - Draft data
   * @param {string} draftId - Optional draft ID (if updating)
   * @param {string} projectId - Optional project ID
   * @returns {Promise<Object>} Saved draft object
   */
  async saveDraft(userId, title, type, data, draftId = null, projectId = null) {
    if (draftId) {
      // Update existing draft
      return await this.updateDraft(draftId, userId, { title, data, projectId });
    } else {
      // Create new draft
      return await this.createDraft(userId, title, type, data, projectId);
    }
  }
}

// Export singleton instance
export const draftApiService = new DraftApiService();
export default draftApiService;
