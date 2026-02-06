import React, { useRef, useState, useCallback, useEffect } from 'react';
import * as d3 from 'd3';
import { useMindmapD3 } from '../../../../hooks/useMindmapD3';
import { useUndoRedo } from '../../../../hooks/useUndoRedo';
import {
  parseValue,
  convertToText,
  addNodeToTree,
  removeNodeFromTree,
  updateNodeInTree,
  searchNodes,
  duplicateNodeInTree,
  changeNodeTypeInTree
} from '../../../../utils/mindmapUtils';
import { organizeNodes, snapToGrid } from '../../../../utils/layoutUtils';
import MindmapControls from '../../controls/MindmapControls';
import SearchFilter from '../../controls/SearchFilter';
import FieldHeader from '../../base/FieldHeader';
import QuickAddMenu from '../../controls/QuickAddMenu';
import NodeToolbar from '../../controls/NodeToolbar';
import NodeContextMenu from '../../controls/NodeContextMenu';
import CommandPalette from '../../controls/CommandPalette';
import FullscreenDiagramModal from '../diagram-ui/FullscreenDiagramModal';
import FieldError from '../../base/FieldError';

const VolumeStrategyMindmap = ({ field, value, onChange, error }) => {
  const { name, label, number, required } = field;
  const svgRef = useRef(null);
  const svgRefFullscreen = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [zoomFullscreen, setZoomFullscreen] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [toolbarPositionFullscreen, setToolbarPositionFullscreen] = useState({ x: 0, y: 0 });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [highlightedNodes, setHighlightedNodes] = useState([]);

  // New UI state
  const [quickAddMenuVisible, setQuickAddMenuVisible] = useState(false);
  const [quickAddMenuPosition, setQuickAddMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuNode, setContextMenuNode] = useState(null);
  const [commandPaletteVisible, setCommandPaletteVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [mindmapData, setMindmapData] = useState(() => parseValue(value));

  // Initialize undo/redo with the parsed value
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    pushToHistory
  } = useUndoRedo(parseValue(value));

  const updateValue = useCallback((newData, skipHistory = false) => {
    setMindmapData(newData);

    if (!skipHistory) {
      pushToHistory(newData);
    }

    const textRepresentation = convertToText(newData);
    onChange(name, textRepresentation);
  }, [name, onChange, pushToHistory]);

  // Use the custom D3 hook for normal view
  const { resetView } = useMindmapD3(
    svgRef,
    mindmapData,
    selectedNode,
    setSelectedNode,
    setZoom,
    updateValue,
    highlightedNodes
  );

  // Use the custom D3 hook for fullscreen view
  const { resetView: resetViewFullscreen, forceRedraw: forceRedrawFullscreen } = useMindmapD3(
    svgRefFullscreen,
    mindmapData,
    selectedNode,
    setSelectedNode,
    setZoomFullscreen,
    updateValue,
    highlightedNodes
  );

  // Force redraw fullscreen diagram when modal opens
  useEffect(() => {
    if (isFullscreen && svgRefFullscreen.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        forceRedrawFullscreen();
      }, 50);
    }
  }, [isFullscreen, forceRedrawFullscreen]);

  const addNode = useCallback((nodeType) => {
    if (!selectedNode) return;
    const newData = addNodeToTree(mindmapData, selectedNode, nodeType);
    if (newData) {
      updateValue(newData);
      // Celebrate animation
      const nodeElement = document.querySelector(`[data-node-id="${selectedNode}"]`);
      if (nodeElement) {
        nodeElement.classList.add('animate-celebrate');
        setTimeout(() => nodeElement.classList.remove('animate-celebrate'), 600);
      }
    }
  }, [selectedNode, mindmapData, updateValue]);

  const deleteNode = useCallback(() => {
    console.log('deleteNode called, selectedNode:', selectedNode);
    if (!selectedNode || selectedNode === 'root') {
      console.log('Delete aborted - no selected node or root node');
      return;
    }
    const newData = removeNodeFromTree(mindmapData, selectedNode);
    if (newData) {
      setSelectedNode(null);
      updateValue(newData);
    }
  }, [selectedNode, mindmapData, updateValue]);

  const duplicateNode = useCallback(() => {
    if (!selectedNode) return;
    const newData = duplicateNodeInTree(mindmapData, selectedNode);
    if (newData) updateValue(newData);
  }, [selectedNode, mindmapData, updateValue]);

  const changeNodeType = useCallback((newType) => {
    console.log('changeNodeType called, newType:', newType, 'selectedNode:', selectedNode);
    if (!selectedNode) {
      console.log('ChangeType aborted - no selected node');
      return;
    }
    const newData = changeNodeTypeInTree(mindmapData, selectedNode, newType);
    if (newData) {
      console.log('Type changed successfully');
      updateValue(newData);
    }
  }, [selectedNode, mindmapData, updateValue]);

  const renameNode = useCallback((nodeId, newName) => {
    const newData = updateNodeInTree(mindmapData, nodeId, newName);
    if (newData) {
      updateValue(newData);
    }
  }, [mindmapData, updateValue]);

  // Helper function to calculate toolbar position
  const calculateToolbarPosition = useCallback((svgRefToUse, setPositionFunc) => {
    if (!selectedNode || !svgRefToUse.current) return;

    // Find the node element in the DOM
    const svg = d3.select(svgRefToUse.current);
    const nodeGroups = svg.selectAll('.node-group');

    let nodeElement = null;
    nodeGroups.each(function() {
      const d = d3.select(this).datum();
      if (d && d.id === selectedNode) {
        nodeElement = this;
      }
    });

    if (nodeElement) {
      // Get the bounding box of the node in SVG coordinates
      const bbox = nodeElement.getBBox();

      // Get the transformation matrix from SVG space to screen space
      const svgElement = svgRefToUse.current;
      const pt = svgElement.createSVGPoint();

      // Set point to center of node
      pt.x = bbox.x + bbox.width / 2;
      pt.y = bbox.y + bbox.height / 2;

      // Transform to screen coordinates
      const screenPt = pt.matrixTransform(nodeElement.getCTM());

      // Get SVG container offset
      const svgContainer = svgElement.parentElement;
      const containerRect = svgContainer.getBoundingClientRect();
      const svgRect = svgElement.getBoundingClientRect();

      setPositionFunc({
        x: screenPt.x - svgRect.left + containerRect.left,
        y: screenPt.y - svgRect.top + containerRect.top
      });
    }
  }, [selectedNode]);

  // Calculate toolbar position when node is selected (normal view)
  useEffect(() => {
    if (!isFullscreen && svgRef.current && selectedNode) {
      let animationFrameId;

      const updatePosition = () => {
        calculateToolbarPosition(svgRef, setToolbarPosition);
        // Continue updating on every frame
        animationFrameId = requestAnimationFrame(updatePosition);
      };

      // Start the update loop
      updatePosition();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [selectedNode, isFullscreen, calculateToolbarPosition]);

  // Calculate toolbar position when node is selected (fullscreen view)
  useEffect(() => {
    if (isFullscreen && svgRefFullscreen.current && selectedNode) {
      let animationFrameId;

      const updatePosition = () => {
        calculateToolbarPosition(svgRefFullscreen, setToolbarPositionFullscreen);
        // Continue updating on every frame
        animationFrameId = requestAnimationFrame(updatePosition);
      };

      // Start the update loop
      updatePosition();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [selectedNode, isFullscreen, calculateToolbarPosition]);

  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (previousState) {
      updateValue(previousState, true); // Skip history to prevent infinite loop
    }
  }, [undo, updateValue]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      updateValue(nextState, true); // Skip history to prevent infinite loop
    }
  }, [redo, updateValue]);

  // Helper to calculate position relative to SVG container
  const getRelativePosition = useCallback((clientX, clientY) => {
    if (!svgRef.current) return { x: clientX, y: clientY };

    const svgContainer = svgRef.current.closest('.relative');
    if (!svgContainer) return { x: clientX, y: clientY };

    const rect = svgContainer.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Command Palette - Ctrl+Space
      if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
        e.preventDefault();
        setCommandPaletteVisible(true);
        return;
      }

      // Undo/Redo
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
          return;
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          handleRedo();
          return;
        } else if (e.key === 'd') {
          e.preventDefault();
          duplicateNode();
          return;
        }
      }

      // Only continue with node-specific shortcuts if a node is selected
      if (!selectedNode) return;

      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          setQuickAddMenuVisible(true);
          // Calculate position based on selected node
          const nodeElement = document.querySelector(`[data-node-id="${selectedNode}"]`);
          if (nodeElement) {
            const rect = nodeElement.getBoundingClientRect();
            const relPos = getRelativePosition(rect.left + rect.width / 2, rect.top + rect.height / 2);
            setQuickAddMenuPosition(relPos);
          }
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          deleteNode();
          break;
        case ' ':
          e.preventDefault();
          setQuickAddMenuVisible(true);
          const elem = document.querySelector(`[data-node-id="${selectedNode}"]`);
          if (elem) {
            const rect = elem.getBoundingClientRect();
            const relPos = getRelativePosition(rect.left + rect.width / 2, rect.top + rect.height / 2);
            setQuickAddMenuPosition(relPos);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, handleUndo, handleRedo, deleteNode, duplicateNode, mindmapData, getRelativePosition]);

  // Search functionality
  const matchingNodes = searchNodes(mindmapData, searchTerm, selectedTypes);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    if (term) {
      const matches = searchNodes(mindmapData, term, selectedTypes);
      setHighlightedNodes(matches.map(node => node.id));
    } else {
      setHighlightedNodes([]);
    }
  };

  const handleTypeFilterChange = (types) => {
    setSelectedTypes(types);
    if (searchTerm) {
      const matches = searchNodes(mindmapData, searchTerm, types);
      setHighlightedNodes(matches.map(node => node.id));
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTypes([]);
    setHighlightedNodes([]);
  };

  const handleNavigateToNode = (nodeId) => {
    setSelectedNode(nodeId);
    // TODO: Add smooth animation to focus on the node
  };

  const handleOrganizeNodes = useCallback((layoutType) => {
    const organizedData = organizeNodes(mindmapData, layoutType);
    updateValue(organizedData);
  }, [mindmapData, updateValue]);

  // Auto-layout to tree on initial load
  useEffect(() => {
    if (mindmapData && !mindmapData.x && !mindmapData.y) {
      const organizedData = organizeNodes(mindmapData, 'tree');
      updateValue(organizedData, true); // Skip history for initial layout
    }
  }, []);

  const handleSnapToGrid = () => {
    const snappedData = snapToGrid(mindmapData);
    updateValue(snappedData);
  };

  // Command palette handler
  const handleCommand = useCallback((command) => {
    switch (command) {
      case 'addNode':
        if (selectedNode) {
          setQuickAddMenuVisible(true);
          const elem = document.querySelector(`[data-node-id="${selectedNode}"]`);
          if (elem) {
            const rect = elem.getBoundingClientRect();
            const relPos = getRelativePosition(rect.left + rect.width / 2, rect.top + rect.height / 2);
            setQuickAddMenuPosition(relPos);
          }
        }
        break;
      case 'editNode':
        // Node toolbar will handle editing when node is selected
        break;
      case 'deleteNode':
        deleteNode();
        break;
      case 'duplicateNode':
        duplicateNode();
        break;
      case 'undo':
        handleUndo();
        break;
      case 'redo':
        handleRedo();
        break;
      case 'resetView':
        resetView();
        break;
      case 'organizeNodes':
        handleOrganizeNodes('tree');
        break;
      case 'fullscreen':
        setIsFullscreen(true);
        break;
      default:
        break;
    }
  }, [selectedNode, deleteNode, duplicateNode, handleUndo, handleRedo, resetView, handleOrganizeNodes, mindmapData, getRelativePosition]);

  // Get current node data for context menu
  const getCurrentNodeData = useCallback((nodeId) => {
    const findNode = (node) => {
      if (node.id === nodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };
    return findNode(mindmapData);
  }, [mindmapData]);

  return (
    <div className="mb-8 w-full" role="region" aria-label="Volume Strategy Mindmap">
      <FieldHeader
        fieldName={name}
        label={label}
        number={number}
        required={required}
      />

      <div className="w-full border rounded-xl overflow-hidden shadow-sm bg-white">
        <MindmapControls
          selectedNode={selectedNode}
          zoom={zoom}
          onAddNode={addNode}
          onDeleteNode={deleteNode}
          onResetView={resetView}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          onOrganizeNodes={handleOrganizeNodes}
          onSnapToGrid={handleSnapToGrid}
          onFullscreen={() => setIsFullscreen(true)}
        />

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedTypes={selectedTypes}
          onTypeFilterChange={handleTypeFilterChange}
          onClearFilters={handleClearFilters}
          matchingNodes={matchingNodes}
          onNavigateToNode={handleNavigateToNode}
        />

        <div className="relative bg-gray-50 w-full min-h-[700px]">
          <svg
            ref={svgRef}
            width="100%"
            height="700"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
            className="border-none w-full h-full"
            style={{
              background: 'linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
            tabIndex="0"
          />

          {/* Node Toolbar */}
          {selectedNode && (
            <NodeToolbar
              node={getCurrentNodeData(selectedNode)}
              position={toolbarPosition}
              onRename={(newName) => renameNode(selectedNode, newName)}
              onDelete={deleteNode}
              onDuplicate={duplicateNode}
              onChangeType={changeNodeType}
              onClose={() => setSelectedNode(null)}
            />
          )}

          {/* Quick Add Menu */}
          <QuickAddMenu
            visible={quickAddMenuVisible}
            position={quickAddMenuPosition}
            onAddNode={(type) => {
              addNode(type);
              setQuickAddMenuVisible(false);
            }}
            onClose={() => setQuickAddMenuVisible(false)}
          />

          {/* Context Menu */}
          <NodeContextMenu
            visible={contextMenuVisible}
            position={contextMenuPosition}
            node={contextMenuNode ? getCurrentNodeData(contextMenuNode) : null}
            onAddChild={() => {
              setSelectedNode(contextMenuNode);
              setQuickAddMenuVisible(true);
              setQuickAddMenuPosition(contextMenuPosition);
            }}
            onEdit={() => {
              // Toolbar will handle editing
              setSelectedNode(contextMenuNode);
              setContextMenuVisible(false);
            }}
            onDelete={() => {
              setSelectedNode(contextMenuNode);
              deleteNode();
            }}
            onDuplicate={() => {
              setSelectedNode(contextMenuNode);
              duplicateNode();
            }}
            onChangeType={(type) => {
              setSelectedNode(contextMenuNode);
              changeNodeType(type);
            }}
            onClose={() => {
              setContextMenuVisible(false);
              setContextMenuNode(null);
            }}
          />

          {/* Command Palette */}
          <CommandPalette
            visible={commandPaletteVisible}
            onClose={() => setCommandPaletteVisible(false)}
            onCommand={handleCommand}
            selectedNode={selectedNode}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>

        <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-t">
          <p className="text-xs text-gray-600">
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Click</kbd> Select & Edit •
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs ml-2">Tab</kbd> Quick Add •
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs ml-2">Ctrl+Space</kbd> Commands •
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs ml-2">Del</kbd> Delete
          </p>
        </div>
      </div>

      <FieldError error={error} />

      {/* Fullscreen Modal */}
      <FullscreenDiagramModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
          <div className="w-full h-full flex flex-col">
            <MindmapControls
              selectedNode={selectedNode}
              zoom={zoomFullscreen}
              onAddNode={addNode}
              onDeleteNode={deleteNode}
              onResetView={resetViewFullscreen}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
              onOrganizeNodes={handleOrganizeNodes}
              onSnapToGrid={handleSnapToGrid}
              onFullscreen={() => setIsFullscreen(false)}
            />

            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              selectedTypes={selectedTypes}
              onTypeFilterChange={handleTypeFilterChange}
              onClearFilters={handleClearFilters}
              matchingNodes={matchingNodes}
              onNavigateToNode={handleNavigateToNode}
            />

            <div className="flex-1 overflow-hidden">
              <div className="relative bg-gray-50 w-full h-full">
                <svg
                  ref={svgRefFullscreen}
                  width="100%"
                  height="100%"
                  viewBox="0 0 1000 700"
                  preserveAspectRatio="xMidYMid meet"
                  className="border-none w-full h-full"
                  style={{
                    background: 'linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                  }}
                  tabIndex="0"
                />

                {/* Node Toolbar */}
                {selectedNode && (
                  <NodeToolbar
                    node={getCurrentNodeData(selectedNode)}
                    position={toolbarPositionFullscreen}
                    onRename={(newName) => renameNode(selectedNode, newName)}
                    onDelete={deleteNode}
                    onDuplicate={duplicateNode}
                    onChangeType={changeNodeType}
                    onClose={() => setSelectedNode(null)}
                  />
                )}

                {/* Quick Add Menu */}
                <QuickAddMenu
                  visible={quickAddMenuVisible}
                  position={quickAddMenuPosition}
                  onAddNode={(type) => {
                    addNode(type);
                    setQuickAddMenuVisible(false);
                  }}
                  onClose={() => setQuickAddMenuVisible(false)}
                />

                {/* Context Menu */}
                <NodeContextMenu
                  visible={contextMenuVisible}
                  position={contextMenuPosition}
                  node={contextMenuNode ? getCurrentNodeData(contextMenuNode) : null}
                  onAddChild={() => {
                    setSelectedNode(contextMenuNode);
                    setQuickAddMenuVisible(true);
                    setQuickAddMenuPosition(contextMenuPosition);
                  }}
                  onEdit={() => {
                    // Toolbar will handle editing
                    setSelectedNode(contextMenuNode);
                    setContextMenuVisible(false);
                  }}
                  onDelete={() => {
                    setSelectedNode(contextMenuNode);
                    deleteNode();
                  }}
                  onDuplicate={() => {
                    setSelectedNode(contextMenuNode);
                    duplicateNode();
                  }}
                  onChangeType={(type) => {
                    setSelectedNode(contextMenuNode);
                    changeNodeType(type);
                  }}
                  onClose={() => {
                    setContextMenuVisible(false);
                    setContextMenuNode(null);
                  }}
                />

                {/* Command Palette */}
                <CommandPalette
                  visible={commandPaletteVisible}
                  onClose={() => setCommandPaletteVisible(false)}
                  onCommand={handleCommand}
                  selectedNode={selectedNode}
                  canUndo={canUndo}
                  canRedo={canRedo}
                />
              </div>

              <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-t">
                <p className="text-xs text-gray-600">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Click</kbd> Select & Edit •
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs ml-2">Tab</kbd> Quick Add •
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs ml-2">Ctrl+Space</kbd> Commands •
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs ml-2">Del</kbd> Delete
                </p>
              </div>
            </div>
          </div>
      </FullscreenDiagramModal>
    </div>
  );
};

export default VolumeStrategyMindmap;