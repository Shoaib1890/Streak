import { prisma } from '../lib/prisma.js';
import { Player, Puzzle, Attempt } from '@prisma/client';
import { Prisma } from '@prisma/client';

export type AttemptRecordResult =
  | { kind: 'created'; attempt: Attempt; player: Player }
  | { kind: 'existing'; attempt: Attempt; player: Player };

/**
 * Repository layer separating Prisma client from direct service access.
 */
export class DbRepository {
  /**
   * Fetches a player by UUID.
   */
  async getPlayerById(playerId: string): Promise<Player | null> {
    return prisma.player.findUnique({
      where: { id: playerId },
    });
  }

  /**
   * Creates a new player record.
   */
  async createPlayer(displayName: string): Promise<Player> {
    return prisma.player.create({
      data: {
        displayName,
      },
    });
  }

  /**
   * Retrieves a published puzzle by game date.
   */
  async getPublishedPuzzleByDate(date: Date): Promise<Puzzle | null> {
    return prisma.puzzle.findFirst({
      where: {
        gameDate: date,
        status: 'PUBLISHED',
      },
    });
  }

  /**
   * Finds a player's attempt for a specific puzzle.
   */
  async getAttempt(playerId: string, puzzleId: string): Promise<Attempt | null> {
    return prisma.attempt.findUnique({
      where: {
        uniquePlayerPuzzle: {
          playerId,
          puzzleId,
        },
      },
    });
  }

  /**
   * Executes atomic database transaction to record an attempt and update player statistics.
   * Returns an existing attempt when one is already present (idempotent replay).
   */
  async recordAttemptTransaction(params: {
    playerId: string;
    puzzleId: string;
    gameDate: Date;
    guess: string;
    isCorrect: boolean;
    previousStreak: number;
    newCurrentStreak: number;
    newLongestStreak: number;
  }): Promise<AttemptRecordResult> {
    try {
      return await prisma.$transaction(async (tx) => {
        const existing = await tx.attempt.findUnique({
          where: {
            uniquePlayerPuzzle: {
              playerId: params.playerId,
              puzzleId: params.puzzleId,
            },
          },
        });

        if (existing) {
          const player = await tx.player.findUniqueOrThrow({
            where: { id: params.playerId },
          });
          return { kind: 'existing', attempt: existing, player };
        }

        const attempt = await tx.attempt.create({
          data: {
            playerId: params.playerId,
            puzzleId: params.puzzleId,
            guess: params.guess,
            isCorrect: params.isCorrect,
            previousStreak: params.previousStreak,
          },
        });

        const player = await tx.player.update({
          where: { id: params.playerId },
          data: {
            currentStreak: params.newCurrentStreak,
            longestStreak: params.newLongestStreak,
            totalGames: { increment: 1 },
            totalCorrect: { increment: params.isCorrect ? 1 : 0 },
            lastPlayedGameDate: params.gameDate,
            lastAttemptCorrect: params.isCorrect,
          },
        });

        return { kind: 'created', attempt, player };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const [attempt, player] = await Promise.all([
          this.getAttempt(params.playerId, params.puzzleId),
          this.getPlayerById(params.playerId),
        ]);
        if (attempt && player) {
          return { kind: 'existing', attempt, player };
        }
      }
      throw error;
    }
  }
}
