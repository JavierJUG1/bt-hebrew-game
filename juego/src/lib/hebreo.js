/**
 * ─────────────────────────────────────────────────────────────
 *  LÓGICA HEBREA
 *
 *  Reglas que implementa este módulo:
 *   · El texto se MUESTRA exactamente como fue escrito (niqqud incluido).
 *   · La COMPARACIÓN de letras ignora niqqud, te'amim y demás marcas.
 *   · Espacios y signos (־ ׃ , . ׳ ״) se muestran desde el inicio y no se
 *     pueden seleccionar.
 *   · Las letras repetidas se revelan todas a la vez.
 *   · Las formas finales (ך ם ן ף ץ) se resuelven según CONFIG.
 * ─────────────────────────────────────────────────────────────
 */

/** Las 22 letras del alefbet, en orden alfabético. */
export const LETRAS_BASE = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ',
  'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת',
];

/** Formas finales (sofit). */
export const LETRAS_FINALES = ['ך', 'ם', 'ן', 'ף', 'ץ'];

/** Cada forma final con su letra base. */
export const FINAL_A_BASE = {
  'ך': 'כ',
  'ם': 'מ',
  'ן': 'נ',
  'ף': 'פ',
  'ץ': 'צ',
};

/** Nombres para lectores de pantalla y para la ayuda. */
export const NOMBRE_LETRA = {
  'א': 'álef', 'ב': 'bet', 'ג': 'guímel', 'ד': 'dálet', 'ה': 'hei',
  'ו': 'vav', 'ז': 'záyin', 'ח': 'jet', 'ט': 'tet', 'י': 'yod',
  'כ': 'kaf', 'ל': 'lámed', 'מ': 'mem', 'נ': 'nun', 'ס': 'sámej',
  'ע': 'áyin', 'פ': 'pei', 'צ': 'tzadi', 'ק': 'kof', 'ר': 'reish',
  'ש': 'shin', 'ת': 'tav',
  'ך': 'kaf sofit', 'ם': 'mem sofit', 'ן': 'nun sofit',
  'ף': 'pei sofit', 'ץ': 'tzadi sofit',
};

const COD = (c) => c.codePointAt(0);

/** ¿Es una letra hebrea consonántica? (U+05D0–U+05EA) */
export function esLetraHebrea(c) {
  const n = COD(c);
  return n >= 0x05d0 && n <= 0x05ea;
}

/**
 * ¿Es una marca combinante (niqqud, dagesh, te'amim, punto de shin/sin,
 * qamats qatan)? Se excluye deliberadamente U+05BE (maqaf), que es un
 * signo de puntuación visible y NO una marca.
 */
export function esMarcaCombinante(c) {
  const n = COD(c);
  return (
    (n >= 0x0591 && n <= 0x05bd) || // te'amim + niqqud + meteg
    n === 0x05bf || // rafe
    n === 0x05c1 || // punto de shin
    n === 0x05c2 || // punto de sin
    n === 0x05c4 || n === 0x05c5 || // marcas de escriba
    n === 0x05c7 || // qamats qatan
    (n >= 0x0610 && n <= 0x061a) ||
    (n >= 0x200c && n <= 0x200f) // marcas de dirección invisibles
  );
}

/**
 * Devuelve la "clave" de comparación de una letra: la letra sin marcas y,
 * si se han unificado las formas finales, reducida a su forma base.
 */
export function claveDe(letra, unificarFinales = true) {
  if (unificarFinales && FINAL_A_BASE[letra]) return FINAL_A_BASE[letra];
  return letra;
}

/**
 * Parte una frase hebrea en fichas (tokens) listas para pintar.
 *
 * Cada letra arrastra consigo todas sus marcas combinantes, de modo que al
 * revelarla aparece con su niqqud original intacto.
 *
 * Devuelve una lista de palabras; cada palabra es una lista de fichas:
 *   { tipo: 'letra', texto: 'שְׁ', base: 'ש', clave: 'ש', indice: 0 }
 *   { tipo: 'signo', texto: '־' }
 */
export function analizarFrase(texto, unificarFinales = true) {
  const palabras = [];
  let palabra = [];
  let indice = 0;

  const cerrarPalabra = () => {
    if (palabra.length) palabras.push(palabra);
    palabra = [];
  };

  const chars = Array.from(texto);
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];

    if (c === ' ' || c === ' ') {
      cerrarPalabra();
      continue;
    }

    if (esMarcaCombinante(c)) continue; // marca suelta: no debería ocurrir

    // Recoge la letra o el signo junto con sus marcas combinantes.
    let texto_ = c;
    while (i + 1 < chars.length && esMarcaCombinante(chars[i + 1])) {
      texto_ += chars[i + 1];
      i++;
    }

    if (esLetraHebrea(c)) {
      palabra.push({
        tipo: 'letra',
        texto: texto_,
        base: c,
        clave: claveDe(c, unificarFinales),
        indice: indice++,
      });
    } else {
      palabra.push({ tipo: 'signo', texto: texto_ });
    }
  }
  cerrarPalabra();
  return palabras;
}

/** Conjunto de claves que hay que adivinar en una frase. */
export function clavesObjetivo(palabras) {
  const s = new Set();
  for (const p of palabras) {
    for (const f of p) if (f.tipo === 'letra') s.add(f.clave);
  }
  return s;
}

/** ¿Se han descubierto ya todas las letras? */
export function frasesCompleta(palabras, usadas) {
  for (const clave of clavesObjetivo(palabras)) {
    if (!usadas.has(clave)) return false;
  }
  return true;
}

/** Cuántas fichas revela una letra concreta (0 = error). */
export function contarAciertos(palabras, clave) {
  let n = 0;
  for (const p of palabras) {
    for (const f of p) if (f.tipo === 'letra' && f.clave === clave) n++;
  }
  return n;
}

/**
 * Teclas del teclado virtual: las 22 letras más las 5 formas finales.
 * `clave` es lo que se compara; `simbolo` es lo que se pinta.
 */
export function construirTeclado(unificarFinales = true) {
  const base = LETRAS_BASE.map((l) => ({
    simbolo: l,
    clave: claveDe(l, unificarFinales),
    nombre: NOMBRE_LETRA[l],
    final: false,
  }));
  const finales = LETRAS_FINALES.map((l) => ({
    simbolo: l,
    clave: claveDe(l, unificarFinales),
    nombre: NOMBRE_LETRA[l],
    final: true,
  }));
  return { base, finales };
}
