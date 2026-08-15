import { describe, it, expect } from 'vitest';
import { prisma } from '../../src/lib/prisma.js';
import { getCurrentGameDateAsJSDate } from '../../src/lib/date.js';
import { ensureIntegrationTestPuzzle } from '../helpers/testPuzzle.js';
import {
  assertTestDatabase,
  createPrismaClientForUrl,
  databaseNameFromUrl,
  readDevDatabaseUrlFromEnvFile,
} from '../helpers/testDatabase.js';

describe('test database isolation', () => {
  it('should require a dedicated test database URL', () => {
    assertTestDatabase();
    const testDb = databaseNameFromUrl(process.env.DATABASE_URL!);
    expect(testDb.endsWith('_test')).toBe(true);
  });

  it('should not mutate the development database when seeding test fixtures', async () => {
    const devUrl = readDevDatabaseUrlFromEnvFile();
    if (!devUrl) {
      return;
    }

    const testUrl = process.env.DATABASE_URL!;
    const devDb = databaseNameFromUrl(devUrl);
    const testDb = databaseNameFromUrl(testUrl);

    expect(devDb).not.toBe(testDb);

    const devPrisma = createPrismaClientForUrl(devUrl);
    const today = getCurrentGameDateAsJSDate();

    try {
      const before = await devPrisma.puzzle.findUnique({ where: { gameDate: today } });

      await ensureIntegrationTestPuzzle();

      const afterDev = await devPrisma.puzzle.findUnique({ where: { gameDate: today } });
      const afterTest = await prisma.puzzle.findUnique({ where: { gameDate: today } });

      if (before) {
        expect(afterDev?.title).toBe(before.title);
        expect(afterDev?.question).toBe(before.question);
        expect(afterDev?.answer).toBe(before.answer);
      } else {
        expect(afterDev).toBeNull();
      }

      expect(afterTest?.title).toBe('Integration Test Puzzle');
      expect(afterTest?.question).toBe('What is 2 + 2?');
    } finally {
      await devPrisma.$disconnect();
    }
  });
});
