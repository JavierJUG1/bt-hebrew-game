/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN GENERAL DEL JUEGO
 *  Todo lo editable del juego vive aquí o en `rondas.js` / `equipos.js`.
 * ─────────────────────────────────────────────────────────────
 */

export const CONFIG = {
  /** Puntos que gana un equipo por cada ronda superada, según el nivel. */
  puntosPorRondaPorNivel: {
    facil: 10,
    intermedio: 15,
    avanzado: 20,
  },

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

  /**
   * Espera (ms) entre el último fallo y la tarjeta "El burro se quedó plantado".
   * Ese hueco es lo que deja ver la escena completarse: el burro se planta y
   * llegan las moscas. Con 0 la tarjeta tapa la animación al instante.
   * Súbelo si quieres más pausa dramática; bájalo si en el aula se hace lento.
   */
  msAntesDeLaTarjetaDeDerrota: 1200,

  /**
   * Cuántas rondas se juegan de cada nivel, y en qué orden van los niveles.
   *
   * Nueve por nivel con tres equipos significa que cada equipo juega
   * exactamente tres veces en cada nivel: 27 rondas en total.
   *
   * El contenido se baraja DENTRO de cada nivel, nunca entre niveles: dos
   * partidas seguidas traen las palabras en distinto orden, pero la partida
   * siempre empieza fácil y termina difícil. Barajar los once de corrido
   * rompería la curva y podría abrir con un versículo de Salmos.
   *
   * Si en `rondas.js` hay MÁS palabras de las pedidas, cada partida escoge un
   * subconjunto distinto: puedes acumular decenas de palabras y el juego nunca
   * repetirá la misma sesión. Si hay menos, se juegan las que haya.
   * Pon `null` en un nivel para que se jueguen todas las suyas.
   */
  rondasPorNivel: {
    facil: 9,
    intermedio: 9,
    avanzado: 9,
  },
  ordenDeNiveles: ['facil', 'intermedio', 'avanzado'],
};

/**
 * ─────────────────────────────────────────────────────────
 *  SONIDO
 *  Los seis MP3 están en `Assets/audios/`. Para cambiar una pista basta con
 *  reemplazar el archivo conservando el nombre y volver a compilar.
 * ─────────────────────────────────────────────────────────
 */
export const SONIDO = {
  /** Con qué estado arranca el juego. El botón de la barra lo alterna. */
  activo: true,

  /**
   * La música es fondo, no protagonista: tiene que dejar oír a los niños
   * leyendo hebreo en voz alta. 0.30 es alto en un portátil y correcto en un
   * salón con parlante. Los efectos van fuertes porque son el premio.
   */
  volumenMusica: 0.3,
  volumenEfectos: 0.9,

  /** Volumen de la música mientras suena un efecto que solo la atenúa. */
  volumenMusicaAtenuada: 0.08,

  /**
   * Qué le pasa a la música cuando suena cada efecto:
   *   'pausar'  → se detiene del todo y vuelve al acabar el efecto
   *   'atenuar' → baja y se recupera al acabar
   *   'detener' → se apaga y no vuelve
   *   'nada'    → sigue igual
   */
  efectoSobreMusica: {
    palabraCompletada: 'atenuar',
    pierdeIntentos: 'pausar',
    victoria: 'detener',
  },
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

/** Puntos base de una ronda concreta, según su nivel. */
export function puntosPorRonda(ronda) {
  return CONFIG.puntosPorRondaPorNivel[ronda.nivel] ?? 10;
}
