import { useState } from 'react';
import { api } from '../services/api.js';

export function usePlayer() {
  const [playerId, setPlayerId] = useState<string | null>(() => localStorage.getItem('streak_player_id'));
  const [playerName, setPlayerName] = useState<string | null>(() => localStorage.getItem('streak_player_name'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlayer = async (name: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.createPlayer(name);
      localStorage.setItem('streak_player_id', data.playerId);
      localStorage.setItem('streak_player_name', data.displayName);
      setPlayerId(data.playerId);
      setPlayerName(data.displayName);
    } catch (err: any) {
      setError(err.message || 'Failed to create player identity.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateDisplayName = (name: string): void => {
    const trimmed = name.trim();
    if (!trimmed || !playerId) return;
    localStorage.setItem('streak_player_name', trimmed);
    setPlayerName(trimmed);
  };

  const logout = (): void => {
    localStorage.removeItem('streak_player_id');
    localStorage.removeItem('streak_player_name');
    setPlayerId(null);
    setPlayerName(null);
  };

  return {
    playerId,
    playerName,
    isLoading,
    error,
    createPlayer,
    updateDisplayName,
    logout,
  };
}
