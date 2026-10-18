import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { addDays, formatDate, localDate } from '../src/local-date.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { createTestApp } from './app.js';
import { dueSense, lexiconSense, onboardedLearner } from './fixtures.js';

type MissionBody = {
  id: string;
  targets: { source: string; sense: { id: string } }[];
};

describe('AC-11 Mission spanning days', () => {
  let app: INestApplication;
  let token: Awaited<ReturnType<typeof createTestApp>>['token'];
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, token } = await createTestApp());
    prisma = app.get(PrismaService);
    for (let i = 0; i < 10; i++) await lexiconSense(prisma);
  });
  afterAll(() => app.close());

  const today = () => localDate(new Date(), 'Asia/Ho_Chi_Minh');
  const senseIds = (mission: MissionBody) =>
    mission.targets.map((t) => t.sense.id);

  const start = async (learnerId: string): Promise<MissionBody> =>
    (
      await request(app.getHttpServer())
        .post('/v1/missions')
        .auth(await token(learnerId), { type: 'bearer' })
        .expect(201)
    ).body;

  const abandon = async (missionId: string, learnerId: string, status = 200) =>
    request(app.getHttpServer())
      .post(`/v1/missions/${missionId}/abandon`)
      .auth(await token(learnerId), { type: 'bearer' })
      .expect(status);

  /** The Mission started on the previous local day. */
  const backdate = (missionId: string) =>
    prisma.mission.update({
      where: { id: missionId },
      data: { startedOn: addDays(today(), -1) },
    });

  const dueDates = async (learnerId: string, ids: string[]) =>
    (
      await prisma.learnerSense.findMany({
        where: { learnerId, senseId: { in: ids } },
      })
    ).map((row) => row.dueOn);

  it("yesterday's unfinished Mission is still the one to continue", async () => {
    const { id } = await onboardedLearner(prisma);
    const mission = await start(id);
    await backdate(mission.id);

    const { body } = await request(app.getHttpServer())
      .get('/v1/missions/current')
      .auth(await token(id), { type: 'bearer' })
      .expect(200);

    expect(body).toMatchObject({
      id: mission.id,
      status: 'open',
      startedOn: formatDate(addDays(today(), -1)),
    });
  });

  it('abandoning keeps unpractised Senses in review: Due the day after the Mission started', async () => {
    const { id } = await onboardedLearner(prisma);
    const mission = await start(id);
    await backdate(mission.id);

    const { body } = await abandon(mission.id, id);

    expect(body).toMatchObject({
      status: 'abandoned',
      abandonedAt: expect.any(String),
    });
    expect(await dueDates(id, senseIds(mission))).toEqual(
      Array(5).fill(today()),
    );
    const next = await start(id);
    const reviews = next.targets.filter((t) => t.source === 'review');
    // floor(0.6 × 5) = 3 come back now; the other 2 stay Due.
    expect(reviews).toHaveLength(3);
    expect(senseIds(mission)).toEqual(
      expect.arrayContaining(reviews.map((t) => t.sense.id)),
    );
  });

  it('keeps an earlier due date, and holds the rest until the next day', async () => {
    const { id } = await onboardedLearner(prisma);
    const overdue = await dueSense(prisma, id, addDays(today(), -3));
    const mission = await start(id);
    const others = senseIds(mission).filter((s) => s !== overdue.id);

    await abandon(mission.id, id);

    expect(await dueDates(id, [overdue.id])).toEqual([addDays(today(), -3)]);
    expect(await dueDates(id, others)).toEqual(
      Array(4).fill(addDays(today(), 1)),
    );
    const next = await start(id);
    expect(senseIds(next)).toContain(overdue.id);
    expect(senseIds(next).filter((s) => others.includes(s))).toEqual([]);
  });

  it('only an Open Mission can be abandoned, and only by its Learner', async () => {
    const { id } = await onboardedLearner(prisma);
    const mission = await start(id);

    await abandon(mission.id, randomUUID(), 404);
    await abandon(mission.id, id);
    const { body } = await abandon(mission.id, id, 409);

    expect(body.error.code).toBe('MISSION_NOT_OPEN');
  });
});
