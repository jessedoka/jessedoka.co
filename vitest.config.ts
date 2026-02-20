import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    globals: false,
    coverage: {
      provider: 'v8',
      include: ['components/**', 'hooks/**', 'lib/**', 'app/**', 'db/**'],
      exclude: [
        '**/*.config.{ts,js,mjs}',
        '**/node_modules/**',
        '**/.next/**',
        '__tests__/**',
        'vitest.setup.ts',
        'scripts/**',
        'lib/r2.ts',
        'lib/env.mjs',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
