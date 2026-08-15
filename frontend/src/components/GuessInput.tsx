import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

interface GuessInputProps {
  onSubmit: (guess: string) => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export function GuessInput({ onSubmit, isSubmitting, disabled }: GuessInputProps) {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = guess.trim();
    if (trimmed && !isSubmitting && !disabled) {
      onSubmit(trimmed);
    }
  };

  const isDisabled = isSubmitting || disabled;

  return (
    <form className="guess-form" onSubmit={handleSubmit} noValidate>
      <div className="guess-section-header">
        <label htmlFor="guess-input" className="guess-label">
          Your one guess
        </label>
        <span className="guess-rule" aria-hidden="true">
          No take-backs
        </span>
      </div>
      <input
        id="guess-input"
        type="text"
        className="text-input guess-input"
        placeholder="Type your answer…"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        maxLength={100}
        disabled={isDisabled}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-describedby="guess-hint"
      />
      <button
        type="submit"
        className="btn btn-primary guess-submit"
        disabled={isDisabled || !guess.trim()}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="btn-icon btn-icon--spin" size={18} aria-hidden="true" />
            Checking…
          </>
        ) : (
          'Submit guess'
        )}
      </button>
      <p id="guess-hint" className="guess-hint">
        One guess per day. Make it count.
      </p>
    </form>
  );
}
