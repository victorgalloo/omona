# Loomi.lat - Design System & Brand Specification

> Documento completo de especificaciones de diseño, branding y patrones UI.
> Estética: **Terminal macOS + Vercel** — oscura, minimalista, monospace como acento.

---

## 1. Identidad de Marca

### Nombre y Estilo
- **Producto**: Loomi (estilizado como `loomi_` en `font-mono`)
- **Empresa madre**: anthana (minúsculas, sin punto)
- **Trailing underscore** `_` es parte de la identidad — simula un cursor terminal parpadeante
- **Footer**: `© {year} loomi by anthana · made with ♥ in méxico`

### Logo / Brand Mark
No existe un archivo SVG/PNG de logo. El brand mark es 100% tipográfico + CSS:

```tsx
<div className="flex items-center gap-1.5">
  <div className="w-3 h-3 rounded-full bg-terminal-red" />
  <div className="w-3 h-3 rounded-full bg-terminal-yellow" />
  <div className="w-3 h-3 rounded-full bg-terminal-green" />
</div>
<span className="font-mono font-semibold text-lg text-foreground">loomi_</span>
```

| Variante | Dots | Gap | Tamaño texto |
|----------|------|-----|-------------|
| Navbar / Footer | `w-3 h-3` | `gap-1.5` | `text-lg` |
| Sidebar expandido | `w-2.5 h-2.5` | `gap-1.5` | `text-sm` |
| Sidebar colapsado | `w-2 h-2` | `gap-1` | — (solo dots) |
| Terminal headers | `w-3 h-3` | `gap-2` | — (título aparte) |

### Taglines
- **H1 Hero**: `LOOMI_` (con cursor `_` animado `animate-blink`)
- **Subtitle**: "Agente AI para WhatsApp que vende 24/7"
- **Meta title**: "El agente de ventas que nunca duerme"
- **Meta description**: "Arquitectura serverless con razonamiento chain-of-thought, análisis de sentimiento en tiempo real, y memoria contextual persistente."

### Contacto y Redes
| Canal | Valor |
|-------|-------|
| WhatsApp | `+52 984 980 0629` |
| LinkedIn | `linkedin.com/company/anthanaagency/` |
| Instagram | `instagram.com/anthana.agency/` |
| Email | `anthanasupp@gmail.com` |

### CTAs Principales
| CTA | Destino |
|-----|---------|
| "Empezar gratis" | `/login` |
| "WhatsApp" | `api.whatsapp.com/send?phone=529849800629` |
| "Demo" | `/demo` |
| "Configura tu propio agente" | `/login` |

### Social Proof
- `0.8s` respuesta
- `100%` leads atendidos
- `3x` más demos
- `-78%` no-shows
- Trust line: "Setup en 5 minutos · Sin tarjeta"
- "200+ empresas confían en Loomi"

---

## 2. Paleta de Colores

### Modo Oscuro (`:root` default)

| Token | Hex | Uso |
|-------|-----|-----|
| `--background` | `#0C0C0C` | Fondo principal |
| `--foreground` | `#FAFAFA` | Texto principal |
| `--surface` | `#161616` | Fondos de componentes |
| `--surface-2` | `#1E1E1E` | Fondos secundarios, headers |
| `--surface-elevated` | `#1A1A1A` | Cards elevadas |
| `--muted` | `#8A8A8A` | Texto secundario |
| `--muted-foreground` | `#A3A3A3` | Texto terciario |
| `--border` | `#2A2A2A` | Bordes por defecto |
| `--border-hover` | `#3A3A3A` | Bordes en hover |
| `--accent-green` | `#34d399` | Acentos verdes |

### Modo Claro (`[data-theme="light"]`)

| Token | Hex | Uso |
|-------|-----|-----|
| `--background` | `#FFFFFF` | Fondo principal |
| `--foreground` | `#1C1C1C` | Texto principal |
| `--surface` | `#FAFAFA` | Fondos de componentes |
| `--surface-2` | `#F5F5F5` | Fondos secundarios |
| `--surface-elevated` | `#FFFFFF` | Cards elevadas |
| `--muted` | `#71717A` | Texto secundario |
| `--muted-foreground` | `#525252` | Texto terciario |
| `--border` | `#E5E5E5` | Bordes |
| `--border-hover` | `#D4D4D4` | Bordes hover |
| `--accent-green` | `#059669` | Acentos verdes (más oscuro para legibilidad) |

### Colores Fijos (no cambian entre temas)

| Token | Hex | Uso |
|-------|-----|-----|
| `--terminal-red` | `#FF5F56` | Traffic light, errores decorativos |
| `--terminal-yellow` | `#FFBD2E` | Traffic light, warnings |
| `--terminal-green` | `#27C93F` | Traffic light, status online |

### Colores Semánticos

| Token | Dark | Light | Uso |
|-------|------|-------|-----|
| `--info` | `#007AFF` | `#007AFF` | Links, focus rings, info |
| `--info-muted` | `#001A3A` | `#D6EAFF` | Backgrounds info |
| `--warning` | `#F59E0B` | `#D97706` | Alertas |
| `--warning-muted` | `#422006` | `#FEF3C7` | Backgrounds warning |
| `--success` | `#22C55E` | `#16A34A` | Confirmaciones |
| `--success-muted` | `#052E16` | `#DCFCE7` | Backgrounds success |
| `--error` | `#EF4444` | `#DC2626` | Errores |
| `--error-muted` | `#450A0A` | `#FEE2E2` | Backgrounds error |

### Sombras

| Token | Definición | Uso |
|-------|-----------|-----|
| `shadow-subtle` | `0 1px 3px` | Inputs, botones |
| `shadow-card` | `0 2px 8px` | Cards por defecto |
| `shadow-card-hover` | `0 4px 16px` | Cards en hover |
| `shadow-elevated` | `0 8px 24px` | Dropdowns, modales |
| `shadow-focus-green` | `0 0 0 3px var(--focus-ring-alpha)` | Focus ring |

Todas las sombras usan `hsl(var(--shadow-color) / calc(var(--shadow-strength) * N))` para adaptarse al tema.

### Focus Ring
- `--focus-ring`: `#007AFF`
- `--focus-ring-alpha`: `rgba(0, 122, 255, 0.25)` (dark) / `rgba(0, 122, 255, 0.2)` (light)

---

## 3. Tipografía

### Font Stacks

| Clase | Stack | Uso |
|-------|-------|-----|
| `font-sans` | `Inter, system-ui, sans-serif` (via `--font-inter`) | Todo el texto por defecto |
| `font-mono` | `JetBrains Mono, SF Mono, Menlo, monospace` | Brand mark, terminales, código |

**Carga**: Inter via `next/font/google` (variable `--font-inter`), JetBrains Mono via Google Fonts `@import` en `globals.css`.

