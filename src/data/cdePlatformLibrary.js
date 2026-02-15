/**
 * CDE Platform Library
 * Pre-defined CDE platforms, functional roles, and integration types
 * for the Multi-Platform CDE Strategy builder (Section 7.1)
 */

/**
 * Platform vendor → lucide-react icon name mapping
 * @type {Object<string, string>}
 */
export const VENDOR_ICONS = {
  autodesk: 'Box',
  bentley: 'Hexagon',
  oracle: 'Database',
  trimble: 'Triangle',
  microsoft: 'Cloud',
  nemetschek: 'Layers',
  dropbox: 'HardDrive',
  procore: 'Building2',
  custom: 'Settings'
};

/**
 * @typedef {Object} CDEPlatform
 * @property {string} id - Unique platform identifier
 * @property {string} name - Display name
 * @property {string} vendor - Vendor name
 * @property {string} icon - Key into VENDOR_ICONS
 * @property {string} color - Hex color code
 * @property {string} defaultRole - Default functional role key
 * @property {string[]} capabilities - Platform capabilities
 * @property {string[]} supportedFormats - Supported file format codes
 * @property {string} description - Short platform description
 */

/**
 * Pre-defined CDE platforms with metadata
 * @type {Object<string, CDEPlatform>}
 */
export const PLATFORM_LIBRARY = {
  // Autodesk Ecosystem
  bim360: {
    id: 'bim360',
    name: 'Autodesk BIM 360',
    vendor: 'Autodesk',
    icon: 'autodesk',
    color: '#0696D7',
    defaultRole: 'coordination',
    capabilities: ['3D Coordination', 'Clash Detection', 'Model Viewing', 'Issue Tracking'],
    supportedFormats: ['RVT', 'NWC', 'NWD', 'IFC', 'DWG', 'PDF'],
    description: 'Cloud-based construction management platform'
  },
  acc: {
    id: 'acc',
    name: 'Autodesk Construction Cloud',
    vendor: 'Autodesk',
    icon: 'autodesk',
    color: '#0696D7',
    defaultRole: 'coordination',
    capabilities: ['Design Collaboration', 'Model Coordination', 'Build Management'],
    supportedFormats: ['RVT', 'NWC', 'IFC', 'DWG', 'PDF'],
    description: 'Unified platform connecting design and construction'
  },
  docs: {
    id: 'docs',
    name: 'Autodesk Docs',
    vendor: 'Autodesk',
    icon: 'autodesk',
    color: '#0696D7',
    defaultRole: 'documentation',
    capabilities: ['Document Management', 'Version Control', 'Markup'],
    supportedFormats: ['PDF', 'DWG', 'RVT', 'IFC', 'DOC', 'XLS'],
    description: 'Centralized document management'
  },

  // Bentley Ecosystem
  projectwise: {
    id: 'projectwise',
    name: 'Bentley ProjectWise',
    vendor: 'Bentley',
    icon: 'bentley',
    color: '#00A651',
    defaultRole: 'documentation',
    capabilities: ['Document Management', 'Workflow Automation', 'Version Control', 'Audit Trail'],
    supportedFormats: ['DGN', 'DWG', 'PDF', 'IFC', 'DXF'],
    description: 'Enterprise work sharing and document management'
  },
  itwin: {
    id: 'itwin',
    name: 'Bentley iTwin',
    vendor: 'Bentley',
    icon: 'bentley',
    color: '#00A651',
    defaultRole: 'coordination',
    capabilities: ['Digital Twin', 'Model Federation', 'Analytics', 'Visualization'],
    supportedFormats: ['IFC', 'DGN', 'RVT', 'NWD'],
    description: 'Infrastructure digital twin platform'
  },

  // Oracle/Aconex
  aconex: {
    id: 'aconex',
    name: 'Oracle Aconex',
    vendor: 'Oracle',
    icon: 'oracle',
    color: '#F80000',
    defaultRole: 'documentation',
    capabilities: ['Document Control', 'Transmittals', 'Correspondence', 'Workflow'],
    supportedFormats: ['PDF', 'DWG', 'IFC', 'DOC', 'XLS'],
    description: 'Cloud-based construction document management'
  },

  // Trimble
  trimbleConnect: {
    id: 'trimbleConnect',
    name: 'Trimble Connect',
    vendor: 'Trimble',
    icon: 'trimble',
    color: '#003B5C',
    defaultRole: 'coordination',
    capabilities: ['Model Viewing', 'Clash Detection', 'Issue Tracking', 'Field Collaboration'],
    supportedFormats: ['IFC', 'SKP', 'DWG', 'PDF', 'BCF'],
    description: 'Open BIM collaboration platform'
  },

  // Microsoft
  sharepoint: {
    id: 'sharepoint',
    name: 'Microsoft SharePoint',
    vendor: 'Microsoft',
    icon: 'microsoft',
    color: '#0078D4',
    defaultRole: 'authoring',
    capabilities: ['File Storage', 'Collaboration', 'Version Control', 'Access Control'],
    supportedFormats: ['*'],
    description: 'Enterprise content management and collaboration'
  },
  onedrive: {
    id: 'onedrive',
    name: 'Microsoft OneDrive',
    vendor: 'Microsoft',
    icon: 'microsoft',
    color: '#0078D4',
    defaultRole: 'authoring',
    capabilities: ['File Storage', 'Sync', 'Sharing'],
    supportedFormats: ['*'],
    description: 'Personal and team file storage'
  },
  teams: {
    id: 'teams',
    name: 'Microsoft Teams',
    vendor: 'Microsoft',
    icon: 'microsoft',
    color: '#6264A7',
    defaultRole: 'collaboration',
    capabilities: ['Communication', 'File Sharing', 'Meetings', 'Integration Hub'],
    supportedFormats: ['*'],
    description: 'Team communication and collaboration'
  },

  // Other common platforms
  dropbox: {
    id: 'dropbox',
    name: 'Dropbox Business',
    vendor: 'Dropbox',
    icon: 'dropbox',
    color: '#0061FF',
    defaultRole: 'authoring',
    capabilities: ['File Storage', 'Sync', 'Sharing', 'Version History'],
    supportedFormats: ['*'],
    description: 'Cloud file storage and sync'
  },
  procore: {
    id: 'procore',
    name: 'Procore',
    vendor: 'Procore',
    icon: 'procore',
    color: '#F47E42',
    defaultRole: 'documentation',
    capabilities: ['Project Management', 'Document Control', 'Field Data', 'Quality & Safety'],
    supportedFormats: ['PDF', 'DWG', 'IFC'],
    description: 'Construction project management platform'
  },
  viewpoint: {
    id: 'viewpoint',
    name: 'Viewpoint for Projects',
    vendor: 'Trimble',
    icon: 'trimble',
    color: '#003B5C',
    defaultRole: 'documentation',
    capabilities: ['Document Control', 'Project Information', 'BIM Integration'],
    supportedFormats: ['PDF', 'DWG', 'IFC', 'DOC'],
    description: 'Construction project information management'
  },

  // BIM Coordination Tools (Local/Desktop)
  navisworks: {
    id: 'navisworks',
    name: 'Navisworks (Local)',
    vendor: 'Autodesk',
    icon: 'autodesk',
    color: '#0696D7',
    defaultRole: 'coordination',
    capabilities: ['Clash Detection', '4D Simulation', 'Model Review', 'Quantification'],
    supportedFormats: ['NWC', 'NWD', 'NWF', 'RVT', 'IFC', 'DWG'],
    description: 'Desktop model review and clash detection'
  },
  solibri: {
    id: 'solibri',
    name: 'Solibri',
    vendor: 'Nemetschek',
    icon: 'nemetschek',
    color: '#E31937',
    defaultRole: 'coordination',
    capabilities: ['Model Checking', 'Clash Detection', 'Code Compliance', 'BCF Workflow'],
    supportedFormats: ['IFC', 'BCF'],
    description: 'BIM quality assurance and model checking'
  },
  bimcollab: {
    id: 'bimcollab',
    name: 'BIMcollab',
    vendor: 'BIMcollab',
    icon: 'custom',
    color: '#00B4D8',
    defaultRole: 'coordination',
    capabilities: ['BCF Management', 'Issue Tracking', 'Model Viewing'],
    supportedFormats: ['BCF', 'IFC'],
    description: 'Open BIM issue management'
  },

  // Revit Server / BIM Server
  revitServer: {
    id: 'revitServer',
    name: 'Revit Server',
    vendor: 'Autodesk',
    icon: 'autodesk',
    color: '#0696D7',
    defaultRole: 'authoring',
    capabilities: ['Worksharing', 'Central Model Hosting', 'WAN Optimization'],
    supportedFormats: ['RVT'],
    description: 'On-premise Revit worksharing server'
  },

  // Client/Owner Portals
  clientPortal: {
    id: 'clientPortal',
    name: 'Client Portal',
    vendor: 'Custom',
    icon: 'custom',
    color: '#F59E0B',
    defaultRole: 'clientPortal',
    capabilities: ['Document Access', 'Review', 'Approval'],
    supportedFormats: ['PDF', 'IFC', 'DWG'],
    description: 'Client-facing document portal'
  },

  // Custom platform option
  custom: {
    id: 'custom',
    name: 'Custom Platform',
    vendor: 'Custom',
    icon: 'custom',
    color: '#6B7280',
    defaultRole: 'authoring',
    capabilities: [],
    supportedFormats: [],
    description: 'Add your own platform'
  }
};

