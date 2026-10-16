import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { createTestApp } from './app.js';
import { learnerSense, lexiconSense } from './fixtures.js';

describe('Lexicon: GET /v1/senses/:id', () => {
  let app: INestApplication;
  let token: Awaited<ReturnType<typeof createTestApp>>['token'];
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, token } = await createTestApp());
    prisma = app.get(PrismaService);
  });
  afterAll(() => app.close());

  const get = async (id: string, status: number, sub?: string) =>
    request(app.getHttpServer())
      .get(`/v1/senses/${id}`)
      .auth(await token(sub), { type: 'bearer' })
      .expect(status);

  it('returns a Lexicon Sense, with no IPA when none is verified', async () => {
    const sense = await lexiconSense(prisma, {
      collocations: ['run a business'],
    });

    const res = await get(sense.id, 200);

    expect(res.body).toEqual({
      id: sense.id,
      headword: sense.headword.text,
      partOfSpeech: 'verb',
      definition: sense.definition,
      pronunciationIpa: null,
      examples: sense.examples,
      collocations: ['run a business'],
    });
  });

  it('still returns an archived Lexicon Sense', async () => {
    const sense = await lexiconSense(prisma, { archivedAt: new Date() });

    await get(sense.id, 200);
  });

  it("returns the Learner's own Sense", async () => {
    const owner = randomUUID();
    const sense = await learnerSense(prisma, owner);

    const res = await get(sense.id, 200, owner);

    expect(res.body.id).toBe(sense.id);
  });

  it("hides another Learner's Sense", async () => {
    const sense = await learnerSense(prisma, randomUUID());

    const res = await get(sense.id, 404);

    expect(res.body.error.code).toBe('SENSE_NOT_FOUND');
  });

  it('404s an unknown id', async () => {
    const res = await get(randomUUID(), 404);

    expect(res.body.error.code).toBe('SENSE_NOT_FOUND');
  });

  it('rejects an id that is not a UUID', async () => {
    const res = await get('not-a-uuid', 400);

    expect(res.body.error.code).toBe('VALIDATION_FAILED');
    expect(res.body.error.details).toEqual([
      expect.objectContaining({ field: 'id' }),
    ]);
  });
});