### Pesos Disponibles
- **Inter**: 400, 500, 600, 700, 800
- **JetBrains Mono**: 400, 500, 600, 700

### Escala Tipográfica Custom

| Clase | Tamaño | Line Height | Uso |
|-------|--------|-------------|-----|
| `text-label` | `13px` | `1.4` | Labels, secciones, badges |
| `text-body` | `15px` | `1.7` | Cuerpo de texto principal |

### Escala Hero / Landing (responsive)

| Elemento | Mobile | SM | MD | LG | XL |
|----------|--------|----|----|----|----|
| Hero `LOOMI` | `text-7xl` | `text-8xl` | `text-9xl` | `text-[11rem]` | — |
| Section H2 | `text-5xl` | `text-6xl` | — | `text-7xl` | — |
| CTA heading | `text-5xl` | `text-6xl` | — | `text-7xl` | `text-8xl` |
| Step H3 | `text-3xl` | `text-4xl` | — | `text-5xl` | — |
| Step numbers (deco) | `text-[80px]` | — | — | `text-[120px]` | — |
| Feature numbers (deco) | `text-[120px]` | — | — | `text-[180px]` | — |
| Subtitle | `text-xl` | — | — | `text-2xl` | — |
| Body | `text-sm` | `text-base` | — | — | — |

### Reglas de Uso de `font-mono`

**SI usar `font-mono`:**
- `loomi_` brand mark
- Terminal UI (headers, ventanas de demo)
- Números decorativos grandes (`01`, `02`, `03`)
- Labels técnicos (`generateReasoning()`, `schedule()`, `followUp()`)
- Precios (`$199/mes`)
- Badges de métricas (`+340%`)
- Code snippets
- Prompts y outputs del agente
- Phone numbers en dashboard
- Stat values (counters)

**NO usar `font-mono`:**
- Headings de sección (h2/h3)
- Links de navegación
- Botones CTA
- Nombres de planes
- Subtítulos
- Footer nav
- Body text

### Rendering
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

---

## 4. Sistema de Temas

| Propiedad | Valor |
|-----------|-------|
| Mecanismo | Atributo `data-theme` en `<html>` |
| Default | `"light"` |
| SSR | `<html data-theme="light" suppressHydrationWarning>` |
| Persistencia | `localStorage` key `loomi-theme` |
| Tipos | `'light'` \| `'dark'` |
| Override | `ThemeProvider` acepta `forceTheme` para demo/sandbox |
| Provider | `components/theme-provider.tsx` (único — el viejo `dashboard/ThemeProvider.tsx` fue eliminado) |
| Toggle | `ThemeToggle` component (`components/ui/theme-toggle.tsx`) |

### ThemeToggle
```tsx
// Botón: p-2 rounded-full bg-surface-2 hover:bg-border transition-colors
// Framer Motion: whileHover scale(1.05), whileTap scale(0.95)
// Icono: Sun (light) / Moon (dark), w-5 h-5 text-foreground
// Rotación animada: 0° (light) ↔ 180° (dark), duration 0.3s
```

### Dashboard inline theme toggle
El `DashboardShell` usa un toggle CSS puro sin JavaScript:
```tsx
// [html[data-theme=dark]_&]:block  → muestra Sun en dark mode
// [html[data-theme=dark]_&]:hidden → oculta Moon en dark mode
```

---

## 5. Layout y Espaciado

### Constantes de Layout

| Variable | Valor |
|----------|-------|
| `--sidebar-width` | `240px` |
| `--sidebar-collapsed` | `64px` |
| Max-width landing | `max-w-5xl` / `max-w-6xl` / `max-w-7xl` |
| Section padding vertical | `py-24 sm:py-32` a `py-32 sm:py-48` |
| Horizontal padding | `px-4 sm:px-6` (universal) |
| Content padding (stat cells) | `p-8 lg:p-12` |
| Navbar height | `h-16` (landing) / `h-12` (dashboard top bar) |
| Sidebar collapse key | `localStorage: 'loomi-sidebar-collapsed'` |

### Z-Index Scale

| z-index | Uso |
|---------|-----|
| `z-[100]` | LoadingScreen (splash), PdfExportLoading (capa más alta) |
| `z-[70]` | ClientView/ClientEditor modales internos |
| `z-[60]` | ClientView/ClientEditor panels fullscreen |
| `z-50` | Navbar (landing fixed), Sidebar mobile overlay, modales, CRM toasts |
| `z-40` | ChatBubble (floating widget, expandido y colapsado) |
| `z-20` | Chat layout relative container |
| `z-10` | Sidebar nav icons (relative), sticky table headers, gradient masks |
| `z-0` | Sidebar active item background (motion.div layoutId) |

### Breakpoints (Tailwind defaults)

| Breakpoint | Min-width |
|------------|-----------|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |

### Grid Patterns

| Componente | Grid |
|------------|------|
| Stats | `grid-cols-2 lg:grid-cols-4 gap-px bg-border` |
| Pricing | `grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-border` |
| Use Cases | `grid-cols-1 md:grid-cols-2 xl:grid-cols-4` |
| Testimonials | `grid-cols-1 md:grid-cols-3` |
| Integration logos | `grid-cols-2 md:grid-cols-4` |
| Feature layouts | `grid lg:grid-cols-2 gap-12 lg:gap-20` |
| Video section | `grid lg:grid-cols-3` |
| Dashboard stats | `grid grid-cols-2 lg:grid-cols-4` |
| CRM Kanban | `flex overflow-x-auto`, columns `w-[260px] flex-shrink-0` |
| Conversations | Split panel: left `w-[350px]` list + right flex-1 detail |

### Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-lg` | `0.5rem` | Inputs inline, badges, settings rows |
| `rounded-xl` | `0.75rem` | Cards, inputs principales, botones dashboard |
| `rounded-2xl` | `1rem` | Terminal windows, modales, chat bubbles, pricing grid |
| `rounded-3xl` | `1.5rem` | — |
| `rounded-full` | `9999px` | Dots, avatares, botones pill (shadcn), theme toggle |

---

## 6. Componentes UI

### 6.1 Botones

**Sistema A — shadcn Button** (`components/ui/button.tsx`):
Usado en dashboard. CVA-based, supports `asChild` via Radix Slot.

| Variante | Estilos |
|----------|---------|
| `default` | `bg-primary text-primary-foreground rounded-full h-11 px-6 shadow-soft` |
| `outline` | `border border-border bg-surface hover:bg-surface-2 shadow-subtle` |
| `subtle` | `bg-muted text-muted-foreground hover:bg-muted/70` |
| `ghost` | `hover:bg-muted/80` |
| `link` | `text-primary underline-offset-4 hover:underline` |

Tamaños: `sm` (`h-9 px-4 text-xs`), `default` (`h-11 px-6`), `lg` (`h-12 px-8 text-base`), `icon` (`h-10 w-10`)

