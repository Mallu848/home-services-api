const request = require('supertest');
const { app, resetStore } = require('../src/app');

beforeEach(() => {
  resetStore();
});

describe('GET /health', () => {
  test('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /services', () => {
  test('lists the services offered', async () => {
    const res = await request(app).get('/services');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
  });
});

describe('POST /quotes', () => {
  const validBody = { customerName: 'Pat Smith', serviceId: 'pressure-washing', squareFeet: 1000 };

  test('creates a quote', async () => {
    const res = await request(app).post('/quotes').send(validBody);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, customerName: 'Pat Smith', total: 300 });
  });

  test('rejects a missing customer name', async () => {
    const res = await request(app).post('/quotes').send({ ...validBody, customerName: '' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('customerName is required');
  });

  test('rejects an unknown service', async () => {
    const res = await request(app).post('/quotes').send({ ...validBody, serviceId: 'nope' });
    expect(res.status).toBe(400);
  });

  test('rejects a request with no body', async () => {
    const res = await request(app).post('/quotes');
    expect(res.status).toBe(400);
  });

  test('rejects square footage above the maximum', async () => {
    const res = await request(app).post('/quotes').send({ ...validBody, squareFeet: 99999 });
    expect(res.status).toBe(400);
  });
});

describe('GET /quotes/:id', () => {
  test('returns a saved quote', async () => {
    await request(app)
      .post('/quotes')
      .send({ customerName: 'Pat Smith', serviceId: 'house-soft-wash', squareFeet: 2000 });
    const res = await request(app).get('/quotes/1');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(500);
  });

  test('returns 404 for a missing quote', async () => {
    const res = await request(app).get('/quotes/999');
    expect(res.status).toBe(404);
  });
});