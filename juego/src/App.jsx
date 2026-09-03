import { useCallback, useEffect, useMemo, useState } from 'react';

import { CONFIG, erroresMaximos } from './data/config.js';
import { EQUIPOS } from './data/equipos.js';
import { RONDAS } from './data/rondas.js';

import { analizarFrase, contarAciertos, frasesCompleta } from './lib/hebreo.js';

import BarraSuperior from './components/BarraSuperior.jsx';
import PanelPalabra from './components/PanelPalabra.jsx';
import Teclado from './components/Teclado.jsx';
import Marcador from './components/Marcador.jsx';
import Burro, { SiluetaBurro } from './components/Burro.jsx';
import CapaResultado from './components/CapaResultado.jsx';
import PantallaFinal from './components/PantallaFinal.jsx';

const estadoInicialRonda = {
  usadas: new Set(),
  aciertos: new Set(),
  errores: 0,
  fase: 'jugando', // 'jugando' | 'ganada' | 'perdida'
  fallo: 0,
  puntosGanados: 0,
};

const rondaLimpia = () => ({
  ...estadoInicialRonda,
  usadas: new Set(),
  aciertos: new Set(),
});

export default function App() {
  const [rondaIdx, setRondaIdx] = useState(0);
  const [puntajes, setPuntajes] = useState(() => EQUIPOS.map(() => 0));
  const [r, setR] = useState(rondaLimpia);
  const [partidaTerminada, setPartidaTerminada] = useState(false);
  const [equipoQueSube, setEquipoQueSube] = useState(null);
  const [confirmarReinicio, setConfirmarReinicio] = useState(false);

  const ronda = RONDAS[rondaIdx];
  const maximo = erroresMaximos(ronda);
  const turnoIdx = rondaIdx % EQUIPOS.length;
  const equipo = EQUIPOS[turnoIdx];

  const palabras = useMemo(
    () => analizarFrase(ronda.hebreo, CONFIG.unificarFormasFinales),
    [ronda.hebreo]
  );

  /** Pulsar una letra del teclado. */
  const jugarLetra = useCallback(
    (clave) => {
      if (r.fase !== 'jugando' || r.usadas.has(clave)) return;

      const n = contarAciertos(palabras, clave);
      const usadas = new Set(r.usadas).add(clave);

      if (n > 0) {
        const aciertos = new Set(r.aciertos).add(clave);
        if (frasesCompleta(palabras, usadas)) {
          const restantes = maximo - r.errores;
          const puntos = CONFIG.puntosPorRonda + restantes * CONFIG.bonusPorErrorNoUsado;
          setPuntajes((p) => p.map((v, i) => (i === turnoIdx ? v + puntos : v)));
          setEquipoQueSube(turnoIdx);
          setR({ ...r, usadas, aciertos, fase: 'ganada', puntosGanados: puntos });
        } else {
          setR({ ...r, usadas, aciertos });
        }
      } else {
        const errores = r.errores + 1;
        setR({
          ...r,
          usadas,
          errores,
          fallo: r.fallo + 1,
          fase: errores >= maximo ? 'perdida' : 'jugando',
        });
      }
    },
    [r, palabras, maximo, turnoIdx]
  );

  /** Pasar a la siguiente ronda (o a la pantalla final). */
  const continuar = useCallback(() => {
    setEquipoQueSube(null);
    if (rondaIdx + 1 >= RONDAS.length) {
      setPartidaTerminada(true);
    } else {
      setRondaIdx((i) => i + 1);
      setR(rondaLimpia());
    }
  }, [rondaIdx]);

  const nuevaPartida = useCallback(() => {
    setRondaIdx(0);
    setPuntajes(EQUIPOS.map(() => 0));
    setR(rondaLimpia());
    setPartidaTerminada(false);
    setEquipoQueSube(null);
    setConfirmarReinicio(false);
  }, []);

  /* Enter / Espacio avanzan cuando la ronda ha terminado. */
  useEffect(() => {
    if (r.fase === 'jugando' || partidaTerminada) return;
    const h = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        continuar();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [r.fase, partidaTerminada, continuar]);

  const terminada = r.fase !== 'jugando';

  return (
    <div className="app">
      <BarraSuperior
        rondas={RONDAS}
        rondaIdx={rondaIdx}
        ronda={ronda}
        onReiniciar={() => setConfirmarReinicio(true)}
      />

      <div className="tablero">
        <div className="columna">
          <div
            className="turno panel"
            style={{
              '--color-equipo': equipo.color,
              background: equipo.colorSuave,
              borderColor: equipo.color,
            }}
            key={turnoIdx + '-' + rondaIdx}
            aria-live="polite"
          >
            <span className="turno__etiqueta">Turno del equipo</span>
            <span className="turno__nombres">
              <span className="turno__hebreo" dir="rtl" lang="he">{equipo.hebreo}</span>
              <span className="turno__latino">
                <span className="turno__translit">{equipo.translit}</span>
                <span className="turno__es">Equipo {equipo.id} · {equipo.espanol}</span>
              </span>
            </span>
          </div>

          <PanelPalabra
            palabras={palabras}
            usadas={r.usadas}
            revelarTodo={terminada}
            fallo={r.fallo}
          />

          <Teclado
            usadas={r.usadas}
            aciertos={r.aciertos}
            activo={!terminada}
            unificarFinales={CONFIG.unificarFormasFinales}
            onLetra={jugarLetra}
          />
        </div>

        <div className="columna columna--lateral">
          <section className="panel burro-panel" aria-label="Progreso del burro">
            <Burro errores={r.errores} maximo={maximo} derrota={r.fase === 'perdida'} />
            <div className="intentos">
              <span className="intentos__etiqueta">Intentos</span>
              <div
                className="intentos__marcas"
                aria-label={`${r.errores} de ${maximo} intentos usados`}
              >
                {Array.from({ length: maximo }, (_, i) => (
                  <span key={i} className="intentos__marca" data-usado={i < r.errores ? 'si' : 'no'}>
                    <SiluetaBurro variante={i % 3} />
                  </span>
                ))}
              </div>
            </div>
          </section>

          <Marcador
            equipos={EQUIPOS}
            puntajes={puntajes}
            turnoIdx={turnoIdx}
            equipoQueSube={equipoQueSube}
          />
        </div>
      </div>

      {terminada && !partidaTerminada && (
        <CapaResultado
          gano={r.fase === 'ganada'}
          ronda={ronda}
          equipo={equipo}
          puntosGanados={r.puntosGanados}
          ultima={rondaIdx + 1 >= RONDAS.length}
          onContinuar={continuar}
        />
      )}

      {partidaTerminada && (
        <PantallaFinal equipos={EQUIPOS} puntajes={puntajes} onNuevaPartida={nuevaPartida} />
      )}

      {confirmarReinicio && (
        <div className="capa" role="dialog" aria-modal="true">
          <div className="tarjeta" style={{ maxWidth: 560 }}>
            <h2 className="tarjeta__grito" style={{ fontSize: 'clamp(22px,2.6vw,34px)' }}>
              ¿Reiniciar la partida?
            </h2>
            <p className="tarjeta__sub">
              Se volverá a la ronda 1 y todas las puntuaciones quedarán en cero.
            </p>
            <div className="acciones">
              <button className="btn btn--fantasma" onClick={() => setConfirmarReinicio(false)}>
                Seguir jugando
              </button>
              <button className="btn" onClick={nuevaPartida} autoFocus>
                Sí, reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
