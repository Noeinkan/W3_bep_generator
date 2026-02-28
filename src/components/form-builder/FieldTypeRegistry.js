/**
 * Field Type Registry
 *
 * Central registry for all field types used in the BEP wizard.
 * Maps field type strings to their respective components and metadata.
 */

import React from 'react';
import {
  Type,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  Table,
  FileText,
  BookOpen,
  Calendar,
  DollarSign,
  Users,
  Folder,
  Network,
  Share2,
  FileSignature,
  GitMerge,
  Heading,
  Link,
  Grid3X3,
  Image,
  Info,
  GitBranch
} from 'lucide-react';

// Lazy load components for better performance
const EditableTable = React.lazy(() => import('../forms/base/EditableTable'));
const IntroTableField = React.lazy(() => import('../forms/base/IntroTableField'));
const CheckboxGroup = React.lazy(() => import('../forms/base/CheckboxGroup'));
const StandardsTable = React.lazy(() => import('../forms/tables/StandardsTable'));
const TipTapEditor = React.lazy(() => import('../forms/editors/TipTapEditor'));
const TimelineInput = React.lazy(() => import('../forms/specialized/TimelineInput'));
const BudgetInput = React.lazy(() => import('../forms/specialized/BudgetInput'));
const OrgStructureField = React.lazy(() => import('../forms/specialized/OrgStructureField'));
const OrgStructureDataTable = React.lazy(() => import('../forms/specialized/OrgStructureDataTable'));
const FolderStructureDiagram = React.lazy(() => import('../forms/diagrams/diagram-components/FolderStructureDiagram'));
const VolumeStrategyMindmap = React.lazy(() => import('../forms/diagrams/diagram-components/VolumeStrategyMindmap'));
const CDEPlatformEcosystem = React.lazy(() => import('../forms/custom/CDEPlatformEcosystem'));
const NamingConventionBuilder = React.lazy(() => import('../forms/custom/NamingConventionBuilder'));
const FederationStrategyBuilder = React.lazy(() => import('../forms/custom/FederationStrategyBuilder'));
const MilestonesTableField = React.lazy(() => import('../forms/specialized/MilestonesTableField'));
const TidpReferenceField = React.lazy(() => import('../forms/specialized/TidpReferenceField'));
const TidpSectionField = React.lazy(() => import('../forms/specialized/TidpSectionField'));
const DeliverablesMatrixField = React.lazy(() => import('../forms/specialized/DeliverablesMatrixField'));
const ImActivitiesMatrixField = React.lazy(() => import('../forms/specialized/ImActivitiesMatrixField'));
const ImageUploadField = React.lazy(() => import('../forms/base/ImageUploadField'));

/**
 * Field Type Categories
 */
export const FIELD_CATEGORIES = {
  basic: {
    name: 'Basic',
    description: 'Standard input fields',
    color: 'blue'
  },
  table: {
    name: 'Tables',
    description: 'Tabular data fields',
    color: 'green'
  },
  specialized: {
    name: 'Specialized',
    description: 'Domain-specific field types',
    color: 'purple'
  },
  diagram: {
    name: 'Diagrams',
    description: 'Visual builders and diagrams',
    color: 'orange'
  },
  utility: {
    name: 'Utility',
    description: 'Layout and structural elements',
    color: 'gray'
  }
};

/**
 * Field Type Registry
 *
 * Each entry contains:
 * - component: The React component to render (lazy loaded)
 * - category: Category for grouping in the field type selector
 * - icon: Lucide icon component for UI
 * - label: Display name in the field type selector
 * - description: Brief description of the field type
 * - hasPlaceholder: Whether the field supports placeholder text
 * - hasOptions: Whether the field requires options configuration
 * - hasColumns: Whether the field requires column configuration
 * - isFormField: Whether this field stores data (false for section-header)
 * - fullWidth: Whether the field should span full width
 * - defaultConfig: Default configuration for new fields of this type
 */
