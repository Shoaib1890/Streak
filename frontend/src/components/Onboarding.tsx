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
      <div className="onboarding-hero">
        <h1 id="onboarding-title" className="onboarding-logo">
          STREAK
        </h1>
        <p className="tagline">One puzzle. One guess. Every day.</p>
      </div>

      <ul className="onboarding-features" aria-label="How it works">
        <li>Answer today&apos;s puzzle with a single guess</li>
        <li>Get it right to grow your daily streak</li>
        <li>Miss a day or guess wrong and it resets</li>
      </ul>

      <form className="onboarding-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="player-name" className="onboarding-label">
          Display name
        </label>
        <input
          id="player-name"
          type="text"
          className="text-input"
          placeholder="How should we greet you?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          autoComplete="nickname"
          autoFocus
          disabled={isLoading}
          aria-invalid={!!error}
          aria-describedby={error ? 'onboarding-error' : 'onboarding-hint'}
        />
        <p id="onboarding-hint" className="onboarding-hint">
          No account needed — just pick a name and start playing.
        </p>
        {error && (
          <p id="onboarding-error" className="form-error" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !name.trim()}
          aria-busy={isLoading}
        >
          {isLoading ? 'Starting…' : 'Start playing'}
        </button>
      </form>
    </section>
  );
}
