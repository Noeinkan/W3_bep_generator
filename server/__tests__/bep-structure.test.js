/**
 * @vitest-environment node
 */
const express = require('express');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const bepStructureRoutes = require('../routes/bep-structure');
const db = require('../database');
const { generateToken } = require('../services/authService');

describe('BEP structure API — template from CONFIG', () => {
  let app;
  let userId;
  let token;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/bep-structure', bepStructureRoutes);
    userId = uuidv4();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, created_at, updated_at, is_active, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, 1, 1)
    `).run(userId, `bep-${userId.slice(0, 8)}@example.com`, 'hash', 'Test', now, now);
    token = generateToken(userId);
  });

  afterEach(() => {
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  });

  test('GET /api/bep-structure/template returns structure built from CONFIG', async () => {
    const res = await request(app)
      .get('/api/bep-structure/template?bepType=post-appointment')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBe(res.body.data.length);
    expect(res.body.data.length).toBeGreaterThanOrEqual(14);

    const step5 = res.body.data[4];
    expect(step5).toBeDefined();
    expect(step5.title).toContain('Level of Information');
    expect(Array.isArray(step5.fields)).toBe(true);
    const loinField = step5.fields.find(f => f.field_id === 'levelOfInformationMatrix');
    expect(loinField).toBeDefined();
    expect(loinField.label).toContain('Level of Information Need');
  });

  test('GET /api/bep-structure/template without auth returns 401', async () => {
    await request(app)
      .get('/api/bep-structure/template')
      .expect(401);
  });
});
