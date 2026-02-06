import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Plus,
  Download,
  Upload,
  RotateCcw,
  RotateCw,
  Layers,
  Trash2,
  Grid3x3,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  Maximize2,
  MoreVertical,
  ChevronDown,
  Edit3,
  Eye,
} from 'lucide-react';
import FullscreenDiagramModal from '../diagram-ui/FullscreenDiagramModal';
import FieldHeader from '../../base/FieldHeader';
import FieldError from '../../base/FieldError';

import { nodeTypes, availableShapes } from '../diagram-nodes/CustomNodes';
import {
  convertToReactFlow,
  convertFromReactFlow,
  getDefaultDiagramStructure,
} from '../diagram-utils/diagramMigration';
import { getTemplate, getTemplateOptions } from '../diagram-utils/diagramTemplates';

const CDEDiagramBuilderInner = ({ field, value, onChange, error, readOnly = false, allowModeToggle = true }) => {
  const { name, label, number, required } = field;
  const { screenToFlowPosition } = useReactFlow();

  // Parse initial value
  const getInitialData = () => {
    if (typeof value === 'string' && value) {
      try {
        const parsed = JSON.parse(value);
        return convertToReactFlow(parsed);
      } catch (e) {
        console.warn('Invalid diagram JSON, using default:', e);
      }
    }
    return convertToReactFlow(getDefaultDiagramStructure());
  };

  const initialData = getInitialData();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [internalEditMode, setInternalEditMode] = useState(false);
  const reactFlowWrapper = useRef(null);

  // Determine if we're in read-only mode
  const isReadOnly = readOnly || !internalEditMode;

  // Save to parent form on changes
  const saveToParent = useCallback(
    (currentNodes, currentEdges) => {
      const oldFormat = convertFromReactFlow(currentNodes, currentEdges);
      const jsonString = JSON.stringify(oldFormat, null, 2);
      onChange(name, jsonString);
    },
    [name, onChange]
  );

  // Track changes and save - use ref to avoid infinite loop
  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    // Debounce saves to avoid excessive updates
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (nodes.length > 0 || edges.length > 0) {
        saveToParent(nodes, edges);
      }
    }, 300); // 300ms debounce

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  // Add to history for undo/redo
  const addToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [nodes, edges, history, historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Handle connection between nodes
  const onConnect = useCallback(
    (params) => {
      addToHistory();
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: false,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
            style: {
              strokeWidth: 2,
            },
          },
          eds
        )
      );
    },
    [setEdges, addToHistory]
  );

  // Add a new node
  const addNode = useCallback(
    (type) => {
      addToHistory();
      const position = screenToFlowPosition({ x: 400, y: 300 });

      const newNode = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: {
          label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          type,
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes, addToHistory]
  );

  // Add a new layer/swimlane
  const addLayer = useCallback(() => {
    addToHistory();
    const maxY = nodes.reduce((max, node) => {
      if (node.type === 'swimlane') {
        return Math.max(max, node.position.y);
      }
      return max;
    }, 0);

    const newLayer = {
      id: `layer-${Date.now()}`,
      type: 'swimlane',
      position: { x: 0, y: maxY + 200 },
      data: {
        label: 'New Layer',
        layerIndex: nodes.filter((n) => n.type === 'swimlane').length,
      },
      style: {
        width: 1200,
        height: 150,
      },
      draggable: false,
      selectable: true,
    };
    setNodes((nds) => [...nds, newLayer]);
  }, [nodes, setNodes, addToHistory]);

  // Delete selected nodes
  const deleteSelected = useCallback(() => {
    addToHistory();
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) =>
      eds.filter((edge) => {
        const sourceExists = nodes.find((n) => n.id === edge.source && !n.selected);
        const targetExists = nodes.find((n) => n.id === edge.target && !n.selected);
        return sourceExists && targetExists;
      })
    );
  }, [nodes, setNodes, setEdges, addToHistory]);

  // Export as JSON
  const exportJSON = useCallback(() => {
    const oldFormat = convertFromReactFlow(nodes, edges);
    const dataStr = JSON.stringify(oldFormat, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram-export.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  // Note: Export as SVG/PNG can be added later with additional libraries
  // - SVG: Use React Flow's getNodesBounds and getViewportForBounds methods
  // - PNG: Install html2canvas and use: html2canvas(document.querySelector('.react-flow'))

  // Import from JSON
  const importJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            const converted = convertToReactFlow(imported);
            addToHistory();
            setNodes(converted.nodes);
            setEdges(converted.edges);
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges, addToHistory]);

  // Align selected nodes horizontally
  const alignHorizontal = useCallback(() => {
    const selected = nodes.filter((n) => n.selected && n.type !== 'swimlane');
    if (selected.length < 2) return;

    addToHistory();
    const avgY = selected.reduce((sum, n) => sum + n.position.y, 0) / selected.length;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.selected && node.type !== 'swimlane') {
          return { ...node, position: { ...node.position, y: avgY } };
        }
        return node;
      })
    );
  }, [nodes, setNodes, addToHistory]);

  // Align selected nodes vertically
  const alignVertical = useCallback(() => {
    const selected = nodes.filter((n) => n.selected && n.type !== 'swimlane');
    if (selected.length < 2) return;

    addToHistory();
    const avgX = selected.reduce((sum, n) => sum + n.position.x, 0) / selected.length;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.selected && node.type !== 'swimlane') {
          return { ...node, position: { ...node.position, x: avgX } };
        }
        return node;
      })
    );
  }, [nodes, setNodes, addToHistory]);

  // Handle selection change
  const onSelectionChange = useCallback(({ nodes: selectedNodes }) => {
    setSelectedNodes(selectedNodes);
  }, []);

  // Load template
  const loadTemplate = useCallback(
    (templateKey) => {
      const template = getTemplate(templateKey);
      const converted = convertToReactFlow(template.data);
      addToHistory();
      setNodes(converted.nodes);
      setEdges(converted.edges);
      setShowTemplates(false);
    },
    [setNodes, setEdges, addToHistory]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          undo();
        } else if (event.key === 'z' && event.shiftKey) {
          event.preventDefault();
          redo();
        } else if (event.key === 'y') {
          event.preventDefault();
          redo();
        }
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNodes.length > 0) {
          event.preventDefault();
          deleteSelected();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteSelected, selectedNodes]);

  return (
    <div className="mb-8 w-full">
      <FieldHeader 
        fieldName={name}
        label={label}
        number={number}
        required={required}
      />

      <div className="w-full border rounded-xl overflow-hidden shadow-lg bg-white">

        {/* Preview Mode Header - Clean and Simple */}
        {isReadOnly && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-semibold text-gray-900">CDE Diagram</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span><strong>{nodes.length}</strong> nodes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span><strong>{edges.length}</strong> connections</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!readOnly && allowModeToggle && (
                  <button
                    onClick={() => {
                      setInternalEditMode(true);
                      setShowFocusMode(true);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                    <Maximize2 className="w-4 h-4" />
                    <span>Edit in Fullscreen</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode Header - Full Toolbar */}
        {!isReadOnly && (
          <div className="bg-white px-4 py-2 border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              {/* Left: Brand & Quick Actions */}
              <div className="flex items-center gap-4">
                {/* Brand */}
                <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-semibold text-gray-900">CDE Diagram</span>
                </div>

                {/* History Group */}
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-1.5 text-gray-700 hover:bg-white hover:shadow-sm rounded disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Undo (Ctrl+Z)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-1.5 text-gray-700 hover:bg-white hover:shadow-sm rounded disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Redo (Ctrl+Y)"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Edit Group */}
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={deleteSelected}
                    disabled={selectedNodes.length === 0}
                    className="p-1.5 text-red-600 hover:bg-red-50 hover:shadow-sm rounded disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title={`Delete ${selectedNodes.length > 0 ? `(${selectedNodes.length})` : ''}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={addLayer}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Layer</span>
                  </button>

                  {/* Templates Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg transition-all text-sm font-medium shadow-sm"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Templates</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                    </button>
                  {showTemplates && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowTemplates(false)} />
                      <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-80 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                          <h4 className="font-semibold text-sm text-gray-900">Choose Template</h4>
                          <p className="text-xs text-gray-600 mt-0.5">Start with a pre-built diagram</p>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {getTemplateOptions().map((template, idx) => (
                            <button
                              key={template.value}
                              onClick={() => loadTemplate(template.value)}
                              className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors ${
                                idx !== getTemplateOptions().length - 1 ? 'border-b border-gray-100' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                  <Layers className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-gray-900">{template.label}</div>
                                  <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">{template.description}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Secondary Actions */}
            <div className="flex items-center gap-2">
              {/* Settings/More Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="More Options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {showMoreMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-64 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <h4 className="font-semibold text-sm text-gray-900">Options</h4>
                      </div>
                      <div className="p-2">
                        {/* Grid Toggle */}
                        <button
                          onClick={() => {
                            setSnapToGrid(!snapToGrid);
                            setShowMoreMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Grid3x3 className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700 font-medium">Snap to Grid</span>
                          </div>
                          <div className={`relative w-11 h-6 rounded-full transition-colors ${snapToGrid ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${snapToGrid ? 'right-1' : 'left-1'}`} />
                          </div>
                        </button>

                        <div className="my-2 border-t border-gray-200" />

                        {/* Align Section */}
                        <div className="px-3 py-1.5">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Alignment</span>
                        </div>
                        <button
                          onClick={() => {
                            alignHorizontal();
                            setShowMoreMenu(false);
                          }}
                          disabled={selectedNodes.length < 2}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <AlignHorizontalJustifyCenter className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700 font-medium">Align Horizontal</span>
                        </button>
                        <button
                          onClick={() => {
                            alignVertical();
                            setShowMoreMenu(false);
                          }}
                          disabled={selectedNodes.length < 2}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <AlignVerticalJustifyCenter className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700 font-medium">Align Vertical</span>
                        </button>

                        <div className="my-2 border-t border-gray-200" />

                        {/* Import/Export Section */}
                        <div className="px-3 py-1.5">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Import/Export</span>
                        </div>
                        <button
                          onClick={() => {
                            importJSON();
                            setShowMoreMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm transition-colors"
                        >
                          <Upload className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700 font-medium">Import JSON</span>
                        </button>
                        <button
                          onClick={() => {
                            exportJSON();
                            setShowMoreMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700 font-medium">Export JSON</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Preview Mode Toggle */}
              {allowModeToggle && (
                <button
                  onClick={() => setInternalEditMode(false)}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-all text-sm font-medium shadow-sm"
                  title="Switch to Preview Mode"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              )}

              {/* Focus Mode - Prominent CTA */}
              <button
                onClick={() => setShowFocusMode(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Focus Mode</span>
              </button>
            </div>
          </div>
          </div>
        )}

        {/* React Flow Canvas */}
        <div ref={reactFlowWrapper} style={{ height: '700px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={isReadOnly ? undefined : onNodesChange}
            onEdgesChange={isReadOnly ? undefined : onEdgesChange}
            onConnect={isReadOnly ? undefined : onConnect}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            nodesDraggable={!isReadOnly}
            nodesConnectable={!isReadOnly}
            nodesFocusable={!isReadOnly}
            edgesFocusable={!isReadOnly}
            elementsSelectable={!isReadOnly}
            snapToGrid={snapToGrid}
            snapGrid={[15, 15]}
            fitView
            attributionPosition="bottom-left"
            multiSelectionKeyCode="Shift"
            deleteKeyCode="Delete"
            panOnDrag={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
          >
            <Background variant="dots" gap={16} size={1} color="#ddd" />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'swimlane') return '#f3f4f6';
                return '#cbd5e1';
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
              style={{ background: '#f8f9fa' }}
            />

            {/* Improved Shape Palette - Only show in edit mode */}
            {!isReadOnly && showToolbar && (
              <Panel position="top-left" className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden" style={{ width: '240px' }}>
                <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900">Add Shapes</h4>
                  </div>
                  <button
                    onClick={() => setShowToolbar(false)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded p-1 transition-colors"
                    title="Close"
                  >
                    <span className="text-xl leading-none">×</span>
                  </button>
                </div>
                <div className="p-3 max-h-[500px] overflow-y-auto">
                  <div className="grid grid-cols-3 gap-2">
                    {availableShapes.map((shape) => {
                      const Icon = shape.icon;
                      return (
                        <button
                          key={shape.type}
                          onClick={() => addNode(shape.type)}
                          className="group flex flex-col items-center justify-center p-3 border-2 border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all hover:shadow-md active:scale-95"
                          title={shape.label}
                        >
                          <Icon className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                          <span className="text-xs mt-1.5 text-gray-600 group-hover:text-indigo-700 group-hover:font-medium truncate w-full text-center transition-all">
                            {shape.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Click to add • Drag to position
                  </p>
                </div>
              </Panel>
            )}

            {!isReadOnly && !showToolbar && (
              <Panel position="top-left">
                <button
                  onClick={() => setShowToolbar(true)}
                  className="bg-white rounded-xl shadow-lg p-3 hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-300 transition-all group"
                  title="Show Shapes"
                >
                  <Plus className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                </button>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* Enhanced Footer */}
        <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span><strong>{nodes.length}</strong> nodes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span><strong>{edges.length}</strong> connections</span>
              </div>
              {selectedNodes.length > 0 && (
                <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  <span>{selectedNodes.length} selected</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>⌨️ <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Ctrl+Z</kbd> Undo</span>
              <span>🖱️ <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Shift</kbd> Multi-select</span>
              <span>🗑️ <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Del</kbd> Delete</span>
            </div>
          </div>
        </div>
      </div>

      <FieldError error={error} />

      {/* Focus Mode - Fullscreen Modal */}
      <FullscreenDiagramModal
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
        closeOnClickOutside={false}
      >
        <div style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            snapToGrid={snapToGrid}
            snapGrid={[15, 15]}
            fitView
            attributionPosition="bottom-left"
            multiSelectionKeyCode="Shift"
            deleteKeyCode="Delete"
          >
            <Background variant="dots" gap={16} size={1} color="#ddd" />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'swimlane') return '#f3f4f6';
                return '#cbd5e1';
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
              style={{ background: '#f8f9fa' }}
            />

            {/* Toolbar in Focus Mode */}
            {showToolbar && (
              <Panel position="top-left" className="bg-white rounded-lg shadow-lg p-3 max-w-48">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-gray-700">Shapes</h4>
                  <button
                    onClick={() => setShowToolbar(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {availableShapes.slice(0, 12).map((shape) => {
                    const Icon = shape.icon;
                    return (
                      <button
                        key={shape.type}
                        onClick={() => addNode(shape.type)}
                        className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded hover:bg-gray-50 hover:border-blue-400 transition-all"
                        title={shape.label}
                      >
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="text-xs mt-1 text-gray-600 truncate w-full text-center">
                          {shape.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Panel>
            )}

            {!showToolbar && (
              <Panel position="top-left">
                <button
                  onClick={() => setShowToolbar(true)}
                  className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50"
                  title="Show Toolbar"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </FullscreenDiagramModal>
    </div>
  );
};

const CDEDiagramBuilderV2 = (props) => (
  <ReactFlowProvider>
    <CDEDiagramBuilderInner {...props} />
  </ReactFlowProvider>
);

export default CDEDiagramBuilderV2;
