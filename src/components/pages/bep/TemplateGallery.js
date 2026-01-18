import { useState } from 'react';
import { X, BookTemplate, Building2, Home, Route, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { getAvailableTemplates } from '../../../data/templateRegistry';

const TemplateGallery = ({ show, onSelectTemplate, onCancel }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  if (!show) return null;

  // Load templates from registry and separate by BEP type
  const allTemplates = getAvailableTemplates();
  const preTemplates = allTemplates.filter(t => t.bepType === 'pre-appointment');
  const postTemplates = allTemplates.filter(t => t.bepType === 'post-appointment');

  // Map registry templates to UI format with icons and colors
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
    recommended: templateIconMap[template.id]?.recommended || false,
    complexity: 'Intermediate',
    comingSoon: false
  });

  const colorClasses = {
    blue: {
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      border: 'border-blue-400',
      borderHover: 'hover:border-blue-300',
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      badge: 'bg-blue-100 text-blue-700'
    },
    purple: {
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      border: 'border-purple-400',
      borderHover: 'hover:border-purple-300',
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      badge: 'bg-purple-100 text-purple-700'
    },
    green: {
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      border: 'border-green-400',
      borderHover: 'hover:border-green-300',
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      badge: 'bg-green-100 text-green-700'
    }
  };

  const handleSelectTemplate = () => {
    if (selectedTemplate && !selectedTemplate.comingSoon) {
      onSelectTemplate(selectedTemplate);
    }
  };

  const renderTemplateCard = (template) => {
    const colors = colorClasses[template.color];
    const isSelected = selectedTemplate?.id === template.id;

    return (
      <div
        key={template.id}
        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
          template.comingSoon
            ? 'opacity-60 cursor-not-allowed border-slate-200 bg-slate-50'
            : isSelected
            ? `${colors.border} ${colors.bg} shadow-xl scale-[1.02]`
            : `border-slate-200 ${colors.borderHover} hover:shadow-lg hover:scale-[1.02]`
        }`}
        onClick={() => !template.comingSoon && setSelectedTemplate(template)}
      >
        {/* Coming Soon Overlay */}
        {template.comingSoon && (
          <div className="absolute inset-0 bg-slate-900 bg-opacity-40 backdrop-blur-[1px] rounded-lg flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-lg shadow-lg">
              Coming Soon
            </span>
          </div>
        )}

        {/* Recommended Badge */}
        {template.recommended && !template.comingSoon && (
          <div className="absolute -top-2 -right-2 z-20">
            <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
              <Star className="w-3 h-3 fill-white" />
              <span>Recommended</span>
            </div>
          </div>
        )}

        {/* Template Icon and Selection */}
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${colors.iconBg} shadow-sm`}>
            <template.icon className={`w-8 h-8 ${colors.iconText}`} />
          </div>
          {isSelected && !template.comingSoon && (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Template Info */}
        <h4 className="text-base font-bold text-slate-900 mb-1.5">
          {template.name}
        </h4>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed line-clamp-2">
          {template.description}
        </p>

        {/* Template Metadata */}
        <div className="flex flex-wrap gap-1.5">
          <span className={`px-2 py-1 rounded text-xs font-semibold shadow-sm ${colors.badge}`}>
            {template.category}
          </span>
          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold shadow-sm">
            {template.complexity}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 pt-20 pb-3 px-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-full overflow-y-auto">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-5 py-2.5 sticky top-0 bg-white border-b border-slate-200 z-10 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <BookTemplate className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Template Gallery</h3>
              <p className="text-xs text-slate-600 leading-tight">Pre-configured templates with best practices</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Pre-Appointment Templates Section */}
          <div className="mb-5">
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide px-3 py-1 bg-blue-50 rounded-full">
                Pre-Appointment BEP Templates
              </h4>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-blue-300 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {preTemplates.map(template => renderTemplateCard(enhanceTemplate(template)))}
              {preTemplates.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="font-semibold">No pre-appointment templates available yet</p>
                  <p className="text-xs text-slate-400 mt-1">Check back soon for new templates</p>
                </div>
              )}
            </div>
          </div>

          {/* Post-Appointment Templates Section */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide px-3 py-1 bg-green-50 rounded-full">
                Post-Appointment BEP Templates
              </h4>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-green-300 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {postTemplates.map(template => renderTemplateCard(enhanceTemplate(template)))}
              {postTemplates.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="font-semibold">No post-appointment templates available yet</p>
                  <p className="text-xs text-slate-400 mt-1">Check back soon for new templates</p>
                </div>
              )}
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg shadow-sm">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <p className="font-semibold mb-0.5">Template System in Development</p>
                <p className="text-amber-800">
                  More templates will be added soon. You'll also be able to save your own BEPs as reusable templates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Actions with Tooltip */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 sticky bottom-0 bg-white shadow-lg">
          <div className="text-xs text-slate-600">
            {selectedTemplate ? (
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span>Selected: <strong>{selectedTemplate.name}</strong></span>
              </span>
            ) : (
              <span className="text-slate-400">Select a template to continue</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelectTemplate}
              disabled={!selectedTemplate || selectedTemplate.comingSoon}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 shadow-md ${
                selectedTemplate && !selectedTemplate.comingSoon
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:shadow-lg transform hover:scale-105'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
              title={!selectedTemplate ? 'Select a template first' : ''}
            >
              <BookTemplate className="w-4 h-4" />
              <span>Use Template</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
