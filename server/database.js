const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the db directory exists (volume-mounted at runtime; create if missing locally)
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(__dirname, 'db', 'bep-generator.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tidps (
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
    createdVia TEXT
  );

  CREATE TABLE IF NOT EXISTS containers (
    id TEXT PRIMARY KEY,
    tidp_id TEXT NOT NULL,
    information_container_id TEXT,
    container_name TEXT,
    description TEXT,
    task_name TEXT,
    responsible_party TEXT,
    author TEXT,
    dependencies TEXT,
    loin TEXT,
    classification TEXT,
    estimated_time TEXT,
    delivery_milestone TEXT,
    due_date TEXT,
    format_type TEXT,
    purpose TEXT,
    acceptance_criteria TEXT,
    review_process TEXT,
    status TEXT,
    createdAt TEXT,
    FOREIGN KEY (tidp_id) REFERENCES tidps(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS midps (
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
    status TEXT DEFAULT 'Draft'
  );

  CREATE INDEX IF NOT EXISTS idx_tidps_projectId ON tidps(projectId);
  CREATE INDEX IF NOT EXISTS idx_containers_tidp_id ON containers(tidp_id);
  CREATE INDEX IF NOT EXISTS idx_midps_projectId ON midps(projectId);

  CREATE TABLE IF NOT EXISTS information_management_activities (
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
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS information_deliverables (
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
    FOREIGN KEY (tidp_id) REFERENCES tidps(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_im_activities_project_id ON information_management_activities(project_id);
  CREATE INDEX IF NOT EXISTS idx_deliverables_project_id ON information_deliverables(project_id);
  CREATE INDEX IF NOT EXISTS idx_deliverables_tidp_id ON information_deliverables(tidp_id);
  CREATE INDEX IF NOT EXISTS idx_deliverables_status ON information_deliverables(status);

  CREATE TABLE IF NOT EXISTS drafts (
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
    status TEXT DEFAULT 'draft'
  );

  CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);
  CREATE INDEX IF NOT EXISTS idx_drafts_project_id ON drafts(project_id);
  CREATE INDEX IF NOT EXISTS idx_drafts_is_deleted ON drafts(is_deleted);
  CREATE INDEX IF NOT EXISTS idx_drafts_updated_at ON drafts(updated_at);

  -- BEP Structure: Step configurations (H1 level)
  -- draft_id: Links to a specific draft for draft-level isolation
  -- project_id: Kept for backward compatibility (deprecated, use draft_id)
  -- NULL draft_id AND NULL project_id = default template
  CREATE TABLE IF NOT EXISTS bep_step_configs (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    draft_id TEXT,
    step_number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    order_index INTEGER NOT NULL,
    is_visible INTEGER DEFAULT 1,
    icon TEXT,
    bep_type TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0,
    FOREIGN KEY(draft_id) REFERENCES drafts(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_step_configs_project ON bep_step_configs(project_id);
  CREATE INDEX IF NOT EXISTS idx_step_configs_order ON bep_step_configs(order_index);
  CREATE INDEX IF NOT EXISTS idx_step_configs_deleted ON bep_step_configs(is_deleted);

  -- BEP Structure: Field configurations (H2 level)
  -- draft_id: Links to a specific draft for draft-level isolation
  CREATE TABLE IF NOT EXISTS bep_field_configs (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    draft_id TEXT,
    step_id TEXT NOT NULL,
    field_id TEXT NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    number TEXT,
    order_index INTEGER NOT NULL,
    is_visible INTEGER DEFAULT 1,
    is_required INTEGER DEFAULT 0,
    placeholder TEXT,
    help_text TEXT,
    config TEXT,
    default_value TEXT,
    bep_type TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0,
    FOREIGN KEY(step_id) REFERENCES bep_step_configs(id) ON DELETE CASCADE,
    FOREIGN KEY(draft_id) REFERENCES drafts(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_field_configs_step ON bep_field_configs(step_id, order_index);
  CREATE INDEX IF NOT EXISTS idx_field_configs_project ON bep_field_configs(project_id);
  CREATE INDEX IF NOT EXISTS idx_field_configs_deleted ON bep_field_configs(is_deleted);
  CREATE INDEX IF NOT EXISTS idx_field_configs_bep_type ON bep_field_configs(bep_type);

  -- Projects: Top-level organizer for all project-scoped data
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    acc_hub_id TEXT,
    acc_project_id TEXT,
    acc_default_folder TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

  CREATE TABLE IF NOT EXISTS acc_secrets (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    secret_type TEXT NOT NULL,
    encrypted_value TEXT NOT NULL,
    iv TEXT NOT NULL,
    auth_tag TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(project_id, secret_type),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_acc_secrets_project_id ON acc_secrets(project_id);
  CREATE INDEX IF NOT EXISTS idx_acc_secrets_secret_type ON acc_secrets(secret_type);

  -- Client Documents: EIR and other client-provided documents for analysis
  CREATE TABLE IF NOT EXISTS client_documents (
    id TEXT PRIMARY KEY,
    draft_id TEXT,
    user_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    extracted_text TEXT,
    analysis_json TEXT,
    summary_markdown TEXT,
    status TEXT DEFAULT 'uploaded' CHECK(status IN ('uploaded', 'extracting', 'extracted', 'analyzing', 'analyzed', 'error')),
    error_message TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (draft_id) REFERENCES drafts(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_documents_draft_id ON client_documents(draft_id);
  CREATE INDEX IF NOT EXISTS idx_documents_user_id ON client_documents(user_id);
  CREATE INDEX IF NOT EXISTS idx_documents_status ON client_documents(status);

  -- Users: Authentication and user management
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_login TEXT,
    is_active INTEGER DEFAULT 1,
    email_verified INTEGER DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

  -- Email Verification Tokens: For verifying new user emails
  CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    uses INTEGER DEFAULT 0,
    max_uses INTEGER DEFAULT 5,
    used INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);

  -- Password Reset Tokens: For password recovery
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
`);

// Migration: Add draft_id columns if they don't exist (for existing databases)
const stepColumns = db.prepare("PRAGMA table_info(bep_step_configs)").all();
const stepHasDraftId = stepColumns.some(col => col.name === 'draft_id');

const fieldColumns = db.prepare("PRAGMA table_info(bep_field_configs)").all();
const fieldHasDraftId = fieldColumns.some(col => col.name === 'draft_id');

if (!stepHasDraftId) {
  db.exec('ALTER TABLE bep_step_configs ADD COLUMN draft_id TEXT');
}
if (!fieldHasDraftId) {
  db.exec('ALTER TABLE bep_field_configs ADD COLUMN draft_id TEXT');
}

// Migration: add email_verified to users table if missing
const userColumns = db.prepare("PRAGMA table_info(users)").all();
const hasEmailVerified = userColumns.some(col => col.name === 'email_verified');
if (!hasEmailVerified) {
  try {
    db.exec('ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0');
    console.log('Migration: added email_verified column to users');
    // Per migration policy, mark existing users as verified to avoid locking them out
    db.exec('UPDATE users SET email_verified = 1 WHERE email_verified IS NULL OR email_verified = 0');
  } catch (err) {
    console.error('Could not add email_verified column:', err.message);
  }
}

// Migration safety: ensure projects table exists on existing DBs that predate its addition.
// Must run BEFORE the ACC columns migration below, which references this table.
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    acc_hub_id TEXT,
    acc_project_id TEXT,
    acc_default_folder TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
`);

// Migration: add ACC linkage columns to projects table if missing
const projectColumns = db.prepare("PRAGMA table_info(projects)").all();
const hasAccHubId = projectColumns.some(col => col.name === 'acc_hub_id');
const hasAccProjectId = projectColumns.some(col => col.name === 'acc_project_id');
const hasAccDefaultFolder = projectColumns.some(col => col.name === 'acc_default_folder');

if (!hasAccHubId) {
  try {
    db.exec('ALTER TABLE projects ADD COLUMN acc_hub_id TEXT');
    console.log('Migration: added acc_hub_id column to projects');
  } catch (err) {
    console.error('Could not add acc_hub_id column:', err.message);
  }
}

if (!hasAccProjectId) {
  try {
    db.exec('ALTER TABLE projects ADD COLUMN acc_project_id TEXT');
    console.log('Migration: added acc_project_id column to projects');
  } catch (err) {
    console.error('Could not add acc_project_id column:', err.message);
  }
}

if (!hasAccDefaultFolder) {
  try {
    db.exec('ALTER TABLE projects ADD COLUMN acc_default_folder TEXT');
    console.log('Migration: added acc_default_folder column to projects');
  } catch (err) {
    console.error('Could not add acc_default_folder column:', err.message);
  }
}

// Migration safety: ensure acc_secrets table and indexes exist on existing DBs
db.exec(`
  CREATE TABLE IF NOT EXISTS acc_secrets (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    secret_type TEXT NOT NULL,
    encrypted_value TEXT NOT NULL,
    iv TEXT NOT NULL,
    auth_tag TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(project_id, secret_type),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_acc_secrets_project_id ON acc_secrets(project_id);
  CREATE INDEX IF NOT EXISTS idx_acc_secrets_secret_type ON acc_secrets(secret_type);
`);

// Create indexes for draft_id (safe to run even if they exist)
db.exec('CREATE INDEX IF NOT EXISTS idx_step_configs_draft ON bep_step_configs(draft_id)');
db.exec('CREATE INDEX IF NOT EXISTS idx_field_configs_draft ON bep_field_configs(draft_id)');

// Create evolution_snapshots table for real historical tracking
db.exec(`
  CREATE TABLE IF NOT EXISTS evolution_snapshots (
    id TEXT PRIMARY KEY,
    midp_id TEXT NOT NULL,
    snapshot_data TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (midp_id) REFERENCES midps(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_evolution_snapshots_midp_id ON evolution_snapshots(midp_id);
`);

// Migration: Rename MIDP columns from misleading names to correct ones
const midpColumns = db.prepare("PRAGMA table_info(midps)").all();
const hasOldColumns = midpColumns.some(col => col.name === 'modelUse');

if (hasOldColumns) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS midps_v2 (
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
      status TEXT DEFAULT 'Draft'
    );

    INSERT OR IGNORE INTO midps_v2 (id, projectName, aggregated_data, delivery_schedule, included_tidps, risk_register, dependency_matrix, resource_plan, description, quality_gates, projectId, createdAt, updatedAt, version, status)
    SELECT id, projectName, modelUse, discipline, responsible, lod, milestone, dueDate, description, acceptanceCriteria, projectId, createdAt, updatedAt, version, status
    FROM midps;

    DROP TABLE midps;
    ALTER TABLE midps_v2 RENAME TO midps;
    CREATE INDEX IF NOT EXISTS idx_midps_projectId ON midps(projectId);
  `);
  console.log('Migration: MIDP columns renamed to correct names');
}

console.log('Database initialized at:', dbPath);

module.exports = db;
