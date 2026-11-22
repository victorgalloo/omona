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
import ossData from '../../../data/oss/oss.json';
import { StateBadge } from './Blog';

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

function Seccion({ id, eyebrow, h, sub, more }: { id: string; eyebrow: string; h: string; sub?: string; more?: { href: string; label: string } }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-[44rem]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className="text-heading text-obsidian">{h}</h2>
        {sub && <p className="mt-3 text-[15px] leading-[1.5] text-stone">{sub}</p>}
      </div>
      {more && (
        <Link href={more.href} className="mono-label shrink-0 text-charcoal hover:text-obsidian">
          {more.label} →
        </Link>
      )}
    </div>
  );
}

// ── 1. Héroe: quién ─────────────────────────────────────────────

export function Hero() {
  const s = oss.stats;
  const pila = ['amazon bedrock', 'hermes agent · nous research', 'strands agents · aws', 'león, gto. · méxico'];
  return (
    <header className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
      <Wrap>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)_minmax(0,0.6fr)]">
          {/* Zona 1: titular */}
          <div>
            <Eyebrow>Laboratorio open source · Victor Gallo</Eyebrow>
            <h1 className="text-display text-balance text-obsidian">
              Agentes de IA en producción.
              <br />
              <span className="text-stone">Los arreglos, upstream.</span>
            </h1>
            <p id="hero-description" className="mt-6 max-w-[46ch] text-[18px] leading-[1.5] text-charcoal">
              Soy Victor Gallo. Construyo y opero agentes de IA sobre Amazon Bedrock y Hermes Agent; cuando algo falla,
              mando el arreglo al proyecto original.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link href="/open-source" className="btn-fill">
                Ver los aportes
              </Link>
              <Link href="/blog" className="btn-ghost">
                Notas de ingeniería
              </Link>
            </div>
            <p className="mono-label mt-5 flex flex-wrap gap-x-4 gap-y-1 text-stone">
              <a href={AUTOR.github} rel="me" className="hover:text-obsidian">github.com/victorgalloo</a>
              <a href={AUTOR.linkedin} rel="me" className="hover:text-obsidian">LinkedIn</a>
              <a href={AUTOR.url} rel="author" className="hover:text-obsidian">victorgallo.com</a>
            </p>
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

        {/* Panel CLI: actividad real, armada desde data/oss/oss.json */}
        <div className="mt-16 grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
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

          <div className="ring-card flex flex-col justify-between gap-6 p-4">
            <dl className="grid grid-cols-2 gap-3">
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
              El estado de cada PR es el que reporta GitHub; la lista se regenera cada lunes. Actualizado el{' '}
              {fecha(oss.generatedAt)}.
            </p>
          </div>
        </div>
      </Wrap>
    </header>
  );
}

// ── 2. Qué está aportando ───────────────────────────────────────

export function Aportes() {
  return (
    <section className="py-16 sm:py-32" aria-labelledby="aportes">
      <Wrap>
        <Seccion
          id="aportes"
          eyebrow="Ahora"
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

// ── 3. Proyectos propios ────────────────────────────────────────

export function Proyectos() {
  const ps = oss.projects ?? [];
  if (!ps.length) return null;
  return (
    <section className="py-8 sm:py-16" aria-labelledby="proyectos">
      <Wrap>
        <Seccion
          id="proyectos"
          eyebrow="Código propio"
          h="Repos públicos"
          sub="Código y documentación bajo mi cuenta de GitHub."
          more={{ href: AUTOR.github, label: 'Todos en GitHub' }}
        />
        <ul className="grid gap-3 md:grid-cols-2">
          {ps.map((p) => (
            <li key={p.repo} className="ring-card flex flex-col p-4">
              <a href={p.url} className="font-mono text-[12.5px] text-obsidian underline decoration-hair underline-offset-2 hover:decoration-obsidian">
                {p.repo}
              </a>
              <p className="mt-3 text-[15px] leading-[1.5] text-charcoal">{p.es}</p>
              <p className="mono-label mt-auto flex flex-wrap gap-x-4 pt-4 text-graphite">
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

// ── 4. Últimas notas ────────────────────────────────────────────

export function Notas() {
  const notas = getNotas().slice(0, 3);
  if (!notas.length) return null;
  return (
    <section className="py-16 sm:py-32" aria-labelledby="notas">
      <Wrap>
        <Seccion
          id="notas"
          eyebrow="Blog"
          h="Notas de ingeniería"
          sub="El porqué de algunos de estos PRs, con mediciones."
          more={{ href: '/blog', label: 'Todas las notas' }}
        />
        <div className="grid gap-3 md:grid-cols-3">
          {notas.map((n) => (
            <Link key={n.slug} href={`/blog/${n.slug}`} className="ring-card group flex flex-col p-4 transition-shadow hover:shadow-card-hover">
              <p className="mono-label text-graphite">{fechaCorta(n.date)}</p>
              <h3 className="mt-6 text-[19px] leading-[1.2] tracking-[-0.03em] text-obsidian">{n.title}</h3>
              <p className="mt-3 line-clamp-3 text-[14px] leading-[1.5] text-charcoal">{n.description}</p>
              <p className="mono-label mt-auto pt-6 text-stone">
                {n.prs.length ? n.prs.map((p) => `#${p.number}`).join(' · ') : n.tags.slice(0, 2).join(' · ')}
              </p>
            </Link>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

// ── 5. Quién ────────────────────────────────────────────────────

export function Quien() {
  return (
    <section className="py-8 sm:py-16" aria-labelledby="quien">
      <Wrap>
        <div className="ring-card grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="mono-label text-graphite">Qué es Omona</p>
            <p id="quien" className="mt-3 max-w-[62ch] text-[18px] leading-[1.45] tracking-[-0.02em] text-obsidian">
              Mi laboratorio independiente para el trabajo open source. No hay producto que vender aquí: solo los aportes,
              las notas y el código.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/about" className="btn-ghost">
              About (EN)
            </Link>
            <a href={AUTOR.github} rel="me" className="btn-fill">
              GitHub ↗
            </a>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
