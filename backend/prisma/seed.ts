import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';
import { parseGameDateToJSDate } from '../src/lib/date.js';

const prisma = new PrismaClient();
const GAME_TIMEZONE = 'Asia/Kolkata';

async function main() {
  console.log('Seeding puzzles...');

  const today = DateTime.now().setZone(GAME_TIMEZONE);

  const puzzlesData = [
    {
      offsetDays: -2,
      title: 'The Mystery Keys',
      question:
        'I have keys but no locks. I have space but no room. You can enter but can’t go outside. What am I?',
      answer: 'keyboard',
      difficulty: 'MEDIUM',
    },
    {
      offsetDays: -1,
      title: 'The Voice without Mouth',
      question:
        'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
      answer: 'echo',
      difficulty: 'EASY',
    },
    {
      offsetDays: 0,
      title: 'Today’s Riddle',
      question:
        'I have cities but no houses, forests but no trees, and water but no fish. What am I?',
      answer: 'map',
      difficulty: 'MEDIUM',
    },
    {
      offsetDays: 1,
      title: 'Steps Left Behind',
      question: 'The more of them you take, the more you leave behind. What are they?',
      answer: 'footsteps',
      difficulty: 'MEDIUM',
    },
    {
      offsetDays: 2,
      title: 'Fragile Vessel',
      question: 'What has to be broken before you can use it?',
      answer: 'egg',
      difficulty: 'EASY',
    },
    {
      offsetDays: 3,
      title: 'Holey Container',
      question: 'What is full of holes but still holds water?',
      answer: 'sponge',
      difficulty: 'EASY',
    },
    {
      offsetDays: 4,
      title: 'Always Ahead',
      question: 'What is always in front of you but can’t be seen?',
      answer: 'future',
      difficulty: 'HARD',
    },
  ];

  for (const data of puzzlesData) {
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

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
