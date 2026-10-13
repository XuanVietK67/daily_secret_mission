import type { INestApplication } from '@nestjs/common';
import { generateKeyPair } from 'jose';
import request from 'supertest';
import { createTestApp } from './app.js';

describe('platform', () => {
  let app: INestApplication;
  let token: Awaited<ReturnType<typeof createTestApp>>['token'];

  beforeAll(async () => ({ app, token } = await createTestApp()));
  afterAll(() => app.close());

  it('health needs no token and checks the database', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/health')
      .expect(200);

    expect(res.body.info.db.status).toBe('up');
  });

  it('rejects a request without a token', async () => {
    const res = await request(app.getHttpServer()).get('/v1/me').expect(401);

    expect(res.body).toEqual({
      error: { code: 'UNAUTHORIZED', message: 'Missing bearer token' },
    });
  });

  it('rejects a token not signed by Supabase', async () => {
    const { privateKey } = await generateKeyPair('ES256');

    await request(app.getHttpServer())
      .get('/v1/me')
      .auth(await token(undefined, privateKey), { type: 'bearer' })
      .expect(401);
  });

  it('rejects a token whose subject is not a Learner id', async () => {
    await request(app.getHttpServer())
      .get('/v1/me')
      .auth(await token('not-a-uuid'), { type: 'bearer' })
      .expect(401);
  });

  it('answers malformed JSON with 400 in the error shape', async () => {
    const res = await request(app.getHttpServer())
      .patch('/v1/me')
      .auth(await token(), { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send('{"goal":')
      .expect(400);

    expect(res.body.error.code).toBe('BAD_REQUEST');
  });
});
