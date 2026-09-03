import Confeti from './Confeti.jsx';

/** Pantalla breve entre rondas: celebración o ronda perdida. */
export default function CapaResultado({ gano, ronda, equipo, puntosGanados, ultima, onContinuar }) {
  return (
    <>
      {gano && <Confeti piezas={70} />}
      <div className="capa" role="dialog" aria-modal="true" aria-live="assertive">
        <div className="tarjeta">
          <h2 className={'tarjeta__grito ' + (gano ? 'tarjeta__grito--bien' : 'tarjeta__grito--mal')}>
            {gano ? '¡EXCELENTE! 🎉' : 'El burro se quedó plantado'}
          </h2>

          <p className="tarjeta__sub">
            {gano ? (
              <>
                <span lang="he" dir="rtl" style={{ fontWeight: 800 }}>{equipo.hebreo}</span>
                {' '}({equipo.translit}) suma {puntosGanados} puntos
              </>
            ) : (
              'Se agotaron los intentos. Nadie suma en esta ronda: el turno pasa al siguiente equipo.'
            )}
          </p>

          <div className="respuesta">
            <div className="respuesta__hebreo" dir="rtl" lang="he">{ronda.hebreo}</div>
            <div className="respuesta__translit">{ronda.translit}</div>
            <div className="respuesta__es">{ronda.espanol}</div>
            {ronda.referencia && <div className="respuesta__ref">{ronda.referencia}</div>}
          </div>

          <div className="acciones">
            <button className={'btn' + (gano ? ' btn--oro' : '')} onClick={onContinuar} autoFocus>
              {ultima ? 'Ver resultados finales' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
