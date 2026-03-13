/**
 * EIR drafts API — CRUD for Exchange Information Requirements documents.
 */
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const eirService = require('../services/eirService');
const {
  mapEirFormDataToAnalysis,
  buildBasicEirSummaryMarkdown,
} = require('../services/eirFormAnalysisMapper');

/**
 * GET /api/eir/drafts
 * List EIR drafts for the authenticated user, optionally filtered by projectId.
 */
router.get('/drafts', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.query.projectId || null;
    const rows = eirService.listByUser(userId, projectId);
    const drafts = rows.map(row => ({
      ...row,
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data
    }));
    res.json({ success: true, drafts });
  } catch (error) {
    console.error('EIR list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch EIR drafts',
      error: error.message
    });
  }
});

/**
 * GET /api/eir/drafts/:id/analysis
 * Derive canonical EIR analysis JSON (EirAnalysis shape) from authored EIR form data.
 * Does not call the ML analyzer – this is a pure mapping from the stored draft.
 */
router.get('/drafts/:id/analysis', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const draft = eirService.getById(id, userId);
    if (!draft) {
      return res.status(404).json({ success: false, message: 'EIR draft not found' });
    }

    const formData = draft.data && typeof draft.data === 'object' ? draft.data : {};
    const analysisJson = mapEirFormDataToAnalysis(formData);
    const summaryMarkdown = buildBasicEirSummaryMarkdown(analysisJson);

    res.json({
      success: true,
      draftId: draft.id,
      analysis_json: analysisJson,
      summary_markdown: summaryMarkdown,
    });
  } catch (error) {
    console.error('EIR analysis-from-form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to build EIR analysis from draft data',
      error: error.message,
    });
  }
});

/**
 * GET /api/eir/drafts/:id
 * Get a single EIR draft by id (must belong to user).
 */
router.get('/drafts/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const draft = eirService.getById(id, userId);
    if (!draft) {
      return res.status(404).json({ success: false, message: 'EIR draft not found' });
    }
    res.json({ success: true, draft });
  } catch (error) {
    console.error('EIR get error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch EIR draft',
      error: error.message
    });
  }
});

/**
 * POST /api/eir/drafts
 * Create a new EIR draft. Body: { projectId?, title, data? }.
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
    const draft = eirService.create({
      userId,
      projectId: projectId || null,
      title: title.trim(),
      data: data || {}
    });
    res.status(201).json({ success: true, draft });
  } catch (error) {
    console.error('EIR create error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create EIR draft',
      error: error.message
    });
  }
});

/**
 * PUT /api/eir/drafts/:id
 * Update an EIR draft. Body: { title?, projectId?, data?, status? }.
 */
router.put('/drafts/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, projectId, data, status } = req.body;
    const draft = eirService.update(id, userId, { title, projectId, data, status });
    if (!draft) {
      return res.status(404).json({ success: false, message: 'EIR draft not found' });
    }
    res.json({ success: true, draft });
  } catch (error) {
    console.error('EIR update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update EIR draft',
      error: error.message
    });
  }
});

/**
 * POST /api/eir/drafts/:id/publish
 * Mark this EIR as the published (active) EIR for its project. Unpublishes others in the same project.
 */
router.post('/drafts/:id/publish', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const draft = eirService.publish(id, userId);
    if (!draft) {
      return res.status(404).json({ success: false, message: 'EIR draft not found' });
    }
    res.json({ success: true, draft });
  } catch (error) {
    console.error('EIR publish error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish EIR',
      error: error.message
    });
  }
});

/**
 * DELETE /api/eir/drafts/:id
 * Delete an EIR draft (must belong to user).
 */
router.delete('/drafts/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deleted = eirService.remove(id, userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'EIR draft not found' });
    }
    res.json({ success: true, message: 'EIR draft deleted' });
  } catch (error) {
    console.error('EIR delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete EIR draft',
      error: error.message
    });
  }
});

module.exports = router;
