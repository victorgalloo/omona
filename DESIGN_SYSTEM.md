# Omona: sistema de diseño «terminal impresa en papel»

> Fuente de verdad del sitio público (omona.tech) desde el 22-nov-2026. Reemplaza al sistema
> anterior (oscuro, neones, chrome de terminal macOS), que sigue en el historial de git.
> El dashboard (`(dashboard)/`) todavía usa los tokens de compatibilidad y se migra aparte.

Tema **claro por defecto**. Monocromo disciplinado: lienzo `#fafafa`, texto `#171717`, bordes
hairline, **cero color decorativo**. Se lee como una terminal impresa en papel.

## 1. Marca

- El glyph de Omona es el **anillo con ranura radial a 135°** (`<Logo />`, `components/shared/Logo.tsx`,
  `currentColor`). Siempre `#000`, 1:1, sin borde.
- Usos del glyph: icono del wordmark (nav y pie), **prefijo de comandos** en los paneles CLI, silueta
  flotante del héroe e indicador de carga.
- Wordmark: `omona` en Geist Sans 17px/500, tracking -0.04em, junto al glyph de 20px.
- No se usa la marca, el triángulo ni el nombre de ninguna otra empresa. Sin créditos de inspiración.

## 2. Color

| Token | Hex | Uso |
|---|---|---|
| paper | `#fafafa` | lienzo de toda página |
| white | `#ffffff` | tarjetas, inputs |
| hair | `#ebebeb` | bordes 1px |
| ash | `#c9c9c9` | deshabilitado, separadores `/` |
| smoke | `#a8a8a8` | terciario, placeholder |
| graphite | `#8f8f8f` | microcopy del pie |
| slate | `#7d7d7d` | tira de logos (solo marcas reales) |
| stone | `#666666` | captions, metadata |
| charcoal | `#4d4d4d` | cuerpo |
| obsidian | `#171717` | titulares, botón lleno, tarjeta invertida |
| carbon | `#000000` | SOLO el glyph e íconos SVG |
| terminal-green | `#297a3a` | único acento: ✓ de confirmación, estado *merged*, links/tags cortos |

- Gradiente espectro (0,255,149)→(255,208,0)→(255,23,68)→(149,0,255)→(0,229,255): solo el halo del
  héroe (`.spectrum-glow`). Solar-edge (255,220,48)→(56,162,255): solo callouts.
- Profundidad por valor tonal (`#fafafa` → `#fff` → `#171717`), nunca por sombra.
- Texto nunca en `#000`. Ningún otro color cromático (ni rojo de error en marketing: usa stone).

## 3. Tipografía

Dos familias del paquete npm `geist` (OFL), cargadas en `app/layout.tsx`:

- **Geist Sans** (fallback Inter): 400/450/500. Nunca 600–700 en titulares.
  - `.text-display` 64px · lh 1.0 · ls -0.06em · 450
  - `.text-heading-lg` 56px · lh 1.0 · ls -0.06em · 450
  - `.text-heading` 30px · lh 1.1 · ls -0.05em · 450
  - cuerpo 16px lh 1.5 · UI 14px
- **Geist Mono** (fallback JetBrains Mono): eyebrows, labels, metadata y código, SIEMPRE.
  - `.eyebrow` / `.mono-label`: 11–12px, MAYÚSCULAS, ls 0.071em; 12px antes del titular.
  - caption 13px lh 1.54.
- `font-feature-settings: "calt" 0, "rlig", "ss11"`. Nunca line-height > 1.0 en 56–64px.
- `text-balance` en titulares para evitar huérfanas.

## 4. Forma y espacio

- Grid de 4px. Spacing: 4, 6, 8, 12, 14, 16, 20, 24, 32, 40, 44, 208.
- Radios: tarjetas y botones **6px**; nav 2px; pills 9999px solo para acciones compactas del header
  y badges de estado. Nunca > 6px en rectangulares.
- Sombras SOLO como anillo:
  - tarjeta `.ring-card`: `0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa`
  - ghost `.ring-ghost`: `0 0 0 1px #ebebeb`
  - Nunca drop-shadow.
