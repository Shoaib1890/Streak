import { useState, useCallback, useRef } from 'react';
import { api, ApiClientError } from '../services/api.js';
import type { GuessResult } from '../types/game.js';

export function useSubmitGuess() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiClientError | null>(null);
  const inFlightRef = useRef(false);

  const submitGuess = useCallback(async (playerId: string, guess: string): Promise<GuessResult | null> => {
    if (inFlightRef.current) return null;

    inFlightRef.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await api.submitGuess(playerId, guess);
      return result;
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        const message = err instanceof Error ? err.message : 'Failed to submit guess.';
        setError(new ApiClientError('INTERNAL_ERROR', message, 500));
      }
      return null;
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { submitGuess, isSubmitting, error, clearError };
}
