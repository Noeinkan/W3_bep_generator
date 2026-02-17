const express = require('express');
const router = express.Router();
const {
  getIMActivities,
  getIMActivityById,
  createIMActivity,
  updateIMActivity,
  deleteIMActivity,
  bulkCreateIMActivities,
  getDeliverables,
  getDeliverableById,
  createDeliverable,
  updateDeliverable,
  deleteDeliverable,
  getDeliverablesGroupedByStage,
  getDeliverablesByTIDP
} = require('../services/responsibilityMatrixService');

const {
  syncTIDPsToDeliverables,
  syncSingleTIDP,
  getSyncStatus,
  unsyncTIDP
} = require('../services/tidpSyncService');
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication to all responsibility matrix routes
router.use(authenticateToken);

/**
 * INFORMATION MANAGEMENT ACTIVITIES ROUTES (Matrix 1)
 */

// Get all IM activities for a project
router.get('/im-activities', (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const activities = getIMActivities(projectId);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching IM activities:', error);
    res.status(500).json({ error: 'Failed to fetch IM activities' });
  }
});

// Get single IM activity
router.get('/im-activities/:id', (req, res) => {
  try {
    const { id } = req.params;
    const activity = getIMActivityById(id);

    if (!activity) {
      return res.status(404).json({ error: 'IM activity not found' });
    }

    res.json(activity);
  } catch (error) {
    console.error('Error fetching IM activity:', error);
    res.status(500).json({ error: 'Failed to fetch IM activity' });
  }
});

// Create IM activity
router.post('/im-activities', (req, res) => {
  try {
    const activityData = req.body;

    if (!activityData.projectId && !activityData.project_id) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    if (!activityData.activityName && !activityData.activity_name) {
      return res.status(400).json({ error: 'activityName is required' });
    }

    const activity = createIMActivity(activityData);
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating IM activity:', error);
    res.status(500).json({ error: 'Failed to create IM activity' });
  }
});

// Update IM activity
router.put('/im-activities/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const activity = updateIMActivity(id, updates);

    if (!activity) {
      return res.status(404).json({ error: 'IM activity not found' });
    }

    res.json(activity);
  } catch (error) {
    console.error('Error updating IM activity:', error);
    res.status(500).json({ error: 'Failed to update IM activity' });
  }
});

// Delete IM activity
router.delete('/im-activities/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteIMActivity(id);

    if (!deleted) {
      return res.status(404).json({ error: 'IM activity not found' });
    }

    res.json({ message: 'IM activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting IM activity:', error);
    res.status(500).json({ error: 'Failed to delete IM activity' });
  }
});

// Bulk create IM activities (for initialization)
router.post('/im-activities/bulk', (req, res) => {
  try {
    const { activities } = req.body;

    if (!Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({ error: 'activities array is required' });
    }

    const count = bulkCreateIMActivities(activities);
    res.status(201).json({
      message: `${count} IM activities created successfully`,
      count
    });
  } catch (error) {
    console.error('Error bulk creating IM activities:', error);
    res.status(500).json({ error: 'Failed to bulk create IM activities' });
  }
});

/**
 * INFORMATION DELIVERABLES ROUTES (Matrix 2)
 */

// Get all deliverables for a project
router.get('/deliverables', (req, res) => {
  try {
    const { projectId, status, responsibleTaskTeam, exchangeStage } = req.query;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const filters = {};
    if (status) filters.status = status;
    if (responsibleTaskTeam) filters.responsibleTaskTeam = responsibleTaskTeam;
    if (exchangeStage) filters.exchangeStage = exchangeStage;

    const deliverables = getDeliverables(projectId, filters);
    res.json(deliverables);
  } catch (error) {
    console.error('Error fetching deliverables:', error);
    res.status(500).json({ error: 'Failed to fetch deliverables' });
  }
});

