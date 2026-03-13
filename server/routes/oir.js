/**
 * OIR drafts API — CRUD for Organizational Information Requirements documents.
 */
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const oirService = require('../services/oirService');

/**
 * GET /api/oir/drafts
 * List OIR drafts for the authenticated user, optionally filtered by projectId.
 */
router.get('/drafts', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.query.projectId || null;
    const rows = oirService.listByUser(userId, projectId);
    const drafts = rows.map(row => ({
      ...row,
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data
    }));
    res.json({ success: true, drafts });
  } catch (error) {
    console.error('OIR list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch OIR drafts',
      error: error.message
    });
  }
});

/**
 * GET /api/oir/drafts/:id
 * Get a single OIR draft by id (must belong to user).
 */
router.get('/drafts/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const draft = oirService.getById(id, userId);
    if (!draft) {
      return res.status(404).json({ success: false, message: 'OIR draft not found' });
    }
    res.json({ success: true, draft });
  } catch (error) {
    console.error('OIR get error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch OIR draft',
      error: error.message
    });
  }
});

/**
 * POST /api/oir/drafts
 * Create a new OIR draft. Body: { projectId?, title, data? }.
 */
router.post('/drafts', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, title, data } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'title is required and must be a string'
      });
    }
    const draft = oirService.create({
      userId,
      projectId: projectId || null,
      title: title.trim(),
      data: data || {}
    });
    res.status(201).json({ success: true, draft });
  } catch (error) {
    console.error('OIR create error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create OIR draft',
      error: error.message
    });
  }
});

/**
 * PUT /api/oir/drafts/:id
 * Update an OIR draft. Body: { title?, projectId?, data?, status? }.
 */
router.put('/drafts/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, projectId, data, status } = req.body;
    const draft = oirService.update(id, userId, { title, projectId, data, status });
    if (!draft) {
      return res.status(404).json({ success: false, message: 'OIR draft not found' });
    }
    res.json({ success: true, draft });
  } catch (error) {
    console.error('OIR update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update OIR draft',
      error: error.message
    });
  }
});

/**
 * POST /api/oir/drafts/:id/publish
 * Mark this OIR as the published (active) OIR for its project. Unpublishes others in the same project.
 */
router.post('/drafts/:id/publish', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const draft = oirService.publish(id, userId);
    if (!draft) {
      return res.status(404).json({ success: false, message: 'OIR draft not found' });
    }
    res.json({ success: true, draft });
  } catch (error) {
    console.error('OIR publish error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish OIR',
      error: error.message
    });
  }
});

/**
 * DELETE /api/oir/drafts/:id
 * Delete an OIR draft (must belong to user).
 */
router.delete('/drafts/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deleted = oirService.remove(id, userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'OIR draft not found' });
    }
    res.json({ success: true, message: 'OIR draft deleted' });
  } catch (error) {
    console.error('OIR delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete OIR draft',
      error: error.message
    });
  }
});

module.exports = router;
