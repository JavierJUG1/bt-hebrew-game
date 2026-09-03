import { NIVELES } from '../data/config.js';
import { SiluetaBurro } from './Burro.jsx';
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
          <SiluetaBurro variante={2} />
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
