import { learningConfig } from '../config/learning.config.js';
import type {
  LearningStatus,
  SelfAssessedLevel,
  TargetSource,
} from '../generated/prisma/enums.js';

/** Shares are compared in integer hundredths, so float error never decides a tie or a rounding. */
const hundredths = (share: number) => Math.round(share * 100);

/**
 * Splits N by `sourceRatio` with the largest-remainder method; ties go to personal, then review, then new.
 * N=5 → 3 new · 1 review · 1 personal.
 */
export function splitQuotas(n: number): Record<TargetSource, number> {
  const order: TargetSource[] = ['personal', 'review', 'new'];
  const exact = order.map(
    (source) => hundredths(learningConfig.sourceRatio[source]) * n,
  );
  const quotas = { personal: 0, review: 0, new: 0 };
  order.forEach((source, i) => (quotas[source] = Math.floor(exact[i] / 100)));
  const left = n - quotas.personal - quotas.review - quotas.new;
  // Array sort is stable, so equal remainders keep the tie order above.
  order
    .map((source, i) => ({ source, remainder: exact[i] % 100 }))
    .sort((a, b) => b.remainder - a.remainder)
    .slice(0, left)
    .forEach(({ source }) => quotas[source]++);
  return quotas;
}

const LEVELS: SelfAssessedLevel[] = ['basic', 'intermediate', 'advanced'];

/** Levels New Senses are drawn from: the Learner's own, then one up, then one down, never skipping one. */
export function levelOrder(level: SelfAssessedLevel): SelfAssessedLevel[] {
  const i = LEVELS.indexOf(level);
  return [LEVELS[i], LEVELS[i + 1], LEVELS[i - 1]].filter(
    (l) => l !== undefined,
  );
}

export interface DueSense {
  senseId: string;
  status: LearningStatus;
  dueOn: Date;
}

export interface PickedTarget {
  senseId: string;
  source: TargetSource;
  position: number;
}

/** Needs practice first, then the oldest due date; the id only keeps the order stable. */
const byReviewPriority = (a: DueSense, b: DueSense) =>
  Number(b.status === 'needs_practice') -
    Number(a.status === 'needs_practice') ||
  a.dueOn.getTime() - b.dueOn.getTime() ||
  a.senseId.localeCompare(b.senseId);

/**
 * Picks a Mission's Targets (docs/domain-rules.md#mission-generation-fr-02-br-01-br-02-ac-02-ac-03).
 * `personal` and `fresh` (New candidates) arrive in priority order. Returns fewer than N Targets when
 * too few suitable Senses exist: a Mission is never padded (AC-03).
 */
export function pickTargets({
  n,
  due,
  personal,
  fresh,
}: {
  n: number;
  due: DueSense[];
  personal: string[];
  fresh: string[];
}): PickedTarget[] {
  const quotas = splitQuotas(n);
  const cap = Math.floor((hundredths(learningConfig.reviewMaxShare) * n) / 100);
  const dueIds = due.toSorted(byReviewPriority).map((d) => d.senseId);

  // A Due Sense is always tagged review, even when it is also on the Personal list.
  const personalIds = personal
    .filter((id) => !dueIds.includes(id))
    .slice(0, quotas.personal);
  // Review takes its quota, then empty Personal and New slots up to the cap.
  const reviewCount = Math.min(
    dueIds.length,
    Math.max(quotas.review, cap),
    n - personalIds.length,
  );
  const picked = new Set([...dueIds.slice(0, reviewCount), ...personalIds]);
  const newIds = fresh
    .filter((id) => !picked.has(id))
    .slice(0, n - personalIds.length - reviewCount);
  // New material ran out: remaining Due Senses fill in, past the cap.
  const reviewIds = dueIds.slice(0, n - personalIds.length - newIds.length);

  return [
    ...reviewIds.map((senseId) => ({ senseId, source: 'review' as const })),
    ...personalIds.map((senseId) => ({ senseId, source: 'personal' as const })),
    ...newIds.map((senseId) => ({ senseId, source: 'new' as const })),
  ].map((target, position) => ({ ...target, position }));
}
