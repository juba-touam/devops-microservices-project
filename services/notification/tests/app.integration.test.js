const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

let mongoServer;
let app;
let Notification;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  // Require app after mongoose is connected
  const appModule = require('../src/app');
  app = appModule.app;
  Notification = appModule.Notification;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Notification.deleteMany({});
});

describe('Notification Integration Tests', () => {
  test('POST /api/notifications creates and persists a notification', async () => {
    const payload = {
      id: 'pay-123',
      amount: 49.99,
      currency: 'EUR',
      status: 'completed',
      description: 'Test payment',
    };

    const res = await request(app)
      .post('/api/notifications')
      .send(payload)
      .expect(201);

    expect(res.body.paymentId).toBe('pay-123');
    expect(res.body.amount).toBe(49.99);
    expect(res.body.type).toBe('payment');

    // Verify persisted in DB
    const dbNotif = await Notification.findOne({ paymentId: 'pay-123' });
    expect(dbNotif).not.toBeNull();
    expect(dbNotif.amount).toBe(49.99);
  });

  test('POST then GET returns the notification in the list', async () => {
    const payload = {
      id: 'pay-456',
      amount: 100.00,
      currency: 'USD',
      status: 'completed',
    };

    await request(app)
      .post('/api/notifications')
      .send(payload)
      .expect(201);

    const res = await request(app)
      .get('/api/notifications')
      .expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].paymentId).toBe('pay-456');
    expect(res.body[0].amount).toBe(100.00);
  });

  test('POST 2 notifications then GET returns both', async () => {
    await request(app)
      .post('/api/notifications')
      .send({ id: 'pay-1', amount: 10, currency: 'EUR', status: 'completed' });

    await request(app)
      .post('/api/notifications')
      .send({ id: 'pay-2', amount: 20, currency: 'EUR', status: 'completed' });

    const res = await request(app)
      .get('/api/notifications')
      .expect(200);

    expect(res.body).toHaveLength(2);
    const paymentIds = res.body.map(n => n.paymentId);
    expect(paymentIds).toContain('pay-1');
    expect(paymentIds).toContain('pay-2');
  });

  test('GET on empty DB returns empty list', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .expect(200);

    expect(res.body).toHaveLength(0);
    expect(res.body).toEqual([]);
  });
});
