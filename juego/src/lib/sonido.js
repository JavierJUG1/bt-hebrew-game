/**
 * ─────────────────────────────────────────────────────────
 *  GESTOR DE SONIDO
 *
 *  Una sola instancia para toda la partida. Se encarga de:
 *   · la música de fondo, en orden aleatorio y en bucle infinito;
 *   · los tres efectos de la partida;
 *   · qué le pasa a la música mientras suena un efecto.
 *
 *  Dos cosas que conviene saber antes de tocar esto:
 *
 *  1. Los navegadores NO dejan sonar audio hasta que la persona interactúa
 *     con la página. No es un fallo que se pueda esquivar: es política de
 *     autoplay. Por eso `iniciar()` se llama desde el primer clic o tecla,
 *     y hasta entonces el juego está en silencio aunque el sonido esté
 *     activado. `play()` devuelve una promesa que puede rechazarse; se
 *     ignora en silencio en vez de romper la partida.
 *
 *  2. Se crea un elemento <audio> por pista, no uno compartido. Con el audio
 *     incrustado en el HTML, cambiar el `src` obligaría al navegador a releer
 *     un data URI de varios megas y se oiría el salto entre canciones.
 * ─────────────────────────────────────────────────────────
 */

import { MUSICA, EFECTOS } from '../data/audio.js';

/** Baraja una copia del array (Fisher-Yates). */
function barajar(lista) {
  const l = [...lista];
  for (let i = l.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [l[i], l[j]] = [l[j], l[i]];
  }
  return l;
}

export class GestorDeSonido {
  constructor(config) {
    this.cfg = config;
    this.activo = config.activo !== false;
    this.iniciado = false;
    this.pistaActual = null;
    this.ultimaPista = null;   // sobrevive a reiniciarMusica(), para no repetir
    this.efectoEnCurso = null;
    this.restaurar = null;
    this.desvanecer = null;

    /* Los elementos se cuelgan de un contenedor oculto en vez de quedarse
       sueltos en memoria: así se pueden inspeccionar desde las herramientas
       del navegador, y algunos navegadores móviles son más fiables con
       elementos de audio que están en el documento. */
    this.contenedor = document.createElement('div');
    this.contenedor.hidden = true;
    this.contenedor.dataset.sonidoDelJuego = '';
    document.body.appendChild(this.contenedor);

    const crear = (src, clave, volumen) => {
      const a = document.createElement('audio');
      a.src = src;
      a.preload = 'auto';
      a.volume = volumen;
      a.dataset.sonido = clave;
      this.contenedor.appendChild(a);
      return a;
    };

    this.musica = MUSICA.map((m) => {
      const a = crear(m.src, m.id, this.cfg.volumenMusica);
      a.addEventListener('ended', () => this.siguientePista());
      return a;
    });

    this.efectos = Object.fromEntries(
      Object.entries(EFECTOS).map(([clave, e]) => [
        clave,
        crear(e.src, clave, this.cfg.volumenEfectos),
      ])
    );

    this.cola = [];
  }

  /* ── Música ─────────────────────────────────────────── */

  /** Siguiente índice de la cola barajada; al agotarla vuelve a barajar. */
  siguienteIndice() {
    if (this.cola.length === 0) {
      const nueva = barajar(this.musica.map((_, i) => i));
      // Evita que la misma canción suene dos veces seguidas al rebarajar,
      // incluso cruzando el corte de una partida nueva.
      if (nueva.length > 1 && nueva[0] === this.ultimaPista) {
        [nueva[0], nueva[1]] = [nueva[1], nueva[0]];
      }
      this.cola = nueva;
    }
    return this.cola.shift();
  }

  siguientePista() {
    if (!this.activo || !this.iniciado) return;
    this.pistaActual = this.siguienteIndice();
    this.ultimaPista = this.pistaActual;
    const a = this.musica[this.pistaActual];
    a.currentTime = 0;
    a.volume = this.cfg.volumenMusica;
    a.play().catch(() => {});
  }

  /** Arranca la música. Debe llamarse desde un gesto del usuario. */
  iniciar() {
    if (this.iniciado || !this.activo) return;
    this.iniciado = true;
    this.siguientePista();
  }

