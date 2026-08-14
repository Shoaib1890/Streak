import { DbRepository } from '../repositories/db.repository.js';
import { normalizeAnswer } from '../lib/normalize.js';
import { calculateStreak, getDisplayedStreak } from './streak.service.js';
import { getCurrentGameDate, getCurrentGameDateAsJSDate, isConsecutiveDay } from '../lib/date.js';
import { getPlayerStreakContext } from '../lib/playerStreak.js';
import { AppError } from '../middleware/errorHandler.js';

export interface GetTodayGameResult {
  gameDate: string;
  puzzle: {
    id: string;
    type: string;
    title: string;
    question: string;
    difficulty: string;
  };
  player: {
    currentStreak: number;
    longestStreak: number;
    hasPlayedToday: boolean;
    missedDay?: boolean;
    todayAttempt?: {
      correct: boolean;
      guess: string;
      answer: string;
    };
  };
}

export interface SubmitGuessResult {
  correct: boolean;
  previousStreak: number;
  currentStreak: number;
  longestStreak: number;
  answer: string;
  guess: string;
}

export class GameService {
  private dbRepository = new DbRepository();

  /**
   * Loads today's active puzzle and checks the player's play status (read-only).
   */
  async getTodayGame(playerId: string): Promise<GetTodayGameResult> {
    const todayStr = getCurrentGameDate();
    const todayDate = getCurrentGameDateAsJSDate();

    const puzzle = await this.dbRepository.getPublishedPuzzleByDate(todayDate);
    if (!puzzle) {
      throw new AppError(404, 'PUZZLE_NOT_FOUND', "Today's puzzle isn't available yet. We're fixing it.");
    }

    const player = await this.dbRepository.getPlayerById(playerId);
    if (!player) {
      throw new AppError(404, 'PLAYER_NOT_FOUND', 'Player not found.');
    }

    const { lastPlayedDateStr, lastAttemptCorrect } = getPlayerStreakContext(player);
    const hasPlayedToday = lastPlayedDateStr === todayStr;
    const displayedStreak = getDisplayedStreak({
      currentStreak: player.currentStreak,
      lastPlayedDateStr,
      lastAttemptCorrect,
      todayDateStr: todayStr,
    });

    const missedDay =
      !hasPlayedToday &&
      lastPlayedDateStr !== null &&
      !isConsecutiveDay(lastPlayedDateStr, todayStr);

    let todayAttempt: GetTodayGameResult['player']['todayAttempt'];
    if (hasPlayedToday) {
      const attempt = await this.dbRepository.getAttempt(playerId, puzzle.id);
      if (attempt) {
        todayAttempt = {
          correct: attempt.isCorrect,
          guess: attempt.guess,
          answer: puzzle.answer,
        };
      }
    }

    return {
      gameDate: todayStr,
      puzzle: {
        id: puzzle.id,
        type: puzzle.type,
        title: puzzle.title,
        question: puzzle.question,
        difficulty: puzzle.difficulty,
      },
      player: {
        currentStreak: displayedStreak,
        longestStreak: player.longestStreak,
        hasPlayedToday,
        ...(missedDay ? { missedDay: true } : {}),
        ...(todayAttempt ? { todayAttempt } : {}),
      },
    };
  }

  /**
   * Processes a player's daily guess submission.
   * Duplicate submissions return the original stored result (idempotent).
   */
  async submitGuess(playerId: string, guess: string): Promise<SubmitGuessResult> {
    const todayStr = getCurrentGameDate();
    const todayDate = getCurrentGameDateAsJSDate();

    const puzzle = await this.dbRepository.getPublishedPuzzleByDate(todayDate);
    if (!puzzle) {
      throw new AppError(404, 'PUZZLE_NOT_FOUND', "Today's puzzle isn't available yet. We're fixing it.");
    }

    const player = await this.dbRepository.getPlayerById(playerId);
    if (!player) {
      throw new AppError(404, 'PLAYER_NOT_FOUND', 'Player not found.');
    }

    const existingAttempt = await this.dbRepository.getAttempt(playerId, puzzle.id);
    if (existingAttempt) {
      return this.buildSubmitResultFromAttempt(existingAttempt, player, puzzle.answer);
    }

    const { lastPlayedDateStr, lastAttemptCorrect } = getPlayerStreakContext(player);

    const normalizedGuess = normalizeAnswer(guess);
    const normalizedAnswer = normalizeAnswer(puzzle.answer);
    const isCorrect = normalizedGuess === normalizedAnswer;

    const displayedStreakBefore = getDisplayedStreak({
      currentStreak: player.currentStreak,
      lastPlayedDateStr,
      lastAttemptCorrect,
      todayDateStr: todayStr,
    });

    const { newCurrentStreak, newLongestStreak } = calculateStreak({
      currentStreak: displayedStreakBefore,
      longestStreak: player.longestStreak,
      lastPlayedDateStr,
      lastAttemptCorrect,
      todayDateStr: todayStr,
      currentCorrect: isCorrect,
    });

    const record = await this.dbRepository.recordAttemptTransaction({
      playerId,
      puzzleId: puzzle.id,
      gameDate: todayDate,
      guess,
      isCorrect,
      previousStreak: displayedStreakBefore,
      newCurrentStreak,
      newLongestStreak,
    });

    return this.buildSubmitResultFromAttempt(record.attempt, record.player, puzzle.answer);
  }

  /**
   * Retrieves player's statistics.
   */
  async getPlayerStats(playerId: string) {
    const player = await this.dbRepository.getPlayerById(playerId);
    if (!player) {
      throw new AppError(404, 'PLAYER_NOT_FOUND', 'Player not found.');
    }

    const { lastPlayedDateStr, lastAttemptCorrect } = getPlayerStreakContext(player);
    const todayStr = getCurrentGameDate();

    const displayedStreak = getDisplayedStreak({
      currentStreak: player.currentStreak,
      lastPlayedDateStr,
      lastAttemptCorrect,
      todayDateStr: todayStr,
    });

    const accuracy = player.totalGames > 0 ? player.totalCorrect / player.totalGames : 0;

    return {
      currentStreak: displayedStreak,
      longestStreak: player.longestStreak,
      totalGames: player.totalGames,
      totalCorrect: player.totalCorrect,
      accuracy: parseFloat(accuracy.toFixed(4)),
    };
  }

  private buildSubmitResultFromAttempt(
    attempt: { isCorrect: boolean; previousStreak: number; guess: string },
    player: { currentStreak: number; longestStreak: number },
    answer: string
  ): SubmitGuessResult {
    return {
      correct: attempt.isCorrect,
      previousStreak: attempt.previousStreak,
      currentStreak: player.currentStreak,
      longestStreak: player.longestStreak,
      answer,
      guess: attempt.guess,
    };
  }
}
