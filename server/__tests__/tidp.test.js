const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const app = require('../app');
const db = require('../database');
const { generateToken } = require('../services/authService');

describe('TIDP API', () => {
  let userId;
  let token;

  beforeAll(() => {
    userId = uuidv4();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, created_at, updated_at, is_active, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, 1, 1)
    `).run(userId, `tidp-test-${userId.slice(0, 8)}@example.com`, 'hash', 'TIDP Test', now, now);
    token = generateToken(userId);
  });

  afterAll(() => {
    if (userId) db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  });

  test('POST /api/tidp - create TIDP happy path', async () => {
    const payload = {
      teamName: 'Jest Test Team',
      discipline: 'Architecture',
      leader: 'Jest Leader',
      company: 'JestCo',
      responsibilities: 'Testing via jest',
      description: 'Created by jest test',
      status: 'Active',
      containers: [
        {
          'Information Container ID': 'IC-JEST-1',
          'Information Container Name/Title': 'Jest Container',
          'Description': 'desc',
          'Task Name': 'Jest Task',
          'Responsible Task Team/Party': 'Jest Test Team',
          'Author': 'Jest',
          'Level of Information Need (LOIN)': 'LOD 300',
          'Estimated Production Time': '1 day',
          'Delivery Milestone': 'Stage 2 - Concept',
          'Due Date': new Date().toISOString(),
          'Format/Type': 'PDF',
          'Purpose': 'Testing',
          'Acceptance Criteria': 'OK',
          'Review and Authorization Process': 'S3 - Issue for comment',
          'Status': 'Planned'
        }
      ]
    };

    const res = await request(app)
      .post('/api/tidp')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(201);
    expect(res.body).toBeDefined();
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.teamName).toBe('Jest Test Team');
    expect(Array.isArray(res.body.data.containers)).toBe(true);
  }, 10000);
});
