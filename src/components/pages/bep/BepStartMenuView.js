import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BepStartMenu from './BepStartMenu';

/**
 * Wrapper for BepStartMenu that handles navigation
 */
const BepStartMenuView = ({ user }) => {
  const navigate = useNavigate();

  const handleNewBep = useCallback(() => {
    navigate('/bep-generator/select-type');
  }, [navigate]);

  const handleLoadTemplate = useCallback(() => {
    navigate('/bep-generator/templates');
  }, [navigate]);

  const handleContinueDraft = useCallback(() => {
    navigate('/bep-generator/drafts');
  }, [navigate]);

  const handleImportBep = useCallback(() => {
    navigate('/bep-generator/import');
  }, [navigate]);

  return (
    <BepStartMenu
      onNewBep={handleNewBep}
      onLoadTemplate={handleLoadTemplate}
      onContinueDraft={handleContinueDraft}
      onImportBep={handleImportBep}
      user={user}
    />
  );
};

export default BepStartMenuView;
