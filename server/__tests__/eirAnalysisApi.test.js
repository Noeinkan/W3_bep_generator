/**
 * Integration tests for EIR drafts API, including GET /api/eir/drafts/:id/analysis
 * (BEP↔EIR linkage: analysis derived from authored EIR form data).
 */
const express = require('express');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const eirRoutes = require('../routes/eir');
const eirService = require('../services/eirService');
const { generateToken } = require('../services/authService');

describe('EIR drafts API — analysis from form data', () => {
  let app;
  let userId;
  let projectId;
  let token;
  let draftId;

  const insertUser = (id, email) => {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, created_at, updated_at, is_active, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, 1, 1)
    `).run(id, email, 'test-hash', `User ${id.slice(0, 6)}`, now, now);
  };

  const insertProject = (id, ownerId, name) => {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO projects (id, name, user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, name, ownerId, now, now);
  };

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/eir', eirRoutes);

    userId = uuidv4();
    projectId = uuidv4();
    insertUser(userId, `eir-test-${userId}@example.com`);
    insertProject(projectId, userId, 'EIR Test Project');

    const draft = eirService.create({
      userId,
      projectId,
      title: 'Test EIR',
      data: {
        executiveSummary: 'Test summary',
        goals: 'Goal One\nGoal Two',
        informationDeliveryMilestones: [
          { 'Stage/Phase': 'Stage 2', 'Milestone Description': 'Concept design', 'Due Date': '2026-06-01' },
        ],
      },
    });
    draftId = draft.id;
    token = generateToken(userId);
  });

  afterEach(() => {
    if (draftId) {
      db.prepare('DELETE FROM eir_drafts WHERE id = ?').run(draftId);
    }
    db.prepare('DELETE FROM projects WHERE id = ?').run(projectId);
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  });

  test('GET /api/eir/drafts/:id/analysis returns 401 without token', async () => {
    const res = await request(app)
      .get(`/api/eir/drafts/${draftId}/analysis`)
      .expect(401);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /api/eir/drafts/:id/analysis returns analysis_json and summary_markdown for owned draft', async () => {
    const res = await request(app)
      .get(`/api/eir/drafts/${draftId}/analysis`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.draftId).toBe(draftId);
    expect(res.body).toHaveProperty('analysis_json');
    expect(res.body).toHaveProperty('summary_markdown');

    const analysis = res.body.analysis_json;
    expect(analysis.project_info.description).toBe('Test summary');
    expect(analysis.bim_objectives).toContain('Goal One');
    expect(analysis.bim_objectives).toContain('Goal Two');
    expect(analysis.delivery_milestones).toHaveLength(1);
    expect(analysis.delivery_milestones[0]).toMatchObject({
      phase: 'Stage 2',
      description: 'Concept design',
      date: '2026-06-01',
    });

    expect(res.body.summary_markdown).toContain('Test summary');
    expect(res.body.summary_markdown).toContain('## BIM Objectives');
    expect(res.body.summary_markdown).toContain('## Delivery Milestones');
  });

  test('GET /api/eir/drafts/:id/analysis returns 404 for non-existent draft', async () => {
    const res = await request(app)
      .get('/api/eir/drafts/non-existent-id/analysis')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
    expect(res.body.success).toBe(false);
  });
});

describe('EIR document export — authored content', () => {
  test('EIR document export renders authored form data in HTML', async () => {
    const eirDocumentExportService = require('../services/eirDocumentExportService');
    const data = {
      executiveSummary: 'Authored EIR summary for export test',
      eirPurpose: '',
      goals: '',
    };
    const html = await eirDocumentExportService.generateEirDocumentHTML(
      data,
      'Test EIR Document'
    );
    expect(html).toContain('Test EIR Document');
    expect(html).toContain('Authored EIR summary for export test');
    expect(html).toContain('Exchange Information Requirements');
  });
});
