/** PRD starting values (docs/domain-rules.md#tunables). Changing one is a code change with a test. */
export const learningConfig = {
  // min/max are mirrored by the CHECK on learner.senses_per_mission.
  sensesPerMission: { presets: [3, 5], min: 1, max: 10 },
} as const;