export const FIELD_TYPE_REGISTRY = {
  // ========================================
  // BASIC TYPES
  // ========================================
  text: {
    component: null, // Rendered inline (simple <input>)
    category: 'basic',
    icon: Type,
    label: 'Text Input',
    description: 'Single line text input',
    hasPlaceholder: true,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: false,
    defaultConfig: {}
  },

  textarea: {
    component: TipTapEditor,
    category: 'basic',
    icon: AlignLeft,
    label: 'Rich Text',
    description: 'Multi-line rich text editor with formatting',
    hasPlaceholder: true,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: { rows: 3 }
  },

  select: {
    component: null, // Rendered inline (simple <select>)
    category: 'basic',
    icon: ChevronDown,
    label: 'Dropdown',
    description: 'Single selection dropdown',
    hasPlaceholder: false,
    hasOptions: true,
    hasColumns: false,
    isFormField: true,
    fullWidth: false,
    defaultConfig: { options: [] }
  },

  checkbox: {
    component: CheckboxGroup,
    category: 'basic',
    icon: CheckSquare,
    label: 'Checkbox Group',
    description: 'Multiple selection checkboxes',
    hasPlaceholder: false,
    hasOptions: true,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: { options: [] }
  },

  // ========================================
  // TABLE TYPES
  // ========================================
  table: {
    component: EditableTable,
    category: 'table',
    icon: Table,
    label: 'Table',
    description: 'Editable table with dynamic rows',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: true,
    isFormField: true,
    fullWidth: true,
    defaultConfig: { columns: ['Column 1', 'Column 2', 'Column 3'] }
  },

  introTable: {
    component: IntroTableField,
    category: 'table',
    icon: FileText,
    label: 'Text + Table',
    description: 'Introduction text followed by a table',
    hasPlaceholder: true,
    hasOptions: false,
    hasColumns: true,
    isFormField: true,
    fullWidth: true,
    defaultConfig: {
      introPlaceholder: 'Enter introduction text...',
      tableColumns: ['Column 1', 'Column 2']
    }
  },

  standardsTable: {
    component: StandardsTable,
    category: 'table',
    icon: BookOpen,
    label: 'Standards Table',
    description: 'Pre-configured table for standards references',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: {}
  },

  'milestones-table': {
    component: MilestonesTableField,
    category: 'table',
    icon: Calendar,
    label: 'Milestones Table',
    description: 'Project milestones with stages and dates',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: {}
  },

  // ========================================
  // SPECIALIZED TYPES
  // ========================================
  timeline: {
    component: TimelineInput,
    category: 'specialized',
    icon: Calendar,
    label: 'Timeline',
    description: 'Date range picker with visual timeline',
    hasPlaceholder: true,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: false,
    defaultConfig: {}
  },

  budget: {
    component: BudgetInput,
    category: 'specialized',
    icon: DollarSign,
    label: 'Budget',
    description: 'Currency input with formatting',
    hasPlaceholder: true,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: false,
    defaultConfig: {}
  },

  'naming-conventions': {
    component: NamingConventionBuilder,
    category: 'specialized',
    icon: FileSignature,
    label: 'Naming Conventions',
    description: 'File naming pattern builder',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: {}
  },

  'federation-strategy': {
    component: FederationStrategyBuilder,
    category: 'specialized',
    icon: GitMerge,
    label: 'Federation Strategy',
    description: 'Clash matrix and federation configuration',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: {}
  },

  'tidp-reference': {
    component: TidpReferenceField,
    category: 'specialized',
    icon: Link,
    label: 'TIDP Reference',
    description: 'Link to TIDP/MIDP manager',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: false,
    fullWidth: true,
    defaultConfig: {}
  },

  'tidp-section': {
    component: TidpSectionField,
    category: 'specialized',
    icon: FileText,
    label: 'TIDP Section',
    description: 'Text area with TIDP manager link',
    hasPlaceholder: true,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: {}
  },

  'deliverables-matrix': {
    component: DeliverablesMatrixField,
    category: 'specialized',
    icon: Grid3X3,
    label: 'Deliverables Matrix',
    description: 'Information deliverables responsibility matrix',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: { matrixType: 'deliverables' }
  },

  'im-activities-matrix': {
    component: ImActivitiesMatrixField,
    category: 'specialized',
    icon: Grid3X3,
    label: 'IM Activities Matrix',
    description: 'RACI matrix for ISO 19650-2 Annex A activities',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: { matrixType: 'im-activities' }
  },

  // ========================================
  // DIAGRAM TYPES
  // ========================================
  orgchart: {
    component: OrgStructureField,
    category: 'diagram',
    icon: Users,
    label: 'Org Chart',
    description: 'Interactive organizational structure chart',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: {}
  },

  'orgstructure-data-table': {
    component: OrgStructureDataTable,
    category: 'diagram',
    icon: Table,
    label: 'Org Data Table',
    description: 'Read-only table derived from org chart',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: false,
    fullWidth: true,
    defaultConfig: { readOnly: true }
  },

  fileStructure: {
    component: FolderStructureDiagram,
    category: 'diagram',
    icon: Folder,
    label: 'Folder Structure',
    description: 'Interactive folder hierarchy builder',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: {}
  },

  cdeDiagram: {
    component: CDEPlatformEcosystem,
    category: 'diagram',
    icon: Network,
    label: 'CDE Diagram',
    description: 'Multi-platform CDE ecosystem diagram',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: {}
  },

  mindmap: {
    component: VolumeStrategyMindmap,
    category: 'diagram',
    icon: Share2,
    label: 'Mindmap',
    description: 'Hierarchical mindmap visualization',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: {}
  },

  // ========================================
  // UTILITY TYPES
  // ========================================
  'section-header': {
    component: null, // Rendered inline (simple header element)
    category: 'utility',
    icon: Heading,
    label: 'Section Header',
    description: 'Non-input section divider',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: false,
    fullWidth: true,
    defaultConfig: {}
  },

  'static-diagram': {
    component: null, // Rendered inline by InputField using diagramKey
    category: 'utility',
    icon: GitBranch,
    label: 'Static Diagram',
    description: 'Read-only diagram (document hierarchy or party interfaces)',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: false,
    fullWidth: true,
    defaultConfig: { diagramKey: 'documentHierarchy' }
  },

  'info-banner': {
    component: null, // Rendered inline (styled callout)
    category: 'utility',
    icon: Info,
    label: 'Info Banner',
    description: 'Styled information callout (no user input)',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: false,
    fullWidth: true,
    defaultConfig: {}
  },

  // ========================================
  // IMAGE UPLOAD (for Section 2 project map, etc.)
  // ========================================
  'image-upload': {
    component: ImageUploadField,
    category: 'specialized',
    icon: Image,
    label: 'Image Upload',
    description: 'Upload image with preview and compression (PNG/JPG/SVG)',
    hasPlaceholder: false,
    hasOptions: false,
    hasColumns: false,
    isFormField: true,
    fullWidth: true,
    defaultConfig: {}
  }
};

