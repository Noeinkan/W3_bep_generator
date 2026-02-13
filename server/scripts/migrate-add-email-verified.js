const db = require('../db/database');

function ensureEmailVerifiedColumn() {
  const cols = db.prepare("PRAGMA table_info(users)").all();
  const has = cols.some(c => c.name === 'email_verified');
  if (!has) {
    try {
      db.exec('ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0');
      console.log('Added email_verified column to users');
      // mark existing users as verified per migration decision
      db.exec('UPDATE users SET email_verified = 1 WHERE email_verified IS NULL OR email_verified = 0');
    } catch (err) {
      console.error('Failed to add email_verified column', err.message);
    }
  } else {
    console.log('email_verified column already present');
  }
}

function ensureEmailVerificationTokensTable() {
  db.exec(`
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
  `);
  db.exec('CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token)');
  console.log('Ensured email_verification_tokens table exists');
}

function run() {
  ensureEmailVerifiedColumn();
  ensureEmailVerificationTokensTable();
}

if (require.main === module) run();

module.exports = { run };
