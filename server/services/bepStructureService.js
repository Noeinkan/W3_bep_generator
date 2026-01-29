const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

const parseConfigSafe = (configValue, context = {}) => {
  if (!configValue) return null;
  try {
    return JSON.parse(configValue);
  } catch (error) {
    console.warn('Invalid field config JSON, using null.', {
      error: error.message,
      ...context
    });
    return null;
  }
};

class BepStructureService {
  constructor() {
    // SQLite database for persistent storage
  }

  // ============================================
  // STEP OPERATIONS (H1)
  // ============================================

  /**
   * Get all steps for a project (or default template if no projectId)
   * @param {string|null} projectId - Project ID or null for default template
   * @param {string|null} bepType - Filter by BEP type ('pre-appointment', 'post-appointment', 'both')
   * @returns {Array} List of steps ordered by order_index
   */
  getSteps(projectId = null, bepType = null) {
    let query = `
      SELECT * FROM bep_step_configs
      WHERE is_deleted = 0 AND project_id ${projectId ? '= ?' : 'IS NULL'}
    `;
    const params = projectId ? [projectId] : [];

    if (bepType) {
      query += ` AND (bep_type = ? OR bep_type = 'both')`;
      params.push(bepType);
    }

    query += ` ORDER BY order_index ASC`;

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Get a single step by ID with its fields
   * @param {string} stepId - Step ID
   * @returns {Object|null} Step with nested fields array
   */
  getStepWithFields(stepId) {
    const stepStmt = db.prepare(`
      SELECT * FROM bep_step_configs WHERE id = ? AND is_deleted = 0
    `);
    const step = stepStmt.get(stepId);

    if (!step) return null;

    const fieldsStmt = db.prepare(`
      SELECT * FROM bep_field_configs
      WHERE step_id = ? AND is_deleted = 0
      ORDER BY order_index ASC
    `);
    const fields = fieldsStmt.all(stepId);

    // Parse JSON config for each field
    step.fields = fields.map(f => ({
      ...f,
      config: parseConfigSafe(f.config, { fieldId: f.id, stepId })
    }));

    return step;
  }

  /**
   * Create a new step
   * @param {Object} stepData - Step data
   * @returns {Object} Created step
   */
  createStep(stepData) {
    const now = new Date().toISOString();
    const step = {
      id: uuidv4(),
      project_id: stepData.project_id || null,
      step_number: stepData.step_number,
      title: stepData.title,
      description: stepData.description || null,
      category: stepData.category || 'Management',
      order_index: stepData.order_index,
      is_visible: stepData.is_visible !== undefined ? stepData.is_visible : 1,
      icon: stepData.icon || null,
      bep_type: stepData.bep_type || 'both',
      created_at: now,
      updated_at: now,
      is_deleted: 0
    };

    const stmt = db.prepare(`
      INSERT INTO bep_step_configs
      (id, project_id, step_number, title, description, category, order_index, is_visible, icon, bep_type, created_at, updated_at, is_deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      step.id,
      step.project_id,
      step.step_number,
      step.title,
      step.description,
      step.category,
      step.order_index,
      step.is_visible,
      step.icon,
      step.bep_type,
      step.created_at,
      step.updated_at,
      step.is_deleted
    );

    return step;
  }

  /**
   * Update a step
   * @param {string} stepId - Step ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated step
   */
  updateStep(stepId, updates) {
    const now = new Date().toISOString();
    const allowedFields = ['step_number', 'title', 'description', 'category', 'order_index', 'is_visible', 'icon', 'bep_type'];

    const setClause = [];
    const params = [];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        setClause.push(`${field} = ?`);
        params.push(updates[field]);
      }
    });

    if (setClause.length === 0) return this.getStepWithFields(stepId);

    setClause.push('updated_at = ?');
    params.push(now);
    params.push(stepId);

    const stmt = db.prepare(`
      UPDATE bep_step_configs SET ${setClause.join(', ')} WHERE id = ? AND is_deleted = 0
    `);
    stmt.run(...params);

    return this.getStepWithFields(stepId);
  }

  /**
   * Soft delete a step (and cascade to fields)
   * @param {string} stepId - Step ID
   * @returns {boolean} Success
   */
  deleteStep(stepId) {
    const now = new Date().toISOString();

    // Soft delete the step
    const stepStmt = db.prepare(`
      UPDATE bep_step_configs SET is_deleted = 1, updated_at = ? WHERE id = ?
    `);
    stepStmt.run(now, stepId);

    // Soft delete all fields in this step
    const fieldsStmt = db.prepare(`
      UPDATE bep_field_configs SET is_deleted = 1, updated_at = ? WHERE step_id = ?
    `);
    fieldsStmt.run(now, stepId);

    return true;
  }

  /**
   * Reorder steps
   * @param {Array} stepOrders - Array of { id, order_index }
   * @returns {boolean} Success
   */
  reorderSteps(stepOrders) {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE bep_step_configs SET order_index = ?, updated_at = ? WHERE id = ?
    `);

    const transaction = db.transaction((orders) => {
      orders.forEach(({ id, order_index }) => {
        stmt.run(order_index, now, id);
      });
    });

    transaction(stepOrders);
    return true;
  }

  /**
   * Toggle step visibility
   * @param {string} stepId - Step ID
   * @returns {Object|null} Updated step
   */
  toggleStepVisibility(stepId) {
    const step = db.prepare(`SELECT is_visible FROM bep_step_configs WHERE id = ?`).get(stepId);
    if (!step) return null;

    const newVisibility = step.is_visible ? 0 : 1;
    return this.updateStep(stepId, { is_visible: newVisibility });
  }

  // ============================================
  // FIELD OPERATIONS (H2)
  // ============================================

  /**
   * Get all fields for a step
   * @param {string} stepId - Step ID
   * @param {string|null} bepType - Filter by BEP type
   * @returns {Array} List of fields ordered by order_index
   */
  getFieldsForStep(stepId, bepType = null) {
    let query = `
      SELECT * FROM bep_field_configs
      WHERE step_id = ? AND is_deleted = 0
    `;
    const params = [stepId];

    if (bepType) {
      query += ` AND (bep_type = ? OR bep_type = 'shared')`;
      params.push(bepType);
    }

    query += ` ORDER BY order_index ASC`;

    const stmt = db.prepare(query);
    const fields = stmt.all(...params);

    // Parse JSON config for each field
    return fields.map(f => ({
      ...f,
      config: parseConfigSafe(f.config, { fieldId: f.id, stepId })
    }));
  }

  /**
   * Get fields for a project (all steps)
   * @param {string|null} projectId - Project ID or null for default template
   * @param {string|null} bepType - Filter by BEP type
   * @returns {Array} List of fields with step info
   */
  getFieldsForProject(projectId = null, bepType = null) {
    let query = `
      SELECT f.*, s.title as step_title, s.step_number
      FROM bep_field_configs f
      JOIN bep_step_configs s ON f.step_id = s.id
      WHERE f.is_deleted = 0 AND s.is_deleted = 0
      AND f.project_id ${projectId ? '= ?' : 'IS NULL'}
    `;
    const params = projectId ? [projectId] : [];

    if (bepType) {
      query += ` AND (f.bep_type = ? OR f.bep_type = 'shared')`;
      params.push(bepType);
    }

    query += ` ORDER BY s.order_index ASC, f.order_index ASC`;

    const stmt = db.prepare(query);
    const fields = stmt.all(...params);

    return fields.map(f => ({
      ...f,
      config: parseConfigSafe(f.config, { fieldId: f.id, projectId })
    }));
  }

  /**
   * Get a single field by ID
   * @param {string} fieldId - Field ID
   * @returns {Object|null} Field config
   */
  getField(fieldId) {
    const stmt = db.prepare(`
      SELECT * FROM bep_field_configs WHERE id = ? AND is_deleted = 0
    `);
    const field = stmt.get(fieldId);

    if (!field) return null;

    return {
      ...field,
      config: parseConfigSafe(field.config, { fieldId })
    };
  }

  /**
   * Create a new field
   * @param {Object} fieldData - Field data
   * @returns {Object} Created field
   */
  createField(fieldData) {
    const now = new Date().toISOString();
    const field = {
      id: uuidv4(),
      project_id: fieldData.project_id || null,
      step_id: fieldData.step_id,
      field_id: fieldData.field_id,
      label: fieldData.label,
      type: fieldData.type,
      number: fieldData.number || null,
      order_index: fieldData.order_index,
      is_visible: fieldData.is_visible !== undefined ? fieldData.is_visible : 1,
      is_required: fieldData.is_required !== undefined ? fieldData.is_required : 0,
      placeholder: fieldData.placeholder || null,
      help_text: fieldData.help_text || null,
      config: fieldData.config ? JSON.stringify(fieldData.config) : null,
      default_value: fieldData.default_value || null,
      bep_type: fieldData.bep_type || 'shared',
      created_at: now,
      updated_at: now,
      is_deleted: 0
    };

    const stmt = db.prepare(`
      INSERT INTO bep_field_configs
      (id, project_id, step_id, field_id, label, type, number, order_index, is_visible, is_required, placeholder, help_text, config, default_value, bep_type, created_at, updated_at, is_deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      field.id,
      field.project_id,
      field.step_id,
      field.field_id,
      field.label,
      field.type,
      field.number,
      field.order_index,
      field.is_visible,
      field.is_required,
      field.placeholder,
      field.help_text,
      field.config,
      field.default_value,
      field.bep_type,
      field.created_at,
      field.updated_at,
      field.is_deleted
    );

    return {
      ...field,
      config: fieldData.config || null
    };
  }

  /**
   * Update a field
   * @param {string} fieldId - Field ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated field
   */
  updateField(fieldId, updates) {
    const now = new Date().toISOString();
    const allowedFields = ['field_id', 'label', 'type', 'number', 'order_index', 'is_visible', 'is_required', 'placeholder', 'help_text', 'config', 'default_value', 'bep_type'];

    const setClause = [];
    const params = [];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        if (field === 'config') {
          setClause.push(`${field} = ?`);
          params.push(updates[field] ? JSON.stringify(updates[field]) : null);
        } else {
          setClause.push(`${field} = ?`);
          params.push(updates[field]);
        }
      }
    });

    if (setClause.length === 0) return this.getField(fieldId);

    setClause.push('updated_at = ?');
    params.push(now);
    params.push(fieldId);

    const stmt = db.prepare(`
      UPDATE bep_field_configs SET ${setClause.join(', ')} WHERE id = ? AND is_deleted = 0
    `);
    stmt.run(...params);

    return this.getField(fieldId);
  }

  /**
   * Soft delete a field
   * @param {string} fieldId - Field ID
   * @returns {boolean} Success
   */
  deleteField(fieldId) {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE bep_field_configs SET is_deleted = 1, updated_at = ? WHERE id = ?
    `);
    stmt.run(now, fieldId);
    return true;
  }

  /**
   * Reorder fields within a step
   * @param {Array} fieldOrders - Array of { id, order_index }
   * @returns {boolean} Success
   */
  reorderFields(fieldOrders) {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE bep_field_configs SET order_index = ?, updated_at = ? WHERE id = ?
    `);

    const transaction = db.transaction((orders) => {
      orders.forEach(({ id, order_index }) => {
        stmt.run(order_index, now, id);
      });
    });

    transaction(fieldOrders);
    return true;
  }

  /**
   * Toggle field visibility
   * @param {string} fieldId - Field ID
   * @returns {Object|null} Updated field
   */
  toggleFieldVisibility(fieldId) {
    const field = db.prepare(`SELECT is_visible FROM bep_field_configs WHERE id = ?`).get(fieldId);
    if (!field) return null;

    const newVisibility = field.is_visible ? 0 : 1;
    return this.updateField(fieldId, { is_visible: newVisibility });
  }

  /**
   * Move a field to a different step
   * @param {string} fieldId - Field ID
   * @param {string} newStepId - New step ID
   * @param {number} newOrderIndex - New order index in the target step
   * @returns {Object|null} Updated field
   */
  moveFieldToStep(fieldId, newStepId, newOrderIndex) {
    return this.updateField(fieldId, { step_id: newStepId, order_index: newOrderIndex });
  }

  // ============================================
  // TEMPLATE OPERATIONS
  // ============================================

  /**
   * Get the default template (steps and fields where project_id IS NULL)
   * @param {string|null} bepType - Filter by BEP type
   * @returns {Object} Template with steps and nested fields
   */
  getDefaultTemplate(bepType = null) {
    const steps = this.getSteps(null, bepType);

    return steps.map(step => ({
      ...step,
      fields: this.getFieldsForStep(step.id, bepType)
    }));
  }

  /**
   * Clone the default template to a project
   * @param {string} projectId - Project ID to clone to
   * @returns {Object} Cloned structure
   */
  cloneTemplateToProject(projectId) {
    const template = this.getDefaultTemplate();
    const stepIdMap = {}; // Maps old step IDs to new step IDs

    const transaction = db.transaction(() => {
      // Clone steps
      template.forEach(step => {
        const newStep = this.createStep({
          ...step,
          project_id: projectId
        });
        stepIdMap[step.id] = newStep.id;

        // Clone fields for this step
        step.fields.forEach(field => {
          this.createField({
            ...field,
            project_id: projectId,
            step_id: newStep.id,
            config: field.config // Already parsed
          });
        });
      });
    });

    transaction();

    return this.getSteps(projectId);
  }

  /**
   * Reset a project to the default template (delete custom and re-clone)
   * @param {string} projectId - Project ID to reset
   * @returns {Object} New structure
   */
  resetProjectToDefault(projectId) {
    const now = new Date().toISOString();

    const transaction = db.transaction(() => {
      // Hard delete all project-specific steps (which cascades to fields via FK)
      db.prepare(`DELETE FROM bep_field_configs WHERE project_id = ?`).run(projectId);
      db.prepare(`DELETE FROM bep_step_configs WHERE project_id = ?`).run(projectId);
    });

    transaction();

    // Clone fresh template
    return this.cloneTemplateToProject(projectId);
  }

  /**
   * Check if a project has custom structure
   * @param {string} projectId - Project ID
   * @returns {boolean} True if project has custom structure
   */
  hasCustomStructure(projectId) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM bep_step_configs WHERE project_id = ? AND is_deleted = 0
    `);
    const result = stmt.get(projectId);
    return result.count > 0;
  }

