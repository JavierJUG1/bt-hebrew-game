/**
 * Equipos de la partida.
 * Los turnos rotan automáticamente en este orden a lo largo de las 11 rondas.
 * Puedes añadir o quitar equipos: la rotación se adapta sola.
 *
 * COLOR — Línea gráfica Beit Teshuvá
 * Los tres equipos usan los tres azules institucionales, diferenciados por
 * profundidad (oscuro → medio → claro), no por matiz. Como tres azules se
 * distinguen peor que tres colores distintos, el color NUNCA es el único
 * identificador: cada equipo lleva además su número y su nombre en hebreo.
 *
 * Cada equipo tiene dos colores por una razón de accesibilidad:
 *   · color       → decorativo (bordes, barra de turno, halo del turno activo).
 *   · colorTinta  → versión que garantiza 4.5:1 para texto y fichas con
 *                   número blanco. #0098e1 solo llega a 3.19:1 sobre blanco,
 *                   así que el equipo 3 escribe con #0272a8 (5.28:1).
 *   · tono        → tratamiento de la ficha numerada: relleno oscuro,
 *                   relleno medio o perfilado claro. Es una escalera de tres
 *                   pasos que se distingue incluso en escala de grises o en
 *                   un proyector desajustado, donde tres azules no bastarían.
 */
export const EQUIPOS = [
  {
    id: 1,
    hebreo: 'אֶחָד',
    translit: 'Ejad',
    espanol: 'Uno',
    color: '#003b57',      // azul profundo de marca
    colorTinta: '#003b57', // 11.91:1 sobre blanco
    colorSuave: '#e1eef7',
    tono: 'profundo',      // ficha rellena oscura
  },
  {
    id: 2,
    hebreo: 'שְׁנַיִם',
    translit: 'Shnáyim',
    espanol: 'Dos',
    color: '#1d71b8',      // azul marca
    colorTinta: '#175d99', // 6.86:1 sobre blanco
    colorSuave: '#e6f0fa',
    tono: 'medio',         // ficha rellena media
  },
  {
    id: 3,
    hebreo: 'שְׁלֹשָׁה',
    translit: 'Shloshá',
    espanol: 'Tres',
    color: '#0098e1',      // azul vivo de marca
    colorTinta: '#0272a8', // 5.28:1 sobre blanco
    colorSuave: '#e0f4ff',
    tono: 'claro',         // ficha perfilada clara
  },
];
