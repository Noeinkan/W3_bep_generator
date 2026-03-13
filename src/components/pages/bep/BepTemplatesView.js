import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TemplateGallery from './TemplateGallery';
import { useBepForm } from '../../../contexts/BepFormContext';
import { useProject } from '../../../contexts/ProjectContext';
import { getTemplateById, getEirTemplateById } from '../../../data/templateRegistry';
import apiService from '../../../services/apiService';

/**
 * View component for template gallery
 */
const BepTemplatesView = () => {
  const navigate = useNavigate();
  const { loadFormData, setValue } = useBepForm();
  const { currentProject } = useProject();

  const handleSelectTemplate = useCallback(async (template) => {
    const templateData = getTemplateById(template.id);

    if (!templateData) {
      console.error('Template not found:', template.id);
      alert('Failed to load template. Please try again.');
      return;
    }

    // Load BEP template data into form
    loadFormData(templateData, template.bepType, null);

    // If a project is active, also create a pre-filled EIR draft and link it
    const eirData = getEirTemplateById(template.id);
    if (currentProject?.id && eirData) {
      try {
        const res = await apiService.createEirDraft({
          projectId: currentProject.id,
          title: `${template.name} – EIR`,
          data: eirData,
        });
        if (res?.success && res?.draft?.id) {
          setValue('linkedEirId', res.draft.id);
          toast.success('Template loaded — pre-filled EIR draft created and linked.');
        }
      } catch (err) {
        console.error('Failed to create EIR draft from template:', err);
        // Non-blocking — BEP template still loaded; user can create EIR manually
        toast.success('BEP template loaded.');
      }
    } else {
      toast.success('BEP template loaded.');
    }

    // Create slug from template name
    const slug = encodeURIComponent(
      (template.name || 'template')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50)
    );

    navigate(`/bep-generator/${slug}/step/0`);
  }, [navigate, loadFormData, setValue, currentProject]);

  const handleCancel = useCallback(() => {
    navigate('/bep-generator');
  }, [navigate]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 lg:py-6">
      <TemplateGallery
        show={true}
        onSelectTemplate={handleSelectTemplate}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default BepTemplatesView;
