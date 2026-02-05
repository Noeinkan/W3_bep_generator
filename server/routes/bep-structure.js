const express = require('express');
const router = express.Router();
const bepStructureService = require('../services/bepStructureService');

// ============================================
// STEP ENDPOINTS (H1)
// ============================================

/**
 * GET /api/bep-structure/steps
 * Get all steps for a project or default template
 */
router.get('/steps', async (req, res, next) => {
  try {
    const { projectId, bepType } = req.query;
    const steps = bepStructureService.getSteps(projectId || null, bepType || null);

    res.json({
      success: true,
      data: steps,
      count: steps.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bep-structure/steps/:id
 * Get a single step with its fields
 */
router.get('/steps/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const step = bepStructureService.getStepWithFields(id);

    if (!step) {
      return res.status(404).json({
        success: false,
        error: 'Step not found'
      });
    }

    res.json({
      success: true,
      data: step
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bep-structure/steps
 * Create a new step
 */
router.post('/steps', async (req, res, next) => {
  try {
    const stepData = req.body;

    if (!stepData.title || !stepData.step_number) {
      return res.status(400).json({
        success: false,
        error: 'title and step_number are required'
      });
    }

    const step = bepStructureService.createStep(stepData);

    res.status(201).json({
      success: true,
      data: step,
      message: 'Step created successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/bep-structure/steps/:id
 * Update a step
 */
router.put('/steps/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const step = bepStructureService.updateStep(id, updates);

    if (!step) {
      return res.status(404).json({
        success: false,
        error: 'Step not found'
      });
    }

    res.json({
      success: true,
      data: step,
      message: 'Step updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/bep-structure/steps/:id
 * Soft delete a step
 */
router.delete('/steps/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    bepStructureService.deleteStep(id);

    res.json({
      success: true,
      message: 'Step deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/bep-structure/steps/reorder
 * Bulk reorder steps
 */
router.put('/steps-reorder', async (req, res, next) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        error: 'orders must be an array of { id, order_index }'
      });
    }

    bepStructureService.reorderSteps(orders);

    res.json({
      success: true,
      message: 'Steps reordered successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/bep-structure/steps/:id/visibility
 * Toggle step visibility
 */
router.put('/steps/:id/visibility', async (req, res, next) => {
  try {
    const { id } = req.params;
    const step = bepStructureService.toggleStepVisibility(id);

    if (!step) {
      return res.status(404).json({
        success: false,
        error: 'Step not found'
      });
    }

    res.json({
      success: true,
      data: step,
      message: 'Step visibility toggled'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// FIELD ENDPOINTS (H2)
// ============================================

/**
 * GET /api/bep-structure/fields
 * Get all fields for a step or project
 */
router.get('/fields', async (req, res, next) => {
  try {
    const { stepId, projectId, bepType } = req.query;

    let fields;
    if (stepId) {
      fields = bepStructureService.getFieldsForStep(stepId, bepType || null);
    } else {
      fields = bepStructureService.getFieldsForProject(projectId || null, bepType || null);
    }

    res.json({
      success: true,
      data: fields,
      count: fields.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bep-structure/fields/:id
 * Get a single field
 */
router.get('/fields/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const field = bepStructureService.getField(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        error: 'Field not found'
      });
    }

    res.json({
      success: true,
      data: field
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bep-structure/fields
 * Create a new field
 */
router.post('/fields', async (req, res, next) => {
  try {
    const fieldData = req.body;

    if (!fieldData.step_id || !fieldData.field_id || !fieldData.label || !fieldData.type) {
      return res.status(400).json({
        success: false,
        error: 'step_id, field_id, label, and type are required'
      });
    }

    const field = bepStructureService.createField(fieldData);

    res.status(201).json({
      success: true,
      data: field,
      message: 'Field created successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/bep-structure/fields/:id
 * Update a field
 */
router.put('/fields/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const field = bepStructureService.updateField(id, updates);

    if (!field) {
      return res.status(404).json({
        success: false,
        error: 'Field not found'
      });
    }

    res.json({
      success: true,
      data: field,
      message: 'Field updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/bep-structure/fields/:id
 * Soft delete a field
 */
router.delete('/fields/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    bepStructureService.deleteField(id);

    res.json({
      success: true,
      message: 'Field deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/bep-structure/fields-reorder
 * Bulk reorder fields within a step
 */
router.put('/fields-reorder', async (req, res, next) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        error: 'orders must be an array of { id, order_index }'
      });
    }

    bepStructureService.reorderFields(orders);

    res.json({
      success: true,
      message: 'Fields reordered successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/bep-structure/fields/:id/visibility
 * Toggle field visibility
 */
router.put('/fields/:id/visibility', async (req, res, next) => {
  try {
    const { id } = req.params;
    const field = bepStructureService.toggleFieldVisibility(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        error: 'Field not found'
      });
    }

    res.json({
      success: true,
      data: field,
      message: 'Field visibility toggled'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/bep-structure/fields/:id/move
 * Move a field to a different step
 */
router.put('/fields/:id/move', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newStepId, newOrderIndex } = req.body;

    if (!newStepId) {
      return res.status(400).json({
        success: false,
        error: 'newStepId is required'
      });
    }

    const field = bepStructureService.moveFieldToStep(id, newStepId, newOrderIndex || 0);

    if (!field) {
      return res.status(404).json({
        success: false,
        error: 'Field not found'
      });
    }

    res.json({
      success: true,
      data: field,
      message: 'Field moved successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// TEMPLATE & UTILITY ENDPOINTS
// ============================================

/**
 * GET /api/bep-structure/template
 * Get the default 14-step template
 */
router.get('/template', async (req, res, next) => {
  try {
    const { bepType } = req.query;
    const template = bepStructureService.getDefaultTemplate(bepType || null);

    res.json({
      success: true,
      data: template,
      count: template.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bep-structure/project/:projectId
 * Get structure for a project (custom if exists, otherwise default)
 */
router.get('/project/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { bepType } = req.query;

    const structure = bepStructureService.getStructureForProject(projectId, bepType || null);
    const hasCustom = bepStructureService.hasCustomStructure(projectId);

    res.json({
      success: true,
      data: structure,
      hasCustomStructure: hasCustom,
      count: structure.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bep-structure/clone-template
 * Clone the default template to a project
 */
router.post('/clone-template', async (req, res, next) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: 'projectId is required'
      });
    }

    // Check if project already has custom structure
    if (bepStructureService.hasCustomStructure(projectId)) {
      return res.status(400).json({
        success: false,
        error: 'Project already has custom structure. Use reset endpoint to start fresh.'
      });
    }

    const structure = bepStructureService.cloneTemplateToProject(projectId);

    res.status(201).json({
      success: true,
      data: structure,
      message: 'Template cloned to project successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bep-structure/reset/:projectId
 * Reset a project to the default template
 */
router.post('/reset/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const structure = bepStructureService.resetProjectToDefault(projectId);

    res.json({
      success: true,
      data: structure,
      message: 'Project reset to default template'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bep-structure/field-types
 * Get available field types for the form builder
 */
router.get('/field-types', async (req, res, next) => {
  try {
    const fieldTypes = bepStructureService.getFieldTypes();

    res.json({
      success: true,
      data: fieldTypes,
      count: fieldTypes.length
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// DRAFT-LEVEL ENDPOINTS
// ============================================

/**
 * GET /api/bep-structure/draft/:draftId
 * Get structure for a draft (custom if exists, otherwise default)
 */
router.get('/draft/:draftId', async (req, res, next) => {
  try {
    const { draftId } = req.params;
    const { bepType } = req.query;

    const structure = bepStructureService.getStructureForDraft(draftId, bepType || null);
    const hasCustom = bepStructureService.hasCustomStructureForDraft(draftId);

    res.json({
      success: true,
      data: structure,
      hasCustomStructure: hasCustom,
      count: structure.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bep-structure/clone-to-draft
 * Clone the default template to a draft
 */
router.post('/clone-to-draft', async (req, res, next) => {
  try {
    const { draftId } = req.body;

    if (!draftId) {
      return res.status(400).json({
        success: false,
        error: 'draftId is required'
      });
    }

    // Check if draft already has custom structure
    if (bepStructureService.hasCustomStructureForDraft(draftId)) {
      return res.status(400).json({
        success: false,
        error: 'Draft already has custom structure. Use reset endpoint to start fresh.'
      });
    }

    const structure = bepStructureService.cloneTemplateToDraft(draftId);

    res.status(201).json({
      success: true,
      data: structure,
      message: 'Template cloned to draft successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bep-structure/reset-draft/:draftId
 * Reset a draft to the default template
 */
router.post('/reset-draft/:draftId', async (req, res, next) => {
  try {
    const { draftId } = req.params;
    const structure = bepStructureService.resetDraftToDefault(draftId);

    res.json({
      success: true,
      data: structure,
      message: 'Draft reset to default template'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * POST /api/bep-structure/seed-defaults
 * Seed the default template from bepConfig.js (admin endpoint)
 * This is called by the seed script
 */
router.post('/seed-defaults', async (req, res, next) => {
  try {
    const { steps, fields } = req.body;

    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({
        success: false,
        error: 'steps array is required'
      });
    }

    // Check if defaults already exist
    const existingSteps = bepStructureService.getSteps(null);
    if (existingSteps.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Default template already exists. Delete existing data first.'
      });
    }

    // Create steps and track ID mappings
    const stepIdMap = {};
    steps.forEach(step => {
      const created = bepStructureService.createStep(step);
      stepIdMap[step.order_index] = created.id;
    });

    // Create fields with correct step IDs
    if (fields && Array.isArray(fields)) {
      fields.forEach(field => {
        const stepId = stepIdMap[field.step_order_index];
        if (stepId) {
          bepStructureService.createField({
            ...field,
            step_id: stepId
          });
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Default template seeded successfully',
      stepsCreated: steps.length,
      fieldsCreated: fields ? fields.length : 0
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
