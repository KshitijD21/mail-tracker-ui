import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
     'mail-tracker-extension/src/background.ts',
    'mail-tracker-extension/src/scripts/content.ts'
  ],
  outDir: 'mail-tracker-extension/dist',
  format: ['iife'], // Chrome doesn't support ESM
  target: 'es2020',
  splitting: false,
  clean: true,
  sourcemap: true,
  minify: false
});