**Sistema B — Loomi Button** (`components/ui/button-loomi.tsx`):
Usado en landing. Con Framer Motion. Strips motion-conflicting props.

| Variante | Estilos |
|----------|---------|
| `primary` | `bg-foreground text-background hover:opacity-90 rounded-lg shadow-subtle` + shimmer |
| `secondary` | `bg-transparent border border-border hover:border-border-hover hover:bg-surface-2` |
| `ghost` | `bg-transparent text-muted hover:text-foreground hover:bg-surface-2` |

Tamaños: `sm` (`px-4 py-2.5 text-sm`), `md` (`px-5 py-3 text-sm`), `lg` (`px-7 py-4 text-base`)

Animaciones: `whileHover: scale(1.03)`, `whileTap: scale(0.97)`

Primary shimmer effect:
```tsx
<motion.div
  className="absolute inset-0 bg-gradient-to-r from-transparent via-background/5 to-transparent"
  initial={{ x: '-100%' }}
  whileHover={{ x: '100%' }}
  transition={{ duration: 0.5 }}
/>
```

**Inline CTAs (no-component):**
- Send button: `w-12 h-12 rounded-xl bg-foreground text-background`
- Link CTA: `px-6 py-3 bg-foreground text-background rounded-xl`
- Danger: `px-3 py-1.5 text-xs rounded-xl text-terminal-red bg-terminal-red/10 hover:bg-terminal-red/20`
- Connect: `px-4 py-2 bg-info text-background font-medium rounded-xl hover:bg-info/90 shadow-lg shadow-info/20`

### 6.2 Terminal Window

Patrón reutilizado en: HeroDemo, InteractiveDemo, ChatDemo, ChatBubble, CodeBlock, DashboardPreview.

```tsx
<div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-card">
  {/* Header */}
  <div className="px-4 py-3 border-b border-border bg-surface-2 flex items-center gap-2">
    <div className="flex gap-2">
      <div className="w-3 h-3 rounded-full bg-terminal-red" />
      <div className="w-3 h-3 rounded-full bg-terminal-yellow" />
      <div className="w-3 h-3 rounded-full bg-terminal-green" />
    </div>
    <span className="text-xs text-muted font-mono ml-2">título</span>
  </div>
  {/* Content */}
  <div className="p-5">{children}</div>
</div>
```

### 6.3 Cards

**Elevated Card:**
```
rounded-xl p-6 border border-border bg-surface-elevated shadow-card
hover: shadow-card-hover -translate-y-0.5 border-border-hover
transition: all 0.2s ease
```

Con acento lateral:
```
border-l-[3px] border-l-{info|warning|success|error}
```

**Terminal Card:** Usa el pattern de Terminal Window (dots + header).

**NO usar cards para métricas.** Stats usan grid con `gap-px bg-border`:
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
  <div className="bg-background p-8 lg:p-12 text-center">
    <span className="text-5xl sm:text-6xl font-black text-foreground">{value}</span>
    <p className="text-muted text-sm mt-2">{label}</p>
  </div>
</div>
```

**Use Case Card:**
```tsx
<motion.div
  whileHover={{ y: -5 }}
  className="p-6 rounded-2xl border border-border bg-surface hover:border-border-hover transition-all"
>
  <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-4">
    <Icon className="w-7 h-7 text-foreground" />
  </div>
  <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
  <p className="text-muted text-sm mb-4">{description}</p>
  <div className="font-mono text-terminal-green text-sm font-semibold">{metric}</div>
</motion.div>
```

### 6.4 Badges

Component: `components/ui/badge.tsx`

Base: `inline-flex items-center gap-1.5 px-3 py-1.5 text-label font-medium rounded-lg`

| Variante | Estilos |
|----------|---------|
| `default` | `bg-surface-2 text-muted border border-border` |
| `terminal` | `bg-surface-2 text-foreground border border-border` |
| `outline` | `border border-border text-muted` |
| `success` | `bg-success-muted text-success border border-success/20` |
| `info` | `bg-info-muted text-info border border-info/20` |
| `warning` | `bg-warning-muted text-warning border border-warning/20` |
| `error` | `bg-error-muted text-error border border-error/20` |

### 6.5 Inputs

**Input principal** (`components/ui/input.tsx`):
```
h-12 w-full rounded-xl border border-border bg-surface px-4
text-body text-foreground placeholder:text-muted
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info/30 focus-visible:border-info/50
shadow-subtle transition
disabled:cursor-not-allowed disabled:opacity-50
```

**Input inline (settings):**
```
px-3 py-1.5 text-sm bg-background border border-border rounded-lg font-mono
focus:outline-none focus:border-foreground/30 transition-colors
```

**Select:**
```
px-2 py-1.5 text-sm bg-background border border-border rounded-lg font-mono
```

**Textarea (prompts):**
```
min-h-[200px] w-full rounded-xl border border-border bg-surface px-4 py-3
text-body text-foreground font-mono placeholder:text-muted
focus-visible:ring-2 focus-visible:ring-info/30
```

### 6.6 Message Bubbles

| Tipo | Estilos |
|------|---------|
| Usuario | `bg-foreground text-background max-w-[80%] px-4 py-2 rounded-2xl text-sm` (alineado derecha) |
| Agente | `bg-surface-2 border border-border text-foreground max-w-[80%] px-4 py-2 rounded-2xl text-sm` (alineado izquierda) |
| System | `text-center text-xs text-muted py-2` |

**Typing indicator (3 dots):**
```tsx
<div className="flex gap-1">
  {[0, 0.2, 0.4].map((delay) => (
    <motion.div
      className="w-2 h-2 rounded-full bg-terminal-green"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity, delay }}
    />
  ))}
</div>
```

### 6.7 Dropdown Menu

```
Content: rounded-2xl bg-surface border border-border backdrop-blur-lg shadow-elevated
Items: rounded-xl, hover:bg-surface-2
Separator: border-t border-border my-1
```

### 6.8 Tabla

```tsx
// Container: overflow-x-auto
// Table: w-full
// TableHead: sticky top-0 bg-surface-2 z-10
// th: text-label font-medium uppercase tracking-wider text-muted px-4 py-3 text-left
// tr: border-b border-border even:bg-surface/50
// td: px-4 py-3 text-sm
```

### 6.9 Avatar

```
rounded-full bg-surface-2 border border-border flex items-center justify-center
text-xs font-medium text-foreground
Tamaños: w-8 h-8 (sidebar), w-10 h-10 (standard)
Fallback: primera letra del nombre
```

### 6.10 Scroll Area

Custom scrollbar (global en `globals.css`):
```css
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--background); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--muted); }
/* Firefox */
* { scrollbar-width: thin; scrollbar-color: var(--border) var(--background); }
```

### 6.11 Modales

No hay componente `Dialog` reutilizable. Los modales se construyen inline:

```tsx
// Backdrop
<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
  {/* Modal */}
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="bg-background border border-border rounded-2xl shadow-elevated max-w-lg w-full max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <button className="text-muted hover:text-foreground"><X /></button>
      </div>
      {/* Body */}
      <div className="p-6">{children}</div>
    </div>
  </div>
