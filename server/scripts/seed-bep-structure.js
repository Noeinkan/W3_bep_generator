/**
 * Seed Script: Populate BEP Structure Tables from CONFIG
 *
 * Builds the default template from src/config/bepFormFields.js and bepSteps.js
 * (via loadBepConfig + bepStructureService.getDefaultTemplateFromConfig) and
 * inserts steps and fields into the DB. Use for backfilling or refreshing the
 * DB default template. The app no longer reads the default template from DB;
 * GET /template and clone/reset use CONFIG. This script is for environments
 * that still expect default template rows in DB.
 *
 * Usage: node server/scripts/seed-bep-structure.js [--force]
 */

const db = require('../database');
const bepStructureService = require('../services/bepStructureService');
const { loadBepConfigAsync } = require('../services/loadBepConfig');

async function seedBepStructure() {
  const forceMode = process.argv.includes('--force');

  const existingSteps = db.prepare('SELECT COUNT(*) as count FROM bep_step_configs WHERE project_id IS NULL AND draft_id IS NULL').get();
  if (existingSteps.count > 0) {
    if (forceMode) {
      console.log('Force mode: Clearing existing default template data...');
      db.prepare('DELETE FROM bep_field_configs WHERE project_id IS NULL AND draft_id IS NULL').run();
      db.prepare('DELETE FROM bep_step_configs WHERE project_id IS NULL AND draft_id IS NULL').run();
      console.log('Existing default template data cleared.');
    } else {
      console.log('Default template already exists. Use --force to overwrite.');
      console.log(`Found ${existingSteps.count} existing steps.`);
      return;
    }
  }

  console.log('Loading BEP config (bepFormFields.js + bepSteps.js)...');
  const configResult = await loadBepConfigAsync();
  if (!configResult.success) {
    console.error('Could not load CONFIG:', configResult.config ? 'missing steps/getFormFields' : 'load failed');
    throw new Error('BEP config load failed. Ensure src/config/bepConfig.js and dependencies exist.');
  }
  console.log('Seeding BEP structure from CONFIG...');

  let templatePre;
  let templatePost;
  try {
    templatePre = bepStructureService.getDefaultTemplateFromConfig('pre-appointment');
    templatePost = bepStructureService.getDefaultTemplateFromConfig('post-appointment');
  } catch (err) {
    console.error('Could not build template from CONFIG:', err.message);
    throw err;
  }

  const stepIds = [];
  const transaction = db.transaction(() => {
    // Create 14 steps (no project_id, no draft_id)
    templatePost.forEach((step, index) => {
      const newStep = bepStructureService.createStep({
        project_id: null,
        draft_id: null,
        step_number: step.step_number,
        title: step.title,
        description: step.description,
        category: step.category,
        order_index: step.order_index,
        is_visible: step.is_visible,
        icon: step.icon,
        bep_type: 'both'
      });
      stepIds.push(newStep.id);
      console.log(`  Created step ${step.step_number}: ${step.title}`);
    });

    // Insert fields: steps 0–2 get both pre and post; steps 3–13 get shared
    for (let stepIndex = 0; stepIndex < stepIds.length; stepIndex++) {
      const stepId = stepIds[stepIndex];
      if (stepIndex <= 2) {
        const preFields = templatePre[stepIndex].fields || [];
        const postFields = templatePost[stepIndex].fields || [];
        preFields.forEach((f, fi) => {
          bepStructureService.createField({
            project_id: null,
            draft_id: null,
            step_id: stepId,
            field_id: f.field_id,
            label: f.label,
            type: f.type,
            number: f.number,
            order_index: fi,
            is_visible: f.is_visible,
            is_required: f.is_required,
            placeholder: f.placeholder,
            config: f.config,
            bep_type: 'pre-appointment'
          });
        });
        postFields.forEach((f, fi) => {
          bepStructureService.createField({
            project_id: null,
            draft_id: null,
            step_id: stepId,
            field_id: f.field_id,
            label: f.label,
            type: f.type,
            number: f.number,
            order_index: preFields.length + fi,
            is_visible: f.is_visible,
            is_required: f.is_required,
            placeholder: f.placeholder,
            config: f.config,
            bep_type: 'post-appointment'
          });
        });
        console.log(`    Step ${stepIndex}: ${preFields.length} pre-appointment + ${postFields.length} post-appointment fields`);
      } else {
        const fields = templatePost[stepIndex].fields || [];
        fields.forEach((f, fi) => {
          bepStructureService.createField({
            project_id: null,
            draft_id: null,
            step_id: stepId,
            field_id: f.field_id,
            label: f.label,
            type: f.type,
            number: f.number,
            order_index: fi,
            is_visible: f.is_visible,
            is_required: f.is_required,
            placeholder: f.placeholder,
            config: f.config,
            bep_type: 'shared'
          });
        });
        console.log(`    Step ${stepIndex}: ${fields.length} shared fields`);
      }
    }
  });

  try {
    transaction();
    console.log('\nBEP structure seeding completed successfully!');
    const stepCount = db.prepare('SELECT COUNT(*) as count FROM bep_step_configs WHERE project_id IS NULL AND draft_id IS NULL').get();
    const fieldCount = db.prepare('SELECT COUNT(*) as count FROM bep_field_configs WHERE project_id IS NULL AND draft_id IS NULL').get();
    console.log(`\nSummary: Steps: ${stepCount.count}, Fields: ${fieldCount.count}`);
  } catch (error) {
    console.error('Error seeding BEP structure:', error);
    throw error;
  }
}

seedBepStructure().catch((err) => {
  console.error(err);
  process.exit(1);
});
