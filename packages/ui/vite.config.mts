import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import linaria from '@wyw-in-js/vite';
import path from 'path';
import i18nextLoader from 'vite-plugin-i18next-loader'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    linaria(),
    i18nextLoader({
      paths: ['../i18n/lib/locales'],
      namespaceResolution: 'relativePath'
    })
  ],
  server: {
    port: 3000,
  },
});
