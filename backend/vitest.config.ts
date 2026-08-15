import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Integration suites share a test database and NODE_ENV-sensitive app module.
    fileParallelism: false,
    setupFiles: ['./tests/setup.ts'],
  },
});
