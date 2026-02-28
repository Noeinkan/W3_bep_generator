const express = require('express');
const router = express.Router();
const projectService = require('../services/projectService');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/projects — list projects for a user
router.get('/', authenticateToken, (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const userId = String(req.user.id);
    const projects = projectService.getAllProjects(userId);
    res.json({ success: true, projects });
  } catch (err) {
    console.error('GET /projects error:', err && err.message, err && err.stack);
    next(err);
  }
});

// GET /api/projects/:id — get single project
router.get('/:id', authenticateToken, (req, res, next) => {
  try {
    const project = projectService.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    // Verify ownership (compare as strings; user_id is TEXT)
    if (String(project.user_id) !== String(req.user.id)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
});

// POST /api/projects — create project
router.post('/', authenticateToken, (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const userId = String(req.user.id);
    const { name, accHubId, accProjectId, accDefaultFolder } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'name is required' });
    }
    const project = projectService.createProject(userId, name, {
      accHubId,
      accProjectId,
      accDefaultFolder
    });
    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error('POST /projects error:', err && err.message, err && err.stack);
    next(err);
  }
});

// PUT /api/projects/:id — update project
router.put('/:id', authenticateToken, (req, res, next) => {
  try {
    const { name, accHubId, accProjectId, accDefaultFolder } = req.body;
    const updatePayload = {};

    if (Object.prototype.hasOwnProperty.call(req.body, 'name')) {
      updatePayload.name = name;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'accHubId')) {
      updatePayload.accHubId = accHubId;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'accProjectId')) {
      updatePayload.accProjectId = accProjectId;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'accDefaultFolder')) {
      updatePayload.accDefaultFolder = accDefaultFolder;
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one supported field is required (name, accHubId, accProjectId, accDefaultFolder)'
      });
    }

    const existing = projectService.getProject(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    // Verify ownership (compare as strings; user_id is TEXT)
    if (String(existing.user_id) !== String(req.user.id)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    const project = projectService.updateProject(req.params.id, updatePayload);
    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id — delete project
router.delete('/:id', authenticateToken, (req, res, next) => {
  try {
    const existing = projectService.getProject(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    // Verify ownership (compare as strings; user_id is TEXT)
    if (String(existing.user_id) !== String(req.user.id)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    projectService.deleteProject(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
