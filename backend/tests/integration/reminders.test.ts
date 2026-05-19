import request from 'supertest';
import bcrypt from 'bcryptjs';
import Admin from '../../src/models/Admin';
import Client from '../../src/models/Client';
import { setupTestDB, teardownTestDB, clearCollections, app } from '../helpers/setup';
import { calculateExpiry, addDays } from '../../src/utils/dateHelpers';

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

function makeExpiryDate(daysFromNow: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0); // midday to avoid boundary issues
  d.setDate(d.getDate() + daysFromNow);
  return d;
}

describe('GET /api/admin/reminders', () => {
  it('returns correct buckets for clients expiring today, in 2 days, in 7 days', async () => {
    await Client.create([
      {
        name: 'Expires Today',
        phone: '1000000001',
        joinDate: new Date(),
        planDuration: 1,
        expiryDate: makeExpiryDate(0),
        personalTraining: false,
      },
      {
        name: 'Expires In 2 Days',
        phone: '1000000002',
        joinDate: new Date(),
        planDuration: 1,
        expiryDate: makeExpiryDate(2),
        personalTraining: false,
      },
      {
        name: 'Expires In 7 Days',
        phone: '1000000003',
        joinDate: new Date(),
        planDuration: 1,
        expiryDate: makeExpiryDate(7),
        personalTraining: false,
      },
      {
        name: 'Expires In 30 Days',
        phone: '1000000004',
        joinDate: new Date(),
        planDuration: 1,
        expiryDate: makeExpiryDate(30),
        personalTraining: false,
      },
    ]);

    const res = await request(app)
      .get('/api/admin/reminders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('today');
    expect(res.body.data).toHaveProperty('in2Days');
    expect(res.body.data).toHaveProperty('in7Days');

    expect(res.body.data.today.length).toBe(1);
    expect(res.body.data.today[0].name).toBe('Expires Today');

    expect(res.body.data.in2Days.length).toBe(1);
    expect(res.body.data.in2Days[0].name).toBe('Expires In 2 Days');

    expect(res.body.data.in7Days.length).toBe(1);
    expect(res.body.data.in7Days[0].name).toBe('Expires In 7 Days');
  });

  it('returns empty arrays when no clients match buckets', async () => {
    const res = await request(app)
      .get('/api/admin/reminders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.today).toEqual([]);
    expect(res.body.data.in2Days).toEqual([]);
    expect(res.body.data.in7Days).toEqual([]);
  });
});
