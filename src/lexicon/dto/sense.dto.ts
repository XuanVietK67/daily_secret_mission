import type { Headword, Sense } from '../../generated/prisma/client.js';

export class SenseDto {
  id: string;
  headword: string;
  partOfSpeech: string;
  definition: string;
  /** Null when not verified: never show unverified pronunciation (FR-03). */
  pronunciationIpa: string | null;
  examples: string[];
  collocations: string[];

  static from(sense: Sense & { headword: Headword }): SenseDto {
    const {
      id,
      headword,
      partOfSpeech,
      definition,
      pronunciationIpa,
      examples,
      collocations,
    } = sense;
    return {
      id,
      headword: headword.text,
      partOfSpeech,
      definition,
      pronunciationIpa,
      examples,
      collocations,
    };
  }
}
