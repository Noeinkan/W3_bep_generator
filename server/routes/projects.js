const express = require('express');
const router = express.Router();
const projectService = require('../services/projectService');

// GET /api/projects — list projects for a user
router.get('/', (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    const projects = projectService.getAllProjects(userId);
    res.json({ success: true, projects });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id — get single project
router.get('/:id', (req, res, next) => {
  try {
    const project = projectService.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
});

// POST /api/projects — create project
router.post('/', (req, res, next) => {
  try {
    const { userId, name } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ success: false, error: 'userId and name are required' });
    }
    const project = projectService.createProject(userId, name);
    res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
});

// PUT /api/projects/:id — update project
router.put('/:id', (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'name is required' });
    }
    const existing = projectService.getProject(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    const project = projectService.updateProject(req.params.id, name);
    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id — delete project
router.delete('/:id', (req, res, next) => {
  try {
    const existing = projectService.getProject(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    projectService.deleteProject(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
