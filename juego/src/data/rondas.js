/**
 * ─────────────────────────────────────────────────────────
 *  BANCO DE PALABRAS Y FRASES
 *  El texto hebreo se guarda en Unicode real, con niqqud y signos
 *  exactamente como deben mostrarse. La lógica del juego normaliza
 *  los niqqud por su cuenta: aquí NO hay que quitar nada.
 *
 *  Nueve entradas por nivel. Con tres equipos y nueve rondas por nivel,
 *  cada equipo juega exactamente tres veces en fácil, tres en intermedio
 *  y tres en avanzado.
 *
 *  Para añadir una entrada basta con agregar un objeto a la lista. `numero`
 *  es solo un identificador y debe ser único; NO marca la posición, porque
 *  el orden se baraja dentro de cada nivel en cada partida.
 *  `referencia` es opcional y solo se muestra al resolver la ronda.
 * ─────────────────────────────────────────────────────────
 */

export const RONDAS = [
  /* ── Nivel fácil · palabras sueltas ─────────────────────── */
  {
    numero: 1,
    nivel: "facil",
    hebreo: "שָׁלוֹם",
    translit: "Shalom",
    espanol: "Paz",
  },
  {
    numero: 2,
    nivel: "facil",
    hebreo: "לֵב",
    translit: "Lev",
    espanol: "Corazón",
  },
  {
    numero: 3,
    nivel: "facil",
    hebreo: "כֶּלֶב",
    translit: "Kélev",
    espanol: "Perro",
  },
  {
    numero: 4,
    nivel: "facil",
    hebreo: "סוּס",
    translit: "Sus",
    espanol: "Caballo",
  },
  {
    numero: 5,
    nivel: "facil",
    hebreo: "עֵינַיִם",
    translit: "Eináyim",
    espanol: "Ojos",
  },
  {
    numero: 6,
    nivel: "facil",
    hebreo: "אִמָּא",
    translit: "Ima",
    espanol: "Madre",
  },
  {
    numero: 7,
    nivel: "facil",
    hebreo: "תַּלְמִיד",
    translit: "Talmid",
    espanol: "Alumno",
  },
  {
    numero: 8,
    nivel: "facil",
    hebreo: "הָרִים",
    translit: "Harím",
    espanol: "Montañas",
  },
  {
    numero: 9,
    nivel: "facil",
    hebreo: "מִצְווֹת",
    translit: "Mitzvot",
    espanol: "Mandamientos",
  },

  /* ── Nivel intermedio · expresiones de dos palabras ─────── */
  {
    numero: 10,
    nivel: "intermedio",
    hebreo: "לֵב טָהוֹר",
    translit: "Lev tahor",
    espanol: "Corazón puro",
  },
  {
    numero: 11,
    nivel: "intermedio",
    hebreo: "שְׁמַע יִשְׂרָאֵל",
    translit: "Shemá Yisrael",
    espanol: "Oye, Israel",
  },
  {
    numero: 12,
    nivel: "intermedio",
    hebreo: "שָׁבוּעַ טוֹב",
    translit: "Shavúa tov",
    espanol: "Buena semana",
  },
  {
    numero: 13,
    nivel: "intermedio",
    hebreo: "עֹשֶׂה שָׁלוֹם",
    translit: "Osé shalom",
    espanol: "El que hace la paz",
  },
  {
    numero: 14,
    nivel: "intermedio",
    hebreo: "בָּרוּךְ הַשֵּׁם",
    translit: "Baruj HaShem",
    espanol: "Bendito sea el Nombre",
  },
  {
    numero: 15,
    nivel: "intermedio",
    hebreo: "רוּחַ הַקֹּדֶשׁ",
    translit: "Rúaj hakódesh",
    espanol: "Espíritu santo",
  },
  {
    numero: 16,
    nivel: "intermedio",
    hebreo: "יוֹם הַכִּפּוּרִים",
    translit: "Yom haKippurim",
    espanol: "Día de la expiación",
  },
  {
    numero: 17,
    nivel: "intermedio",
    hebreo: "יוֹם תְּרוּעָה",
    translit: "Yom teruá",
    espanol: "Día de las trompetas",
  },
  {
    numero: 18,
    nivel: "intermedio",
    hebreo: "עֹמֶר רֵאשִׁית",
    translit: "Ómer reshit",
    espanol: "Gavilla de primicias",
  },

  /* ── Nivel avanzado · versículos ────────────────────────── */
  {
    numero: 19,
    nivel: "avanzado",
    hebreo: "שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד",
    translit: "Shemá Yisrael, Adonai Eloheinu, Adonai ejad",
    espanol: "Oye Israel, el Señor nuestro Dios, el Señor uno es",
    referencia: "Deuteronomio 6:4",
  },
  {
    numero: 20,
    nivel: "avanzado",
    hebreo: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
    translit: "Bereshit bará Elohim et hashamáyim ve'et ha'áretz",
    espanol: "En el principio creó Dios los cielos y la tierra",
    referencia: "Génesis 1:1",
  },
  {
    numero: 21,
    nivel: "avanzado",
    hebreo: "יְהוָה רֹעִי לֹא אֶחְסָר",
    translit: "Adonai ro'í lo ejsar",
    espanol: "El Señor es mi pastor, nada me faltará",
    referencia: "Salmo 23:1",
  },
  {
    numero: 22,
    nivel: "avanzado",
    hebreo: "רוּחַ אֲדֹנָי יְהוִה עָלָי",
    translit: "Rúaj Adonai Elohim alái",
    espanol: "El Espíritu del Señor Dios está sobre mí",
    referencia: "Isaías 61:1",
  },
  {
    numero: 23,
    nivel: "avanzado",
    hebreo: "יֹשֵׁב בְּסֵתֶר עֶלְיוֹן",
    translit: "Yoshev beséter Elyón",
    espanol: "El que habita al abrigo del Altísimo",
    referencia: "Salmo 91:1",
  },
  {
    numero: 24,
    nivel: "avanzado",
    hebreo: "מַעֲנֶה־רַּךְ יָשִׁיב חֵמָה",
    translit: "Ma'ané-raj yashiv jemá",
    espanol: "La suave respuesta aparta el furor",
    referencia: "Proverbios 15:1",
  },
  {
    numero: 25,
    nivel: "avanzado",
    hebreo: "שֶׁמֶן שָׂשׂוֹן תַּחַת אֵבֶל",
    translit: "Shémen sasón tájat ével",
    espanol: "Aceite de alegría en vez de luto",
    referencia: "Isaías 61:3",
  },
  {
    numero: 26,
    nivel: "avanzado",
    hebreo: "יְבָרֶכְךָ יְהוָה וְיִשְׁמְרֶךָ",
    translit: "Yevarejejá Adonai veyishmeréja",
    espanol: "El Señor te bendiga y te guarde",
    referencia: "Números 6:24",
  },
  {
    numero: 27,
    nivel: "avanzado",
    hebreo: "אָגִילָה בֵּאלֹהֵי יִשְׁעִי",
    translit: "Aguíla b'Elohei yish'í",
    espanol: "Me regocijaré en el Dios de mi salvación",
    referencia: "Habacuc 3:18",
  },
];