</div>
```

**LeadDetailModal** (`components/dashboard/crm/LeadDetailModal.tsx`):
- 3 vistas: default (historial de mensajes), edit (formulario), delete (confirmación roja)
- Header con nombre + stage badge + edit/delete/close botones
- `max-w-2xl`, `max-h-[80vh] overflow-y-auto`

### 6.12 Loading States

**LoadingScreen** (`components/ui/loading-screen.tsx`) — Solo en landing:
- `fixed inset-0 z-[100] bg-background` — la capa más alta
- Terminal animation: `$ initializing loomi...` → `$ loading ai agent...` → `✓ ready`
- Cursor blink animación
- Auto-dismiss después de 2000ms con fade-out
- `AnimatePresence` para exit animation

**PdfExportLoading** (`components/ui/pdf-export-loading.tsx`):
- `fixed inset-0 z-[100] bg-black/70`
- Spinner: `animate-spin rounded-full h-12 w-12 border-b-2 border-info`
- Mensaje dinámico

**Inline loading (chat):**
```tsx
<div className="flex gap-1 px-4 py-2">
  {[0, 0.2, 0.4].map(delay => (
    <motion.div className="w-2 h-2 rounded-full bg-terminal-green"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity, delay }} />
  ))}
</div>
```

**Analysis steps (InteractiveDemo):**
```tsx
// 4 steps con iconos: Brain → Heart → TrendingUp → Sparkles
// Cada step: delay * index, stagger 0.3s
// Active: text-foreground scale-110
// Inactive: text-muted opacity-50
// Container: rounded-xl bg-surface border border-border p-3
```

---

## 7. Navegación

### Landing Navbar (`components/loomi/Navbar.tsx`)

- Fixed top, `z-50`
- Max-width: `max-w-6xl mx-auto px-4 sm:px-6`
- Height: `h-16`
- **Sin scroll**: `bg-transparent`
- **Con scroll** (>50px): `bg-background/95 backdrop-blur-xl border-b border-border`
- Entrada: `motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}`

**Nav links:**
```
features  → #features    (capitalizado en UI)
proceso   → #how-it-works
precios   → #pricing
```

Link hover pattern:
```tsx
<Link className="relative text-muted hover:text-foreground transition-colors text-sm group">
  {label}
  <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
</Link>
```

**Desktop CTA (right side):**
```
ThemeToggle | Login (secondary sm) | Demo (primary sm + MessageCircle icon)
```

**Mobile menu:**
- Toggle: `Menu` / `X` icons, `p-2 text-foreground`
- Container: `AnimatePresence` → `motion.div` con `opacity: 0→1, height: 0→auto`
- Background: `bg-surface border-t border-border`
- Links apilados + botones full-width al final

### Dashboard Sidebar (`components/dashboard/Sidebar.tsx`)

**Desktop:**
- `hidden md:flex`, `sticky top-0`, `h-screen`
- `bg-background border-r border-border`
- Width: `240px` expandido / `64px` colapsado
- Collapse toggle: `PanelLeftClose` / `PanelLeft` icon
- Persistencia: `localStorage: 'loomi-sidebar-collapsed'`

**Mobile:**
- `fixed top-0 left-0 z-50 h-full w-[240px]`
- Backdrop: `fixed inset-0 z-50 bg-background/80 backdrop-blur-sm`
- Animation: `x: -280 → 0`, spring `stiffness: 400, damping: 30`

**Header (h-14):**
```
px-4 border-b border-border
Traffic dots (w-2.5 h-2.5) + "loomi_" (font-mono font-semibold text-sm)
Collapsed: solo dots (w-2 h-2)
```

**Secciones de navegación:**

| Sección | Items |
|---------|-------|
| — (standalone) | Home (`/dashboard`, LayoutDashboard) |
| **Monitorear** | Pipeline (Kanban), Inbox (MessageSquare), Broadcasts (Send) |
| **Configurar** | Setup (Settings2), Prompt (FileText), Knowledge (BookOpen), Integraciones (Plug) |
| **Configuración** | Analytics (BarChart3), WhatsApp (Phone), Settings (Settings) |

Section labels: `text-[11px] uppercase tracking-widest text-muted px-3 mb-2`

**Active item:**
```tsx
// Background: motion.div con layoutId="sidebar-active"
//   className="absolute inset-0 bg-surface-2 rounded-xl"
//   transition={{ type: 'spring', stiffness: 500, damping: 30 }}
// Icon + label: relative z-10 text-foreground font-medium
// Inactive: text-muted hover:text-foreground hover:bg-surface
```

**WhatsApp status (bottom):**
```
w-2 h-2 rounded-full bg-terminal-green (online) / bg-terminal-yellow (offline)
Label: text-xs text-muted "Conectado" / "Offline"
```

**User section (bottom):**
```
Avatar: w-8 h-8 rounded-full bg-surface-2 border border-border (initial letter)
Name: text-sm font-medium text-foreground (truncated)
Logout: LogOut icon, text-muted hover:text-terminal-red
```

### Dashboard Top Bar (inline en `DashboardShell.tsx`)

```
h-12 border-b border-border bg-background px-4 md:px-6
flex items-center justify-between
```

**Left:**
- Mobile: hamburger button `md:hidden` que abre sidebar
- Breadcrumb: `text-sm font-medium text-foreground`

**Right:**
- Connection badge: `text-terminal-green bg-terminal-green/10` o `text-terminal-yellow bg-terminal-yellow/10`
  - Dot: `w-1.5 h-1.5 rounded-full`
  - Text: `text-xs font-medium`
- Theme toggle: Sun/Moon swap via CSS selector
- Meta badge: `px-2 py-1 rounded-md border border-border bg-surface` + meta-logo.png + "Tech Provider" `text-muted text-xs`

**Breadcrumb map:**
```
/dashboard                    → 'Overview'
/dashboard/crm                → 'Pipeline'
/dashboard/conversations      → 'Inbox'
/broadcasts                   → 'Broadcasts'
/dashboard/agent/setup        → 'Agente / Setup'
/dashboard/agent/prompt       → 'Agente / Prompt'
/dashboard/agent/knowledge    → 'Agente / Knowledge'
/dashboard/agent/tools        → 'Agente / Integraciones'
/dashboard/analytics          → 'Analytics'
/dashboard/settings           → 'Settings'
/dashboard/connect            → 'Conexión WhatsApp'
```

---

## 8. Arquitectura de la Landing Page

### Composición (`app/page.tsx`)

```tsx
<main className="min-h-screen bg-background">
  <LoadingScreen />     {/* z-[100], 2s splash, terminal animation */}
  <Navbar />            {/* z-50, fixed top */}
  <Hero />
  <SectionDivider />
  <Stats />
  <SectionDivider />
  <HowItWorks />
  <SectionDivider />
  <InteractiveDemo />
  <SectionDivider />
  <DashboardPreview />
  <SectionDivider />
  <UseCases />
  <SectionDivider />
  <MetaLoop />
  <SectionDivider />
  <Integrations />
  <SectionDivider />
  <Pricing />
  <SectionDivider />
  <Testimonials />
  <SectionDivider />
  <CTA />
  <Footer />
