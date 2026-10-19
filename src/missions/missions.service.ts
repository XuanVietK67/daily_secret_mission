import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import type { MissionMode } from '../generated/prisma/enums.js';
import { addDays, localDate } from '../local-date.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MissionDto } from './dto/mission.dto.js';
import { levelOrder, pickTargets } from './missions.rules.js';

const withTargets = {
  targets: {
    orderBy: { position: 'asc' },
    include: { sense: { include: { headword: true } } },
  },
} satisfies Prisma.MissionInclude;

const alreadyOpen = () =>
  new ConflictException({
    code: 'MISSION_ALREADY_OPEN',
    message: 'Finish or abandon the open Mission first',
  });

const notFound = () =>
  new NotFoundException({
    code: 'MISSION_NOT_FOUND',
    message: 'Mission not found',
  });

@Injectable()
export class MissionsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Picks the Learner's N Targets (docs/domain-rules.md#mission-generation-fr-02-br-01-br-02-ac-02-ac-03). */
  async create(learnerId: string, mode?: MissionMode): Promise<MissionDto> {
    const learner = await this.prisma.learner.findUnique({
      where: { id: learnerId },
    });
    if (!learner?.selfAssessedLevel || !learner.timeZone) {
      throw new UnprocessableEntityException({
        code: 'ONBOARDING_REQUIRED',
        message: 'Set a level and time zone first',
      });
    }
    const open = await this.prisma.mission.findFirst({
      where: { learnerId, status: 'open' },
      select: { id: true },
    });
    if (open) throw alreadyOpen();

    const n = learner.sensesPerMission;
    const today = localDate(new Date(), learner.timeZone);
    const due = await this.prisma.learnerSense.findMany({
      where: { learnerId, dueOn: { lte: today }, sense: { archivedAt: null } },
      select: { senseId: true, status: true, dueOn: true },
    });
    const fresh: string[] = [];
    for (const difficulty of levelOrder(learner.selfAssessedLevel)) {
      if (fresh.length >= n) break;
      const senses = await this.prisma.sense.findMany({
        where: {
          origin: 'lexicon',
          archivedAt: null,
          difficulty,
          progress: { none: { learnerId } },
        },
        orderBy: [{ rank: 'asc' }, { lexiconKey: 'asc' }],
        take: n,
        select: { id: true },
      });
      fresh.push(...senses.map((s) => s.id));
    }
    const targets = pickTargets({
      n,
      due: due.map(({ senseId, status, dueOn }) => ({
        senseId,
        status,
        dueOn: dueOn ?? today,
      })),
      personal: [], // Personal Senses arrive in Phase 9.
      fresh,
    });

    try {
      const mission = await this.prisma.$transaction(async (tx) => {
        const created = await tx.mission.create({
          data: {
            learnerId,
            mode: mode ?? learner.defaultMode,
            startedOn: today,
            targets: { create: targets },
          },
          include: withTargets,
        });
        await tx.learnerSense.createMany({
          data: targets.map(({ senseId }) => ({ learnerId, senseId })),
          skipDuplicates: true,
        });
        return created;
      });
      return MissionDto.from(mission);
    } catch (e) {
      // A concurrent request opened a Mission first (one_open_mission).
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      )
        throw alreadyOpen();
      throw e;
    }
  }

  async current(learnerId: string): Promise<MissionDto | null> {
    const mission = await this.prisma.mission.findFirst({
      where: { learnerId, status: 'open' },
      include: withTargets,
    });
    return mission && MissionDto.from(mission);
  }

  async get(learnerId: string, id: string): Promise<MissionDto> {
    const mission = await this.prisma.mission.findFirst({
      where: { id, learnerId },
      include: withTargets,
    });
    if (!mission) throw notFound();
    return MissionDto.from(mission);
  }

  /**
   * Unfinished Targets' Senses without a due date become Due the day after the Mission started:
   * back as Review from the next local day, never pushed later (BR-08, AC-11). Nothing is deleted.
   */
  abandon(learnerId: string, id: string): Promise<MissionDto> {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.mission.updateMany({
        where: { id, learnerId, status: 'open' },
        data: { status: 'abandoned', abandonedAt: new Date() },
      });
      const mission = await tx.mission.findFirst({
        where: { id, learnerId },
        include: withTargets,
      });
      if (!mission) throw notFound();
      if (count === 0) {
        throw new ConflictException({
          code: 'MISSION_NOT_OPEN',
          message: 'Only an open Mission can be abandoned',
        });
      }
      await tx.learnerSense.updateMany({
        where: {
          learnerId,
          dueOn: null,
          sense: {
            targets: {
              some: {
                missionId: id,
                state: { in: ['pending', 'needs_correction'] },
              },
            },
          },
        },
        data: { dueOn: addDays(mission.startedOn, 1) },
      });
      return MissionDto.from(mission);
    });
  }
}
