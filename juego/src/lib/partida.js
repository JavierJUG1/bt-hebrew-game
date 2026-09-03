/**
 * ─────────────────────────────────────────────────────────
 *  ARMADO DE LA PARTIDA
 *
 *  Decide qué rondas se juegan y en qué orden. Se llama una vez al empezar
 *  y otra vez en cada partida nueva, así que dos partidas seguidas nunca
 *  traen las palabras en el mismo orden.
 *
 *  La dificultad SÍ mantiene su orden: primero todas las fáciles, luego las
 *  intermedias, luego las avanzadas. Lo que se baraja es el contenido dentro
 *  de cada nivel. Barajar los once de corrido rompería la curva de
 *  aprendizaje y podría abrir la partida con un versículo de Salmos.
 * ─────────────────────────────────────────────────────────
 */

/** Baraja una copia del array (Fisher-Yates). */
function barajar(lista) {
  const l = [...lista];
  for (let i = l.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [l[i], l[j]] = [l[j], l[i]];
  }
  return l;
}

/**
 * Devuelve las rondas de una partida: barajadas dentro de cada nivel y con
 * los niveles en orden de dificultad.
 *
 * `rondasPorNivel` dice cuántas se juegan de cada nivel. Si en `rondas.js`
 * hay más de las pedidas, cada partida escoge un subconjunto distinto: se
 * pueden acumular decenas de palabras y el juego nunca repetirá la misma
 * sesión. Si hay menos, se juegan las que haya sin fallar.
 *
 * Con `null` en lugar de un número se juegan todas las de ese nivel.
 */
export function armarPartida(rondas, config) {
  const seleccion = [];

  for (const nivel of config.ordenDeNiveles) {
    const delNivel = rondas.filter((r) => r.nivel === nivel);
    const cuantas = config.rondasPorNivel[nivel];
    const barajadas = barajar(delNivel);
    seleccion.push(...(cuantas == null ? barajadas : barajadas.slice(0, cuantas)));
  }

  // Red de seguridad: si la configuración deja la partida vacía (un nivel mal
  // escrito, por ejemplo), se juegan todas las rondas antes que romperse.
  return seleccion.length > 0 ? seleccion : barajar(rondas);
}

/** Cuántas rondas de cada nivel hay disponibles. Útil para revisar el banco. */
export function inventario(rondas) {
  return rondas.reduce((n, r) => ({ ...n, [r.nivel]: (n[r.nivel] ?? 0) + 1 }), {});
}
