import request from 'supertest';
import bcrypt from 'bcryptjs';
import Admin from '../../src/models/Admin';
import { setupTestDB, teardownTestDB, clearCollections, app } from '../helpers/setup';

let token: string;
let clientId: string;

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
  const passwordHash = await bcrypt.hash('password123', 10);
  await Admin.create({ username: 'admin', passwordHash });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password123' });
  token = loginRes.body.data.token;

  const clientRes = await request(app)
    .post('/api/admin/clients')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Test Client',
      phone: '9876543210',
      joinDate: new Date().toISOString(),
      planDuration: 1,
      personalTraining: false,
    });
  clientId = clientRes.body.data._id;
});

describe('POST /api/admin/clients/:id/payments', () => {
  it('returns 201 and extends client expiryDate', async () => {
    // Get current expiry
    const clientBefore = await request(app)
      .get(`/api/admin/clients/${clientId}`)
      .set('Authorization', `Bearer ${token}`);
    const expiryBefore = new Date(clientBefore.body.data.expiryDate);

    const res = await request(app)
      .post(`/api/admin/clients/${clientId}/payments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 150, planDuration: 1 });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('newExpiryDate');

    const newExpiry = new Date(res.body.data.newExpiryDate);
    expect(newExpiry.getTime()).toBeGreaterThan(expiryBefore.getTime());
  });
});

describe('GET /api/admin/clients/:id/payments', () => {
  it('returns 200 and payments sorted by paidAt desc', async () => {
    // Record two payments
    await request(app)
      .post(`/api/admin/clients/${clientId}/payments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100, planDuration: 1, paidAt: new Date('2024-01-01').toISOString() });

    await request(app)
      .post(`/api/admin/clients/${clientId}/payments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 200, planDuration: 1, paidAt: new Date('2024-03-01').toISOString() });

    const res = await request(app)
      .get(`/api/admin/clients/${clientId}/payments`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);

    // Most recent first
    const dates = res.body.data.map((p: any) => new Date(p.paidAt).getTime());
    expect(dates[0]).toBeGreaterThanOrEqual(dates[1]);
  });
});

describe('GET /api/admin/payments/summary', () => {
  it('returns 200 with correct paid/unpaid counts', async () => {
    // Record a payment for the existing client this month
    await request(app)
      .post(`/api/admin/clients/${clientId}/payments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100, planDuration: 1 });

    // Create a second client without payment
    await request(app)
      .post('/api/admin/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Unpaid Client',
        phone: '1111111111',
        joinDate: new Date().toISOString(),
        planDuration: 1,
        personalTraining: false,
      });

    const res = await request(app)
      .get('/api/admin/payments/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('paid');
    expect(res.body.data).toHaveProperty('unpaid');
    expect(res.body.data.paid).toBe(1);
    expect(res.body.data.unpaid).toBe(1);
  });
});
