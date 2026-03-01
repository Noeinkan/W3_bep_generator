const express = require('express');
const router = express.Router();
const db = require('../database');
const { createId } = require('@paralleldrive/cuid2');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * GET /api/drafts
 * Get all drafts for a user
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.query;

    let drafts;
    if (projectId) {
      drafts = db.prepare(`
        SELECT * FROM drafts
        WHERE user_id = ? AND project_id = ? AND is_deleted = 0
        ORDER BY updated_at DESC
      `).all(userId, projectId);
    } else {
      drafts = db.prepare(`
        SELECT * FROM drafts
        WHERE user_id = ? AND is_deleted = 0
        ORDER BY updated_at DESC
      `).all(userId);
    }

    // Parse JSON data field for each draft
    const parsedDrafts = drafts.map(draft => ({
      ...draft,
      data: JSON.parse(draft.data)
    }));

    res.json({
      success: true,
      drafts: parsedDrafts
    });
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch drafts',
      error: error.message
    });
  }
});

/**
 * GET /api/drafts/:id
 * Get a specific draft
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const draft = db.prepare(`
      SELECT * FROM drafts
      WHERE id = ? AND user_id = ? AND is_deleted = 0
    `).get(id, userId);

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: 'Draft not found'
      });
    }

    res.json({
      success: true,
      draft: {
        ...draft,
        data: JSON.parse(draft.data)
      }
    });
  } catch (error) {
    console.error('Error fetching draft:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch draft',
      error: error.message
    });
  }
});

/**
 * POST /api/drafts
 * Create a new draft
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, title, type, data } = req.body;

    if (!title || !type || !data) {
      return res.status(400).json({
        success: false,
        message: 'title, type, and data are required'
      });
    }

    if (type !== 'pre-appointment' && type !== 'post-appointment') {
      return res.status(400).json({
        success: false,
        message: 'type must be either "pre-appointment" or "post-appointment"'
      });
    }

    const id = createId();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO drafts (id, user_id, project_id, title, type, data, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, userId, projectId || null, title, type, JSON.stringify(data), now, now);

    // Do NOT clone BEP structure here. Structure is loaded from CONFIG (getDefaultTemplateFromConfig)
    // when the draft has no custom structure, so CONFIG changes show up until the user customizes.
    // Structure is cloned to the draft only when they enter Structure Map edit mode (clone-to-draft).

    const draft = db.prepare('SELECT * FROM drafts WHERE id = ?').get(id);

    res.status(201).json({
      success: true,
      message: 'Draft created successfully',
      draft: {
        ...draft,
        data: JSON.parse(draft.data)
      }
    });
  } catch (error) {
    console.error('Error creating draft:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create draft',
      error: error.message
    });
  }
});

/**
 * PUT /api/drafts/:id
 * Update a draft
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, data, projectId } = req.body;

    // Check if draft exists and belongs to user
    const existing = db.prepare(`
      SELECT * FROM drafts
      WHERE id = ? AND user_id = ? AND is_deleted = 0
    `).get(id, userId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Draft not found'
      });
    }

    const now = new Date().toISOString();
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (data !== undefined) {
      updateFields.push('data = ?');
      updateValues.push(JSON.stringify(data));
    }
    if (projectId !== undefined) {
      updateFields.push('project_id = ?');
      updateValues.push(projectId);
    }

    updateFields.push('updated_at = ?');
    updateValues.push(now);
    updateValues.push(id, userId);

    const stmt = db.prepare(`
      UPDATE drafts
      SET ${updateFields.join(', ')}
      WHERE id = ? AND user_id = ?
    `);

    stmt.run(...updateValues);

    const draft = db.prepare('SELECT * FROM drafts WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Draft updated successfully',
      draft: {
        ...draft,
        data: JSON.parse(draft.data)
      }
    });
  } catch (error) {
    console.error('Error updating draft:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update draft',
      error: error.message
    });
  }
});

/**
 * DELETE /api/drafts/:id
 * Delete (soft delete) a draft
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if draft exists and belongs to user
    const existing = db.prepare(`
      SELECT * FROM drafts
      WHERE id = ? AND user_id = ? AND is_deleted = 0
    `).get(id, userId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Draft not found'
      });
    }

    const now = new Date().toISOString();

    // Soft delete
    const stmt = db.prepare(`
      UPDATE drafts
      SET is_deleted = 1, updated_at = ?
      WHERE id = ? AND user_id = ?
    `);

    stmt.run(now, id, userId);

    res.json({
      success: true,
      message: 'Draft deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting draft:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete draft',
      error: error.message
    });
  }
});

/**
 * POST /api/drafts/migrate
 * Migrate drafts from localStorage to database
 */
router.post('/migrate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { drafts } = req.body;

    if (!drafts) {
      return res.status(400).json({
        success: false,
        message: 'drafts are required'
      });
    }

    const results = {
      migrated: [],
      skipped: [],
      failed: []
    };

    Object.values(drafts).forEach(draft => {
      try {
        // Check if already exists
        const existing = db.prepare('SELECT id FROM drafts WHERE id = ?').get(draft.id);

        if (existing) {
          results.skipped.push({
            id: draft.id,
            name: draft.name,
            reason: 'Already exists in database'
          });
          return;
        }

        const now = new Date().toISOString();

        const stmt = db.prepare(`
          INSERT INTO drafts (id, user_id, project_id, title, type, data, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
          draft.id,
          userId,
          draft.projectId || null,
          draft.name || draft.projectName || 'Untitled Draft',
          draft.bepType || 'pre-appointment',
          JSON.stringify(draft.data),
          draft.lastModified || now,
          now
        );

        results.migrated.push({
          id: draft.id,
          name: draft.name || draft.projectName
        });
      } catch (error) {
        results.failed.push({
          id: draft.id,
          name: draft.name,
          error: error.message
        });
      }
    });

    res.json({
      success: true,
      message: `Migration complete: ${results.migrated.length} migrated, ${results.skipped.length} skipped, ${results.failed.length} failed`,
      results
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

module.exports = router;
