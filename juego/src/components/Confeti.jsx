import { useMemo } from 'react';

const COLORES = ['#D9B435', '#8FC044', '#2E8B84', '#C25E3A', '#6C5CA8', '#EAC09A'];

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
