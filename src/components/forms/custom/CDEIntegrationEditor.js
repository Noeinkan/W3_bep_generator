import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeftRight,
  RefreshCw,
  Upload,
  Zap,
  Clock,
  Plug
} from 'lucide-react';
import BaseTextArea from '../base/BaseTextArea';
import {
  SYNC_TYPES,
  SYNC_FREQUENCIES,
  getPlatformById,
  getDataFormatList
} from '../../../data/cdePlatformLibrary';

/**
 * CDEIntegrationEditor
 * Modal/panel for editing integrations between CDE platforms
 */
const CDEIntegrationEditor = ({
  integration,
  platforms,
  onSave,
  onCancel,
  onDelete,
  isNew = false
}) => {
  const [formData, setFormData] = useState({
    sourcePlatformId: '',
    targetPlatformId: '',
    dataFormats: [],
    syncType: 'manual',
    frequency: 'weekly',
    direction: 'unidirectional',
    description: ''
  });

  // Initialize form data
  useEffect(() => {
    if (integration) {
      setFormData({
        sourcePlatformId: integration.sourcePlatformId || '',
        targetPlatformId: integration.targetPlatformId || '',
        dataFormats: integration.dataFormats || [],
        syncType: integration.syncType || 'manual',
        frequency: integration.frequency || 'weekly',
        direction: integration.direction || 'unidirectional',
        description: integration.description || ''
      });
    }
  }, [integration]);

  // Get source and target platforms
  const sourcePlatform = platforms.find(p => p.id === formData.sourcePlatformId);
  const targetPlatform = platforms.find(p => p.id === formData.targetPlatformId);

  // Get available formats based on selected platforms
  const getAvailableFormats = () => {
    if (!sourcePlatform || !targetPlatform) return getDataFormatList();

    const sourceTemplate = getPlatformById(sourcePlatform.type);
    const targetTemplate = getPlatformById(targetPlatform.type);

    // If either supports all formats
    if (sourceTemplate.supportedFormats[0] === '*' || targetTemplate.supportedFormats[0] === '*') {
      return getDataFormatList();
    }

    // Find common formats
    const commonFormats = sourceTemplate.supportedFormats.filter(f =>
      targetTemplate.supportedFormats.includes(f)
    );

    return getDataFormatList().filter(f => commonFormats.includes(f.id));
  };

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle format toggle
  const handleFormatToggle = (formatId) => {
    setFormData(prev => ({
      ...prev,
      dataFormats: prev.dataFormats.includes(formatId)
        ? prev.dataFormats.filter(f => f !== formatId)
        : [...prev.dataFormats, formatId]
    }));
  };

  // Handle save
  const handleSave = () => {
    if (!formData.sourcePlatformId || !formData.targetPlatformId) {
      return;
    }

    onSave({
      id: integration?.id || `integration-${Date.now()}`,
      ...formData
    });
  };

  // Check if form is valid
  const isValid = formData.sourcePlatformId &&
    formData.targetPlatformId &&
    formData.sourcePlatformId !== formData.targetPlatformId &&
    formData.dataFormats.length > 0;

  // Sync type icons
  const syncTypeIcons = {
    manual: Upload,
    automated: RefreshCw,
    api: Zap,
    plugin: Plug
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isNew ? 'Add Integration' : 'Edit Integration'}
            </h3>
            <p className="text-sm text-gray-600">
              Define how data flows between platforms
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Platform Selection */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end">
            {/* Source Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Platform
              </label>
              <select
                value={formData.sourcePlatformId}
                onChange={e => handleChange('sourcePlatformId', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select platform...</option>
                {platforms.map(p => {
                  const template = getPlatformById(p.type);
                  return (
                    <option key={p.id} value={p.id} disabled={p.id === formData.targetPlatformId}>
                      {p.name || template.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Direction indicator */}
            <div className="pb-2">
              <button
                onClick={() => handleChange('direction',
                  formData.direction === 'unidirectional' ? 'bidirectional' : 'unidirectional'
                )}
                className={`
                  p-3 rounded-lg transition-all
                  ${formData.direction === 'bidirectional'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                title={formData.direction === 'bidirectional' ? 'Bidirectional' : 'Unidirectional'}
              >
                {formData.direction === 'bidirectional'
                  ? <ArrowLeftRight className="w-5 h-5" />
                  : <ArrowRight className="w-5 h-5" />
                }
              </button>
            </div>

            {/* Target Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Platform
              </label>
              <select
                value={formData.targetPlatformId}
                onChange={e => handleChange('targetPlatformId', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select platform...</option>
                {platforms.map(p => {
                  const template = getPlatformById(p.type);
                  return (
                    <option key={p.id} value={p.id} disabled={p.id === formData.sourcePlatformId}>
                      {p.name || template.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Data Formats */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Formats Exchanged
            </label>
            <div className="flex flex-wrap gap-2">
              {getAvailableFormats().map(format => {
                const isSelected = formData.dataFormats.includes(format.id);
                return (
                  <button
                    key={format.id}
                    onClick={() => handleFormatToggle(format.id)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                    title={format.description}
                  >
                    {format.label}
                  </button>
                );
              })}
            </div>
            {formData.dataFormats.length === 0 && (
              <p className="text-sm text-amber-600 mt-2">
                Please select at least one data format
              </p>
            )}
          </div>

          {/* Sync Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Synchronization Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(SYNC_TYPES).map(([key, sync]) => {
                const IconComponent = syncTypeIcons[key] || RefreshCw;
                const isSelected = formData.syncType === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleChange('syncType', key)}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-lg transition-all
                      ${isSelected
                        ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs font-medium">{sync.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {SYNC_TYPES[formData.syncType]?.description}
            </p>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sync Frequency
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SYNC_FREQUENCIES).map(([key, freq]) => {
                const isSelected = formData.frequency === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleChange('frequency', key)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }
                    `}
                    title={freq.description}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {freq.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description / Notes
            </label>
            <BaseTextArea
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Describe the purpose and any special requirements for this integration..."
              rows={3}
              className="px-3 py-2 border-gray-300 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div>
            {!isNew && onDelete && (
              <button
                onClick={() => onDelete(integration.id)}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
              >
                Delete Integration
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`
                px-6 py-2 rounded-lg text-sm font-medium transition-all
                ${isValid
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isNew ? 'Add Integration' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CDEIntegrationEditor;
