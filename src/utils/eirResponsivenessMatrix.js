/**
 * EIR Responsiveness Matrix builder.
 *
 * Maps extracted EIR analysis clauses to BEP sections and determines
 * whether each clause has been addressed in the BEP form data.
 */

/**
 * Static mapping: every EIR analysis category → BEP section + form fields.
 *
 * `type` describes how to extract clause strings from the raw value:
 *   'scalar'       – plain string / boolean / number
 *   'string-array' – array of strings
 *   'object'       – flat object whose key-value pairs become clauses
 *   'object-array' – array of objects; first string property is used as label
 */
const EIR_SECTION_DEFINITIONS = [
  {
    eirCategory: 'Project Information',
    eirPath: 'project_info',
    type: 'object',
    bepSection: { number: 1, title: 'BEP Type & Project Info' },
    bepFields: ['projectName', 'appointingParty', 'projectType', 'projectDescription'],
  },
  {
    eirCategory: 'BIM Objectives',
    eirPath: 'bim_objectives',
    type: 'string-array',
    bepSection: { number: 4, title: 'BIM Goals & Uses' },
    bepFields: ['bimGoals', 'bimObjectives', 'bimUses', 'primaryObjectives', 'projectObjectives'],
  },
  {
    eirCategory: 'Information Requirements — OIR',
    eirPath: 'information_requirements.OIR',
    type: 'string-array',
    bepSection: { number: 5, title: 'Level of Information Need' },
    bepFields: ['informationPurposes'],
  },
  {
    eirCategory: 'Information Requirements — PIR',
    eirPath: 'information_requirements.PIR',
    type: 'string-array',
    bepSection: { number: 5, title: 'Level of Information Need' },
    bepFields: ['projectInformationRequirements', 'informationPurposes'],
  },
  {
    eirCategory: 'Information Requirements — AIR',
    eirPath: 'information_requirements.AIR',
    type: 'string-array',
    bepSection: { number: 5, title: 'Level of Information Need' },
    bepFields: ['assetInformationRequirements'],
  },
  {
    eirCategory: 'Information Requirements — EIR Specifics',
    eirPath: 'information_requirements.EIR_specifics',
    type: 'string-array',
    bepSection: { number: 5, title: 'Level of Information Need' },
    bepFields: ['informationPurposes', 'projectInformationRequirements'],
  },
  {
    eirCategory: 'Delivery Milestones',
    eirPath: 'delivery_milestones',
    type: 'object-array',
    bepSection: { number: 6, title: 'Information Delivery Planning' },
    bepFields: ['keyMilestones'],
  },
  {
    eirCategory: 'LOD / LOI Requirements',
    eirPath: 'standards_protocols.lod_loi_requirements',
    type: 'scalar',
    bepSection: { number: 5, title: 'Level of Information Need' },
    bepFields: ['lodRequirements', 'loiRequirements', 'levelOfInformation', 'informationLevels'],
  },
  {
    eirCategory: 'Classification Systems',
    eirPath: 'standards_protocols.classification_systems',
    type: 'string-array',
    bepSection: { number: 9, title: 'Information Production' },
    bepFields: ['classificationSystems'],
  },
  {
    eirCategory: 'Naming Conventions',
    eirPath: 'standards_protocols.naming_conventions',
    type: 'scalar',
    bepSection: { number: 9, title: 'Information Production' },
    bepFields: ['namingConventions'],
  },
  {
    eirCategory: 'File Formats',
    eirPath: 'standards_protocols.file_formats',
    type: 'string-array',
    bepSection: { number: 9, title: 'Information Production' },
    bepFields: ['fileFormats', 'informationFormats'],
  },
  {
    eirCategory: 'CDE Requirements',
    eirPath: 'cde_requirements',
    type: 'object',
    bepSection: { number: 7, title: 'Common Data Environment' },
    bepFields: ['cdeStrategy', 'cdePlatforms', 'workflowStates'],
  },
  {
    eirCategory: 'Software Requirements',
    eirPath: 'software_requirements',
    type: 'string-array',
    bepSection: { number: 8, title: 'Technology Requirements' },
    bepFields: ['bimSoftware', 'softwarePlatforms'],
  },
  {
    eirCategory: 'Quality Requirements',
    eirPath: 'quality_requirements',
    type: 'object',
    bepSection: { number: 10, title: 'Quality Assurance' },
    bepFields: ['modelValidation', 'qualityAssurance'],
  },
  {
    eirCategory: 'Handover & COBie',
    eirPath: 'handover_requirements',
    type: 'object',
    bepSection: { number: 14, title: 'Appendices' },
    bepFields: ['cobieRequirements', 'handoverRequirements'],
  },
  {
    eirCategory: 'Risks & Specific Requirements',
    eirPath: 'specific_risks',
    type: 'string-array',
    bepSection: { number: 13, title: 'Coordination & Risk' },
    bepFields: ['informationRisks'],
  },
  {
    eirCategory: 'Roles & Responsibilities',
    eirPath: 'roles_responsibilities',
    type: 'object-array',
    bepSection: { number: 3, title: 'Stakeholders & Roles' },
    bepFields: ['teamStructure', 'projectRoles', 'responsibilityMatrix'],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolves a dot-notation path inside an object. */
function resolvePath(obj, path) {
  if (!obj || !path) return null;
  return path.split('.').reduce((acc, key) => {
    if (acc == null) return null;
    return acc[key] ?? null;
  }, obj);
}

/**
 * Converts a raw EIR value into an array of human-readable clause strings.
 */
function extractClauses(value, type) {
  if (value == null) return [];

  if (type === 'scalar') {
    if (typeof value === 'boolean') return [value ? 'Yes' : 'No'];
    const str = String(value).trim();
    return str ? [str] : [];
  }

  if (type === 'string-array') {
    if (!Array.isArray(value)) return [];
    return value
      .filter((v) => typeof v === 'string' && v.trim())
      .map((v) => v.trim());
  }

  if (type === 'object') {
    if (typeof value !== 'object' || Array.isArray(value)) return [];
    return Object.entries(value)
      .filter(([, v]) => v != null && v !== '' && v !== false)
      .map(([k, v]) => {
        const label = k.replace(/_/g, ' ');
        if (Array.isArray(v)) return `${label}: ${v.join(', ')}`;
        if (typeof v === 'boolean') return `${label}: ${v ? 'Yes' : 'No'}`;
        return `${label}: ${v}`;
      });
  }

  if (type === 'object-array') {
    if (!Array.isArray(value)) return [];
    return value
      .map((item) => {
        if (typeof item === 'string') return item;
        // Prefer known label keys; fall back to first string value
        const label =
          item.phase || item.role || item.name ||
          Object.values(item).find((v) => typeof v === 'string' && v.trim());
        const detail =
          item.description || item.responsibilities?.[0] || null;
        if (label && detail) return `${label}: ${detail}`;
        return label || null;
      })
      .filter(Boolean);
  }

  return [];
}

/**
 * Returns true if a formData field value has any meaningful content.
 */
function hasContent(value) {
  if (value == null || value === '') return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    // Named conventions object pattern
    if (value.overview || value.namingFields?.length > 0) return true;
    return Object.values(value).some((v) => {
      if (typeof v === 'string') return v.trim().length > 0;
      if (Array.isArray(v)) return v.length > 0;
      return v != null;
    });
  }
  return false;
}

/**
 * Returns true if the content is present but thin (very short string or
 * single-item array) — used to distinguish "partial" from "addressed".
 */
function isThin(value) {
  if (typeof value === 'string') return value.trim().length < 30;
  if (Array.isArray(value)) return value.length <= 1;
  return false;
}

/**
 * Determines addressed status for a clause given the mapped BEP fields.
 *
 * @returns {'addressed'|'partial'|'not-addressed'}
 */
function determineStatus(formData, bepFields) {
  if (!formData) return 'not-addressed';

  const populated = bepFields
    .map((f) => formData[f])
    .filter((v) => hasContent(v));

  if (populated.length === 0) return 'not-addressed';
  if (populated.some((v) => !isThin(v))) return 'addressed';
  return 'partial';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Builds the EIR Responsiveness Matrix rows from EIR analysis + BEP form data.
 *
 * @param {object|null} analysis  - Parsed EIR analysis JSON from EirContext
 * @param {object}      formData  - BEP form data from RHF / BepFormContext
 * @returns {MatrixRow[]}
 *
 * @typedef {object} MatrixRow
 * @property {string} id
 * @property {string} eirCategory
 * @property {string} requirement     – The clause text
 * @property {string} bepSectionRef   – e.g. "§4 BIM Goals & Uses"
 * @property {number} bepSectionNumber
 * @property {'addressed'|'partial'|'not-addressed'} status
 */
export function buildEirMatrix(analysis, formData) {
  if (!analysis) return [];

  const rows = [];
  let idCounter = 0;

  for (const def of EIR_SECTION_DEFINITIONS) {
    const value = resolvePath(analysis, def.eirPath);
    const clauses = extractClauses(value, def.type);
    if (clauses.length === 0) continue;

    const status = determineStatus(formData, def.bepFields);
    const bepSectionRef = `§${def.bepSection.number} ${def.bepSection.title}`;

    for (const clause of clauses) {
      rows.push({
        id: `row-${idCounter++}`,
        eirCategory: def.eirCategory,
        requirement: clause,
        bepSectionRef,
        bepSectionNumber: def.bepSection.number,
        status,
      });
    }
  }

  // Sort by section number then category name
  rows.sort((a, b) => {
    if (a.bepSectionNumber !== b.bepSectionNumber) {
      return a.bepSectionNumber - b.bepSectionNumber;
    }
    return a.eirCategory.localeCompare(b.eirCategory);
  });

  return rows;
}

/**
 * Summarises a matrix into counts and a completion percentage.
 *
 * @param {MatrixRow[]} rows
 * @returns {{ total: number, addressed: number, partial: number, notAddressed: number, percentAddressed: number }}
 */
export function summariseMatrix(rows) {
  const total = rows.length;
  const addressed = rows.filter((r) => r.status === 'addressed').length;
  const partial = rows.filter((r) => r.status === 'partial').length;
  const notAddressed = rows.filter((r) => r.status === 'not-addressed').length;
  // Partial counts as half-addressed in the percentage
  const percentAddressed =
    total > 0 ? Math.round(((addressed + partial * 0.5) / total) * 100) : 0;
  return { total, addressed, partial, notAddressed, percentAddressed };
}
