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
        <span className="header-logo">STREAK</span>
        {playerName && <span className="header-player">{playerName}</span>}
      </div>
      <div className="header-actions">
        <StreakDisplay currentStreak={currentStreak} size="sm" />
        {onEditDisplayName && (
          <button
            type="button"
            className="btn-text"
            onClick={onEditDisplayName}
            aria-label="Change display name"
          >
            Edit display name
          </button>
        )}
      </div>
    </header>
  );
}
