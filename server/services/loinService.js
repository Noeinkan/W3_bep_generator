/**
 * LOIN service: CRUD for Level of Information Need rows per project.
 * Each row defines (discipline, stage, element) + geometry/alphanumeric/documentation requirements.
 */

const db = require('../database');
const { v4: uuidv4 } = require('uuid');

function getById(id) {
  return db.prepare('SELECT * FROM loin_rows WHERE id = ?').get(id);
}

/** Get all rows for a project, ordered by discipline + stage + element. */
function getRowsByProject(projectId) {
  return db.prepare(
    'SELECT * FROM loin_rows WHERE project_id = ? ORDER BY discipline ASC, stage ASC, element ASC'
  ).all(projectId);
}

/** Create a new LOIN row. */
function createRow({ projectId, discipline, stage, element, geometry, alphanumeric, documentation, notes }) {
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO loin_rows (id, project_id, discipline, stage, element, geometry, alphanumeric, documentation, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, projectId, discipline, stage, element, geometry ?? null, alphanumeric ?? null, documentation ?? null, notes ?? null, now, now);
  return getById(id);
}

/** Update an existing LOIN row by id. */
function updateRow(id, { discipline, stage, element, geometry, alphanumeric, documentation, notes }) {
  const row = getById(id);
  if (!row) return null;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE loin_rows
    SET discipline = ?, stage = ?, element = ?, geometry = ?, alphanumeric = ?, documentation = ?, notes = ?, updated_at = ?
    WHERE id = ?
  `).run(
    discipline !== undefined ? discipline : row.discipline,
    stage !== undefined ? stage : row.stage,
    element !== undefined ? element : row.element,
    geometry !== undefined ? geometry : row.geometry,
    alphanumeric !== undefined ? alphanumeric : row.alphanumeric,
    documentation !== undefined ? documentation : row.documentation,
    notes !== undefined ? notes : row.notes,
    now,
    id
  );
  return getById(id);
}

/** Delete a LOIN row by id. Returns the SQLite run result. */
function deleteRow(id) {
  return db.prepare('DELETE FROM loin_rows WHERE id = ?').run(id);
}

module.exports = { getRowsByProject, createRow, updateRow, deleteRow };
