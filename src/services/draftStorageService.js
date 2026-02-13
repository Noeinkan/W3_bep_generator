import { isDraftValid } from '../utils/validationUtils';

class DraftStorageService {
  getDraftsKey(userId) {
    return `bepDrafts_${userId}`;
  }

  loadDrafts(userId) {
    if (!userId) {
      throw new Error('Invalid user ID');
    }

    try {
      const draftsKey = this.getDraftsKey(userId);
      const savedDrafts = localStorage.getItem(draftsKey);

      if (!savedDrafts) {
        return {};
      }

      const parsedDrafts = JSON.parse(savedDrafts);

      // Validate parsed data structure
      if (typeof parsedDrafts !== 'object' || parsedDrafts === null || Array.isArray(parsedDrafts)) {
        console.warn('Invalid drafts data structure, resetting to empty');
        return {};
      }

      // Validate each draft object
      const validDrafts = {};
      Object.keys(parsedDrafts).forEach(key => {
        const draft = parsedDrafts[key];
        if (isDraftValid(draft)) {
          validDrafts[key] = draft;
        } else {
          console.warn(`Invalid draft found and removed: ${key}`, draft);
        }
      });

      return validDrafts;
    } catch (error) {
      console.error('Error loading drafts:', error);
      throw new Error('Failed to load drafts. The data may be corrupted.');
    }
  }

  saveDraft(userId, draft) {
    if (!userId) {
      throw new Error('Invalid user ID');
    }

    if (!isDraftValid(draft)) {
      throw new Error('Invalid draft data');
    }

    try {
      const existingDrafts = this.loadDrafts(userId);
      existingDrafts[draft.id] = draft;

      const draftsKey = this.getDraftsKey(userId);
      localStorage.setItem(draftsKey, JSON.stringify(existingDrafts));

      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw new Error('Failed to save draft');
    }
  }

  deleteDraft(userId, draftId) {
    if (!userId) {
      throw new Error('Invalid user ID');
    }

    if (!draftId) {
      throw new Error('Invalid draft ID');
    }

    try {
      const existingDrafts = this.loadDrafts(userId);

      if (!existingDrafts[draftId]) {
        return false;
      }

      delete existingDrafts[draftId];

      const draftsKey = this.getDraftsKey(userId);
      localStorage.setItem(draftsKey, JSON.stringify(existingDrafts));

      return true;
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw new Error('Failed to delete draft');
    }
  }

  updateDraft(userId, draftId, updates) {
    if (!userId) {
      throw new Error('Invalid user ID');
    }

    if (!draftId) {
      throw new Error('Invalid draft ID');
    }

    try {
      const existingDrafts = this.loadDrafts(userId);

      if (!existingDrafts[draftId]) {
        return false;
      }

      existingDrafts[draftId] = { ...existingDrafts[draftId], ...updates };

      const draftsKey = this.getDraftsKey(userId);
      localStorage.setItem(draftsKey, JSON.stringify(existingDrafts));

      return true;
    } catch (error) {
      console.error('Error updating draft:', error);
      throw new Error('Failed to update draft');
    }
  }

  migrateOrphanedDrafts(userId, projectId) {
    if (!userId || !projectId) return 0;

    try {
      const allDrafts = this.loadDrafts(userId);
      let migrated = 0;

      Object.keys(allDrafts).forEach(key => {
        if (!allDrafts[key].projectId) {
          allDrafts[key].projectId = projectId;
          migrated++;
        }
      });

      if (migrated > 0) {
        const draftsKey = this.getDraftsKey(userId);
        localStorage.setItem(draftsKey, JSON.stringify(allDrafts));
      }

      return migrated;
    } catch (error) {
      console.error('Error migrating orphaned drafts:', error);
      return 0;
    }
  }

  loadDraftsByProject(userId, projectId) {
    const allDrafts = this.loadDrafts(userId);
    if (!projectId) return allDrafts;

    const filtered = {};
    Object.keys(allDrafts).forEach(key => {
      if (allDrafts[key].projectId === projectId) {
        filtered[key] = allDrafts[key];
      }
    });
    return filtered;
  }

  getAllDrafts(userId) {
    const drafts = this.loadDrafts(userId);
    return Object.values(drafts);
  }

  getDraft(userId, draftId) {
    if (!userId || !draftId) {
      return null;
    }

    try {
      const drafts = this.loadDrafts(userId);
      return drafts[draftId] || null;
    } catch (error) {
      console.error('Error getting draft:', error);
      return null;
    }
  }

  clearAllDrafts(userId) {
    if (!userId) {
      throw new Error('Invalid user ID');
    }

    try {
      const draftsKey = this.getDraftsKey(userId);
      localStorage.removeItem(draftsKey);
      return true;
    } catch (error) {
      console.error('Error clearing drafts:', error);
      throw new Error('Failed to clear drafts');
    }
  }
}

export const draftStorageService = new DraftStorageService();