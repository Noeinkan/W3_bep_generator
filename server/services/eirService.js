/**
 * EIR drafts CRUD — Exchange Information Requirements document storage.
 * Synchronous better-sqlite3; no async.
 */
const db = require('../database');
const { createId } = require('@paralleldrive/cuid2');

function listByUser(userId, projectId = null) {
  if (projectId) {
    return db.prepare(`
      SELECT id, user_id, project_id, title, data, created_at, updated_at
      FROM eir_drafts
      WHERE user_id = ? AND project_id = ?
      ORDER BY updated_at DESC
    `).all(userId, projectId);
  }
  return db.prepare(`
    SELECT id, user_id, project_id, title, data, created_at, updated_at
    FROM eir_drafts
    WHERE user_id = ?
    ORDER BY updated_at DESC
  `).all(userId);
}

function getById(id, userId) {
  const row = db.prepare(`
    SELECT id, user_id, project_id, title, data, created_at, updated_at
    FROM eir_drafts
    WHERE id = ? AND user_id = ?
  `).get(id, userId);
  if (!row) return null;
  return {
    ...row,
    data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data
  };
}

function create({ userId, projectId, title, data }) {
  const id = createId();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO eir_drafts (id, user_id, project_id, title, data, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, userId, projectId || null, title, JSON.stringify(data || {}), now, now);
  return getById(id, userId);
}

function update(id, userId, { title, projectId, data }) {
  const existing = db.prepare('SELECT id FROM eir_drafts WHERE id = ? AND user_id = ?').get(id, userId);
  if (!existing) return null;
  const now = new Date().toISOString();
  const updates = [];
  const values = [];
  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title);
  }
  if (projectId !== undefined) {
    updates.push('project_id = ?');
    values.push(projectId);
  }
  if (data !== undefined) {
    updates.push('data = ?');
    values.push(JSON.stringify(data));
  }
  if (updates.length === 0) return getById(id, userId);
  updates.push('updated_at = ?');
  values.push(now);
  values.push(id, userId);
  db.prepare(`UPDATE eir_drafts SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
  return getById(id, userId);
}

function remove(id, userId) {
  const result = db.prepare('DELETE FROM eir_drafts WHERE id = ? AND user_id = ?').run(id, userId);
  return result.changes > 0;
}

module.exports = {
  listByUser,
  getById,
  create,
  update,
  remove
};
