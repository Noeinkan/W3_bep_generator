/**
 * LOIN Tables API: CRUD for Level of Information Need rows, scoped by project.
 */

const express = require('express');
const router = express.Router();
const loinService = require('../services/loinService');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Property requirements: mount before /:id so /properties/:id is not captured as rowId
router.put('/properties/:id', (req, res, next) => {
  try {
    const updated = loinService.updatePropertyRequirement(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Property requirement not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});
router.delete('/properties/:id', (req, res, next) => {
  try {
    const result = loinService.deletePropertyRequirement(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, error: 'Property requirement not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/loin?projectId=X — list rows for a project (withPropertyCount=1 adds propertyCount per row for IDS badge)
router.get('/', (req, res, next) => {
  try {
    const { projectId, withPropertyCount } = req.query;
    if (!projectId) return res.status(400).json({ success: false, error: 'projectId is required' });
    const rows = loinService.getRowsByProject(projectId, { withPropertyCount: withPropertyCount === '1' });
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    next(err);
  }
});

// POST /api/loin — create a row
router.post('/', (req, res, next) => {
  try {
    const { projectId, discipline, stage, element, geometry, alphanumeric, documentation, notes, ifc_entity } = req.body;
    if (!projectId || !discipline || !stage || !element) {
      return res.status(400).json({ success: false, error: 'projectId, discipline, stage, and element are required' });
    }
    const row = loinService.createRow({ projectId, discipline, stage, element, geometry, alphanumeric, documentation, notes, ifc_entity });
    res.status(201).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
});

// PUT /api/loin/:id — update a row
router.put('/:id', (req, res, next) => {
  try {
    const updated = loinService.updateRow(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'LOIN row not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/loin/:id — delete a row
router.delete('/:id', (req, res, next) => {
  try {
    const result = loinService.deleteRow(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, error: 'LOIN row not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/loin/:rowId/properties — list property requirements for a row
router.get('/:rowId/properties', (req, res, next) => {
  try {
    const { rowId } = req.params;
    if (loinService.getById(rowId) == null) return res.status(404).json({ success: false, error: 'LOIN row not found' });
    const list = loinService.getPropertyRequirements(rowId);
    res.json({ success: true, data: list, count: list.length });
  } catch (err) {
    next(err);
  }
});

// POST /api/loin/:rowId/properties — create a property requirement
router.post('/:rowId/properties', (req, res, next) => {
  try {
    const { rowId } = req.params;
    const { propertySet, propertyName, dataType, valueConstraint } = req.body;
    if (!propertySet || !propertyName) {
      return res.status(400).json({ success: false, error: 'propertySet and propertyName are required' });
    }
    const created = loinService.createPropertyRequirement({
      loinRowId: rowId,
      propertySet,
      propertyName,
      dataType: dataType || 'IFCLABEL',
      valueConstraint: valueConstraint ?? null,
    });
    if (!created) return res.status(404).json({ success: false, error: 'LOIN row not found' });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