  /**
   * Get structure for a project (uses project-specific if exists, otherwise default)
   * @param {string} projectId - Project ID
   * @param {string|null} bepType - Filter by BEP type
   * @returns {Array} Steps with nested fields
   */
  getStructureForProject(projectId, bepType = null) {
    if (this.hasCustomStructure(projectId)) {
      const steps = this.getSteps(projectId, bepType);
      return steps.map(step => ({
        ...step,
        fields: this.getFieldsForStep(step.id, bepType)
      }));
    }
    return this.getDefaultTemplate(bepType);
  }

  // ============================================
  // FIELD TYPES
  // ============================================

  /**
   * Get available field types for the form builder
   * @returns {Array} List of field type definitions
   */
  getFieldTypes() {
    return [
      // Basic
      { type: 'text', label: 'Text Input', category: 'basic', icon: 'Type', hasPlaceholder: true },
      { type: 'textarea', label: 'Rich Text', category: 'basic', icon: 'AlignLeft', hasPlaceholder: true },
      { type: 'select', label: 'Dropdown', category: 'basic', icon: 'ChevronDown', hasOptions: true },
      { type: 'checkbox', label: 'Checkbox Group', category: 'basic', icon: 'CheckSquare', hasOptions: true },

      // Tables
      { type: 'table', label: 'Table', category: 'table', icon: 'Table', hasColumns: true },
      { type: 'introTable', label: 'Text + Table', category: 'table', icon: 'FileText', hasColumns: true },
      { type: 'standardsTable', label: 'Standards Table', category: 'table', icon: 'BookOpen' },
      { type: 'milestones-table', label: 'Milestones Table', category: 'table', icon: 'Calendar' },

      // Specialized
      { type: 'naming-conventions', label: 'Naming Conventions', category: 'specialized', icon: 'FileSignature' },
      { type: 'federation-strategy', label: 'Federation Strategy', category: 'specialized', icon: 'GitMerge' },
      { type: 'timeline', label: 'Timeline', category: 'specialized', icon: 'Calendar' },
      { type: 'budget', label: 'Budget', category: 'specialized', icon: 'DollarSign' },
      { type: 'tidp-reference', label: 'TIDP Reference', category: 'specialized', icon: 'Link' },
      { type: 'deliverables-matrix', label: 'Deliverables Matrix', category: 'specialized', icon: 'Grid' },
      { type: 'im-activities-matrix', label: 'IM Activities Matrix', category: 'specialized', icon: 'Grid' },

      // Diagrams
      { type: 'cdeDiagram', label: 'CDE Diagram', category: 'diagram', icon: 'Network' },
      { type: 'orgchart', label: 'Org Chart', category: 'diagram', icon: 'Users' },
      { type: 'orgstructure-data-table', label: 'Org Data Table', category: 'diagram', icon: 'Table' },
      { type: 'fileStructure', label: 'Folder Structure', category: 'diagram', icon: 'Folder' },
      { type: 'mindmap', label: 'Mindmap', category: 'diagram', icon: 'Share2' },

      // Utility
      { type: 'section-header', label: 'Section Header', category: 'utility', icon: 'Heading', isFormField: false }
    ];
  }
}

module.exports = new BepStructureService();
