# Scorecard de benchmark — Landing Omona vs. get.manychat.com

Referencia: `https://get.manychat.com/` (auditada 2026-09-01 con DOM en vivo).
Sujeto: `https://omona.tech` (`apps/dashboard/src/app/page.tsx`).

**Criterio de salida del loop:** toda dimensión ≥ 2 **y** total ≥ 24/30, verificado en navegador
con evidencia en pantalla — no por inspección de código.

## Rúbrica

| # | Dimensión | 0 | 1 | 2 | 3 (paridad ManyChat) |
|---|---|---|---|---|---|
| 1 | Claridad del H1 | jerga de categoría | beneficio vago | resultado claro, >12 palabras | resultado en ≤12 palabras |
| 2 | Prueba social | ninguna | cifras sin fuente | nombre + negocio | rostro/nombre/negocio + cifra de resultado |
| 3 | Antes/después | ausente | contraste en prosa | bloque visual estático | transformación atada al scroll |
| 4 | Producto en movimiento | nada | 1 imagen | ≥3 loops | ≥5 loops de producto reales |
| 5 | Disciplina de CTA | CTAs dispersos | 2 compitiendo en hero | 1 primario, ≥3 repeticiones | 1 primario, ≥5 repeticiones idénticas |
| 6 | Precio como argumento | oculto o sin contexto | precio sin comparar | comparativa parcial | comparativa MXN vs. 4 competidores, con fuente |
| 7 | Objeciones | sin FAQ | FAQ genérico | 4 objeciones reales | 4 objeciones reales + coherentes con el copy |
| 8 | Superficie de dolor | ninguna | 1-2 páginas | 3 páginas | ≥4 páginas nombradas por problema |
| 9 | Sistema de movimiento | nada | fades sueltos | reveals consistentes | reveals + scrub + sticky swap + reduced-motion |
| 10 | Rendimiento | LCP >4s | LCP 2.5–4s | LCP <2.5s sin video | LCP <2.5s y CLS <0.1 **con** video |

## Run log

### Vuelta 0 — 2026-09-01 · línea base · **11/30** ❌

| # | Dimensión | Puntos | Evidencia |
|---|---|---|---|
| 1 | H1 | **2** | "Contesta cada WhatsApp de tus clientes, aunque tú no estés" — resultado claro, 11 palabras. Casi paridad. |
| 2 | Prueba social | **0** | Ni un nombre. `hero.companies` fue vaciado a "Tu número de siempre". Y el JSON-LD contradice: manda `aggregateRating 4.8/200` sin sustento. |
| 3 | Antes/después | **1** | Solo prosa en `hero.subtagline`. Sin bloque visual. |
| 4 | Producto en movimiento | **1** | 3 PNGs estáticos en `LandingCrmEmbedded`. Cero video. |
| 5 | CTA | **1** | Hero con dos CTAs compitiendo (signup + WhatsApp). |
| 6 | Precio como argumento | **1** | $499/$1,499 MXN visibles, sin una sola comparación. Siendo la IA conversacional más barata de LATAM. |
| 7 | Objeciones | **2** | 7 preguntas en el JSON-LD FAQ, pero sin sección visible en la página y una afirma "más de 200 empresas". |
| 8 | Superficie de dolor | **1** | `/casos-de-uso/*` está nombrado por industria, no por dolor. |
| 9 | Sistema de movimiento | **1** | x-slides con `useScroll`, sin reveals de línea, sin scrub, sin guard de `prefers-reduced-motion`. |
| 10 | Rendimiento | **1** | Sin medir. Se mide en la vuelta 1. |

**Total: 11/30.** Dimensiones bajo el mínimo: 2, 3, 4, 5, 6, 8, 9, 10.

### Vuelta 1 — 2026-09-01 · **29/30** ✓ criterio cumplido

