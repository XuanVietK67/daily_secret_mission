import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SenseDto } from './dto/sense.dto.js';

@Injectable()
export class LexiconService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lexicon Senses (archived ones too: history points at them) and the Learner's own Senses. Anything else is 404. */
  async getSense(learnerId: string, id: string): Promise<SenseDto> {
    const sense = await this.prisma.sense.findFirst({
      where: { id, OR: [{ origin: 'lexicon' }, { ownerLearnerId: learnerId }] },
      include: { headword: true },
    });
    if (!sense) {
      throw new NotFoundException({
        code: 'SENSE_NOT_FOUND',
        message: 'Sense not found',
      });
    }
    return SenseDto.from(sense);
  }
}
