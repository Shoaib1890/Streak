import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { GameService } from '../services/game.service.js';

const gameService = new GameService();

// Validation schema for fetching today's game
export const getTodayGameSchema = {
  query: z.object({
    playerId: z.string({
      required_error: 'playerId is required',
    }).uuid('Invalid player ID format'),
  }),
};

// Validation schema for submitting a guess
export const submitGuessSchema = {
  body: z.object({
    playerId: z.string({
      required_error: 'playerId is required',
    }).uuid('Invalid player ID format'),
    guess: z
      .string({
        required_error: 'guess is required',
      })
      .trim()
      .min(1, 'Guess cannot be empty')
      .max(100, 'Guess cannot exceed 100 characters'),
  }),
};

/**
 * Controller class managing puzzle gameplay endpoints.
 */
export class GameController {
  /**
   * Retrieves today's active puzzle description and the player's status.
   */
  async getTodayGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const playerId = req.query.playerId as string;
      const gameInfo = await gameService.getTodayGame(playerId);
      res.status(200).json(gameInfo);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Evaluates a player's daily guess submission.
   */
  async submitGuess(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { playerId, guess } = req.body;
      const result = await gameService.submitGuess(playerId, guess);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
