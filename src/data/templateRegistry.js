import EMPTY_BEP_DATA from './emptyBepData';
import COMMERCIAL_OFFICE_TEMPLATE from './templates/commercialOfficeTemplate';

const deepClone = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

/**
 * Default ISO19650 CDE Folder Structure Diagram
 * Used as fallback when templates don't specify a custom fileStructureDiagram
 * Format: 4-space indentation per level, parsed by FolderStructureDiagram component
 */
const DEFAULT_FILE_STRUCTURE_DIAGRAM = `WIP (Work in Progress)
    Architecture
        Models
        Drawings
        Specifications
        Reports
    Structure
        Models
        Drawings
        Calculations
    MEP
        Mechanical
        Electrical
        Plumbing
        Fire Protection
    Surveys
    Clash Detection
SHARED (Coordination)
    Architecture
        Models
        Drawings
        Specifications
    Structure
        Models
        Drawings
        Calculations
    MEP
        Mechanical
        Electrical
        Plumbing
    Federated Models
    Coordination Reports
PUBLISHED (Approved)
    Documentation
        Contract Documents
        Construction Drawings
        Technical Specifications
        BOQ (Bill of Quantities)
    Models
        As Designed
        Construction Issue
    Compliance
        Building Regulations
        Health & Safety
        Sustainability
    Handover
        As-Built Drawings
        O&M Manuals
        Asset Data
ARCHIVE
    Superseded
    Reference Material
`;

/**
 * Template Registry
 * Defines all available BEP templates with metadata
 */
export const TEMPLATE_REGISTRY = [
  {
    id: 'commercial-office-pre',
    name: 'Commercial Office Complex',
    category: 'Commercial',
    description: 'Modern office building with sustainable design, flexible workspaces, and smart building technologies',
    bepType: 'pre-appointment',
    thumbnail: null,
    tags: ['commercial', 'office', 'sustainable', 'smart building'],
    data: COMMERCIAL_OFFICE_TEMPLATE
  },
  {
    id: 'commercial-office-post',
    name: 'Commercial Office Complex',
    category: 'Commercial',
    description: 'Modern office building with sustainable design, flexible workspaces, and smart building technologies',
    bepType: 'post-appointment',
    thumbnail: null,
    tags: ['commercial', 'office', 'sustainable', 'smart building'],
    data: COMMERCIAL_OFFICE_TEMPLATE
  },
  // Future templates can be added here:
  // {
  //   id: 'residential-complex',
  //   name: 'Residential Complex',
  //   category: 'Residential',
  //   description: 'Multi-unit residential building with shared amenities',
  //   bepTypes: ['pre', 'post'],
  //   tags: ['residential', 'housing', 'apartments'],
  //   data: RESIDENTIAL_TEMPLATE
  // },
  // {
  //   id: 'hospital',
  //   name: 'Healthcare Facility',
  //   category: 'Healthcare',
  //   description: 'Hospital or medical center with specialized requirements',
  //   bepTypes: ['pre', 'post'],
  //   tags: ['healthcare', 'hospital', 'medical'],
  //   data: HOSPITAL_TEMPLATE
  // }
];

/**
 * Get empty BEP data structure
 * @returns {Object} Empty BEP data object
 */
export const getEmptyBepData = () => {
  return deepClone(EMPTY_BEP_DATA);
};

/**
 * Get template by ID
 * @param {string} templateId - Template identifier
 * @returns {Object|null} Template data merged with empty base, or null if not found
 */
export const getTemplateById = (templateId) => {
  const template = TEMPLATE_REGISTRY.find(t => t.id === templateId);
  if (!template) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Template not found: ${templateId}`);
    }
    return null;
  }

  // Merge template data with empty base to ensure all fields exist
  const mergedData = deepClone({
    ...EMPTY_BEP_DATA,
    ...template.data
  });

  // Fall back to default ISO19650 folder structure if not specified
  if (!mergedData.fileStructureDiagram || mergedData.fileStructureDiagram.trim() === '') {
    mergedData.fileStructureDiagram = DEFAULT_FILE_STRUCTURE_DIAGRAM;
  }

  return mergedData;
};

/**
 * Get all templates, optionally filtered by category or BEP type
 * @param {Object} filters - Optional filters
 * @param {string} filters.category - Filter by category
 * @param {string} filters.bepType - Filter by BEP type ('pre-appointment' or 'post-appointment')
 * @returns {Array} Array of template metadata (without full data)
 */
export const getAvailableTemplates = (filters = {}) => {
  let templates = TEMPLATE_REGISTRY;

  if (filters.category) {
    templates = templates.filter(t => t.category === filters.category);
  }

  if (filters.bepType) {
    templates = templates.filter(t => t.bepType === filters.bepType);
  }

  // Return metadata only (without full data payload)
  return templates.map(({ id, name, category, description, bepType, thumbnail, tags }) => ({
    id,
    name,
    category,
    description,
    bepType,
    thumbnail,
    tags
  }));
};

/**
 * Get template categories
 * @returns {Array} Array of unique categories
 */
export const getTemplateCategories = () => {
  const categories = new Set(TEMPLATE_REGISTRY.map(t => t.category));
  return Array.from(categories).sort();
};