</main>
```

**SectionDivider:**
```tsx
<div className="max-w-5xl mx-auto px-4">
  <div className="border-t border-dashed border-border" />
</div>
```

### Secciones en detalle

**Hero** (`components/loomi/Hero.tsx`):
- Background: subtle grid pattern `opacity-[0.03]`, 60x60px lines using `var(--foreground)`
- Fade masks: gradient top/bottom `from-background`
- Floating dots: `bg-foreground/5 rounded-full`, animated `y: [0,-20,0]`, various sizes 3-8px
- Title: `text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black tracking-tighter`
- Cursor `_`: `animate-blink text-terminal-green`
- Subtitle: `text-xl lg:text-2xl text-muted max-w-2xl mx-auto`
- CTAs: primary `text-lg px-8 py-6 rounded-xl` + secondary same size
- Meta badge: `px-4 py-2 rounded-full bg-surface border border-border`
- Trust line: `text-muted text-sm`
- Includes `<HeroDemo>` — terminal window with WhatsApp chat preview (static messages + typing indicator)

**Stats** (`components/loomi/stats.tsx`):
- Grid: `grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden`
- Cell: `bg-background p-8 lg:p-12 text-center`
- Value: `text-5xl sm:text-6xl font-black text-foreground` (AnimatedCounter)
- Suffix: `text-foreground` (inline with value)
- Label: `text-muted text-sm mt-2`

**HowItWorks** (`components/loomi/how-it-works.tsx`):
- 4 steps: "Lead escribe" → "Loomi responde" → "Agenda demo" → "Tú cierras"
- Layout: `space-y-32 sm:space-y-48`
- Each step: scroll-driven opacity/x animation via `useScroll` + `useTransform`
- Number: `text-[80px] lg:text-[120px] font-black text-surface-2 font-mono leading-none`
- Title: `text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground`
- Description: `text-xl text-muted max-w-lg`

**InteractiveDemo** (`components/loomi/interactive-demo.tsx`):
- Live AI chat calling `/api/demo/chat` (gpt-4o-mini)
- Voice synthesis via `/api/voice/generate` (toggle sound on/off)
- Analysis steps animation: Brain → Heart → TrendingUp → Sparkles (staggered entry)
- 6 quick-prompt buttons: precio, info, objection, competitor, skeptic, calendar
- Schedule slot display when agent suggests appointment
- Agent info badges: `px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs`
- Rate limiting: 10 msg/min (visual countdown)

**DashboardPreview** (`components/loomi/dashboard-preview.tsx`):
- Tabbed mockup: CRM / Inbox / Agente (3 tabs)
- Tab: `px-4 py-2 text-sm` — active: `bg-surface-2 text-foreground` — inactive: `text-muted`
- CRM tab: mockup Kanban columns (Cold/Warm/Hot) con lead cards
- Inbox tab: conversation list mockup
- Agente tab: system prompt area + configuration toggles

**UseCases** (`components/loomi/use-cases.tsx`):
- 4 industry cards: SaaS, Ecommerce, Clínicas, Consultoras
- Grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4`
- Card: `p-6 rounded-2xl border border-border bg-surface hover:border-border-hover`
- Icon box: `w-14 h-14 rounded-2xl bg-surface-2 border border-border`
- Metric: `font-mono text-terminal-green text-sm font-semibold`
- Hover: `whileHover={{ y: -5 }}`

**MetaLoop** (`components/loomi/meta-loop.tsx`):
- 4-step scroll: problem → Loomi reports → Meta learns → CPL drops (-32%)
- Scroll-driven animations like HowItWorks
- Step numbers: large mono decorative

**Integrations** (`components/loomi/integrations.tsx`):
- 8 logos: WhatsApp, Claude, Cal.com, HubSpot, Supabase, Vercel, Stripe, Slack
- Grid: `grid-cols-2 md:grid-cols-4 gap-4`
- Card: `p-6 rounded-2xl border border-border bg-surface flex flex-col items-center gap-3`
- Inline SVG icons (custom, not lucide)
- Hover: `whileHover={{ scale: 1.15, y: -5 }}`
- Default: grayscale, hover: full color + tooltip

**Pricing** (`components/loomi/Pricing.tsx`):
- Monthly/Yearly toggle: `rounded-full bg-surface p-1 border border-border`
  - Active tab: `bg-foreground text-background rounded-full`
  - Inactive: `text-muted`
  - Yearly badge: `bg-terminal-green/10 text-terminal-green text-xs font-mono rounded-full`
- Grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden`
- Plan cell: `bg-background p-8`
- **Highlighted plan (Growth):** `bg-foreground text-background` (inversión total de colores)
  - Features check: `text-background` en vez de `text-foreground`
  - Price: same `font-mono` but inverted colors
- "Popular" badge: `bg-terminal-green text-background text-xs font-mono px-2 py-0.5 rounded-full`
- Price: `text-5xl font-black font-mono`
- Features: check icon + text, `text-muted` (normal) o `text-background/70` (highlighted)
- CTA: `bg-foreground text-background` (normal) o `bg-background text-foreground` (highlighted)
- Trial: "14 días gratis · sin tarjeta"

**Testimonials** (`components/loomi/Testimonials.tsx`):
- 3 cards: grid `md:grid-cols-3 gap-6`
- Card: `p-6 rounded-2xl border border-border bg-surface relative`
- Speech bubble tail: pseudo-element triangle
- Metric badge: `font-mono font-bold text-sm` with color per testimonial
- Author: name bold + role muted
- Stagger: `delay: index * 0.15`

**CTA** (`components/loomi/cta.tsx`):
- Heading: `text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground`
- Subtitle: `text-xl text-muted`
- Two buttons: "Empezar gratis" (primary lg) + "WhatsApp" (secondary lg + WhatsApp SVG)

**Footer** (`components/loomi/Footer.tsx`):
- `py-16 border-t border-border bg-background`
- Grid: brand left + nav links center + Meta badge right
- Brand: traffic dots + `loomi_` + social icons (WhatsApp SVG, LinkedIn, Instagram)
- Social icons: `w-10 h-10 rounded-xl bg-surface border border-border hover:bg-surface-2`
- Nav: `text-muted hover:text-foreground text-sm`
- Bottom: `text-muted text-sm` — "made with" + animated heart `scale: [1, 1.2, 1]` + "in méxico"
- Copyright: `text-muted/50 text-xs font-mono`

---

## 9. Arquitectura del Dashboard

### Layout (`app/dashboard/layout.tsx`)

```
Server component → auth check → fetch tenant data → DashboardLayoutClient (client boundary)
  → DashboardShell (sidebar + top bar + main)
    → {children} (page content)
