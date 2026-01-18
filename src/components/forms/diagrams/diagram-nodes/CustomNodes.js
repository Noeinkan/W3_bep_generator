import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Database,
  FileText,
  Box,
  Server,
  Cloud,
  Workflow,
  Boxes,
  HardDrive,
  Globe,
  Shield,
  Smartphone,
  Monitor,
  Users,
  Cpu,
  Archive,
  FolderOpen,
} from 'lucide-react';

// Icon mapping for different node types
const iconMap = {
  document: FileText,
  database: Database,
  cylinder: Box,
  server: Server,
  cloud: Cloud,
  workflow: Workflow,
  container: Boxes,
  storage: HardDrive,
  api: Globe,
  security: Shield,
  mobile: Smartphone,
  desktop: Monitor,
  users: Users,
  processor: Cpu,
  archive: Archive,
  folder: FolderOpen,
};

// Color schemes for different node types
const colorSchemes = {
  document: 'bg-blue-100 border-blue-400 text-blue-700',
  database: 'bg-green-100 border-green-400 text-green-700',
  cylinder: 'bg-purple-100 border-purple-400 text-purple-700',
  server: 'bg-orange-100 border-orange-400 text-orange-700',
  cloud: 'bg-sky-100 border-sky-400 text-sky-700',
  workflow: 'bg-pink-100 border-pink-400 text-pink-700',
  container: 'bg-indigo-100 border-indigo-400 text-indigo-700',
  storage: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  api: 'bg-teal-100 border-teal-400 text-teal-700',
  security: 'bg-red-100 border-red-400 text-red-700',
  mobile: 'bg-violet-100 border-violet-400 text-violet-700',
  desktop: 'bg-slate-100 border-slate-400 text-slate-700',
  users: 'bg-cyan-100 border-cyan-400 text-cyan-700',
  processor: 'bg-amber-100 border-amber-400 text-amber-700',
  archive: 'bg-lime-100 border-lime-400 text-lime-700',
  folder: 'bg-emerald-100 border-emerald-400 text-emerald-700',
  default: 'bg-gray-100 border-gray-400 text-gray-700',
};

// Base custom node component
const CustomNode = memo(({ data, type, selected }) => {
  const Icon = iconMap[type] || iconMap[data.type] || Box;
  const colorScheme = colorSchemes[type] || colorSchemes[data.type] || colorSchemes.default;

  return (
    <div className="relative">
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500"
        style={{ top: -6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500"
        style={{ left: -6 }}
      />

      {/* Node content */}
      <div
        className={`px-4 py-3 border-2 rounded-lg shadow-md transition-all ${colorScheme} ${
          selected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg'
        }`}
        style={{ minWidth: 120 }}
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm whitespace-nowrap">{data.label}</span>
        </div>
      </div>

      {/* Connection handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-green-500"
        style={{ bottom: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500"
        style={{ right: -6 }}
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

// Swimlane/Layer node component
const SwimlaneNode = memo(({ data, selected }) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg bg-gray-50/80 backdrop-blur-sm p-4 ${
        selected ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300'
      }`}
      style={{
        minWidth: 1200,
        minHeight: 150,
      }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <Boxes className="w-5 h-5 text-gray-600" />
        <span className="font-semibold text-gray-800">{data.label}</span>
      </div>
      <div className="text-xs text-gray-500 italic">
        Layer {data.layerIndex + 1} • Drag nodes here
      </div>
    </div>
  );
});

SwimlaneNode.displayName = 'SwimlaneNode';

// Create node type components for each shape
const createNodeType = (type) => {
  const NodeComponent = memo((props) => <CustomNode {...props} type={type} />);
  NodeComponent.displayName = `${type}Node`;
  return NodeComponent;
};

// Export all node types
export const nodeTypes = {
  swimlane: SwimlaneNode,
  document: createNodeType('document'),
  database: createNodeType('database'),
  cylinder: createNodeType('cylinder'),
  server: createNodeType('server'),
  cloud: createNodeType('cloud'),
  workflow: createNodeType('workflow'),
  container: createNodeType('container'),
  storage: createNodeType('storage'),
  api: createNodeType('api'),
  security: createNodeType('security'),
  mobile: createNodeType('mobile'),
  desktop: createNodeType('desktop'),
  users: createNodeType('users'),
  processor: createNodeType('processor'),
  archive: createNodeType('archive'),
  folder: createNodeType('folder'),
};

// Export shape metadata for the toolbar
export const availableShapes = [
  { type: 'document', label: 'Document', icon: FileText, category: 'Basic' },
  { type: 'database', label: 'Database', icon: Database, category: 'Basic' },
  { type: 'cylinder', label: 'Cylinder', icon: Box, category: 'Basic' },
  { type: 'server', label: 'Server', icon: Server, category: 'Infrastructure' },
  { type: 'cloud', label: 'Cloud', icon: Cloud, category: 'Infrastructure' },
  { type: 'storage', label: 'Storage', icon: HardDrive, category: 'Infrastructure' },
  { type: 'container', label: 'Container', icon: Boxes, category: 'Infrastructure' },
  { type: 'workflow', label: 'Workflow', icon: Workflow, category: 'Process' },
  { type: 'api', label: 'API', icon: Globe, category: 'Integration' },
  { type: 'security', label: 'Security', icon: Shield, category: 'Security' },
  { type: 'mobile', label: 'Mobile', icon: Smartphone, category: 'Devices' },
  { type: 'desktop', label: 'Desktop', icon: Monitor, category: 'Devices' },
  { type: 'users', label: 'Users', icon: Users, category: 'People' },
  { type: 'processor', label: 'Processor', icon: Cpu, category: 'Components' },
  { type: 'archive', label: 'Archive', icon: Archive, category: 'Storage' },
  { type: 'folder', label: 'Folder', icon: FolderOpen, category: 'Storage' },
];
