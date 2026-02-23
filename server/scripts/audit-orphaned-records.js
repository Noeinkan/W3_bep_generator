const db = require('../database');

const TABLES = [
  { name: 'drafts', column: 'project_id' },
  { name: 'tidps', column: 'projectId' },
  { name: 'midps', column: 'projectId' },
  { name: 'information_management_activities', column: 'project_id' },
  { name: 'information_deliverables', column: 'project_id' }
];

const SAMPLE_LIMIT = 10;

function countOrphans(tableName, columnName) {
  const stmt = db.prepare(`
    SELECT COUNT(*) AS count
    FROM ${tableName}
    WHERE ${columnName} IS NOT NULL
      AND ${columnName} NOT IN (SELECT id FROM projects)
  `);
  return stmt.get().count;
}

function sampleOrphans(tableName, columnName) {
  const stmt = db.prepare(`
    SELECT *
    FROM ${tableName}
    WHERE ${columnName} IS NOT NULL
      AND ${columnName} NOT IN (SELECT id FROM projects)
    LIMIT ?
  `);
  return stmt.all(SAMPLE_LIMIT);
}

function deleteOrphans(tableName, columnName) {
  const stmt = db.prepare(`
    DELETE FROM ${tableName}
    WHERE ${columnName} IS NOT NULL
      AND ${columnName} NOT IN (SELECT id FROM projects)
  `);
  const result = stmt.run();
  return result.changes || 0;
}

function auditProjectUserOrphans() {
  const count = db.prepare(`
    SELECT COUNT(*) AS count
    FROM projects
    WHERE user_id NOT IN (SELECT id FROM users)
  `).get().count;

  const sample = db.prepare(`
    SELECT *
    FROM projects
    WHERE user_id NOT IN (SELECT id FROM users)
    LIMIT ?
  `).all(SAMPLE_LIMIT);

  return { count, sample };
}

function deleteProjectUserOrphans() {
  const result = db.prepare(`
    DELETE FROM projects
    WHERE user_id NOT IN (SELECT id FROM users)
  `).run();

  return result.changes || 0;
}

function runAudit({ cleanup = false, cleanupProjectUsers = false } = {}) {
  console.log('Auditing orphaned records...\n');

  const summary = {
    tableCounts: {},
    deletedCounts: {},
    totalOrphans: 0,
    projectUserOrphans: 0
  };

  TABLES.forEach(({ name, column }) => {
    const count = countOrphans(name, column);
    summary.tableCounts[name] = count;
    summary.totalOrphans += count;

    console.log(`${name}: ${count} orphaned records`);

    if (count > 0) {
      const sample = sampleOrphans(name, column);
      console.log(`  Sample (up to ${SAMPLE_LIMIT}):`);
      console.log(sample);

      if (cleanup) {
        const deleted = deleteOrphans(name, column);
        summary.deletedCounts[name] = deleted;
        console.log(`  ✓ Deleted ${deleted} orphaned records from ${name}`);
      }
    }
  });

  const projectUserOrphans = auditProjectUserOrphans();
  summary.projectUserOrphans = projectUserOrphans.count;
  console.log(`\nprojects with missing user references: ${projectUserOrphans.count}`);
  if (projectUserOrphans.count > 0) {
    console.log(`  Sample (up to ${SAMPLE_LIMIT}):`);
    console.log(projectUserOrphans.sample);
  }

  if (cleanup) {
    console.log('\nCleanup mode enabled: non-template orphaned records were deleted.');
  }

  if (cleanupProjectUsers) {
    const deletedProjects = deleteProjectUserOrphans();
    summary.deletedCounts.projects = deletedProjects;
    console.log(`\n✓ Deleted ${deletedProjects} orphaned projects with missing users`);
  }

  console.log('\nAudit summary:');
  console.log(summary);

  return summary;
}

if (require.main === module) {
  try {
    const cleanup = process.argv.includes('--cleanup');
    const cleanupProjectUsers = process.argv.includes('--cleanup-project-users');
    const summary = runAudit({ cleanup, cleanupProjectUsers });

    if (!cleanup && (summary.totalOrphans > 0 || summary.projectUserOrphans > 0)) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  runAudit
};
