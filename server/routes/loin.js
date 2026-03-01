/**
 * LOIN Tables API: CRUD for Level of Information Need rows, scoped by project.
 */

const express = require('express');
const router = express.Router();
const loinService = require('../services/loinService');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// GET /api/loin?projectId=X — list rows for a project
router.get('/', (req, res, next) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ success: false, error: 'projectId is required' });
    const rows = loinService.getRowsByProject(projectId);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    next(err);
  }
});

// POST /api/loin — create a row
router.post('/', (req, res, next) => {
  try {
    const { projectId, discipline, stage, element, geometry, alphanumeric, documentation, notes } = req.body;
    if (!projectId || !discipline || !stage || !element) {
      return res.status(400).json({ success: false, error: 'projectId, discipline, stage, and element are required' });
    }
    const row = loinService.createRow({ projectId, discipline, stage, element, geometry, alphanumeric, documentation, notes });
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

module.exports = router;
