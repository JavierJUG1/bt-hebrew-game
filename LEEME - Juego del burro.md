# Adivina la palabra · עברית

Juego educativo por equipos para aprender vocabulario hebreo. El burro es la
mascota y el marcador visual del progreso: **no hay horca, ni daño, ni nadie en
peligro**. Cada intento fallido va armando la escena de un burro terco que se
amarra a su estaca y acaba plantado en el suelo sin querer moverse, con las
moscas rondándolo.

La interfaz sigue la **línea gráfica de la Congregación Beit Teshuvá**
(ver *Sistema de color* más abajo).

---

## Para jugar ahora mismo

Hay dos formas de abrirlo, y **la diferencia es solo el sonido**:

| Archivo | Qué pasa |
|---|---|
| **`Juego con sonido.bat`** | La música suena desde el primer instante, sin tocar nada. **Es el recomendado para proyectar.** |
| `Juego - Adivina la palabra (hebreo).html` | Igual de completo, pero la música espera al primer clic. |

El juego es un archivo único y autocontenido: **la música y los efectos van
dentro**. No necesita instalar nada, ni servidor, ni carpetas al lado. Funciona
en cualquier navegador moderno y está pensado primero para **pantalla grande o
proyector**, adaptándose a tablet y móvil.

> **Pesa unos 12 MB** porque lleva los seis audios incrustados a calidad
> original. Abre en poco más de un segundo desde el disco, pero es demasiado
> grande para enviarlo por correo: compártelo por Drive, OneDrive o WhatsApp
> como documento.

> Con internet, el juego carga las tipografías Noto Serif Hebrew y Outfit.
> Sin internet funciona igual, usando las fuentes hebreas del sistema
> (David, Times New Roman, Arial Hebrew). El niqqud se ve bien en ambos casos,
> pero se ve mejor con internet. El audio no necesita internet.

---

## Cómo se juega

1. Las 11 rondas rotan solas entre los tres equipos: 1 → 2 → 3 → 1 → …
   **El orden de las palabras se baraja en cada partida**, pero la dificultad
   se mantiene: primero las cuatro fáciles, luego las cuatro intermedias,
   luego las tres avanzadas.
2. El equipo en turno elige letras del teclado hebreo.
3. Una letra correcta se revela en **todas** sus apariciones, con su niqqud.
4. Una letra incorrecta gasta un intento y avanza un paso la escena del burro.
   Los intentos están numerados: los gastados se marcan en rojo, así que de un
   vistazo se sabe cuántos van y cuántos quedan.
5. Al resolver: celebración y se muestra Hebreo → Transliteración → Español.
6. Al agotar los intentos: el burro se queda plantado y **le salen las moscas**
   —una por cada intento agotado—, y **un segundo después** aparece la tarjeta
   con la respuesta. El turno pasa al siguiente equipo.
7. Tras la ronda 11 aparece la pantalla final con la copa. Los empates muestran
   a todos los equipos ganadores.

`Enter` o `Espacio` avanzan en las pantallas entre rondas.
`M` silencia o reactiva el sonido en cualquier momento.

---

## Qué se puede editar sin tocar la lógica

Todo lo configurable está en `juego/src/data/`:

| Archivo | Qué contiene |
|---|---|
| `config.js` | Puntos por ronda, intentos máximos por nivel, formas finales, bonus, y el bloque `SONIDO` |
| `audio.js`  | Qué MP3 usa cada pista y cada efecto |
| `equipos.js` | Nombres en hebreo, transliteración, español y los colores de cada equipo |
| `rondas.js`  | El banco de palabras: nivel, texto hebreo, transliteración, español, referencia |

### Cuatro decisiones que conviene conocer

**1. El orden se baraja dentro de cada nivel, nunca entre niveles.**
`rondasPorNivel: { facil: 4, intermedio: 4, avanzado: 3 }`. Cada partida
reordena las palabras al azar, pero siempre empieza fácil y termina difícil.
Barajar las once de corrido rompería la curva de aprendizaje y podría abrir la
partida con un versículo de Salmos. El barajado se rehace al pulsar "Nueva
partida" y al reiniciar, así que dos partidas seguidas nunca son iguales.

