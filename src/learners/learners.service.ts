import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { LearnerDto } from './dto/learner.dto.js';
import { UpdateLearnerDto } from './dto/update-learner.dto.js';

@Injectable()
export class LearnersService {
  constructor(private readonly prisma: PrismaService) {}

  /** The Learner row is created on the first authenticated call; upsert keeps concurrent first calls safe. */
  async getOrCreate(id: string): Promise<LearnerDto> {
    return LearnerDto.from(
      await this.prisma.learner.upsert({
        where: { id },
        create: { id },
        update: {},
      }),
    );
  }

  async update(id: string, changes: UpdateLearnerDto): Promise<LearnerDto> {
    return LearnerDto.from(
      await this.prisma.learner.upsert({
        where: { id },
        create: Object.assign({ id }, changes),
        update: changes,
      }),
    );
  }
}
