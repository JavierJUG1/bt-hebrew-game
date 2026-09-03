import { useMemo } from 'react';

/**
 * Confeti en la paleta institucional. Se incluye el dorado del trofeo como
 * único acento cálido: es el color del logro, no de la interfaz.
 * El blanco se mantiene porque el confeti cae sobre el velo azul oscuro.
 */
const COLORES = ['#1d71b8', '#3dc0ff', '#0098e1', '#003b57', '#ffffff', '#d9b435'];

export default function Confeti({ piezas = 90 }) {
  const trozos = useMemo(
    () =>
      Array.from({ length: piezas }, (_, i) => ({
        i,
        left: Math.random() * 100,
        delay: Math.random() * 1.6,
        dur: 2.6 + Math.random() * 2.4,
        color: COLORES[i % COLORES.length],
        escala: 0.6 + Math.random() * 0.9,
        redondo: Math.random() > 0.72,
      })),
    [piezas]
  );

  return (
    <div className="confeti" aria-hidden="true">
      {trozos.map((t) => (
        <i
          key={t.i}
          style={{
            left: `${t.left}%`,
            background: t.color,
            animationDelay: `${t.delay}s`,
            animationDuration: `${t.dur}s`,
            transform: `scale(${t.escala})`,
            borderRadius: t.redondo ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
