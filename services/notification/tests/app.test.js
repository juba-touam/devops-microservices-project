const mongoose = require('mongoose');
const request = require('supertest');

// Mock mongoose before importing app
jest.mock('mongoose', () => {
  const mockSchema = jest.fn().mockImplementation(() => ({}));
  mockSchema.Types = { Mixed: 'Mixed' };

  const mockDoc = {
    save: jest.fn().mockResolvedValue(true),
    toObject: jest.fn(),
  };

  const mockModel = jest.fn().mockImplementation((data) => {
    const doc = {
      ...data,
      _id: 'mock-id-123',
      __v: 0,
      save: jest.fn().mockResolvedValue(true),
      toObject: jest.fn().mockReturnValue({
        ...data,
        _id: 'mock-id-123',
        __v: 0,
      }),
    };
    return doc;
  });

  mockModel.find = jest.fn();

  return {
    Schema: mockSchema,
    model: jest.fn().mockReturnValue(mockModel),
    connect: jest.fn().mockResolvedValue(true),
  };
});

const { app, Notification } = require('../src/app');

describe('Notification Service', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('GET /api/health returns UP status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('notification');
  });

  test('POST /api/notifications creates a notification', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .send({
        id: 'pay-123',
        amount: 42.0,
        currency: 'EUR',
        status: 'completed',
        description: 'Test payment',
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe('mock-id-123');
    expect(res.body.paymentId).toBe('pay-123');
    expect(res.body).not.toHaveProperty('_id');
    expect(res.body).not.toHaveProperty('__v');
  });

  test('POST /api/notifications with items', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .send({
        id: 'pay-456',
        amount: 100.0,
        currency: 'USD',
        status: 'completed',
        items: [{ id: 1, name: 'Laptop', price: 100, quantity: 1 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.paymentId).toBe('pay-456');
  });

  test('GET /api/notifications returns list', async () => {
    Notification.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        { _id: 'n1', __v: 0, type: 'payment', paymentId: 'p1', amount: 10 },
        { _id: 'n2', __v: 0, type: 'payment', paymentId: 'p2', amount: 20 },
      ]),
    });

    const res = await request(app).get('/api/notifications');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].id).toBe('n1');
    expect(res.body[0]).not.toHaveProperty('_id');
  });

  test('GET /api/notifications returns empty list', async () => {
    Notification.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue([]),
    });

    const res = await request(app).get('/api/notifications');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});
