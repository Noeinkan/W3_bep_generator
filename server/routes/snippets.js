/**
 * Snippets API: CRUD and list for stable text snippets ({{snippet:key}}).
 * Optional auth: allow unauthenticated read for form resolution; protect write in production.
 */

const express = require('express');
const router = express.Router();
const snippetService = require('../services/snippetService');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/snippets — list all (optional ?classification=)
router.get('/', (req, res, next) => {
  try {
    const classification = req.query.classification;
    const list = snippetService.list({ classification: classification || undefined });
    res.json({ success: true, data: list, count: list.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/snippets/map — key -> value map for resolution (no auth for form/preview)
router.get('/map', (req, res, next) => {
  try {
    const map = snippetService.getMap(req.query.projectId || null);
    res.json({ success: true, data: map });
  } catch (err) {
    next(err);
  }
});

// GET /api/snippets/classifications — distinct classifications
router.get('/classifications', (req, res, next) => {
  try {
    const list = snippetService.getClassifications();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

// GET /api/snippets/:key — get one by key
router.get('/:key', (req, res, next) => {
  try {
    const row = snippetService.getByKey(req.params.key);
    if (!row) return res.status(404).json({ success: false, error: 'Snippet not found' });
    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
});

// POST /api/snippets — create (upsert by key)
router.post('/', authenticateToken, (req, res, next) => {
  try {
    const { key, value, classification } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, error: 'key and value are required' });
    }
    const created = snippetService.upsert({ key, value, classification });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(409).json({ success: false, error: 'Snippet with this key already exists' });
    }
    next(err);
  }
});

// PUT /api/snippets/:id — update by id
router.put('/:id', authenticateToken, (req, res, next) => {
  try {
    const updated = snippetService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Snippet not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/snippets/:id — delete by id
router.delete('/:id', authenticateToken, (req, res, next) => {
  try {
    const result = snippetService.remove(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, error: 'Snippet not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
