const express = require('express');
const router = express.Router();
const tidpService = require('../services/tidpService');
const midpService = require('../services/midpService');
const { validateTIDP, validateTIDPUpdate } = require('../validators/tidpValidator');

/**
 * GET /api/tidp
 * Get all TIDPs
 */
router.get('/', async (req, res, next) => {
  try {
    const { projectId } = req.query;

    let tidps;
    if (projectId) {
      tidps = tidpService.getTIDPsByProject(projectId);
    } else {
      tidps = tidpService.getAllTIDPs();
    }

    res.json({
      success: true,
      data: tidps,
      count: tidps.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tidp/:id
 * Get TIDP by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const tidp = tidpService.getTIDP(id);

    res.json({
      success: true,
      data: tidp
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
 * POST /api/tidp
 * Create new TIDP
 */
router.post('/', validateTIDP, async (req, res, next) => {
  try {
    const tidpData = req.body;
    const createdTidp = tidpService.createTIDP(tidpData);

    res.status(201).json({
      success: true,
      data: createdTidp,
      message: 'TIDP created successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/tidp/:id
 * Update existing TIDP
 */
router.put('/:id', validateTIDPUpdate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ISO 19650 suitability code transitions
    if (updateData.containers) {
      const suitabilityCheck = tidpService.validateContainerSuitabilityTransitions(id, updateData.containers);
      if (!suitabilityCheck.valid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ISO 19650 suitability code transitions',
          violations: suitabilityCheck.violations
        });
      }
    }

    const updatedTidp = tidpService.updateTIDP(id, updateData);

    // After updating a TIDP, refresh any MIDPs that include this TIDP so the MIDP aggregation stays current
    try {
      const allMidps = midpService.getAllMIDPs();
      allMidps.forEach((m) => {
        if (Array.isArray(m.includedTIDPs) && m.includedTIDPs.includes(updatedTidp.id)) {
          try {
            midpService.updateMIDPFromTIDPs(m.id, m.includedTIDPs);
          } catch (midpErr) {
            // Log and continue - don't fail the TIDP update because of MIDP refresh issues
            console.warn(`Failed to refresh MIDP ${m.id} after TIDP update ${updatedTidp.id}:`, midpErr);
          }
        }
      });
    } catch (err) {
      console.warn('MIDP refresh after TIDP update failed:', err);
    }

    res.json({
      success: true,
      data: updatedTidp,
      message: 'TIDP updated successfully'
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
 * DELETE /api/tidp/:id
 * Delete TIDP
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    tidpService.deleteTIDP(id);

    res.json({
      success: true,
      message: 'TIDP deleted successfully'
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
 * POST /api/tidp/:id/validate-dependencies
 * Validate TIDP dependencies
 */
router.post('/:id/validate-dependencies', async (req, res, next) => {
  try {
    const { id } = req.params;
    const tidp = tidpService.getTIDP(id);

    const dependencies = tidp.predecessors || [];
    const validation = tidpService.validateDependencies(dependencies);

    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tidp/:id/summary
 * Get TIDP summary for export
 */
router.get('/:id/summary', async (req, res, next) => {
  try {
    const { id } = req.params;
    const summary = tidpService.exportTIDPSummary(id);

    res.json({
      success: true,
      data: summary
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
 * GET /api/tidp/project/:projectId/dependency-matrix
 * Generate dependency matrix for a project
 */
router.get('/project/:projectId/dependency-matrix', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const dependencyMatrix = tidpService.generateDependencyMatrix(projectId);

    res.json({
      success: true,
      data: dependencyMatrix
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tidp/project/:projectId/resource-allocation
 * Calculate resource allocation for a project
 */
router.get('/project/:projectId/resource-allocation', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const tidps = tidpService.getTIDPsByProject(projectId);
    const allocation = tidpService.calculateResourceAllocation(tidps);

    res.json({
      success: true,
      data: allocation
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tidp/batch
 * Create multiple TIDPs in batch
 */
router.post('/batch', async (req, res, next) => {
  try {
    const { tidps } = req.body;

    if (!Array.isArray(tidps)) {
      return res.status(400).json({
        success: false,
        error: 'Expected array of TIDPs'
      });
    }

    const createdTidps = tidps.map(tidpData => tidpService.createTIDP(tidpData));

    res.status(201).json({
      success: true,
      data: createdTidps,
      count: createdTidps.length,
      message: `${createdTidps.length} TIDPs created successfully`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/tidp/batch
 * Update multiple TIDPs in batch
 */
router.put('/batch', async (req, res, next) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        error: 'Expected array of TIDP updates'
      });
    }

    const updatedTidps = [];
    const errors = [];

    updates.forEach(({ id, data }) => {
      try {
        const updated = tidpService.updateTIDP(id, data);
        updatedTidps.push(updated);
      } catch (error) {
        errors.push({ id, error: error.message });
      }
    });

    res.json({
      success: true,
      data: {
        updated: updatedTidps,
        errors
      },
      message: `${updatedTidps.length} TIDPs updated, ${errors.length} errors`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tidp/import/excel
 * Import TIDPs from Excel/CSV data
 */
router.post('/import/excel', async (req, res, next) => {
  try {
    const { data, projectId } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: 'Expected array of TIDP data from Excel/CSV'
      });
    }

    const importResults = tidpService.importTIDPsFromExcel(data, projectId);

    res.status(201).json({
      success: true,
      data: importResults,
      message: `Imported ${importResults.successful.length} TIDPs, ${importResults.failed.length} failed`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tidp/import/csv
 * Import TIDPs from CSV data
 */
router.post('/import/csv', async (req, res, next) => {
  try {
    const { data, projectId } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: 'Expected array of TIDP data from CSV'
      });
    }

    const importResults = tidpService.importTIDPsFromCSV(data, projectId);

    res.status(201).json({
      success: true,
      data: importResults,
      message: `Imported ${importResults.successful.length} TIDPs, ${importResults.failed.length} failed`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tidp/template/excel
 * Get Excel template for TIDP import
 */
router.get('/template/excel', async (req, res, next) => {
  try {
    const template = tidpService.getExcelImportTemplate();

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tidp/suitability-codes
 * Get ISO 19650 suitability codes and valid transitions
 */
router.get('/suitability-codes', (req, res) => {
  const TIDPService = tidpService.constructor;
  res.json({
    success: true,
    data: {
      codes: TIDPService.SUITABILITY_CODES,
      transitions: TIDPService.VALID_TRANSITIONS
    }
  });
});

module.exports = router;