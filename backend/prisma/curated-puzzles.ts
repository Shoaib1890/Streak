/**
 * Production puzzle catalog for daily seeding.
 * Answers are stored lowercase; server normalizeAnswer() trims, lowercases, and collapses spaces.
 */

export interface CuratedPuzzle {
  offsetDays: number;
  title: string;
  question: string;
  answer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export const CURATED_PUZZLES: CuratedPuzzle[] = [
  {
    offsetDays: -14,
    title: 'Wet Without Water',
    question: 'What gets wet while drying?',
    answer: 'towel',
    difficulty: 'EASY',
  },
  {
    offsetDays: -13,
    title: 'Always Running',
    question: 'I have a mouth but never talk. I have a bed but never sleep. What am I?',
    answer: 'river',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: -12,
    title: 'Eye That Cannot See',
    question: 'What has an eye but cannot see?',
    answer: 'needle',
    difficulty: 'EASY',
  },
  {
    offsetDays: -11,
    title: 'Head and Tail',
    question: 'What has a head and a tail but no body?',
    answer: 'coin',
    difficulty: 'EASY',
  },
  {
    offsetDays: -10,
    title: 'Tear One Off',
    question: 'The more you take, the more you leave behind. What are they?',
    answer: 'footsteps',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: -9,
    title: 'Over in a Blink',
    question: 'It passes in an instant, but you can feel it change everything. What is it?',
    answer: 'moment',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: -8,
    title: 'Broken to Use',
    question: 'What has to be broken before you can use it?',
    answer: 'egg',
    difficulty: 'EASY',
  },
  {
    offsetDays: -7,
    title: 'Holey Holder',
    question: 'What is full of holes but still holds water?',
    answer: 'sponge',
    difficulty: 'EASY',
  },
  {
    offsetDays: -6,
    title: 'Voice on Wind',
    question:
      'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    answer: 'echo',
    difficulty: 'EASY',
  },
  {
    offsetDays: -5,
    title: 'Mystery Keys',
    question:
      'I have keys but no locks. I have space but no room. You can enter but cannot go outside. What am I?',
    answer: 'keyboard',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: -4,
    title: 'Corner Traveler',
    question: 'What can travel around the world while staying in the same corner?',
    answer: 'stamp',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: -3,
    title: 'Light as Feather',
    question: 'I am lighter than a feather, yet no person can hold me for long. What am I?',
    answer: 'breath',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: -2,
    title: 'Always Coming',
    question: 'What is always in front of you but cannot be seen?',
    answer: 'future',
    difficulty: 'HARD',
  },
  {
    offsetDays: -1,
    title: 'Paper World',
    question:
      'I have cities but no houses, forests but no trees, and water but no fish. What am I?',
    answer: 'map',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: 0,
    title: 'Most Stories',
    question: 'What building has the most stories?',
    answer: 'library',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: 1,
    title: 'Goes Up Never Down',
    question: 'What goes up but never comes down?',
    answer: 'age',
    difficulty: 'EASY',
  },
  {
    offsetDays: 2,
    title: 'Hands No Arms',
    question: 'What has hands but cannot clap?',
    answer: 'clock',
    difficulty: 'EASY',
  },
  {
    offsetDays: 3,
    title: 'Fill a Room',
    question: 'What fills a room but takes up no space?',
    answer: 'light',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: 4,
    title: 'Neck No Head',
    question: 'What has a neck but no head?',
    answer: 'bottle',
    difficulty: 'EASY',
  },
  {
    offsetDays: 5,
    title: 'Shorter When Longer',
    question: 'The longer I stand, the shorter I grow. What am I?',
    answer: 'candle',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: 6,
    title: 'Used More Than You',
    question: 'What belongs to you, but other people use it more than you do?',
    answer: 'name',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: 7,
    title: 'Grows When Taken',
    question: 'What gets bigger the more you take away from it?',
    answer: 'hole',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: 8,
    title: 'Legs No Walk',
    question: 'What has legs but cannot walk?',
    answer: 'table',
    difficulty: 'EASY',
  },
  {
    offsetDays: 9,
    title: 'Cannot Keep',
    question: 'What can you catch but not throw?',
    answer: 'cold',
    difficulty: 'EASY',
  },
  {
    offsetDays: 10,
    title: 'Break Without Touch',
    question: 'What can you break even if you never pick it up or touch it?',
    answer: 'promise',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: 11,
    title: 'Bark No Bite',
    question: 'What has a bark but no bite?',
    answer: 'tree',
    difficulty: 'EASY',
  },
  {
    offsetDays: 12,
    title: 'Yard Runner',
    question: 'What runs all around a backyard but never moves?',
    answer: 'fence',
    difficulty: 'EASY',
  },
  {
    offsetDays: 13,
    title: 'Keys No Locks',
    question: 'I have keys but open no doors. What am I?',
    answer: 'piano',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: 14,
    title: 'Teeth No Bite',
    question: 'What has teeth but cannot bite?',
    answer: 'comb',
    difficulty: 'EASY',
  },
  {
    offsetDays: 15,
    title: 'Lost When Shared',
    question:
      'If you have me, you want to share me. If you share me, you no longer have me. What am I?',
    answer: 'secret',
    difficulty: 'MEDIUM',
  },
];
