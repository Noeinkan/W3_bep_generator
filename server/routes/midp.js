const express = require('express');
const router = express.Router();
const midpService = require('../services/midpService');
const { validateMIDP, validateMIDPUpdate } = require('../validators/midpValidator');
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication to all MIDP routes
router.use(authenticateToken);

/**
 * GET /api/midp
 * Get all MIDPs
 */
router.get('/', async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const midps = projectId
      ? midpService.getMIDPsByProject(projectId)
      : midpService.getAllMIDPs();

    res.json({
      success: true,
      data: midps,
      count: midps.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/midp/:id
 * Get MIDP by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    res.json({
      success: true,
      data: midp
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * POST /api/midp/from-tidps
 * Create MIDP by aggregating TIDPs
 */
router.post('/from-tidps', validateMIDP, async (req, res, next) => {
  try {
    const { midpData, tidpIds } = req.body;

    if (!Array.isArray(tidpIds) || tidpIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one TIDP ID is required'
      });
    }

    const createdMidp = midpService.createMIDPFromTIDPs(midpData, tidpIds);

    res.status(201).json({
      success: true,
      data: createdMidp,
      message: 'MIDP created successfully from TIDPs'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/midp/:id/update-from-tidps
 * Update MIDP with new TIDP data
 */
router.put('/:id/update-from-tidps', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tidpIds } = req.body;

    if (!Array.isArray(tidpIds) || tidpIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one TIDP ID is required'
      });
    }

    const updatedMidp = midpService.updateMIDPFromTIDPs(id, tidpIds);

    res.json({
      success: true,
      data: updatedMidp,
      message: 'MIDP updated successfully from TIDPs'
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * DELETE /api/midp/:id
 * Delete MIDP
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    midpService.deleteMIDP(id);

    res.json({
      success: true,
      message: 'MIDP deleted successfully'
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * GET /api/midp/:id/delivery-schedule
 * Get detailed delivery schedule for MIDP
 */
router.get('/:id/delivery-schedule', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    res.json({
      success: true,
      data: midp.deliverySchedule
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * GET /api/midp/:id/risk-register
 * Get consolidated risk register for MIDP
 */
router.get('/:id/risk-register', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    res.json({
      success: true,
      data: midp.riskRegister
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * GET /api/midp/:id/dependency-matrix
 * Get dependency matrix for MIDP
 */
router.get('/:id/dependency-matrix', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    res.json({
      success: true,
      data: midp.dependencyMatrix
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * GET /api/midp/:id/resource-plan
 * Get resource planning data for MIDP
 */
router.get('/:id/resource-plan', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    res.json({
      success: true,
      data: midp.resourcePlan
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * GET /api/midp/:id/aggregated-data
 * Get aggregated data summary for MIDP
 */
router.get('/:id/aggregated-data', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    res.json({
      success: true,
      data: midp.aggregatedData
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * GET /api/midp/:id/quality-gates
 * Get quality gates for MIDP
 */
router.get('/:id/quality-gates', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    res.json({
      success: true,
      data: midp.qualityGates
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * GET /api/midp/:id/milestones
 * Get milestone summary for MIDP
 */
router.get('/:id/milestones', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    const milestones = midp.aggregatedData.milestones.map(milestone => ({
      ...milestone,
      containersDetails: milestone.containers.map(container => ({
        id: container.id,
        name: container.name,
        team: container.tidpSource.teamName,
        discipline: container.tidpSource.discipline,
        dueDate: container.dueDate,
        status: container.status
      }))
    }));

    res.json({
      success: true,
      data: milestones
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * POST /api/midp/:id/refresh
 * Refresh MIDP data from current TIDPs
 */
router.post('/:id/refresh', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    const updatedMidp = midpService.updateMIDPFromTIDPs(id, midp.includedTIDPs);

    res.json({
      success: true,
      data: updatedMidp,
      message: 'MIDP refreshed successfully'
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * GET /api/midp/:id/dashboard
 * Get dashboard data for MIDP
 */
router.get('/:id/dashboard', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    const dashboard = {
      projectInfo: {
        name: midp.projectName,
        version: midp.version,
        status: midp.status,
        lastUpdated: midp.updatedAt
      },
      summary: {
        totalContainers: midp.aggregatedData.totalContainers,
        totalHours: midp.aggregatedData.totalEstimatedHours,
        milestones: midp.aggregatedData.milestones.length,
        disciplines: midp.aggregatedData.disciplines.length,
        includedTIDPs: midp.includedTIDPs.length
      },
      risks: {
        total: midp.riskRegister.summary.total,
        high: midp.riskRegister.summary.high,
        medium: midp.riskRegister.summary.medium,
        low: midp.riskRegister.summary.low
      },
      peakUtilization: midp.resourcePlan.peakUtilization,
      upcomingMilestones: midp.aggregatedData.milestones
        .filter(m => new Date(m.latestDate) > new Date())
        .sort((a, b) => new Date(a.latestDate) - new Date(b.latestDate))
        .slice(0, 3),
      criticalDependencies: midp.dependencyMatrix.summary?.criticalDependencies || 0
    };

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * POST /api/midp/auto-generate
 * Auto-generate MIDP from ALL TIDPs (no projectId filter)
 */
router.post('/auto-generate', async (req, res, next) => {
  try {
    const midpData = req.body;
    const createdMidp = midpService.autoGenerateMIDPFromAll(midpData);

    res.status(201).json({
      success: true,
      data: createdMidp,
      message: `MIDP auto-generated from ${createdMidp.includedTIDPs.length} TIDPs`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/midp/auto-generate/:projectId
 * Auto-generate MIDP from all TIDPs in a project
 */
router.post('/auto-generate/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const midpData = req.body;

    const createdMidp = midpService.autoGenerateMIDPFromProject(projectId, midpData);

    res.status(201).json({
      success: true,
      data: createdMidp,
      message: `MIDP auto-generated from ${createdMidp.includedTIDPs.length} TIDPs`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/midp/:id/evolution
 * Get MIDP evolution over time
 */
router.get('/:id/evolution', async (req, res, next) => {
  try {
    const { id } = req.params;
    const evolution = midpService.getMIDPEvolution(id);

    res.json({
      success: true,
      data: evolution
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * GET /api/midp/:id/deliverables-dashboard
 * Get deliverables dashboard with spreadsheet-like view
 */
router.get('/:id/deliverables-dashboard', async (req, res, next) => {
  try {
    const { id } = req.params;
    const dashboard = midpService.getDeliverablesDashboard(id);

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * GET /api/midp/:id/cascading-impact
 * Calculate cascading impact of late deliverables
 */
router.get('/:id/cascading-impact', async (req, res, next) => {
  try {
    const { id } = req.params;
    const impact = midpService.calculateCascadingImpact(id);

    res.json({
      success: true,
      data: impact
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * GET /api/midp/:id/trends
 * Get trend analysis from evolution snapshots
 */
router.get('/:id/trends', async (req, res, next) => {
  try {
    const { id } = req.params;
    const evolution = midpService.getMIDPEvolution(id);
    const trends = midpService.calculateTrends(evolution.historical);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

module.exports = router;