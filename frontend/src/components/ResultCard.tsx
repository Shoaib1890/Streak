import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle } from 'lucide-react';
import { StreakDisplay } from './StreakDisplay.js';
import { Countdown } from './Countdown.js';
import type { GuessResult } from '../types/game.js';

interface ResultCardProps {
  result: GuessResult;
  /** When true, plays celebration effects for a fresh correct submission. */
  celebrate?: boolean;
  onRollover?: () => void;
}

export function ResultCard({ result, celebrate = false, onRollover }: ResultCardProps) {
  const { correct, previousStreak, currentStreak, longestStreak, answer, guess } = result;

  useEffect(() => {
    if (celebrate && correct) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    }
  }, [celebrate, correct]);

  const cardClass = correct ? 'result-card--correct' : 'result-card--incorrect';

  return (
    <section className={`result-card card ${cardClass}`} aria-live="polite">
      <div className="result-hero">
        {correct ? (
          <>
            <CheckCircle2 className="result-icon result-icon--correct" size={32} aria-hidden="true" />
            <h2 className="result-heading">{celebrate ? 'Correct!' : 'You got it today'}</h2>
            <p className="result-subheading">
              {celebrate ? 'Your streak continues.' : 'Your streak is still going.'}
            </p>
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
        {correct ? (
          <div className="result-streak-block">
            <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />
            {celebrate && (
              <p
                className="streak-change"
                aria-label={`Streak changed from ${previousStreak} to ${currentStreak}`}
              >
                {previousStreak} → {currentStreak}
              </p>
            )}
          </div>
        ) : (
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
