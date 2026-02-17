import { apiClient } from './apiService';

/**
 * API-based Draft Service
 * Manages BEP drafts with server persistence
 */
class DraftApiService {
  normalizeDraft(draft) {
    if (!draft || typeof draft !== 'object') {
      return null;
    }

    const normalized = {
      ...draft,
      id: draft.id,
      name: draft.title ?? draft.name ?? 'Untitled Draft',
      title: draft.title ?? draft.name ?? 'Untitled Draft',
      bepType: draft.type ?? draft.bepType ?? 'pre-appointment',
      type: draft.type ?? draft.bepType ?? 'pre-appointment',
      lastModified: draft.updated_at ?? draft.lastModified ?? new Date().toISOString(),
      projectId: draft.project_id ?? draft.projectId ?? null,
      projectName: draft.data?.projectName || draft.projectName || 'Unnamed Project',
      data: draft.data || {}
    };

    return normalized;
  }

  /**
   * Get all drafts for the authenticated user
   * @param {string} projectId - Optional project ID filter
   * @returns {Promise<Array>} Array of draft objects
   */
  async getAllDrafts(projectId = null) {
    try {
      const params = {};
      if (projectId) params.projectId = projectId;

      const response = await apiClient.get('/drafts', {
        params
      });

      if (response.data.success) {
        return (response.data.drafts || [])
          .map((draft) => this.normalizeDraft(draft))
          .filter(Boolean);
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
   * @returns {Promise<Object>} Draft object
   */
  async getDraft(draftId) {
    if (!draftId) {
      throw new Error('Draft ID is required');
    }

    try {
      const response = await apiClient.get(`/drafts/${draftId}`);

      if (response.data.success) {
        return this.normalizeDraft(response.data.draft);
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
   * @param {string} title - Draft title
   * @param {string} type - BEP type ('pre-appointment' or 'post-appointment')
   * @param {Object} data - Draft data (form data)
   * @param {string} projectId - Optional project ID
   * @returns {Promise<Object>} Created draft object
   */
  async createDraft(title, type, data, projectId = null) {
    if (!title || !type || !data) {
      throw new Error('Title, type, and data are required');
    }

    if (type !== 'pre-appointment' && type !== 'post-appointment') {
      throw new Error('Type must be either "pre-appointment" or "post-appointment"');
    }

    try {
      const response = await apiClient.post('/drafts', {
        title,
        type,
        data,
        projectId
      });

      if (response.data.success) {
        return this.normalizeDraft(response.data.draft);
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
   * @param {Object} updates - Object with fields to update (title, data, projectId)
   * @returns {Promise<Object>} Updated draft object
   */
  async updateDraft(draftId, updates) {
    if (!draftId) {
      throw new Error('Draft ID is required');
    }

    try {
      const response = await apiClient.put(`/drafts/${draftId}`, updates);

      if (response.data.success) {
        return this.normalizeDraft(response.data.draft);
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
   * @returns {Promise<boolean>} Success status
   */
  async deleteDraft(draftId) {
    if (!draftId) {
      throw new Error('Draft ID is required');
    }

    try {
      const response = await apiClient.delete(`/drafts/${draftId}`);

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
   * @param {Object} localStorageDrafts - Drafts from localStorage
   * @returns {Promise<Object>} Migration results
   */
  async migrateDrafts(localStorageDrafts) {
    if (!localStorageDrafts) {
      throw new Error('Drafts are required');
    }

    try {
      const response = await apiClient.post('/drafts/migrate', {
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
   * @param {string} title - Draft title
   * @param {string} type - BEP type
   * @param {Object} data - Draft data
   * @param {string} draftId - Optional draft ID (if updating)
   * @param {string} projectId - Optional project ID
   * @returns {Promise<Object>} Saved draft object
   */
  async saveDraft(title, type, data, draftId = null, projectId = null) {
    if (draftId) {
      // Update existing draft
      return await this.updateDraft(draftId, { title, data, projectId });
    } else {
      // Create new draft
      return await this.createDraft(title, type, data, projectId);
    }
  }
}

// Export singleton instance
export const draftApiService = new DraftApiService();
export default draftApiService;
