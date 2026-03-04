/**
 * IFC STEP text parser — no external IFC libraries.
 * Parses HEADER (FILE_NAME, FILE_DESCRIPTION, FILE_SCHEMA, IFCPROJECT) and
 * scans DATA section for entity types to detect disciplines and suggest deliverables.
 */

const fs = require('fs');

const DISCIPLINE_ENTITIES = {
  structural: [
    'IFCWALL', 'IFCBEAM', 'IFCCOLUMN', 'IFCSLAB', 'IFCFOOTING', 'IFCMEMBER'
  ],
  architectural: [
    'IFCDOOR', 'IFCWINDOW', 'IFCROOF', 'IFCSTAIR', 'IFCSPACE', 'IFCFURNISHING'
  ],
  mep: [
    'IFCDUCT', 'IFCPIPE', 'IFCFLOW', 'IFCPUMP', 'IFCCOMPRESSOR', 'IFCCHILLER'
  ],
  civil: [
    'IFCROAD', 'IFCBRIDGE', 'IFCRAIL', 'IFCEARTHWORKSFILL'
  ]
};

const ENTITY_TO_DISCIPLINE = {};
Object.entries(DISCIPLINE_ENTITIES).forEach(([disc, entities]) => {
  entities.forEach((e) => { ENTITY_TO_DISCIPLINE[e] = disc; });
});

/**
 * Extract HEADER section (from HEADER; to ENDSEC; or start of DATA;).
 */
function getHeaderSection(content) {
  const headerEnd = content.indexOf('ENDSEC;');
  const dataStart = content.indexOf('DATA;');
  const end = headerEnd !== -1 ? headerEnd : (dataStart !== -1 ? dataStart : content.length);
  const headerStart = content.indexOf('HEADER;');
  if (headerStart === -1) return '';
  return content.slice(headerStart, end + (headerEnd !== -1 ? 7 : 0));
}

/**
 * Parse FILE_NAME line: get filename, timestamp, author list, organization list.
 */
function parseFileName(header) {
  const match = header.match(/FILE_NAME\s*\(\s*'([^']*)',\s*'([^']*)',\s*\(([^)]*)\),\s*\(([^)]*)\)/);
  if (!match) return { filename: '', fileDate: '', author: '', organization: '' };
  const filename = (match[1] || '').trim();
  const fileDate = (match[2] || '').trim();
  const authorList = (match[3] || '').split(',').map((a) => a.replace(/^'|'$/g, '').trim()).filter(Boolean);
  const orgList = (match[4] || '').split(',').map((o) => o.replace(/^'|'$/g, '').trim()).filter(Boolean);
  return {
    filename,
    fileDate,
    author: authorList.join(', ') || '',
    organization: orgList.join(', ') || ''
  };
}

/**
 * Parse FILE_DESCRIPTION line.
 */
function parseFileDescription(header) {
  const match = header.match(/FILE_DESCRIPTION\s*\(\s*\(\s*'([^']*)'\s*\)/);
  return match ? (match[1] || '').trim() : '';
}

/**
 * Parse FILE_SCHEMA to get IFC version (e.g. IFC4, IFC4X3).
 */
function parseFileSchema(header) {
  const match = header.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']*)'\s*\)/);
  return match ? (match[1] || '').trim() : '';
}

/**
 * Find IFCPROJECT in DATA section and extract project Name (3rd string attribute).
 */
function parseProjectName(content) {
  const dataStart = content.indexOf('DATA;');
  if (dataStart === -1) return '';
  const dataSection = content.slice(dataStart);
  const projectMatch = dataSection.match(/#\d+\s*=\s*IFCPROJECT\s*\(/);
  if (!projectMatch) return '';
  const start = projectMatch.index + projectMatch[0].length;
  let depth = 1;
  let i = start;
  const quoted = [];
  let current = '';
  let inQuote = false;
  while (i < dataSection.length && depth > 0) {
    const c = dataSection[i];
    if (c === "'" && (i === 0 || dataSection[i - 1] !== '\\')) {
      if (!inQuote) {
        inQuote = true;
        current = '';
      } else {
        quoted.push(current);
        inQuote = false;
      }
      i++;
      continue;
    }
    if (inQuote) {
      current += c;
      i++;
      continue;
    }
    if (c === '(') depth++;
    else if (c === ')') depth--;
    i++;
  }
  // IFCPROJECT: GlobalId, OwnerHistory (#), Name, Description, ...
  // So 3rd quoted string is typically Name (index 2).
  return quoted.length >= 3 ? (quoted[2] || '').trim() : (quoted[0] || '').trim();
}

/**
 * Scan DATA section for entity type occurrences and return list of disciplines found.
 */
function detectDisciplines(content) {
  const dataStart = content.indexOf('DATA;');
  if (dataStart === -1) return [];
  const dataSection = content.slice(dataStart);
  const found = new Set();
  Object.entries(ENTITY_TO_DISCIPLINE).forEach(([entity]) => {
    const re = new RegExp(`#\\d+\\s*=\\s*${entity}\\s*\\(`, 'gi');
    if (re.test(dataSection)) found.add(ENTITY_TO_DISCIPLINE[entity]);
  });
  return Array.from(found);
}

/**
 * Build suggested deliverables from project name, schema, and disciplines.
 */
function buildSuggestedDeliverables(projectName, ifcSchema, disciplinesFound, description) {
  const base = projectName || 'Unnamed Project';
  const suggested = [];
  const combinedName = `Combined IFC Model — ${base}`;
  suggested.push({
    deliverableName: combinedName,
    format: 'IFC',
    loinLod: 'LOD 300',
    status: 'Planned',
    description: description ? `${description.slice(0, 200)}${description.length > 200 ? '…' : ''}` : ''
  });
  const disciplineLabels = {
    structural: 'Structural',
    architectural: 'Architectural',
    mep: 'MEP',
    civil: 'Civil'
  };
  disciplinesFound.forEach((d) => {
    const label = disciplineLabels[d] || d;
    suggested.push({
      deliverableName: `${label} Model — ${base}`,
      format: 'IFC',
      loinLod: 'LOD 300',
      status: 'Planned',
      description: ''
    });
  });
  return suggested;
}

/**
 * Parse an IFC STEP file from disk. Returns model info + suggested deliverables.
 * @param {string} filePath - Absolute path to .ifc file
 * @returns {Promise<object>} { projectName, author, organization, ifcSchema, fileDate, description, disciplinesFound, suggestedDeliverables }
 */
function parseIfc(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const header = getHeaderSection(content);
      const fileInfo = parseFileName(header);
      const description = parseFileDescription(header);
      const ifcSchema = parseFileSchema(header);
      const projectName = parseProjectName(content) || fileInfo.filename.replace(/\.ifc$/i, '') || 'Unnamed Project';
      const disciplinesFound = detectDisciplines(content);
      const suggestedDeliverables = buildSuggestedDeliverables(
        projectName,
        ifcSchema,
        disciplinesFound,
        description
      );
      resolve({
        projectName,
        author: fileInfo.author,
        organization: fileInfo.organization,
        ifcSchema: ifcSchema || 'Unknown',
        fileDate: fileInfo.fileDate,
        description,
        disciplinesFound,
        suggestedDeliverables
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  parseIfc,
  getHeaderSection,
  parseFileName,
  parseFileDescription,
  parseFileSchema,
  parseProjectName,
  detectDisciplines,
  buildSuggestedDeliverables
};
