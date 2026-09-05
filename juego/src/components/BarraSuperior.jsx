import { NIVELES } from '../data/config.js';
import { BEIT_TESHUVA } from '../data/imagenes.js';
import BotonSonido from './BotonSonido.jsx';

export default function BarraSuperior({
  rondas,
  rondaIdx,
  ronda,
  onReiniciar,
  sonidoActivo,
  sonidoBloqueado,
  onAlternarSonido,
}) {
  return (
    <header className="barra">
      <div className="marca">
        <div className="marca__icono">
          <img
            src={BEIT_TESHUVA.src}
            width={BEIT_TESHUVA.ancho}
            height={BEIT_TESHUVA.alto}
            alt={BEIT_TESHUVA.alt}
            decoding="async"
          />
        </div>
        <div className="marca__texto">
          <span className="marca__titulo">Adivina la palabra</span>
          <span className="marca__sub">Vocabulario hebreo</span>
        </div>
      </div>

      <div className="barra__centro">
        <span className="nivel-chip" data-nivel={ronda.nivel}>
          {NIVELES[ronda.nivel].nombre}
        </span>

        <div className="progreso">
          <div className="progreso__puntos" aria-hidden="true">
            {rondas.map((r, i) => (
              <span
                key={r.numero}
                className="progreso__punto"
                data-nivel={r.nivel}
                data-estado={i < rondaIdx ? 'hecha' : i === rondaIdx ? 'actual' : 'pendiente'}
              />
            ))}
          </div>
          <span className="progreso__texto">
            Ronda {rondaIdx + 1} de {rondas.length}
          </span>
        </div>
      </div>

      <div className="barra__acciones">
        <BotonSonido
          activo={sonidoActivo}
          bloqueado={sonidoBloqueado}
          onAlternar={onAlternarSonido}
        />
        <button className="btn-discreto" onClick={onReiniciar}>
          Reiniciar partida
        </button>
      </div>
    </header>
  );
}
