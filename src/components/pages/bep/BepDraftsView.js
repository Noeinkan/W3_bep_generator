import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useBepForm } from '../../../contexts/BepFormContext';
import DraftManager from '../drafts/DraftManager';

/**
 * View component for draft manager
 */
const BepDraftsView = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { bepType, loadFormData, getFormData } = useBepForm();

  // Get current form data to pass to DraftManager
  const currentFormData = getFormData();

  const handleLoadDraft = useCallback((loadedData, loadedType, draftInfo) => {
    // Load draft data into form context
    loadFormData(loadedData, loadedType, draftInfo);

    if (draftInfo) {
      // Create slug from draft name
      const slug = encodeURIComponent(
        draftInfo.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 50)
      );
      navigate(`/bep-generator/${slug}/step/0`);
    } else {
      navigate('/bep-generator/new-document/step/0');
    }
  }, [navigate, loadFormData]);

  const handleClose = useCallback(() => {
    navigate('/bep-generator');
  }, [navigate]);

  // Redirect to start menu if not logged in
  if (!user && !authLoading) {
    navigate('/bep-generator');
    return null;
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DraftManager
      user={user}
      currentFormData={currentFormData}
      onLoadDraft={handleLoadDraft}
      onClose={handleClose}
      bepType={bepType}
    />
  );
};

export default BepDraftsView;
