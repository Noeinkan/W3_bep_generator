import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useProject } from '../../../contexts/ProjectContext';
import apiService from '../../../services/apiService';
import EirStartMenu from './EirStartMenu';

const EirStartMenuView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentProject } = useProject();

  const handleNewEir = useCallback(async () => {
    try {
      const projectId = currentProject?.id ?? null;
      const res = await apiService.createEirDraft({ projectId, title: 'Untitled EIR', data: {} });
      if (res?.success && res?.draft?.id) {
        toast.success('EIR created');
        navigate(`/eir-manager/${res.draft.id}/edit`);
      } else {
        toast.error('Failed to create EIR');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to create EIR');
    }
  }, [navigate, currentProject]);

  const handleContinueDraft = useCallback(() => {
    navigate('/eir-manager/drafts');
  }, [navigate]);

  const handleLoadTemplate = useCallback(() => {
    navigate('/eir-manager/templates');
  }, [navigate]);

  const handleImportEir = useCallback(() => {
    navigate('/eir-manager/import');
  }, [navigate]);

  return (
    <EirStartMenu
      onNewEir={handleNewEir}
      onContinueDraft={handleContinueDraft}
      onLoadTemplate={handleLoadTemplate}
      onImportEir={handleImportEir}
      user={user}
    />
  );
};

export default EirStartMenuView;
