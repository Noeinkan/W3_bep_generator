const db = require('../database');
const { v4: uuidv4 } = require('uuid');

/**
 * Information Management Activities Matrix Service
 * Handles CRUD operations for IM activities (Matrix 1)
 */

// Get all IM activities for a project
const getIMActivities = (projectId) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM information_management_activities
      WHERE project_id = ?
      ORDER BY display_order ASC, created_at ASC
    `);
    return stmt.all(projectId);
  } catch (error) {
    console.error('Error fetching IM activities:', error);
    throw error;
  }
};

// Get single IM activity
const getIMActivityById = (id) => {
  try {
    const stmt = db.prepare('SELECT * FROM information_management_activities WHERE id = ?');
    return stmt.get(id);
  } catch (error) {
    console.error('Error fetching IM activity:', error);
    throw error;
  }
};

// Create IM activity
const createIMActivity = (activityData) => {
  try {
    const id = activityData.id || uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO information_management_activities (
        id, project_id, activity_name, activity_description,
        appointing_party_role, lead_appointed_party_role,
        appointed_parties_role, third_parties_role,
        notes, iso_reference, activity_phase, display_order,
        is_custom, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      activityData.projectId || activityData.project_id,
      activityData.activityName || activityData.activity_name,
      activityData.activityDescription || activityData.activity_description || '',
      activityData.appointingPartyRole || activityData.appointing_party_role || 'N/A',
      activityData.leadAppointedPartyRole || activityData.lead_appointed_party_role || 'N/A',
      activityData.appointedPartiesRole || activityData.appointed_parties_role || 'N/A',
      activityData.thirdPartiesRole || activityData.third_parties_role || 'N/A',
      activityData.notes || '',
      activityData.isoReference || activityData.iso_reference || '',
      activityData.activityPhase || activityData.activity_phase || '',
      activityData.displayOrder !== undefined ? activityData.displayOrder : 999,
      activityData.isCustom !== undefined ? (activityData.isCustom ? 1 : 0) : 0,
      activityData.createdAt || now,
      activityData.updatedAt || now
    );

    return getIMActivityById(id);
  } catch (error) {
    console.error('Error creating IM activity:', error);
    throw error;
  }
};

// Update IM activity
const updateIMActivity = (id, updates) => {
  try {
    const now = new Date().toISOString();

    const fields = [];
    const values = [];

    if (updates.activityName) {
      fields.push('activity_name = ?');
      values.push(updates.activityName);
    }
    if (updates.activityDescription !== undefined) {
      fields.push('activity_description = ?');
      values.push(updates.activityDescription);
    }
    if (updates.appointingPartyRole !== undefined) {
      fields.push('appointing_party_role = ?');
      values.push(updates.appointingPartyRole);
    }
    if (updates.leadAppointedPartyRole !== undefined) {
      fields.push('lead_appointed_party_role = ?');
      values.push(updates.leadAppointedPartyRole);
    }
    if (updates.appointedPartiesRole !== undefined) {
      fields.push('appointed_parties_role = ?');
      values.push(updates.appointedPartiesRole);
    }
    if (updates.thirdPartiesRole !== undefined) {
      fields.push('third_parties_role = ?');
      values.push(updates.thirdPartiesRole);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }
    if (updates.displayOrder !== undefined) {
      fields.push('display_order = ?');
      values.push(updates.displayOrder);
    }

    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);

    const stmt = db.prepare(`
      UPDATE information_management_activities
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);
    return getIMActivityById(id);
  } catch (error) {
    console.error('Error updating IM activity:', error);
    throw error;
  }
};

// Delete IM activity
const deleteIMActivity = (id) => {
  try {
    const stmt = db.prepare('DELETE FROM information_management_activities WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting IM activity:', error);
    throw error;
  }
};

// Bulk create IM activities (for initialization)
const bulkCreateIMActivities = (activitiesArray) => {
  try {
    const insert = db.transaction((activities) => {
      for (const activity of activities) {
        createIMActivity(activity);
      }
    });

    insert(activitiesArray);
    return activitiesArray.length;
  } catch (error) {
    console.error('Error bulk creating IM activities:', error);
    throw error;
  }
};

/**
 * Information Deliverables Matrix Service
 * Handles CRUD operations for information deliverables (Matrix 2)
 */

// Get all deliverables for a project
const getDeliverables = (projectId, filters = {}) => {
  try {
    let query = 'SELECT * FROM information_deliverables WHERE project_id = ?';
    const params = [projectId];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.responsibleTaskTeam) {
      query += ' AND responsible_task_team = ?';
      params.push(filters.responsibleTaskTeam);
    }

    if (filters.exchangeStage) {
      query += ' AND exchange_stage = ?';
      params.push(filters.exchangeStage);
    }

    query += ' ORDER BY due_date ASC, deliverable_name ASC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
  } catch (error) {
    console.error('Error fetching deliverables:', error);
    throw error;
  }
};

