/**
 * Interruptor de sonido de la barra superior.
 *
 * Es imprescindible, no un adorno: quien proyecta necesita poder callar el
 * juego en un segundo si entra alguien, si hay que explicar algo o si la
 * música molesta ese día. El estado se anuncia con `aria-pressed` y el icono
 * cambia de forma —no solo de color—, para que se lea de un vistazo desde
 * el fondo del salón.
 *
 * Tiene un tercer estado, `bloqueado`: el navegador no dejó arrancar la
 * música sola y hace falta un gesto. Entonces el botón late y pide el clic
 * en vez de quedarse callado, para que nadie piense que el juego está roto.
 */
export default function BotonSonido({ activo, bloqueado, onAlternar }) {
  const etiqueta = bloqueado
    ? 'Activar el sonido: el navegador pide un clic para empezar'
    : activo
      ? 'Silenciar el juego'
      : 'Activar el sonido';

  return (
    <button
      className={'btn-sonido' + (bloqueado ? ' btn-sonido--espera' : '')}
      onClick={onAlternar}
      aria-pressed={activo}
      title={etiqueta}
      aria-label={etiqueta}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
        {activo ? (
          <>
            <path d="M15.8 9.4a3.6 3.6 0 0 1 0 5.2" />
            <path d="M18.4 6.8a7.3 7.3 0 0 1 0 10.4" />
          </>
        ) : (
          <>
            <path d="M16.2 9.8l4.6 4.4" />
            <path d="M20.8 9.8l-4.6 4.4" />
          </>
        )}
      </svg>
      <span className="btn-sonido__texto">
        {bloqueado ? 'Toca para el sonido' : activo ? 'Sonido' : 'Silencio'}
      </span>
    </button>
  );
}
