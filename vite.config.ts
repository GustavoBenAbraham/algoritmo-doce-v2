import { defineConfig } from 'vite';

export default defineConfig({
  base: '/algoritmo-doce-v2/',
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});