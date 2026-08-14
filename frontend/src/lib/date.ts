import { DateTime } from 'luxon';

const GAME_TIMEZONE = 'Asia/Kolkata';

/**
 * Remaining seconds until the next midnight in Asia/Kolkata (game-day boundary).
 */
export function getSecondsToKolkataMidnight(): number {
  const now = DateTime.now().setZone(GAME_TIMEZONE);
  const tomorrow = now.plus({ days: 1 }).startOf('day');
  return Math.max(0, Math.ceil(tomorrow.diff(now, 'seconds').seconds));
}

/**
 * Formats duration in seconds into HH:MM:SS string.
 */
export function formatSecondsToHHMMSS(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}
