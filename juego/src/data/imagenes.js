/**
 * ─────────────────────────────────────────────────────────
 *  MARCAS GRÁFICAS
 *  Los isotipos viven en `Assets/img/`, fuera de `juego/`. El alias `@img`
 *  de vite.config.js apunta ahí, igual que `@audios` con el sonido.
 *
 *  En `npm run dev` Vite los sirve como archivos sueltos; en `npm run build`
 *  los incrusta en el HTML único, así que el archivo de doble clic sigue
 *  funcionando sin carpetas al lado.
 * ─────────────────────────────────────────────────────────
 */

import isotipoBeitTeshuva from '@img/isotipo_beit_teshuva.png';
import isotipoArbaRujot from '@img/isotipo_arbarujot_320.png';

/** Isotipo de la congregación. Va en la barra superior, como marca del juego. */
export const BEIT_TESHUVA = {
  src: isotipoBeitTeshuva,
  alto: 148,
  ancho: 161,
  alt: 'Congregación Beit Teshuvá',
};

/**
 * Isotipo de arba rujot, para el crédito de autoría del pie.
 *
 * Se usa una copia reducida a 320 px, no el original de 2531 px: a tamaño
 * completo el navegador tendría que decodificar 24 MB de mapa de bits para
 * pintar un sello de 24 px, y en un teléfono eso se nota. El archivo original
 * sigue en `Assets/img/` como maestro; si lo cambias, vuelve a generar la
 * copia reducida conservando el nombre.
 */
export const ARBA_RUJOT = {
  src: isotipoArbaRujot,
  alto: 320,
  ancho: 320,
  alt: 'arba rujot',
};
