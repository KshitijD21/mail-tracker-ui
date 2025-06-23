import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
     'src/background.ts',
    'src/scripts/content.ts'
  ],
  outDir: 'dist',
  format: ['iife'], // Chrome doesn't support ESM
  target: 'es2020',
  splitting: false,
  clean: true,
  sourcemap: true,
  minify: false
});
