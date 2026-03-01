/**
 * Snippet service: CRUD for stable text snippets and resolution of {{snippet:key}} in strings.
 * Snippets are classified and can be project-scoped (project_id) or global (project_id IS NULL).
 */

const db = require('../database');
const { v4: uuidv4 } = require('uuid');

const SNIPPET_PATTERN = /\{\{snippet:([a-zA-Z0-9_]+)\}\}/g;

/**
 * Resolve {{snippet:key}} placeholders in a string.
 * @param {string} text - String that may contain {{snippet:key}}
 * @param {Object.<string, string>} map - key -> value (e.g. from getMap())
 * @returns {string} Text with placeholders replaced; unknown keys left as {{snippet:key}}
 */
function resolveInText(text, map) {
  if (typeof text !== 'string') return text;
  return text.replace(SNIPPET_PATTERN, (_, key) => (map[key] != null ? String(map[key]) : `{{snippet:${key}}}`));
}

/**
 * Get all snippets as a key -> value map (for resolution).
 * @param {string|null} projectId - Optional; unused in v1 (global snippets only)
 * @returns {Object.<string, string>}
 */
function getMap(projectId = null) {
  const rows = db.prepare('SELECT key, value FROM snippets').all();
  const map = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

/**
 * List snippets, optionally filtered by classification or project.
 * @param {Object} opts - { classification?: string }
 * @returns {Array<{id, key, value, classification, project_id, created_at, updated_at}>}
 */
function list(opts = {}) {
  let query = 'SELECT * FROM snippets WHERE 1=1';
  const params = [];
  if (opts.classification != null && opts.classification !== '') {
    query += ' AND classification = ?';
    params.push(opts.classification);
  }
  query += ' ORDER BY classification ASC, key ASC';
  return db.prepare(query).all(...params);
}

/** Get one snippet by key. */
function getByKey(key) {
  return db.prepare('SELECT * FROM snippets WHERE key = ?').get(key);
}

function getById(id) {
  return db.prepare('SELECT * FROM snippets WHERE id = ?').get(id);
}

/**
 * Create or update snippet by key. If key exists, update; else create.
 * @param {Object} data - { key, value, classification? }
 * @returns {Object} Created or updated snippet
 */
function upsert(data) {
  const now = new Date().toISOString();
  const existing = db.prepare('SELECT id FROM snippets WHERE key = ?').get(data.key);
  if (existing) {
    db.prepare(`
      UPDATE snippets SET value = ?, classification = ?, updated_at = ?
      WHERE id = ?
    `).run(data.value, data.classification ?? null, now, existing.id);
    return getById(existing.id);
  }
  const id = uuidv4();
  db.prepare(`
    INSERT INTO snippets (id, key, value, classification, project_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, NULL, ?, ?)
  `).run(id, data.key, data.value, data.classification ?? null, now, now);
  return getById(id);
}

function create(data) {
  const now = new Date().toISOString();
  const id = uuidv4();
  db.prepare(`
    INSERT INTO snippets (id, key, value, classification, project_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, NULL, ?, ?)
  `).run(id, data.key, data.value, data.classification ?? null, now, now);
  return getById(id);
}

function update(id, data) {
  const now = new Date().toISOString();
  const row = getById(id);
  if (!row) return null;
  db.prepare(`
    UPDATE snippets SET key = ?, value = ?, classification = ?, updated_at = ?
    WHERE id = ?
  `).run(
    data.key !== undefined ? data.key : row.key,
    data.value !== undefined ? data.value : row.value,
    data.classification !== undefined ? data.classification : row.classification,
    now,
    id
  );
  return getById(id);
}

function remove(id) {
  return db.prepare('DELETE FROM snippets WHERE id = ?').run(id);
}

/**
 * Get distinct classification values for filtering.
 */
function getClassifications() {
  const rows = db.prepare('SELECT DISTINCT classification FROM snippets WHERE classification IS NOT NULL ORDER BY classification').all();
  return rows.map(r => r.classification);
}

module.exports = {
  resolveInText,
  getMap,
  list,
  getByKey,
  getById,
  upsert,
  create,
  update,
  remove,
  getClassifications,
  SNIPPET_PATTERN
};
