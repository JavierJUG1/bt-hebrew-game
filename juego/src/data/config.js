/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN GENERAL DEL JUEGO
 *  Todo lo editable del juego vive aquí o en `rondas.js` / `equipos.js`.
 * ─────────────────────────────────────────────────────────────
 */

export const CONFIG = {
  /** Puntos que gana un equipo por cada ronda superada. */
  puntosPorRonda: 10,

  /**
   * Puntos extra por cada error NO usado al ganar la ronda.
   * Sirve para premiar la precisión y diferenciar equipos en frases largas.
   * Ponlo en 0 para desactivarlo.
   */
  bonusPorErrorNoUsado: 0,

  /**
   * Errores máximos permitidos por ronda, según el nivel.
   * Las frases largas usan casi todas las letras del alfabeto, así que
   * bajar el margen en niveles altos es lo que mantiene la dificultad real.
   * Pon los tres en 6 si prefieres un margen plano.
   */
  erroresMaximosPorNivel: {
    facil: 6,
    intermedio: 5,
    avanzado: 4,
  },

  /**
   * true  → כ y ך se consideran la misma letra: al pulsar una se revelan ambas.
   *         (Recomendado con niños: enseña que la forma final es la misma letra.)
   * false → son letras distintas e independientes.
   * En ambos casos el teclado muestra las 5 formas finales como teclas propias.
   */
  unificarFormasFinales: true,

  /** Duración (ms) de la pantalla de celebración antes de habilitar "Continuar". */
  msCelebracion: 900,
};

/** Etiquetas visibles de cada nivel. */
export const NIVELES = {
  facil: { nombre: 'Nivel fácil', orden: 1 },
  intermedio: { nombre: 'Nivel intermedio', orden: 2 },
  avanzado: { nombre: 'Nivel avanzado', orden: 3 },
};

/** Errores máximos de una ronda concreta. */
export function erroresMaximos(ronda) {
  return CONFIG.erroresMaximosPorNivel[ronda.nivel] ?? 6;
}
