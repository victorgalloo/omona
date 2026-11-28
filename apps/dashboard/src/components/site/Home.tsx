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
import { Fragment } from 'react';
import Link from 'next/link';
import { HERO_DESC, HERO_EYEBROW, HERO_FRASES, producto, rotuloProducto } from '@/lib/portada';
import { Logo } from '@/components/shared/Logo';
import { AUTOR } from '@/lib/entidad';
import { fechaCorta, getNotas } from '@/lib/notas';
import { getTemas, type Tema } from '@/lib/conocimiento';
import { AVISO_LOGOS, CONSTRUYO_SOBRE, CONTRIBUYO, FILOSOFIA, NOMBRE_LEGAL, REDES, type Marca } from '@/lib/perfil';
import ossData from '../../../data/oss/oss.json';
import nowData from '../../../data/now/now.json';
import { StateBadge } from './Blog';
import { DiagnosticoSaaS } from './DiagnosticoSaaS';
import { GRUPO, VerMas, sumCls } from './VerMas';

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

// ── 1. Héroe v6: tres productos, una línea cada uno, «ver más» ──
// 27-nov-2026, Victor: «Replantea la landing de omona en base a lo aprendido en
// mi base de conocimiento» («Poco texto, pero potente»: arriba solo la idea, el
// detalle existe pero no estorba) «y el nuevo producto también de
// posicionamiento seo geo chatgpt, claude, gemini». Tres productos con el mismo
// peso: rótulo + una línea en <h2> + «ver más» nativo (acordeón exclusivo con
// name="producto"). Todo el detalle vive en el HTML del servidor.

// Textos de B y C aprobados por Victor (antes «Sub héroe» v2, 26-nov-2026): se
// mueven, no se reescriben.
type AreaHero = {
  porque: string;
  mas: { href: string; label: string };
  filas: { hoy: string; con: string }[];
  guias: { href: string; label: string }[];
};

const AREAS_HERO: AreaHero[] = [
  {
    porque: 'En Estados Unidos gana el contrato quien contesta en el primer minuto.',
    mas: { href: '/comercial-ia', label: 'Ver cómo funciona' },
    filas: [
      {
        hoy: 'Un cliente escribe por WhatsApp fuera de horario y nadie contesta.',
        con: 'Recibe respuesta en menos de 60 segundos, en español o en inglés.',
      },
      {
        hoy: 'Cada quien da un precio o un estimado distinto.',
        con: 'El agente solo cotiza lo que está en tu lista de precios.',
      },
      {
        hoy: 'Tu vendedor vuelve a preguntarle todo al cliente.',
        con: 'Le llega un resumen del caso, listo para cerrar.',
      },
    ],
    guias: [
      { href: '/blog/recepcionista-bilingue-ia-negocios-latinos', label: 'Recepcionista bilingüe con IA' },
      { href: '/blog/traspaso-ia-a-vendedor-humano-candados-precios', label: 'Traspaso a humano sin inventar precios' },
      { href: '/blog/procesos-comerciales-ia-whatsapp-arquitectura', label: 'Arquitectura comercial con IA' },
      { href: '/blog/agentes-en-jerarquia-gerentes-subagentes', label: 'Agentes en jerarquía' },
      { href: '/verificador-embudo-bilingue', label: 'Mide tu sitio gratis' },
    ],
  },
  {
    porque: 'El FBI documentó $2,770 millones USD perdidos en 2024 por correos que suplantan a un proveedor o a un jefe.',
    mas: { href: '/seguridad', label: 'Ver qué cubrimos' },
    filas: [
      {
        hoy: 'Un cliente recibe una factura a tu nombre con otra cuenta de banco.',
        con: 'Tu dominio rechaza los correos que te suplantan y tu buzón pide doble verificación.',
      },
      {
        hoy: 'La FTC (Safeguards Rule), el IRS (plan WISP) o tu aseguradora te piden controles.',
        con: 'Dejamos en orden el cifrado, los accesos y los respaldos que exigen.',
      },
      {
        hoy: 'Conectaste un agente de IA a WhatsApp y a tu CRM.',
        con: 'Revisamos que no pueda filtrar datos de clientes ni ser manipulado.',
      },
    ],
    guias: [
      { href: '/blog/ciberseguridad-negocios-latinos-estados-unidos', label: 'Negocios latinos en EE. UU.' },
      { href: '/blog/plan-wisp-irs-ftc-safeguards-preparadores-impuestos', label: 'Plan WISP del IRS' },
      { href: '/blog/fraude-ach-wire-facturas-falsas-contratistas', label: 'Fraude ACH y wire' },
      { href: '/blog/seguridad-agentes-ia-aws-bedrock-mcp', label: 'Agentes seguros en AWS' },
    ],
  },
];

