import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths
  resolve: {
    alias: {
      '@': resolve(__dirname, 'popup-src/src'),
      '@/components': resolve(__dirname, 'popup-src/src/components'),
      '@/services': resolve(__dirname, 'popup-src/src/services'),
      '@/types': resolve(__dirname, 'popup-src/src/types')
    }
  },
  build: {
    outDir: 'popup/dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup-src/index.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
    emptyOutDir: true,
  },
  define: {
    global: 'globalThis',
  },
})
