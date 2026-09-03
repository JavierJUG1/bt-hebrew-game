/**
 * ─────────────────────────────────────────────────────────
 *  CONTENIDO DE LAS RONDAS
 *  El texto hebreo se guarda en Unicode real, con niqqud y signos
 *  exactamente como deben mostrarse. La lógica del juego normaliza
 *  los niqqud por su cuenta: aquí NO hay que quitar nada.
 *
 *  Para añadir una ronda basta con agregar un objeto a la lista.
 *  Los turnos y el número de ronda se recalculan solos.
 *  `referencia` es opcional y solo se muestra al resolver la ronda.
 * ─────────────────────────────────────────────────────────
 */

export const RONDAS = [
  {
    numero: 1,
    nivel: "facil",
    hebreo: "שָׁבוּעַ",
    translit: "Shavúa",
    espanol: "Semana",
  },
  {
    numero: 2,
    nivel: "facil",
    hebreo: "לִישׁוֹן",
    translit: "Lishón",
    espanol: "Dormir",
  },
  {
    numero: 3,
    nivel: "facil",
    hebreo: "בָּשָׂר",
    translit: "Basár",
    espanol: "Carne",
  },
  {
    numero: 4,
    nivel: "facil",
    hebreo: "לֶחֶם",
    translit: "Léjem",
    espanol: "Pan",
  },
  {
    numero: 5,
    nivel: "intermedio",
    hebreo: "כֹּהֵן גָּדוֹל",
    translit: "Kohén Gadol",
    espanol: "Sumo sacerdote",
  },
  {
    numero: 6,
    nivel: "intermedio",
    hebreo: "נְפִלִים",
    translit: "Nefilim",
    espanol: "Gigantes",
  },
  {
    numero: 7,
    nivel: "intermedio",
    hebreo: "בּוֹקֶר טוֹב",
    translit: "Bóker Tov",
    espanol: "Buenos días",
  },
  {
    numero: 8,
    nivel: "intermedio",
    hebreo: "הַר צִיּוֹן",
    translit: "Har Tziyón",
    espanol: "Monte de Tzión",
  },
  {
    numero: 9,
    nivel: "avanzado",
    hebreo: "אוֹרִי וְיִשְׁעִי מִמִּי אִירָא יְהוָה מָעוֹז־חַיַּי מִמִּי אֶפְחָד",
    translit: "Orí ve-yish'í mimí irá, Adonai maóz jayái mimí efjad",
    espanol: "Mi luz y mi salvación, ¿de quién temeré? Adonai es la fortaleza de mi vida, ¿de quién me atemorizaré?",
    referencia: "Salmo 27:1",
  },
  {
    numero: 10,
    nivel: "avanzado",
    hebreo: "טוֹב־יְהוָה לַכֹּל וְרַחֲמָיו עַל־כׇּל־מַעֲשָׂיו",
    translit: "Tov Adonai la-kol, ve-rajamav al kol maasav",
    espanol: "Bueno es Adonai para con todos, y su misericordia sobre todas sus obras",
    referencia: "Salmo 145:9",
  },
  {
    numero: 11,
    nivel: "avanzado",
    hebreo: "אֵל מֶלֶךְ נֶאֱמָן",
    translit: "El Mélej Neemán",
    espanol: "Dios, el Rey fiel",
    referencia: "Del Shemá — “Dios, Rey fiel”",
  },
];
