import { useState, useEffect, useCallback } from 'react';
import { createDefaultDocumentHistory } from '../constants/documentHistory';
import draftApiService from '../services/draftApiService';

/**
 * Manages document history state for a BEP draft.
 * Initialises from existing draft data or creates a default revision on first load.
 */
export function useDocumentHistory({ currentDraft, setCurrentDraft }) {
  const [documentHistory, setDocumentHistory] = useState(null);

  // Initialise documentHistory when a draft is loaded
  useEffect(() => {
    if (!currentDraft?.id) return;
    if (currentDraft.data?.documentHistory) {
      setDocumentHistory(currentDraft.data.documentHistory);
      return;
    }
    // Auto-create the first revision on new/legacy drafts
    const projectName = currentDraft.data?.projectName || currentDraft.name || '';
    const defaultHistory = createDefaultDocumentHistory(projectName);
    setDocumentHistory(defaultHistory);
    // Persist silently — fire-and-forget, non-blocking
    draftApiService.updateDraft(currentDraft.id, {
      data: { ...currentDraft.data, documentHistory: defaultHistory },
    }).catch(() => {});
    setCurrentDraft(prev =>
      prev ? { ...prev, data: { ...prev.data, documentHistory: defaultHistory } } : prev
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDraft?.id]);

  const handleDocumentHistorySave = useCallback(async (updated) => {
    if (!currentDraft?.id) return;
    setDocumentHistory(updated);
    try {
      await draftApiService.updateDraft(currentDraft.id, {
        data: { ...currentDraft.data, documentHistory: updated },
      });
      setCurrentDraft(prev =>
        prev ? { ...prev, data: { ...prev.data, documentHistory: updated } } : prev
      );
    } catch (err) {
      console.error('Failed to save document history', err);
    }
  }, [currentDraft, setCurrentDraft]);

  return { documentHistory, handleDocumentHistorySave };
}
