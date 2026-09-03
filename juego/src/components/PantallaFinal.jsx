import Confeti from './Confeti.jsx';
import Trofeo from './Trofeo.jsx';

export default function PantallaFinal({ equipos, puntajes, onNuevaPartida }) {
  const maximo = Math.max(...puntajes);
  const ganadores = equipos
    .map((eq, i) => ({ eq, pts: puntajes[i] }))
    .filter((x) => x.pts === maximo);

  const empate = ganadores.length > 1;
  const clasificacion = equipos
    .map((eq, i) => ({ eq, pts: puntajes[i] }))
    .sort((a, b) => b.pts - a.pts);

  return (
    <>
      <Confeti piezas={130} />
      <div className="capa" role="dialog" aria-modal="true" aria-live="assertive">
        <div className="tarjeta">
          <Trofeo />

          <h2 className="tarjeta__grito tarjeta__grito--bien">
            🏆 ¡TENEMOS {empate ? 'UN EMPATE' : 'UN GANADOR'}! 🏆
          </h2>
          <p className="tarjeta__sub">
            {empate
              ? `${ganadores.length} equipos terminan igualados en la cima con ${maximo} puntos.`
              : `Con ${maximo} puntos al final de la partida.`}
          </p>

          <div className="ganadores">
            {ganadores.map(({ eq, pts }, i) => (
              <div
                key={eq.id}
                className="ganador"
                style={{
                  '--color-equipo': eq.color,
                  '--color-suave': eq.colorSuave,
                  '--retardo': `${180 + i * 140}ms`,
                }}
              >
                <span className="ganador__hebreo" dir="rtl" lang="he">{eq.hebreo}</span>
                <span className="ganador__latino">
                  <span className="ganador__translit">{eq.translit}</span>
                  <span className="ganador__es"> · Equipo {eq.id} · {eq.espanol}</span>
                </span>
                <span className="ganador__puntos">{pts}</span>
              </div>
            ))}
          </div>

          <div className="tabla-final">
            {clasificacion.map(({ eq, pts }, i) => (
              <div className="tabla-final__fila" key={eq.id}>
                <span className="tabla-final__pos">{i + 1}º</span>
                <span className="tabla-final__nombre">
                  <span className="tabla-final__heb" dir="rtl" lang="he">{eq.hebreo}</span>
                  <span>{eq.translit}</span>
                </span>
                <span className="tabla-final__pts">{pts} pts</span>
              </div>
            ))}
          </div>

          <div className="acciones">
            <button className="btn btn--oro" onClick={onNuevaPartida} autoFocus>
              Nueva partida
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
