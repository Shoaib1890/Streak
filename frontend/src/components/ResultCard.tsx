import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CalendarCheck, CheckCircle2, XCircle } from 'lucide-react';
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

  const cardClass = completed
    ? 'result-card--completed'
    : correct
      ? 'result-card--correct'
      : 'result-card--incorrect';

  return (
    <section className={`result-card card ${cardClass}`} aria-live="polite">
      <div className="result-hero">
        {completed ? (
          <>
            <CalendarCheck className="result-icon" size={32} aria-hidden="true" />
            <h2 className="result-heading">Today&apos;s puzzle complete</h2>
            <p className="result-subheading">You&apos;ve already made your guess for today.</p>
          </>
        ) : correct ? (
          <>
            <CheckCircle2 className="result-icon result-icon--correct" size={32} aria-hidden="true" />
            <h2 className="result-heading">Correct!</h2>
            <p className="result-subheading">Your streak continues.</p>
          </>
        ) : (
          <>
            <XCircle className="result-icon result-icon--incorrect" size={32} aria-hidden="true" />
            <h2 className="result-heading">Not this time</h2>
            <p className="result-subheading">Your streak has reset — tomorrow is a fresh start.</p>
          </>
        )}
      </div>

      <div className="result-body">
        {(completed || correct) && (
          <div className="result-streak-block">
            <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />
            {correct && !completed && (
              <p
                className="streak-change"
                aria-label={`Streak changed from ${previousStreak} to ${currentStreak}`}
              >
                {previousStreak} → {currentStreak}
              </p>
            )}
          </div>
        )}

        {!correct && !completed && (
          <div className="result-answers">
            <p className="result-detail">
              <span className="result-detail-label">Your answer</span>
              <strong>{guess}</strong>
            </p>
            <p className="result-detail">
              <span className="result-detail-label">Correct answer</span>
              <strong>{answer}</strong>
            </p>
          </div>
        )}

        <p className="result-longest">Longest streak: {longestStreak} days</p>
      </div>

      <div className="result-footer-block">
        <p className="result-footer">Come back tomorrow for the next puzzle.</p>
        <Countdown onRollover={onRollover} />
      </div>
    </section>
  );
}
