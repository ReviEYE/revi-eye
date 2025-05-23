import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        Main: resolve(__dirname, 'src/toggle/Main.jsx'),
        index: resolve(__dirname, 'public/index.html'),
      },
      output: {
        entryFileNames: 'js/[name].js',
      },
    },
  },
});