/**
 * @typedef {Object} PlatformRole
 * @property {string} id - Role identifier
 * @property {string} label - Full display label
 * @property {string} shortLabel - Abbreviated label
 * @property {string} description - Role description
 * @property {string} color - Hex text color
 * @property {string} bgColor - Hex background color
 * @property {string} borderColor - Hex border color
 * @property {string[]} workflowStates - ISO 19650 workflow states
 * @property {number} order - Display sort order
 */

/**
 * Functional roles for CDE platforms
 * @type {Object<string, PlatformRole>}
 */
export const PLATFORM_ROLES = {
  authoring: {
    id: 'authoring',
    label: 'Authoring (WIP)',
    shortLabel: 'Authoring',
    description: 'Where content is created and initially stored before sharing',
    color: '#3B82F6', // blue
    bgColor: '#DBEAFE',
    borderColor: '#93C5FD',
    workflowStates: ['WIP'],
    order: 1
  },
  coordination: {
    id: 'coordination',
    label: 'Coordination (Shared)',
    shortLabel: 'Coordination',
    description: 'Where models are federated, reviewed, and coordinated across disciplines',
    color: '#8B5CF6', // purple
    bgColor: '#EDE9FE',
    borderColor: '#C4B5FD',
    workflowStates: ['Shared'],
    order: 2
  },
  documentation: {
    id: 'documentation',
    label: 'Documentation (Published)',
    shortLabel: 'Documentation',
    description: 'Official document management, control, and distribution',
    color: '#10B981', // green
    bgColor: '#D1FAE5',
    borderColor: '#6EE7B7',
    workflowStates: ['Published'],
    order: 3
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    shortLabel: 'Archive',
    description: 'Long-term storage, record keeping, and asset handover',
    color: '#6B7280', // gray
    bgColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    workflowStates: ['Archive'],
    order: 4
  },
  clientPortal: {
    id: 'clientPortal',
    label: 'Client Portal',
    shortLabel: 'Client',
    description: 'Client-facing portal for document access and approvals',
    color: '#F59E0B', // amber
    bgColor: '#FEF3C7',
    borderColor: '#FCD34D',
    workflowStates: ['Published'],
    order: 5
  },
  collaboration: {
    id: 'collaboration',
    label: 'Collaboration',
    shortLabel: 'Collab',
    description: 'Team communication and real-time collaboration',
    color: '#EC4899', // pink
    bgColor: '#FCE7F3',
    borderColor: '#F9A8D4',
    workflowStates: ['WIP', 'Shared'],
    order: 6
  }
};

