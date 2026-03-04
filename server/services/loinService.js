/**
 * LOIN service: CRUD for Level of Information Need rows per project.
 * Each row defines (discipline, stage, element) + geometry/alphanumeric/documentation requirements.
 */

const db = require('../database');
const { v4: uuidv4 } = require('uuid');

function getById(id) {
  return db.prepare('SELECT * FROM loin_rows WHERE id = ?').get(id);
}

/** Get all rows for a project, ordered by discipline + stage + element. Optionally include property count for IDS badge. */
function getRowsByProject(projectId, options = {}) {
  const rows = db.prepare(
    'SELECT * FROM loin_rows WHERE project_id = ? ORDER BY discipline ASC, stage ASC, element ASC'
  ).all(projectId);
  if (options.withPropertyCount) {
    const counts = db.prepare(
      'SELECT loin_row_id, COUNT(*) as c FROM loin_property_requirements GROUP BY loin_row_id'
    ).all();
    const byRow = {};
    counts.forEach(({ loin_row_id, c }) => { byRow[loin_row_id] = c; });
    return rows.map(r => ({ ...r, propertyCount: byRow[r.id] || 0 }));
  }
  return rows;
}

/** Create a new LOIN row. */
function createRow({ projectId, discipline, stage, element, geometry, alphanumeric, documentation, notes, ifc_entity }) {
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO loin_rows (id, project_id, discipline, stage, element, geometry, alphanumeric, documentation, notes, ifc_entity, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, projectId, discipline, stage, element, geometry ?? null, alphanumeric ?? null, documentation ?? null, notes ?? null, ifc_entity ?? null, now, now);
  return getById(id);
}

/** Update an existing LOIN row by id. */
function updateRow(id, { discipline, stage, element, geometry, alphanumeric, documentation, notes, ifc_entity }) {
  const row = getById(id);
  if (!row) return null;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE loin_rows
    SET discipline = ?, stage = ?, element = ?, geometry = ?, alphanumeric = ?, documentation = ?, notes = ?, ifc_entity = ?, updated_at = ?
    WHERE id = ?
  `).run(
    discipline !== undefined ? discipline : row.discipline,
    stage !== undefined ? stage : row.stage,
    element !== undefined ? element : row.element,
    geometry !== undefined ? geometry : row.geometry,
    alphanumeric !== undefined ? alphanumeric : row.alphanumeric,
    documentation !== undefined ? documentation : row.documentation,
    notes !== undefined ? notes : row.notes,
    ifc_entity !== undefined ? ifc_entity : row.ifc_entity,
    now,
    id
  );
  return getById(id);
}

/** Delete a LOIN row by id. Returns the SQLite run result. */
function deleteRow(id) {
  return db.prepare('DELETE FROM loin_rows WHERE id = ?').run(id);
}

// ——— Property requirements (for IDS) ———

function getPropertyRequirements(loinRowId) {
  return db.prepare(
    'SELECT * FROM loin_property_requirements WHERE loin_row_id = ? ORDER BY property_set ASC, property_name ASC'
  ).all(loinRowId);
}

function createPropertyRequirement({ loinRowId, propertySet, propertyName, dataType, valueConstraint }) {
  const row = getById(loinRowId);
  if (!row) return null;
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO loin_property_requirements (id, loin_row_id, property_set, property_name, data_type, value_constraint, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, loinRowId, propertySet, propertyName, dataType ?? 'IFCLABEL', valueConstraint ?? null, now, now);
  return db.prepare('SELECT * FROM loin_property_requirements WHERE id = ?').get(id);
}

function updatePropertyRequirement(id, partial) {
  const row = db.prepare('SELECT * FROM loin_property_requirements WHERE id = ?').get(id);
  if (!row) return null;
  const now = new Date().toISOString();
  const propertySet = partial.propertySet !== undefined ? partial.propertySet : row.property_set;
  const propertyName = partial.propertyName !== undefined ? partial.propertyName : row.property_name;
  const dataType = partial.dataType !== undefined ? partial.dataType : row.data_type;
  const valueConstraint = partial.valueConstraint !== undefined ? partial.valueConstraint : row.value_constraint;
  db.prepare(`
    UPDATE loin_property_requirements SET property_set = ?, property_name = ?, data_type = ?, value_constraint = ?, updated_at = ? WHERE id = ?
  `).run(propertySet, propertyName, dataType, valueConstraint, now, id);
  return db.prepare('SELECT * FROM loin_property_requirements WHERE id = ?').get(id);
}

function deletePropertyRequirement(id) {
  return db.prepare('DELETE FROM loin_property_requirements WHERE id = ?').run(id);
}

/** Get LOIN rows for a project with nested .properties (for IDS generator). */
function getRowsByProjectWithProperties(projectId) {
  const rows = db.prepare(
    'SELECT * FROM loin_rows WHERE project_id = ? ORDER BY discipline ASC, stage ASC, element ASC'
  ).all(projectId);
  const requirements = db.prepare(
    'SELECT * FROM loin_property_requirements ORDER BY loin_row_id, property_set, property_name'
  ).all();
  const byRow = {};
  requirements.forEach(r => {
    if (!byRow[r.loin_row_id]) byRow[r.loin_row_id] = [];
    byRow[r.loin_row_id].push({
      id: r.id,
      property_set: r.property_set,
      property_name: r.property_name,
      data_type: r.data_type,
      value_constraint: r.value_constraint,
    });
  });
  return rows.map(row => ({
    ...row,
    properties: byRow[row.id] || [],
  }));
}

module.exports = {
  getById,
  getRowsByProject,
  getRowsByProjectWithProperties,
  createRow,
  updateRow,
  deleteRow,
  getPropertyRequirements,
  createPropertyRequirement,
  updatePropertyRequirement,
  deletePropertyRequirement,
};
