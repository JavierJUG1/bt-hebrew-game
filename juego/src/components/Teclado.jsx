import { construirTeclado } from '../lib/hebreo.js';

/**
 * Teclado hebreo: 22 letras + las 5 formas finales.
 * Cada tecla usada queda deshabilitada y marcada como acierto o error.
 */
export default function Teclado({ usadas, aciertos, activo, unificarFinales, onLetra }) {
  const { base, finales } = construirTeclado(unificarFinales);

  const pintar = (t, esFinal) => {
    const usada = usadas.has(t.clave);
    const acerto = aciertos.has(t.clave);
    const clases = [
      'tecla',
      esFinal ? 'tecla--finales' : '',
      usada ? (acerto ? 'tecla--acierto' : 'tecla--error') : '',
    ].filter(Boolean).join(' ');

    return (
      <button
        key={t.simbolo}
        className={clases}
        disabled={usada || !activo}
        onClick={() => onLetra(t.clave)}
        lang="he"
        aria-label={`${t.nombre}${usada ? (acerto ? ' — acertada' : ' — fallada') : ''}`}
      >
        {t.simbolo}
      </button>
    );
  };

  return (
    <section className="panel teclado" aria-label="Teclado hebreo">
      <div className="teclado__titulo">
        <span>Teclado hebreo</span>
        <span>{usadas.size} de {base.length + finales.length} usadas</span>
      </div>

      <div className="teclado__grupo" dir="rtl">
        {base.map((t) => pintar(t, false))}
      </div>

      <div className="teclado__grupo teclado__grupo--finales" dir="rtl">
        {finales.map((t) => pintar(t, true))}
      </div>
    </section>
  );
}
