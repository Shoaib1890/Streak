import { DateTime } from 'luxon';

const GAME_TIMEZONE = 'Asia/Kolkata';

/**
 * Gets the current game date in YYYY-MM-DD format based on the Asia/Kolkata timezone.
 */
export function getCurrentGameDate(): string {
  return DateTime.now().setZone(GAME_TIMEZONE).toFormat('yyyy-MM-dd');
}

/**
 * Gets a Date object representing the current game date at 00:00:00 UTC.
 * This is used to query PostgreSQL's DATE type, which maps to UTC midnights in Prisma.
 */
export function getCurrentGameDateAsJSDate(): Date {
  const dateStr = getCurrentGameDate();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Calculates the number of seconds remaining until the next midnight rollover in Asia/Kolkata.
 */
export function getSecondsToNextRollover(): number {
  const now = DateTime.now().setZone(GAME_TIMEZONE);
  const tomorrow = now.plus({ days: 1 }).startOf('day');
  return Math.ceil(tomorrow.diff(now, 'seconds').seconds);
}

/**
 * Helper to convert a string date (YYYY-MM-DD) to a UTC JS Date at 00:00:00 UTC.
 */
export function parseGameDateToJSDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Helper to convert a UTC JS Date to a game date string in YYYY-MM-DD format.
 */
export function formatJSDateToGameDateString(date: Date): string {
  return DateTime.fromJSDate(date, { zone: 'UTC' }).toFormat('yyyy-MM-dd');
}

/**
 * Checks if dateB is exactly the day after dateA (both formatted as YYYY-MM-DD).
 */
export function isConsecutiveDay(dateAStr: string, dateBStr: string): boolean {
  const dtA = DateTime.fromISO(dateAStr, { zone: GAME_TIMEZONE });
  const dtB = DateTime.fromISO(dateBStr, { zone: GAME_TIMEZONE });
  return dtB.diff(dtA, 'days').days === 1;
}
