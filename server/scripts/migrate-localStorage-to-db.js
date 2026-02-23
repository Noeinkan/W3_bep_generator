/**
 * Migration script to move TIDPs from localStorage to SQLite database
 * This script helps users migrate their existing TIDP drafts from browser localStorage to the persistent database
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n=== TIDP Migration Tool ===\n');
console.log('This script will help you migrate your TIDPs from browser localStorage to the SQLite database.\n');
console.log('INSTRUCTIONS:');
console.log('1. Open your browser (where you have the TIDPs)');
console.log('2. Press F12 to open Developer Tools');
console.log('3. Go to Console tab');
console.log('4. Paste this command and press Enter:\n');
console.log('   JSON.stringify(localStorage)\n');
console.log('5. Copy the entire output (it will be a long JSON string)');
console.log('6. Paste it below when prompted\n');

rl.question('Paste your localStorage JSON here (or type "skip" to skip): ', (answer) => {
  if (answer.toLowerCase() === 'skip') {
    console.log('\nSkipping migration. You can run this script again later.');
    rl.close();
    return;
  }

  try {
    const localStorageData = JSON.parse(answer);

    // Find all draft keys
    const draftKeys = Object.keys(localStorageData).filter(key => key.startsWith('bepDrafts_'));

    if (draftKeys.length === 0) {
      console.log('\nNo TIDP drafts found in the provided localStorage data.');
      rl.close();
      return;
    }

    console.log(`\nFound ${draftKeys.length} draft storage key(s).\n`);

    const db = require('../database');
    const tidpService = require('../services/tidpService');

    let totalMigrated = 0;

    draftKeys.forEach(key => {
      const draftsJson = localStorageData[key];
      const drafts = JSON.parse(draftsJson);

      Object.values(drafts).forEach(draft => {
        try {
          // Check if this TIDP already exists in database
          const existing = db.prepare('SELECT id FROM tidps WHERE id = ?').get(draft.id);

          if (existing) {
            console.log(`⚠️  TIDP "${draft.teamName}" (${draft.id}) already exists in database - skipping`);
            return;
          }

          // Create TIDP in database
          const tidpData = {
            id: draft.id,
            teamName: draft.teamName || 'Untitled Team',
            discipline: draft.discipline || 'general',
            leader: draft.leader || '',
            company: draft.company || '',
            responsibilities: draft.responsibilities || '',
            projectId: draft.projectId || 'migrated-project',
            containers: draft.containers || []
          };

          tidpService.createTIDP(tidpData);
          console.log(`✓ Migrated: ${draft.teamName} (${draft.containers?.length || 0} containers)`);
          totalMigrated++;
        } catch (error) {
          console.error(`✗ Failed to migrate ${draft.teamName}:`, error.message);
        }
      });
    });

    console.log(`\n=== Migration Complete ===`);
    console.log(`Successfully migrated ${totalMigrated} TIDP(s) to the database.\n`);
    console.log('Your TIDPs are now permanently stored in: server/db/bep-generator.db');
    console.log('You can now refresh your browser to see them.\n');

  } catch (error) {
    console.error('\n❌ Error during migration:', error.message);
    console.log('\nPlease make sure you copied the entire JSON output from the console.\n');
  }

  rl.close();
});
