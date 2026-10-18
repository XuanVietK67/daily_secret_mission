import { randomUUID } from 'node:crypto';
import type { Prisma } from '../src/generated/prisma/client.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

type SenseOverrides = Partial<Prisma.SenseUncheckedCreateInput>;

/** A fresh Headword; the random suffix keeps runs apart because the test database is never truncated. */
const headword = (prisma: PrismaService) => {
  const text = `test-${randomUUID()}`;
  return prisma.headword.create({ data: { text, normalizedText: text } });
};

/** A Lexicon Sense, as the Admin's import would create it. e2e tests never rely on imported data (ADR 0007). */
export async function lexiconSense(
  prisma: PrismaService,
  overrides: SenseOverrides = {},
) {
  const { id: headwordId } = await headword(prisma);
  return prisma.sense.create({
    data: {
      headwordId,
      lexiconKey: `test-${randomUUID()}.v.test`,
      partOfSpeech: 'verb',
      definition: 'to manage or be in charge of a business or activity',
      examples: ['She runs a small bakery near the station.'],
      difficulty: 'intermediate',
      rank: 1,
      ...overrides,
    },
    include: { headword: true },
  });
}

/** A Learner who finished onboarding: level `intermediate`, time zone `Asia/Ho_Chi_Minh`, 5 Senses per Mission. */
export function onboardedLearner(
  prisma: PrismaService,
  id: string = randomUUID(),
  overrides: Partial<Prisma.LearnerUncheckedCreateInput> = {},
) {
  const data = {
    selfAssessedLevel: 'intermediate',
    timeZone: 'Asia/Ho_Chi_Minh',
    ...overrides,
  } as const;
  return prisma.learner.upsert({
    where: { id },
    create: { ...data, id },
    update: data,
  });
}

/** A Lexicon Sense the Learner has met before, Due on `dueOn` (a local date). */
export async function dueSense(
  prisma: PrismaService,
  learnerId: string,
  dueOn: Date,
) {
  const sense = await lexiconSense(prisma);
  await prisma.learnerSense.create({
    data: {
      learnerId,
      senseId: sense.id,
      status: 'learning',
      reviewStep: 1,
      dueOn,
    },
  });
  return sense;
}

/** A Learner-owned Sense; creates the owning Learner if needed. */
export async function learnerSense(
  prisma: PrismaService,
  ownerLearnerId: string,
  overrides: SenseOverrides = {},
) {
  await prisma.learner.upsert({
    where: { id: ownerLearnerId },
    create: { id: ownerLearnerId },
    update: {},
  });
  const { id: headwordId } = await headword(prisma);
  return prisma.sense.create({
    data: {
      headwordId,
      origin: 'learner',
      ownerLearnerId,
      verification: 'learner_confirmed',
      partOfSpeech: 'noun',
      definition: 'a word the Learner added',
      examples: ['I wrote this word down myself.'],
      ...overrides,
    },
    include: { headword: true },
  });
}
