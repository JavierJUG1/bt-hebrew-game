/**
 * Enjambre de moscas que aparece SOLO cuando el equipo agota los intentos.
 *
 * Las moscas son los assets `Mosca_1/2/3.svg` de `Assets/piezas burro/`, que
 * llegan aquí ya normalizados dentro de `SILUETAS` (los genera
 * `herramientas/generar_burro.py`). No son tres moscas distintas: son **tres
 * fotogramas de la misma mosca vista desde arriba**, con las alas en tres
 * posiciones. Ciclándolos deprisa se obtiene el aleteo.
 *
 * Cada fotograma tiene su propio viewBox y su cuerpo cae en un sitio distinto
 * del lienzo, así que hay que alinearlos por el abdomen: si se centraran por
 * el viewBox, la mosca daría un salto en cada cambio de ala. Los valores de
 * ANCLAJES están medidos sobre los archivos reales, no estimados.
 *
 * Se dibujan dentro del mismo viewBox que el burro, así que su tamaño y sus
 * órbitas escalan solos con la escena: no hace falta ningún cálculo en JS.
 *
 * Hay una mosca por cada intento agotado (6, 5 o 4 según el nivel).
 */

import { SILUETAS } from '../data/burro.js';

/** Altura de la mosca en unidades del viewBox de la escena (1693 × 1476). */
const TAM = 104;

/**
 * Centro del abdomen y borde inferior de cada fotograma, en unidades de su
 * propio viewBox. Medidos rasterizando los SVG y buscando el centroide de los
 * píxeles oscuros del tramo inferior, que es el cuerpo.
 */
const ANCLAJES = [
  { cx: 33.96, cy: 47.7, alto: 54.45 }, // Mosca_1 · alas abiertas
  { cx: 34.48, cy: 45.7, alto: 56.21 }, // Mosca_2 · alas arriba, asimétricas
  { cx: 22.59, cy: 46.0, alto: 56.49 }, // Mosca_3 · alas arriba, simétricas
];

/** Órbitas repartidas alrededor del burro, en coordenadas del viewBox. */
const ORBITAS = [
  { x: 470,  y: 380,  rx: 150, ry: 95,  dur: 4.6, retardo: 0.05, sentido: 'normal',  escala: 1,    aleteo: 0.21 },
  { x: 850,  y: 300,  rx: 190, ry: 110, dur: 5.4, retardo: 0.30, sentido: 'reverse', escala: 0.86, aleteo: 0.18 },
  { x: 1190, y: 610,  rx: 165, ry: 100, dur: 4.1, retardo: 0.16, sentido: 'normal',  escala: 1.06, aleteo: 0.24 },
  { x: 620,  y: 900,  rx: 140, ry: 85,  dur: 3.6, retardo: 0.44, sentido: 'reverse', escala: 0.92, aleteo: 0.2  },
  { x: 1010, y: 1075, rx: 175, ry: 95,  dur: 5.0, retardo: 0.22, sentido: 'normal',  escala: 0.8,  aleteo: 0.23 },
  { x: 1370, y: 940,  rx: 130, ry: 80,  dur: 4.3, retardo: 0.38, sentido: 'reverse', escala: 0.96, aleteo: 0.19 },
];

/**
 * Los SVG traen un <defs><style> con sus clases de color. Se separa del dibujo
 * para emitirlo una sola vez: si no, se repetiría dieciocho veces (tres
 * fotogramas por seis moscas). Las clases ya vienen prefijadas por fotograma
 * (m0-, m1-, m2-), así que no chocan entre sí.
 */
const CUADROS = SILUETAS.map((s) => {
  const fin = s.svg.indexOf('</defs>');
  return fin === -1
    ? { defs: '', dibujo: s.svg }
    : { defs: s.svg.slice(0, fin + 7), dibujo: s.svg.slice(fin + 7) };
});

/** Una mosca: los tres fotogramas superpuestos, alineados por el abdomen. */
function Mosca({ aleteo }) {
  return (
    <g className="mosca__aleteo" style={{ '--aleteo': `${aleteo}s` }}>
      {CUADROS.map((c, i) => {
        const a = ANCLAJES[i];
        const k = TAM / a.alto;
        return (
          <g
            key={i}
            className="mosca__cuadro"
            style={{ '--indice': i }}
            transform={`scale(${k.toFixed(4)}) translate(${-a.cx} ${-a.cy})`}
            dangerouslySetInnerHTML={{ __html: c.dibujo }}
          />
        );
      })}
    </g>
  );
}

export default function Moscas({ cantidad = 6 }) {
  const orbitas = ORBITAS.slice(0, Math.max(1, Math.min(cantidad, ORBITAS.length)));

  return (
    <g className="moscas" aria-hidden="true">
      <g dangerouslySetInnerHTML={{ __html: CUADROS.map((c) => c.defs).join('') }} />

      {orbitas.map((o, i) => (
        <g key={i} transform={`translate(${o.x} ${o.y})`}>
          <g className="mosca__entra" style={{ '--retardo': `${o.retardo}s` }}>
            <g
              className="mosca__vuelo"
              style={{
                '--rx': `${o.rx}px`,
                '--ry': `${o.ry}px`,
                '--dur': `${o.dur}s`,
                animationDirection: o.sentido,
                animationDelay: `${o.retardo}s`,
              }}
            >
              <g className="mosca__cuerpo-g" style={{ '--escala': o.escala }}>
                <Mosca aleteo={o.aleteo} />
              </g>
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}
