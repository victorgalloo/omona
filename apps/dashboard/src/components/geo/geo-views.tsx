/**
 * Contenido GEO en markdown — /blog, /comparativas, /servicios y /delivery.
 * Server components: leen data/geo con el parser, cero cliente JS.
 * Estilo: mismo sistema terminal macOS + tokens del proyecto.
 */
import Link from "next/link";
import { CTA_PROYECTO } from "@/lib/cta";
import type { Metadata } from "next";
import {
  GEO_KINDS,
  getGeo,
  getGeoBySlug,
  geoUrl,
  type GeoArticle,
  type GeoKind,
} from "@/lib/geo/articles";
import { markdownToHtml } from "@/lib/geo/markdown";
import { LandingNav } from "@/components/landing/LandingNav";
import { HomeFooter } from "@/components/home/HomeFooter";
import { NotasIndex } from "@/components/site/Blog";

const BASE = "https://omona.tech";

/**
 * Encabezado de cada índice. Está aquí y no en las rutas para que el <h1>, el
 * breadcrumb y la meta description de /blog, /comparativas, /servicios y
 * /delivery salgan del mismo sitio y no se contradigan.
 */
const INDICE: Record<GeoKind, { crumb: string; eyebrow: string; h1: string; desc: string }> = {
  articulo: {
    crumb: "Blog",
    eyebrow: "Blog",
    h1: "Blog de Omona",
    desc: "Guías de IA para ventas B2B por WhatsApp, actualizadas y con fuentes.",
  },
  comparativa: {
    crumb: "Comparativas",
    eyebrow: "Comparativas",
    h1: "Omona vs la competencia",
    desc: "Omona frente a las alternativas, con honestidad competitiva.",
  },
  servicio: {
    crumb: "Servicios",
    eyebrow: "Servicios",
    h1: "Cómo trabajamos con consultoras e integradores",
    desc: "Cinco formas de incorporar capacidad técnica de delivery: auditoría, sprint a producción, construcción completa, white-label y rescate.",
  },
  delivery: {
    crumb: "Delivery",
    eyebrow: "Delivery",
    h1: "Llevar automatizaciones Claude a producción",
    desc: "Arquitectura, permisos, evaluaciones, revisión humana, observabilidad y transferencia operativa. Lo que separa un piloto de un sistema que opera.",
  },
};

