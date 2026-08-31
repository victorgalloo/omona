# Brief de Logo — Omona

> Documento para generar el logo en Higgsfield (o cualquier modelo de imagen).
> Los prompts están **en inglés a propósito**: los modelos de imagen responden mucho mejor.
> Copia y pega el bloque que quieras probar, tal cual.

---

## 1. Contexto de marca

| Campo | Valor |
|---|---|
| **Nombre** | Omona |
| **Qué es** | Asistente de ventas con IA que vive en WhatsApp |
| **Para quién** | PyMEs de LATAM (México, Colombia, Chile, Argentina) |
| **Lema** | Tu WhatsApp que vende solo |
| **Categoría visual** | SaaS B2B / dev-tool premium |
| **Referentes de estilo** | Linear, Vercel, Stripe, Anthropic, Raycast |
| **Anti-referentes** | Gradientes morados de "IA genérica", robots, cerebros, circuitos, mascotas |

**Personalidad:** preciso, silencioso, confiable. No grita. Es la herramienta que ya está trabajando cuando llegas a la oficina.

---

## 2. Dirección creativa

El nombre empieza con **O** — es un regalo. La O es un círculo perfecto: geométrico, cerrado, infinito. Ahí está el logo.

**Concepto central:** una **O** geométrica construida con precisión matemática, con **un solo detalle** que la convierte en conversación (una muesca, una cola de globo de chat, un corte).

Un detalle. No dos. La contención es lo que lo hace verse caro.

### Tres rutas a explorar

**Ruta A — La O con cola** (recomendada)
Anillo monolínea perfecto. En el cuadrante inferior izquierdo, una cola corta y angular que lo lee como globo de mensaje. Todo lo demás es geometría pura.

**Ruta B — La O dividida**
Dos arcos que casi cierran el círculo, separados por un gap fino. Dos voces en un diálogo. Legible como O a cualquier tamaño.

**Ruta C — La O sólida con corte**
Círculo lleno, con una muesca triangular limpia que sugiere la cola del globo. La versión más pesada y más "logo de empresa grande".

---

## 3. Reglas duras

- **Monocromático.** Un solo color plano. Sin gradientes, sin sombras, sin 3D, sin brillos.
- **Vectorial y plano.** Debe verse igual en 16px que en una valla publicitaria.
- **Geométrico.** Construido con círculos y líneas rectas. Grosor de línea constante.
- **Sin texto dentro de la imagen.** El wordmark se pone después, en tipografía.
- **Fondo sólido.** Blanco o negro plano, para poder recortarlo.
- **Debe funcionar en negativo** (blanco sobre negro y negro sobre blanco).

---

## 4. Paleta

Tomada del dashboard que ya existe.

| Rol | Hex | Uso |
|---|---|---|
| **Negro marca** | `#1C1C1C` | Logo principal sobre claro |
| **Blanco marca** | `#FAFAFA` | Logo sobre oscuro |
| **Verde acento** | `#059669` | Versión de color (guiño a WhatsApp, sin copiarlo) |
| **Verde oscuro** | `#34D399` | Acento en modo oscuro |
| Fondo claro | `#FFFFFF` | |
| Fondo oscuro | `#0C0C0C` | |

Genera **primero en negro sobre blanco**. El color se decide después.

---

## 5. Prompts listos para pegar

### Prompt A — La O con cola *(empieza por aquí)*

```
Minimalist vector logo mark for a tech company. A perfect geometric circle
drawn as a single monoline ring, thick uniform stroke weight. In the lower
left quadrant, a short angular tail extends outward, transforming the ring
into an abstract speech bubble. Nothing else. Pure geometry, mathematically
precise, constructed on a grid. Solid black on a flat white background.
Flat vector, no gradients, no shadows, no 3D, no texture. Centered,
generous negative space. Swiss design, Bauhaus geometry, brand identity
mark for a premium developer tool. Scalable to a 16px favicon.
```

### Prompt B — La O dividida

```
Minimalist vector logo mark. Two thick geometric arcs forming an almost-
closed circle, separated by two narrow precise gaps on opposite sides.
Reads as the letter O. Perfect radial symmetry, uniform stroke weight,
mathematically constructed. Solid black on flat white background. Flat
vector, no gradients, no shadows, no depth. Centered with generous margin.
Swiss modernist brand mark, geometric abstraction, premium B2B software
identity. Extremely simple, confident, restrained.
```

### Prompt C — La O sólida con corte

> ⚠️ **Descartada.** Un disco sólido con una cuña que apunta al centro **es** Pac-Man.
> Son tres ingredientes — disco lleno, cuña, dirección hacia el centro — y basta romper
> uno. Un globo de mensaje tiene la cola hacia *afuera*; Pac-Man tiene la boca hacia
> *adentro*. Usa C2, C3 o C4 en su lugar.

### Prompt C2 — Corte recto

Rompe la cuña: el corte es una cuerda recta, no un triángulo. El "kerf" (la rebanada fina separada) aporta el detalle técnico.

