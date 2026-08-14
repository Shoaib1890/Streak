/**
 * Calculates remaining seconds until the next midnight in Asia/Kolkata timezone.
 * We calculate this by mapping local system time to UTC, applying the Asia/Kolkata offset (UTC +5:30),
 * and finding the difference to the next calendar date boundary.
 */
export function getSecondsToKolkataMidnight(): number {
  const now = new Date();
  
  // Get time in UTC
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  
  // Shift to Asia/Kolkata (UTC + 5.5 hours)
  const kolkataTime = new Date(utcTime + (3600000 * 5.5));
  
  // Set to next midnight (start of next day)
  const nextMidnight = new Date(kolkataTime);
  nextMidnight.setHours(24, 0, 0, 0);
  
  const diffMs = nextMidnight.getTime() - kolkataTime.getTime();
  return Math.max(0, Math.ceil(diffMs / 1000));
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