function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Ruta" className="mono-label mb-10 text-stone">
      <ol className="flex gap-2 flex-wrap">
        {items.map((it, i) => (
          <li key={i}>
            {it.href ? (
              <Link href={it.href} className="hover:text-obsidian transition-colors">{it.label}</Link>
            ) : (
              <span aria-current="page" className="text-charcoal">{it.label}</span>
            )}
            {i < items.length - 1 && <span className="mx-2 text-ash">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ── Índices ──

export function BlogIndex({ kind }: { kind: GeoKind }) {
  const items = getGeo(kind);
  const { crumb, eyebrow, h1, desc } = INDICE[kind];
  return (
    <div className="md min-h-screen bg-paper text-obsidian">
      <LandingNav />
      <main className="mx-auto w-full max-w-[1280px] px-6 pb-8 pt-12 lg:px-12">
        <Crumbs items={[{ label: "Inicio", href: "/" }, { label: crumb }]} />
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-heading-lg text-obsidian">{h1}</h1>
        <p className="mt-5 mb-14 max-w-2xl text-charcoal">{desc}</p>
        {kind === "articulo" && <NotasIndex />}
        {kind === "articulo" && (
          <div className="mb-8">
            <p className="eyebrow">Guías</p>
            <h2 className="text-heading text-obsidian">Ventas B2B por WhatsApp, con fuentes</h2>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <Link
              key={a.slug}
              href={geoUrl(a)}
              className="ring-card group flex flex-col p-4 transition-shadow hover:shadow-card-hover"
            >
              <h3 className="text-[16px] leading-[1.3] tracking-[-0.02em] text-obsidian">
                {a.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-charcoal">{a.meta.slice(0, 140)}…</p>
              {a.updated && (
                <p className="mono-label mt-auto pt-4 text-graphite">actualizado {a.updated.toLowerCase()}</p>
              )}
            </Link>
          ))}
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}

// ── Documento individual ──

function ArticleView({ a }: { a: GeoArticle }) {
  const html = markdownToHtml(a.body);
  const indice = INDICE[a.kind];
  const indiceHref = `/${GEO_KINDS[a.kind].segment}`;
  return (
    <div className="md min-h-screen bg-paper text-obsidian">
      <LandingNav />
      <main className="mx-auto max-w-3xl px-6 pt-12 pb-8">
        <Crumbs items={[
          { label: "Inicio", href: "/" },
          { label: indice.crumb, href: indiceHref },
          { label: a.title.slice(0, 48) },
        ]} />
        <article>
          <p className="eyebrow">Guía</p>
          <h1 className="text-heading-lg mb-4 text-obsidian">{a.h1}</h1>
          {a.updated && (
            <p className="mono-label mb-10 text-stone">actualizado {a.updated.toLowerCase()}</p>
          )}
          <div className="geo-prose" dangerouslySetInnerHTML={{ __html: html }} />
          {a.claims.length > 0 && (
            <section className="mt-14" aria-label="Puntos clave">
              <h2 className="eyebrow mb-4">
                Puntos clave
              </h2>
              <ul className="grid gap-3">
                {a.claims.map((c, i) => (
                  <li key={i}
                      className="ring-card px-4 py-3 text-sm text-charcoal"
                      dangerouslySetInnerHTML={{
                        __html: markdownToHtml(c).replace(/^<p>|<\/p>$/g, ""),
                      }} />
                ))}
              </ul>
            </section>
          )}
        </article>

        {/* Cierre del artículo.
            Los 74 documentos del corpus terminaban en "← Volver a blog" y nada
            más: tráfico de búsqueda llegando a leer y ninguna forma de
            escribir. Era la fuga más cara del sitio, porque el costo de traer
            a esa persona ya estaba pagado.
            El texto vive aquí y no en cada .md a propósito: son 74 archivos y
            el día que cambie la oferta habría que editarlos uno por uno. */}
        <aside className="ring-card mt-16 p-6">
          <p className="eyebrow">
            ¿te suena tu negocio?
          </p>
          <h2 className="mb-3 max-w-[24ch] text-heading text-obsidian">
            Si vendes por WhatsApp, esto se te puede construir.
          </h2>
          <p className="mb-6 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
            Cuéntame cómo vendes hoy y qué se te está cayendo. Te contesto con qué haría yo y
            cuánto tardaría. Si no te lo puedo resolver, te lo digo de una vez.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={CTA_PROYECTO}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fill"
            >
              Cuéntame tu caso
            </a>
            <Link
              href="/demo"
              className="btn-ghost"
            >
              Probar el sistema
            </Link>
          </div>
        </aside>

        <div className="mt-12">
          <Link href={indiceHref}
                className="mono-label text-charcoal hover:text-obsidian transition-colors">
            ← Volver a {indice.crumb.toLowerCase()}
          </Link>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}

export function GeoPage({ kind, slug }: { kind: GeoKind; slug: string }) {
  const a = getGeoBySlug(kind, slug);
  if (!a) return null;
  return <ArticleView a={a} />;
}

export function ArticuloPage({ slug }: { slug: string }) {
  return <GeoPage kind="articulo" slug={slug} />;
}

export function ComparativaPage({ slug }: { slug: string }) {
  return <GeoPage kind="comparativa" slug={slug} />;
}

// ── Metadata + JSON-LD helpers para las rutas ──

export function geoMetadata(a: GeoArticle): Metadata {
  // Sin slash final: next.config.js fija trailingSlash: false, así que el
  // canonical con slash apuntaba a una URL que respondía 308 hacia sí misma.
  const url = `${BASE}${geoUrl(a)}`;
  return {
    title: a.title,
    description: a.meta,
    alternates: { canonical: url },
    openGraph: {
      title: a.title,
      description: a.meta,
      url,
      siteName: "Omona",
      type: "article",
    },
  };
}

export function articleJsonLd(a: GeoArticle): string {
  if (a.jsonld) return a.jsonld;
  const d = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.meta,
    url: `${BASE}${geoUrl(a)}`,
    inLanguage: "es-MX",
    author: { "@type": "Organization", "@id": `${BASE}/#org`, name: "Omona", url: BASE },
    publisher: { "@type": "Organization", "@id": `${BASE}/#org`, name: "Omona", url: BASE },
  };
  return JSON.stringify(d);
}
