/**
 * La portada en el sistema «terminal impresa en papel» (DESIGN_SYSTEM.md).
 *
 * Componentes de servidor: cero JavaScript propio. El copy es el mismo de
 * siempre y sale de `es.home` (lib/i18n/es.ts): aquí solo cambia el acomodo.
 * Nada de clientes, logos ni cifras de negocio inventadas: los paneles CLI y
 * las mini-UI son EJEMPLOS del sistema y lo dicen.
 *
 * Orden: héroe asimétrico de 3 zonas → panel CLI → el problema (2×2) → el
 * motor (3-up con mini-UI) → de la conversación al dato (2-up) → se prueba
 * (CLI + tarjeta invertida) → para quién sí / no → preguntas → cierre.
 */
import Link from 'next/link';
import { es } from '@/lib/i18n';
import { CTA_PROYECTO } from '@/lib/cta';
import { Logo } from '@/components/shared/Logo';
import { Rich } from './Rich';

const h = es.home;

export function Wrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-6 lg:px-12 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return <p className={`eyebrow mb-3 ${muted ? 'eyebrow-muted' : ''}`}>{children}</p>;
}

/** Quita el `_` de los rótulos viejos («el problema_»). */
const rotulo = (s: string) => s.replace(/_$/, '');

function Cmd({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2">
      <Logo size={11} className="shrink-0 text-black" />
      <span className="min-w-0">{children}</span>
    </p>
  );
}

// ── 1. Héroe ────────────────────────────────────────────────────

