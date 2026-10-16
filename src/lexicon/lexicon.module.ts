import { Module } from '@nestjs/common';
import { LexiconController } from './lexicon.controller.js';
import { LexiconService } from './lexicon.service.js';

@Module({
  controllers: [LexiconController],
  providers: [LexiconService],
})
export class LexiconModule {}
