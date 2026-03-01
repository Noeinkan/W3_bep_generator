/**
 * Seed default BEP snippets so {{snippet:key}} placeholders resolve to sensible text.
 * Run once after DB creation: node server/scripts/seed-snippets.js [--force]
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const snippetService = require('../services/snippetService');

const DEFAULTS = [
  { key: 'appointed_party', value: '[Appointed Party]', classification: 'parties' },
  { key: 'appointing_party', value: '[Appointing Party]', classification: 'parties' },
  { key: 'eir_ref', value: '[EIR-REF]', classification: 'references' },
  { key: 'pir_ref', value: '[PIR-REF]', classification: 'references' },
];

function seed() {
  const force = process.argv.includes('--force');
  const existing = snippetService.list();
  if (existing.length > 0 && !force) {
    console.log('Snippets already exist. Use --force to upsert defaults.');
    return;
  }

  console.log('Seeding default snippets...');
  DEFAULTS.forEach(({ key, value, classification }) => {
    const row = snippetService.upsert({ key, value, classification });
    console.log(`  ${row.key} -> ${row.value}`);
  });
  console.log('Done.');
}

seed();
