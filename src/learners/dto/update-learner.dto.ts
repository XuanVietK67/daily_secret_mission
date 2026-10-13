import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsTimeZone,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { learningConfig } from '../../config/learning.config.js';
import {
  MissionMode,
  SelfAssessedLevel,
} from '../../generated/prisma/enums.js';

/** Like @IsOptional(), but rejects null: the field can be left out, never cleared. */
const Optional = () => ValidateIf((_, value) => value !== undefined);

export class UpdateLearnerDto {
  @Optional()
  @IsEnum(SelfAssessedLevel)
  selfAssessedLevel?: SelfAssessedLevel;

  /** Send null to clear it. */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  goal?: string | null;

  @Optional()
  @IsInt()
  @Min(learningConfig.sensesPerMission.min)
  @Max(learningConfig.sensesPerMission.max)
  sensesPerMission?: number;

  @Optional()
  @IsEnum(MissionMode)
  defaultMode?: MissionMode;

  /** IANA name, e.g. `Asia/Ho_Chi_Minh`. Every local day (Streak, Due) is computed in it. */
  @Optional()
  @IsTimeZone()
  timeZone?: string;
}
