import request from 'supertest';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/services/geminiService.js', () => ({
  analyzeCodeWithGemini: jest.fn()
}));

const app = (await import('../src/app.js')).default;
const { User } = await import('../src/models/User.js');
const { Analysis } = await import('../src/models/Analysis.js');
const geminiService = await import('../src/services/geminiService.js');

describe('Analysis API Endpoints & Business Logic', () => {
  let userACookie;
  let userBCookie;
  let userAId;
  let userBId;
  let analysisASpy;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-code-analyzer-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    await User.deleteMany({});
    await Analysis.deleteMany({});

    // Register User A
    const resA = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'User A', email: 'usera@example.com', password: 'Password123!' });
    userACookie = resA.headers['set-cookie'].find((c) => c.startsWith('token='));
    userAId = resA.body.data.user.id;

    // Register User B
    const resB = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'User B', email: 'userb@example.com', password: 'Password123!' });
    userBCookie = resB.headers['set-cookie'].find((c) => c.startsWith('token='));
    userBId = resB.body.data.user.id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Analysis.deleteMany({});
    await mongoose.disconnect();
  });

  it('GET /api/v1/analyses - should return 401 without cookie', async () => {
    const res = await request(app)
      .get('/api/v1/analyses')
      .expect(401);

    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/v1/analyses - should reject invalid language before calling Gemini', async () => {
    const res = await request(app)
      .post('/api/v1/analyses')
      .set('Cookie', [userACookie])
      .send({
        language: 'unsupported_lang_xyz',
        sourceCode: 'console.log("hello world");'
      })
      .expect(422);

    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/analyses - should reject source code exceeding max size', async () => {
    const hugeCode = 'x'.repeat(26000);
    const res = await request(app)
      .post('/api/v1/analyses')
      .set('Cookie', [userACookie])
      .send({
        language: 'javascript',
        sourceCode: hugeCode
      })
      .expect(422);

    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/analyses - should create completed analysis when Gemini returns valid findings', async () => {
    // Mock successful Gemini response
    geminiService.analyzeCodeWithGemini.mockResolvedValueOnce({
      summary: 'Clean implementation with small refactoring suggestion.',
      qualityScore: 92,
      model: 'gemini-1.5-flash',
      provider: 'gemini',
      findings: [
        {
          title: 'Prefer const over let',
          category: 'readability',
          severity: 'low',
          description: 'Variable is never reassigned.',
          lineStart: 1,
          lineEnd: 1,
          evidence: 'let x = 10;',
          recommendation: 'Use const instead',
          suggestedCode: 'const x = 10;',
          source: 'ai',
          confidence: 0.95,
          status: 'open'
        }
      ]
    });

    const res = await request(app)
      .post('/api/v1/analyses')
      .set('Cookie', [userACookie])
      .send({
        title: 'User A Sample Code',
        language: 'javascript',
        focus: 'readability',
        sourceCode: 'let x = 10;\nconsole.log(x);'
      })
      .expect(201);

    expect(res.body.data.analysis).toBeDefined();
    expect(res.body.data.analysis.status).toBe('completed');
    expect(res.body.data.analysis.qualityScore).toBe(92);
    expect(res.body.data.analysis.findings).toHaveLength(1);
    expect(res.body.data.analysis.findings[0].category).toBe('readability');
  });

  it('POST /api/v1/analyses - on Gemini failure/error, document is marked failed and not completed', async () => {
    geminiService.analyzeCodeWithGemini.mockRejectedValueOnce(
      new Error('Simulated Gemini timeout or network failure')
    );

    const res = await request(app)
      .post('/api/v1/analyses')
      .set('Cookie', [userACookie])
      .send({
        title: 'Failing Code Review',
        language: 'python',
        sourceCode: 'def test():\n    pass\n'
      });

    // Should return 500/502 error envelope
    expect(res.status).toBeGreaterThanOrEqual(500);

    // Verify in database that the record is 'failed', never 'completed'
    const failedDoc = await Analysis.findOne({ title: 'Failing Code Review' });
    expect(failedDoc).toBeDefined();
    expect(failedDoc.status).toBe('failed');
    expect(failedDoc.errorCode).toBeDefined();
  });

  it('Cross-user ownership: User B cannot read User A analysis (returns 404)', async () => {
    // Create an analysis for User A
    const analysisA = await Analysis.create({
      userId: userAId,
      title: 'Secret Code A',
      language: 'javascript',
      sourceCode: 'console.log("secret");',
      status: 'completed',
      summary: 'Secret review',
      qualityScore: 80
    });

    // User B tries to read User A's analysis
    const res = await request(app)
      .get(`/api/v1/analyses/${analysisA._id}`)
      .set('Cookie', [userBCookie])
      .expect(404);

    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('Cross-user ownership: User B cannot delete User A analysis (returns 404)', async () => {
    const analysisA = await Analysis.create({
      userId: userAId,
      title: 'Protected Code A',
      language: 'javascript',
      sourceCode: 'console.log("protect");',
      status: 'completed',
      summary: 'Protected review'
    });

    // User B attempts delete
    const res = await request(app)
      .delete(`/api/v1/analyses/${analysisA._id}`)
      .set('Cookie', [userBCookie])
      .expect(404);

    expect(res.body.error.code).toBe('NOT_FOUND');

    // Verify document still exists in DB
    const stillExists = await Analysis.findById(analysisA._id);
    expect(stillExists).toBeDefined();
  });

  it('Pagination + Newest-First ordering for User A', async () => {
    await Analysis.deleteMany({ userId: userAId });

    // Insert 3 documents with slight delays
    const doc1 = await Analysis.create({
      userId: userAId,
      title: 'Doc 1 Oldest',
      language: 'javascript',
      sourceCode: 'const a = 1;',
      status: 'completed',
      createdAt: new Date('2026-01-01T10:00:00Z')
    });

    const doc2 = await Analysis.create({
      userId: userAId,
      title: 'Doc 2 Middle',
      language: 'python',
      sourceCode: 'b = 2',
      status: 'completed',
      createdAt: new Date('2026-01-02T10:00:00Z')
    });

    const doc3 = await Analysis.create({
      userId: userAId,
      title: 'Doc 3 Newest',
      language: 'go',
      sourceCode: 'package main',
      status: 'completed',
      createdAt: new Date('2026-01-03T10:00:00Z')
    });

    const res = await request(app)
      .get('/api/v1/analyses?page=1&limit=2')
      .set('Cookie', [userACookie])
      .expect(200);

    const { analyses, pagination } = res.body.data;
    expect(analyses).toHaveLength(2);
    expect(pagination.total).toBe(3);
    expect(pagination.totalPages).toBe(2);
    // Newest first
    expect(analyses[0].title).toBe('Doc 3 Newest');
    expect(analyses[1].title).toBe('Doc 2 Middle');
  });

  it('Delete analysis removes the document', async () => {
    const toDelete = await Analysis.create({
      userId: userACookie ? userAId : null,
      title: 'To Be Deleted',
      language: 'typescript',
      sourceCode: 'let z = 1;',
      status: 'completed'
    });

    const res = await request(app)
      .delete(`/api/v1/analyses/${toDelete._id}`)
      .set('Cookie', [userACookie])
      .expect(200);

    expect(res.body.data.message).toContain('deleted');

    // Confirm deleted from DB
    const found = await Analysis.findById(toDelete._id);
    expect(found).toBeNull();
  });
});
