import { useEffect, useRef } from 'react';

/**
 * Muestra la frase hebrea.
 *  · Se pinta en RTL y aislada del texto español que la rodea.
 *  · Los espacios y signos (־ ׃ …) están visibles desde el principio.
 *  · Cada letra descubierta aparece con su niqqud original intacto.
 *
 * Las animaciones de fallo se reinician forzando un reflujo en lugar de
 * remontar el componente: si se remontara, todas las letras ya descubiertas
 * repetirían su animación de aparición en cada error.
 */
export default function PanelPalabra({ palabras, usadas, revelarTodo, fallo, pista }) {
  const fraseRef = useRef(null);
  const destelloRef = useRef(null);
  const primerRender = useRef(true);

  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    for (const [el, clase] of [
      [fraseRef.current, 'sacude'],
      [destelloRef.current, 'destella'],
    ]) {
      if (!el) continue;
      el.classList.remove(clase);
      void el.offsetWidth; // reinicia la animación CSS
      el.classList.add(clase);
    }
  }, [fallo]);

  // Tamaño de letra según cuántas fichas hay que hacer caber.
  const total = palabras.reduce((n, p) => n + p.length, 0);
  const tam =
    total <= 5 ? 'clamp(48px, 7vw, 122px)'
    : total <= 8 ? 'clamp(44px, 6vw, 104px)'
    : total <= 14 ? 'clamp(36px, 4.8vw, 82px)'
    : total <= 24 ? 'clamp(29px, 3.8vw, 64px)'
    : total <= 34 ? 'clamp(25px, 3.1vw, 53px)'
    : 'clamp(22px, 2.7vw, 46px)';

  const numPalabras = palabras.length;
  const etiqueta =
    pista ?? (numPalabras === 1 ? 'Una palabra' : `Frase de ${numPalabras} palabras`);

  let orden = 0;

  return (
    <section className="panel palabra">
      <span className="palabra__destello" ref={destelloRef} aria-hidden="true" />

      <p className="palabra__pista">{etiqueta}</p>

      <div
        className="frase"
        ref={fraseRef}
        dir="rtl"
        lang="he"
        style={{ '--tam-letra': tam }}
      >
        {palabras.map((palabra, i) => (
          <span className="frase__palabra" key={i}>
            {palabra.map((ficha, j) => {
              if (ficha.tipo === 'signo') {
                return (
                  <span className="ficha ficha--signo" key={j}>
                    {ficha.texto}
                  </span>
                );
              }
              const visible = revelarTodo || usadas.has(ficha.clave);
              const retardo = visible ? `${(orden++ % 14) * 45}ms` : '0ms';
              return (
                <span
                  key={j}
                  className={'ficha ' + (visible ? 'ficha--visible' : 'ficha--oculta')}
                  style={{ '--retardo': retardo }}
                >
                  <span>{ficha.texto}</span>
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </section>
  );
}
