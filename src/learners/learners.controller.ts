import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  type AuthLearner,
  CurrentLearner,
} from '../auth/current-learner.decorator.js';
import { LearnerDto } from './dto/learner.dto.js';
import { UpdateLearnerDto } from './dto/update-learner.dto.js';
import { LearnersService } from './learners.service.js';

@Controller('me')
export class LearnersController {
  constructor(private readonly learners: LearnersService) {}

  /** The Learner's profile (FR-01). Creates the Learner on the first call. */
  @Get()
  get(@CurrentLearner() learner: AuthLearner): Promise<LearnerDto> {
    return this.learners.getOrCreate(learner.id);
  }

  /** Onboarding and settings: level, goal, Senses per Mission, default Mode, time zone. */
  @Patch()
  update(
    @CurrentLearner() learner: AuthLearner,
    @Body() body: UpdateLearnerDto,
  ): Promise<LearnerDto> {
    return this.learners.update(learner.id, body);
  }
}
