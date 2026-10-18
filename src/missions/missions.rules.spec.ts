import {
  type DueSense,
  levelOrder,
  pickTargets,
  splitQuotas,
} from './missions.rules.js';

const ids = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, i) => `${prefix}${i}`);

/** Due Senses d0, d1, … with ascending due dates, so their review order is d0 first. */
const due = (count: number): DueSense[] =>
  ids('d', count).map((senseId, i) => ({
    senseId,
    status: 'learning',
    dueOn: new Date(Date.UTC(2026, 9, 1 + i)),
  }));

const sources = (targets: ReturnType<typeof pickTargets>) =>
  targets.map((t) => t.source);

describe('splitQuotas', () => {
  it.each([
    [1, { new: 1, review: 0, personal: 0 }],
    [3, { new: 2, review: 1, personal: 0 }],
    [5, { new: 3, review: 1, personal: 1 }],
    [10, { new: 6, review: 3, personal: 1 }],
  ])('splits N=%i by the Source mix', (n, quotas) => {
    expect(splitQuotas(n)).toEqual(quotas);
  });

  it('always adds up to N', () => {
    for (let n = 1; n <= 10; n++) {
      const { new: fresh, review, personal } = splitQuotas(n);
      expect(fresh + review + personal).toBe(n);
    }
  });
});

describe('levelOrder', () => {
  it.each([
    ['basic', ['basic', 'intermediate']],
    ['intermediate', ['intermediate', 'advanced', 'basic']],
    ['advanced', ['advanced', 'intermediate']],
  ] as const)('%s → %j', (level, order) => {
    expect(levelOrder(level)).toEqual(order);
  });
});

describe('pickTargets', () => {
  it('fills every slot with New Senses, in order, when nothing is Due', () => {
    const targets = pickTargets({
      n: 5,
      due: [],
      personal: [],
      fresh: ids('n', 10),
    });

    expect(targets).toEqual(
      ids('n', 5).map((senseId, position) => ({
        senseId,
        source: 'new',
        position,
      })),
    );
  });

  it('gives an empty Personal slot to Review when more Senses are Due (AC-03)', () => {
    const targets = pickTargets({
      n: 5,
      due: due(2),
      personal: [],
      fresh: ids('n', 10),
    });

    expect(sources(targets)).toEqual(['review', 'review', 'new', 'new', 'new']);
  });

  it('gives an empty Personal slot to New when nothing else is Due (AC-03)', () => {
    const targets = pickTargets({
      n: 5,
      due: due(1),
      personal: [],
      fresh: ids('n', 10),
    });

    expect(sources(targets)).toEqual(['review', 'new', 'new', 'new', 'new']);
  });

  it('fills Personal slots from the list, ordered Review, Personal, New', () => {
    const targets = pickTargets({
      n: 5,
      due: due(1),
      personal: ['p0', 'p1'],
      fresh: ids('n', 10),
    });

    expect(targets.map((t) => t.senseId)).toEqual([
      'd0',
      'p0',
      'n0',
      'n1',
      'n2',
    ]);
    expect(sources(targets)).toEqual([
      'review',
      'personal',
      'new',
      'new',
      'new',
    ]);
  });

  it('tags a Due Sense on the Personal list as review, never twice', () => {
    const targets = pickTargets({
      n: 5,
      due: due(1),
      personal: ['d0', 'p0'],
      fresh: ['d0', ...ids('n', 10)],
    });

    expect(targets.filter((t) => t.senseId === 'd0')).toEqual([
      { senseId: 'd0', source: 'review', position: 0 },
    ]);
    expect(targets[1]).toMatchObject({ senseId: 'p0', source: 'personal' });
  });

  it.each([
    [5, 3],
    [3, 1],
    [1, 0],
  ])(
    'lets Due Senses take New slots only up to floor(0.6 × N): N=%i → %i review',
    (n, reviews) => {
      const targets = pickTargets({
        n,
        due: due(10),
        personal: [],
        fresh: ids('n', 10),
      });

      expect(targets).toHaveLength(n);
      expect(targets.filter((t) => t.source === 'review')).toHaveLength(
        reviews,
      );
    },
  );

  it('fills empty New slots with Due Senses past the cap when the Lexicon runs dry', () => {
    const targets = pickTargets({
      n: 5,
      due: due(10),
      personal: [],
      fresh: ['n0'],
    });

    expect(sources(targets)).toEqual([
      'review',
      'review',
      'review',
      'review',
      'new',
    ]);
  });

  it('creates fewer Targets rather than padding (AC-03)', () => {
    const targets = pickTargets({
      n: 5,
      due: due(1),
      personal: [],
      fresh: ['n0', 'n1'],
    });

    expect(targets.map((t) => t.senseId)).toEqual(['d0', 'n0', 'n1']);
  });

  it('reviews Needs practice first, then the oldest due date', () => {
    const day = (d: number) => new Date(Date.UTC(2026, 9, d));
    const targets = pickTargets({
      n: 3,
      due: [
        { senseId: 'old', status: 'learning', dueOn: day(1) },
        { senseId: 'recent', status: 'learning', dueOn: day(9) },
        { senseId: 'missed', status: 'needs_practice', dueOn: day(5) },
      ],
      personal: [],
      fresh: [],
    });

    expect(targets.map((t) => t.senseId)).toEqual(['missed', 'old', 'recent']);
  });
});
