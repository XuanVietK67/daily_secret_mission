import { Controller, Get, Param } from '@nestjs/common';
import {
  type AuthLearner,
  CurrentLearner,
} from '../auth/current-learner.decorator.js';
import { IdParamsDto } from '../id-params.dto.js';
import { SenseDto } from './dto/sense.dto.js';
import { LexiconService } from './lexicon.service.js';

@Controller('senses')
export class LexiconController {
  constructor(private readonly lexicon: LexiconService) {}

  /** Sense details: meaning, part of speech, IPA if present, examples, collocations (FR-03). */
  @Get(':id')
  get(
    @CurrentLearner() learner: AuthLearner,
    @Param() { id }: IdParamsDto,
  ): Promise<SenseDto> {
    return this.lexicon.getSense(learner.id, id);
  }
}
