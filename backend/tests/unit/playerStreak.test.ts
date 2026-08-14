import { describe, it, expect } from 'vitest';
import { getPlayerStreakContext } from '../../src/lib/playerStreak.js';
import { parseGameDateToJSDate } from '../../src/lib/date.js';

describe('getPlayerStreakContext', () => {
  it('should return nulls for a new player', () => {
    expect(
      getPlayerStreakContext({
        id: '00000000-0000-0000-0000-000000000001',
        displayName: 'New',
        currentStreak: 0,
        longestStreak: 0,
        totalGames: 0,
        totalCorrect: 0,
        lastPlayedGameDate: null,
        lastAttemptCorrect: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).toEqual({
      lastPlayedDateStr: null,
      lastAttemptCorrect: null,
    });
  });

  it('should format lastPlayedGameDate as YYYY-MM-DD', () => {
    expect(
      getPlayerStreakContext({
        id: '00000000-0000-0000-0000-000000000001',
        displayName: 'Player',
        currentStreak: 3,
        longestStreak: 3,
        totalGames: 3,
        totalCorrect: 3,
        lastPlayedGameDate: parseGameDateToJSDate('2026-08-11'),
        lastAttemptCorrect: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).toEqual({
      lastPlayedDateStr: '2026-08-11',
      lastAttemptCorrect: true,
    });
  });
});
