import { StreakDisplay } from './StreakDisplay.js';

interface HeaderProps {
  playerName: string | null;
  currentStreak: number;
  onEditDisplayName?: () => void;
}

export function Header({ playerName, currentStreak, onEditDisplayName }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="header-logo" aria-label="Streak">
          STREAK
        </span>
        {playerName && <span className="header-player">Playing as {playerName}</span>}
      </div>
      <div className="header-actions">
        <div className="header-streak" aria-label={`Current streak: ${currentStreak} days`}>
          <StreakDisplay currentStreak={currentStreak} size="sm" showLabel />
        </div>
        {onEditDisplayName && (
          <button
            type="button"
            className="btn-text"
            onClick={onEditDisplayName}
            aria-label="Change display name"
          >
            Edit name
          </button>
        )}
      </div>
    </header>
  );
}
