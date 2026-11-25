/**
 * La portada: el laboratorio open source de Victor Gallo (DESIGN_SYSTEM.md).
 *
 * 22-nov-2026: omona.tech dejó de presentar un producto. Victor: «ahorita
 * omona.tech literalmente nada más es los PR abiertos y yo, como mi GitHub
 * personal». La portada es eso: quién, qué está aportando (con el estado real
 * de GitHub, de data/oss/oss.json), las últimas notas y sus perfiles.
 *
 * Reglas: nada de «merged» si GitHub no lo dice; sin clientes, cifras de
 * negocio, precios ni llamadas a comprar. Componentes de servidor.
 */
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { AUTOR } from '@/lib/entidad';
import { fechaCorta, getNotas } from '@/lib/notas';
import { AVISO_LOGOS, CONSTRUYO_SOBRE, CONTRIBUYO, FILOSOFIA, NOMBRE_LEGAL, REDES, type Marca } from '@/lib/perfil';
import ossData from '../../../data/oss/oss.json';
import nowData from '../../../data/now/now.json';
import { StateBadge } from './Blog';
import { DiagnosticoSaaS } from './DiagnosticoSaaS';

type Pr = {
  key: string; repo: string; number: number; title: string; url: string; state: string;
  createdAt: string; additions: number; deletions: number; changedFiles: number; area: string | null; es: string; post: string | null;
};
type Issue = {
  key: string; repo: string; number: number; url: string; state: string; createdAt: string; es: string;
  fixedBy: { pr: string; url: string; author: string; state?: string } | null;
};
type Project = { repo: string; url: string; language: string | null; license: string | null; pushedAt: string; es: string };
type Oss = { generatedAt: string; author: string; stats: Record<string, number>; prs: Pr[]; issues: Issue[]; projects?: Project[] };

const oss = ossData as unknown as Oss;

export type NowItem = { date: string; kind: string; es: string; en: string; url: string | null; ref: string };
export type Now = { generatedAt: string; updated: string; foco: { es: string; en: string; url?: string }[]; items: NowItem[] };
export const now = nowData as unknown as Now;

export const TIPO: Record<string, string> = {
  pr: 'PR',
  merged: 'merged',
  cerrado: 'cerrado',
  reporte: 'reporte',
  nota: 'nota',
  evento: 'evento',
  programa: 'programa',
  sitio: 'sitio',
  laboratorio: 'lab',
};
export const TIPO_EN: Record<string, string> = { ...TIPO, cerrado: 'closed', reporte: 'issue', nota: 'note', evento: 'event', programa: 'program', sitio: 'site' };

const CARGO_CORTO = 'superleads · ventas + ia';

export function Wrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-6 lg:px-12 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return <p className={`eyebrow mb-3 ${muted ? 'eyebrow-muted' : ''}`}>{children}</p>;
}

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Mexico_City' });

const corto = (repo: string) => repo.split('/')[1] ?? repo;

/** Nota del blog que cita este PR o issue (frontmatter `prs:`), si existe. */
function notaDe(key: string, post?: string | null): string | null {
  if (post) return post;
  const n = getNotas().find((x) => x.prs.some((p) => p.key === key));
  return n ? n.slug : null;
}

function Cmd({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2">
      <Logo size={11} className="mt-[0.3em] shrink-0 text-black" />
      <span className="min-w-0 break-words">{children}</span>
    </p>
  );
}

/** Estado en la salida del CLI: verde solo si GitHub dice merged. */
function Estado({ state }: { state: string }) {
  return <span className={`w-[7ch] shrink-0 uppercase ${state === 'merged' ? 'ok' : 'text-obsidian'}`}>{state}</span>;
}

export function Seccion({ id, eyebrow, h, sub, more }: { id: string; eyebrow?: string; h: string; sub?: string; more?: { href: string; label: string } }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-[44rem]">
        <h2 id={id} className="text-heading text-obsidian">{h}</h2>
        {sub && <p className="mt-2.5 text-[15px] leading-[1.5] text-stone">{sub}</p>}
      </div>
      {more && (
        <Link href={more.href} className="mono-label shrink-0 text-charcoal hover:text-obsidian">
          {more.label} →
        </Link>
      )}
    </div>
  );
}

