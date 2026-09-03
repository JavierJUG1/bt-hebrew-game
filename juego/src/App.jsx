import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CONFIG, SONIDO, erroresMaximos } from './data/config.js';
import { EQUIPOS } from './data/equipos.js';
import { RONDAS } from './data/rondas.js';

import { analizarFrase, contarAciertos, frasesCompleta } from './lib/hebreo.js';
import { armarPartida } from './lib/partida.js';
import { GestorDeSonido } from './lib/sonido.js';

import BarraSuperior from './components/BarraSuperior.jsx';
import PanelPalabra from './components/PanelPalabra.jsx';
import Teclado from './components/Teclado.jsx';
import Marcador from './components/Marcador.jsx';
import Burro from './components/Burro.jsx';
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
  /* Las rondas de ESTA partida: barajadas dentro de cada nivel. Se rearman
     en cada partida nueva, así que dos seguidas nunca traen el mismo orden. */
  const [rondas, setRondas] = useState(() => armarPartida(RONDAS, CONFIG));
  const [rondaIdx, setRondaIdx] = useState(0);
  const [puntajes, setPuntajes] = useState(() => EQUIPOS.map(() => 0));
  const [r, setR] = useState(rondaLimpia);
  const [partidaTerminada, setPartidaTerminada] = useState(false);
  const [equipoQueSube, setEquipoQueSube] = useState(null);
  const [confirmarReinicio, setConfirmarReinicio] = useState(false);
  const [capaVisible, setCapaVisible] = useState(false);
  const [sonidoActivo, setSonidoActivo] = useState(SONIDO.activo);
  const [sonidoBloqueado, setSonidoBloqueado] = useState(false);

  /* El gestor de sonido se crea una sola vez y vive toda la partida. */
  const sonido = useRef(null);
  if (sonido.current === null) sonido.current = new GestorDeSonido(SONIDO);

  /* La música intenta sonar sola al cargar. Casi siempre el navegador lo
     bloqueará —Chrome no permite autoplay en file:// ni con el audio
     silenciado— y entonces se cae al plan B: arranca con el primer clic o la
     primera tecla, y mientras tanto el botón de la barra avisa de que el
     sonido está esperando. El lanzador "Juego con sonido.bat" abre Chrome con
     el permiso concedido y ahí sí suena desde el primer instante. */
  useEffect(() => {
    let vivo = true;
    const arrancar = () => {
      sonido.current?.iniciar();
      setSonidoBloqueado(false);
    };

    sonido.current?.intentarAutomatico().then((sono) => {
      if (!vivo) return;
      if (sono) return;
      setSonidoBloqueado(true);
      window.addEventListener('pointerdown', arrancar, { once: true });
      window.addEventListener('keydown', arrancar, { once: true });
    });

    return () => {
      vivo = false;
      window.removeEventListener('pointerdown', arrancar);
      window.removeEventListener('keydown', arrancar);
    };
  }, []);

  /* Al desmontar (recarga, cierre) se sueltan los elementos de audio. */
  useEffect(() => () => sonido.current?.destruir(), []);

  const alternarSonido = useCallback(() => {
    const g = sonido.current;
    if (!g) return;
    const activo = g.alternar();
    // Si aún no había habido gesto, este clic ya lo es: arranca la música.
    if (activo) g.iniciar();
    setSonidoActivo(activo);
    setSonidoBloqueado(false);
  }, []);

  const ronda = rondas[rondaIdx];
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
    if (rondaIdx + 1 >= rondas.length) {
      setPartidaTerminada(true);
    } else {
      setRondaIdx((i) => i + 1);
      setR(rondaLimpia());
    }
  }, [rondaIdx, rondas.length]);

  const nuevaPartida = useCallback(() => {
    setRondas(armarPartida(RONDAS, CONFIG));
    setRondaIdx(0);
    setPuntajes(EQUIPOS.map(() => 0));
    setR(rondaLimpia());
    setPartidaTerminada(false);
    setEquipoQueSube(null);
    setConfirmarReinicio(false);
    // "VICTORIA" apaga la música: una partida nueva la vuelve a encender.
    sonido.current?.reiniciarMusica();
  }, []);

  /* Al ganar, la tarjeta sale al instante. Al perder se espera un momento:
     ese hueco es lo que deja ver al burro plantarse y a las moscas llegar.
     El retardo vive en CONFIG.msAntesDeLaTarjetaDeDerrota. */
  useEffect(() => {
    if (r.fase === 'jugando') {
      setCapaVisible(false);
      return;
    }
    if (r.fase === 'ganada' || CONFIG.msAntesDeLaTarjetaDeDerrota <= 0) {
      setCapaVisible(true);
      return;
    }
    const t = setTimeout(() => setCapaVisible(true), CONFIG.msAntesDeLaTarjetaDeDerrota);
    return () => clearTimeout(t);
  }, [r.fase]);

  /* Atajo de teclado para silenciar. Existe porque mientras hay una tarjeta
     abierta el botón de la barra queda tapado, y quien proyecta necesita poder
     callar el juego en cualquier momento sin buscar el ratón. */
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        alternarSonido();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [alternarSonido]);

  /* Los efectos suenan en el momento del hecho, no cuando sale la tarjeta:
     "PIERDE TODOS LOS INTENTOS" acompaña al burro plantándose y a las moscas,
     durante la espera previa a la tarjeta. */
  useEffect(() => {
    if (r.fase === 'ganada') sonido.current?.reproducirEfecto('palabraCompletada');
    if (r.fase === 'perdida') sonido.current?.reproducirEfecto('pierdeIntentos');
  }, [r.fase]);

  useEffect(() => {
    if (partidaTerminada) sonido.current?.reproducirEfecto('victoria');
  }, [partidaTerminada]);

  /* Enter / Espacio avanzan cuando la tarjeta ya está en pantalla. Antes no:
     saltarse la espera adelantaría la ronda sin haber visto la respuesta. */
  useEffect(() => {
    if (!capaVisible || partidaTerminada) return;
    const h = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        continuar();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [capaVisible, partidaTerminada, continuar]);

  const terminada = r.fase !== 'jugando';

  return (
    <div className="app">
      <BarraSuperior
        rondas={rondas}
        rondaIdx={rondaIdx}
        ronda={ronda}
        onReiniciar={() => setConfirmarReinicio(true)}
        sonidoActivo={sonidoActivo}
        sonidoBloqueado={sonidoBloqueado}
        onAlternarSonido={alternarSonido}
      />

      <div className="tablero">
        <div className="columna">
          <div
            className="turno panel"
            style={{
              '--color-equipo': equipo.color,
              '--color-tinta': equipo.colorTinta,
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
                    {i + 1}
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

      {terminada && capaVisible && !partidaTerminada && (
        <CapaResultado
          gano={r.fase === 'ganada'}
          ronda={ronda}
          equipo={equipo}
          puntosGanados={r.puntosGanados}
          ultima={rondaIdx + 1 >= rondas.length}
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
