import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { addDays, localDate } from '../src/local-date.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { createTestApp } from './app.js';
import { dueSense, lexiconSense, onboardedLearner } from './fixtures.js';

describe('AC-03 no suitable Personal Senses', () => {
  let app: INestApplication;
  let token: Awaited<ReturnType<typeof createTestApp>>['token'];
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, token } = await createTestApp());
    prisma = app.get(PrismaService);
    for (let i = 0; i < 5; i++) await lexiconSense(prisma);
  });
  afterAll(() => app.close());

  const start = async (learnerId: string) =>
    request(app.getHttpServer())
      .post('/v1/missions')
      .auth(await token(learnerId), { type: 'bearer' })
      .expect(201);

  it('fills the empty Personal slot with a New Sense when nothing else is Due', async () => {
    const { id } = await onboardedLearner(prisma);

    const { body } = await start(id);

    expect(body.targets.map((t: { source: string }) => t.source)).toEqual([
      'new',
      'new',
      'new',
      'new',
      'new',
    ]);
  });

  it('gives the empty Personal slot to Review when more Senses are Due', async () => {
    const { id } = await onboardedLearner(prisma);
    const today = localDate(new Date(), 'Asia/Ho_Chi_Minh');
    const dueToday = await dueSense(prisma, id, today);
    const dueEarlier = await dueSense(prisma, id, addDays(today, -1));

    const { body } = await start(id);

    expect(
      body.targets.map((t: { source: string; sense: { id: string } }) => [
        t.source,
        t.sense.id,
      ]),
    ).toEqual([
      ['review', dueEarlier.id],
      ['review', dueToday.id],
      ['new', expect.any(String)],
      ['new', expect.any(String)],
      ['new', expect.any(String)],
    ]);
  });
});
