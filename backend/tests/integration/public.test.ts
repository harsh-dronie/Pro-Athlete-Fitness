import request from 'supertest';
import AboutContent from '../../src/models/AboutContent';
import { setupTestDB, teardownTestDB, clearCollections, app } from '../helpers/setup';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

beforeEach(async () => {
  await clearCollections();
});

describe('GET /api/transformations', () => {
  it('returns 200 without auth', async () => {
    const res = await request(app).get('/api/transformations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /api/about', () => {
  it('returns 404 when no about content exists', async () => {
    const res = await request(app).get('/api/about');
    expect(res.status).toBe(404);
  });

  it('returns 200 when about content is seeded', async () => {
    await AboutContent.create({
      trainerName: 'John Trainer',
      bio: 'Experienced personal trainer with 10 years of experience.',
      milestones: [],
    });

    const res = await request(app).get('/api/about');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('trainerName', 'John Trainer');
  });
});

describe('POST /api/leads', () => {
  it('returns 201 without auth', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({ name: 'Jane Smith', phone: '5551234567', goal: 'Lose weight' });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('name', 'Jane Smith');
  });
});
