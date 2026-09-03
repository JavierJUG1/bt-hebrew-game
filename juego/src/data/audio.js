/**
 * ─────────────────────────────────────────────────────────
 *  AUDIO DEL JUEGO
 *  Los seis MP3 viven en `Assets/audios/`, fuera de `juego/`, para no
 *  duplicarlos. El alias `@audios` de vite.config.js apunta ahí.
 *
 *  En `npm run dev` Vite los sirve como archivos sueltos (arranque rápido).
 *  En `npm run build` los incrusta en el HTML único, así que el archivo de
 *  doble clic sigue funcionando sin carpetas al lado y sin internet.
 *
 *  Para cambiar una pista basta con reemplazar el MP3 en `Assets/audios/`
 *  conservando el nombre y volver a compilar.
 * ─────────────────────────────────────────────────────────
 */

import musicaFondo1 from '@audios/MUSICA FONDO 1.mp3';
import musicaFondo2 from '@audios/MUSICA FONDO 2.mp3';
import musicaFondo3 from '@audios/MUSICA FONDO 3.mp3';
import palabraCompletada from '@audios/PALABRA COMPLETADA.mp3';
import pierdeTodosLosIntentos from '@audios/PIERDE TODOS LOS INTENTOS.mp3';
import victoria from '@audios/VICTORIA.mp3';

/** Música de fondo. Se reproduce en orden aleatorio y en bucle. */
export const MUSICA = [
  { id: 'fondo-1', nombre: 'Música de fondo 1', src: musicaFondo1 },
  { id: 'fondo-2', nombre: 'Música de fondo 2', src: musicaFondo2 },
  { id: 'fondo-3', nombre: 'Música de fondo 3', src: musicaFondo3 },
];

/** Efectos puntuales, disparados por los eventos de la partida. */
export const EFECTOS = {
  palabraCompletada: { nombre: 'Palabra completada', src: palabraCompletada },
  pierdeIntentos: { nombre: 'Pierde todos los intentos', src: pierdeTodosLosIntentos },
  victoria: { nombre: 'Victoria', src: victoria },
};