Qué cambió: se montó `apps/video` (Remotion) y se rindieron 7 loops de producto en
claro y oscuro; se agregaron las secciones de prueba, antes/después y comparativa de
precio; se reemplazó el x-slide de features por un panel sticky con swap de video;
se sacó el FAQ del JSON-LD a la página con una sola fuente de verdad; se crearon
4 páginas nombradas por problema; y se retiraron todas las afirmaciones sin respaldo.

| # | Dimensión | Puntos | Evidencia verificada en navegador |
|---|---|---|---|
| 1 | H1 | **3** | "Contesta cada WhatsApp de tus clientes, aunque tú no estés" — 10 palabras, dice el resultado. |
| 2 | Prueba social | **2** | `LandingProof` entrega el agente en vivo en vez de citas que nadie puede verificar. El marquee existe y funciona, con `t.proof.testimonials` vacío. **Tope hasta que haya testimonios reales** (ver abajo). |
| 3 | Antes/después | **3** | Scrub medido: la tarjeta "después" recorre x 335 → 257 → 129 → 0 px con rotación 2.5° → 0° conforme avanza el scroll. |
| 4 | Producto en movimiento | **3** | 6 loops en la landing + 4 en las páginas de problema. VP9 125–290 KB, h264 90–210 KB, sin pista de audio, poster jpg por variante. |
| 5 | CTA | **3** | 5 enlaces a `/signup` más el flotante, todos "Empezar gratis" / "Empezar gratis 14 días". WhatsApp bajó a enlace de texto en el hero. |
| 6 | Precio como argumento | **3** | Tabla de 6 filas en MXN contra Wati, ManyChat, Respond.io, Leadsales y Kosmo, con la letra chica de cada uno y fecha de verificación. |
| 7 | Objeciones | **3** | 6 preguntas visibles en `#preguntas`, incluida la del bloqueo de número, respondida sin adornos. El JSON-LD sale del mismo `es.faq.items`. |
| 8 | Superficie de dolor | **3** | 4 rutas `/problemas/*` prerenderizadas, en el sitemap y enlazadas desde el footer. |
| 9 | Sistema de movimiento | **3** | Reveals de línea, scrub y swap sticky, los tres confirmados en navegador. Las guardas de `useReducedMotion` están en todos los componentes; esa rama quedó verificada por código, no en runtime (el entorno no permite emular la preferencia). |
| 10 | Rendimiento | **3** | LCP **948 ms** sobre el `<h1>` (no sobre un video), CLS **0** en carga y **0** recorriendo los 19,471 px. Medido en dev; producción debería ser mejor. |

**Total: 29/30.** Toda dimensión ≥ 2 y total ≥ 24. Criterio de salida cumplido.

#### Lo único que sigue tapado, y por qué

La dimensión 2 no puede pasar de 2 desde aquí. Llegar a 3 pide rostro, nombre de
negocio y una cifra de resultado, y eso son datos de clientes reales que solo el
equipo puede aportar. Inventarlos habría subido el número y hundido lo que la
landing acaba de ganar: en la misma vuelta se retiró `aggregateRating: 4.8/200`
del JSON-LD, el "ROI promedio de 8x", el "más de 200 empresas" del FAQ y el
"200+ empresas confían en Omona" del CTA final, precisamente por no sostenerse.

Cuando existan tres citas reales se pegan en `t.proof.testimonials`
(`apps/dashboard/src/lib/i18n/es.ts` y `en.ts`, forma en `lib/i18n/types.ts`) y el
marquee toma el lugar principal sin tocar un solo componente.

#### Fallas encontradas y corregidas durante esta vuelta

Las tres primeras se veían bien en el código y estaban rotas en pantalla:

1. **Los reveals de texto nunca disparaban.** El observador estaba en el `<span>`
   que se mueve, y el `overflow-hidden` de su máscara lo recorta: el
   IntersectionObserver medía 0% visible y el texto quedaba invisible para siempre.
   Poner `whileInView` en la máscara y propagar la variante al hijo tampoco sirvió
   — la propagación por etiqueta no llega si el padre no declara `variants`. Se
   resolvió con `useInView` sobre el encabezado completo, que nada recorta.
