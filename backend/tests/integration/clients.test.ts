import request from 'supertest';
import bcrypt from 'bcryptjs';
import Admin from '../../src/models/Admin';
import { setupTestDB, teardownTestDB, clearCollections, app } from '../helpers/setup';

let token: string;

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
});

const clientPayload = {
  name: 'John Doe',
  phone: '1234567890',
  joinDate: new Date().toISOString(),
  planDuration: 1,
  personalTraining: false,
};

describe('POST /api/admin/clients', () => {
  it('returns 201 and auto-calculates expiryDate', async () => {
    const res = await request(app)
      .post('/api/admin/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload);

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('expiryDate');
    const expiry = new Date(res.body.data.expiryDate);
    expect(expiry.getTime()).toBeGreaterThan(new Date(clientPayload.joinDate).getTime());
  });

  it('returns 409 for duplicate phone', async () => {
    await request(app)
      .post('/api/admin/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload);

    const res = await request(app)
      .post('/api/admin/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...clientPayload, name: 'Jane Doe' });

    expect(res.status).toBe(409);
  });
});

describe('GET /api/admin/clients', () => {
  it('returns 200 and each client has expiryStatus', async () => {
    await request(app)
      .post('/api/admin/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload);

    const res = await request(app)
      .get('/api/admin/clients')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((client: any) => {
      expect(['active', 'expiring_soon', 'expired']).toContain(client.expiryStatus);
    });
  });
});

describe('PUT /api/admin/clients/:id', () => {
  it('returns 200 and recalculates expiryDate when planDuration changes', async () => {
    const createRes = await request(app)
      .post('/api/admin/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload);

    const clientId = createRes.body.data._id;
    const originalExpiry = new Date(createRes.body.data.expiryDate);

    const res = await request(app)
      .put(`/api/admin/clients/${clientId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ planDuration: 3 });

    expect(res.status).toBe(200);
    const newExpiry = new Date(res.body.data.expiryDate);
    expect(newExpiry.getTime()).toBeGreaterThan(originalExpiry.getTime());
  });
});

describe('DELETE /api/admin/clients/:id', () => {
  it('returns 204 and deletes associated payments', async () => {
    const createRes = await request(app)
      .post('/api/admin/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload);

    const clientId = createRes.body.data._id;

    // Add a payment
    await request(app)
      .post(`/api/admin/clients/${clientId}/payments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100, planDuration: 1 });

    const deleteRes = await request(app)
      .delete(`/api/admin/clients/${clientId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(204);

    // Payments should be gone
    const paymentsRes = await request(app)
      .get(`/api/admin/clients/${clientId}/payments`)
      .set('Authorization', `Bearer ${token}`);

    expect(paymentsRes.body.data).toEqual([]);
  });
});
