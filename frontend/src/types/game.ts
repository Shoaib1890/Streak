export interface Puzzle {
  id: string;
  type: 'WORD' | 'RIDDLE';
  title: string;
  question: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface TodayAttempt {
  correct: boolean;
  guess: string;
  answer: string;
}

export interface PlayerState {
  currentStreak: number;
  longestStreak: number;
  hasPlayedToday: boolean;
  missedDay?: boolean;
  todayAttempt?: TodayAttempt;
}

export interface GameState {
  gameDate: string;
  puzzle: Puzzle;
  player: PlayerState;
}

export interface GuessResult {
  correct: boolean;
  previousStreak: number;
  currentStreak: number;
  longestStreak: number;
  answer: string;
  guess: string;
}

export interface PlayerStats {
  currentStreak: number;
  longestStreak: number;
  totalGames: number;
  totalCorrect: number;
  accuracy: number;
}

export type GameUiState =
  | 'FIRST_VISIT'
  | 'LOADING'
  | 'READY'
  | 'SUBMITTING'
  | 'CORRECT'
  | 'INCORRECT'
  | 'COMPLETED'
  | 'ERROR';
