import { Player } from '@prisma/client';
import { formatJSDateToGameDateString } from './date.js';

export interface PlayerStreakContext {
  lastPlayedDateStr: string | null;
  lastAttemptCorrect: boolean | null;
}

/**
 * Derives streak calculation inputs from explicit player state fields.
 */
export function getPlayerStreakContext(player: Player): PlayerStreakContext {
  const lastPlayedDateStr = player.lastPlayedGameDate
    ? formatJSDateToGameDateString(player.lastPlayedGameDate)
    : null;

  return {
    lastPlayedDateStr,
    lastAttemptCorrect: player.lastAttemptCorrect,
  };
}
