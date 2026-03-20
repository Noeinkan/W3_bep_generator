/**
 * EIR drafts CRUD — Exchange Information Requirements document storage.
 * Synchronous better-sqlite3; no async.
 */
const db = require('../database');
const { createId } = require('@paralleldrive/cuid2');
const crypto = require('crypto');

function listByUser(userId, projectId = null) {
  if (projectId) {
    return db.prepare(`
      SELECT id, user_id, project_id, title, data, status, created_at, updated_at
      FROM eir_drafts
      WHERE user_id = ? AND project_id = ?
      ORDER BY updated_at DESC
    `).all(userId, projectId);
  }
  return db.prepare(`
    SELECT id, user_id, project_id, title, data, status, created_at, updated_at
    FROM eir_drafts
    WHERE user_id = ?
    ORDER BY updated_at DESC
  `).all(userId);
}

function getById(id, userId) {
  const row = db.prepare(`
    SELECT id, user_id, project_id, title, data, status, created_at, updated_at
    FROM eir_drafts
    WHERE id = ? AND user_id = ?
  `).get(id, userId);
  if (!row) return null;
  return {
    ...row,
    status: row.status || 'draft',
    data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data
  };
}

function create({ userId, projectId, title, data }) {
  const id = createId();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO eir_drafts (id, user_id, project_id, title, data, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'draft', ?, ?)
  `).run(id, userId, projectId || null, title, JSON.stringify(data || {}), now, now);
  return getById(id, userId);
}

function update(id, userId, { title, projectId, data, status }) {
  const existing = db.prepare('SELECT id, project_id FROM eir_drafts WHERE id = ? AND user_id = ?').get(id, userId);
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
  if (status !== undefined) {
    updates.push('status = ?');
    values.push(status === 'published' ? 'published' : 'draft');
  }
  if (updates.length === 0) return getById(id, userId);
  updates.push('updated_at = ?');
  values.push(now);
  values.push(id, userId);
  db.prepare(`UPDATE eir_drafts SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
  return getById(id, userId);
}

/**
 * Mark this EIR draft as published for its project. Unpublish any other EIR for the same project.
 */
function publish(id, userId) {
  const draft = db.prepare('SELECT id, project_id FROM eir_drafts WHERE id = ? AND user_id = ?').get(id, userId);
  if (!draft) return null;
  const now = new Date().toISOString();
  if (draft.project_id) {
    db.prepare(`
      UPDATE eir_drafts SET status = 'draft', updated_at = ? WHERE project_id = ? AND user_id = ?
    `).run(now, draft.project_id, userId);
  }
  db.prepare(`
    UPDATE eir_drafts SET status = 'published', updated_at = ? WHERE id = ? AND user_id = ?
  `).run(now, id, userId);
  return getById(id, userId);
}

/**
 * Get the published EIR draft for a project (if any). userId optional for same-user only.
 */
function getPublishedByProject(projectId, userId = null) {
  if (!projectId) return null;
  const sql = userId
    ? 'SELECT id, user_id, project_id, title, data, status, created_at, updated_at FROM eir_drafts WHERE project_id = ? AND user_id = ? AND status = ? ORDER BY updated_at DESC LIMIT 1'
    : 'SELECT id, user_id, project_id, title, data, status, created_at, updated_at FROM eir_drafts WHERE project_id = ? AND status = ? ORDER BY updated_at DESC LIMIT 1';
  const row = userId
    ? db.prepare(sql).get(projectId, userId, 'published')
    : db.prepare(sql).get(projectId, 'published');
  if (!row) return null;
  return {
    ...row,
    data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data
  };
}

function remove(id, userId) {
  const result = db.prepare('DELETE FROM eir_drafts WHERE id = ? AND user_id = ?').run(id, userId);
  return result.changes > 0;
}

/**
 * Generate (or regenerate) a share token for a published EIR draft.
 * Only the owner can generate a share token.
 * Returns the token string, or null if the draft is not found.
 */
function generateShareToken(id, userId) {
  const draft = db.prepare('SELECT id, status FROM eir_drafts WHERE id = ? AND user_id = ?').get(id, userId);
  if (!draft) return null;
  const token = crypto.randomBytes(20).toString('hex');
  const now = new Date().toISOString();
  db.prepare('UPDATE eir_drafts SET share_token = ?, updated_at = ? WHERE id = ? AND user_id = ?').run(token, now, id, userId);
  return token;
}

/**
 * Fetch a published EIR draft by its share token (no auth required — public read).
 * Returns null if the token is invalid or the EIR is not published.
 */
function getByShareToken(token) {
  if (!token) return null;
  const row = db.prepare(`
    SELECT id, user_id, project_id, title, data, status, created_at, updated_at
    FROM eir_drafts
    WHERE share_token = ? AND status = 'published'
  `).get(token);
  if (!row) return null;
  return {
    ...row,
    data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data
  };
}

module.exports = {
  listByUser,
  getById,
  create,
  update,
  remove,
  publish,
  getPublishedByProject,
  generateShareToken,
  getByShareToken,
};
