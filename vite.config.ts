import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      base: './',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.NODE_ENV': JSON.stringify(mode)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: process.env.VITE_WC ? {
        target: 'es2015',
        outDir: 'dist/wc',
        emptyOutDir: false,
        lib: {
          entry: path.resolve(__dirname, 'pocketbase-worksheet.tsx'),
          name: 'TJPocketBaseWorksheet',
          fileName: (format) => `tj-pocketbase-worksheet.${format}.js`
        }
      } : {
        target: 'es2015',
        outDir: 'dist',
        emptyOutDir: true
      }
    };
});