// ── 1. Héroe ejecutivo: Omona · Seguridad para agentes de IA y arquitectura ──
// 24-nov-2026, Victor: «que ese sea el CTA principal de la página y quítame
// relevancia a mí, haz la página más ejecutiva y con estos CTAs, sin cards».

const PILARES_EJECUTIVOS: { h: string; p: string; guia?: { href: string; label: string } }[] = [
  {
    h: '1. Correo empresarial y dominio',
    p: 'Evita que estafadores suplanten el correo de tu empresa (SPF y DMARC) para mandar facturas falsas o enlaces de fraude a tus clientes y proveedores. En nuestra medición, el 66 % de 285 dominios .mx con correo sigue siendo suplantable.',
    guia: { href: '/blog/dmarc-spf-facturas-falsas-pymes', label: 'Guía SPF y DMARC paso a paso' },
  },
  {
    h: '2. Página web y datos de clientes',
    p: 'Verifica cómo saber si tu página web es segura (HTTPS/HSTS, Content-Security-Policy) y bloquea archivos internos o contraseñas expuestas (/.env).',
    guia: { href: '/blog/ciberseguridad-para-pymes-mexico-guia', label: 'Guía para PyMEs en 4 etapas' },
  },
  {
    h: '3. Control de acceso y nube',
    p: 'Ordena quién tiene acceso a los sistemas de tu negocio (mínimo privilegio IAM), elimina contraseñas compartidas y resguarda llaves en bóveda (Secrets Store).',
  },
  {
    h: '4. IA, chatbots y agentes seguros',
    p: 'Cuando tu empresa empieza a usar bots de WhatsApp o agentes de IA (AWS Bedrock, servidores MCP), blindamos que no filtren bases de datos ni caigan en engaños (prompt injection).',
  },
];