```

### Páginas del Dashboard

**Overview** (`/dashboard`):
- Stats: totalLeads, activeConversations, warmLeads, hotLeads
- Quick links to CRM, conversations
- WhatsApp connection status card

**Pipeline / CRM** (`/dashboard/crm`):
- `CRMView`: search + stats bar + KanbanBoard
- Stats bar inline: `pipeline value | won value | conversion %` con separadores `|`
- KanbanBoard: `@dnd-kit/core` drag-and-drop
- Columns: `w-[260px] flex-shrink-0`, colored header dot per stage
- LeadCard: `@dnd-kit/sortable`, draggable, shows name + deal value (font-mono) + time
- DragOverlay: card rotated slightly during drag
- LeadDetailModal: view messages, edit fields, delete with confirmation
- Realtime: Supabase subscription on `leads` table (INSERT/UPDATE/DELETE)
- CSV export per column
- Classify leads button (POST `/api/leads/classify`)

**Inbox** (`/dashboard/conversations`):
- Split panel: conversation list (left 350px) + detail (right flex-1)
- Filter tabs: todas / hot / warm / cold
- Realtime: subscriptions on `messages`, `conversations`, `handoffs`
- Handoff alerts: dismissable banners with priority colors
- ConversationDetailView: message history + manual reply + attachment support (16MB max)
- Bot pause/resume toggle
- Side panel: lead info (email, company, industry, summary)
- Stats inline: `total chats | active today | total msgs`

**Analytics** (`/dashboard/analytics`):
- 14 parallel Supabase queries
- StatCard grid: total leads, qualified, response rate, citas, conversations, messages
- Lead Quality: progress bars
- Leads por Etapa: horizontal bar chart per stage
- Embudo de Conversión: funnel 4 steps + deal value
- Meta CAPI: status counts + events table
- Service Windows: active windows + savings rate

**Settings** (`/dashboard/settings`):
- Sections: cuenta, plan, whatsapp, equipo, zona de peligro
- Section header pattern: `text-label font-medium uppercase tracking-wider border-l-2 border-l-info pl-3`
- Danger zone: `border-l-error text-terminal-red`
- Row pattern: `flex items-center justify-between py-3 border-b border-border`
- Team: invite form (email + role select + button) + member list with remove
- Role badges: owner=`text-terminal-green`, admin=`text-terminal-yellow`, member=`text-muted`

---

## 10. Chat Bubble Global (`components/loomi/chat-bubble.tsx`)

Renderizado en **todas** las páginas via `app/layout.tsx`.

**Collapsed state:**
```tsx
<button className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-foreground text-background shadow-elevated">
  <MessageCircle className="w-6 h-6" />
  {/* Pulsing green dot */}
  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-terminal-green animate-pulse border-2 border-background" />