export function Hero() {
  const pila = [
    'evaluado antes de operar',
    'en el CRM que ya usas',
    'cuentas a tu nombre',
    'borradores que revisa una persona',
  ];
  return (
    <header className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
      <Wrap>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)_minmax(0,0.6fr)]">
          {/* Zona 1: titular */}
          <div>
            <Eyebrow>{h.hero.eyebrow}</Eyebrow>
            <h1 className="text-display text-balance text-obsidian">
              {h.hero.title}
              <br />
              <span className="text-stone">{h.hero.titleAccent}</span>
            </h1>
            <p id="hero-description" className="mt-6 max-w-[44ch] text-[18px] leading-[1.5] text-charcoal">
              <Rich text={h.hero.subtitle} />
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <a href={CTA_PROYECTO} target="_blank" rel="noopener noreferrer" className="btn-fill">
                {h.hero.ctaPrimary}
              </a>
              <Link href="#ciclo" className="btn-ghost">
                {h.hero.ctaSecondary}
              </Link>
            </div>
            <p className="mono-label mt-5 text-stone">{h.hero.note}</p>
          </div>

          {/* Zona 2: el glyph negro, flotando sobre el único gradiente del sitio */}
          <div aria-hidden className="relative mx-auto hidden aspect-square w-full max-w-[280px] items-center justify-center lg:flex">
            <div className="spectrum-glow absolute inset-6 rounded-full" />
            <Logo size={200} className="relative text-black" />
          </div>

          {/* Zona 3: pila de eyebrows */}
          <ul className="flex flex-col gap-2 lg:items-end lg:gap-3 lg:text-right">
            {pila.map((p) => (
              <li key={p} className="mono-label text-stone">
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Panel CLI: la terminal es el marketing */}
        <div className="mt-16 grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className="cli">
            <p className="mono-label mb-3 text-graphite">ejemplo · una llamada de seguimiento</p>
            <Cmd>omona seguir --fuente llamada --escribir crm</Cmd>
            <p className="dim mt-1">→ transcripción recibida · extrayendo campos</p>
            <ul className="mt-2 space-y-0.5">
              {h.intel.fields.map((f) => (
                <li key={f.key} className="flex gap-3">
                  <span className="ok">✓</span>
                  <span className="w-[16ch] shrink-0 whitespace-nowrap text-stone">{f.key}</span>
                  <span className="min-w-0 truncate">{f.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2">
              <span className="ok">✓</span> tarea creada · responsable y fecha en el CRM
            </p>
          </div>
          <div className="ring-card flex flex-col gap-6 self-start p-4">
            <div>
              <p className="mono-label text-graphite">{h.intel.sourceLabel}</p>
              <p className="mt-3 text-[18px] leading-[1.45] tracking-[-0.02em] text-obsidian">
                «{h.intel.source}»
              </p>
            </div>
            <p className="text-[13px] leading-[1.54] text-stone">
              <Rich text={h.intel.subtitle} />
            </p>
          </div>
        </div>
      </Wrap>
    </header>
  );
}

// ── 2. El problema ──────────────────────────────────────────────

export function Leak() {
  return (
    <section id="diagnostico" className="py-24 sm:py-32">
      <Wrap>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <Eyebrow>{rotulo(h.leak.label)}</Eyebrow>
            <h2 className="text-heading-lg text-balance text-obsidian">{h.leak.title}</h2>
            <p className="mt-5 max-w-[40ch] text-charcoal">{h.leak.body}</p>
            <p className="mono-label mt-8 text-stone">{h.leak.quote}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {h.leak.items.map((it, i) => (
              <div key={it.title} className="ring-card p-4">
                <p className="mono-label text-graphite">fuga 0{i + 1}</p>
                <p className="mt-6 text-[18px] leading-[1.3] tracking-[-0.03em] text-obsidian">{it.title}</p>
                <p className="mt-2 text-[14px] text-charcoal">
                  {it.detail.replace(/\*\*/g, '')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

// ── 3. El motor ─────────────────────────────────────────────────

function MiniProspectar() {
  const filas = [
    { c: 'cuenta 01', s: 'abrió vacante de compras', crm: 'nueva' },
    { c: 'cuenta 02', s: 'cambió de director comercial', crm: 'nueva' },
    { c: 'cuenta 03', s: 'ya dijo que no en marzo', crm: 'descartada' },
  ];
  return (
    <div className="cli !p-3 text-[12px]">
      <Cmd>omona prospectar --cruzar crm</Cmd>
      <ul className="mt-2 space-y-1">
        {filas.map((f) => (
          <li key={f.c} className="flex gap-2">
            <span className={f.crm === 'nueva' ? 'ok' : 'dim'}>{f.crm === 'nueva' ? '✓' : '–'}</span>
            <span className="w-[9ch] shrink-0 text-stone">{f.c}</span>
            <span className={`min-w-0 truncate ${f.crm === 'nueva' ? '' : 'dim line-through'}`}>{f.s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MiniSeguir() {
  return (
    <div className="ring-card p-3 text-[13px]">
      <div className="flex items-center justify-between">
        <span className="mono-label text-graphite">tarea · CRM</span>
        <span className="mono-label text-[#297a3a]">✓ creada</span>
      </div>
      <p className="mt-2 text-obsidian">Marcar el 8 de enero</p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.071em] text-stone">
        <span className="whitespace-nowrap">decide · el papá</span>
        <span className="whitespace-nowrap">dinero · enero</span>
      </div>
    </div>
  );
}

function MiniCerrar() {
  return (
    <div className="ring-card p-3 text-[13px]">
      <div className="flex items-center justify-between">
        <span className="mono-label text-graphite">propuesta · borrador</span>
        <span className="mono-label text-stone">espera revisión</span>
      </div>
      <ul className="mt-2 space-y-1 text-charcoal">
        <li>— Instalación sin parar la operación</li>
        <li>— Precios del catálogo aprobado</li>
        <li>— Pendiente: confirmar con el papá</li>
      </ul>
    </div>
  );
}

const MINI = [MiniProspectar, MiniSeguir, MiniCerrar];

export function Cycle() {
  const c = h.cycle;
  return (
    <section id="ciclo" className="py-24 sm:py-32">
      <Wrap>
        <div className="max-w-[40rem]">
          <Eyebrow>{rotulo(c.label)}</Eyebrow>
          <h2 className="text-heading-lg text-balance text-obsidian">{c.title}</h2>
          <p className="mt-5 text-charcoal">
            <Rich text={c.subtitle} />
          </p>
        </div>
        <div className="mt-12 grid gap-3 lg:grid-cols-3">
          {c.stages.map((s, i) => {
            const Mini = MINI[i] ?? MiniCerrar;
            return (
              <article key={s.id} id={s.id} className="ring-card flex flex-col p-4">
                <div className="flex items-baseline justify-between">
                  <p className="mono-label text-obsidian">
                    {s.index} · {s.name}
                  </p>
                  <p className="mono-label text-graphite">{s.kicker}</p>
                </div>
                <h3 className="mt-8 text-[22px] leading-[1.15] tracking-[-0.04em] text-obsidian">{s.headline}</h3>
                <div className="mt-6 flex min-h-[124px] flex-col [&>*]:flex-1">
                  <Mini />
                </div>
                <p className="mono-label mt-auto pt-4 text-stone">
                  {c.outputLabel}: <span className="text-obsidian">{s.output}</span>
                </p>
                <details className="group mt-4 border-t border-hair pt-3">
                  <summary className="mono-label cursor-pointer list-none text-charcoal hover:text-obsidian [&::-webkit-details-marker]:hidden">
                    <span className="inline-block transition-transform group-open:rotate-90">›</span> {c.masLabel}
                  </summary>
                  <div className="mt-3 space-y-3 text-[14px] leading-[1.6] text-charcoal">
                    {s.detalle.map((p, j) => (
                      <p key={j}>
                        <Rich text={p} />
                      </p>
                    ))}
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}

// ── 4. Se prueba ────────────────────────────────────────────────

export function Measure() {
  const m = h.measure;
  return (
    <section id="medicion" className="py-24 sm:py-32">
      <Wrap>
        <div className="max-w-[40rem]">
          <Eyebrow>{rotulo(m.label)}</Eyebrow>
          <h2 className="text-heading-lg text-obsidian">{m.title}</h2>
          <p className="mt-5 text-charcoal">
            <Rich text={m.subtitle} />
          </p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="cli">
            <p className="mono-label mb-3 text-graphite">ejemplo de evaluación</p>
            <Cmd>{m.terminal.comando}</Cmd>
            <ul className="mt-2 space-y-0.5">
              {m.terminal.casos.map((c) => (
                <li key={c.nombre} className="flex gap-3">
                  <span className={c.ok ? 'ok' : 'text-obsidian'}>{c.marca}</span>
                  <span className="min-w-0 flex-1 truncate text-charcoal">{c.nombre}</span>
                  <span className={`tabular-nums ${c.ok ? 'text-stone' : 'text-obsidian'}`}>{c.conteo}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-hair pt-3">
              <Rich text={m.terminal.resumen} />
            </p>
          </div>

          <div className="card-invert flex flex-col justify-between p-4">
            <p className="mono-label text-[#a8a8a8]">{m.moneyLabel}</p>
            <pre className="mt-6 whitespace-pre-wrap font-mono text-[13px] leading-[1.8] text-white">{m.moneyFormula}</pre>
            <p className="mt-6 text-[13px] leading-[1.54] text-[#c9c9c9]">{m.moneyNote}</p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {m.metrics.map((x) => (
            <div key={x.name} className="ring-card p-4">
              <p className="text-[16px] leading-[1.3] tracking-[-0.02em] text-obsidian">{x.name}</p>
              <p className="mt-2 text-[14px] text-charcoal">
                <Rich text={x.detail} />
              </p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

// ── 5. Para quién sí ────────────────────────────────────────────

export function Scope() {
  const s = h.scope;
  return (
    <section id="alcance" className="py-24 sm:py-32">
      <Wrap>
        <div className="max-w-[40rem]">
          <Eyebrow>{rotulo(s.label)}</Eyebrow>
          <h2 className="text-heading-lg text-obsidian">{s.title}</h2>
          <p className="mt-5 text-charcoal">
            <Rich text={s.subtitle} />
          </p>
        </div>
        <div className="mt-12 grid gap-3 md:grid-cols-2">
          <div className="ring-card p-4">
            <p className="mono-label text-[#297a3a]">✓ {s.doTitle}</p>
            <ul className="mt-4 space-y-3">
              {s.does.map((d) => (
                <li key={d} className="flex gap-3 text-[15px] text-obsidian">
                  <span className="mono-label pt-1 text-[#297a3a]">✓</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="ring-card p-4">
            <p className="mono-label text-stone">– {s.dontTitle}</p>
            <ul className="mt-4 space-y-3">
              {s.donts.map((d) => (
                <li key={d.title} className="flex gap-3 text-[15px]">
                  <span className="mono-label pt-1 text-smoke">–</span>
                  <span>
                    <span className="text-obsidian">{d.title}.</span> <span className="text-charcoal">{d.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <details className="group mt-3 ring-ghost bg-white p-4">
          <summary className="mono-label cursor-pointer list-none text-charcoal hover:text-obsidian [&::-webkit-details-marker]:hidden">
            <span className="inline-block transition-transform group-open:rotate-90">›</span> {s.mas.resumen}
          </summary>
          <div className="mt-3 max-w-[66ch] space-y-3 text-[15px] leading-[1.6] text-charcoal">
            {s.mas.parrafos.map((p, i) => (
              <p key={i}>
                <Rich text={p} />
              </p>
            ))}
          </div>
        </details>
      </Wrap>
    </section>
  );
}

// ── 6. Preguntas ────────────────────────────────────────────────

export function Faq() {
  const f = es.faq;
  return (
    <section id="preguntas" className="py-24 sm:py-32">
      <Wrap>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div>
            <Eyebrow>{rotulo(f.sectionLabel)}</Eyebrow>
            <h2 className="text-heading-lg text-obsidian">{f.heading}</h2>
            <p className="mt-5 text-charcoal">{f.subheading}</p>
          </div>
          <div className="ring-card divide-y divide-hair">
            {f.items.map((it) => (
              <details key={it.q} className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] tracking-[-0.02em] text-obsidian [&::-webkit-details-marker]:hidden">
                  {it.q}
                  <span aria-hidden className="mono-label text-stone transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[66ch] text-[15px] leading-[1.6] text-charcoal">{it.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

// ── 7. Cierre ───────────────────────────────────────────────────

export function Cta() {
  const c = es.cta;
  return (
    <section className="py-24 sm:py-32">
      <Wrap>
        <div className="ring-card relative overflow-hidden px-6 py-16 text-center sm:px-12">
          <div aria-hidden className="spectrum-line absolute inset-x-0 top-0" />
          <h2 className="mx-auto max-w-[22ch] text-heading-lg text-obsidian">{c.heading}</h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-charcoal">
            <Rich text={c.subheading} />
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <a href={CTA_PROYECTO} target="_blank" rel="noopener noreferrer" className="btn-fill">
              {c.primary}
            </a>
            <Link href="#ciclo" className="btn-ghost">
              {c.secondary}
            </Link>
          </div>
          <p className="mono-label mt-6 text-stone">{c.trust}</p>
        </div>
      </Wrap>
    </section>
  );
}
