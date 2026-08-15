import { useEffect, useState } from 'react';
import { BarChart3, ChevronDown } from 'lucide-react';
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
    <section className="stats-panel" aria-label="Your statistics">
      <button
        type="button"
        className={`stats-toggle ${open ? 'stats-toggle--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="stats-content"
      >
        <span className="stats-toggle-left">
          <BarChart3 className="stats-toggle-icon" size={18} aria-hidden="true" />
          <span className="stats-toggle-label">Your stats</span>
        </span>
        <ChevronDown className="stats-toggle-chevron" size={18} aria-hidden="true" />
      </button>
      {open && stats && (
        <dl id="stats-content" className="stats-grid card">
          <div className="stats-item">
            <dt>Current streak</dt>
            <dd>{stats.currentStreak}</dd>
          </div>
          <div className="stats-item">
            <dt>Longest streak</dt>
            <dd>{stats.longestStreak}</dd>
          </div>
          <div className="stats-item">
            <dt>Games played</dt>
            <dd>{stats.totalGames}</dd>
          </div>
          <div className="stats-item">
            <dt>Correct answers</dt>
            <dd>{stats.totalCorrect}</dd>
          </div>
          <div className="stats-item stats-item--full">
            <dt>Accuracy</dt>
            <dd>{Math.round(stats.accuracy * 100)}%</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
