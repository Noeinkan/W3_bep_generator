import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import {
  Plus,
  Trash2,
  Link2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  LayoutTemplate,
  Maximize2,
  Minimize2,
  Eye,
  Edit3,
  ArrowRight,
  ArrowLeftRight,
  X,
  Grid3x3
} from 'lucide-react';
import FieldHeader from '../base/FieldHeader';
import CDEPlatformCard from './CDEPlatformCard';
import CDEIntegrationEditor from './CDEIntegrationEditor';
import CDEEcosystemDiagram from './CDEEcosystemDiagram';
import FullscreenDiagramModal from '../diagrams/diagram-ui/FullscreenDiagramModal';
import {
  PLATFORM_ROLES,
  ECOSYSTEM_TEMPLATES,
  getPlatformById,
  getPlatformList,
  getTemplateList
} from '../../../data/cdePlatformLibrary';
import FieldError from '../base/FieldError';

/**
 * CDEPlatformEcosystem
 * Main component for Multi-Platform CDE Strategy (Section 7.1)
 *
 * Allows users to:
 * 1. Select CDE platforms from a library
 * 2. Configure each platform's role and settings
 * 3. Define integrations between platforms
 * 4. Auto-generate an ecosystem diagram
 */
const CDEPlatformEcosystemInner = ({
  field,
  value,
  onChange,
  error,
  readOnly = false,
  exportMode = false
}) => {
  const { name, label, number, required } = field;

  // Parse initial value
  const getInitialData = () => {
    const defaultData = {
      platforms: [],
      integrations: [],
      overview: ''
    };

    if (!value) return defaultData;

    // Handle string value (JSON)
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        // Check if it's old format (layers/connections) and migrate
        if (parsed.layers && !parsed.platforms) {
          return migrateFromOldFormat(parsed);
        }
        return { ...defaultData, ...parsed };
      } catch {
        return defaultData;
      }
    }

    // Handle object value
    if (typeof value === 'object') {
      if (value.layers && !value.platforms) {
        return migrateFromOldFormat(value);
      }
      return { ...defaultData, ...value };
    }

    return defaultData;
  };

  /**
   * Migrate from old CDEDiagramBuilder format
   */
  const migrateFromOldFormat = (oldData) => {
    // Try to extract platforms from old layers/models
    const platforms = [];
    const integrations = [];

    if (oldData.layers) {
      oldData.layers.forEach((layer, layerIndex) => {
        const role = layerIndex === 0 ? 'authoring' :
          layerIndex === 1 ? 'coordination' :
            layerIndex === 2 ? 'documentation' : 'archive';

        (layer.models || []).forEach(model => {
          // Try to match model name to a known platform
          const platformType = matchPlatformByName(model.name);
          platforms.push({
            id: model.id || `platform-${Date.now()}-${Math.random()}`,
            type: platformType,
            name: model.name,
            role,
            dataTypes: [],
            description: ''
          });
        });
      });
    }

    // Try to migrate connections
    if (oldData.connections) {
      oldData.connections.forEach((conn, index) => {
        integrations.push({
          id: conn.id || `integration-${index}`,
          sourcePlatformId: conn.from,
          targetPlatformId: conn.to,
          dataFormats: ['IFC'], // Default
          syncType: 'manual',
          frequency: 'weekly',
          direction: 'unidirectional',
          description: ''
        });
      });
    }

    return { platforms, integrations, overview: '' };
  };

  /**
   * Match a platform name to a known platform type
   */
  const matchPlatformByName = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('bim 360') || nameLower.includes('bim360')) return 'bim360';
    if (nameLower.includes('acc') || nameLower.includes('construction cloud')) return 'acc';
    if (nameLower.includes('projectwise')) return 'projectwise';
    if (nameLower.includes('aconex')) return 'aconex';
    if (nameLower.includes('sharepoint')) return 'sharepoint';
    if (nameLower.includes('onedrive')) return 'onedrive';
    if (nameLower.includes('teams')) return 'teams';
    if (nameLower.includes('navisworks')) return 'navisworks';
    if (nameLower.includes('solibri')) return 'solibri';
    if (nameLower.includes('trimble')) return 'trimbleConnect';
    if (nameLower.includes('procore')) return 'procore';
    if (nameLower.includes('dropbox')) return 'dropbox';
    return 'custom';
  };

  // State
  const [data, setData] = useState(getInitialData);
  const [showPlatformSelector, setShowPlatformSelector] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [expandedPlatformId, setExpandedPlatformId] = useState(null);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [isNewIntegration, setIsNewIntegration] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [internalEditMode, setInternalEditMode] = useState(false);
  const [showFocusSidebar, setShowFocusSidebar] = useState(true);
  const [focusPlatformSelector, setFocusPlatformSelector] = useState(false);
  const [selectedPlatformId, setSelectedPlatformId] = useState(null);
  const [snapToGrid, setSnapToGrid] = useState(true);

  const saveTimeoutRef = useRef(null);

  // Determine if we're in read-only mode
  const isReadOnly = readOnly || exportMode || !internalEditMode;

  // Save to parent form on changes
  const saveToParent = useCallback((newData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const jsonString = JSON.stringify(newData, null, 2);
      onChange(name, jsonString);
    }, 300);
  }, [name, onChange]);

  // Update data and save
  const updateData = useCallback((updates) => {
    setData(prev => {
      const newData = { ...prev, ...updates };
      saveToParent(newData);
      return newData;
    });
  }, [saveToParent]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Platform operations
  const addPlatform = (platformType) => {
    const template = getPlatformById(platformType);
    const newPlatform = {
      id: `platform-${Date.now()}`,
      type: platformType,
      name: template.name,
      role: template.defaultRole,
      dataTypes: template.supportedFormats[0] === '*' ? [] : [...template.supportedFormats],
      description: ''
    };

    updateData({
      platforms: [...data.platforms, newPlatform]
    });
    setShowPlatformSelector(false);
    setExpandedPlatformId(newPlatform.id);
  };

  const removePlatform = (platformId) => {
    // Also remove any integrations involving this platform
    const newIntegrations = data.integrations.filter(
      i => i.sourcePlatformId !== platformId && i.targetPlatformId !== platformId
    );

    updateData({
      platforms: data.platforms.filter(p => p.id !== platformId),
      integrations: newIntegrations
    });
  };

  const updatePlatform = (updatedPlatform) => {
    updateData({
      platforms: data.platforms.map(p =>
        p.id === updatedPlatform.id ? updatedPlatform : p
      )
    });
  };

  // Handle platform position change from diagram drag
  const handlePositionChange = useCallback((platformId, position) => {
    updateData({
      platforms: data.platforms.map(p =>
        p.id === platformId ? { ...p, position } : p
      )
    });
  }, [data.platforms, updateData]);

  // Handle platform click in diagram
  const handlePlatformClick = useCallback((platformId) => {
    setSelectedPlatformId(prev => prev === platformId ? null : platformId);
  }, []);

  // Handle platform edit from diagram
  const handlePlatformEdit = useCallback((platformId) => {
    setExpandedPlatformId(platformId);
    setShowFocusSidebar(true);
  }, []);

  // Handle integration click in diagram
  const handleIntegrationClick = useCallback((integrationId) => {
    const integration = data.integrations.find(i => i.id === integrationId);
    if (integration) {
      setEditingIntegration(integration);
      setIsNewIntegration(false);
    }
  }, [data.integrations]);

  // Integration operations
  const openNewIntegration = () => {
    setEditingIntegration({
      id: '',
      sourcePlatformId: data.platforms[0]?.id || '',
      targetPlatformId: data.platforms[1]?.id || '',
      dataFormats: [],
      syncType: 'manual',
      frequency: 'weekly',
      direction: 'unidirectional',
      description: ''
    });
    setIsNewIntegration(true);
  };

  const saveIntegration = (integration) => {
    if (isNewIntegration) {
      updateData({
        integrations: [...data.integrations, integration]
      });
    } else {
      updateData({
        integrations: data.integrations.map(i =>
          i.id === integration.id ? integration : i
        )
      });
    }
    setEditingIntegration(null);
    setIsNewIntegration(false);
  };

  const deleteIntegration = (integrationId) => {
    updateData({
      integrations: data.integrations.filter(i => i.id !== integrationId)
    });
    setEditingIntegration(null);
    setIsNewIntegration(false);
  };

  // Load template
  const loadTemplate = (templateId) => {
    const template = ECOSYSTEM_TEMPLATES[templateId];
    if (!template) return;

    // Create platforms from template
    const platforms = template.platforms.map((p, index) => ({
      id: `platform-${Date.now()}-${index}`,
      type: p.type,
      name: p.name,
      role: p.role,
      dataTypes: getPlatformById(p.type).supportedFormats[0] === '*'
        ? []
        : [...getPlatformById(p.type).supportedFormats],
      description: ''
    }));

    // Create integrations from template
    const integrations = template.integrations.map((i, index) => ({
      id: `integration-${Date.now()}-${index}`,
      sourcePlatformId: platforms[i.source].id,
      targetPlatformId: platforms[i.target].id,
      dataFormats: i.formats,
      syncType: i.syncType,
      frequency: i.frequency,
      direction: 'unidirectional',
      description: ''
    }));

    updateData({ platforms, integrations });
    setShowTemplates(false);
  };

  // Render integration row
  const renderIntegrationRow = (integration) => {
    const source = data.platforms.find(p => p.id === integration.sourcePlatformId);
    const target = data.platforms.find(p => p.id === integration.targetPlatformId);

    if (!source || !target) return null;

    const sourceTemplate = getPlatformById(source.type);
    const targetTemplate = getPlatformById(target.type);

    return (
      <div
        key={integration.id}
        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
        onClick={() => {
          if (!isReadOnly) {
            setEditingIntegration(integration);
            setIsNewIntegration(false);
          }
        }}
      >
        {/* Source */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ backgroundColor: `${sourceTemplate.color}20` }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: sourceTemplate.color }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 truncate">
            {source.name || sourceTemplate.name}
          </span>
        </div>

        {/* Arrow and formats */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-gray-200">
            {integration.dataFormats.slice(0, 3).map(f => (
              <span key={f} className="text-xs font-medium text-gray-600">{f}</span>
            ))}
            {integration.dataFormats.length > 3 && (
              <span className="text-xs text-gray-400">+{integration.dataFormats.length - 3}</span>
            )}
          </div>
          {integration.direction === 'bidirectional'
            ? <ArrowLeftRight className="w-4 h-4 text-gray-400" />
            : <ArrowRight className="w-4 h-4 text-gray-400" />
          }
        </div>

        {/* Target */}
        <div className="flex items-center gap-2 min-w-[120px] justify-end">
          <span className="text-sm font-medium text-gray-700 truncate">
            {target.name || targetTemplate.name}
          </span>
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ backgroundColor: `${targetTemplate.color}20` }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: targetTemplate.color }}
            />
          </div>
        </div>

        {/* Delete button */}
        {!isReadOnly && (
          <button
            onClick={e => {
              e.stopPropagation();
              deleteIntegration(integration.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  // Export mode - simplified view
  if (exportMode) {
    return (
      <div className="w-full">
        <ReactFlowProvider>
          <CDEEcosystemDiagram
            platforms={data.platforms}
            integrations={data.integrations}
            height={500}
            showControls={false}
            showMiniMap={false}
          />
        </ReactFlowProvider>
      </div>
    );
  }

  return (
    <div className="mb-8 w-full">
      <FieldHeader
        fieldName={name}
        label={label}
        number={number}
        required={required}
      />

      <div className="w-full border rounded-xl overflow-hidden shadow-lg bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-900">CDE Platform Ecosystem</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span><strong>{data.platforms.length}</strong> platforms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span><strong>{data.integrations.length}</strong> integrations</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isReadOnly ? (
                <button
                  onClick={() => {
                    setInternalEditMode(true);
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Configuration</span>
                </button>
              ) : (
                <>
                  {/* Templates button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg transition-all text-sm font-medium"
                    >
                      <LayoutTemplate className="w-4 h-4" />
                      <span>Templates</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                    </button>

                    {showTemplates && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowTemplates(false)} />
                        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-72 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                            <h4 className="font-semibold text-sm text-gray-900">Load Template</h4>
                            <p className="text-xs text-gray-600 mt-0.5">Start with a pre-configured ecosystem</p>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {getTemplateList().map((template, idx) => (
                              <button
                                key={template.id}
                                onClick={() => loadTemplate(template.id)}
                                className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors ${idx !== getTemplateList().length - 1 ? 'border-b border-gray-100' : ''
                                  }`}
                              >
                                <div className="font-medium text-sm text-gray-900">{template.name}</div>
                                <div className="text-xs text-gray-600 mt-0.5">{template.description}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Preview mode */}
                  <button
                    onClick={() => setInternalEditMode(false)}
                    className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={() => setShowFullscreen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Focus Mode</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Platforms Section */}
          {!isReadOnly && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">CDE Platforms</h3>
                <button
                  onClick={() => setShowPlatformSelector(!showPlatformSelector)}
                  className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Platform
                </button>
              </div>

              {/* Platform selector */}
              {showPlatformSelector && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Select a platform to add</span>
                    <button
                      onClick={() => setShowPlatformSelector(false)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {getPlatformList()
                      .filter(p => p.id !== 'custom')
                      .map(platform => (
                        <CDEPlatformCard
                          key={platform.id}
                          platform={{ type: platform.id }}
                          selectionMode={true}
                          isSelected={data.platforms.some(p => p.type === platform.id)}
                          onSelect={() => addPlatform(platform.id)}
                        />
                      ))}
                    {/* Custom platform option */}
                    <CDEPlatformCard
                      platform={{ type: 'custom' }}
                      selectionMode={true}
                      isSelected={false}
                      onSelect={() => addPlatform('custom')}
                    />
                  </div>
                </div>
              )}

              {/* Platform cards */}
              {data.platforms.length > 0 ? (
                <div className="space-y-3">
                  {data.platforms.map(platform => (
                    <CDEPlatformCard
                      key={platform.id}
                      platform={platform}
                      isExpanded={expandedPlatformId === platform.id}
                      onToggleExpand={(id) => setExpandedPlatformId(
                        expandedPlatformId === id ? null : id
                      )}
                      onUpdate={updatePlatform}
                      onRemove={removePlatform}
                      disabled={isReadOnly}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Layers className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">No platforms added</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Click "Add Platform" or load a template to get started
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Integrations Section */}
          {!isReadOnly && data.platforms.length >= 2 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Integrations</h3>
                <button
                  onClick={openNewIntegration}
                  className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <Link2 className="w-4 h-4" />
                  Add Integration
                </button>
              </div>

              {data.integrations.length > 0 ? (
                <div className="space-y-2">
                  {data.integrations.map(integration => renderIntegrationRow(integration))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Link2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No integrations defined</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Define how data flows between platforms
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ecosystem Diagram */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Ecosystem Diagram</h3>
            <ReactFlowProvider>
              <CDEEcosystemDiagram
                platforms={data.platforms}
                integrations={data.integrations}
                height={400}
                showControls={true}
                showMiniMap={false}
              />
            </ReactFlowProvider>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              {Object.values(PLATFORM_ROLES)
                .filter(role => data.platforms.some(p => p.role === role.id))
                .sort((a, b) => a.order - b.order)
                .map(role => {
                  const count = data.platforms.filter(p => p.role === role.id).length;
                  return (
                    <div key={role.id} className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      <span>{role.shortLabel}: <strong>{count}</strong></span>
                    </div>
                  );
                })
              }
            </div>
            <span className="text-gray-400">
              ISO 19650 CDE Strategy
            </span>
          </div>
        </div>
      </div>

      {/* Integration Editor Modal */}
      {editingIntegration && (
        <CDEIntegrationEditor
          integration={editingIntegration}
          platforms={data.platforms}
          onSave={saveIntegration}
          onCancel={() => {
            setEditingIntegration(null);
            setIsNewIntegration(false);
          }}
          onDelete={deleteIntegration}
          isNew={isNewIntegration}
        />
      )}

      {/* Fullscreen Modal with Full Editing */}
      <FullscreenDiagramModal
        isOpen={showFullscreen}
        onClose={() => {
          setShowFullscreen(false);
          setSelectedPlatformId(null);
        }}
        closeOnClickOutside={false}
      >
        <div className="w-full h-full flex flex-col bg-gray-50">
          {/* Focus Mode Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              {/* Toggle Sidebar */}
              <button
                onClick={() => setShowFocusSidebar(!showFocusSidebar)}
                className={`p-2 rounded-lg transition-colors ${
                  showFocusSidebar ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={showFocusSidebar ? 'Hide sidebar' : 'Show sidebar'}
              >
                {showFocusSidebar ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>

              {/* Brand */}
              <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-900">Focus Mode</span>
              </div>

              {/* Add Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFocusPlatformSelector(!focusPlatformSelector)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    focusPlatformSelector
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Platform</span>
                </button>

                <button
                  onClick={openNewIntegration}
                  disabled={data.platforms.length < 2}
                  className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Link2 className="w-4 h-4" />
                  <span>Add Integration</span>
                </button>

                {/* Templates */}
                <div className="relative">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                  >
                    <LayoutTemplate className="w-4 h-4" />
                    <span>Templates</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                  </button>

                  {showTemplates && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowTemplates(false)} />
                      <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-72 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                          <h4 className="font-semibold text-sm text-gray-900">Load Template</h4>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {getTemplateList().map((template, idx) => (
                            <button
                              key={template.id}
                              onClick={() => loadTemplate(template.id)}
                              className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors ${
                                idx !== getTemplateList().length - 1 ? 'border-b border-gray-100' : ''
                              }`}
                            >
                              <div className="font-medium text-sm text-gray-900">{template.name}</div>
                              <div className="text-xs text-gray-600 mt-0.5">{template.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Snap to Grid */}
              <button
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  snapToGrid ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Snap to grid"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>

              {/* Stats */}
              <div className="flex items-center gap-3 px-3 text-xs text-gray-600 border-l border-gray-200 ml-2">
                <span><strong>{data.platforms.length}</strong> platforms</span>
                <span><strong>{data.integrations.length}</strong> integrations</span>
              </div>

              {/* Close */}
              <button
                onClick={() => {
                  setShowFullscreen(false);
                  setSelectedPlatformId(null);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg ml-2"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            {showFocusSidebar && (
              <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
                {/* Platform Selector */}
                {focusPlatformSelector && (
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Select Platform</span>
                      <button
                        onClick={() => setFocusPlatformSelector(false)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {getPlatformList()
                        .filter(p => p.id !== 'custom')
                        .map(platform => (
                          <CDEPlatformCard
                            key={platform.id}
                            platform={{ type: platform.id }}
                            selectionMode={true}
                            isSelected={data.platforms.some(p => p.type === platform.id)}
                            onSelect={() => {
                              addPlatform(platform.id);
                              setFocusPlatformSelector(false);
                            }}
                          />
                        ))}
                      <CDEPlatformCard
                        platform={{ type: 'custom' }}
                        selectionMode={true}
                        isSelected={false}
                        onSelect={() => {
                          addPlatform('custom');
                          setFocusPlatformSelector(false);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Platform List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Platforms ({data.platforms.length})</h4>
                  {data.platforms.length > 0 ? (
                    <div className="space-y-2">
                      {data.platforms.map(platform => (
                        <CDEPlatformCard
                          key={platform.id}
                          platform={platform}
                          isExpanded={expandedPlatformId === platform.id}
                          onToggleExpand={(id) => setExpandedPlatformId(
                            expandedPlatformId === id ? null : id
                          )}
                          onUpdate={updatePlatform}
                          onRemove={removePlatform}
                          disabled={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      <Layers className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No platforms added</p>
                      <p className="text-xs text-gray-400 mt-1">Click "Add Platform" to start</p>
                    </div>
                  )}
                </div>

                {/* Integrations List */}
                {data.platforms.length >= 2 && (
                  <div className="border-t border-gray-200 p-4 max-h-64 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Integrations ({data.integrations.length})</h4>
                      <button
                        onClick={openNewIntegration}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        + Add
                      </button>
                    </div>
                    {data.integrations.length > 0 ? (
                      <div className="space-y-1">
                        {data.integrations.map(integration => {
                          const source = data.platforms.find(p => p.id === integration.sourcePlatformId);
                          const target = data.platforms.find(p => p.id === integration.targetPlatformId);
                          if (!source || !target) return null;
                          return (
                            <button
                              key={integration.id}
                              onClick={() => {
                                setEditingIntegration(integration);
                                setIsNewIntegration(false);
                              }}
                              className="w-full flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs transition-colors"
                            >
                              <span className="font-medium truncate">{source.name || getPlatformById(source.type).name}</span>
                              {integration.direction === 'bidirectional'
                                ? <ArrowLeftRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                : <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              }
                              <span className="font-medium truncate">{target.name || getPlatformById(target.type).name}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 text-center py-2">No integrations defined</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Diagram Area */}
            <div className="flex-1 relative">
              <ReactFlowProvider>
                <CDEEcosystemDiagram
                  platforms={data.platforms}
                  integrations={data.integrations}
                  height="100%"
                  showControls={true}
                  showMiniMap={true}
                  editable={true}
                  onPositionChange={handlePositionChange}
                  onPlatformClick={handlePlatformClick}
                  onPlatformEdit={handlePlatformEdit}
                  onPlatformDelete={removePlatform}
                  onIntegrationClick={handleIntegrationClick}
                  selectedPlatformId={selectedPlatformId}
                />
              </ReactFlowProvider>
            </div>
          </div>
        </div>
      </FullscreenDiagramModal>

      <FieldError error={error} className="mt-2" />
    </div>
  );
};

// Wrap with ReactFlowProvider
const CDEPlatformEcosystem = (props) => (
  <CDEPlatformEcosystemInner {...props} />
);

export default CDEPlatformEcosystem;