/**
 * Data formats for integrations
 */
export const DATA_FORMATS = {
  // BIM/CAD Formats
  ifc: { id: 'IFC', label: 'IFC', description: 'Industry Foundation Classes (Open BIM)', category: 'bim' },
  rvt: { id: 'RVT', label: 'RVT', description: 'Autodesk Revit', category: 'bim' },
  nwc: { id: 'NWC', label: 'NWC', description: 'Navisworks Cache', category: 'bim' },
  nwd: { id: 'NWD', label: 'NWD', description: 'Navisworks Document', category: 'bim' },
  dgn: { id: 'DGN', label: 'DGN', description: 'MicroStation', category: 'bim' },
  dwg: { id: 'DWG', label: 'DWG', description: 'AutoCAD Drawing', category: 'cad' },
  dxf: { id: 'DXF', label: 'DXF', description: 'Drawing Exchange Format', category: 'cad' },

  // Issue/Coordination Formats
  bcf: { id: 'BCF', label: 'BCF', description: 'BIM Collaboration Format', category: 'coordination' },

  // Document Formats
  pdf: { id: 'PDF', label: 'PDF', description: 'Portable Document Format', category: 'document' },
  doc: { id: 'DOC', label: 'DOC/DOCX', description: 'Microsoft Word', category: 'document' },
  xls: { id: 'XLS', label: 'XLS/XLSX', description: 'Microsoft Excel', category: 'document' },

  // Data Formats
  cobie: { id: 'COBie', label: 'COBie', description: 'Construction Operations Building Information Exchange', category: 'data' },
  json: { id: 'JSON', label: 'JSON', description: 'JavaScript Object Notation', category: 'data' },
  xml: { id: 'XML', label: 'XML', description: 'Extensible Markup Language', category: 'data' },
  csv: { id: 'CSV', label: 'CSV', description: 'Comma Separated Values', category: 'data' },

  // API/Integration
  api: { id: 'API', label: 'API', description: 'Application Programming Interface', category: 'integration' }
};

