/**
 * EIR Analysis Error Checker
 *
 * Quick script to check recent EIR document processing errors in the database.
 * Run with: node check-eir-errors.js
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'db', 'bep-generator.db');
const db = new Database(dbPath, { readonly: true });

console.log('=== Recent EIR Document Processing Status ===\n');

try {
  const documents = db.prepare(`
    SELECT
      id,
      original_filename,
      status,
      error_message,
      created_at,
      updated_at,
      LENGTH(extracted_text) as text_length
    FROM client_documents
    ORDER BY created_at DESC
    LIMIT 10
  `).all();

  if (documents.length === 0) {
    console.log('No documents found in the database.');
  } else {
    documents.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.original_filename}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Status: ${doc.status}`);
      console.log(`   Text Length: ${doc.text_length || 0} chars`);
      console.log(`   Created: ${new Date(doc.created_at).toLocaleString()}`);
      console.log(`   Updated: ${new Date(doc.updated_at).toLocaleString()}`);

      if (doc.error_message) {
        console.log(`   ❌ ERROR: ${doc.error_message}`);
      } else if (doc.status === 'analyzed') {
        console.log(`   ✓ Successfully analyzed`);
      }

      console.log('');
    });
  }

  // Check for failed documents specifically
  const failedDocs = db.prepare(`
    SELECT
      original_filename,
      error_message,
      updated_at
    FROM client_documents
    WHERE status = 'error'
    ORDER BY updated_at DESC
    LIMIT 5
  `).all();

  if (failedDocs.length > 0) {
    console.log('\n=== Recent Failed Documents ===\n');
    failedDocs.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.original_filename}`);
      console.log(`   Time: ${new Date(doc.updated_at).toLocaleString()}`);
      console.log(`   Error: ${doc.error_message}`);
      console.log('');
    });
  }

  // Summary statistics
  const stats = db.prepare(`
    SELECT
      status,
      COUNT(*) as count
    FROM client_documents
    GROUP BY status
  `).all();

  console.log('\n=== Overall Statistics ===\n');
  stats.forEach(stat => {
    console.log(`${stat.status}: ${stat.count}`);
  });

} catch (error) {
  console.error('Error reading database:', error.message);
} finally {
  db.close();
}