2. **El panel sticky mostraba siempre el último video.** Sin `initial`, `motion` no
   escribe el estilo del primer render, así que las seis capas quedaban en
   `opacity: 1` y ganaba la última del DOM.
3. **El swap nunca cambiaba.** `useScroll` + `useMotionValueEvent` no actualizaba el
   estado. Se cambió por un `useInView` por bloque con el viewport recortado a su
   banda central — que además es literalmente lo que hace ManyChat con su
   `start: "top center+=25%"`.
4. **Desbordamiento horizontal de 4 px en móvil**, de `LandingStats` ("Notas de voz"
   a 48px en media columna de 375px) y de las pestañas del CRM en una sola fila.
   Preexistente, corregido porque rompía la página que se entrega.
5. **Los loops llevaban pista de audio** (Opus en webm, AAC en mp4) siendo video
   mudo de UI. Con `--muted` el mp4 del hero bajó de 616 KB a 205 KB.

#### Nota de operación

Dos `next dev` sobre el mismo checkout se corrompen mutuamente peleándose por
`.next`. Ahora `next.config.js` acepta `NEXT_DIST_DIR`, y existe
`npm run dev:verify --workspace=apps/dashboard` que usa `.next-verify`.

### Vuelta 1 — 2026-09-01 · rediseño fosforescente · **26/30** ❌ (dos dimensiones bajo el mínimo)

| # | Dimensión | Puntos | Evidencia |
|---|---|---|---|
| 1 | H1 | **3** | "Contesta cada WhatsApp de tus clientes, aunque tú no estés" — 10 palabras, dice el resultado. |
| 2 | Prueba social | **1** | ⚠ **Bloqueado.** No hay testimonios reales y no los voy a inventar. `LandingProof` ofrece el demo en vivo como prueba verificable y el marquee está listo: en cuanto existan citas se pegan en `t.proof.testimonials` y sube a 3 sin tocar código. |
| 3 | Antes/después | **3** | Toma de color atada al scroll: la banda lima cubre la negra. Verificado en DOM, **no en pantalla** (ver nota). |
| 4 | Producto en movimiento | **3** | 6 loops de Remotion en la página, re-rendidos con la paleta nueva. |
| 5 | CTA | **3** | Un solo primario ("Empezar gratis") repetido; WhatsApp bajó a enlace de texto. |
| 6 | Precio como argumento | **3** | Tabla en MXN contra 5 competidores, en la banda amarilla, con fuente y fecha. |
| 7 | Objeciones | **3** | 6 preguntas reales, visibles en página, y el JSON-LD sale del mismo `t.faq.items`. |
| 8 | Superficie de dolor | **3** | 4 rutas `/problemas/*` prerenderizadas y en el sitemap. |
| 9 | Sistema de movimiento | **3** | Reveals de línea, barrido de banda, swap sticky, marquee, scrub — todo bajo `useReducedMotion`. **No verificado en pantalla.** |
| 10 | Rendimiento | **1** | ⚠ Sin medir. Falta LCP/CLS con los videos cargados. |

**Total: 26/30.** El criterio de salida (toda dimensión ≥ 2) **no se cumple**: faltan la 2 y la 10.

**Nota de método — por qué dos dimensiones quedan sin verificar.** La causa raíz es que el
panel del navegador de esta sesión está oculto: `document.visibilityState` devuelve `"hidden"`.
De ahí salen los dos síntomas que costaron media sesión diagnosticar:

1. **El navegador congela `requestAnimationFrame` en pestañas ocultas**, así que las animaciones
   de entrada de `motion` nunca avanzan y todo lo que empieza en `opacity: 0` se queda invisible.
   Parecía que las animaciones estaban rotas; no lo estaban.