- Max-width 1280px (`Wrap`), padding lateral 24–48px. Secciones separadas 96–128px sin divisores
  ni cambio de fondo. Card padding 16px, gap 12px.

## 5. Componentes (clases en `app/globals.css`)

| Componente | Clase | Regla |
|---|---|---|
| Botón lleno | `.btn-fill` | `#171717`, texto blanco, r6, 12px h-padding, 14/400. Solo la acción principal. |
| Botón ghost | `.btn-ghost` | transparente, `#4d4d4d`, anillo `#ebebeb`, r6, 14/400. |
| Pill | `.btn-fill`/`.btn-ghost` + `rounded-full !h-8` | solo en el header. |
| Tarjeta | `.ring-card` | `#fff`, anillo doble, r6, 16px. |
| Tarjeta invertida | `.card-invert` | `#171717`, texto blanco. Con mesura: una por página como mucho. |
| Panel CLI | `.cli` (+ `.ok`, `.dim`) | fondo claro, borde `#ebebeb`, r6, 16px, Geist Mono 12–13px. Comandos con el glyph; ✓ en `#297a3a`. «La terminal ES el marketing». |
| Eyebrow | `.eyebrow` / `<Eyebrow>` | Mono 11px, 0.071em, MAYÚSCULAS. |
| Nav | `LandingNav` | 64px sticky, `#fafafa`/80 + blur 20px, sin borde inferior. Marca izq., links 14px, ghost + lleno a la der. `lang="en"` para páginas en inglés. |
| Pie | `HomeFooter` | columnas Producto / Recursos / Código abierto / Cuenta + firma discreta a victorgallo.com. |
| Badge de estado | `StateBadge` (`site/Blog.tsx`) | pill blanca con anillo; *merged* en `#297a3a`. El estado SIEMPRE sale de GitHub. |
| Prosa | `.geo-prose` (+ `.nota-prose`) | artículos del blog. |

- **Héroe**: asimétrico de 3 zonas: titular grande a la izquierda, glyph negro flotando al centro
  sobre el halo espectro, pila de eyebrows a la derecha. Sin imagen de fondo.
- **Features**: grids 2-up/3-up con mini-UI real del producto dentro (CLI, tarjeta de CRM, borrador).
- Las bandas `Band tone="contrast"` ya no oscurecen: son alias de papel.
- Animaciones de entrada: nunca dejar el héroe en `opacity: 0` en el HTML del servidor
  (`initial={false}`): los buscadores y los navegadores sin JS deben ver el texto.

## 6. Imagen

Escasa y funcional: sin foto, sin ilustración, sin 3D, sin video decorativo. Mockups del producto
en claro dentro de tarjetas con borde. Diagramas de blog en SVG monocromo (`public/blog/<slug>/`).
OG images con `lib/og.tsx` (papel, titular obsidian, glyph).

## 7. Reglas duras

- `#171717` para texto y botones llenos (nunca `#000` en texto).
- r6 en todo; 9999 solo pills del nav y badges.
- Titulares 400–450 con -0.06em a 56–64px.
- Labels/metadata/código = Geist Mono siempre.
- Ningún color cromático fuera de `#297a3a` y los gradientes decorativos. Sin drop-shadows.
- Cuerpo y titulares solo en la escala `#171717` / `#4d4d4d` / `#666666`.
- Sin clientes, logos ni cifras inventadas: los paneles CLI y mini-UI son EJEMPLOS y lo dicen.

## 8. Dónde vive cada cosa

- Tokens: `app/globals.css` (variables + clases) y `tailwind.config.ts` (colores `paper`, `hair`,
  `ash`, `smoke`, `graphite`, `slate`, `stone`, `charcoal`, `obsidian`; radios; sombras de anillo).
- Portada: `components/site/Home.tsx`. Blog/notas: `components/site/Blog.tsx` + `lib/notas.ts` +
  `data/notas/*.md`. Open source: `components/site/OpenSource.tsx` + `data/oss/*.json`.
- Entidad (Organization/Person JSON-LD): `lib/entidad.ts`.
