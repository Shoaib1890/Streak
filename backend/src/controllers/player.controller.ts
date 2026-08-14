import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { DbRepository } from '../repositories/db.repository.js';
import { GameService } from '../services/game.service.js';

const dbRepository = new DbRepository();
const gameService = new GameService();

// Validation schema for creating a player
export const createPlayerSchema = {
  body: z.object({
    displayName: z
      .string({
        required_error: 'displayName is required',
      })
      .trim()
      .min(1, 'Display name cannot be empty')
      .max(30, 'Display name cannot exceed 30 characters'),
  }),
};

// Validation schema for stats request
export const getStatsSchema = {
  params: z.object({
    playerId: z.string().uuid('Invalid player ID format'),
  }),
};

/**
 * Controller class managing player endpoints.
 */
export class PlayerController {
  /**
   * Registers a new anonymous player with cosmetic display name.
   */
  async createPlayer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { displayName } = req.body;
      const player = await dbRepository.createPlayer(displayName);
      
      res.status(201).json({
        playerId: player.id,
        displayName: player.displayName,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns a player's statistics and performance.
   */
  async getPlayerStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { playerId } = req.params;
      const stats = await gameService.getPlayerStats(playerId);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}
