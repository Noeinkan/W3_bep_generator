/**
 * Migration Script: Add draft_id columns to BEP structure tables
 *
 * This script adds draft_id columns to bep_step_configs and bep_field_configs
 * tables for draft-level structure isolation.
 *
 * Usage: node server/scripts/migrate-add-draft-id.js
 */

const db = require('../database');

function migrate() {
  console.log('Starting migration: Add draft_id columns...');

  // Check if draft_id column already exists in bep_step_configs
  const stepColumns = db.prepare("PRAGMA table_info(bep_step_configs)").all();
  const stepHasDraftId = stepColumns.some(col => col.name === 'draft_id');

  // Check if draft_id column already exists in bep_field_configs
  const fieldColumns = db.prepare("PRAGMA table_info(bep_field_configs)").all();
  const fieldHasDraftId = fieldColumns.some(col => col.name === 'draft_id');

  if (stepHasDraftId && fieldHasDraftId) {
    console.log('Migration already applied: draft_id columns exist.');
    return;
  }

  const transaction = db.transaction(() => {
    // Add draft_id column to bep_step_configs if not exists
    if (!stepHasDraftId) {
      console.log('  Adding draft_id column to bep_step_configs...');
      db.exec('ALTER TABLE bep_step_configs ADD COLUMN draft_id TEXT');
      db.exec('CREATE INDEX IF NOT EXISTS idx_step_configs_draft ON bep_step_configs(draft_id)');
      console.log('  Done.');
    }

    // Add draft_id column to bep_field_configs if not exists
    if (!fieldHasDraftId) {
      console.log('  Adding draft_id column to bep_field_configs...');
      db.exec('ALTER TABLE bep_field_configs ADD COLUMN draft_id TEXT');
      db.exec('CREATE INDEX IF NOT EXISTS idx_field_configs_draft ON bep_field_configs(draft_id)');
      console.log('  Done.');
    }
  });

  try {
    transaction();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run the migration
migrate();
