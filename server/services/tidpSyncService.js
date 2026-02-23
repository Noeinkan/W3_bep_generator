const db = require('../database');
const { v4: uuidv4 } = require('uuid');
const {
  createDeliverable,
  updateDeliverable,
  getDeliverablesByTIDP,
  deleteDeliverable
} = require('./responsibilityMatrixService');

/**
 * TIDP Synchronization Service
 * Handles automatic population of Information Deliverables Matrix from TIDPs
 */

/**
 * Sync all TIDPs for a project to Information Deliverables Matrix
 * @param {string} projectId - Project ID
 * @param {object} options - Sync options
 * @returns {object} Sync results summary
 */
const syncTIDPsToDeliverables = async (projectId, options = {}) => {
  const {
    overwriteManual = false, // If true, overwrite manually edited deliverables
    tidpIds = null // If provided, only sync specific TIDPs
  } = options;

  try {
    // Get all TIDPs for the project
    let tidpsQuery = 'SELECT * FROM tidps WHERE projectId = ?';
    const tidpsParams = [projectId];

    if (tidpIds && tidpIds.length > 0) {
      const placeholders = tidpIds.map(() => '?').join(',');
      tidpsQuery += ` AND id IN (${placeholders})`;
      tidpsParams.push(...tidpIds);
    }

    const tidpsStmt = db.prepare(tidpsQuery);
    const tidps = tidpsStmt.all(...tidpsParams);

    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      deleted: 0,
      errors: []
    };

    for (const tidp of tidps) {
      try {
        // Get containers for this TIDP
        const containersStmt = db.prepare('SELECT * FROM containers WHERE tidp_id = ?');
        const containers = containersStmt.all(tidp.id);

        // Get existing deliverables for this TIDP
        const existingDeliverables = getDeliverablesByTIDP(tidp.id);
        const existingByContainerId = {};
        existingDeliverables.forEach(d => {
          if (d.tidp_container_id) {
            existingByContainerId[d.tidp_container_id] = d;
          }
        });

        const processedContainerIds = new Set();

        // Process each container
        for (const container of containers) {
          processedContainerIds.add(container.id);

          const existing = existingByContainerId[container.id];

          if (existing) {
            // Deliverable exists - check if we should update
            if (existing.is_auto_populated === 1 || overwriteManual) {
              // Update existing deliverable
              const updates = mapContainerToDeliverableUpdates(container, tidp);
              updateDeliverable(existing.id, updates);
              results.updated++;
            } else {
              // Skip manually edited deliverable
              results.skipped++;
            }
          } else {
            // Create new deliverable
            const deliverableData = mapContainerToDeliverable(container, tidp, projectId);
            createDeliverable(deliverableData);
            results.created++;
          }
        }

        // Delete deliverables for containers that no longer exist (if auto-populated)
        for (const [containerId, deliverable] of Object.entries(existingByContainerId)) {
          if (!processedContainerIds.has(containerId) && deliverable.is_auto_populated === 1) {
            deleteDeliverable(deliverable.id);
            results.deleted++;
          }
        }
      } catch (error) {
        results.errors.push({
          tidpId: tidp.id,
          tidpName: tidp.teamName,
          error: error.message
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error syncing TIDPs to deliverables:', error);
    throw error;
  }
};

/**
 * Sync a single TIDP to deliverables
 * @param {string} tidpId - TIDP ID
 * @param {string} projectId - Project ID
 * @param {object} options - Sync options
 * @returns {object} Sync results
 */
const syncSingleTIDP = async (tidpId, projectId, options = {}) => {
  return syncTIDPsToDeliverables(projectId, {
    ...options,
    tidpIds: [tidpId]
  });
};

/**
 * Map container to deliverable data (for creation)
 */
const mapContainerToDeliverable = (container, tidp, projectId) => {
  // Parse dependencies if stored as JSON string
  let dependencies = [];
  if (container.dependencies) {
    try {
      dependencies = typeof container.dependencies === 'string'
        ? JSON.parse(container.dependencies)
        : container.dependencies;
    } catch (e) {
      dependencies = [];
    }
  }

  return {
    id: uuidv4(),
    projectId: projectId,
    deliverableName: container.container_name || container.information_container_id || 'Unnamed Deliverable',
    description: container.description || '',
    responsibleTaskTeam: container.responsible_party || tidp.teamName || '',
    accountableParty: tidp.leader || '',
    exchangeStage: container.delivery_milestone || '',
    dueDate: container.due_date || '',
    format: container.format_type || '',
    loinLod: container.loin || '',
    dependencies: dependencies,
    tidpId: tidp.id,
    tidpContainerId: container.id,
    status: mapContainerStatus(container.status),
    isAutoPopulated: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Map container to deliverable updates (for updating existing)
 */
const mapContainerToDeliverableUpdates = (container, tidp) => {
  // Parse dependencies if stored as JSON string
  let dependencies = [];
  if (container.dependencies) {
    try {
      dependencies = typeof container.dependencies === 'string'
        ? JSON.parse(container.dependencies)
        : container.dependencies;
    } catch (e) {
      dependencies = [];
    }
  }

  return {
    deliverableName: container.container_name || container.information_container_id || 'Unnamed Deliverable',
    description: container.description || '',
    responsibleTaskTeam: container.responsible_party || tidp.teamName || '',
    accountableParty: tidp.leader || '',
    exchangeStage: container.delivery_milestone || '',
    dueDate: container.due_date || '',
    format: container.format_type || '',
    loinLod: container.loin || '',
    dependencies: dependencies,
    status: mapContainerStatus(container.status)
  };
};

/**
 * Map container status to deliverable status
 */
const mapContainerStatus = (containerStatus) => {
  if (!containerStatus) return 'Planned';

  const statusMap = {
    'Not Started': 'Planned',
    'In Progress': 'In Progress',
    'In Review': 'In Progress',
    'Complete': 'Delivered',
    'Approved': 'Approved',
    'On Hold': 'Planned'
  };

  return statusMap[containerStatus] || 'Planned';
};

/**
 * Get sync status for a project
 * Shows which TIDPs are synced, which have changes, etc.
 */
const getSyncStatus = (projectId) => {
  try {
    // Get all TIDPs
    const tidpsStmt = db.prepare('SELECT * FROM tidps WHERE projectId = ?');
    const tidps = tidpsStmt.all(projectId);

    const status = {
      totalTIDPs: tidps.length,
      syncedTIDPs: 0,
      unsyncedTIDPs: 0,
      tidpDetails: []
    };

    for (const tidp of tidps) {
      // Get containers count
      const containersStmt = db.prepare('SELECT COUNT(*) as count FROM containers WHERE tidp_id = ?');
      const containersResult = containersStmt.get(tidp.id);
      const containersCount = containersResult.count;

      // Get synced deliverables count
      const deliverablesStmt = db.prepare(
        'SELECT COUNT(*) as count FROM information_deliverables WHERE tidp_id = ? AND is_auto_populated = 1'
      );
      const deliverablesResult = deliverablesStmt.get(tidp.id);
      const syncedCount = deliverablesResult.count;

      const isSynced = syncedCount === containersCount && containersCount > 0;

      if (isSynced) {
        status.syncedTIDPs++;
      } else {
        status.unsyncedTIDPs++;
      }

      status.tidpDetails.push({
        tidpId: tidp.id,
        tidpName: tidp.teamName,
        containersCount,
        syncedDeliverablesCount: syncedCount,
        isSynced,
        needsSync: containersCount !== syncedCount
      });
    }

    return status;
  } catch (error) {
    console.error('Error getting sync status:', error);
    throw error;
  }
};

/**
 * Remove sync for a TIDP (delete auto-populated deliverables)
 */
const unsyncTIDP = (tidpId) => {
  try {
    const stmt = db.prepare(
      'DELETE FROM information_deliverables WHERE tidp_id = ? AND is_auto_populated = 1'
    );
    const result = stmt.run(tidpId);
    return {
      deleted: result.changes
    };
  } catch (error) {
    console.error('Error unsyncing TIDP:', error);
    throw error;
  }
};

/**
 * Check if a deliverable can be safely updated (is auto-populated)
 */
const canUpdateDeliverable = (deliverableId) => {
  try {
    const stmt = db.prepare('SELECT is_auto_populated FROM information_deliverables WHERE id = ?');
    const result = stmt.get(deliverableId);
    return result && result.is_auto_populated === 1;
  } catch (error) {
    console.error('Error checking deliverable update permission:', error);
    return false;
  }
};

module.exports = {
  syncTIDPsToDeliverables,
  syncSingleTIDP,
  getSyncStatus,
  unsyncTIDP,
  canUpdateDeliverable,
  mapContainerToDeliverable,
  mapContainerToDeliverableUpdates,
  mapContainerStatus
};
