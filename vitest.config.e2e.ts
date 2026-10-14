import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Applies migrations to the test database (.env.test locally, job env in CI).
    globalSetup: './test/global-setup.ts',
  },
});
