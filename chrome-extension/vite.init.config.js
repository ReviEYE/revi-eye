import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/App.jsx'), 
      name: 'App',
      formats: ['iife'],                        
      fileName: () => 'js/App.js',                
    },
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].js',         
      },
    },
  },
});