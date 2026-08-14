import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Integration suites share a database and NODE_ENV-sensitive app module.
    fileParallelism: false,
  },
});
