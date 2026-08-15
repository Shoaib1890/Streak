import { prisma } from '../../src/lib/prisma.js';
import { getCurrentGameDateAsJSDate } from '../../src/lib/date.js';

/** Ensures today's puzzle is the integration-test fixture (never used in production seed). */
export async function ensureIntegrationTestPuzzle(): Promise<string> {
  const todayJSDate = getCurrentGameDateAsJSDate();
  const puzzle = await prisma.puzzle.upsert({
    where: { gameDate: todayJSDate },
    update: {
      title: 'Integration Test Puzzle',
      question: 'What is 2 + 2?',
      answer: 'four',
      difficulty: 'EASY',
      status: 'PUBLISHED',
      type: 'WORD',
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
  return puzzle.id;
}
