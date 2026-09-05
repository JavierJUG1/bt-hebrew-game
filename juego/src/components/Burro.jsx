import { useEffect, useRef, useState } from 'react';
import { VIEW_BOX, SUELO, ESTADOS_BURRO } from '../data/burro.js';
import Moscas from './Moscas.jsx';

/**
 * Traduce el número de errores al fotograma del burro.
 * Siempre empieza en la estaca sola y siempre termina en el burro completo,
 * repartiendo los 7 fotogramas entre los errores máximos del nivel.
 */
export function fotogramaDeErrores(errores, maximo) {
  const ultimo = ESTADOS_BURRO.length - 1; // 6
  if (maximo <= 0) return 0;
  return Math.min(ultimo, Math.round((errores * ultimo) / maximo));
}

/** Nubecita de polvo, para acompañar cada intento fallido sin violencia. */
function Polvo({ llave }) {
  return (
    <svg key={llave} className="polvo" viewBox="0 0 120 60" aria-hidden="true">
      <g fill="#a9c8de">
        <ellipse cx="34" cy="40" rx="26" ry="15" opacity=".55" />
        <ellipse cx="66" cy="32" rx="19" ry="12" opacity=".42" />
        <ellipse cx="92" cy="41" rx="13" ry="9" opacity=".3" />
      </g>
    </svg>
  );
}

export default function Burro({ errores, maximo, derrota }) {
  const indice = derrota ? ESTADOS_BURRO.length - 1 : fotogramaDeErrores(errores, maximo);
  const estado = ESTADOS_BURRO[indice];
  const previo = useRef(indice);
  const [polvo, setPolvo] = useState(0);

  useEffect(() => {
    if (indice > previo.current) setPolvo((n) => n + 1);
    previo.current = indice;
  }, [indice]);

  return (
    <div className="burro-escena">
      <svg viewBox={VIEW_BOX} aria-hidden="true">
        <g dangerouslySetInnerHTML={{ __html: SUELO }} />
      </svg>

      <div className="burro-escena__capa" key={estado.id}>
        <svg viewBox={VIEW_BOX} role="img" aria-label={descripcion(indice)}>
          <g
            className="burro-escena__respira"
            dangerouslySetInnerHTML={{ __html: estado.svg }}
          />
        </svg>
      </div>

      {polvo > 0 && <Polvo llave={polvo} />}

      {/* Las moscas van en su propia capa: la del burro tiene animación de
          entrada y transform-origin propios, y las heredarían. */}
      {derrota && (
        <svg className="burro-escena__moscas" viewBox={VIEW_BOX} aria-hidden="true">
          <Moscas cantidad={maximo} />
        </svg>
      )}
    </div>
  );
}

function descripcion(i) {
  return [
    'Una estaca clavada en el suelo.',
    'La estaca con su cuerda.',
    'El burro asoma la cabeza junto a la estaca.',
    'El burro ya tiene cabeza y lomo.',
    'El burro apoya sus patas delanteras.',
    'El burro completo, de pie junto a la estaca.',
    'El burro se ha instalado del todo y no piensa moverse, con las moscas rondándolo.',
  ][i];
}
