import type { ReactNode } from 'react';
import type { Puzzle } from '../types/game.js';

interface GameCardProps {
  puzzle: Puzzle;
  children?: ReactNode;
}

export function GameCard({ puzzle, children }: GameCardProps) {
  return (
    <article className="game-card card" aria-labelledby="puzzle-title">
      <p className="puzzle-meta">
        <span className="puzzle-badge">{puzzle.difficulty}</span>
        <span className="puzzle-type">{puzzle.type}</span>
      </p>
      <h2 id="puzzle-title" className="puzzle-title">
        {puzzle.title}
      </h2>
      <p className="puzzle-question">{puzzle.question}</p>
      {children}
    </article>
  );
}
