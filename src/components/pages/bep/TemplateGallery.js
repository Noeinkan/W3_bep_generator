import { Building2, Home, Route, AlertCircle } from 'lucide-react';
import { getAvailableTemplates } from '../../../data/templateRegistry';
import TemplateGallery from '../../shared/TemplateGallery';

const templateIconMap = {
  'commercial-office-pre': { icon: Building2, color: 'purple', recommended: true },
  'commercial-office-post': { icon: Building2, color: 'purple', recommended: true },
  'residential-complex': { icon: Home, color: 'blue', recommended: false },
  'hospital': { icon: Building2, color: 'green', recommended: false },
  'infrastructure': { icon: Route, color: 'green', recommended: false }
};

const enhanceTemplate = (template) => ({
  ...template,
  icon: templateIconMap[template.id]?.icon || Building2,
  color: templateIconMap[template.id]?.color || 'blue',
  recommended: templateIconMap[template.id]?.recommended ?? false,
  complexity: 'Intermediate',
  comingSoon: false
});

const BEP_GROUPS = [
  { key: 'pre-appointment', label: 'Pre-Appointment BEP Templates', accent: 'blue' },
  { key: 'post-appointment', label: 'Post-Appointment BEP Templates', accent: 'green' }
];

const BEP_NOTICE = (
  <div className="flex items-start space-x-2">
    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
    <div className="text-xs text-amber-900">
      <p className="font-semibold mb-0.5">Template System in Development</p>
      <p className="text-amber-800">
        More templates will be added soon. You'll also be able to save your own BEPs as reusable templates.
      </p>
    </div>
  </div>
);

const TemplateGalleryWrapper = ({ show, onSelectTemplate, onCancel }) => {
  if (!show) return null;

  const allTemplates = getAvailableTemplates().map(enhanceTemplate);

  return (
    <TemplateGallery
      mode="modal"
      title="Template Gallery"
      description="Pre-configured templates with best practices"
      accentColor="purple"
      templates={allTemplates}
      groups={BEP_GROUPS}
      groupBy="bepType"
      onSelect={onSelectTemplate}
      onCancel={onCancel}
      notice={BEP_NOTICE}
      primaryActionLabel="Use Template"
    />
  );
};

export default TemplateGalleryWrapper;
