import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.use(
    helmet({
      contentSecurityPolicy: false, // API-only server; CSP is set by the frontend host
    })
  );
}

const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const isDev = !isProduction;

/** Allow common local dev origins (localhost, 127.0.0.1, any port). */
const LOCAL_DEV_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  if (origin === allowedOrigin || origin === 'http://localhost:5173') return true;
  if (isDev && LOCAL_DEV_ORIGIN.test(origin)) return true;
  return false;
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }
      // Reject without throwing — avoids unhandled error logs for blocked origins
      callback(null, false);
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

// Rate limiting is enforced in production only (disabled in dev/test for local testing)
const noopLimiter = (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
  next();

const playerCreationLimiter = isProduction
  ? rateLimit({
      windowMs: 60 * 1000,
      max: 5,
      message: 'Too many registration requests. Please try again later.',
    })
  : noopLimiter;

const gameRetrievalLimiter = isProduction
  ? rateLimit({
      windowMs: 60 * 1000,
      max: 60,
    })
  : noopLimiter;

const guessSubmissionLimiter = isProduction
  ? rateLimit({
      windowMs: 60 * 1000,
      max: 10,
      message: 'Too many attempts. Please wait before trying again.',
    })
  : noopLimiter;

// === ROUTES ===

app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'Streak API',
    status: 'running',
    health: '/health',
    message: 'This is the API server. Open the game at http://localhost:5173',
  });
});

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

// Start server when running directly (not during Vitest)
if (process.env.NODE_ENV !== 'test' && process.env.VITEST !== 'true') {
  app.listen(port, () => {
    console.log(`[Server]: Streak API server is running on http://localhost:${port} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

export default app;
