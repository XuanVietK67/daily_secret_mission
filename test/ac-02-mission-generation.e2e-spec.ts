import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { createTestApp } from './app.js';
import { lexiconSense, onboardedLearner } from './fixtures.js';

describe('AC-02 Mission generation', () => {
  let app: INestApplication;
  let token: Awaited<ReturnType<typeof createTestApp>>['token'];
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, token } = await createTestApp());
    prisma = app.get(PrismaService);
    // Enough New material even on a fresh database.
    for (let i = 0; i < 5; i++) await lexiconSense(prisma);
  });
  afterAll(() => app.close());

  const start = async (learnerId: string, status: number, body = {}) =>
    request(app.getHttpServer())
      .post('/v1/missions')
      .auth(await token(learnerId), { type: 'bearer' })
      .send(body)
      .expect(status);

  const get = async (path: string, learnerId: string, status: number) =>
    request(app.getHttpServer())
      .get(`/v1/missions/${path}`)
      .auth(await token(learnerId), { type: 'bearer' })
      .expect(status);

  it('a Learner who chose 5 Senses gets 5 distinct Targets, each tagged with its Source', async () => {
    const { id } = await onboardedLearner(prisma);

    const { body } = await start(id, 201);

    expect(body).toMatchObject({ status: 'open', mode: 'daily' });
    expect(body.targets).toHaveLength(5);
    const senseIds = body.targets.map(
      (t: { sense: { id: string } }) => t.sense.id,
    );
    expect(new Set(senseIds).size).toBe(5);
    for (const [position, target] of body.targets.entries()) {
      expect(target).toMatchObject({ position, state: 'pending' });
      expect(['new', 'review', 'personal']).toContain(target.source);
      expect(target.sense.headword).toEqual(expect.any(String));
    }
    expect(
      await prisma.learnerSense.count({
        where: { learnerId: id, senseId: { in: senseIds } },
      }),
    ).toBe(5);
  });

  it('uses the requested Mode, with its expected minutes', async () => {
    const { id } = await onboardedLearner(prisma);

    const { body } = await start(id, 201, { mode: 'deep' });

    expect(body).toMatchObject({
      mode: 'deep',
      minutes: { min: 15, max: 20 },
    });
  });

  it.each([
    ['a Learner with no profile yet', async () => randomUUID()],
    [
      'a Learner with a level but no time zone',
      async () =>
        (await onboardedLearner(prisma, randomUUID(), { timeZone: null })).id,
    ],
  ])('refuses %s', async (_, learner) => {
    const { body } = await start(await learner(), 422);

    expect(body.error.code).toBe('ONBOARDING_REQUIRED');
  });

  it('refuses a second Mission while one is Open', async () => {
    const { id } = await onboardedLearner(prisma);
    await start(id, 201);

    const { body } = await start(id, 409);

    expect(body.error.code).toBe('MISSION_ALREADY_OPEN');
  });

  it('concurrent requests open one Mission', async () => {
    const { id } = await onboardedLearner(prisma);
    const auth = await token(id);

    const results = await Promise.all(
      [1, 2, 3].map(() =>
        request(app.getHttpServer())
          .post('/v1/missions')
          .auth(auth, { type: 'bearer' }),
      ),
    );

    expect(results.map((r) => r.status).sort((a, b) => a - b)).toEqual([
      201, 409, 409,
    ]);
  });

  it('GET current returns the Open Mission, or 204 when there is none', async () => {
    const { id } = await onboardedLearner(prisma);
    await get('current', id, 204);
    const { body: mission } = await start(id, 201);

    const { body } = await get('current', id, 200);

    expect(body).toEqual(mission);
  });

  it("GET :id returns the Learner's Mission and hides another Learner's", async () => {
    const { id } = await onboardedLearner(prisma);
    const { body: mission } = await start(id, 201);

    await get(mission.id, id, 200);
    const { body } = await get(mission.id, randomUUID(), 404);

    expect(body.error.code).toBe('MISSION_NOT_FOUND');
  });
});
