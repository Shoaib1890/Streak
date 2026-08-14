import { useState, type FormEvent } from 'react';

interface OnboardingProps {
  onSubmit: (name: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function Onboarding({ onSubmit, isLoading, error }: OnboardingProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <section className="onboarding card" aria-labelledby="onboarding-title">
      <h1 id="onboarding-title">STREAK</h1>
      <p className="tagline">One puzzle. One guess. Every day.</p>
      <p className="rules-hint">
        Get it right to extend your streak. Miss or get it wrong and it resets.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="player-name" className="sr-only">
          Your name
        </label>
        <input
          id="player-name"
          type="text"
          className="text-input"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          autoComplete="nickname"
          autoFocus
          disabled={isLoading}
          aria-invalid={!!error}
          aria-describedby={error ? 'onboarding-error' : undefined}
        />
        {error && (
          <p id="onboarding-error" className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary" disabled={isLoading || !name.trim()}>
          {isLoading ? 'Starting…' : 'Start playing'}
        </button>
      </form>
    </section>
  );
}