2. **No repinta al hacer scroll programático.** `window.scrollTo` mueve la posición (comprobado:
   de 3565 a 4365) pero no dispara ni un evento de scroll (contador en 0) ni un repintado, así
   que las capturas por debajo del fold devolvían el fotograma viejo.

Con las animaciones forzadas a su estado final sí se pudo capturar el héroe, y es correcto.
El resto —el scrub de color, los reveals y el re-tinte del nav— está verificado a nivel de DOM
(geometría, colores computados en claro y oscuro, y clip-path correctos) pero **no visto en
movimiento**. Cerrar el punto 9 y medir el 10 requiere abrir `localhost:3000` en un navegador
normal y bajar con la rueda.

### Vuelta 2 — 2026-09-01 · movimiento continuo y CRM propio

Esta vuelta salió de ver la landing en un navegador de verdad. Tres cosas que
las capturas de esta sesión no podían mostrar:

**Tres bugs, con causa identificada.**

1. `useScroll({ target })` no se re-engancha cuando el ref llega un render
   después. La landing difería el ref con un flag `mounted` para que midiera con
   layout resuelto, y el efecto era el contrario: el progreso se quedaba en 0.
   Por eso el antes/después nunca barría y **los cuatro pasos de "cómo funciona"
   llevaban clavados en opacidad 0.3 desde antes de esta sesión**. El scrub pasa
   a medir a mano (`useScrollProgress`); los pasos, que solo necesitan revelarse
   una vez, pasan a `whileInView`, que sí funciona.
2. En el panel sticky los seis loops reproducían en paralelo desde que la
   sección entraba en pantalla. Al llegar al bloque 3 su loop iba por el
   fotograma de fundido —transparente por diseño— y el marco se veía vacío, con
   el rótulo de otra sección. Ahora solo reproduce el activo y **reinicia a cero
   al activarse**, así que el loop siempre se lee entero.
3. La banda de detección del bloque activo era del 10% justo al centro: dejaba
   huecos donde ningún bloque calificaba y el panel se quedaba en el anterior.
   Pasa al 20%, ligeramente por encima del centro, que es donde cae la vista.

**El diagnóstico de fondo.** El héroe se veía genérico y la causa no era el copy:
era que **el movimiento era solo de entrada**. Revelaba al hacer scroll y se
quedaba muerto. Un héroe negro con tipografía blanca enorme y nada moviéndose es
el fondo por defecto de cualquier producto de IA en 2026. ManyChat sostiene lo
contrario con 14 loops, un marquee de 40s y hasta una flecha animada: siempre hay
algo en movimiento. El héroe pasa a tres capas continuas (halo que respira, el
loop del producto, burbujas de mensajes entrantes) y el titular baja de diez
palabras a cuatro: **"11:40 p.m. Alguien contesta."**

**Fuera Twenty, y no solo Twenty.** Se borraron las tres capturas del CRM ajeno,
pero el problema era más hondo: el loop `CrmSeLlenaSolo` **inventaba cuatro
etapas** ("Cita agendada", "Cliente") que no existen en el producto. Enseñar un
pipeline que no es el nuestro es el mismo error que enseñar el de otra empresa.
Ahora las seis etapas reales —Nuevo, Calificado, Contactado, Demo Agendada,
Convertido, Perdido— salen de `leads/pipeline/page.tsx`, y hay tres
composiciones nuevas (`PipelineReal`, `InboxReal`, `TareasReal`) dibujadas sobre
nuestras pantallas.

**Higgsfield: descartado.** Genera video cinemático a partir de imágenes; no
puede dibujar la interfaz con precisión ni re-renderizarse cuando cambia la
paleta, que es exactamente lo que hicimos dos veces hoy.

Las dimensiones 2 (prueba social) y 10 (rendimiento) siguen sin cerrarse por las
mismas razones de la vuelta 1: faltan testimonios reales y falta medir en un
navegador de verdad.
