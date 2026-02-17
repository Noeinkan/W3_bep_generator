import { useState, useEffect, useCallback, useMemo } from 'react';
import { draftApiService } from '../services/draftApiService';
import { validateUser, validateFormData, validateCallbacks } from '../utils/validationUtils';
import { useDraftFilters } from './useDraftFilters';

export const useDrafts = (user, currentFormData, onLoadDraft, onClose, projectId = null) => {
  const [rawDrafts, setRawDrafts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Comprehensive validation
  const isValidComponent = useMemo(() => {
    return validateUser(user) && validateFormData(currentFormData) && validateCallbacks(onLoadDraft, onClose);
  }, [user, currentFormData, onLoadDraft, onClose]);

  // Safe user ID extraction
  const safeUserId = useMemo(() => {
    try {
      return validateUser(user) ? user.id.trim() : null;
    } catch (error) {
      console.error('Error extracting user ID:', error);
      return null;
    }
  }, [user]);

  // Load drafts function
  const loadDrafts = useCallback(async () => {
    if (!safeUserId) {
      setError('Invalid user data - cannot load drafts');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const drafts = await draftApiService.getAllDrafts(projectId || null);
      const draftMap = drafts.reduce((acc, draft) => {
        acc[draft.id] = draft;
        return acc;
      }, {});

      setRawDrafts(draftMap);
    } catch (error) {
      console.error('Error loading drafts:', error);
      setError('Failed to load drafts. Please try again.');
      setRawDrafts({});
    } finally {
      setIsLoading(false);
    }
  }, [safeUserId, projectId]);

  // Load drafts on component mount and when user changes
  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  // Use the filter hook
  const filterHook = useDraftFilters(rawDrafts);

  // Refresh drafts function
  const refreshDrafts = useCallback(() => {
    loadDrafts();
  }, [loadDrafts]);

  return {
    // Basic state
    rawDrafts,
    setRawDrafts,
    isLoading,
    error,
    setError,
    isValidComponent,
    safeUserId,

    // Filtered drafts and filter controls
    ...filterHook,
    drafts: filterHook.filteredAndSortedDrafts,

    // Functions
    refreshDrafts
  };
};