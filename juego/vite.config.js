import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build` genera un HTML único y autocontenido en dist/,
// pensado para abrirlo con doble clic y proyectarlo sin servidor.
//
// Los MP3 no se copian dentro de `juego/`: se importan desde `Assets/audios`
// mediante el alias `@audios`, que es donde viven los originales. Con
// `assetsInlineLimit` en 100 MB, Vite los incrusta en el HTML al compilar,
// así que el archivo final sigue siendo uno solo.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      '@audios': fileURLToPath(new URL('../Assets/audios', import.meta.url)),
    },
  },
  server: {
    // `npm run dev` necesita permiso para leer fuera de `juego/`.
    fs: { allow: ['..'] },
  },
  build: {
    target: 'es2018',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 20000,
  },
});