export function Hero() {
  return (
    <header className="relative overflow-hidden pb-14 pt-12 sm:pb-24 sm:pt-20">
      <Wrap>
        <div className="max-w-[54rem]">
          <h1 className="text-heading-lg text-balance text-obsidian">
            Ciberseguridad para tu empresa: desde lo más básico hasta tus agentes de IA.
          </h1>
          <p id="hero-description" className="mt-6 max-w-[62ch] text-[19px] leading-[1.5] text-charcoal">
            Empezamos por lo que hoy protege a una PyME en México —saber si tu página web es segura, impedir que falsifiquen tu correo empresarial y ordenar los accesos de tu equipo— y te acompañamos paso a paso conforme conectas la nube, WhatsApp e inteligencia artificial.
          </p>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.5] text-stone">
            Sin jerga incomprensible: diagnóstico inmediato con tu dominio, entregable claro para dirección y para sistemas, y revisiones 100 % defensivas bajo alcance firmado.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#diagnostico" className="btn-fill">
              Revisar mi dominio gratis →
            </a>
            <a
              href="mailto:victor@omona.tech?subject=Diagn%C3%B3stico%20de%20ciberseguridad%20para%20mi%20empresa%20%E2%80%94%20Omona"
              className="btn-ghost"
            >
              Agendar llamada de diagnóstico →
            </a>
          </div>
        </div>

        <div className="mt-14">
          <DiagnosticoSaaS lang="es" />
        </div>

        <dl className="mt-12 grid divide-y divide-hair border-y border-hair sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {PILARES_EJECUTIVOS.map((x, idx) => (
            <div key={x.h} className={`py-6 ${idx > 0 ? 'lg:pl-6' : ''} ${idx < 3 ? 'lg:pr-6' : ''}`}>
              <dt className="text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-obsidian">{x.h}</dt>
              <dd className="mt-2 text-[14px] leading-[1.5] text-charcoal">{x.p}</dd>
              {x.guia && (
                <dd className="mt-3">
                  <Link href={x.guia.href} className="mono-label text-charcoal hover:text-obsidian">
                    {x.guia.label} →
                  </Link>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </Wrap>
    </header>
  );
}

// ── 2. Logos: contribuyo a / construyo sobre ────────────────────
// Uso nominativo: cada logo liga a la evidencia y el pie lo aclara.

function Celda({ m, lang }: { m: Marca; lang: 'es' | 'en' }) {
  const txt = lang === 'en' ? m.en : m.es;
  return (
    <a
      href={m.href}
      className="group flex min-h-[112px] flex-col justify-between gap-4 p-4 transition-colors hover:bg-white sm:p-5"
      aria-label={`${m.nombre} (${m.dueno}): ${txt}`}
    >
      <span className="flex h-10 items-center gap-2.5 transition-[filter] group-hover:brightness-[0.25]">
        {m.logo ? (
          <img src={m.logo} alt="" style={{ height: m.alto }} className="w-auto" loading="lazy" />
        ) : null}
        {(m.rotulo || !m.logo) && (
          <span
            className={`whitespace-nowrap tracking-[-0.03em] text-[#7d7d7d] ${m.logo ? 'text-[17px] font-medium' : 'text-[19px] font-semibold'}`}
          >
            {m.rotulo || m.nombre}
          </span>
        )}
      </span>
      <span className="mono-label flex flex-col gap-0.5 text-stone">
        <span className="text-graphite">{m.dueno}</span>
        <span>{txt} →</span>
      </span>
    </a>
  );
}

export function Marcas({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  const en = lang === 'en';
  return (
    <section aria-labelledby="marcas" className="pb-6">
      <Wrap>
        <h2 id="marcas" className="sr-only">
          {en ? 'Projects I contribute to and build on' : 'Proyectos a los que contribuyo y sobre los que construyo'}
        </h2>
        <div className="grid border-y border-hair lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="border-b border-hair lg:border-b-0 lg:border-r lg:border-r-hair">
            <p className="mono-label border-b border-hair py-2.5 pr-4 text-graphite sm:pr-5">{en ? 'Contributing to' : 'Contribuyo a'}</p>
            <div className="grid grid-cols-1 divide-y divide-hair sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {CONTRIBUYO.map((m) => (
                <Celda key={m.id} m={m} lang={lang} />
              ))}
            </div>
          </div>
          <div>
            <p className="mono-label border-b border-hair px-4 py-2.5 text-graphite sm:px-5">{en ? 'Building on' : 'Construyo sobre'}</p>
            <div className="grid grid-cols-1 divide-y divide-hair sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {CONSTRUYO_SOBRE.map((m) => (
                <Celda key={m.id} m={m} lang={lang} />
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-[1.5] text-graphite">{AVISO_LOGOS[lang]}</p>
      </Wrap>
    </section>
  );
}

// ── 3. Por qué hago esto ────────────────────────────────────────
// BORRADOR que Victor revisa (lib/perfil.ts → FILOSOFIA).

export function PorQue() {
  return (
    <section className="py-16 sm:py-28" aria-labelledby="por-que">
      <Wrap>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <Eyebrow>Filosofía</Eyebrow>
            <h2 id="por-que" className="text-heading text-obsidian">
              Por qué hago esto
            </h2>
            <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.5] text-stone">En primera persona, y en corto.</p>
          </div>
          <ol className="divide-y divide-hair border-y border-hair">
            {FILOSOFIA.es.map((linea, i) => (
              <li key={linea} className="grid grid-cols-[3ch_minmax(0,1fr)] gap-4 py-4">
                <span className="mono-label pt-1 text-graphite">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-pretty text-[18px] leading-[1.45] tracking-[-0.02em] text-obsidian">{linea}</p>
              </li>
            ))}
          </ol>
        </div>
      </Wrap>
    </section>
  );
}

// ── 4. Ahora: la bitácora que se actualiza sola ─────────────────
// data/now/now.json lo arma scripts/now-refresh.mjs a diario (cron).

