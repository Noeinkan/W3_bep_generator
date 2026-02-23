/**
 * Migration Script: Add ON DELETE CASCADE to project_id foreign keys
 *
 * This script adds foreign key constraints with CASCADE delete to:
 * - drafts.project_id
 * - tidps.projectId
 * - midps.projectId
 *
 * When a project is deleted, all associated drafts, TIDPs, and MIDPs will be automatically deleted.
 *
 * Usage: node server/scripts/migrate-add-project-cascade.js
 */

const db = require('../database');

function migrate() {
  console.log('Starting migration: Add CASCADE foreign keys to project references...');

  const transaction = db.transaction(() => {
    // 1. Migrate drafts table
    console.log('  Migrating drafts table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS drafts_new (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        project_id TEXT,
        title TEXT NOT NULL,
        type TEXT CHECK(type IN ('pre-appointment', 'post-appointment')) NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        is_deleted INTEGER DEFAULT 0,
        version TEXT DEFAULT '1.0',
        status TEXT DEFAULT 'draft',
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
    `);

    db.exec(`INSERT INTO drafts_new SELECT * FROM drafts;`);
    db.exec(`DROP TABLE drafts;`);
    db.exec(`ALTER TABLE drafts_new RENAME TO drafts;`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_drafts_project_id ON drafts(project_id);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_drafts_is_deleted ON drafts(is_deleted);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_drafts_updated_at ON drafts(updated_at);`);
    console.log('  ✓ drafts table migrated');

    // 2. Migrate tidps table
    console.log('  Migrating tidps table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS tidps_new (
        id TEXT PRIMARY KEY,
        teamName TEXT NOT NULL,
        discipline TEXT NOT NULL,
        leader TEXT,
        company TEXT,
        responsibilities TEXT,
        projectId TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version TEXT DEFAULT '1.0',
        status TEXT DEFAULT 'Draft',
        source TEXT,
        createdVia TEXT,
        FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
      );
    `);

    db.exec(`INSERT INTO tidps_new SELECT * FROM tidps;`);
    db.exec(`DROP TABLE tidps;`);
    db.exec(`ALTER TABLE tidps_new RENAME TO tidps;`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_tidps_projectId ON tidps(projectId);`);
    console.log('  ✓ tidps table migrated');

    // 3. Migrate midps table
    console.log('  Migrating midps table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS midps_new (
        id TEXT PRIMARY KEY,
        projectName TEXT NOT NULL,
        aggregated_data TEXT NOT NULL,
        delivery_schedule TEXT NOT NULL,
        included_tidps TEXT,
        risk_register TEXT,
        dependency_matrix TEXT,
        resource_plan TEXT,
        description TEXT,
        quality_gates TEXT,
        projectId TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version TEXT DEFAULT '1.0',
        status TEXT DEFAULT 'Draft',
        FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
      );
    `);

    db.exec(`INSERT INTO midps_new SELECT * FROM midps;`);
    db.exec(`DROP TABLE midps;`);
    db.exec(`ALTER TABLE midps_new RENAME TO midps;`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_midps_projectId ON midps(projectId);`);
    console.log('  ✓ midps table migrated');
  });

  try {
    transaction();
    console.log('Migration completed successfully!');
    console.log('\nNow when a project is deleted, all associated drafts, TIDPs, and MIDPs will be automatically removed.');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run the migration
migrate();
