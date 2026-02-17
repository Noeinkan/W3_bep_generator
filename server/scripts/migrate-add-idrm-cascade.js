/**
 * Migration Script: Add ON DELETE CASCADE for IDRM project foreign keys
 *
 * Adds CASCADE foreign keys to:
 * - information_management_activities.project_id -> projects(id)
 * - information_deliverables.project_id -> projects(id)
 *
 * Usage: node server/scripts/migrate-add-idrm-cascade.js
 */

const db = require('../db/database');

function hasProjectCascadeFk(tableName) {
  const fks = db.prepare(`PRAGMA foreign_key_list(${tableName})`).all();
  return fks.some((fk) => fk.table === 'projects' && fk.from === 'project_id' && fk.on_delete === 'CASCADE');
}

function countOrphans(tableName, columnName) {
  return db.prepare(`
    SELECT COUNT(*) AS count
    FROM ${tableName}
    WHERE ${columnName} IS NOT NULL
      AND ${columnName} NOT IN (SELECT id FROM projects)
  `).get().count;
}

function migrate() {
  const activitiesHasCascade = hasProjectCascadeFk('information_management_activities');
  const deliverablesHasCascade = hasProjectCascadeFk('information_deliverables');

  if (activitiesHasCascade && deliverablesHasCascade) {
    console.log('Migration already applied: IDRM project CASCADE foreign keys already exist.');
    return;
  }

  const orphanActivities = countOrphans('information_management_activities', 'project_id');
  const orphanDeliverables = countOrphans('information_deliverables', 'project_id');

  if (orphanActivities > 0 || orphanDeliverables > 0) {
    throw new Error(
      `Cannot apply migration: found orphaned IDRM rows (activities=${orphanActivities}, deliverables=${orphanDeliverables}). ` +
      'Run audit-orphaned-records.js and clean up first.'
    );
  }

  const transaction = db.transaction(() => {
    console.log('  Migrating information_management_activities...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS information_management_activities_new (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        activity_name TEXT NOT NULL,
        activity_description TEXT,
        appointing_party_role TEXT,
        lead_appointed_party_role TEXT,
        appointed_parties_role TEXT,
        third_parties_role TEXT,
        notes TEXT,
        iso_reference TEXT,
        activity_phase TEXT,
        display_order INTEGER,
        is_custom INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
    `);

    db.exec(`INSERT INTO information_management_activities_new SELECT * FROM information_management_activities;`);
    db.exec(`DROP TABLE information_management_activities;`);
    db.exec(`ALTER TABLE information_management_activities_new RENAME TO information_management_activities;`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_im_activities_project_id ON information_management_activities(project_id);`);

    console.log('  ✓ information_management_activities migrated');

    console.log('  Migrating information_deliverables...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS information_deliverables_new (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        deliverable_name TEXT NOT NULL,
        description TEXT,
        responsible_task_team TEXT,
        accountable_party TEXT,
        exchange_stage TEXT,
        due_date TEXT,
        format TEXT,
        loin_lod TEXT,
        dependencies TEXT,
        tidp_id TEXT,
        tidp_container_id TEXT,
        status TEXT DEFAULT 'Planned',
        is_auto_populated INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (tidp_id) REFERENCES tidps(id) ON DELETE SET NULL
      );
    `);

    db.exec(`INSERT INTO information_deliverables_new SELECT * FROM information_deliverables;`);
    db.exec(`DROP TABLE information_deliverables;`);
    db.exec(`ALTER TABLE information_deliverables_new RENAME TO information_deliverables;`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_deliverables_project_id ON information_deliverables(project_id);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_deliverables_tidp_id ON information_deliverables(tidp_id);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_deliverables_status ON information_deliverables(status);`);

    console.log('  ✓ information_deliverables migrated');
  });

  console.log('Starting migration: Add CASCADE foreign keys for IDRM project references...');
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
