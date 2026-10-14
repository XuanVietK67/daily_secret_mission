import { learningConfig } from './learning.config.js';

describe('learningConfig', () => {
  it('keeps the PRD defaults (BR-01)', () => {
    expect(learningConfig.sensesPerMission).toEqual({
      presets: [3, 5],
      min: 1,
      max: 10,
    });
  });
});