// Get deliverables grouped by stage
router.get('/deliverables/grouped-by-stage', (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const grouped = getDeliverablesGroupedByStage(projectId);
    res.json(grouped);
  } catch (error) {
    console.error('Error fetching grouped deliverables:', error);
    res.status(500).json({ error: 'Failed to fetch grouped deliverables' });
  }
});

// Get deliverables for a specific TIDP
router.get('/deliverables/by-tidp/:tidpId', (req, res) => {
  try {
    const { tidpId } = req.params;
    const deliverables = getDeliverablesByTIDP(tidpId);
    res.json(deliverables);
  } catch (error) {
    console.error('Error fetching deliverables by TIDP:', error);
    res.status(500).json({ error: 'Failed to fetch deliverables' });
  }
});

// Get single deliverable
router.get('/deliverables/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deliverable = getDeliverableById(id);

    if (!deliverable) {
      return res.status(404).json({ error: 'Deliverable not found' });
    }

    res.json(deliverable);
  } catch (error) {
    console.error('Error fetching deliverable:', error);
    res.status(500).json({ error: 'Failed to fetch deliverable' });
  }
});

// Create deliverable
router.post('/deliverables', (req, res) => {
  try {
    const deliverableData = req.body;

    if (!deliverableData.projectId && !deliverableData.project_id) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    if (!deliverableData.deliverableName && !deliverableData.deliverable_name) {
      return res.status(400).json({ error: 'deliverableName is required' });
    }

    const deliverable = createDeliverable(deliverableData);
    res.status(201).json(deliverable);
  } catch (error) {
    console.error('Error creating deliverable:', error);
    res.status(500).json({ error: 'Failed to create deliverable' });
  }
});

// Update deliverable
router.put('/deliverables/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const deliverable = updateDeliverable(id, updates);

    if (!deliverable) {
      return res.status(404).json({ error: 'Deliverable not found' });
    }

    res.json(deliverable);
  } catch (error) {
    console.error('Error updating deliverable:', error);
    res.status(500).json({ error: 'Failed to update deliverable' });
  }
});

// Delete deliverable
router.delete('/deliverables/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteDeliverable(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Deliverable not found' });
    }

    res.json({ message: 'Deliverable deleted successfully' });
  } catch (error) {
    console.error('Error deleting deliverable:', error);
    res.status(500).json({ error: 'Failed to delete deliverable' });
  }
});

/**
 * TIDP SYNCHRONIZATION ROUTES
 */

// Sync all TIDPs to deliverables for a project
router.post('/sync-tidps', async (req, res) => {
  try {
    const { projectId, overwriteManual = false } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const results = await syncTIDPsToDeliverables(projectId, { overwriteManual });
    res.json(results);
  } catch (error) {
    console.error('Error syncing TIDPs:', error);
    res.status(500).json({ error: 'Failed to sync TIDPs' });
  }
});

// Sync single TIDP to deliverables
router.post('/sync-tidps/:tidpId', async (req, res) => {
  try {
    const { tidpId } = req.params;
    const { projectId, overwriteManual = false } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const results = await syncSingleTIDP(tidpId, projectId, { overwriteManual });
    res.json(results);
  } catch (error) {
    console.error('Error syncing TIDP:', error);
    res.status(500).json({ error: 'Failed to sync TIDP' });
  }
});

// Get sync status for a project
router.get('/sync-status', (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const status = getSyncStatus(projectId);
    res.json(status);
  } catch (error) {
    console.error('Error getting sync status:', error);
    res.status(500).json({ error: 'Failed to get sync status' });
  }
});

// Unsync a TIDP (remove auto-populated deliverables)
router.delete('/sync-tidps/:tidpId', (req, res) => {
  try {
    const { tidpId } = req.params;
    const results = unsyncTIDP(tidpId);
    res.json(results);
  } catch (error) {
    console.error('Error unsyncing TIDP:', error);
    res.status(500).json({ error: 'Failed to unsync TIDP' });
  }
});

module.exports = router;
