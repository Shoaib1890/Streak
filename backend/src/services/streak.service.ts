import { isConsecutiveDay } from '../lib/date.js';

interface CalculateStreakInput {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDateStr: string | null; // YYYY-MM-DD
  lastAttemptCorrect: boolean | null;
  todayDateStr: string; // YYYY-MM-DD
  currentCorrect: boolean;
}

interface CalculateStreakResult {
  newCurrentStreak: number;
  newLongestStreak: number;
}

interface GetDisplayedStreakInput {
  currentStreak: number;
  lastPlayedDateStr: string | null; // YYYY-MM-DD
  lastAttemptCorrect: boolean | null;
  todayDateStr: string; // YYYY-MM-DD
}

/**
 * Calculates the new streak state for a player after submitting a guess.
 */
export function calculateStreak(input: CalculateStreakInput): CalculateStreakResult {
  const {
    currentStreak,
    longestStreak,
    lastPlayedDateStr,
    lastAttemptCorrect,
    todayDateStr,
    currentCorrect,
  } = input;

  let newCurrentStreak = 0;

  if (!lastPlayedDateStr) {
    // New player (first time playing)
    newCurrentStreak = currentCorrect ? 1 : 0;
  } else {
    // Check if the last attempt was played yesterday
    const isConsecutive = isConsecutiveDay(lastPlayedDateStr, todayDateStr);

    if (isConsecutive) {
      if (lastAttemptCorrect) {
        newCurrentStreak = currentCorrect ? currentStreak + 1 : 0;
      } else {
        // Last attempt was incorrect (streak was already 0), correct today starts a new streak of 1
        newCurrentStreak = currentCorrect ? 1 : 0;
      }
    } else {
      // Missed one or more days, streak is broken. Correct today starts a new streak of 1
      newCurrentStreak = currentCorrect ? 1 : 0;
    }
  }

  const newLongestStreak = Math.max(longestStreak, newCurrentStreak);

  return {
    newCurrentStreak,
    newLongestStreak,
  };
}

/**
 * Calculates the display streak for a player before they submit today's guess.
 * Since we do not run background cron jobs to reset streaks of inactive players,
 * we dynamically detect missed days when loading the player state.
 */
export function getDisplayedStreak(input: GetDisplayedStreakInput): number {
  const { currentStreak, lastPlayedDateStr, lastAttemptCorrect, todayDateStr } = input;

  if (!lastPlayedDateStr) {
    return 0;
  }

  // If the player already played today
  if (lastPlayedDateStr === todayDateStr) {
    return lastAttemptCorrect ? currentStreak : 0;
  }

  // If the player played yesterday
  const isConsecutive = isConsecutiveDay(lastPlayedDateStr, todayDateStr);
  if (isConsecutive) {
    return lastAttemptCorrect ? currentStreak : 0;
  }

  // If the player missed yesterday (or longer), display streak is 0
  return 0;
}
