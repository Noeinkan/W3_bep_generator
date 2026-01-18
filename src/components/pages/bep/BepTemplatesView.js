import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateGallery from './TemplateGallery';
import { useBepForm } from '../../../contexts/BepFormContext';
import { getTemplateById } from '../../../data/templateRegistry';

/**
 * View component for template gallery
 */
const BepTemplatesView = () => {
  const navigate = useNavigate();
  const { loadFormData } = useBepForm();

  const handleSelectTemplate = useCallback((template) => {
    console.log('Loading template:', template);

    const templateData = getTemplateById(template.id);

    if (templateData) {
      // Load template data with BEP type
      loadFormData(templateData, template.bepType, null);

      // Create slug from template name
      const slug = encodeURIComponent(
        (template.name || 'template')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 50)
      );

      navigate(`/bep-generator/${slug}/step/0`);
    } else {
      console.error('Template not found:', template.id);
      alert('Failed to load template. Please try again.');
    }
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
