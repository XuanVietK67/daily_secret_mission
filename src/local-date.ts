/** The Learner's calendar day at `now`, as UTC midnight: the value Prisma reads and writes for `@db.Date` columns. */
export function localDate(now: Date, timeZone: string): Date {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone }).format(now);
  return new Date(`${day}T00:00:00Z`);
}

/** Adds calendar days to a `localDate` value. Plain arithmetic is safe: UTC has no DST. */
export const addDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * 86_400_000);

/** `YYYY-MM-DD`, the API's shape for local days. */
export const formatDate = (date: Date): string =>
  date.toISOString().slice(0, 10);
