const express = require('express');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const projectsRouter = require('../routes/projects');
const db = require('../database');
const { generateToken } = require('../services/authService');

describe('Projects API auth and ownership', () => {
  let app;
  let ownerUserId;
  let otherUserId;
  let ownerToken;
  let otherToken;
  let projectId;

  const insertUser = (id, email) => {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, created_at, updated_at, is_active, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, 1, 1)
    `).run(id, email, 'test-hash', `Test ${id.slice(0, 6)}`, now, now);
  };

  const insertProject = (id, userId, name) => {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO projects (id, name, user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, name, userId, now, now);
  };

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/projects', projectsRouter);

    ownerUserId = uuidv4();
    otherUserId = uuidv4();
    projectId = uuidv4();

    insertUser(ownerUserId, `owner-${ownerUserId}@example.com`);
    insertUser(otherUserId, `other-${otherUserId}@example.com`);
    insertProject(projectId, ownerUserId, 'Owner Project');

    ownerToken = generateToken(ownerUserId);
    otherToken = generateToken(otherUserId);
  });

  afterEach(() => {
    db.prepare('DELETE FROM projects WHERE id = ?').run(projectId);
    db.prepare('DELETE FROM users WHERE id IN (?, ?)').run(ownerUserId, otherUserId);
  });

  test('PUT /api/projects/:id blocks unauthenticated requests', async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .send({ name: 'Hacked' })
      .expect(401);

    expect(res.body).toHaveProperty('error', 'Access token required');
  });

  test('PUT /api/projects/:id blocks non-owner', async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ name: 'Hacked' })
      .expect(403);

    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Access denied');
  });

  test('PUT /api/projects/:id allows owner', async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Updated Name' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.project.name).toBe('Updated Name');
  });

  test('DELETE /api/projects/:id blocks non-owner', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Access denied');
  });

  test('DELETE /api/projects/:id allows owner', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);

    const deleted = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
    expect(deleted).toBeUndefined();
  });
});