</button>
```

**Expanded state:**
```
fixed bottom-6 right-6 z-40 w-80 sm:w-96 h-[28rem]
rounded-2xl border border-border bg-surface shadow-elevated overflow-hidden
```

- Terminal header: traffic dots + `loomi_chat` font-mono
- Chat area: messages + typing indicator
- Input: `bg-background border-t border-border`
- Footer link: "Contactar a un humano" → WhatsApp API link
- Calls `/api/demo/chat` (gpt-4o-mini, fast responses)

---

## 11. Status Indicators

### Connection Dots

| Contexto | Tamaño | Color |
|----------|--------|-------|
| Topbar | `w-1.5 h-1.5` | `bg-terminal-green` / `bg-terminal-yellow` |
| Sidebar | `w-2 h-2` | `bg-terminal-green` / `bg-terminal-yellow` |
| Terminal dots | `w-3 h-3` | red/yellow/green |
| ChatBubble pulse | `w-3.5 h-3.5` | `bg-terminal-green animate-pulse` |

### Status Badges

| Estado | Estilos |
|--------|---------|
| Connected | `text-terminal-green bg-terminal-green/10 px-2 py-1 rounded-md text-xs font-medium` |
| Disconnected | `text-terminal-yellow bg-terminal-yellow/10 px-2 py-1 rounded-md text-xs` |

### ConnectionStatus Component (`components/dashboard/ConnectionStatus.tsx`)
Card grande para la página de WhatsApp:
- Connected: `bg-info/10 border-info/20` + glow blur + pulsing dot
- Disconnected: `bg-warning-muted border-warning/20` + "Conectar" button `bg-info text-background`

### Lead Stage Badges

| Stage | Background | Color |
|-------|-----------|-------|
| Cold | `bg-info/10` | `text-info` |
| Warm | `bg-terminal-yellow/10` | `text-terminal-yellow` |
| Hot | `bg-warning/10` | `text-warning` |
| Ganado | `bg-terminal-green/10` | `text-terminal-green` |
| Perdido | `bg-surface-2` | `text-muted` |

### Role Badges

| Rol | Color |
|-----|-------|
| Owner | `text-terminal-green font-mono text-xs` |
| Admin | `text-terminal-yellow font-mono text-xs` |
| Member | `text-muted font-mono text-xs` |

### Priority Indicators (CRM)

| Priority | Color |
|----------|-------|
| High | `text-terminal-red` / `bg-terminal-red/10` |
| Medium | `text-terminal-yellow` / `bg-terminal-yellow/10` |
| Low | `text-muted` / `bg-surface-2` |

### Handoff Alert Banners (Conversations)

| Priority | Estilos |
|----------|---------|
| Critical | `border-l-4 border-l-error bg-error-muted` |
| Urgent | `border-l-4 border-l-warning bg-warning-muted` |
| Normal | `border-l-4 border-l-info bg-info-muted` |

### Live Indicator
```tsx
<div className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
<span className="text-xs text-muted font-mono">live</span>
```

---

## 12. Animaciones

### CSS Keyframe Animations

| Clase | Keyframes | Duración | Uso |
|-------|-----------|----------|-----|
| `animate-blink` | opacity 1 → 0 step-end | `1s infinite` | Cursor `_` del logo |
| `animate-float` | translateY 0 → -10px → 0 | `6s ease-in-out infinite` | Elementos flotantes hero |
| `animate-marquee` | translateX 0% → -50% | `30s linear infinite` | Carrusel logos |
| `animate-marquee-reverse` | translateX -50% → 0% | `30s linear infinite` | Carrusel logos reverso |
| `animate-pulse-subtle` | opacity 1 → 0.5 → 1 | `2s ease-in-out infinite` | Indicadores sutiles |
| `animate-spin-slow` | rotate 0 → 360 | `8s linear infinite` | Elementos giratorios |

### Framer Motion Patterns

**FadeIn component** (`components/ui/fade-in.tsx`):
```ts
// Directions: up(y:40), down(y:-40), left(x:40), right(x:-40), none({})
initial: { opacity: 0, ...direction }
whileInView: { opacity: 1, x: 0, y: 0 }
viewport: { once: true, margin: '-80px' }
transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }
```

**Entrada en viewport (estándar):**
```ts
initial: { opacity: 0, y: 30 }
whileInView: { opacity: 1, y: 0 }
viewport: { once: true }
```

**Stagger children:**
```ts
transition: { delay: index * 0.1 }  // default
transition: { delay: index * 0.15 } // testimonials
transition: { delay: index * 0.3 }  // analysis steps
```

**Hero title:**
```ts
initial: { opacity: 0, scale: 0.9 }
animate: { opacity: 1, scale: 1 }
transition: { delay: 0.4, duration: 0.8, ease: 'easeOut' }
```

**Navbar:**
```ts
initial: { y: -100 }
animate: { y: 0 }
transition: { duration: 0.5 }
```

**Sidebar mobile:**
```ts
initial: { x: -280 }
animate: { x: 0 }
exit: { x: -280 }
transition: { type: 'spring', stiffness: 400, damping: 30 }
```

**Sidebar active indicator:**
```ts
layoutId="sidebar-active"
transition: { type: 'spring', stiffness: 500, damping: 30 }
```

**Botones Loomi:**
```ts
whileHover: { scale: 1.03 }
whileTap: { scale: 0.97 }
```

**Theme toggle:**
```ts
whileHover: { scale: 1.05 }
whileTap: { scale: 0.95 }
// Icon rotation: animate={{ rotate: theme === 'dark' ? 180 : 0 }}
```

**Pricing card hover:**
```ts
whileHover: { scale: 1.02 }
```

**Integration logo hover:**
```ts
whileHover: { scale: 1.15, y: -5 }
```

**Use case card hover:**
```ts
whileHover: { y: -5 }
```

**Scroll-driven animations (Features, HowItWorks, MetaLoop):**
```ts
const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
// Opacity reveal
useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
// Slide horizontal (alternating left/right per item)
useTransform(scrollYProgress, [0, 0.5], [index % 2 === 0 ? -100 : 100, 0])
```

**Typing dots (chat):**
```ts
animate: { opacity: [0.3, 1, 0.3] }
transition: { duration: 1, repeat: Infinity, delay: 0 / 0.2 / 0.4 }
```

**Footer heart:**
```ts
animate: { scale: [1, 1.2, 1] }
transition: { duration: 1, repeat: Infinity }
```

**ConnectionStatus glow:**
```ts
animate: { boxShadow: ['0 0 0px var(--focus-ring-alpha)', '0 0 15px var(--focus-ring-alpha)', '0 0 0px var(--focus-ring-alpha)'] }
transition: { duration: 2, repeat: Infinity }
```

**Mobile menu:**
```ts
initial: { opacity: 0, height: 0 }
animate: { opacity: 1, height: 'auto' }
exit: { opacity: 0, height: 0 }
```

**Floating dots (Hero background):**
```ts
animate: { y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }
transition: { duration: 4-8, repeat: Infinity, ease: 'easeInOut' }
```

### CSS Utility Animations

| Clase | Efecto |
|-------|--------|
| `.hover-lift` | `transform: translateY(-2px)` en hover |
| `.press-effect:active` | `transform: scale(0.98)` |
| `.paused` | `animation-play-state: paused !important` |

### Marquee Component (`components/loomi/marquee.tsx`)
```tsx
// Wrapper: overflow-hidden, group (for pause on hover)
// Inner: flex gap-4, animate-marquee / animate-marquee-reverse
// Pause: group-hover:paused (via .paused utility)
// Speed: prop controls animation-duration override
```

---

## 13. Patrones de Sección

### Section Header (landing)
```tsx
<p className="text-muted text-sm mb-6">{label}</p>
<h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground">
  {título}
</h2>
<p className="text-xl lg:text-2xl text-muted max-w-2xl mx-auto mt-6">{subtitle}</p>
```

### Feature Row (alternating layout)
```tsx
// Container: min-h-[50vh] border-b border-border/30
// Grid: lg:grid-cols-2 gap-12 lg:gap-20
// Even rows: content left, visual right
// Odd rows: content right, visual left (lg:order-2)
// Decorative number: text-[120px] lg:text-[180px] font-black text-surface-2 font-mono
// Tech label: text-muted font-mono text-sm mb-2 (e.g., "generateReasoning()")
// Title: text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground
```

### Section Divider
```tsx
<div className="max-w-5xl mx-auto px-4">
  <div className="border-t border-dashed border-border" />
</div>
```

### Settings Section Header (dashboard)
```tsx
<h2 className="text-label font-medium uppercase tracking-wider mb-4 text-muted border-l-2 border-l-info pl-3">
  sección
</h2>
// Danger zone:
<h2 className="text-label font-medium uppercase tracking-wider mb-4 text-terminal-red border-l-2 border-l-error pl-3">
  zona de peligro
</h2>
```

### Settings Row
```tsx
<div className="flex items-center justify-between py-3 border-b border-border hover:bg-surface/50 rounded-lg px-2 -mx-2 transition-colors">
  <span className="text-sm text-muted">{label}</span>
  <span className="text-sm text-foreground font-medium">{value}</span>
</div>
```

### Dashboard Stats Inline
```tsx
<div className="flex items-center gap-4 text-sm text-muted">
  <span>Pipeline: <span className="text-foreground font-mono font-medium">${value}</span></span>
  <span className="text-border">|</span>
  <span>Won: <span className="text-terminal-green font-mono font-medium">${value}</span></span>
  <span className="text-border">|</span>
  <span>Conv: <span className="text-foreground font-mono font-medium">{value}%</span></span>
</div>
```

### Pricing Grid
```
grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden
Plan normal: bg-background p-8
Plan destacado: bg-foreground text-background p-8 (inversión total)
```

---

## 14. Realtime Patterns (Supabase)

El dashboard usa Supabase Realtime en múltiples vistas:

| Vista | Canal | Tabla | Eventos | Filtro |
|-------|-------|-------|---------|--------|
| CRM | `leads-realtime` | `leads` | INSERT, UPDATE, DELETE | `tenant_id=eq.{id}` |
| Conversations | `messages-realtime` | `messages` | INSERT | — |
| Conversations | `conversations-realtime` | `conversations` | INSERT | — |
| Conversations | `handoffs-realtime` | `handoffs` | INSERT | `tenant_id=eq.{id}` |
| ConversationDetail | `messages:{conversationId}` | `messages` | INSERT | `conversation_id=eq.{id}` |

Pattern:
```tsx
useEffect(() => {
  const channel = supabase.channel('channel-name')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tableName', filter: '...' },
      (payload) => { /* update state */ })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}, []);
