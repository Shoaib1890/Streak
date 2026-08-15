import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak?: number;
  size?: 'sm' | 'lg';
  showLabel?: boolean;
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  size = 'lg',
  showLabel = false,
}: StreakDisplayProps) {
  const isLarge = size === 'lg';
  const dayWord = currentStreak === 1 ? 'day' : 'days';

  return (
    <div
      className={`streak-display ${isLarge ? 'streak-display--lg' : 'streak-display--sm'}`}
      aria-live="polite"
    >
      <div className="streak-flame" aria-hidden="true">
        <Flame size={isLarge ? 28 : 18} fill="currentColor" />
      </div>
      <div className="streak-numbers">
        <span className="streak-current" aria-label={`Current streak: ${currentStreak} days`}>
          {currentStreak}
        </span>
        {showLabel && (
          <span className="streak-unit" aria-hidden="true">
            {dayWord}
          </span>
        )}
        {longestStreak !== undefined && (
          <span className="streak-longest" aria-label={`Longest streak: ${longestStreak} days`}>
            Best: {longestStreak}
          </span>
        )}
      </div>
    </div>
  );
}
