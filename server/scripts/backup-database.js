const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db/bep-generator.db');
const backupDir = path.join(__dirname, '../db/backups');

function backupDatabase() {
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database file not found: ${dbPath}`);
  }

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `bep-generator-${timestamp}.db`);

  fs.copyFileSync(dbPath, backupPath);
  const sizeBytes = fs.statSync(backupPath).size;

  console.log(`✓ Database backed up to: ${backupPath}`);
  console.log(`  Size: ${(sizeBytes / 1024 / 1024).toFixed(2)} MB`);

  return backupPath;
}

if (require.main === module) {
  try {
    backupDatabase();
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  backupDatabase
};
