import { useState, useEffect, useCallback } from 'react';
import { api, ApiClientError } from '../services/api.js';
import type { GameState } from '../types/game.js';

export function useTodayGame(playerId: string | null) {
  const [game, setGame] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiClientError | null>(null);

  const fetchGame = useCallback(async () => {
    if (!playerId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTodayGame(playerId);
      setGame(data);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        const message = err instanceof Error ? err.message : 'Failed to fetch game state.';
        setError(new ApiClientError('INTERNAL_ERROR', message, 500));
      }
    } finally {
      setIsLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  return { game, isLoading, error, refetch: fetchGame, setGame };
}
