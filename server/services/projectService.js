const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

class ProjectService {
  getAllProjects(userId) {
    const stmt = db.prepare(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC'
    );
    return stmt.all(userId);
  }

  getProject(id) {
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    return stmt.get(id);
  }

  createProject(userId, name) {
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(
      'INSERT INTO projects (id, name, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(id, name, userId, now, now);

    return this.getProject(id);
  }

  updateProject(id, name) {
    const now = new Date().toISOString();
    const stmt = db.prepare(
      'UPDATE projects SET name = ?, updated_at = ? WHERE id = ?'
    );
    stmt.run(name, now, id);

    return this.getProject(id);
  }

  deleteProject(id) {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    return stmt.run(id);
  }
}

module.exports = new ProjectService();