/**
 * Get field type definition
 * @param {string} type - Field type key
 * @returns {Object|null} Field type definition or null if not found
 */
export function getFieldType(type) {
  return FIELD_TYPE_REGISTRY[type] || null;
}

/**
 * Get all field types grouped by category
 * @returns {Object} Field types grouped by category
 */
export function getFieldTypesByCategory() {
  const grouped = {};

  Object.entries(FIELD_TYPE_REGISTRY).forEach(([type, definition]) => {
    const category = definition.category;
    if (!grouped[category]) {
      grouped[category] = {
        ...FIELD_CATEGORIES[category],
        types: []
      };
    }
    grouped[category].types.push({
      type,
      ...definition
    });
  });

  return grouped;
}

/**
 * Get all field types as a flat array
 * @returns {Array} Array of field type definitions with type key
 */
export function getAllFieldTypes() {
  return Object.entries(FIELD_TYPE_REGISTRY).map(([type, definition]) => ({
    type,
    ...definition
  }));
}

/**
 * Check if a field type is valid
 * @param {string} type - Field type key
 * @returns {boolean} True if valid
 */
export function isValidFieldType(type) {
  return type in FIELD_TYPE_REGISTRY;
}

/**
 * Get full-width field types
 * @returns {Array} Array of field type keys that should span full width
 */
export function getFullWidthFieldTypes() {
  return Object.entries(FIELD_TYPE_REGISTRY)
    .filter(([, def]) => def.fullWidth)
    .map(([type]) => type);
}

/**
 * Get form field types (excludes utility types like section-header)
 * @returns {Array} Array of field type keys that store data
 */
export function getFormFieldTypes() {
  return Object.entries(FIELD_TYPE_REGISTRY)
    .filter(([, def]) => def.isFormField)
    .map(([type]) => type);
}

export default FIELD_TYPE_REGISTRY;
