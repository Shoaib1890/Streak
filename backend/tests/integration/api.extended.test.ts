import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { DateTime } from 'luxon';
import { prisma } from '../../src/lib/prisma.js';
import {
  getCurrentGameDate,
  getCurrentGameDateAsJSDate,
  parseGameDateToJSDate,
} from '../../src/lib/date.js';

describe('Consecutive-day streak (integration)', () => {
  let playerId: string;
  const cleanupIds: string[] = [];

  beforeAll(async () => {
    const todayJSDate = getCurrentGameDateAsJSDate();
    await prisma.puzzle.upsert({
      where: { gameDate: todayJSDate },
      update: {
        title: 'Integration Test Puzzle',
        question: 'What is 2 + 2?',
        answer: 'four',
        difficulty: 'EASY',
        status: 'PUBLISHED',
      },
      create: {
        gameDate: todayJSDate,
        type: 'WORD',
        title: 'Integration Test Puzzle',
        question: 'What is 2 + 2?',
        answer: 'four',
        difficulty: 'EASY',
        status: 'PUBLISHED',
      },
    });
  });

  afterAll(async () => {
    for (const id of cleanupIds) {
      await prisma.attempt.deleteMany({ where: { playerId: id } });
      await prisma.player.delete({ where: { id } });
    }
  });

  it('should increment streak when player played yesterday correctly', async () => {
    const yesterdayStr = DateTime.now().setZone('Asia/Kolkata').minus({ days: 1 }).toFormat('yyyy-MM-dd');
    const yesterdayDate = parseGameDateToJSDate(yesterdayStr);

    const playerRes = await request((await import('../../src/app.js')).default)
      .post('/api/v1/players')
      .send({ displayName: 'Consecutive' });
    playerId = playerRes.body.playerId;
    cleanupIds.push(playerId);

    const yesterdayPuzzle = await prisma.puzzle.upsert({
      where: { gameDate: yesterdayDate },
      update: {
        status: 'PUBLISHED',
        answer: 'echo',
        question: 'yesterday?',
        title: 'Yesterday',
        difficulty: 'EASY',
      },
      create: {
        gameDate: yesterdayDate,
        type: 'WORD',
        title: 'Yesterday',
        question: 'yesterday?',
        answer: 'echo',
        difficulty: 'EASY',
        status: 'PUBLISHED',
      },
    });

    await prisma.player.update({
      where: { id: playerId },
      data: {
        currentStreak: 3,
        longestStreak: 3,
        totalGames: 1,
        totalCorrect: 1,
        lastPlayedGameDate: yesterdayDate,
        lastAttemptCorrect: true,
      },
    });

    await prisma.attempt.create({
      data: {
        playerId,
        puzzleId: yesterdayPuzzle.id,
        guess: 'echo',
        isCorrect: true,
        previousStreak: 2,
      },
    });

    const app = (await import('../../src/app.js')).default;
    const todayRes = await request(app).get(`/api/v1/game/today?playerId=${playerId}`);
    expect(todayRes.body.player.currentStreak).toBe(3);
    expect(todayRes.body.player.hasPlayedToday).toBe(false);

    const guessRes = await request(app)
      .post('/api/v1/game/guess')
      .send({ playerId, guess: 'four' });

    expect(guessRes.status).toBe(200);
    expect(guessRes.body.correct).toBe(true);
    expect(guessRes.body.previousStreak).toBe(3);
    expect(guessRes.body.currentStreak).toBe(4);
    expect(guessRes.body.longestStreak).toBe(4);
  });
});

describe('GET /game/today read-only (integration)', () => {
  let playerId: string;

  afterAll(async () => {
    if (playerId) {
      await prisma.attempt.deleteMany({ where: { playerId } });
      await prisma.player.delete({ where: { id: playerId } });
    }
  });

  it('should not create or mutate player or attempt records', async () => {
    const app = (await import('../../src/app.js')).default;
    const playerRes = await request(app).post('/api/v1/players').send({ displayName: 'ReadOnly' });
    playerId = playerRes.body.playerId;

    const beforePlayer = await prisma.player.findUniqueOrThrow({ where: { id: playerId } });
    const attemptsBefore = await prisma.attempt.count({ where: { playerId } });

    const res = await request(app).get(`/api/v1/game/today?playerId=${playerId}`);
    expect(res.status).toBe(200);

    const afterPlayer = await prisma.player.findUniqueOrThrow({ where: { id: playerId } });
    const attemptsAfter = await prisma.attempt.count({ where: { playerId } });

    expect(attemptsAfter).toBe(attemptsBefore);
    expect(afterPlayer.currentStreak).toBe(beforePlayer.currentStreak);
    expect(afterPlayer.longestStreak).toBe(beforePlayer.longestStreak);
    expect(afterPlayer.totalGames).toBe(beforePlayer.totalGames);
    expect(afterPlayer.totalCorrect).toBe(beforePlayer.totalCorrect);
    expect(afterPlayer.lastPlayedGameDate).toEqual(beforePlayer.lastPlayedGameDate);
    expect(afterPlayer.lastAttemptCorrect).toBe(beforePlayer.lastAttemptCorrect);
    expect(afterPlayer.updatedAt.getTime()).toBe(beforePlayer.updatedAt.getTime());
  });
});

describe('Lost-response idempotent retry (integration)', () => {
  let playerId: string;

  afterAll(async () => {
    if (playerId) {
      await prisma.attempt.deleteMany({ where: { playerId } });
      await prisma.player.delete({ where: { id: playerId } });
    }
  });

  it('should return the original committed result when client retries after success', async () => {
    const app = (await import('../../src/app.js')).default;
    const playerRes = await request(app).post('/api/v1/players').send({ displayName: 'Retry' });
    playerId = playerRes.body.playerId;

    const first = await request(app)
      .post('/api/v1/game/guess')
      .send({ playerId, guess: 'four' });

    expect(first.status).toBe(200);
    expect(first.body.correct).toBe(true);
    expect(first.body.currentStreak).toBe(1);

    const retry = await request(app)
      .post('/api/v1/game/guess')
      .send({ playerId, guess: 'wrong' });

    expect(retry.status).toBe(200);
    expect(retry.body).toEqual(first.body);

    const attempts = await prisma.attempt.findMany({ where: { playerId } });
    expect(attempts).toHaveLength(1);
    expect(attempts[0].guess).toBe('four');
  });
});
