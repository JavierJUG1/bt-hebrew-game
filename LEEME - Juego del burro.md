# Adivina la palabra · עברית

Juego educativo por equipos para aprender vocabulario hebreo. El burro es la
mascota y el marcador visual del progreso: **no hay horca, ni daño, ni nadie en
peligro**. Cada intento fallido va armando la escena de un burro terco que se
amarra a su estaca y acaba plantado en el pasto sin querer moverse.

---

## Para jugar ahora mismo

Abre con doble clic:

    Juego - Adivina la palabra (hebreo).html

Es un archivo único y autocontenido. No necesita instalar nada ni servidor.
Funciona en cualquier navegador moderno y está pensado primero para
**pantalla grande o proyector**, adaptándose a tablet y móvil.

> Con internet, el juego carga las tipografías Noto Serif Hebrew y Outfit.
> Sin internet funciona igual, usando las fuentes hebreas del sistema
> (David, Times New Roman, Arial Hebrew). El niqqud se ve bien en ambos casos,
> pero se ve mejor con internet.

---

## Cómo se juega

1. Las 11 rondas rotan solas entre los tres equipos: 1 → 2 → 3 → 1 → …
2. El equipo en turno elige letras del teclado hebreo.
3. Una letra correcta se revela en **todas** sus apariciones, con su niqqud.
4. Una letra incorrecta gasta un intento y avanza un paso la escena del burro.
5. Al resolver: celebración y se muestra Hebreo → Transliteración → Español.
6. Al agotar los intentos: se revela la respuesta y el turno pasa al siguiente.
7. Tras la ronda 11 aparece la pantalla final con la copa. Los empates muestran
   a todos los equipos ganadores.

`Enter` o `Espacio` sirven para avanzar en las pantallas entre rondas.

---

## Qué se puede editar sin tocar la lógica

Todo lo configurable está en `juego/src/data/`:

| Archivo | Qué contiene |
|---|---|
| `config.js` | Puntos por ronda, intentos máximos por nivel, formas finales, bonus |
| `equipos.js` | Nombres en hebreo, transliteración, español y color de cada equipo |
| `rondas.js`  | Las 11 rondas: nivel, texto hebreo, transliteración, español, referencia |

### Dos decisiones que conviene conocer

**1. Los intentos máximos cambian por nivel: 6 / 5 / 4.**
No es un capricho. En una frase larga aparecen casi todas las letras del
alfabeto, así que casi cualquier tecla acierta y el nivel "avanzado" resultaría
*más fácil* que una palabra de tres letras. Bajar el margen es lo que conserva
la dificultad. Si prefieres 6 intentos planos, pon los tres valores en 6 dentro
de `erroresMaximosPorNivel`. Hay además un `bonusPorErrorNoUsado` (por defecto 0)
si algún día quieres premiar la precisión en vez de solo terminar.

**2. Las formas finales están unificadas.**
Con `unificarFormasFinales: true`, pulsar כ revela también ך. Pedagógicamente es
lo correcto con niños: son la misma letra. Las cinco formas finales siguen
teniendo su propia tecla. Ponlo en `false` si quieres que sean letras
independientes.

### Añadir una ronda

Agrega un objeto a la lista de `rondas.js`. El número de rondas, la rotación de
turnos y la barra de progreso se recalculan solos:

```js
{
  numero: 12,
  nivel: 'intermedio',          // 'facil' | 'intermedio' | 'avanzado'
  hebreo: 'שָׁלוֹם',              // Unicode real, con niqqud, tal cual debe verse
  translit: 'Shalom',
  espanol: 'Paz',
  referencia: '',               // opcional; solo se muestra al resolver
}
```

Escribe el hebreo exactamente como quieres que se vea. **No hay que quitar los
niqqud**: el juego los conserva al mostrar y los ignora al comparar.

---

## El proyecto React

```
juego/
├── index.html
├── package.json
├── vite.config.js
├── herramientas/
│   └── generar_burro.py      ← regenera el burro desde los SVG
└── src/
    ├── App.jsx               ← máquina de estados de la partida
    ├── styles.css            ← sistema visual completo
    ├── data/                 ← config, equipos, rondas, burro (generado)
    ├── lib/hebreo.js         ← normalización de niqqud y formas finales
    └── components/           ← barra, palabra, teclado, burro, marcador, final
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
| 6 | burro instalado | `PERDEDOR.svg`, con su pasto |

Dos detalles resueltos por el camino:

- **`patas delanteras.svg` estaba desalineado.** Se midió la caja de la estaca en
  cada archivo para calcular el desplazamiento exacto que lo devuelve a su sitio.
- **El pasto del asset lleva recortadas las siluetas de las patas.** Usado como
  capa de fondo dejaba huecos blancos en los estados sin patas, así que se dibuja
  un suelo neutro propio y el pasto original solo aparece en el estado final.

Los archivos `Mosca_1/2/3.svg` son siluetas de cabeza de burro, no moscas: se usan
como iconos de los intentos gastados y como logotipo de la barra superior.

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
