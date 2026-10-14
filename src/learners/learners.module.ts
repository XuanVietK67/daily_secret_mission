import { Module } from '@nestjs/common';
import { LearnersController } from './learners.controller.js';
import { LearnersService } from './learners.service.js';

@Module({
  controllers: [LearnersController],
  providers: [LearnersService],
})
export class LearnersModule {}
