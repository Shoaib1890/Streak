import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';
import { parseGameDateToJSDate } from '../src/lib/date.js';
import { normalizeAnswer } from '../src/lib/normalize.js';
import { CURATED_PUZZLES } from './curated-puzzles.js';

const prisma = new PrismaClient();
const GAME_TIMEZONE = 'Asia/Kolkata';

function validatePuzzleAnswers(): void {
  for (const puzzle of CURATED_PUZZLES) {
    const normalized = normalizeAnswer(puzzle.answer);
    if (normalized !== puzzle.answer) {
      throw new Error(
        `Puzzle "${puzzle.title}" answer must be pre-normalized. Got "${puzzle.answer}", expected "${normalized}".`
      );
    }
    if (!puzzle.question.trim() || !puzzle.title.trim()) {
      throw new Error(`Puzzle at offset ${puzzle.offsetDays} has empty title or question.`);
    }
  }

  const dates = CURATED_PUZZLES.map((p) => p.offsetDays);
  if (new Set(dates).size !== dates.length) {
    throw new Error('CURATED_PUZZLES contains duplicate offsetDays values.');
  }
}

async function main() {
  console.log('Seeding production puzzles...');
  validatePuzzleAnswers();

  const today = DateTime.now().setZone(GAME_TIMEZONE);

  for (const data of CURATED_PUZZLES) {
    const gameDateStr = today.plus({ days: data.offsetDays }).toFormat('yyyy-MM-dd');
    const dateOnly = parseGameDateToJSDate(gameDateStr);

    await prisma.puzzle.upsert({
      where: { gameDate: dateOnly },
      update: {
        title: data.title,
        question: data.question,
        answer: data.answer,
        difficulty: data.difficulty,
        status: 'PUBLISHED',
        type: 'WORD',
      },
      create: {
        gameDate: dateOnly,
        type: 'WORD',
        title: data.title,
        question: data.question,
        answer: data.answer,
        difficulty: data.difficulty,
        status: 'PUBLISHED',
      },
    });
  }

  console.log(`Seeding completed: ${CURATED_PUZZLES.length} puzzles published.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