**2. Los intentos máximos cambian por nivel: 6 / 5 / 4.**
No es un capricho. En una frase larga aparecen casi todas las letras del
alfabeto, así que casi cualquier tecla acierta y el nivel "avanzado" resultaría
*más fácil* que una palabra de tres letras. Bajar el margen es lo que conserva
la dificultad. Si prefieres 6 intentos planos, pon los tres valores en 6 dentro
de `erroresMaximosPorNivel`. Hay además un `bonusPorErrorNoUsado` (por defecto 0)
si algún día quieres premiar la precisión en vez de solo terminar.

**3. Las formas finales están unificadas.**
Con `unificarFormasFinales: true`, pulsar כ revela también ך. Pedagógicamente es
lo correcto con niños: son la misma letra. Las cinco formas finales siguen
teniendo su propia tecla. Ponlo en `false` si quieres que sean letras
independientes.

**4. La tarjeta de derrota espera 1,2 segundos.**
`msAntesDeLaTarjetaDeDerrota: 1200`. Sin esa pausa, la tarjeta sale al instante
y tapa justo lo que acaba de pasar: el burro plantándose y las moscas llegando.
La animación existiría pero nadie la vería. Súbelo si quieres más pausa
dramática, bájalo si en el aula se hace lento, o ponlo en `0` para volver al
comportamiento anterior. Al **ganar** la ronda no hay espera: la celebración
sale al instante.

### Añadir palabras al banco

Agrega un objeto a la lista de `rondas.js`. La rotación de turnos y la barra de
progreso se recalculan solas:

```js
{
  numero: 12,                   // solo un identificador; debe ser único
  nivel: 'intermedio',          // 'facil' | 'intermedio' | 'avanzado'
  hebreo: 'שָׁלוֹם',              // Unicode real, con niqqud, tal cual debe verse
  translit: 'Shalom',
  espanol: 'Paz',
  referencia: '',               // opcional; solo se muestra al resolver
}
```

Escribe el hebreo exactamente como quieres que se vea. **No hay que quitar los
niqqud**: el juego los conserva al mostrar y los ignora al comparar.

`numero` ya no marca la posición en la partida —el orden se baraja— pero tiene
que seguir siendo distinto en cada entrada.

**Añadir palabras no alarga la partida.** El juego siempre juega 4 + 4 + 3, así
que si pones ocho palabras fáciles, cada partida escoge cuatro al azar de esas
ocho. Esa es la forma de que el juego no se agote: **acumula todas las palabras
que quieras y cada sesión será distinta**. Si prefieres que se jueguen todas las
de un nivel, pon `null` en ese nivel dentro de `rondasPorNivel`.

Si en un nivel hay menos palabras de las pedidas, se juegan las que haya sin
que el juego falle.

---

## Sonido

Los seis MP3 viven en `Assets/audios/`, que es su único sitio: no se copian
dentro de `juego/`. El alias `@audios` de `vite.config.js` apunta ahí, y al
compilar Vite los incrusta en el HTML.

| Archivo | Cuándo suena |
|---|---|
| `MUSICA FONDO 1/2/3.mp3` | De fondo, en orden aleatorio y en bucle infinito |
| `PALABRA COMPLETADA.mp3` | Al resolver la palabra o la frase |
| `PIERDE TODOS LOS INTENTOS.mp3` | Al agotar los intentos |
| `VICTORIA.mp3` | Al terminar la ronda 11 |

**Para cambiar una pista**, reemplaza el MP3 en `Assets/audios/` conservando el
nombre y vuelve a compilar. No hay que tocar código.

### Cómo se comporta

- La música **no es aleatoria pura**: se baraja el orden de las tres, se tocan
  las tres, y al rebarajar se evita que la misma suene dos veces seguidas —
  incluso cruzando el corte de una partida nueva. La aleatoriedad pura repite
  canciones y suena a fallo.
