import type { ReactNode } from 'react';
import type { Puzzle } from '../types/game.js';

interface GameCardProps {
  puzzle: Puzzle;
  children?: ReactNode;
}

export function GameCard({ puzzle, children }: GameCardProps) {
  const difficultyClass = `puzzle-badge--${puzzle.difficulty.toLowerCase()}`;

  return (
    <article className="game-card card" aria-labelledby="puzzle-title">
      <div className="puzzle-meta">
        <span className={`puzzle-badge ${difficultyClass}`}>{puzzle.difficulty}</span>
        <span className="puzzle-type">{puzzle.type}</span>
      </div>
      <h2 id="puzzle-title" className="puzzle-title">
        {puzzle.title}
      </h2>
      <blockquote className="puzzle-question" cite="">
        {puzzle.question}
      </blockquote>
      {children && <div className="guess-section">{children}</div>}
    </article>
  );
}