```
Minimalist vector logo mark for a technology company. A solid filled circle
in pure black, sliced by a single straight flat cut across the lower left
edge, removing a shallow segment. The cut is a clean straight chord, never
a wedge and never a pie slice. A second much thinner parallel sliver is
separated from the main form by a precise narrow gap, like a laser kerf.
Machined precision, constructed on a grid. Flat white background. Flat
vector, no gradients, no shadows, no 3D. Bold, heavy, perfectly centered.
Swiss design, technical precision, premium software brand mark.
```

### Prompt C3 — Apertura *(la más tech — recomendada)*

Rompe el disco lleno: al perforar el centro deja de ser una silueta maciza. Lee como diafragma de lente. Es la ruta más "instrumento de precisión".

```
Minimalist vector logo mark. A thick solid black ring, like a camera lens
aperture, formed by a filled circle with a smaller circle punched cleanly
out of the center. The ring is interrupted by one narrow straight slot cut
through it at a 45 degree angle in the lower left. Precision engineered,
mathematically constructed on a grid. Flat white background. Flat vector,
no gradients, no shadows, no 3D. Bold stroke weight, perfectly centered,
generous negative space. Swiss design, technical drawing precision, premium
developer tool identity, iconic at 16 pixels.
```

### Prompt C4 — Cola hacia afuera

Rompe la dirección: la cuña sale del círculo en vez de morderlo. Es la única de las tres que conserva la lectura literal de globo de mensaje.

```
Minimalist vector logo mark. A solid filled circle in pure black with a
small angular tail extending outward from the lower left edge, a sharp
geometric wedge pointing away from the circle, never cutting into it. One
continuous solid silhouette, precision-machined. Flat white background.
Flat vector, no gradients, no shadows, no 3D. Bold, heavy, perfectly
centered. Swiss design, geometric precision, premium technology brand mark.
```

### Prompt D — Versión monograma (para favicon / app icon)

```
Minimalist app icon. A rounded square tile in solid deep black, with a
single white geometric ring centered inside it, the ring broken by a short
angular tail in the lower left. Flat design, no gradients, no shadows,
no bevel, no glossy effect. iOS app icon proportions, generous padding
around the mark. Premium software brand, Swiss design, extreme simplicity.
```

---

## 6. Prompt negativo

Si Higgsfield acepta negative prompt, pega esto:

```
text, letters, words, typography, gradient, gradients, glow, glowing,
neon, 3d, three dimensional, bevel, emboss, drop shadow, reflection,
glossy, metallic, chrome, realistic, photograph, photorealistic,
mockup, business card, watermark, signature, multiple logos, logo grid,
variations, robot, brain, circuit board, network nodes, chat icon cliche,
speech bubble cliche, ai cliche, purple, cyan, rainbow, complex,
detailed, ornate, cluttered, busy, hand drawn, sketch, brush stroke,
low quality, blurry, jpeg artifacts,
pacman, pac-man, video game character, arcade character, open mouth,
eating, wedge cut, pie slice, pie chart, missing slice, cheese wheel,
crescent moon, loading spinner
```

---

## 7. Qué pedir en la salida

| Entregable | Formato | Nota |
|---|---|---|
| Marca principal | 2048×2048 PNG, fondo blanco | La que vas a vectorizar |
| Marca en negativo | 2048×2048 PNG, fondo negro | Verifica que funcione invertida |
| App icon | 1024×1024 PNG | Para favicon y stores |
| Versión verde | 2048×2048 PNG | Solo si la negra ya funcionó |

**Después de generar:** vectoriza el PNG ganador (Illustrator Image Trace, o [vectorizer.ai](https://vectorizer.ai)) y reconstrúyelo a mano con círculos reales. Un logo generado por IA nunca es geométricamente perfecto — sirve como dirección, no como archivo final.

---

## 8. Test de aprobación

Antes de quedarte con uno, pásalo por estos cinco filtros. Si falla uno, descártalo.

1. **Prueba de 16px** — ¿se sigue leyendo como una O reducido a favicon?
2. **Prueba de un color** — ¿funciona en negro plano, sin ningún efecto?
3. **Prueba de memoria** — ¿puedes dibujarlo de memoria después de verlo 3 segundos?
4. **Prueba de la camiseta** — ¿lo bordarías en una prenda?
5. **Prueba de la competencia** — ¿se distingue de cualquier otro logo SaaS con círculo?

---

## 9. Wordmark (aparte del símbolo)

El símbolo va solo. El nombre se compone en tipografía, no se genera con IA.

- **Tipografía sugerida:** Inter, Söhne, o Geist — todas geométricas y neutras
- **Peso:** Medium (500) o Semibold (600). Nunca Bold pesado.
- **Tracking:** ligeramente abierto, `+0.02em`
- **Caja:** minúsculas — `omona`. Más suave, más contemporáneo, más LATAM que `OMONA`.
- **Lockup:** símbolo a la izquierda, wordmark a la derecha, separados por el ancho de la contraforma de la O.

---

## 10. Pendiente relacionado

El favicon actual en [icon.svg](apps/dashboard/src/app/icon.svg) todavía es el de la marca anterior: un cuadro verde `#25D366` con la letra **L** de *loomi*. Reemplázalo cuando el logo esté listo.
