import { describe, it, expect } from 'vitest';
import { normalizeAnswer } from '../../src/lib/normalize.js';

describe('normalizeAnswer', () => {
  it('should trim leading and trailing spaces', () => {
    expect(normalizeAnswer('   map   ')).toBe('map');
  });

  it('should convert characters to lowercase', () => {
    expect(normalizeAnswer('MAP')).toBe('map');
    expect(normalizeAnswer('Map')).toBe('map');
  });

  it('should collapse multiple contiguous spaces into a single space', () => {
    expect(normalizeAnswer('map  riddle')).toBe('map riddle');
    expect(normalizeAnswer('  hello   world  ')).toBe('hello world');
  });

  it('should handle empty input correctly', () => {
    expect(normalizeAnswer('   ')).toBe('');
  });
});