- Cada efecto le hace algo distinto a la música, configurable en
  `CONFIG.SONIDO.efectoSobreMusica`:
  - **Palabra completada** → `atenuar`: la música baja a un 8 % y vuelve sola.
  - **Pierde los intentos** → `pausar`: la música se detiene del todo y vuelve
    cuando el efecto termina.
  - **Victoria** → `detener`: la música se apaga y no vuelve. Reaparece al
    pulsar "Nueva partida".
  Los cambios de volumen son graduales: un salto seco se oye como un corte.
- Los efectos suenan **en el momento del hecho, no cuando sale la tarjeta**. El
  de derrota acompaña al burro plantándose y a las moscas llegando.
- Hay **un solo canal de efectos**: si se dispara uno mientras suena otro, el
  primero se corta limpio y se cancela su restauración pendiente. Sin esto, al
  ganar la última ronda "Palabra completada" y "Victoria" se pisarían.

### Volúmenes

En `CONFIG.SONIDO`. La música está en `0.3` y los efectos en `0.9` a propósito:
la música es fondo y tiene que dejar oír a los niños leyendo hebreo en voz
alta; los efectos son el premio y deben destacar. `0.3` suena alto en un
portátil y correcto en un salón con parlante.

### El botón de sonido

Está en la barra superior y **no es un adorno**: quien proyecta necesita poder
callar el juego en un segundo. El icono cambia de forma —altavoz con ondas o
con equis—, no solo de color, para que se lea desde el fondo del salón.

`M` hace lo mismo desde el teclado. Existe porque mientras hay una tarjeta
abierta el botón queda tapado por ella.

`CONFIG.SONIDO.activo` decide con qué estado arranca el juego. Ponlo en `false`
si prefieres que empiece mudo y se encienda a mano.

El botón tiene **tres estados**, no dos: sonido activo, silenciado, y esperando
el permiso del navegador (late y pide el clic).

### Por qué existe `Juego con sonido.bat`

Ningún navegador reproduce audio hasta que la persona interactúa con la página.
Es una protección contra sitios que suenan solos, **no se puede desactivar
desde el código del juego**, y está comprobado: Chrome rechaza el intento en
`file://` con `NotAllowedError` incluso si el audio va silenciado.

El juego hace tres cosas ante eso:

1. **Lo intenta igual al cargar.** Si el entorno lo permite, la música suena
   sin que nadie toque nada. No cuesta nada intentarlo.
2. **Si el navegador lo bloquea, lo dice.** El botón de la barra late y cambia
   a "Toca para el sonido" hasta el primer clic o tecla. Sin ese aviso, el
   silencio inicial parece una avería del juego.
3. **El `.bat` lo resuelve del todo.** Abre Chrome (o Edge) con el permiso ya
   concedido y en un perfil aparte, así que la música arranca sola. El perfil
   aparte es imprescindible: si Chrome ya está abierto, reutiliza el proceso
   existente y los parámetros nuevos se ignorarían.

El `.bat` tiene que estar **en la misma carpeta que el HTML**. Si no encuentra
el juego, o no hay Chrome ni Edge instalados, lo dice y abre el HTML con el
navegador predeterminado en vez de fallar en silencio.

---

## Sistema de color · Línea gráfica Beit Teshuvá

Toda la interfaz usa la paleta institucional. Los tokens viven en un solo sitio,
el bloque `:root` de `juego/src/styles.css`, y los colores de equipo en
`juego/src/data/equipos.js`. **No hay colores sueltos repartidos por los
componentes**, salvo los que pertenecen a la ilustración.

### La paleta

| Color | Uso |
|---|---|
| `#003b57` azul profundo | Tinta principal, nivel avanzado, base del degradado |
| `#1d71b8` azul marca | Color interactivo: botones, teclas activas, foco, chips |
| `#0098e1` azul vivo | Realce, ronda actual, extremo claro del degradado |
| `#3dc0ff` cian claro | Solo decorativo o sobre fondo oscuro |
| `#ffffff` blanco | Superficie base de todos los paneles |

El **degradado `#003b57 → #0098e1`** es la firma de marca: aparece como filete
superior en la barra del juego y en cada tarjeta modal.

### Cuatro reglas que no conviene romper

