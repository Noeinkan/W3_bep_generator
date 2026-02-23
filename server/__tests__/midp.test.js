const express = require('express');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');

const db = require('../database');
const midpService = require('../services/midpService');
const tidpService = require('../services/tidpService');
const midpRouter = require('../routes/midp');
const { generateToken } = require('../services/authService');

describe('MIDP project scoping', () => {
  const createdTidpIds = [];
  const createdMidpIds = [];
  let userId;
  let authToken;
  const projectIds = ['project-a', 'project-b'];

  const insertUser = (id, email) => {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, created_at, updated_at, is_active, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, 1, 1)
    `).run(id, email, 'test-hash', `Test ${id.slice(0, 6)}`, now, now);
  };

  const insertMidp = (id, projectId, projectName = 'Test MIDP') => {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO midps (
        id, projectName, aggregated_data, delivery_schedule, included_tidps,
        risk_register, dependency_matrix, resource_plan, description, quality_gates,
        projectId, createdAt, updatedAt, version, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      projectName,
      JSON.stringify({ milestones: [], totalContainers: 0, totalEstimatedHours: 0, disciplines: [] }),
      JSON.stringify({}),
      JSON.stringify([]),
      JSON.stringify({ summary: { total: 0, high: 0, medium: 0, low: 0 } }),
      JSON.stringify({ summary: { criticalDependencies: 0 } }),
      JSON.stringify({ peakUtilization: 0 }),
      'Test',
      JSON.stringify([]),
      projectId,
      now,
      now,
      '1.0',
      'Active'
    );
  };

  const insertProject = (id, userId, name) => {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO projects (id, name, user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, name, userId, now, now);
  };

  beforeEach(() => {
    userId = uuidv4();
    insertUser(userId, `${userId}@example.com`);
    insertProject(projectIds[0], userId, 'Project A');
    insertProject(projectIds[1], userId, 'Project B');
    authToken = generateToken(userId);
  });

  afterEach(() => {
    createdMidpIds.splice(0).forEach((id) => {
      db.prepare('DELETE FROM midps WHERE id = ?').run(id);
    });

    createdTidpIds.splice(0).forEach((id) => {
      try {
        tidpService.deleteTIDP(id);
      } catch {
        // Ignore already removed records
      }
    });

    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    db.prepare('DELETE FROM projects WHERE id IN (?, ?)').run(projectIds[0], projectIds[1]);
  });

  test('createMIDPFromTIDPs rejects mixed-project TIDPs', () => {
    const tidpA = tidpService.createTIDP({
      teamName: 'Team A',
      discipline: 'Architecture',
      projectId: 'project-a',
      containers: []
    });
    const tidpB = tidpService.createTIDP({
      teamName: 'Team B',
      discipline: 'MEP',
      projectId: 'project-b',
      containers: []
    });

    createdTidpIds.push(tidpA.id, tidpB.id);

    expect(() => {
      midpService.createMIDPFromTIDPs(
        {
          projectName: 'Cross Project MIDP',
          leadAppointedParty: 'Lead',
          informationManager: 'Info Manager',
          baselineDate: new Date().toISOString(),
          version: '1.0',
          projectId: 'project-a'
        },
        [tidpA.id, tidpB.id]
      );
    }).toThrow('All TIDPs must belong to the same project');
  });

  test('GET /api/midp supports projectId filtering', async () => {
    const midpA = uuidv4();
    const midpB = uuidv4();
    insertMidp(midpA, 'project-a', 'MIDP A');
    insertMidp(midpB, 'project-b', 'MIDP B');
    createdMidpIds.push(midpA, midpB);

    const app = express();
    app.use(express.json());
    app.use('/api/midp', midpRouter);

    const res = await request(app)
      .get('/api/midp')
      .query({ projectId: 'project-a' })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.every((midp) => midp.projectId === 'project-a')).toBe(true);
  });
});
