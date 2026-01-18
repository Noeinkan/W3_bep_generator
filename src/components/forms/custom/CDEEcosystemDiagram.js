import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Position,
  Handle,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Box,
  Hexagon,
  Database,
  Triangle,
  Cloud,
  Layers,
  HardDrive,
  Building2,
  Settings
} from 'lucide-react';
import { getPlatformById, PLATFORM_ROLES } from '../../../data/cdePlatformLibrary';

// Icon mapping
const ICON_MAP = {
  autodesk: Box,
  bentley: Hexagon,
  oracle: Database,
  trimble: Triangle,
  microsoft: Cloud,
  nemetschek: Layers,
  dropbox: HardDrive,
  procore: Building2,
  custom: Settings
};

/**
 * Custom Platform Node component for ReactFlow
 */
const PlatformNode = ({ data, selected }) => {
  const { platform, role, template, editable, onEdit, onDelete } = data;
  const IconComponent = ICON_MAP[template.icon] || Settings;

  return (
    <div
      className={`relative bg-white rounded-xl border-2 shadow-lg p-4 min-w-[160px] transition-all ${
        selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
      } ${editable ? 'cursor-move' : ''}`}
      style={{ borderColor: selected ? '#6366f1' : role.color }}
    >
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />

      {/* Role indicator */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
        style={{
          backgroundColor: role.bgColor,
          color: role.color,
          border: `1px solid ${role.borderColor}`
        }}
      >
        {role.shortLabel}
      </div>

      {/* Platform content */}
      <div className="flex flex-col items-center pt-2">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
          style={{ backgroundColor: `${template.color}20` }}
        >
          <IconComponent
            className="w-6 h-6"
            style={{ color: template.color }}
          />
        </div>
        <span className="text-sm font-semibold text-gray-900 text-center">
          {platform.name || template.name}
        </span>
        <span className="text-xs text-gray-500 mt-0.5">
          {template.vendor}
        </span>

        {/* Data types chips */}
        {platform.dataTypes && platform.dataTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 justify-center max-w-[140px]">
            {platform.dataTypes.slice(0, 4).map(format => (
              <span
                key={format}
                className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium"
              >
                {format}
              </span>
            ))}
            {platform.dataTypes.length > 4 && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">
                +{platform.dataTypes.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Edit/Delete buttons when selected and editable */}
        {editable && selected && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(platform.id);
              }}
              className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
              title="Edit platform"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(platform.id);
              }}
              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete platform"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Register custom node types
const nodeTypes = {
  platform: PlatformNode
};

/**
 * CDEEcosystemDiagram
 * Auto-generated ecosystem diagram from platform/integration data
 *
 * @param {boolean} editable - Enable drag/edit mode
 * @param {function} onPositionChange - Callback when node is dragged: (platformId, position) => void
 * @param {function} onPlatformClick - Callback when platform is clicked: (platformId) => void
 * @param {function} onPlatformEdit - Callback when edit button clicked: (platformId) => void
 * @param {function} onPlatformDelete - Callback when delete button clicked: (platformId) => void
 * @param {function} onIntegrationClick - Callback when edge is clicked: (integrationId) => void
 * @param {string} selectedPlatformId - Currently selected platform ID
 */
const CDEEcosystemDiagram = ({
  platforms = [],
  integrations = [],
  height = 400,
  showControls = true,
  showMiniMap = false,
  editable = false,
  onPositionChange = null,
  onPlatformClick = null,
  onPlatformEdit = null,
  onPlatformDelete = null,
  onIntegrationClick = null,
  selectedPlatformId = null
}) => {
  // Generate initial nodes and edges from data
  const { initialNodes, initialEdges } = useMemo(() => {
    if (platforms.length === 0) {
      return { initialNodes: [], initialEdges: [] };
    }

    // Group platforms by role
    const roleGroups = {};
    Object.keys(PLATFORM_ROLES).forEach(roleId => {
      roleGroups[roleId] = platforms.filter(p => p.role === roleId);
    });

    // Calculate layout
    const sortedRoles = Object.values(PLATFORM_ROLES).sort((a, b) => a.order - b.order);
    const activeRoles = sortedRoles.filter(role => roleGroups[role.id]?.length > 0);

    // Layout constants
    const COLUMN_WIDTH = 220;
    const ROW_HEIGHT = 180;
    const START_X = 50;
    const START_Y = 80;

    // Create nodes with positions
    const nodes = [];
    let platformPositions = {};

    activeRoles.forEach((role, colIndex) => {
      const rolePlatforms = roleGroups[role.id] || [];
      const x = START_X + (colIndex * COLUMN_WIDTH);

      rolePlatforms.forEach((platform, rowIndex) => {
        // Use stored position if available, otherwise calculate
        const defaultY = START_Y + (rowIndex * ROW_HEIGHT);
        const position = platform.position || { x, y: defaultY };
        const template = getPlatformById(platform.type);

        platformPositions[platform.id] = position;

        nodes.push({
          id: platform.id,
          type: 'platform',
          position,
          data: {
            platform,
            role,
            template,
            editable,
            onEdit: onPlatformEdit,
            onDelete: onPlatformDelete
          },
          draggable: editable,
          selected: platform.id === selectedPlatformId
        });
      });
    });

    // Create edges from integrations
    const edges = integrations.map((integration, index) => {
      const sourcePos = platformPositions[integration.sourcePlatformId];
      const targetPos = platformPositions[integration.targetPlatformId];

      if (!sourcePos || !targetPos) return null;

      // Format label
      const formatLabel = integration.dataFormats?.slice(0, 3).join('/') || '';
      const hasMoreFormats = integration.dataFormats?.length > 3;

      return {
        id: integration.id || `edge-${index}`,
        source: integration.sourcePlatformId,
        target: integration.targetPlatformId,
        type: 'smoothstep',
        animated: integration.syncType === 'api' || integration.syncType === 'automated',
        label: formatLabel + (hasMoreFormats ? '...' : ''),
        labelStyle: {
          fontSize: 10,
          fontWeight: 500,
          fill: '#6B7280'
        },
        labelBgStyle: {
          fill: '#F9FAFB',
          stroke: '#E5E7EB',
          strokeWidth: 1
        },
        labelBgPadding: [4, 6],
        labelBgBorderRadius: 4,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: '#9CA3AF'
        },
        markerStart: integration.direction === 'bidirectional' ? {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: '#9CA3AF'
        } : undefined,
        style: {
          stroke: '#9CA3AF',
          strokeWidth: 2
        }
      };
    }).filter(Boolean);

    return { initialNodes: nodes, initialEdges: edges };
  }, [platforms, integrations, editable, selectedPlatformId, onPlatformEdit, onPlatformDelete]);

  // Use state for nodes/edges when editable
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync nodes when platforms change
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Handle node drag end - persist position
  const handleNodeDragStop = useCallback((event, node) => {
    if (onPositionChange) {
      onPositionChange(node.id, node.position);
    }
  }, [onPositionChange]);

  // Handle node click
  const handleNodeClick = useCallback((event, node) => {
    if (onPlatformClick) {
      onPlatformClick(node.id);
    }
  }, [onPlatformClick]);

  // Handle edge click
  const handleEdgeClick = useCallback((event, edge) => {
    if (onIntegrationClick) {
      onIntegrationClick(edge.id);
    }
  }, [onIntegrationClick]);

  // Empty state
  if (platforms.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
        style={{ height }}
      >
        <div className="text-center p-8">
          <Cloud className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No platforms configured</p>
          <p className="text-sm text-gray-400 mt-1">
            Add CDE platforms above to generate the ecosystem diagram
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white" style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={editable ? onNodesChange : undefined}
        onEdgesChange={editable ? onEdgesChange : undefined}
        onNodeDragStop={editable ? handleNodeDragStop : undefined}
        onNodeClick={editable ? handleNodeClick : undefined}
        onEdgeClick={editable ? handleEdgeClick : undefined}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={editable}
        nodesConnectable={false}
        elementsSelectable={editable}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        attributionPosition="bottom-left"
      >
        <Background variant="dots" gap={16} size={1} color="#E5E7EB" />
        {showControls && <Controls showInteractive={false} />}
        {showMiniMap && (
          <MiniMap
            nodeColor={(node) => {
              const role = node.data?.role;
              return role?.color || '#9CA3AF';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            style={{ background: '#F9FAFB' }}
          />
        )}
      </ReactFlow>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-3 shadow-sm">
        <div className="text-xs font-medium text-gray-700 mb-2">Legend</div>
        <div className="flex flex-wrap gap-3">
          {Object.values(PLATFORM_ROLES)
            .filter(role => platforms.some(p => p.role === role.id))
            .sort((a, b) => a.order - b.order)
            .map(role => (
              <div key={role.id} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: role.color }}
                />
                <span className="text-xs text-gray-600">{role.shortLabel}</span>
              </div>
            ))
          }
        </div>
        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-gray-400" />
            <span className="text-xs text-gray-500">Manual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-gray-400 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-transparent to-gray-400 animate-pulse" />
            </div>
            <span className="text-xs text-gray-500">Automated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CDEEcosystemDiagram;