**1. El cian `#3dc0ff` nunca lleva texto sobre blanco.**
Da 2.06:1 de contraste, muy por debajo del mínimo legible (4.5:1). Vive en el
degradado, en el halo del trofeo y en el confeti.

**2. El azul vivo `#0098e1` solo en texto grande o como relleno.**
Sobre blanco da 3.19:1: sirve para cifras grandes en negrita, no para etiquetas.

**3. El degradado a plena intensidad solo donde no hay texto encima.**
Para superficies que sí llevan texto blanco existe `--degradado-marca-texto`,
que corta el extremo claro en `#0079b8` para conservar 4.74:1. Si se usara el
degradado completo, el botón destacado bajaría a 3.19:1 y fallaría en tamaños
pequeños.

**4. Verde y rojo se quedan, y no son un descuido de marca.**
Acierto y error son *información*, no identidad: con niños la señal tiene que
ser instantánea, y quitarla rompería la usabilidad. Están recalibrados a
versiones frías que conviven con el azul. El verde significa exclusivamente
"respuesta correcta": la pantalla final celebra en azul profundo, porque
terminar la partida no es acertar.

El **dorado sobrevive únicamente en la ilustración**: el burro y la copa. No
debe entrar en la interfaz. Es el único acento cálido de la pantalla y por eso
dirige la mirada.

### Los colores de equipo

Los tres equipos usan los tres azules de marca, diferenciados por profundidad.
Como tres azules se distinguen peor que tres colores distintos —sobre todo en un
proyector desajustado—, **el color nunca es el único identificador**: la ficha
numerada añade un segundo eje que se lee incluso en escala de grises.

| Equipo | `color` (decorativo) | `colorTinta` (texto) | `tono` (ficha) |
|---|---|---|---|
| 1 · אֶחָד | `#003b57` | `#003b57` | `profundo` — rellena oscura |
| 2 · שְׁנַיִם | `#1d71b8` | `#175d99` | `medio` — rellena media |
| 3 · שְׁלֹשָׁה | `#0098e1` | `#0272a8` | `claro` — perfilada clara |

Cada equipo tiene dos colores a propósito: `color` para lo decorativo (bordes,
barra de turno, halo del equipo activo) y `colorTinta` para lo que lleva texto,
porque `#0098e1` no alcanza 4.5:1 con el número blanco de la ficha.

Si añades un cuarto equipo, dale también `colorTinta`, `colorSuave` y un `tono`.

### Accesibilidad verificada

Todos los pares texto/fondo cumplen **WCAG AA** (4.5:1 en texto normal, 3:1 en
texto grande y en los bordes que indican estado). La comprobación no es a ojo:
se recorre la página compilada calculando el fondo efectivo de cada texto. Si
cambias un color, hay que volver a comprobarlo.

El sistema respeta además `prefers-reduced-motion` (desactiva animaciones) y
`prefers-contrast: more` (oscurece neutros y bordes).

---

## En el teléfono y la tablet

El juego se diseñó para proyector, pero en vertical el orden de dos columnas se
apilaba mal: **el burro caía debajo del teclado, fuera de pantalla**. Y el burro
no es decoración: es el medidor de tensión. Sin verlo no se sabe cuánto falta
para perder la ronda, que es justo lo que mantiene enganchado al grupo.

### El orden en una sola columna

Por debajo de 1080 px las dos columnas se disuelven (`display: contents`) para
que sus paneles pasen a ser hermanos y se puedan reordenar uno a uno:

```
barra  →  turno  →  BURRO + intentos  →  palabra  →  teclado  →  puntuaciones
```

Ese orden sigue lo que necesita el jugador en cada momento: de quién es el turno
→ cómo va la ronda → qué hay que adivinar → con qué se juega. Las puntuaciones
quedan al final a propósito: se consultan entre rondas, no durante.

### La banda del burro

En vertical, el burro y los números de intento comparten **una sola banda
horizontal**. Son las dos mitades de la misma pregunta —"¿cómo voy?"— y juntos
ocupan la mitad de alto que apilados.

