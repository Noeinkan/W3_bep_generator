const { v4: uuidv4 } = require('uuid');
const db = require('../database');

const SAMPLE_LOIN_ROWS = [
  { discipline: 'Architecture', stage: 'Concept Design',   element: 'External Walls',      geometry: '2D outline in plan and elevation', alphanumeric: 'Construction type, approximate U-value, fire rating', documentation: 'Outline specification' },
  { discipline: 'Architecture', stage: 'Technical Design', element: 'External Walls',      geometry: '3D solid model LOD 300; all openings, cills, lintels', alphanumeric: 'Material, U-value, fire rating, acoustic rating, finish, manufacturer', documentation: 'Product data sheets, full specifications' },
  { discipline: 'Architecture', stage: 'Handover',         element: 'External Walls',      geometry: 'As-built 3D model LOD 400', alphanumeric: 'Manufacturer, product reference, warranty period, maintenance intervals', documentation: 'As-built drawings, O&M manual, warranties' },
  { discipline: 'Structure',    stage: 'Concept Design',   element: 'Foundations',         geometry: '2D footprint with indicative depth', alphanumeric: 'Foundation type, indicative load assumptions, soil bearing capacity', documentation: 'Structural concept report' },
  { discipline: 'Structure',    stage: 'Technical Design', element: 'Columns & Beams',     geometry: '3D solid model LOD 300; exact section sizes and positions', alphanumeric: 'Steel grade, section reference, design load capacity, connection type', documentation: 'Structural calculations, connection details' },
  { discipline: 'MEP',          stage: 'Developed Design', element: 'HVAC Ductwork',       geometry: '3D duct routing — major plant and primary distribution only', alphanumeric: 'Supply/extract air flow rates, duct sizes, pressure drop', documentation: 'Equipment schedules, ventilation design report' },
  { discipline: 'MEP',          stage: 'Technical Design', element: 'Electrical — Lighting', geometry: '3D positions of luminaires and distribution boards', alphanumeric: 'Wattage, IP rating, circuit reference, design lux levels', documentation: 'Electrical circuit drawings, luminaire schedule' },
  { discipline: 'Civil',        stage: 'Concept Design',   element: 'Site Drainage',       geometry: '2D drainage network layout, pipe routes and invert levels', alphanumeric: 'Pipe material, approximate sizes, gradients', documentation: 'Drainage strategy report' },
  { discipline: 'Civil',        stage: 'Technical Design', element: 'Site Roads & Paths',  geometry: '3D alignment and finished levels, kerb details', alphanumeric: 'Surfacing specification, construction depth, sub-base type', documentation: 'Highways specification, drainage drawings' },
  { discipline: 'Fire Protection', stage: 'Technical Design', element: 'Sprinkler System', geometry: '3D head positions and main pipework LOD 300', alphanumeric: 'Coverage area per head, activation temperature, pipe sizes, design pressure', documentation: 'Hydraulic calculations, BS EN 12845 compliance statement' },
];

/**
 * Ensure "Sample Project" exists for a user with pre-seeded LOIN rows.
 * Safe to call multiple times — no-ops if project already exists.
 */
const seedSampleProject = (userId) => {
  try {
    const existing = db.prepare("SELECT id FROM projects WHERE user_id = ? AND name = 'Sample Project' LIMIT 1").get(userId);
    if (!existing) {
      const id = uuidv4();
      const now = new Date().toISOString();
      db.prepare(
        'INSERT INTO projects (id, name, user_id, acc_hub_id, acc_project_id, acc_default_folder, created_at, updated_at) VALUES (?, ?, ?, NULL, NULL, NULL, ?, ?)'
      ).run(id, 'Sample Project', userId, now, now);
      console.log(`Seeded Sample Project for user ${userId}`);

      const insertLoin = db.prepare(`
        INSERT INTO loin_rows (id, project_id, discipline, stage, element, geometry, alphanumeric, documentation, notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)
      `);
      for (const row of SAMPLE_LOIN_ROWS) {
        insertLoin.run(uuidv4(), id, row.discipline, row.stage, row.element, row.geometry, row.alphanumeric, row.documentation, now, now);
      }
      console.log(`Seeded ${SAMPLE_LOIN_ROWS.length} LOIN rows for Sample Project`);
    }
  } catch (err) {
    console.error('Failed to seed Sample Project:', err && err.message);
  }
};

class ProjectService {
  getAllProjects(userId) {
    const uid = userId != null ? String(userId) : '';
    const stmt = db.prepare(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC'
    );
    return stmt.all(uid);
  }

  getProject(id) {
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    return stmt.get(id);
  }

  createProject(userId, name, options = {}) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const uid = userId != null ? String(userId) : '';
    const { accHubId = null, accProjectId = null, accDefaultFolder = null } = options;

    const stmt = db.prepare(
      'INSERT INTO projects (id, name, user_id, acc_hub_id, acc_project_id, acc_default_folder, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(id, name, uid, accHubId, accProjectId, accDefaultFolder, now, now);

    return this.getProject(id);
  }

  updateProject(id, updates = {}) {
    const normalizedUpdates = typeof updates === 'string' ? { name: updates } : updates;
    const fields = [];
    const values = [];

    if (Object.prototype.hasOwnProperty.call(normalizedUpdates, 'name')) {
      fields.push('name = ?');
      values.push(normalizedUpdates.name);
    }

    if (Object.prototype.hasOwnProperty.call(normalizedUpdates, 'accHubId')) {
      fields.push('acc_hub_id = ?');
      values.push(normalizedUpdates.accHubId || null);
    }

    if (Object.prototype.hasOwnProperty.call(normalizedUpdates, 'accProjectId')) {
      fields.push('acc_project_id = ?');
      values.push(normalizedUpdates.accProjectId || null);
    }

    if (Object.prototype.hasOwnProperty.call(normalizedUpdates, 'accDefaultFolder')) {
      fields.push('acc_default_folder = ?');
      values.push(normalizedUpdates.accDefaultFolder || null);
    }

    if (fields.length === 0) {
      return this.getProject(id);
    }

    const now = new Date().toISOString();
    fields.push('updated_at = ?');
    values.push(now, id);

    const stmt = db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getProject(id);
  }

  deleteProject(id) {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    return stmt.run(id);
  }
}

const projectService = new ProjectService();
projectService.seedSampleProject = seedSampleProject;
module.exports = projectService;
