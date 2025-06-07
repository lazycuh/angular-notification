/* eslint-disable import/no-default-export */
/// <reference types="vitest" />

import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  return {
    define: {
      'import.meta.vitest': mode !== 'production'
    },
    plugins: [angular(), viteTsConfigPaths()],
    test: {
      browser: {
        enabled: true,
        headless: true,
        instances: [{ browser: 'chromium' }],
        provider: 'playwright'
      },
      environment: 'happy-dom',
      exclude: ['**/*.js', '**/*.mjs', '**/*.mts'],
      globals: true,
      include: ['projects/angular-notification/src/**/*.{test,spec}.ts'],
      setupFiles: ['./vitest/setup.ts']
    }
  };
});
