const { v4: uuidv4 } = require('uuid');
const db = require('../database');

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

module.exports = new ProjectService();
