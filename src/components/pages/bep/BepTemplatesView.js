import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TemplateGallery from './TemplateGallery';
import { useBepForm } from '../../../contexts/BepFormContext';
import { getTemplateById } from '../../../data/templateRegistry';

/**
 * View component for template gallery.
 * Loads BEP template data only — EIR is a separate document authored by the
 * appointing party (ISO 19650), so we don't create EIR drafts here.
 */
const BepTemplatesView = () => {
  const navigate = useNavigate();
  const { loadFormData } = useBepForm();

  const handleSelectTemplate = useCallback(async (template) => {
    const templateData = getTemplateById(template.id);

    if (!templateData) {
      console.error('Template not found:', template.id);
      alert('Failed to load template. Please try again.');
      return;
    }

    loadFormData(templateData, template.bepType, null);
    toast.success('BEP template loaded.');

    const slug = encodeURIComponent(
      (template.name || 'template')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50)
    );

    navigate(`/bep-generator/${slug}/step/0`);
  }, [navigate, loadFormData]);

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
