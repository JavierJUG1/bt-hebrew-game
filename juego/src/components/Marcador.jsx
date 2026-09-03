export default function Marcador({ equipos, puntajes, turnoIdx, equipoQueSube }) {
  return (
    <section className="panel marcador" aria-label="Puntuaciones">
      <h2 className="marcador__titulo">Puntuaciones</h2>
      <div className="marcador__lista">
        {equipos.map((eq, i) => (
          <div
            key={eq.id}
            className={'equipo' + (equipoQueSube === i ? ' sube' : '')}
            data-turno={turnoIdx === i ? 'si' : 'no'}
            style={{
              '--color-equipo': eq.color,
              '--color-tinta': eq.colorTinta,
              '--color-suave': eq.colorSuave,
            }}
          >
            <span className="equipo__ficha" data-tono={eq.tono}>{eq.id}</span>
            <span className="equipo__nombres">
              <span className="equipo__hebreo" dir="rtl" lang="he">{eq.hebreo}</span>
              <span className="equipo__latino">{eq.translit} · {eq.espanol}</span>
            </span>
            <span className="equipo__puntos">
              {puntajes[i]}<small>pts</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
