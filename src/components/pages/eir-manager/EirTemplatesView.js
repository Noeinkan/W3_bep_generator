import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookTemplate, Building2, CheckCircle, ArrowLeft, Loader } from 'lucide-react';
import { useProject } from '../../../contexts/ProjectContext';
import { getEirTemplateById } from '../../../data/templateRegistry';
import { TEMPLATE_REGISTRY } from '../../../data/templateRegistry';
import apiService from '../../../services/apiService';

const EIR_TEMPLATES = TEMPLATE_REGISTRY
  .filter((t, index, arr) => t.eirData && arr.findIndex(x => x.id === t.id) === index);

const EirTemplatesView = () => {
  const navigate = useNavigate();
  const { currentProject } = useProject();
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUseTemplate = useCallback(async () => {
    if (!selected) return;
    const eirData = getEirTemplateById(selected.id);
    if (!eirData) {
      toast.error('Template data not found');
      return;
    }
    setIsLoading(true);
    try {
      const projectId = currentProject?.id ?? null;
      const res = await apiService.createEirDraft({
        projectId,
        title: `${selected.name} – EIR`,
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
  }, [selected, currentProject, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/eir-manager')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <BookTemplate className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">EIR Templates</h1>
            <p className="text-sm text-slate-500">Select a pre-configured template to start from</p>
          </div>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {EIR_TEMPLATES.map((template) => {
            const isSelected = selected?.id === template.id;
            return (
              <div
                key={template.id}
                onClick={() => setSelected(template)}
                className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 bg-white shadow-sm hover:shadow-md hover:scale-[1.01] ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-purple-100'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{template.name}</h3>
                    <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {template.category}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{template.description}</p>
                {template.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.tags.map(tag => (
                      <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {EIR_TEMPLATES.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-400">
              <BookTemplate className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-semibold">No EIR templates available yet</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">
          <span className="text-sm text-slate-500">
            {selected ? (
              <span className="text-slate-700 font-medium">Selected: {selected.name}</span>
            ) : (
              'Select a template to continue'
            )}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/eir-manager')}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUseTemplate}
              disabled={!selected || isLoading}
              className={`px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                selected && !isLoading
                  ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <BookTemplate className="w-4 h-4" />
              )}
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EirTemplatesView;