La escena se dimensiona por **altura** (`clamp(110px, 17vh, 190px)`), no por
porcentaje de ancho. Es la diferencia entre que funcione y que no: con un
porcentaje, en una tablet de 1024 px la escena se disparaba a 550 px de alto y
empujaba el teclado dos pantallas abajo.

### Qué se sacrifica, y en qué orden

Un teclado hebreo de cinco filas más el burro más la palabra no caben en un
teléfono sin apretar algo. El orden en que se cede está decidido, y hay dos
media queries **por altura de pantalla** que lo aplican:

| Altura | Qué se retira |
|---|---|
| ≤ 800 px | Huecos y relleno; las teclas bajan de alto |
| ≤ 690 px | El rótulo "Teclado hebreo", el título del juego y la pista "Una palabra" |

Lo que **nunca** se sacrifica: el burro, la palabra y que las teclas sigan
siendo pulsables. Comprobado midiendo en proyector, portátil, tablet en las dos
orientaciones, iPhone SE, iPhone 12, iPhone Plus y Android compacto: en todos
entra el juego completo sin desplazar. Solo en teléfonos muy antiguos
(320 px de ancho) la última fila del teclado pide un pequeño desplazamiento.

---

## El proyecto React

```
Juego con sonido.bat          ← lanzador recomendado para proyectar
Juego - Adivina la palabra (hebreo).html
Assets/audios/                ← los seis MP3 (origen único, alias @audios)
juego/
├── index.html
├── package.json
├── vite.config.js            ← alias @audios y ajustes del archivo único
├── herramientas/
│   └── generar_burro.py      ← regenera el burro desde los SVG
└── src/
    ├── App.jsx               ← máquina de estados de la partida
    ├── styles.css            ← sistema visual completo y tokens de color
    ├── data/                 ← config, equipos, rondas, audio, burro (generado)
    ├── lib/hebreo.js         ← normalización de niqqud y formas finales
    ├── lib/partida.js        ← barajado de rondas dentro de cada nivel
    ├── lib/sonido.js         ← música aleatoria, efectos y atenuados
    └── components/           ← barra, botón de sonido, palabra, teclado,
                                burro, moscas, marcador, resultado y final
```

Para desarrollar:

```bash
cd juego
npm install
npm run dev      # servidor de desarrollo con recarga en caliente
npm run build    # genera dist/index.html, el archivo único
```

Después de `npm run build`, copia `juego/dist/index.html` sobre
`Juego - Adivina la palabra (hebreo).html` para actualizar el archivo de doble clic.

---

## Cómo se usaron tus assets del burro

Los siete SVG entregados son fotogramas **acumulativos** del mismo dibujo, pero
cada uno se exportó con su propio `viewBox`. El script `herramientas/generar_burro.py`
los unifica en un solo sistema de coordenadas y produce `src/data/burro.js`:

| Intentos gastados | Estado | Origen |
|---|---|---|
| 0 | estaca | recortada de `PERDEDOR.svg` |
| 1 | estaca + cuerda | recortada de `PERDEDOR.svg` |
| 2 | cabeza | `cabeza.svg` |
| 3 | cabeza y lomo | `cabeza y torso.svg` |
| 4 | patas delanteras | `patas delanteras.svg` (desplazado −38.56, −18.44) |
| 5 | burro de pie | `patas traseras.svg` |
| 6 | burro instalado | `PERDEDOR.svg`, con su suelo |

Dos detalles resueltos por el camino:

- **`patas delanteras.svg` estaba desalineado.** Se midió la caja de la estaca en
  cada archivo para calcular el desplazamiento exacto que lo devuelve a su sitio.
- **El pasto del asset lleva recortadas las siluetas de las patas.** Usado como
  capa de fondo dejaba huecos blancos en los estados sin patas, así que se dibuja
  un suelo neutro propio y el del asset solo aparece en el estado final.

El **burro conserva su color original**: es la mascota, no interfaz, y llevarlo
a azul monocromo le quitaría carácter y lo fundiría con el fondo. Lo que sí se
recoloreó dentro de `burro.js` es su **entorno**, que sí chocaba con la paleta:
el suelo y el pasto pasaron del verde a azules del sistema (matiz 202°,
conservando la luminosidad original), y la nubecita de polvo pasó a gris azulado.

