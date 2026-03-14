import { useState } from 'react';
import { X, BookTemplate, Building2, CheckCircle, AlertCircle, Star, ArrowLeft } from 'lucide-react';

const COLOR_CLASSES = {
  blue: {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    border: 'border-blue-400',
    borderHover: 'hover:border-blue-300',
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    badge: 'bg-blue-100 text-blue-700',
    headerGradient: 'from-blue-500 to-blue-600',
    buttonGradient: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
  },
  purple: {
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
    border: 'border-purple-400',
    borderHover: 'hover:border-purple-300',
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    badge: 'bg-purple-100 text-purple-700',
    headerGradient: 'from-purple-500 to-purple-600',
    buttonGradient: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
  },
  green: {
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
    border: 'border-green-400',
    borderHover: 'hover:border-green-300',
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    badge: 'bg-green-100 text-green-700',
    headerGradient: 'from-green-500 to-green-600',
    buttonGradient: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
  },
  amber: {
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    border: 'border-amber-400',
    borderHover: 'hover:border-amber-300',
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
    badge: 'bg-amber-100 text-amber-700',
    headerGradient: 'from-amber-500 to-amber-600',
    buttonGradient: 'from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
  }
};

const DEFAULT_ACCENT = 'purple';

/**
 * Shared template gallery: same panels/cards for BEP, EIR, OIR.
 * mode: 'modal' (overlay) or 'page' (inline). accentColor drives header/primary button.
 * templates: { id, name, category, description, tags?, icon?, color?, recommended?, comingSoon?, complexity?, ... }
 * groups: optional [{ key, label }], groupBy: template field to group by (e.g. bepType).
 */
const TemplateGallery = ({
  mode = 'modal',
  title = 'Template Gallery',
  description = 'Pre-configured templates with best practices',
  headerIcon: HeaderIcon = BookTemplate,
  accentColor = DEFAULT_ACCENT,
  templates = [],
  groups = null,
  groupBy = null,
  onSelect,
  onCancel,
  onBack = null,
  notice = null,
  emptyMessage = null,
  primaryActionLabel = 'Use Template',
  isLoading = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const theme = COLOR_CLASSES[accentColor] || COLOR_CLASSES[DEFAULT_ACCENT];

  const handleConfirm = () => {
    if (selectedTemplate && !selectedTemplate.comingSoon && onSelect) {
      onSelect(selectedTemplate);
    }
  };

  const getTemplatesForGroup = (groupKey) => {
    if (!groupBy) return templates;
    return templates.filter(t => t[groupBy] === groupKey);
  };

  const renderCard = (template) => {
    const cardColor = COLOR_CLASSES[template.color] || theme;
    const isSelected = selectedTemplate?.id === template.id;

    return (
      <div
        key={template.id}
        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
          template.comingSoon
            ? 'opacity-60 cursor-not-allowed border-slate-200 bg-slate-50'
            : isSelected
            ? `${cardColor.border} ${cardColor.bg} shadow-xl scale-[1.02]`
            : `border-slate-200 ${cardColor.borderHover} hover:shadow-lg hover:scale-[1.02]`
        }`}
        onClick={() => !template.comingSoon && setSelectedTemplate(template)}
      >
        {template.comingSoon && (
          <div className="absolute inset-0 bg-slate-900 bg-opacity-40 backdrop-blur-[1px] rounded-lg flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-lg shadow-lg">
              Coming Soon
            </span>
          </div>
        )}
        {template.recommended && !template.comingSoon && (
          <div className="absolute -top-2 -right-2 z-20">
            <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
              <Star className="w-3 h-3 fill-white" />
              <span>Recommended</span>
            </div>
          </div>
        )}
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${cardColor.iconBg} shadow-sm`}>
            {(() => {
              const Icon = template.icon || Building2;
              return <Icon className={`w-8 h-8 ${cardColor.iconText}`} />;
            })()}
          </div>
          {isSelected && !template.comingSoon && (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <h4 className="text-base font-bold text-slate-900 mb-1.5">{template.name}</h4>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed line-clamp-2">{template.description}</p>
        <div className="flex flex-wrap gap-1.5">
          <span className={`px-2 py-1 rounded text-xs font-semibold shadow-sm ${cardColor.badge}`}>
            {template.category}
          </span>
          {(template.complexity || 'Intermediate') && (
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold shadow-sm">
              {template.complexity || 'Intermediate'}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (templates.length === 0) {
      return (
        <div className="col-span-full text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          {emptyMessage || (
            <>
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="font-semibold">No templates available yet</p>
              <p className="text-xs text-slate-400 mt-1">Check back soon for new templates</p>
            </>
          )}
        </div>
      );
    }

    if (groups && groupBy) {
      const groupLabelClasses = {
        blue: 'bg-blue-50',
        green: 'bg-green-50',
        purple: 'bg-purple-50',
        amber: 'bg-amber-50'
      };
      return groups.map(({ key, label, accent = 'blue' }) => {
        const groupTemplates = getTemplatesForGroup(key);
        const pillClass = groupLabelClasses[accent] || groupLabelClasses.blue;
        return (
          <div key={key} className="mb-5">
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <h4 className={`text-sm font-bold text-slate-700 uppercase tracking-wide px-3 py-1 rounded-full ${pillClass}`}>
                {label}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-300 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {groupTemplates.map(renderCard)}
              {groupTemplates.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="font-semibold">No templates in this section yet</p>
                </div>
              )}
            </div>
          </div>
        );
      });
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map(renderCard)}
      </div>
    );
  };

  const panel = (
    <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-full overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between px-5 py-2.5 sticky top-0 bg-white border-b border-slate-200 z-10 shadow-sm">
        <div className="flex items-center space-x-2">
          {mode === 'page' && onBack && (
            <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="Back">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <div className={`w-8 h-8 bg-gradient-to-br ${theme.headerGradient} rounded-lg flex items-center justify-center shadow-md`}>
            <HeaderIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">{title}</h3>
            <p className="text-xs text-slate-600 leading-tight">{description}</p>
          </div>
        </div>
        {mode === 'modal' && (
          <button onClick={onCancel} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="Close">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        )}
      </div>
      <div className="px-6 py-4 flex-1 overflow-y-auto">
        {renderContent()}
        {notice && (
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg shadow-sm">
            {notice}
          </div>
        )}
      </div>
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
            onClick={handleConfirm}
            disabled={!selectedTemplate || selectedTemplate?.comingSoon || isLoading}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 shadow-md ${
              selectedTemplate && !selectedTemplate.comingSoon && !isLoading
                ? `bg-gradient-to-r ${theme.buttonGradient} text-white hover:shadow-lg transform hover:scale-105`
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
            title={!selectedTemplate ? 'Select a template first' : ''}
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <BookTemplate className="w-4 h-4" />
            )}
            <span>{primaryActionLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (mode === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 pt-20 pb-3 px-3">
        {panel}
      </div>
    );
  }

  return panel;
};

export default TemplateGallery;
