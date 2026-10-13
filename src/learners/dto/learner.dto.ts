import type { Learner } from '../../generated/prisma/client.js';
import type {
  MissionMode,
  SelfAssessedLevel,
} from '../../generated/prisma/enums.js';

export class LearnerDto {
  id: string;
  selfAssessedLevel: SelfAssessedLevel | null;
  goal: string | null;
  sensesPerMission: number;
  defaultMode: MissionMode;
  timeZone: string | null;
  /** True once level and time zone are set. Day-based endpoints refuse to run before that. */
  onboarded: boolean;

  static from(learner: Learner): LearnerDto {
    const {
      id,
      selfAssessedLevel,
      goal,
      sensesPerMission,
      defaultMode,
      timeZone,
    } = learner;
    return {
      id,
      selfAssessedLevel,
      goal,
      sensesPerMission,
      defaultMode,
      timeZone,
      onboarded: selfAssessedLevel !== null && timeZone !== null,
    };
  }
}