/**
 * Integration/sync types
 */
export const SYNC_TYPES = {
  manual: {
    id: 'manual',
    label: 'Manual',
    description: 'Files are manually uploaded/downloaded between platforms'
  },
  automated: {
    id: 'automated',
    label: 'Automated',
    description: 'Scheduled automated sync between platforms'
  },
  api: {
    id: 'api',
    label: 'API Integration',
    description: 'Real-time API-based integration'
  },
  plugin: {
    id: 'plugin',
    label: 'Plugin/Add-in',
    description: 'Direct integration via software plugin'
  }
};

/**
 * Sync frequencies
 */
export const SYNC_FREQUENCIES = {
  realtime: { id: 'realtime', label: 'Real-time', description: 'Immediate synchronization' },
  hourly: { id: 'hourly', label: 'Hourly', description: 'Every hour' },
  daily: { id: 'daily', label: 'Daily', description: 'Once per day' },
  weekly: { id: 'weekly', label: 'Weekly', description: 'Once per week' },
  milestone: { id: 'milestone', label: 'At Milestones', description: 'At project milestones' },
  onDemand: { id: 'onDemand', label: 'On Demand', description: 'When manually triggered' }
};

/**
 * Pre-built ecosystem templates
 */
export const ECOSYSTEM_TEMPLATES = {
  autodesk: {
    id: 'autodesk',
    name: 'Autodesk Ecosystem',
    description: 'Full Autodesk stack with BIM 360/ACC, Docs, and Navisworks',
    platforms: [
      { type: 'sharepoint', role: 'authoring', name: 'SharePoint (WIP)' },
      { type: 'acc', role: 'coordination', name: 'Autodesk Construction Cloud' },
      { type: 'navisworks', role: 'coordination', name: 'Navisworks (Clash Detection)' },
      { type: 'docs', role: 'documentation', name: 'Autodesk Docs' }
    ],
    integrations: [
      { source: 0, target: 1, formats: ['RVT', 'IFC'], syncType: 'plugin', frequency: 'daily' },
      { source: 1, target: 2, formats: ['NWC'], syncType: 'automated', frequency: 'weekly' },
      { source: 1, target: 3, formats: ['PDF', 'IFC'], syncType: 'automated', frequency: 'milestone' }
    ]
  },
  bentley: {
    id: 'bentley',
    name: 'Bentley Ecosystem',
    description: 'Bentley ProjectWise and iTwin based workflow',
    platforms: [
      { type: 'sharepoint', role: 'authoring', name: 'SharePoint (WIP)' },
      { type: 'projectwise', role: 'documentation', name: 'ProjectWise' },
      { type: 'itwin', role: 'coordination', name: 'iTwin Platform' },
      { type: 'aconex', role: 'clientPortal', name: 'Aconex (Client)' }
    ],
    integrations: [
      { source: 0, target: 1, formats: ['DGN', 'DWG', 'PDF'], syncType: 'automated', frequency: 'daily' },
      { source: 1, target: 2, formats: ['IFC'], syncType: 'api', frequency: 'daily' },
      { source: 1, target: 3, formats: ['PDF'], syncType: 'automated', frequency: 'milestone' }
    ]
  },
  mixed: {
    id: 'mixed',
    name: 'Mixed Platform',
    description: 'Multi-vendor setup with BIM 360, ProjectWise, and Aconex',
    platforms: [
      { type: 'sharepoint', role: 'authoring', name: 'SharePoint (WIP)' },
      { type: 'bim360', role: 'coordination', name: 'BIM 360 (Coordination)' },
      { type: 'projectwise', role: 'documentation', name: 'ProjectWise (Docs)' },
      { type: 'aconex', role: 'archive', name: 'Aconex (Archive)' }
    ],
    integrations: [
      { source: 0, target: 1, formats: ['RVT', 'IFC'], syncType: 'manual', frequency: 'daily' },
      { source: 1, target: 2, formats: ['IFC', 'PDF'], syncType: 'manual', frequency: 'weekly' },
      { source: 2, target: 3, formats: ['PDF'], syncType: 'automated', frequency: 'milestone' }
    ]
  },
  simple: {
    id: 'simple',
    name: 'Simple Setup',
    description: 'Basic two-platform workflow for smaller projects',
    platforms: [
      { type: 'sharepoint', role: 'authoring', name: 'SharePoint/OneDrive' },
      { type: 'bim360', role: 'coordination', name: 'BIM 360' }
    ],
    integrations: [
      { source: 0, target: 1, formats: ['RVT', 'IFC', 'PDF'], syncType: 'manual', frequency: 'weekly' }
    ]
  },
  trimble: {
    id: 'trimble',
    name: 'Trimble/Open BIM',
    description: 'Open BIM focused with Trimble Connect and Solibri',
    platforms: [
      { type: 'sharepoint', role: 'authoring', name: 'SharePoint (WIP)' },
      { type: 'trimbleConnect', role: 'coordination', name: 'Trimble Connect' },
      { type: 'solibri', role: 'coordination', name: 'Solibri (QA)' },
      { type: 'procore', role: 'documentation', name: 'Procore' }
    ],
    integrations: [
      { source: 0, target: 1, formats: ['IFC'], syncType: 'plugin', frequency: 'daily' },
      { source: 1, target: 2, formats: ['IFC', 'BCF'], syncType: 'api', frequency: 'weekly' },
      { source: 1, target: 3, formats: ['PDF', 'BCF'], syncType: 'api', frequency: 'milestone' }
    ]
  }
};

/**
 * Helper: Get all platforms as array
 */
export const getPlatformList = () => {
  return Object.values(PLATFORM_LIBRARY);
};

/**
 * Helper: Get platform by ID
 */
export const getPlatformById = (id) => {
  return PLATFORM_LIBRARY[id] || PLATFORM_LIBRARY.custom;
};

/**
 * Helper: Get all roles as array sorted by order
 */
export const getRoleList = () => {
  return Object.values(PLATFORM_ROLES).sort((a, b) => a.order - b.order);
};

/**
 * Helper: Get role by ID
 */
export const getRoleById = (id) => {
  return PLATFORM_ROLES[id] || PLATFORM_ROLES.authoring;
};

/**
 * Helper: Get all data formats as array
 */
export const getDataFormatList = () => {
  return Object.values(DATA_FORMATS);
};

/**
 * Helper: Get template by ID
 */
export const getEcosystemTemplateById = (id) => {
  return ECOSYSTEM_TEMPLATES[id] || null;
};

/**
 * Helper: Get all templates as array
 */
export const getTemplateList = () => {
  return Object.values(ECOSYSTEM_TEMPLATES);
};
