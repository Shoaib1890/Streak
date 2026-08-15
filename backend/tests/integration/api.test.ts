import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { DateTime } from 'luxon';
import app from '../../src/app.js';
import { prisma } from '../../src/lib/prisma.js';
import { rateLimit } from '../../src/middleware/rateLimit.js';
import { errorHandler } from '../../src/middleware/errorHandler.js';
import { ensureIntegrationTestPuzzle } from '../helpers/testPuzzle.js';
import {
  getCurrentGameDate,
  getCurrentGameDateAsJSDate,
  parseGameDateToJSDate,
} from '../../src/lib/date.js';
import express from 'express';

describe('Streak REST API Integration Tests', () => {
  let playerId: string;
  let puzzleId: string;

  beforeAll(async () => {
    puzzleId = await ensureIntegrationTestPuzzle();
  });

  afterAll(async () => {
    if (playerId) {
      await prisma.attempt.deleteMany({ where: { playerId } });
      await prisma.player.delete({ where: { id: playerId } });
    }
    await prisma.$disconnect();
  });

  it('POST /api/v1/players should create a player successfully', async () => {
    const res = await request(app)
      .post('/api/v1/players')
      .send({ displayName: 'Test Gamer' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('playerId');
    expect(res.body.displayName).toBe('Test Gamer');
    playerId = res.body.playerId;
  });

  it('POST /api/v1/players should reject empty display name', async () => {
    const res = await request(app).post('/api/v1/players').send({ displayName: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_REQUEST');
  });

  it('GET /api/v1/game/today should return puzzle without answer', async () => {
    const res = await request(app).get(`/api/v1/game/today?playerId=${playerId}`);

    expect(res.status).toBe(200);
    expect(res.body.gameDate).toBe(getCurrentGameDate());
    expect(res.body.puzzle.id).toBe(puzzleId);
    expect(res.body.puzzle).not.toHaveProperty('answer');
    expect(res.body.player.hasPlayedToday).toBe(false);
    expect(res.body.player.currentStreak).toBe(0);
  });

  it('POST /api/v1/game/guess should accept correct answer and increment streak', async () => {
    const res = await request(app)
      .post('/api/v1/game/guess')
      .send({ playerId, guess: '  FOUR  ' });

    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(true);
    expect(res.body.previousStreak).toBe(0);
    expect(res.body.currentStreak).toBe(1);
    expect(res.body.longestStreak).toBe(1);
    expect(res.body.answer).toBe('four');
    expect(res.body.guess).toBe('FOUR');
  });

  it('POST /api/v1/game/guess should idempotently return original result on duplicate', async () => {
    const res = await request(app)
      .post('/api/v1/game/guess')
      .send({ playerId, guess: 'wrong' });

    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(true);
    expect(res.body.previousStreak).toBe(0);
    expect(res.body.currentStreak).toBe(1);
    expect(res.body.longestStreak).toBe(1);
    expect(res.body.answer).toBe('four');
    expect(res.body.guess).toBe('FOUR');
  });

  it('GET /api/v1/game/today should return completed state with todayAttempt', async () => {
    const res = await request(app).get(`/api/v1/game/today?playerId=${playerId}`);

    expect(res.status).toBe(200);
    expect(res.body.player.hasPlayedToday).toBe(true);
    expect(res.body.player.currentStreak).toBe(1);
    expect(res.body.player.todayAttempt).toEqual({
      correct: true,
      guess: 'FOUR',
      answer: 'four',
    });
    expect(res.body.puzzle).not.toHaveProperty('answer');
  });

  it('GET /api/v1/players/:playerId/stats should return accurate stats', async () => {
    const res = await request(app).get(`/api/v1/players/${playerId}/stats`);

    expect(res.status).toBe(200);
    expect(res.body.currentStreak).toBe(1);
    expect(res.body.longestStreak).toBe(1);
    expect(res.body.totalGames).toBe(1);
    expect(res.body.totalCorrect).toBe(1);
    expect(res.body.accuracy).toBe(1.0);
  });

  it('GET /api/v1/game/today should return 404 for unknown player UUID', async () => {
    const fakeUuid = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).get(`/api/v1/game/today?playerId=${fakeUuid}`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('PLAYER_NOT_FOUND');
  });

  it('GET /api/v1/game/today should reject malformed playerId', async () => {
    const res = await request(app).get('/api/v1/game/today?playerId=not-a-uuid');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_REQUEST');
  });

  it('POST /api/v1/game/guess should reject oversized guess', async () => {
    const other = await request(app).post('/api/v1/players').send({ displayName: 'Other' });
    const res = await request(app)
      .post('/api/v1/game/guess')
      .send({ playerId: other.body.playerId, guess: 'x'.repeat(101) });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_REQUEST');

    await prisma.attempt.deleteMany({ where: { playerId: other.body.playerId } });
    await prisma.player.delete({ where: { id: other.body.playerId } });
  });

  it('POST /api/v1/game/guess should reject empty and whitespace-only guesses', async () => {
    const other = await request(app).post('/api/v1/players').send({ displayName: 'EmptyGuess' });
    const pid = other.body.playerId;

    const empty = await request(app).post('/api/v1/game/guess').send({ playerId: pid, guess: '' });
    expect(empty.status).toBe(400);
    expect(empty.body.error.code).toBe('INVALID_REQUEST');

    const whitespace = await request(app)
      .post('/api/v1/game/guess')
      .send({ playerId: pid, guess: '   ' });
    expect(whitespace.status).toBe(400);
    expect(whitespace.body.error.code).toBe('INVALID_REQUEST');

    await prisma.player.delete({ where: { id: pid } });
  });

  it('POST /api/v1/game/guess should reject missing guess field', async () => {
    const other = await request(app).post('/api/v1/players').send({ displayName: 'NoGuess' });
    const res = await request(app).post('/api/v1/game/guess').send({ playerId: other.body.playerId });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_REQUEST');

    await prisma.player.delete({ where: { id: other.body.playerId } });
  });

  it('POST /api/v1/game/guess should return 404 for unknown player UUID', async () => {
    const res = await request(app)
      .post('/api/v1/game/guess')
      .send({ playerId: '00000000-0000-0000-0000-000000000000', guess: 'four' });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('PLAYER_NOT_FOUND');
  });
});

describe('Wrong answer and missed-day streak scenarios', () => {
  const cleanupIds: string[] = [];

  afterAll(async () => {
    for (const id of cleanupIds) {
      await prisma.attempt.deleteMany({ where: { playerId: id } });
      await prisma.player.delete({ where: { id } });
    }
  });

  it('should reset streak to 0 on wrong answer for new player', async () => {
    const player = await request(app).post('/api/v1/players').send({ displayName: 'WrongNew' });
    cleanupIds.push(player.body.playerId);

    const res = await request(app)
      .post('/api/v1/game/guess')
      .send({ playerId: player.body.playerId, guess: 'wrong' });

    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(false);
    expect(res.body.currentStreak).toBe(0);
  });

  it('should persist incorrect todayAttempt after wrong guess for page refresh', async () => {
    const player = await request(app).post('/api/v1/players').send({ displayName: 'WrongRefresh' });
    cleanupIds.push(player.body.playerId);

    const guessRes = await request(app)
      .post('/api/v1/game/guess')
      .send({ playerId: player.body.playerId, guess: 'wrong answer' });

    expect(guessRes.status).toBe(200);
    expect(guessRes.body.correct).toBe(false);
    expect(guessRes.body.answer).toBe('four');
    expect(guessRes.body.guess).toBe('wrong answer');

    const todayRes = await request(app).get(`/api/v1/game/today?playerId=${player.body.playerId}`);

    expect(todayRes.status).toBe(200);
    expect(todayRes.body.player.hasPlayedToday).toBe(true);
    expect(todayRes.body.player.currentStreak).toBe(0);
    expect(todayRes.body.player.todayAttempt).toEqual({
      correct: false,
      guess: 'wrong answer',
      answer: 'four',
    });
    expect(todayRes.body.puzzle).not.toHaveProperty('answer');
  });

  it('should start streak at 1 after missed days with correct answer', async () => {
    const twoDaysAgoStr = DateTime.now()
      .setZone('Asia/Kolkata')
      .minus({ days: 2 })
      .toFormat('yyyy-MM-dd');
    const twoDaysAgo = parseGameDateToJSDate(twoDaysAgoStr);

    const playerRes = await request(app).post('/api/v1/players').send({ displayName: 'Missed' });
    const pid = playerRes.body.playerId;
    cleanupIds.push(pid);

    const pastPuzzle = await prisma.puzzle.upsert({
      where: { gameDate: twoDaysAgo },
      update: {
        status: 'PUBLISHED',
        answer: 'past',
        question: 'past?',
        title: 'Past',
        difficulty: 'EASY',
      },
      create: {
        gameDate: twoDaysAgo,
        type: 'WORD',
        title: 'Past',
        question: 'past?',
        answer: 'past',
        difficulty: 'EASY',
        status: 'PUBLISHED',
      },
    });

    await prisma.player.update({
      where: { id: pid },
      data: {
        currentStreak: 5,
        longestStreak: 5,
        totalGames: 1,
        totalCorrect: 1,
        lastPlayedGameDate: twoDaysAgo,
        lastAttemptCorrect: true,
      },
    });

    await prisma.attempt.create({
      data: {
        playerId: pid,
        puzzleId: pastPuzzle.id,
        guess: 'past',
        isCorrect: true,
        previousStreak: 4,
      },
    });

    const todayRes = await request(app).get(`/api/v1/game/today?playerId=${pid}`);
    expect(todayRes.body.player.missedDay).toBe(true);
    expect(todayRes.body.player.currentStreak).toBe(0);

    const guessRes = await request(app)
      .post('/api/v1/game/guess')
      .send({ playerId: pid, guess: 'four' });

    expect(guessRes.status).toBe(200);
    expect(guessRes.body.correct).toBe(true);
    expect(guessRes.body.currentStreak).toBe(1);
    expect(guessRes.body.previousStreak).toBe(0);
  });
});

describe('Missing puzzle handling', () => {
  it('should return PUZZLE_NOT_FOUND when no published puzzle exists for today', async () => {
    const player = await request(app).post('/api/v1/players').send({ displayName: 'NoPuzzle' });
    const pid = player.body.playerId;
    const todayDate = getCurrentGameDateAsJSDate();

    const todayPuzzle = await prisma.puzzle.findFirst({
      where: { gameDate: todayDate, status: 'PUBLISHED' },
    });

    if (todayPuzzle) {
      await prisma.puzzle.update({
        where: { id: todayPuzzle.id },
        data: { status: 'DRAFT' },
      });
    }

    const res = await request(app).get(`/api/v1/game/today?playerId=${pid}`);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('PUZZLE_NOT_FOUND');

    if (todayPuzzle) {
      await prisma.puzzle.update({
        where: { id: todayPuzzle.id },
        data: { status: 'PUBLISHED' },
      });
    }

    await prisma.player.delete({ where: { id: pid } });
  });
});

describe('Concurrent guess submissions', () => {
  it('should allow only one attempt when two requests arrive simultaneously', async () => {
    const player = await request(app).post('/api/v1/players').send({ displayName: 'Concurrent' });
    const pid = player.body.playerId;

    const [resA, resB] = await Promise.all([
      request(app).post('/api/v1/game/guess').send({ playerId: pid, guess: 'four' }),
      request(app).post('/api/v1/game/guess').send({ playerId: pid, guess: 'four' }),
    ]);

    expect(resA.status).toBe(200);
    expect(resB.status).toBe(200);
    expect(resA.body.correct).toBe(true);
    expect(resB.body.correct).toBe(true);

    const attempts = await prisma.attempt.findMany({ where: { playerId: pid } });
    expect(attempts).toHaveLength(1);

    const playerRow = await prisma.player.findUniqueOrThrow({ where: { id: pid } });
    expect(playerRow.totalGames).toBe(1);

    await prisma.attempt.deleteMany({ where: { playerId: pid } });
    await prisma.player.delete({ where: { id: pid } });
  });
});

describe('Rate limiting', () => {
  it('should return 429 when guess submission limit is exceeded', async () => {
    const limiterApp = express();
    limiterApp.use(express.json());
    limiterApp.post(
      '/limited',
      rateLimit({ windowMs: 60_000, max: 2, message: 'Too many attempts.' }),
      (_req, res) => res.status(200).json({ ok: true })
    );
    limiterApp.use(errorHandler);

    const first = await request(limiterApp).post('/limited');
    const second = await request(limiterApp).post('/limited');
    const third = await request(limiterApp).post('/limited');

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(third.status).toBe(429);
    expect(third.body.error.code).toBe('RATE_LIMITED');
  });
});

describe('GET /health', () => {
  it('should return ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
