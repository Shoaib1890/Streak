import { useState, type FormEvent } from 'react';

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

  return (
    <form className="guess-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="guess-input" className="guess-label">
        Your one guess
      </label>
      <input
        id="guess-input"
        type="text"
        className="text-input"
        placeholder="Type your answer…"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        maxLength={100}
        disabled={isSubmitting || disabled}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting || disabled || !guess.trim()}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Checking…' : 'Submit guess'}
      </button>
      <p className="guess-hint">One guess. Make it count.</p>
    </form>
  );
}