const FLUJO_HERO: { n: string; paso: string; dato: string }[] = [
  { n: '01', paso: 'Entra un mensaje', dato: 'WhatsApp · web · SMS' },
  { n: '02', paso: 'Primera respuesta', dato: '< 60 seg · ES / EN' },
  { n: '03', paso: 'Calificación', dato: '1 pregunta por turno' },
  { n: '04', paso: 'Candados en código', dato: '0 precios inventados' },
  { n: '05', paso: 'Traspaso a tu vendedor', dato: 'resumen bilingüe' },
];

const DEFENSA_HERO: { n: string; paso: string; dato: string }[] = [
  { n: '01', paso: 'Correo y pagos', dato: 'SPF · DKIM · DMARC' },
  { n: '02', paso: 'Web y cumplimiento', dato: 'HTTPS · CSP · FTC / WISP' },
  { n: '03', paso: 'Accesos y agentes', dato: 'IAM · MFA · MCP' },
];

const GIROS_HERO = ['Contratistas', 'Impuestos y contabilidad', 'Clínicas', 'Logística', 'B2B'];

const ligaCls = 'text-obsidian underline decoration-hair underline-offset-2 hover:decoration-obsidian';
const fondoCls = 'text-[15px] font-medium tracking-[-0.02em] text-obsidian underline decoration-hair underline-offset-4 hover:decoration-obsidian';

function FranjasHero({ filas }: { filas: { n: string; paso: string; dato: string }[] }) {
  return (
    <ol className="mt-3 divide-y divide-hair border-y border-hair">
      {filas.map((x) => (
        <li key={x.n} className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-baseline gap-x-2 gap-y-1 py-[11px] sm:grid-cols-[1.75rem_minmax(0,1fr)_auto]">
          <span className="mono-label tabular-nums text-graphite">{x.n}</span>
          <span className="text-[14.5px] font-medium tracking-[-0.02em] text-obsidian">{x.paso}</span>
          <span className="mono-label col-start-2 tabular-nums text-charcoal sm:col-start-3 sm:text-right">{x.dato}</span>
        </li>
      ))}
    </ol>
  );
}

/** Viñeta corta con guion, como en /conocimiento. */
function Vin({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-pretty text-[15px] leading-[1.5] text-charcoal">
      <span aria-hidden className="mr-2 font-mono text-ash">
        –
      </span>
      {children}
    </li>
  );
}

/**
 * Una franja plegable: rótulo mono + línea en <h2> + «› Ver más». La usan los
 * tres productos del héroe (con `name`, acordeón exclusivo) y «Lo demás».
 */
export function Franja({
  id,
  rotulo,
  linea,
  name,
  ancho = false,
  children,
}: {
  id: string;
  rotulo: string;
  linea: React.ReactNode;
  name?: string;
  /** En «Lo demás»: rótulo a la izquierda y línea a la derecha desde md. */
  ancho?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details id={id} name={name} className={`${GRUPO[0]} scroll-mt-20`}>
      {/* El <h2> lleva solo la línea (titular limpio para buscadores y lectores de pantalla); «Ver más» va de hermano. */}
      <summary className={`${sumCls} block py-4 ${ancho ? 'md:grid md:grid-cols-[16ch_minmax(0,1fr)_auto] md:items-baseline md:gap-x-8' : 'lg:py-9'}`}>
        <span className={`mono-label block text-stone ${ancho ? 'mb-1.5 md:mb-0' : 'mb-2'}`}>{rotulo}</span>
        <h2
          className={`inline text-obsidian ${
            ancho
              ? 'text-[18px] leading-[1.35] tracking-[-0.02em]'
              : 'text-[19px] font-medium leading-[1.3] tracking-[-0.025em] sm:text-[21px]'
          }`}
        >
          {linea}
        </h2>
        {/* En móvil «Ver más» va en su renglón (misma forma en todas las franjas); desde md, en línea o en su columna. */}
        <span className="max-md:-ml-3 max-md:mt-1.5 max-md:block">
          <VerMas nivel={0} />
        </span>
      </summary>
      <div className="pb-6 pt-1">{children}</div>
    </details>
  );
}

