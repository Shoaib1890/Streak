import { StreakDisplay } from './StreakDisplay.js';

interface HeaderProps {
  playerName: string | null;
  currentStreak: number;
  onLogout?: () => void;
}

export function Header({ playerName, currentStreak, onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="header-logo">STREAK</span>
        {playerName && <span className="header-player">{playerName}</span>}
      </div>
      <div className="header-actions">
        <StreakDisplay currentStreak={currentStreak} size="sm" />
        {onLogout && (
          <button type="button" className="btn-text" onClick={onLogout} aria-label="Change player">
            Change
          </button>
        )}
      </div>
    </header>
  );
}
