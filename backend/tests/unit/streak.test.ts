import { describe, it, expect } from 'vitest';
import { calculateStreak, getDisplayedStreak } from '../../src/services/streak.service.js';

describe('Streak Calculation service', () => {
  describe('calculateStreak', () => {
    it('should initialize streak to 1 for a new player with correct answer', () => {
      const result = calculateStreak({
        currentStreak: 0,
        longestStreak: 0,
        lastPlayedDateStr: null,
        lastAttemptCorrect: null,
        todayDateStr: '2026-08-12',
        currentCorrect: true,
      });
      expect(result.newCurrentStreak).toBe(1);
      expect(result.newLongestStreak).toBe(1);
    });

    it('should initialize streak to 0 for a new player with wrong answer', () => {
      const result = calculateStreak({
        currentStreak: 0,
        longestStreak: 0,
        lastPlayedDateStr: null,
        lastAttemptCorrect: null,
        todayDateStr: '2026-08-12',
        currentCorrect: false,
      });
      expect(result.newCurrentStreak).toBe(0);
      expect(result.newLongestStreak).toBe(0);
    });

    it('should increment streak by 1 for consecutive day correct answer', () => {
      const result = calculateStreak({
        currentStreak: 5,
        longestStreak: 5,
        lastPlayedDateStr: '2026-08-11',
        lastAttemptCorrect: true,
        todayDateStr: '2026-08-12',
        currentCorrect: true,
      });
      expect(result.newCurrentStreak).toBe(6);
      expect(result.newLongestStreak).toBe(6);
    });

    it('should reset streak to 0 for consecutive day incorrect answer', () => {
      const result = calculateStreak({
        currentStreak: 5,
        longestStreak: 8,
        lastPlayedDateStr: '2026-08-11',
        lastAttemptCorrect: true,
        todayDateStr: '2026-08-12',
        currentCorrect: false,
      });
      expect(result.newCurrentStreak).toBe(0);
      expect(result.newLongestStreak).toBe(8); // longest streak remains
    });

    it('should start streak at 1 if last attempt was incorrect (consecutive day) but current is correct', () => {
      const result = calculateStreak({
        currentStreak: 0,
        longestStreak: 3,
        lastPlayedDateStr: '2026-08-11',
        lastAttemptCorrect: false,
        todayDateStr: '2026-08-12',
        currentCorrect: true,
      });
      expect(result.newCurrentStreak).toBe(1);
      expect(result.newLongestStreak).toBe(3);
    });

    it('should reset streak to 1 if user missed days and gets today correct', () => {
      const result = calculateStreak({
        currentStreak: 10,
        longestStreak: 12,
        lastPlayedDateStr: '2026-08-09', // missed 2026-08-10 and 2026-08-11
        lastAttemptCorrect: true,
        todayDateStr: '2026-08-12',
        currentCorrect: true,
      });
      expect(result.newCurrentStreak).toBe(1);
      expect(result.newLongestStreak).toBe(12);
    });

    it('should reset streak to 0 if user missed days and gets today wrong', () => {
      const result = calculateStreak({
        currentStreak: 10,
        longestStreak: 12,
        lastPlayedDateStr: '2026-08-09',
        lastAttemptCorrect: true,
        todayDateStr: '2026-08-12',
        currentCorrect: false,
      });
      expect(result.newCurrentStreak).toBe(0);
      expect(result.newLongestStreak).toBe(12);
    });
  });

  describe('getDisplayedStreak', () => {
    it('should return 0 if player has never played', () => {
      expect(getDisplayedStreak({
        currentStreak: 0,
        lastPlayedDateStr: null,
        lastAttemptCorrect: null,
        todayDateStr: '2026-08-12',
      })).toBe(0);
    });

    it('should return stored streak if player played yesterday and was correct', () => {
      expect(getDisplayedStreak({
        currentStreak: 5,
        lastPlayedDateStr: '2026-08-11',
        lastAttemptCorrect: true,
        todayDateStr: '2026-08-12',
      })).toBe(5);
    });

    it('should return 0 if player played yesterday and was incorrect', () => {
      expect(getDisplayedStreak({
        currentStreak: 0,
        lastPlayedDateStr: '2026-08-11',
        lastAttemptCorrect: false,
        todayDateStr: '2026-08-12',
      })).toBe(0);
    });

    it('should return 0 if player missed one day', () => {
      expect(getDisplayedStreak({
        currentStreak: 5,
        lastPlayedDateStr: '2026-08-10', // missed 2026-08-11
        lastAttemptCorrect: true,
        todayDateStr: '2026-08-12',
      })).toBe(0);
    });

    it('should return stored streak if player already played today and was correct', () => {
      expect(getDisplayedStreak({
        currentStreak: 6,
        lastPlayedDateStr: '2026-08-12',
        lastAttemptCorrect: true,
        todayDateStr: '2026-08-12',
      })).toBe(6);
    });

    it('should return 0 if player already played today and was incorrect', () => {
      expect(getDisplayedStreak({
        currentStreak: 0,
        lastPlayedDateStr: '2026-08-12',
        lastAttemptCorrect: false,
        todayDateStr: '2026-08-12',
      })).toBe(0);
    });
  });
});
