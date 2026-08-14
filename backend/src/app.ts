import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PlayerController, createPlayerSchema, getStatsSchema } from './controllers/player.controller.js';
import { GameController, getTodayGameSchema, submitGuessSchema } from './controllers/game.controller.js';
import { validate } from './middleware/validate.js';
import { rateLimit } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Setup CORS configuration
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) in development
      if (!origin && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      if (origin === allowedOrigin || origin === 'http://localhost:5173') {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Standard Middlewares
app.use(express.json({ limit: '10kb' })); // Mitigate oversized payloads
app.use(requestLogger);

// Instantiating controllers
const playerController = new PlayerController();
const gameController = new GameController();

const isTestEnv = process.env.NODE_ENV === 'test';

// Rate limiting windows and limits (disabled in test to avoid cross-test interference)
const noopLimiter = (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
  next();

const playerCreationLimiter = isTestEnv
  ? noopLimiter
  : rateLimit({
      windowMs: 60 * 1000,
      max: 5,
      message: 'Too many registration requests. Please try again later.',
    });

const gameRetrievalLimiter = isTestEnv
  ? noopLimiter
  : rateLimit({
      windowMs: 60 * 1000,
      max: 60,
    });

const guessSubmissionLimiter = isTestEnv
  ? noopLimiter
  : rateLimit({
      windowMs: 60 * 1000,
      max: 10,
      message: 'Too many attempts. Please wait before trying again.',
    });

// === ROUTES ===

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Player Creation
app.post(
  '/api/v1/players',
  playerCreationLimiter,
  validate(createPlayerSchema),
  playerController.createPlayer
);

// Player Stats
app.get(
  '/api/v1/players/:playerId/stats',
  gameRetrievalLimiter,
  validate(getStatsSchema),
  playerController.getPlayerStats
);

// Today's Game Retrieval
app.get(
  '/api/v1/game/today',
  gameRetrievalLimiter,
  validate(getTodayGameSchema),
  gameController.getTodayGame
);

// Guess Submission
app.post(
  '/api/v1/game/guess',
  guessSubmissionLimiter,
  validate(submitGuessSchema),
  gameController.submitGuess
);

// Global Error Handler
app.use(errorHandler);

// Start server if not running in a test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[Server]: Streak API server is running on http://localhost:${port} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

export default app;
