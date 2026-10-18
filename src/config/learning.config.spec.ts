import { learningConfig } from './learning.config.js';

describe('learningConfig', () => {
  it('keeps the PRD defaults (BR-01)', () => {
    expect(learningConfig.sensesPerMission).toEqual({
      presets: [3, 5],
      min: 1,
      max: 10,
    });
    expect(learningConfig.modeMinutes).toEqual({
      quick: { min: 3, max: 5 },
      daily: { min: 10, max: 10 },
      deep: { min: 15, max: 20 },
    });
  });

  it('keeps the PRD Source mix and review guard (BR-02, §13)', () => {
    expect(learningConfig.sourceRatio).toEqual({
      new: 0.6,
      review: 0.3,
      personal: 0.1,
    });
    expect(learningConfig.reviewMaxShare).toBe(0.6);
  });
});
