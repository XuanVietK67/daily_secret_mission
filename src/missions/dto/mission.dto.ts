import { learningConfig } from '../../config/learning.config.js';
import type {
  Headword,
  Mission,
  Sense,
  Target,
} from '../../generated/prisma/client.js';
import type {
  MissionMode,
  MissionStatus,
  TargetSource,
  TargetState,
} from '../../generated/prisma/enums.js';
import { SenseDto } from '../../lexicon/dto/sense.dto.js';
import { formatDate } from '../../local-date.js';

export type MissionWithTargets = Mission & {
  targets: (Target & { sense: Sense & { headword: Headword } })[];
};

export class TargetDto {
  id: string;
  position: number;
  source: TargetSource;
  state: TargetState;
  sense: SenseDto;
}

export class MissionDto {
  id: string;
  mode: MissionMode;
  /** Expected length of the Mode, so the app never hardcodes it. */
  minutes: { min: number; max: number };
  status: MissionStatus;
  startedAt: Date;
  /** Local day, `YYYY-MM-DD`. */
  startedOn: string;
  completedAt: Date | null;
  completedOn: string | null;
  abandonedAt: Date | null;
  /** In display order: Review, then Personal, then New. */
  targets: TargetDto[];

  static from(mission: MissionWithTargets): MissionDto {
    const { id, mode, status, startedAt, completedAt, abandonedAt } = mission;
    return {
      id,
      mode,
      minutes: learningConfig.modeMinutes[mode],
      status,
      startedAt,
      startedOn: formatDate(mission.startedOn),
      completedAt,
      completedOn: mission.completedOn && formatDate(mission.completedOn),
      abandonedAt,
      targets: mission.targets.map(
        ({ id, position, source, state, sense }) => ({
          id,
          position,
          source,
          state,
          sense: SenseDto.from(sense),
        }),
      ),
    };
  }
}
