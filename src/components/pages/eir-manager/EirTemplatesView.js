import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookTemplate, Building2 } from 'lucide-react';
import { useProject } from '../../../contexts/ProjectContext';
import { getEirTemplates, getEirTemplateById } from '../../../data/templateRegistry';
import TemplateGallery from '../../shared/TemplateGallery';
import apiService from '../../../services/apiService';

const enhanceEirTemplate = (t) => ({
  ...t,
  icon: Building2,
  color: 'purple',
  recommended: true,
  complexity: 'Intermediate',
  comingSoon: false
});

const EirTemplatesView = () => {
  const navigate = useNavigate();
  const { currentProject } = useProject();
  const [isLoading, setIsLoading] = useState(false);

  const templates = getEirTemplates().map(enhanceEirTemplate);

  const handleSelect = useCallback(async (template) => {
    const eirData = getEirTemplateById(template.id);
    if (!eirData) {
      toast.error('Template data not found');
      return;
    }
    setIsLoading(true);
    try {
      const projectId = currentProject?.id ?? null;
      const res = await apiService.createEirDraft({
        projectId,
        title: `${template.name} – EIR`,
        data: eirData,
      });
      if (res?.success && res?.draft?.id) {
        toast.success('EIR draft created from template');
        navigate(`/eir-manager/${res.draft.id}/edit`);
      } else {
        toast.error('Failed to create EIR draft');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to create EIR draft');
    } finally {
      setIsLoading(false);
    }
  }, [currentProject, navigate]);

  const handleCancel = useCallback(() => navigate('/eir-manager'), [navigate]);
  const handleBack = useCallback(() => navigate('/eir-manager'), [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <TemplateGallery
          mode="page"
          title="EIR Templates"
          description="Select a pre-configured template to start from"
          headerIcon={BookTemplate}
          accentColor="purple"
          templates={templates}
          onSelect={handleSelect}
          onCancel={handleCancel}
          onBack={handleBack}
          primaryActionLabel="Use Template"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default EirTemplatesView;