```

---

## 15. Utility Classes Custom

| Clase | Propiedades |
|-------|-------------|
| `.text-balance` | `text-wrap: balance` |
| `.text-readable` | `font-family: 'Inter', system-ui, sans-serif` |
| `.focus-adhd` | `outline: 2px solid var(--focus-ring); box-shadow: 0 0 0 4px var(--focus-ring-alpha)` |
| `.glass` | `backdrop-filter: blur(20px); background: color-mix(in srgb, var(--surface) 80%, transparent); border: 1px solid var(--border)` |
| `.card-elevated` | `bg-surface-elevated, border, rounded-0.75rem, shadow multi-layer, hover translateY(-1px)` |
| `.accent-left-info` | `border-left: 3px solid var(--info)` |
| `.accent-left-warning` | `border-left: 3px solid var(--warning)` |
| `.accent-left-success` | `border-left: 3px solid var(--success)` |
| `.accent-left-error` | `border-left: 3px solid var(--error)` |
| `.tabular-nums` | `font-variant-numeric: tabular-nums` |

---

## 16. Iconografía

**Librería principal**: `lucide-react`

**Navegación:**
```
LayoutDashboard (Home), Kanban (Pipeline), MessageSquare (Inbox),
Send (Broadcasts), Settings2 (Setup), FileText (Prompt),
BookOpen (Knowledge), Plug (Integraciones), BarChart3 (Analytics),
Phone (WhatsApp), Settings (Settings), LogOut
```

**UI:**
```
PanelLeftClose, PanelLeft (sidebar toggle), X, Menu (mobile),
Sun, Moon (theme), MessageCircle (chat), ArrowRight, ChevronDown,
MoreHorizontal (card actions), Trash2 (delete), Edit3 (edit),
Search (search inputs), Plus (add), Download (export)
```

**Features / Landing:**
```
Brain (reasoning), Calendar (scheduling), RefreshCw (follow-up),
Target (pipeline), Users (team), TrendingUp (growth),
Check (checkmarks), Zap (speed), Sparkles (AI),
UserCheck (qualified), CreditCard (billing), Shield (security),
Volume2, VolumeX (voice toggle), Linkedin, Instagram
```

**WhatsApp**: SVG inline custom (no de lucide) — path completo del logo oficial.

---

## 17. Assets Públicos

### Estructura `/public/`

```
public/
├── assets/
│   ├── loomi/           # Mockups de chat WhatsApp, teclado iPhone, SVGs de bubbles
│   └── icons/           # Logos de clientes (databricks, firebase, supabase, syntra)
├── logos/               # 30+ logos de integraciones tech
│   ├── meta-logo.png    # Usado como badge "Meta Tech Provider" (opacity-50 en topbar)
│   ├── whatsapp.svg
│   ├── stripe.svg
│   └── ...
├── images/              # Fotos equipo (carlos.jpg, juan.jpg, victor.jpeg)
├── carousel-slides/     # 01-hook.png → 08-cta.png (carrusel social media)
└── investors/           # PDFs data room (business-plan, pitch-deck, etc.)
```

**Nota**: No existe `favicon.ico`, `apple-touch-icon`, ni OG image en `/public/`.

---

## 18. SEO y Metadata

```ts
// Root layout
title: 'Loomi | El agente de ventas que nunca duerme'
description: 'Arquitectura serverless con razonamiento chain-of-thought...'
keywords: ['WhatsApp bot', 'sales agent', 'AI', 'automation', 'Claude', 'lead qualification']
authors: [{ name: 'Loomi' }]
openGraph: {
  title: 'Loomi | El agente de ventas que nunca duerme',
  description: 'Arquitectura serverless con razonamiento chain-of-thought y memoria contextual.',
  type: 'website'
}

// Privacy
title: 'Privacy Policy - Loomi by Anthana'

// Terms
title: 'Terms of Service - Loomi by Anthana'

// Investors layout
title: 'Loomi by Anthana | Investor Data Room'
description: 'Virtual Data Room for Loomi by Anthana...'
```

Idioma: `<html lang="es">`

---

## 19. Precios

| Plan | Mensual | Anual (20% dto) |
|------|---------|-----------------|
| Starter | $199/mes | $159/mes |
| Growth (popular) | $349/mes | $279/mes |
| Business | $599/mes | $479/mes |
| Enterprise | custom | custom |

Trial: "14 días gratis · sin tarjeta"

Monthly/Yearly toggle: `rounded-full bg-surface p-1 border border-border`

---

## 20. Componentes Landing (inventario completo)

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| `Navbar.tsx` | 134 | Fixed nav, scroll-aware bg, mobile menu |
| `Hero.tsx` | 239 | Grid bg, floating dots, LOOMI_ title, HeroDemo terminal |
| `stats.tsx` | 45 | 4-stat grid con AnimatedCounter |
| `how-it-works.tsx` | 103 | 4-step scroll process, large mono numbers |
| `interactive-demo.tsx` | 475 | Live AI chat + voice + analysis steps + quick prompts |
| `dashboard-preview.tsx` | 229 | Tabbed mockup (CRM/Inbox/Agente) |
| `use-cases.tsx` | 81 | 4 industry cards grid |
| `meta-loop.tsx` | 102 | 4-step Meta CAPI loop |
| `integrations.tsx` | 147 | 8 integration logos con inline SVGs |
| `Pricing.tsx` | 177 | 4 plans, monthly/yearly toggle |
| `Testimonials.tsx` | 95 | 3 speech bubbles con metric badges |
| `cta.tsx` | 59 | Final CTA: heading + 2 buttons |
| `Footer.tsx` | 76 | Brand, social links, nav, copyright |
| `chat-bubble.tsx` | 210 | Global floating chat widget |
| `logos.tsx` | 62 | Scrolling marquee tech logos |
| `marquee.tsx` | 28 | Reusable marquee wrapper |
| `bento-features.tsx` | 339 | Cinematic scroll features (alternative to Features.tsx) |
| `Features.tsx` | 167 | Cinematic scroll feature rows |
| `comparison.tsx` | 128 | Chatbot vs Loomi table |
| `knowledge-features.tsx` | 211 | Knowledge base features + architecture diagram |
| `tech-provider.tsx` | 374 | Tech stack showcase + code editor |
| `tech-stack.tsx` | 120 | Legacy tech cards (⚠ uses hardcoded white bg) |
| `video-section.tsx` | 382 | ROI calculator + before/after + slot counter |
| `chat-demo.tsx` | 267 | Sandbox chat demo (/api/sandbox/chat) |