// Get single deliverable
const getDeliverableById = (id) => {
  try {
    const stmt = db.prepare('SELECT * FROM information_deliverables WHERE id = ?');
    const deliverable = stmt.get(id);

    // Parse JSON fields
    if (deliverable && deliverable.dependencies) {
      try {
        deliverable.dependencies = JSON.parse(deliverable.dependencies);
      } catch (e) {
        deliverable.dependencies = [];
      }
    }

    return deliverable;
  } catch (error) {
    console.error('Error fetching deliverable:', error);
    throw error;
  }
};

// Create deliverable
const createDeliverable = (deliverableData) => {
  try {
    const id = deliverableData.id || uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO information_deliverables (
        id, project_id, deliverable_name, description,
        responsible_task_team, accountable_party,
        exchange_stage, due_date, format, loin_lod,
        dependencies, tidp_id, tidp_container_id,
        status, is_auto_populated, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const dependencies = deliverableData.dependencies
      ? JSON.stringify(deliverableData.dependencies)
      : JSON.stringify([]);

    stmt.run(
      id,
      deliverableData.projectId || deliverableData.project_id,
      deliverableData.deliverableName || deliverableData.deliverable_name,
      deliverableData.description || '',
      deliverableData.responsibleTaskTeam || deliverableData.responsible_task_team || '',
      deliverableData.accountableParty || deliverableData.accountable_party || '',
      deliverableData.exchangeStage || deliverableData.exchange_stage || '',
      deliverableData.dueDate || deliverableData.due_date || '',
      deliverableData.format || '',
      deliverableData.loinLod || deliverableData.loin_lod || '',
      dependencies,
      deliverableData.tidpId || deliverableData.tidp_id || null,
      deliverableData.tidpContainerId || deliverableData.tidp_container_id || null,
      deliverableData.status || 'Planned',
      deliverableData.isAutoPopulated !== undefined ? (deliverableData.isAutoPopulated ? 1 : 0) : 0,
      deliverableData.createdAt || now,
      deliverableData.updatedAt || now
    );

    return getDeliverableById(id);
  } catch (error) {
    console.error('Error creating deliverable:', error);
    throw error;
  }
};

// Update deliverable
const updateDeliverable = (id, updates) => {
  try {
    const now = new Date().toISOString();

    const fields = [];
    const values = [];

    if (updates.deliverableName) {
      fields.push('deliverable_name = ?');
      values.push(updates.deliverableName);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.responsibleTaskTeam !== undefined) {
      fields.push('responsible_task_team = ?');
      values.push(updates.responsibleTaskTeam);
    }
    if (updates.accountableParty !== undefined) {
      fields.push('accountable_party = ?');
      values.push(updates.accountableParty);
    }
    if (updates.exchangeStage !== undefined) {
      fields.push('exchange_stage = ?');
      values.push(updates.exchangeStage);
    }
    if (updates.dueDate !== undefined) {
      fields.push('due_date = ?');
      values.push(updates.dueDate);
    }
    if (updates.format !== undefined) {
      fields.push('format = ?');
      values.push(updates.format);
    }
    if (updates.loinLod !== undefined) {
      fields.push('loin_lod = ?');
      values.push(updates.loinLod);
    }
    if (updates.dependencies !== undefined) {
      fields.push('dependencies = ?');
      values.push(JSON.stringify(updates.dependencies));
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.isAutoPopulated !== undefined) {
      fields.push('is_auto_populated = ?');
      values.push(updates.isAutoPopulated ? 1 : 0);
    }

    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);

    const stmt = db.prepare(`
      UPDATE information_deliverables
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);
    return getDeliverableById(id);
  } catch (error) {
    console.error('Error updating deliverable:', error);
    throw error;
  }
};

// Delete deliverable
const deleteDeliverable = (id) => {
  try {
    const stmt = db.prepare('DELETE FROM information_deliverables WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting deliverable:', error);
    throw error;
  }
};

// Get deliverables grouped by stage
const getDeliverablesGroupedByStage = (projectId) => {
  try {
    const deliverables = getDeliverables(projectId);
    const grouped = {};

    deliverables.forEach(deliverable => {
      const stage = deliverable.exchange_stage || 'Unassigned';
      if (!grouped[stage]) {
        grouped[stage] = [];
      }
      grouped[stage].push(deliverable);
    });

    return grouped;
  } catch (error) {
    console.error('Error grouping deliverables by stage:', error);
    throw error;
  }
};

// Get deliverables for a specific TIDP
const getDeliverablesByTIDP = (tidpId) => {
  try {
    const stmt = db.prepare('SELECT * FROM information_deliverables WHERE tidp_id = ?');
    return stmt.all(tidpId);
  } catch (error) {
    console.error('Error fetching deliverables by TIDP:', error);
    throw error;
  }
};

module.exports = {
  // IM Activities (Matrix 1)
  getIMActivities,
  getIMActivityById,
  createIMActivity,
  updateIMActivity,
  deleteIMActivity,
  bulkCreateIMActivities,

  // Information Deliverables (Matrix 2)
  getDeliverables,
  getDeliverableById,
  createDeliverable,
  updateDeliverable,
  deleteDeliverable,
  getDeliverablesGroupedByStage,
  getDeliverablesByTIDP
};
