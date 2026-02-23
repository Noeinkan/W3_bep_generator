const request = require('supertest');
const app = require('../app'); // we'll create this app export
const db = require('../database');

describe('TIDP API', () => {
  afterAll(() => {
    // close db if necessary (better-sqlite3 doesn't expose close in this setup)
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

    const res = await request(app).post('/api/tidp').send(payload).expect(201);
    expect(res.body).toBeDefined();
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.teamName).toBe('Jest Test Team');
    expect(Array.isArray(res.body.data.containers)).toBe(true);
  }, 10000);
});
