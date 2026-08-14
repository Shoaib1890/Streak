import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak?: number;
  size?: 'sm' | 'lg';
}

export function StreakDisplay({ currentStreak, longestStreak, size = 'lg' }: StreakDisplayProps) {
  const isLarge = size === 'lg';

  return (
    <div className={`streak-display ${isLarge ? 'streak-display--lg' : 'streak-display--sm'}`} aria-live="polite">
      <div className="streak-flame" aria-hidden="true">
        <Flame size={isLarge ? 28 : 20} />
      </div>
      <div className="streak-numbers">
        <span className="streak-current" aria-label={`Current streak: ${currentStreak} days`}>
          {currentStreak}
        </span>
        {longestStreak !== undefined && (
          <span className="streak-longest" aria-label={`Longest streak: ${longestStreak} days`}>
            Best: {longestStreak}
          </span>
        )}
      </div>
    </div>
  );
}