> ⚠️ **Si vuelves a ejecutar `generar_burro.py`, se regenera `burro.js` desde los
> SVG originales y se pierde ese recoloreado del entorno.** Habría que repetirlo:
> son los tonos verdes de matiz 72°–100° con saturación ≥ 0.3, más `#ddddca`,
> remapeados al matiz 203° con la saturación al 62 %.

### Las moscas

`Mosca_1/2/3.svg` **no son tres moscas distintas**: son tres fotogramas de la
misma mosca vista desde arriba, con las alas en tres posiciones. El óvalo
oscuro es el cuerpo y las formas claras son las alas. Ciclando los tres
fotogramas deprisa se obtiene el aleteo.

Cómo están montadas, en `juego/src/components/Moscas.jsx`:

- **Alineadas por el abdomen, no por el lienzo.** Cada fotograma tiene su
  propio `viewBox` y el cuerpo cae en un sitio distinto: si se centraran por el
  lienzo, la mosca daría un salto en cada cambio de ala. Los valores de la
  constante `ANCLAJES` están **medidos** rasterizando los SVG y buscando el
  centroide de los píxeles oscuros del tramo inferior, no estimados a ojo.
- El aleteo es un ciclo de tres pasos con **corte seco**, no un fundido, con
  `steps(1, end)` y un desfase de un tercio por fotograma. Cada mosca tiene su
  propia velocidad (entre 180 y 240 ms) para que no aleteen a la vez.
- El `<defs><style>` de los SVG se emite **una sola vez**; si no, se repetiría
  dieciocho veces (tres fotogramas por seis moscas). Las clases ya vienen
  prefijadas por fotograma (`m0-`, `m1-`, `m2-`) y no chocan.
- Se dibujan **dentro del mismo `viewBox` que el burro**, así que su tamaño y
  sus órbitas escalan solos con la escena: no hay ni un cálculo en JavaScript.
- Hay **una mosca por intento agotado** (6, 5 o 4 según el nivel).
- Cada mosca tiene tres capas de movimiento: entrada (opacidad), vuelo (órbita
  elíptica de ocho pasos, con radio, duración y sentido propios) y cuerpo
  (escala y balanceo).
- `TAM` es la altura de la mosca en unidades de la escena. Está por encima de
  la escala real a propósito: una mosca a tamaño verdadero sobre un burro sería
  un punto de tres píxeles en el proyector y se leería como suciedad.
- Las órbitas están en la constante `ORBITAS`, en coordenadas del `viewBox`
  (el burro ocupa aproximadamente x 270–1670, y 30–1360). Mover una mosca es
  cambiar su `x`/`y`; ensanchar su vuelta es cambiar `rx`/`ry`.
- Con `prefers-reduced-motion` las moscas se quedan quietas en su órbita y se
  fija el primer fotograma: sin esa regla, la congelación global de animaciones
  dejaría los tres fotogramas invisibles y las moscas desaparecerían.

> El icono de la barra superior también sale de `Mosca_*.svg`, así que **el
> logotipo del juego es una mosca**. Se puso ahí cuando se creía que eran
> siluetas de cabeza de burro. Funciona, pero si prefieres otra marca hay que
> cambiar `SiluetaBurro` en `BarraSuperior.jsx`.

Si cambias los SVG originales, vuelve a ejecutar:

```bash
cd juego
python3 herramientas/generar_burro.py
npm run build
```

---

## Manejo del hebreo

- El texto se guarda y se muestra en Unicode real, con niqqud y signos intactos.
- La comparación normaliza niqqud, te'amim, dagesh y puntos de shin/sin.
- El maqaf `־`, los espacios y la puntuación se muestran desde el inicio y no se
  pueden seleccionar.
- Los niqqud viajan pegados a su letra: al pulsar ש aparecen שְׁ y שָׂ con sus
  puntos correctos.
- `dir="rtl"` se aplica solo a los bloques hebreos; la interfaz en español sigue
  siendo LTR, con aislamiento bidireccional para que no se mezclen.
