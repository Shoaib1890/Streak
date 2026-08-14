import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StreakDisplay } from './StreakDisplay.js';
import { Countdown } from './Countdown.js';
import type { GuessResult } from '../types/game.js';

interface ResultCardProps {
  result: GuessResult;
  completed?: boolean;
  onRollover?: () => void;
}

export function ResultCard({ result, completed, onRollover }: ResultCardProps) {
  const { correct, previousStreak, currentStreak, longestStreak, answer, guess } = result;

  useEffect(() => {
    if (correct && !completed) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    }
  }, [correct, completed]);

  return (
    <section
      className={`result-card card ${correct ? 'result-card--correct' : 'result-card--incorrect'}`}
      aria-live="polite"
    >
      {completed ? (
        <>
          <h2 className="result-heading">Today complete ✓</h2>
          <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />
          <p className="result-message">You&apos;ve already made today&apos;s guess.</p>
        </>
      ) : correct ? (
        <>
          <h2 className="result-heading">Correct 🎉</h2>
          <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />
          <p className="result-message">You extended your streak.</p>
          <p className="streak-change" aria-label={`Streak changed from ${previousStreak} to ${currentStreak}`}>
            {previousStreak} → {currentStreak}
          </p>
        </>
      ) : (
        <>
          <h2 className="result-heading">Not this time</h2>
          <p className="result-detail">
            Your answer: <strong>{guess}</strong>
          </p>
          <p className="result-detail">
            Correct answer: <strong>{answer}</strong>
          </p>
          <p className="result-message">Your streak has reset. Tomorrow is a new chance.</p>
        </>
      )}

      <p className="result-longest">Longest streak: {longestStreak} days</p>
      <p className="result-footer">Come back tomorrow.</p>
      <Countdown onRollover={onRollover} />
    </section>
  );
}
