import { addDays, formatDate, localDate } from './local-date.js';

describe('localDate', () => {
  it('is already tomorrow in a zone ahead of UTC', () => {
    const day = localDate(new Date('2026-10-18T18:00:00Z'), 'Asia/Ho_Chi_Minh');

    expect(formatDate(day)).toBe('2026-10-19');
  });

  it('is still yesterday in a zone behind UTC', () => {
    const day = localDate(
      new Date('2026-10-18T05:00:00Z'),
      'America/Los_Angeles',
    );

    expect(formatDate(day)).toBe('2026-10-17');
  });
});

describe('addDays', () => {
  it('crosses a month end', () => {
    expect(formatDate(addDays(new Date('2026-10-31T00:00:00Z'), 1))).toBe(
      '2026-11-01',
    );
  });
});
