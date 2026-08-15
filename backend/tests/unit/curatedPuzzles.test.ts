import { describe, it, expect } from 'vitest';
import { normalizeAnswer } from '../../src/lib/normalize.js';
import { CURATED_PUZZLES } from '../../prisma/curated-puzzles.js';

describe('curated production puzzles', () => {
  it('should have at least 30 puzzles with unique game-day offsets', () => {
    expect(CURATED_PUZZLES.length).toBeGreaterThanOrEqual(30);
    const offsets = CURATED_PUZZLES.map((p) => p.offsetDays);
    expect(new Set(offsets).size).toBe(offsets.length);
  });

  it('should use answers that match server normalization', () => {
    for (const puzzle of CURATED_PUZZLES) {
      expect(normalizeAnswer(puzzle.answer)).toBe(puzzle.answer);
      expect(puzzle.title.toLowerCase()).not.toContain('integration test');
      expect(puzzle.question.toLowerCase()).not.toContain('2 + 2');
    }
  });
});
