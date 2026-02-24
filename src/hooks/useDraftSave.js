import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDraftOperations } from './useDraftOperations';
import { validateDraftName } from '../utils/validationUtils';
import { getBepStepRoute } from '../constants/routes';

/**
 * Hook to manage draft saving operations
 * @param {Object} options - Configuration options
 * @param {Object} options.user - Current user object
 * @param {Object} options.formData - Current form data
 * @param {string} options.bepType - Current BEP type
 * @param {Object} options.currentDraft - Current draft info
 * @param {Function} options.setCurrentDraft - Function to update current draft
 * @param {number} options.currentStep - Current step index
 * @param {Function} options.createDocumentSlug - Function to create URL-safe slug
 * @returns {Object} Draft save state and handlers
 */
const useDraftSave = ({
  user,
  formData,
  bepType,
  currentDraft,
  setCurrentDraft,
  currentStep,
  createDocumentSlug,
  projectId = null,
}) => {
  const navigate = useNavigate();

  // Local state
  const [newDraftName, setNewDraftName] = useState('');
  const [showSaveDraftDialog, setShowSaveDraftDialog] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [existingDraftToOverwrite, setExistingDraftToOverwrite] = useState(null);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);

  // Draft operations
  const { saveDraft, isLoading: savingDraft } = useDraftOperations(
    user,
    formData,
    bepType,
    () => {}, // onLoadDraft - handled in DraftManager
    () => {}, // onClose - not needed here
    projectId
  );

  // Draft name validation
  const newDraftNameValidation = useMemo(() => {
    if (!newDraftName) return { isValid: false, error: null, sanitized: '' };
    return validateDraftName(newDraftName);
  }, [newDraftName]);

  const showSuccess = useCallback(() => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  }, []);

  const resetDialogState = useCallback(() => {
    setShowSaveDraftDialog(false);
    setNewDraftName('');
    setExistingDraftToOverwrite(null);
  }, []);

  const handleSaveDraft = useCallback(async () => {
    if (!user) {
      alert('Please log in to save drafts');
      return;
    }
    if (!bepType) {
      alert('Please select a BEP type first');
      return;
    }

    // If working on existing draft, save directly
    if (currentDraft?.id) {
      try {
        const result = await saveDraft(currentDraft.name, formData, true);
        if (result.success) {
          showSuccess();
        } else {
          alert('Failed to save draft');
        }
      } catch (error) {
        alert('Failed to save draft: ' + error.message);
      }
    } else {
      // New BEP, ask for name
      setNewDraftName('');
      setShowSaveDraftDialog(true);
    }
  }, [user, bepType, currentDraft, formData, saveDraft, showSuccess]);

  const handleSaveDraftConfirm = useCallback(async () => {
    if (!newDraftNameValidation.isValid) return;

    try {
      const result = await saveDraft(newDraftNameValidation.sanitized, formData, false);

      if (result.success) {
        const draftInfo = { id: result.draftId, name: newDraftNameValidation.sanitized };
        setCurrentDraft(draftInfo);
        resetDialogState();
        showSuccess();

        const newSlug = createDocumentSlug(newDraftNameValidation.sanitized);
        navigate(getBepStepRoute(newSlug, currentStep), { replace: true });
      } else if (result.existingDraft) {
        setExistingDraftToOverwrite(result.existingDraft);
      }
    } catch (error) {
      alert('Failed to save draft: ' + error.message);
    }
  }, [newDraftNameValidation, formData, saveDraft, createDocumentSlug, navigate, currentStep, setCurrentDraft, resetDialogState, showSuccess]);

  const handleOverwriteDraft = useCallback(async () => {
    if (!newDraftNameValidation.isValid) return;

    try {
      const result = await saveDraft(newDraftNameValidation.sanitized, formData, true);

      if (result.success) {
        const draftInfo = { id: result.draftId, name: newDraftNameValidation.sanitized };
        setCurrentDraft(draftInfo);
        resetDialogState();
        showSuccess();

        const newSlug = createDocumentSlug(newDraftNameValidation.sanitized);
        navigate(getBepStepRoute(newSlug, currentStep), { replace: true });
      } else {
        alert('Failed to overwrite draft');
      }
    } catch (error) {
      alert('Failed to overwrite draft: ' + error.message);
    }
  }, [newDraftNameValidation, formData, saveDraft, createDocumentSlug, navigate, currentStep, setCurrentDraft, resetDialogState, showSuccess]);

  const handleSaveAsNewDraft = useCallback(() => {
    setExistingDraftToOverwrite(null);
    setNewDraftName('');
  }, []);

  const handleSaveDraftCancel = useCallback(() => {
    resetDialogState();
  }, [resetDialogState]);

  const handleSaveAs = useCallback(() => {
    if (!user) {
      alert('Please log in to save drafts');
      return;
    }
    if (!bepType) {
      alert('Please select a BEP type first');
      return;
    }
    setShowSaveDropdown(false);
    setNewDraftName('');
    setExistingDraftToOverwrite(null);
    setShowSaveDraftDialog(true);
  }, [user, bepType]);

  const toggleSaveDropdown = useCallback(() => {
    setShowSaveDropdown(prev => !prev);
  }, []);

  const closeSaveDropdown = useCallback(() => {
    setShowSaveDropdown(false);
  }, []);

  return {
    // State
    newDraftName,
    setNewDraftName,
    showSaveDraftDialog,
    showSuccessToast,
    existingDraftToOverwrite,
    showSaveDropdown,
    savingDraft,
    newDraftNameValidation,
    // Handlers
    handleSaveDraft,
    handleSaveDraftConfirm,
    handleOverwriteDraft,
    handleSaveAsNewDraft,
    handleSaveDraftCancel,
    handleSaveAs,
    toggleSaveDropdown,
    closeSaveDropdown,
  };
};

export default useDraftSave;
