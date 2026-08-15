import type { GameState, GuessResult, PlayerStats } from '../types/game.js';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

export class ApiClientError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
  }
}

async function handleResponseError(response: Response): Promise<never> {
  let errorData: { error?: { code?: string; message?: string } };
  try {
    errorData = await response.json();
  } catch {
    throw new ApiClientError('INTERNAL_ERROR', 'Network response was not valid JSON.', response.status);
  }

  const errCode = errorData?.error?.code || 'INTERNAL_ERROR';
  const errMsg = errorData?.error?.message || 'An unexpected error occurred.';
  throw new ApiClientError(errCode, errMsg, response.status);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    await handleResponseError(response);
  }

  return response.json() as Promise<T>;
}

export const api = {
  async createPlayer(displayName: string): Promise<{ playerId: string; displayName: string }> {
    return request<{ playerId: string; displayName: string }>('/api/v1/players', {
      method: 'POST',
      body: JSON.stringify({ displayName }),
    });
  },

  async getTodayGame(playerId: string): Promise<GameState> {
    return request<GameState>(`/api/v1/game/today?playerId=${playerId}`);
  },

  async submitGuess(playerId: string, guess: string): Promise<GuessResult> {
    return request<GuessResult>('/api/v1/game/guess', {
      method: 'POST',
      body: JSON.stringify({ playerId, guess }),
    });
  },

  async getPlayerStats(playerId: string): Promise<PlayerStats> {
    return request<PlayerStats>(`/api/v1/players/${playerId}/stats`);
  },
};
