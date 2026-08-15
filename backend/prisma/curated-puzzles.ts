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
    title: 'Taken From Mine',
    question: 'Taken from a mine and shut in a wooden case, never released, yet used by almost everyone. What am I?',
    answer: 'pencil lead',
    difficulty: 'HARD',
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
    title: 'Ends Life',
    question: 'It can bring tears to your eyes, spin you around, and even change your life. Yet it is over in a blink. What is it?',
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
    title: 'Runs Never Walks',
    question: 'What runs but never walks, has a mouth but never talks, has a bed but never sleeps?',
    answer: 'river',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: -3,
    title: 'Light as Feather',
    question:
      'I am lighter than a feather, yet no person can hold me for long. What am I?',
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
    title: 'Ends and Begins',
    question: 'What ends everything but has no end itself?',
    answer: 'death',
    difficulty: 'HARD',
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
    title: 'Throw Away',
    question: 'The more of this you take, the more you leave behind. What is it?',
    answer: 'footsteps',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: 7,
    title: 'Word in Dictionary',
    question: 'What word in the dictionary is always spelled incorrectly?',
    answer: 'incorrectly',
    difficulty: 'HARD',
  },
  {
    offsetDays: 8,
    title: 'Face No Eyes',
    question: 'What has a face and two hands but no arms or legs?',
    answer: 'clock',
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
    title: 'Bank No Money',
    question: 'What has branches but no fruit, trunk, or leaves?',
    answer: 'bank',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: 12,
    title: 'Wet When Drying',
    question: 'I dry you while becoming wet myself. What am I?',
    answer: 'towel',
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
    title: 'Mountains Valleys',
    question: 'I have mountains with no stone, lakes with no water, and cities with no people. What am I?',
    answer: 'map',
    difficulty: 'MEDIUM',
  },
  {
    offsetDays: 15,
    title: 'One Letter More',
    question: 'What five-letter word becomes shorter when you add two letters to it?',
    answer: 'short',
    difficulty: 'HARD',
  },
];