export function Ahora({ limite = 6 }: { limite?: number }) {
  const items = now.items.slice(0, limite);
  return (
    <section className="py-8 sm:py-16" aria-labelledby="ahora">
      <Wrap>
        <Seccion
          id="ahora"
          eyebrow="Ahora"
          h="Qué estoy haciendo"
          sub={`Se arma sola cada día desde GitHub, el blog y mi agenda confirmada. Última entrada: ${fecha(`${now.updated}T12:00:00-06:00`)}.`}
          more={{ href: '/now', label: 'Toda la bitácora' }}
        />
        <div className="grid gap-8 border-t border-hair pt-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
          <div className="self-start">
            <p className="mono-label text-graphite">En foco</p>
            <ul className="mt-3 space-y-3">
              {now.foco.map((f) => (
                <li key={f.es} className="flex gap-2.5 text-[15px] leading-[1.5] text-charcoal">
                  <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#297a3a]" />
                  {f.url ? (
                    <a href={f.url} className="hover:text-obsidian">
                      {f.es}
                    </a>
                  ) : (
                    f.es
                  )}
                </li>
              ))}
            </ul>
          </div>
          <ul className="divide-y divide-hair border-y border-hair">
            {items.map((it) => (
              <li key={`${it.kind}${it.ref}`} className="grid grid-cols-[12ch_minmax(0,1fr)] gap-x-3 gap-y-1 py-3 sm:grid-cols-[12ch_8ch_minmax(0,1fr)]">
                <span className="mono-label pt-0.5 text-graphite">{fechaCorta(it.date)}</span>
                <span className="mono-label pt-0.5 text-stone">{TIPO[it.kind] ?? it.kind}</span>
                <p className="col-span-2 min-w-0 text-[15px] leading-[1.5] text-charcoal sm:col-span-1">
                  {it.url ? (
                    <a href={it.url} className="break-words hover:text-obsidian">
                      {it.es}
                    </a>
                  ) : (
                    it.es
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}

// ── 5. Actividad: panel CLI con datos de GitHub ─────────────────

export function Actividad() {
  const s = oss.stats;
  return (
    <section className="pt-8 sm:pt-16" aria-labelledby="actividad">
      <Wrap>
        <Seccion
          id="actividad"
          eyebrow="Open source"
          h="Lo que estoy aportando"
          sub="Pull requests a proyectos de terceros y los reportes que los originaron. El estado es el que dice GitHub."
          more={{ href: '/open-source', label: 'Todo en open source' }}
        />
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="cli min-w-0 text-[12.5px]">
            <p className="mono-label mb-3 text-graphite">actividad · datos de GitHub</p>
            <Cmd>gh search prs --author {oss.author}</Cmd>
            <ul className="mt-2 space-y-0.5">
              {oss.prs.map((p) => (
                <li key={p.key} className="flex gap-3">
                  <Estado state={p.state} />
                  <a href={p.url} className="min-w-0 flex-1 truncate text-stone hover:text-obsidian sm:w-[22ch] sm:flex-none sm:shrink-0">
                    {corto(p.repo)}#{p.number}
                  </a>
                  <span className="hidden min-w-0 flex-1 truncate sm:block">{p.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <Cmd>gh search issues --author {oss.author}</Cmd>
            </div>
            <ul className="mt-2 space-y-0.5">
              {oss.issues.map((i) => (
                <li key={i.key} className="flex gap-3">
                  <Estado state={i.state} />
                  <a href={i.url} className="min-w-0 flex-1 truncate text-stone hover:text-obsidian sm:w-[22ch] sm:flex-none sm:shrink-0">
                    {corto(i.repo)}#{i.number}
                  </a>
                  <span className="hidden min-w-0 flex-1 truncate sm:block">
                    {i.fixedBy ? `arreglo: #${i.fixedBy.pr.split('#')[1]} de @${i.fixedBy.author}` : 'reporte'}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-hair pt-3">
              <span className="ok">✓</span> <span className="whitespace-nowrap">{s.prs} PRs · {s.merged} merged</span>{' '}
              <span className="whitespace-nowrap">· {s.open} abiertos · {s.issues} reportes</span>{' '}
              <span className="dim whitespace-nowrap">· +{s.additions} −{s.deletions}</span>
            </p>
            {s.merged === 0 && <p className="dim mt-1">→ ninguno merged todavía: todos esperan revisión de los maintainers</p>}
          </div>

          <div className="flex flex-col justify-between gap-6 border-y border-hair py-5 tabular-nums">
            <dl className="grid grid-cols-2 gap-4">
              {(
                [
                  [String(s.prs), 'pull requests'],
                  [String(s.merged), 'merged'],
                  [String(s.issues), 'reportes'],
                  [String(s.repos), 'proyectos'],
                ] as [string, string][]
              ).map(([v, k]) => (
                <div key={k}>
                  <dt className="mono-label text-graphite">{k}</dt>
                  <dd className="mt-2 text-[28px] leading-none tracking-[-0.04em] text-obsidian">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[13px] leading-[1.54] text-stone">
              El estado de cada PR es el que reporta GitHub; la lista se regenera a diario. Actualizado el{' '}
              {fecha(oss.generatedAt)}.
            </p>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
// ── 6. Qué está aportando (lista completa; la usa /open-source si hace falta) ───────────────────────────────────────

export function Aportes() {
  return (
    <section className="py-16 sm:py-32" aria-labelledby="aportes">
      <Wrap>
        <Seccion
          id="aportes"
          eyebrow="Open source"
          h="Lo que estoy aportando"
          sub="Pull requests a proyectos de terceros y los reportes que los originaron. El texto es mío; el título y el estado son los de GitHub."
          more={{ href: '/open-source', label: 'Todo en open source' }}
        />
        <p className="mono-label mb-3 text-graphite">Pull requests · {oss.prs.length}</p>
        <ul className="ring-card divide-y divide-hair">
          {oss.prs.map((p) => {
            const nota = notaDe(p.key, p.post);
            return (
              <li key={p.key} className="grid gap-2 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <a href={p.url} className="font-mono text-[12.5px] text-obsidian underline decoration-hair underline-offset-2 hover:decoration-obsidian">
                      {p.repo}#{p.number}
                    </a>
                    <StateBadge state={p.state} />
                  </div>
                  <p className="mt-2 text-[16px] leading-[1.4] tracking-[-0.02em] text-obsidian">{p.es}</p>
                  <p className="mt-1 break-words font-mono text-[12px] leading-[1.54] text-stone md:truncate">{p.title}</p>
                </div>
                <p className="mono-label flex flex-wrap gap-x-4 gap-y-1 text-stone md:flex-col md:items-end md:gap-1 md:pt-0.5 md:text-right">
                  <span>{fecha(p.createdAt)}</span>
                  <span>
                    {p.area ? `${p.area} · ` : ''}+{p.additions} −{p.deletions}
                  </span>
                  {nota && (
                    <Link href={`/blog/${nota}`} className="text-obsidian hover:underline">
                      Nota →
                    </Link>
                  )}
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mono-label mb-3 mt-10 text-graphite">Reportes · {oss.issues.length}</p>
        <ul className="grid gap-3 md:grid-cols-2">
          {oss.issues.map((i) => {
            const nota = notaDe(i.key);
            return (
              <li key={i.key} className="ring-card flex flex-col p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <a href={i.url} className="font-mono text-[12.5px] text-obsidian underline decoration-hair underline-offset-2 hover:decoration-obsidian">
                    {i.repo}#{i.number}
                  </a>
                  <StateBadge state={i.state} />
                </div>
                <p className="mt-3 text-[15px] leading-[1.5] text-charcoal">{i.es}</p>
                <p className="mono-label mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-stone">
                  <span>{fecha(i.createdAt)}</span>
                  {i.fixedBy && (
                    <span>
                      arreglo:{' '}
                      <a href={i.fixedBy.url} className="text-obsidian underline decoration-hair underline-offset-2">
                        PR #{i.fixedBy.pr.split('#')[1]}
                      </a>{' '}
                      de <span className="normal-case">@{i.fixedBy.author}</span>
                      {i.fixedBy.state === 'open' ? ' (en revisión)' : i.fixedBy.state ? ` (${i.fixedBy.state})` : ''}
                    </span>
                  )}
                  {nota && (
                    <Link href={`/blog/${nota}`} className="text-obsidian hover:underline">
                      Nota →
                    </Link>
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      </Wrap>
    </section>
  );
}

// ── 7. Proyectos propios ────────────────────────────────────────

export function Proyectos() {
  const ps = oss.projects ?? [];
  if (!ps.length) return null;
  return (
    <section className="py-8 sm:py-16" aria-labelledby="proyectos">
      <Wrap>
        <Seccion
          id="proyectos"
          h="Repositorios públicos"
          sub="Herramientas y plantillas abiertas bajo licencia permisiva."
          more={{ href: AUTOR.github, label: 'Todos en GitHub' }}
        />
        <ul className="divide-y divide-hair border-y border-hair">
          {ps.map((p) => (
            <li key={p.repo} className="grid gap-2 py-5 md:grid-cols-[28ch_minmax(0,1fr)_auto] md:items-baseline md:gap-8">
              <a href={p.url} className="font-mono text-[13px] text-obsidian underline decoration-hair underline-offset-4 hover:decoration-obsidian">
                {p.repo}
              </a>
              <p className="text-[15px] leading-[1.5] text-charcoal">{p.es}</p>
              <p className="mono-label flex flex-wrap gap-x-4 text-graphite">
                {p.language && <span>{p.language}</span>}
                {p.license && <span>{p.license}</span>}
                <span>actualizado {fecha(p.pushedAt)}</span>
              </p>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

// ── 8. Últimas notas ────────────────────────────────────────────

export function Notas() {
  const notas = getNotas().slice(0, 3);
  if (!notas.length) return null;
  return (
    <section className="py-12 sm:py-24" aria-labelledby="notas">
      <Wrap>
        <Seccion
          id="notas"
          h="Notas de ingeniería"
          sub="Arquitectura, seguridad de agentes y mediciones en producción."
          more={{ href: '/blog', label: 'Todas las notas' }}
        />
        <div className="divide-y divide-hair border-y border-hair">
          {notas.map((n) => (
            <Link key={n.slug} href={`/blog/${n.slug}`} className="group grid gap-2 py-5 md:grid-cols-[14ch_minmax(0,1fr)_18ch] md:items-baseline md:gap-8">
              <p className="mono-label text-graphite">{fechaCorta(n.date)}</p>
              <div>
                <h3 className="text-[18px] font-medium leading-[1.3] tracking-[-0.02em] text-obsidian group-hover:underline">{n.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-[1.5] text-charcoal">{n.description}</p>
              </div>
              <p className="mono-label text-stone md:text-right">
                {n.prs.length ? n.prs.map((p) => `#${p.number}`).join(' · ') : n.tags.slice(0, 2).join(' · ')}
              </p>
            </Link>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

// ── 9. Dirección técnica y respaldo legal ────────────────────────────────────

export function Quien() {
  return (
    <section className="py-8 sm:py-16" aria-labelledby="quien">
      <Wrap>
        <div className="grid gap-6 border-y border-hair py-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="mono-label text-graphite">Respaldo legal y dirección técnica</p>
            <p id="quien" className="mt-2 max-w-[64ch] text-[16px] leading-[1.5] text-obsidian">
              Omona se representa y opera como persona moral formalmente establecida en México (León, Guanajuato), bajo la dirección técnica de {NOMBRE_LEGAL}.
            </p>
            <p className="mono-label mt-3 flex flex-wrap gap-x-4 gap-y-1 text-stone">
              <Link href="/seguridad" className="hover:text-obsidian">Alcance y aviso legal</Link>
              <Link href="/about" className="hover:text-obsidian">About (EN)</Link>
              <a href={REDES.github} rel="me" className="hover:text-obsidian">GitHub</a>
              <a href={REDES.linkedin} rel="me" className="hover:text-obsidian">LinkedIn</a>
              <a href={AUTOR.url} rel="author" className="hover:text-obsidian">victorgallo.com</a>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#diagnostico" className="btn-ghost">
              Evaluar dominio
            </a>
            <a
              href="mailto:victor@omona.tech?subject=Agendar%20revisi%C3%B3n%20de%20arquitectura%20y%20agentes%20IA%20%E2%80%94%20Omona"
              className="btn-fill"
            >
              Agendar llamada →
            </a>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
