import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './app.js';

describe('AC-01 setup', () => {
  let app: INestApplication;
  let token: Awaited<ReturnType<typeof createTestApp>>['token'];

  beforeAll(async () => ({ app, token } = await createTestApp()));
  afterAll(() => app.close());

  it('first call creates the Learner, not yet onboarded, with default settings', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/me')
      .auth(await token(), { type: 'bearer' })
      .expect(200);

    expect(res.body).toMatchObject({
      selfAssessedLevel: null,
      timeZone: null,
      sensesPerMission: 5,
      defaultMode: 'daily',
      onboarded: false,
    });
  });

  it('saves level, Senses per Mission, Mode and time zone, without a placement test', async () => {
    const auth = await token();
    const choices = {
      selfAssessedLevel: 'intermediate',
      sensesPerMission: 3,
      defaultMode: 'quick',
      timeZone: 'Asia/Ho_Chi_Minh',
    };

    await request(app.getHttpServer())
      .patch('/v1/me')
      .auth(auth, { type: 'bearer' })
      .send(choices)
      .expect(200);
    const res = await request(app.getHttpServer())
      .get('/v1/me')
      .auth(auth, { type: 'bearer' })
      .expect(200);

    expect(res.body).toMatchObject({ ...choices, onboarded: true });
  });

  it.each([
    [
      'Senses per Mission above max',
      { sensesPerMission: 11 },
      'sensesPerMission',
    ],
    ['an unknown level', { selfAssessedLevel: 'expert' }, 'selfAssessedLevel'],
    ['clearing the level', { selfAssessedLevel: null }, 'selfAssessedLevel'],
    ['a non-IANA time zone', { timeZone: 'Mars/Base' }, 'timeZone'],
    ['an unknown field', { learnerId: randomUUID() }, 'learnerId'],
  ])('rejects %s', async (_, body, field) => {
    const res = await request(app.getHttpServer())
      .patch('/v1/me')
      .auth(await token(), { type: 'bearer' })
      .send(body)
      .expect(400);

    expect(res.body.error.code).toBe('VALIDATION_FAILED');
    expect(res.body.error.details).toEqual([
      expect.objectContaining({ field }),
    ]);
  });

  it('concurrent first calls create one Learner', async () => {
    const auth = await token();
    const results = await Promise.all(
      [1, 2, 3].map(() =>
        request(app.getHttpServer())
          .get('/v1/me')
          .auth(auth, { type: 'bearer' }),
      ),
    );

    expect(results.map((r) => r.status)).toEqual([200, 200, 200]);
  });
});
