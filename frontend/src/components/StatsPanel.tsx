import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import type { PlayerStats } from '../types/game.js';

interface StatsPanelProps {
  playerId: string;
}

export function StatsPanel({ playerId }: StatsPanelProps) {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    api.getPlayerStats(playerId).then(setStats).catch(() => setStats(null));
  }, [playerId, open]);

  return (
    <div className="stats-panel">
      <button
        type="button"
        className="btn btn-secondary stats-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="stats-content"
      >
        {open ? 'Hide stats' : 'Your stats'}
      </button>
      {open && stats && (
        <dl id="stats-content" className="stats-grid card">
          <div>
            <dt>Current streak</dt>
            <dd>{stats.currentStreak}</dd>
          </div>
          <div>
            <dt>Longest streak</dt>
            <dd>{stats.longestStreak}</dd>
          </div>
          <div>
            <dt>Games played</dt>
            <dd>{stats.totalGames}</dd>
          </div>
          <div>
            <dt>Correct answers</dt>
            <dd>{stats.totalCorrect}</dd>
          </div>
          <div>
            <dt>Accuracy</dt>
            <dd>{Math.round(stats.accuracy * 100)}%</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
