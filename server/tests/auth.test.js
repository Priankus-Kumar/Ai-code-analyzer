import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { User } from '../src/models/User.js';

describe('Auth API Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database or existing test mongo
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-code-analyzer-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  const testUser = {
    name: 'Alice Developer',
    email: 'alice@example.com',
    password: 'Password123!'
  };

  let authCookie;

  it('POST /api/v1/auth/register - should register a new user and set httpOnly cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser)
      .expect(201);

    expect(res.body.data).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data.user.name).toBe(testUser.name);
    expect(res.body.data.user.passwordHash).toBeUndefined();

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const tokenCookie = cookies.find((c) => c.startsWith('token='));
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie).toContain('HttpOnly');
  });

  it('POST /api/v1/auth/register - should reject duplicate email with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser)
      .expect(409);

    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('POST /api/v1/auth/register - should reject invalid password with 422', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Bob',
        email: 'bob@example.com',
        password: 'weak'
      })
      .expect(422);

    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/auth/login - should log in existing user and return auth cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
      .expect(200);

    expect(res.body.data.user.email).toBe(testUser.email);
    const cookies = res.headers['set-cookie'];
    authCookie = cookies.find((c) => c.startsWith('token='));
    expect(authCookie).toBeDefined();
  });

  it('POST /api/v1/auth/login - should reject invalid password with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword999'
      })
      .expect(401);

    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/v1/auth/me - should return 401 when accessed without cookie', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .expect(401);

    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/v1/auth/me - should return current user when authenticated with cookie', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', [authCookie])
      .expect(200);

    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('POST /api/v1/auth/logout - should clear the auth cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .expect(200);

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const tokenCookie = cookies.find((c) => c.startsWith('token='));
    expect(tokenCookie).toContain('token=;');
  });
});