/** Segundo nivel de «ver más» dentro de una franja. */
function VerMasInterno({ titulo, children }: { titulo: React.ReactNode; children: React.ReactNode }) {
  return (
    <details className={`${GRUPO[1]} mt-5`}>
      <summary className={`${sumCls} text-[15px] font-medium leading-[1.5] tracking-[-0.015em] text-obsidian`}>
        {titulo}
        <VerMas nivel={1} />
      </summary>
      <div className="pt-1">{children}</div>
    </details>
  );
}

function FilasHoy({ a }: { a: AreaHero }) {
  return (
    <>
      <p className="max-w-[52ch] text-pretty text-[15px] leading-[1.5] text-stone">{a.porque}</p>
      <div className="mono-label mt-5 hidden grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] items-end gap-x-6 border-b border-hair pb-2 text-stone sm:grid">
        <span>Hoy</span>
        <span>Con Omona</span>
      </div>
      <dl className="mt-4 divide-y divide-hair border-y border-hair sm:mt-0 sm:border-t-0">
        {a.filas.map((f) => (
          <div key={f.hoy} className="grid content-start gap-y-1.5 py-3.5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] sm:gap-x-6">
            <dt className="text-pretty text-[14px] leading-[1.45] text-stone">{f.hoy}</dt>
            <dd className="flex gap-2 text-[15px] font-medium leading-[1.4] tracking-[-0.015em] text-obsidian">
              <span aria-hidden className="text-stone sm:hidden">→</span>
              <span className="text-pretty">{f.con}</span>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function FondoArea({ a }: { a: AreaHero }) {
  return (
    <>
      <p className="mt-6">
        <Link href={a.mas.href} className={fondoCls}>
          {a.mas.label} →
        </Link>
      </p>
      <ul className="mono-label mt-4 flex flex-col gap-y-2 text-charcoal sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-1.5">
        <li className="text-stone">Guías</li>
        {a.guias.map((g) => (
          <li key={g.href}>
            <Link href={g.href} className="hover:text-obsidian">
              {g.label} →
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function Productos() {
  return (
    <div className="divide-y divide-hair border-y border-hair lg:border-t-0 lg:[&>details:first-child>summary]:pt-0">
      <Franja
        id="posicionamiento"
        name="producto"
        rotulo={rotuloProducto('posicionamiento')}
        linea={producto('posicionamiento').linea}
      >
        {/* Candado (encargo 27-nov-2026): sin nombre, precio, plan, clientes, resultados, cifras ni plazos. */}
        <ul className="grid gap-1.5">
          <Vin>Un producto con agente: que tu negocio aparezca cuando alguien pregunta.</Vin>
          <Vin>SEO es Google. GEO son los asistentes de IA: ChatGPT, Claude y Gemini.</Vin>
          <li>
            <details className={GRUPO[1]}>
              <summary className={`${sumCls} text-pretty text-[15px] leading-[1.5] text-charcoal`}>
                <span aria-hidden className="mr-2 font-mono text-ash">
                  –
                </span>
                La muestra del método es este mismo sitio.
                <VerMas nivel={1} />
              </summary>
              <ul className="mt-2 grid gap-1.5 border-l border-hair pl-4">
                <Vin>
                  <a href="/llms.txt" className={ligaCls}>llms.txt</a> y <a href="/llms-full.txt" className={ligaCls}>llms-full.txt</a>: el sitio
                  explicado para modelos de IA.
                </Vin>
                <Vin>
                  Verificadores gratuitos que contestan una pregunta real:{' '}
                  <Link href="/verificador-visibilidad-ia" className={ligaCls}>visibilidad en Google y asistentes de IA</Link>,{' '}
                  <Link href="/verificador-embudo-bilingue" className={ligaCls}>respuesta rápida</Link>,{' '}
                  <Link href="/verificador-dmarc-spf" className={ligaCls}>SPF/DMARC</Link> y{' '}
                  <Link href="/verificador-cabeceras-seguridad" className={ligaCls}>cabeceras de seguridad</Link>.
                </Vin>
                <Vin>
                  <Link href="/blog" className={ligaCls}>Notas con medición propia</Link>.
                </Vin>
                <Vin>
                  <Link href="/conocimiento" className={ligaCls}>Base de conocimiento</Link>: una línea por idea.
                </Vin>
              </ul>
            </details>
          </li>
        </ul>
        <p className="mt-6">
          <a href="mailto:victor@omona.tech" className={fondoCls}>
            Contacto: victor@omona.tech →
          </a>
        </p>
      </Franja>

      <Franja id="agentes" name="producto" rotulo={rotuloProducto('agentes')} linea={producto('agentes').linea}>
        <FilasHoy a={AREAS_HERO[0]} />
        <VerMasInterno titulo="Los 5 pasos">
          <FranjasHero filas={FLUJO_HERO} />
        </VerMasInterno>
        <FondoArea a={AREAS_HERO[0]} />
      </Franja>

      <Franja id="defensa" name="producto" rotulo={rotuloProducto('defensa')} linea={producto('defensa').linea}>
        <FilasHoy a={AREAS_HERO[1]} />
        <VerMasInterno titulo="Las 3 capas">
          <FranjasHero filas={DEFENSA_HERO} />
        </VerMasInterno>
        <FondoArea a={AREAS_HERO[1]} />
      </Franja>
    </div>
  );
}

// Orden en móvil: eyebrow + h1 + descripción → productos → botones + giros.
// En escritorio los productos van a la derecha, tras el divisor de 1 px.
export function Hero() {
  return (
    <header className="pb-12 pt-8 sm:pb-20 sm:pt-14">
      <Wrap>
        <div className="grid gap-8 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-0">
          <div className="lg:col-start-1 lg:row-start-1 lg:pr-10">
            <Eyebrow>{HERO_EYEBROW}</Eyebrow>
            {/* Una frase por renglón en todos los anchos: una por producto, mismo peso. El texto vive en lib/portada.ts (lo comparte la imagen que sale al compartir el dominio). */}
            <h1 className="text-heading-lg text-obsidian max-sm:text-[length:clamp(27px,8.3vw,31px)] lg:text-[52px]">
              {HERO_FRASES.map((f, i) => (
                <Fragment key={f}>
                  {i > 0 ? ' ' : null}
                  <span className="block">{f}</span>
                </Fragment>
              ))}
            </h1>
            <p id="hero-description" className="mt-5 max-w-[46ch] text-[15.5px] leading-[1.5] tracking-[-0.005em] text-charcoal sm:text-[18px] sm:tracking-normal">
              {HERO_DESC}
            </p>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:border-l lg:border-hair lg:pl-10">
            <Productos />
          </div>

          <div className="lg:col-start-1 lg:row-start-2 lg:pr-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-8">
              <Link href="/comercial-ia" className="btn-fill w-full sm:w-auto">
                Ver agentes bilingües →
              </Link>
              <a href="#diagnostico" className="btn-ghost w-full sm:w-auto">
                Evaluar mi dominio gratis →
              </a>
            </div>
            <ul className="mono-label mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-stone">
              {GIROS_HERO.map((g) => (
                <li key={g} className="whitespace-nowrap">{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </Wrap>
    </header>
  );
}

/** El diagnóstico gratuito, justo después del héroe (ancla #diagnostico desde la barra). */
export function Diagnostico() {
  return (
    <section className="pb-14 sm:pb-20">
      <Wrap>
        <DiagnosticoSaaS lang="es" />
      </Wrap>
    </section>
  );
}

// ── 2. Logos: contribuyo a / construyo sobre ────────────────────
// Uso nominativo: cada logo liga a la evidencia y el pie lo aclara.

function Celda({ m, lang }: { m: Marca; lang: 'es' | 'en' }) {
  const txt = lang === 'en' ? m.en : m.es;
  return (
    <a
      href={m.href}
      className="group flex min-h-[112px] flex-col justify-between gap-4 p-4 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obsidian/40 focus-visible:ring-inset sm:p-5"
      aria-label={`${m.nombre} (${m.dueno}): ${txt}`}
    >
      <span className="flex h-10 items-center gap-2.5 transition-[filter] group-hover:brightness-[0.25]">
        {m.logo ? (
          <img src={m.logo} alt="" aria-hidden="true" width={m.ancho} height={m.alto} style={{ height: m.alto }} className="w-auto" loading="lazy" decoding="async" />
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

/** Línea de contexto de una sección cuando va dentro de un «ver más» (variante compacta). */
function SubCompacto({ children, more }: { children: React.ReactNode; more?: { href: string; label: string } }) {
  return (
    <p className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[14px] leading-[1.5] text-stone">
      <span className="max-w-[70ch]">{children}</span>
      {more && (
        <a href={more.href} className="mono-label shrink-0 text-charcoal hover:text-obsidian">
          {more.label} →
        </a>
      )}
    </p>
  );
}

// ── 4. Ahora: la bitácora que se actualiza sola ─────────────────
// data/now/now.json lo arma scripts/now-refresh.mjs a diario (cron).

export function Ahora({ limite = 6, compacto = false }: { limite?: number; compacto?: boolean }) {
  const items = now.items.slice(0, limite);
  const sub = `Se arma sola cada día desde GitHub, el blog y mi agenda confirmada. Última entrada: ${fecha(`${now.updated}T12:00:00-06:00`)}.`;
  const cuerpo = (
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
  );
  if (compacto)
    return (
      <>
        <SubCompacto>{sub}</SubCompacto>
        {cuerpo}
      </>
    );
  return (
    <section className="py-8 sm:py-16" aria-labelledby="ahora">
      <Wrap>
        <Seccion id="ahora" eyebrow="Ahora" h="Qué estoy haciendo" sub={sub} more={{ href: '/now', label: 'Toda la bitácora' }} />
        {cuerpo}
      </Wrap>
    </section>
  );
}

// ── 5. Actividad: panel CLI con datos de GitHub ─────────────────

export function Actividad({ compacto = false }: { compacto?: boolean } = {}) {
  const s = oss.stats;
  const sub = 'Pull requests a proyectos de terceros y los reportes que los originaron. El estado es el que dice GitHub.';
  const cuerpo = (
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
  );
  if (compacto)
    return (
      <>
        <p className="mono-label mb-2 text-graphite">Actividad</p>
        <SubCompacto>{sub}</SubCompacto>
        {cuerpo}
      </>
    );
  return (
    <section className="pt-8 sm:pt-16" aria-labelledby="actividad">
      <Wrap>
        <Seccion id="actividad" eyebrow="Open source" h="Lo que estoy aportando" sub={sub} more={{ href: '/open-source', label: 'Todo en open source' }} />
        {cuerpo}
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

export function Proyectos({ compacto = false }: { compacto?: boolean } = {}) {
  const ps = oss.projects ?? [];
  if (!ps.length) return null;
  const sub = 'Herramientas y plantillas abiertas bajo licencia permisiva.';
  const more = { href: AUTOR.github, label: 'Todos en GitHub' };
  const cuerpo = (
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
  );
  if (compacto)
    return (
      <>
        <p className="mono-label mb-2 mt-8 text-graphite">Proyectos</p>
        <SubCompacto more={more}>{sub}</SubCompacto>
        {cuerpo}
      </>
    );
  return (
    <section className="py-8 sm:py-16" aria-labelledby="proyectos">
      <Wrap>
        <Seccion id="proyectos" h="Repositorios públicos" sub={sub} more={more} />
        {cuerpo}
      </Wrap>
    </section>
  );
}

// ── 8. Últimas notas ────────────────────────────────────────────

export function Notas({ compacto = false }: { compacto?: boolean } = {}) {
  const notas = getNotas().slice(0, 3);
  if (!notas.length) return null;
  const sub = 'Procesos comerciales con IA, seguridad de agentes y mediciones propias en producción.';
  const cuerpo = (
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
  );
  if (compacto)
    return (
      <>
        <SubCompacto>{sub}</SubCompacto>
        {cuerpo}
      </>
    );
  return (
    <section className="py-12 sm:py-24" aria-labelledby="notas">
      <Wrap>
        <Seccion id="notas" h="Notas de ingeniería" sub={sub} more={{ href: '/blog', label: 'Todas las notas' }} />
        {cuerpo}
      </Wrap>
    </section>
  );
}

// ── 9. Dirección técnica y respaldo legal ────────────────────────────────────

export function Quien({ compacto = false }: { compacto?: boolean } = {}) {
  const cuerpo = (
        <div className={`grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center ${compacto ? 'border-t border-hair pt-6' : 'border-y border-hair py-8'}`}>
          <div>
            <p className="mono-label text-graphite">Respaldo legal y dirección técnica</p>
            <p id={compacto ? undefined : 'quien'} className="mt-2 max-w-[64ch] text-[16px] leading-[1.5] text-obsidian">
              Omona atiende de forma remota y bilingüe a negocios hispanos en Estados Unidos y empresas en México; se representa y opera como persona moral formalmente establecida en México (León, Guanajuato), bajo la dirección técnica de {NOMBRE_LEGAL}.
            </p>
            <p className="mono-label mt-3 flex flex-wrap gap-x-4 gap-y-1 text-stone">
              <Link href="/seguridad" className="hover:text-obsidian">Alcance y aviso legal</Link>
              <Link href="/en/security" className="hover:text-obsidian">Security (EN-US)</Link>
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
  );
  if (compacto) return cuerpo;
  return (
    <section className="py-8 sm:py-16" aria-labelledby="quien">
      <Wrap>{cuerpo}</Wrap>
    </section>
  );
}

// ── 10. Lo demás, en una línea ──────────────────────────────────
// v6 (27-nov-2026): lo que antes estaba siempre visible (open source, notas,
// ahora, quién) queda plegado tras una línea, con el mismo patrón que los
// productos. Sigue completo en el HTML del servidor.

/** Hasta 5 líneas reales de la bóveda (data/conocimiento/boveda/), una por área, sin repetir la del rótulo. */
function ideasBoveda(): Tema[] {
  const vistas = new Set<string>();
  return getTemas('es')
    .filter((t) => t.origen === 'boveda' && t.slug !== 'boveda-poco-texto-pero-potente')
    .filter((t) => {
      const k = t.area ?? t.slug;
      if (vistas.has(k)) return false;
      vistas.add(k);
      return true;
    })
    .slice(0, 5);
}

function Fondo({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <p className="mt-6">
      <Link href={href} className={fondoCls}>
        {children} →
      </Link>
    </p>
  );
}

export function LoDemas() {
  const nNotas = getNotas().length;
  const ideas = ideasBoveda();
  return (
    <section aria-labelledby="lo-demas" className="pb-2 pt-14 sm:pb-4 sm:pt-20">
      <Wrap>
        <p id="lo-demas" className="eyebrow eyebrow-muted mb-4">
          Lo demás, en una línea
        </p>
        <div className="divide-y divide-hair border-y border-hair">
          <Franja ancho id="como-pienso" rotulo="Cómo pienso" linea="Poco texto, pero potente. Si te interesa, «ver más» y sale todo.">
            <ul className="grid gap-1.5">
              {ideas.map((t) => (
                <Vin key={t.slug}>
                  <Link href={`/conocimiento#${t.slug}`} className="hover:text-obsidian">
                    {t.linea}
                  </Link>
                </Vin>
              ))}
            </ul>
            <Fondo href="/conocimiento">Base de conocimiento completa</Fondo>
          </Franja>

          <Franja ancho id="open-source" rotulo="Open source" linea="Cuando algo se rompe, mando el arreglo al proyecto original.">
            <Actividad compacto />
            <Proyectos compacto />
            <Fondo href="/open-source">Todo en open source</Fondo>
          </Franja>

          <Franja ancho id="notas" rotulo="Notas" linea={`Guías con medición propia: ${nNotas} publicadas.`}>
            <Notas compacto />
            <Fondo href="/blog">Todas las notas</Fondo>
          </Franja>

          <Franja ancho id="ahora" rotulo="Ahora" linea="Lo que estoy haciendo hoy, actualizado solo cada día.">
            <Ahora compacto />
            <Fondo href="/now">Toda la bitácora</Fondo>
          </Franja>

          <Franja ancho id="quien" rotulo="Quién" linea="Dirección técnica: Víctor Alejandro Jiménez Gallo.">
            <Quien compacto />
            <Fondo href="/about">Perfil completo (EN)</Fondo>
          </Franja>
        </div>
      </Wrap>
    </section>
  );
}
