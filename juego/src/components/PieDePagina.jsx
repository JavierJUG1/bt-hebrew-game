import { ARBA_RUJOT } from '../data/imagenes.js';

/**
 * Crédito de autoría al pie del juego.
 *
 * Decisiones de diseño:
 *
 * · NO es una tarjeta blanca como el resto de bloques. Va directamente sobre
 *   el fondo, separado por un filete: así se lee como algo que está FUERA del
 *   juego, que es exactamente lo que es. Convertirlo en panel lo pondría al
 *   mismo nivel jerárquico que el marcador o el teclado, y competiría por una
 *   atención que no le corresponde.
 *
 * · La jerarquía dentro de la frase no es plana. "arba rujot" y "Beit Teshuvá"
 *   van en tinta plena; el conector, en tinta suave. Un crédito se lee de un
 *   vistazo buscando los dos nombres, no la preposición.
 *
 * · El isotipo va a la izquierda del texto y no se agranda: es una firma, no
 *   un logotipo de cabecera. Lleva `width`/`height` para que el navegador
 *   reserve su espacio y la línea no salte al cargar.
 *
 * · Sin enlaces. No hay URL que apuntar y un crédito que no lleva a ninguna
 *   parte pero parece pulsable es una promesa rota.
 */
export default function PieDePagina() {
  return (
    <footer className="pie">
      <img
        className="pie__marca"
        src={ARBA_RUJOT.src}
        width={ARBA_RUJOT.ancho}
        height={ARBA_RUJOT.alto}
        alt={ARBA_RUJOT.alt}
        decoding="async"
        loading="lazy"
      />
      <p className="pie__texto">
        <span className="pie__suave">Diseñado y desarrollado por </span>
        <span className="pie__nombre">arba rujot</span>
        <span className="pie__suave"> para </span>
        <span className="pie__nombre">Beit Teshuvá</span>
      </p>
    </footer>
  );
}
