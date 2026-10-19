import { IsEnum, IsOptional } from 'class-validator';
import { MissionMode } from '../../generated/prisma/enums.js';

export class CreateMissionDto {
  /** Defaults to the Learner's default Mode. */
  @IsOptional()
  @IsEnum(MissionMode)
  mode?: MissionMode;
}
