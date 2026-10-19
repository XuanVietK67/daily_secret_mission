/** PRD starting values (docs/domain-rules.md#tunables). Changing one is a code change with a test. */
export const learningConfig = {
  // min/max are mirrored by the CHECK on learner.senses_per_mission.
  sensesPerMission: { presets: [3, 5], min: 1, max: 10 },
  /** Expected length per Mission Mode, shown by the app; a Mode never drops a Target (BR-01). */
  modeMinutes: {
    quick: { min: 3, max: 5 },
    daily: { min: 10, max: 10 },
    deep: { min: 15, max: 20 },
  },
  /** Share of a Mission's Targets per Source (BR-02). */
  sourceRatio: { new: 0.6, review: 0.3, personal: 0.1 },
  /** Most of a Mission that Review may take while New Senses remain, rounded down (PRD §13). */
  reviewMaxShare: 0.6,
} as const;
