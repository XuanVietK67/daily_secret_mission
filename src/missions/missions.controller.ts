import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  type AuthLearner,
  CurrentLearner,
} from '../auth/current-learner.decorator.js';
import { IdParamsDto } from '../id-params.dto.js';
import { CreateMissionDto } from './dto/create-mission.dto.js';
import { MissionDto } from './dto/mission.dto.js';
import { MissionsService } from './missions.service.js';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missions: MissionsService) {}

  /** Starts a Mission with the Learner's N Targets (FR-02). `409` while another is Open. */
  @Post()
  create(
    @CurrentLearner() learner: AuthLearner,
    @Body() body: CreateMissionDto,
  ): Promise<MissionDto> {
    return this.missions.create(learner.id, body.mode);
  }

  /** The Open Mission, whichever day it started (BR-08), or `204`. */
  @Get('current')
  async current(
    @CurrentLearner() learner: AuthLearner,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MissionDto | undefined> {
    const mission = await this.missions.current(learner.id);
    if (!mission) res.status(HttpStatus.NO_CONTENT);
    return mission ?? undefined;
  }

  @Get(':id')
  get(
    @CurrentLearner() learner: AuthLearner,
    @Param() { id }: IdParamsDto,
  ): Promise<MissionDto> {
    return this.missions.get(learner.id, id);
  }

  /** Gives up the Open Mission; its unfinished Senses come back as Review. */
  @Post(':id/abandon')
  @HttpCode(HttpStatus.OK)
  abandon(
    @CurrentLearner() learner: AuthLearner,
    @Param() { id }: IdParamsDto,
  ): Promise<MissionDto> {
    return this.missions.abandon(learner.id, id);
  }
}
