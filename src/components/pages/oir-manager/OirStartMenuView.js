import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useProject } from '../../../contexts/ProjectContext';
import apiService from '../../../services/apiService';
import OirStartMenu from './OirStartMenu';

const OirStartMenuView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentProject } = useProject();

  const handleNewOir = useCallback(async () => {
    try {
      const projectId = currentProject?.id ?? null;
      const res = await apiService.createOirDraft({ projectId, title: 'Untitled OIR', data: {} });
      if (res?.success && res?.draft?.id) {
        toast.success('OIR created');
        navigate(`/oir-manager/${res.draft.id}/edit`);
      } else {
        toast.error('Failed to create OIR');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to create OIR');
    }
  }, [navigate, currentProject]);

  const handleContinueDraft = useCallback(() => {
    navigate('/oir-manager/drafts');
  }, [navigate]);

  const handleLoadTemplate = useCallback(() => {
    navigate('/oir-manager/templates');
  }, [navigate]);

  const handleImportOir = useCallback(() => {
    navigate('/oir-manager/import');
  }, [navigate]);

  return (
    <OirStartMenu
      onNewOir={handleNewOir}
      onContinueDraft={handleContinueDraft}
      onLoadTemplate={handleLoadTemplate}
      onImportOir={handleImportOir}
      user={user}
    />
  );
};

export default OirStartMenuView;
