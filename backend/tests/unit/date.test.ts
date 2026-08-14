import { describe, it, expect, vi } from 'vitest';
import { Settings } from 'luxon';
import { 
  getCurrentGameDate, 
  getSecondsToNextRollover, 
  isConsecutiveDay, 
  parseGameDateToJSDate, 
  formatJSDateToGameDateString 
} from '../../src/lib/date.js';

describe('date utilities', () => {
  it('should parse and format JS dates to game date strings', () => {
    const jsDate = parseGameDateToJSDate('2026-08-12');
    expect(jsDate.getUTCFullYear()).toBe(2026);
    expect(jsDate.getUTCMonth()).toBe(7); // 0-indexed
    expect(jsDate.getUTCDate()).toBe(12);

    const formatted = formatJSDateToGameDateString(jsDate);
    expect(formatted).toBe('2026-08-12');
  });

  it('should correctly determine consecutive days in Asia/Kolkata', () => {
    expect(isConsecutiveDay('2026-08-12', '2026-08-13')).toBe(true);
    expect(isConsecutiveDay('2026-08-12', '2026-08-14')).toBe(false);
    expect(isConsecutiveDay('2026-08-12', '2026-08-12')).toBe(false);
    expect(isConsecutiveDay('2026-08-13', '2026-08-12')).toBe(false);
  });

  it('should return correct game date depending on mock time', () => {
    // 2026-08-12 23:59:00 UTC is 2026-08-13 05:29:00 in Kolkata
    const mockUtcTime = Date.UTC(2026, 7, 12, 23, 59, 0);
    const originalNow = Settings.now;
    Settings.now = () => mockUtcTime;

    expect(getCurrentGameDate()).toBe('2026-08-13');

    Settings.now = originalNow;
  });

  it('should calculate seconds to next rollover', () => {
    // Set mock time to 23:50:00 in Kolkata on 2026-08-12
    // Which is 18:20:00 UTC on 2026-08-12
    const mockUtcTime = Date.UTC(2026, 7, 12, 18, 20, 0);
    const originalNow = Settings.now;
    Settings.now = () => mockUtcTime;

    // Remaining seconds: 10 minutes * 60 = 600 seconds
    expect(getSecondsToNextRollover()).toBe(600);

    Settings.now = originalNow;
  });
});