  /**
   * Intenta arrancar la música nada más cargar, sin esperar a que nadie toque
   * la página. Es lo que se quiere: que el juego suene solo al abrirlo.
   *
   * Casi siempre el navegador lo rechazará —Chrome bloquea el autoplay en
   * `file://` incluso con el audio silenciado— y ahí no hay nada que hacer
   * desde el código. Pero funciona cuando el juego se abre con el lanzador
   * `Juego con sonido.bat`, en modo quiosco, o servido desde un sitio donde
   * el navegador ya confía en el usuario. Intentarlo no cuesta nada y en esos
   * casos ahorra el clic.
   *
   * Devuelve true si sonó, false si el navegador lo bloqueó.
   */
  async intentarAutomatico() {
    if (this.iniciado || !this.activo) return this.iniciado;

    const idx = this.siguienteIndice();
    const a = this.musica[idx];
    a.currentTime = 0;
    a.volume = this.cfg.volumenMusica;
    try {
      await a.play();
      this.iniciado = true;
      this.pistaActual = idx;
      this.ultimaPista = idx;
      return true;
    } catch {
      // La canción vuelve al principio de la cola: el barajado no se pierde.
      this.cola.unshift(idx);
      return false;
    }
  }

  /** Elemento de la pista que está sonando (o null). */
  get pista() {
    return this.pistaActual === null ? null : this.musica[this.pistaActual];
  }

  /* ── Efectos ────────────────────────────────────────── */

  /**
   * Dispara un efecto y aplica a la música lo que diga la configuración:
   *   'pausar'  → se detiene y vuelve cuando el efecto acaba
   *   'atenuar' → baja de volumen y se recupera al acabar
   *   'detener' → se apaga y no vuelve (fin de partida)
   *   'nada'    → sigue igual
   */
  reproducirEfecto(clave) {
    const efecto = this.efectos[clave];
    if (!efecto || !this.activo) return;

    // Un solo canal de efectos: si había uno sonando, se corta y se
    // cancela su restauración pendiente para que no pisen a la música.
    this.cortarEfecto();

    const modo = this.cfg.efectoSobreMusica[clave] ?? 'nada';
    const pista = this.pista;

    if (pista && this.iniciado) {
      if (modo === 'pausar') {
        pista.pause();
        this.restaurar = () => pista.play().catch(() => {});
      } else if (modo === 'atenuar') {
        this.fundir(pista, this.cfg.volumenMusicaAtenuada);
        this.restaurar = () => this.fundir(pista, this.cfg.volumenMusica);
      } else if (modo === 'detener') {
        this.fundir(pista, 0, () => pista.pause());
        this.restaurar = null;
      }
    }

    efecto.currentTime = 0;
    efecto.volume = this.cfg.volumenEfectos;
    this.efectoEnCurso = efecto;

    const alTerminar = () => {
      efecto.removeEventListener('ended', alTerminar);
      efecto.removeEventListener('error', alTerminar);
      if (this.efectoEnCurso !== efecto) return;
      this.efectoEnCurso = null;
      const r = this.restaurar;
      this.restaurar = null;
      if (r && this.activo) r();
    };
    efecto.addEventListener('ended', alTerminar);
    efecto.addEventListener('error', alTerminar);

    efecto.play().catch(alTerminar);
  }

  cortarEfecto() {
    if (!this.efectoEnCurso) return;
    this.efectoEnCurso.pause();
    this.efectoEnCurso.currentTime = 0;
    this.efectoEnCurso = null;
    this.restaurar = null;
  }

  /* ── Volumen y encendido ────────────────────────────── */

  /** Cambio de volumen suave: un salto seco se oye como un corte. */
  fundir(audio, destino, alAcabar) {
    clearInterval(this.desvanecer);
    const paso = (destino - audio.volume) / 12;
    this.desvanecer = setInterval(() => {
      const v = audio.volume + paso;
      const fin = paso === 0 || (paso > 0 ? v >= destino : v <= destino);
      audio.volume = Math.min(1, Math.max(0, fin ? destino : v));
      if (fin) {
        clearInterval(this.desvanecer);
        alAcabar?.();
      }
    }, 25);
  }

  /** Enciende o apaga todo el sonido. Devuelve el estado resultante. */
  alternar() {
    this.activo = !this.activo;
    if (!this.activo) {
      clearInterval(this.desvanecer);
      this.cortarEfecto();
      this.musica.forEach((a) => a.pause());
    } else if (this.iniciado) {
      const pista = this.pista;
      if (pista) {
        pista.volume = this.cfg.volumenMusica;
        pista.play().catch(() => {});
      } else {
        this.siguientePista();
      }
    }
    return this.activo;
  }

  /** Vuelve al principio: se usa al empezar una partida nueva. */
  reiniciarMusica() {
    this.cortarEfecto();
    this.musica.forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
    this.cola = [];
    this.pistaActual = null;
    if (this.activo && this.iniciado) this.siguientePista();
  }

  destruir() {
    clearInterval(this.desvanecer);
    this.cortarEfecto();
    this.musica.forEach((a) => a.pause());
    this.contenedor?.remove();
  }
}
