import { useCallback, useMemo, useState } from 'react';
import { usePlayer } from './hooks/usePlayer.js';
import { useTodayGame } from './hooks/useTodayGame.js';
import { useSubmitGuess } from './hooks/useSubmitGuess.js';
import { Header } from './components/Header.js';
import { Onboarding } from './components/Onboarding.js';
import { LoadingState } from './components/LoadingState.js';
import { ErrorState } from './components/ErrorState.js';
import { GameCard } from './components/GameCard.js';
import { GuessInput } from './components/GuessInput.js';
import { ResultCard } from './components/ResultCard.js';
import { StatsPanel } from './components/StatsPanel.js';
import type { GuessResult } from './types/game.js';

function App() {
  const { playerId, playerName, isLoading: playerLoading, error: playerError, createPlayer, logout } =
    usePlayer();
  const { game, isLoading: gameLoading, error: gameError, refetch } = useTodayGame(playerId);
  const { submitGuess, isSubmitting, error: submitError, clearError } = useSubmitGuess();
  const [localResult, setLocalResult] = useState<GuessResult | null>(null);

  const handleRollover = useCallback(() => {
    setLocalResult(null);
    refetch();
  }, [refetch]);

  const handleGuess = useCallback(
    async (guess: string) => {
      if (!playerId) return;
      clearError();
      const result = await submitGuess(playerId, guess);
      if (result) {
        setLocalResult(result);
        await refetch();
      }
    },
    [playerId, submitGuess, clearError, refetch]
  );

  const completedResult: GuessResult | null = useMemo(() => {
    if (!game?.player.hasPlayedToday || !game.player.todayAttempt) return null;
    const attempt = game.player.todayAttempt;
    return {
      correct: attempt.correct,
      guess: attempt.guess,
      answer: attempt.answer,
      previousStreak: attempt.correct ? game.player.currentStreak - 1 : 0,
      currentStreak: game.player.currentStreak,
      longestStreak: game.player.longestStreak,
    };
  }, [game]);

  if (!playerId) {
    return (
      <main className="app">
        <Onboarding onSubmit={createPlayer} isLoading={playerLoading} error={playerError} />
      </main>
    );
  }

  if (gameLoading && !game) {
    return (
      <main className="app">
        <LoadingState />
      </main>
    );
  }

  if (gameError) {
    const message =
      gameError.code === 'PUZZLE_NOT_FOUND'
        ? "Today's puzzle isn't available yet. We're fixing it."
        : gameError.code === 'PLAYER_NOT_FOUND'
          ? 'Player not found. Please start again.'
          : gameError.message;

    return (
      <main className="app">
        <ErrorState
          message={message}
          onRetry={gameError.code === 'PLAYER_NOT_FOUND' ? logout : refetch}
        />
      </main>
    );
  }

  if (!game) {
    return (
      <main className="app">
        <LoadingState />
      </main>
    );
  }

  const { puzzle, player } = game;
  const showCompleted = player.hasPlayedToday && completedResult && !localResult;

  return (
    <main className="app">
      <Header playerName={playerName} currentStreak={player.currentStreak} onLogout={logout} />

      {player.missedDay && !player.hasPlayedToday && !localResult && (
        <div className="missed-banner card" role="status">
          <p>Your previous streak ended because you missed a day.</p>
          <p>Start a new streak today.</p>
        </div>
      )}

      {localResult ? (
        <ResultCard result={localResult} onRollover={handleRollover} />
      ) : showCompleted ? (
        <ResultCard result={completedResult} completed onRollover={handleRollover} />
      ) : (
        <>
          <GameCard puzzle={puzzle}>
            <GuessInput onSubmit={handleGuess} isSubmitting={isSubmitting} />
          </GameCard>

          {submitError && (
            <ErrorState
              title="Couldn't submit your guess"
              message={
                submitError.code === 'INTERNAL_ERROR'
                  ? "Your attempt was not recorded. Please try again."
                  : submitError.message
              }
              onRetry={() => clearError()}
            />
          )}
        </>
      )}

      <StatsPanel playerId={playerId} />
    </main>
  );
}

export default App;
