/**
 * Normalizes an answer or guess string by:
 * 1. Trimming leading and trailing whitespace.
 * 2. Converting all characters to lowercase.
 * 3. Collapsing multiple contiguous spaces into a single space.
 */
export function normalizeAnswer(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}
