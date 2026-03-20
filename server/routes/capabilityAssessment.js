/**
 * Capability Assessment API: CRUD for supply chain capability assessments, scoped by project.
 * Implements ISO 19650-2 Clause 5.3 task team capability tracking.
 */

const express = require('express');
const router = express.Router();
const svc = require('../services/capabilityAssessmentService');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// GET /api/capability-assessments/summary/:projectId — aggregate KPIs
// Must be declared before /:id to avoid capture
router.get('/summary/:projectId', (req, res, next) => {
  try {
    const summary = svc.getSummary(req.params.projectId);
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

// POST /api/capability-assessments/from-tidps/:projectId — auto-generate stubs from TIDPs
router.post('/from-tidps/:projectId', (req, res, next) => {
  try {
    const created = svc.fromTidps(req.params.projectId);
    res.status(201).json({ success: true, data: created, count: created.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/capability-assessments?projectId=X
router.get('/', (req, res, next) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ success: false, error: 'projectId is required' });
    const rows = svc.getByProject(projectId);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/capability-assessments/:id
router.get('/:id', (req, res, next) => {
  try {
    const row = svc.getById(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Capability assessment not found' });
    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
});

// POST /api/capability-assessments
router.post('/', (req, res, next) => {
  try {
    const { projectId, team_name } = req.body;
    if (!projectId || !team_name) {
      return res.status(400).json({ success: false, error: 'projectId and team_name are required' });
    }
    const row = svc.create({ ...req.body, project_id: projectId });
    res.status(201).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
});

// PUT /api/capability-assessments/:id
router.put('/:id', (req, res, next) => {
  try {
    const updated = svc.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Capability assessment not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/capability-assessments/:id
router.delete('/:id', (req, res, next) => {
  try {
    const result = svc.deleteAssessment(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, error: 'Capability assessment not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
