/**
 * Migration Script: Add user foreign key to projects.user_id
 *
 * Adds foreign key:
 * - projects.user_id -> users(id) ON DELETE CASCADE
 *
 * Usage: node server/scripts/migrate-add-projects-user-fk.js
 */

const db = require('../database');

function hasUserFk() {
  const fks = db.prepare('PRAGMA foreign_key_list(projects)').all();
  return fks.some((fk) => fk.table === 'users' && fk.from === 'user_id');
}

function countOrphanProjects() {
  return db.prepare(`
    SELECT COUNT(*) AS count
    FROM projects
    WHERE user_id NOT IN (SELECT id FROM users)
  `).get().count;
}

function migrate() {
  if (hasUserFk()) {
    console.log('Migration already applied: projects.user_id foreign key already exists.');
    return;
  }

  const orphanProjects = countOrphanProjects();
  if (orphanProjects > 0) {
    throw new Error(
      `Cannot apply migration: found ${orphanProjects} projects with missing users. ` +
      'Clean orphaned projects first.'
    );
  }

  const transaction = db.transaction(() => {
    const projectColumns = db.prepare('PRAGMA table_info(projects)').all();
    const columnNames = new Set(projectColumns.map((column) => column.name));

    const selectAccHub = columnNames.has('acc_hub_id') ? 'acc_hub_id' : 'NULL';
    const selectAccProject = columnNames.has('acc_project_id') ? 'acc_project_id' : 'NULL';
    const selectAccDefaultFolder = columnNames.has('acc_default_folder') ? 'acc_default_folder' : 'NULL';

    db.exec(`
      CREATE TABLE IF NOT EXISTS projects_new (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        user_id TEXT NOT NULL,
        acc_hub_id TEXT,
        acc_project_id TEXT,
        acc_default_folder TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    db.exec(`
      INSERT INTO projects_new (
        id,
        name,
        user_id,
        acc_hub_id,
        acc_project_id,
        acc_default_folder,
        created_at,
        updated_at
      )
      SELECT
        id,
        name,
        user_id,
        ${selectAccHub},
        ${selectAccProject},
        ${selectAccDefaultFolder},
        created_at,
        updated_at
      FROM projects;
    `);
    db.exec(`DROP TABLE projects;`);
    db.exec(`ALTER TABLE projects_new RENAME TO projects;`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);`);
  });

  console.log('Starting migration: Add foreign key projects.user_id -> users(id)...');
  transaction();
  console.log('Migration completed successfully!');
}

if (require.main === module) {
  try {
    migrate();
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  migrate
};
