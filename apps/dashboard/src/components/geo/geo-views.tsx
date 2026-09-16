/**
 * Contenido GEO en markdown — /blog, /comparativas, /servicios y /delivery.
 * Server components: leen data/geo con el parser, cero cliente JS.
 * Estilo: mismo sistema terminal macOS + tokens del proyecto.
 */
import Link from "next/link";
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
    <nav aria-label="Ruta" className="font-mono text-xs text-muted-foreground mb-8">
      <ol className="flex gap-2 flex-wrap">
        {items.map((it, i) => (
          <li key={i}>
            {it.href ? (
              <Link href={it.href} className="hover:text-foreground transition-colors">{it.label}</Link>
            ) : (
              <span aria-current="page" className="text-foreground/70">{it.label}</span>
            )}
            {i < items.length - 1 && <span className="mx-1 text-muted-foreground/50">/</span>}
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
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-24">
        <Crumbs items={[{ label: "Inicio", href: "/" }, { label: crumb }]} />
        <p className="font-mono text-xs uppercase tracking-widest text-accent-green mb-3">{eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight mb-3">{h1}</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">{desc}</p>
        <div className="grid gap-px bg-border rounded-lg overflow-hidden sm:grid-cols-2">
          {items.map((a) => (
            <Link
              key={a.slug}
              href={geoUrl(a)}
              className="group bg-background p-6 hover:bg-surface transition-colors"
            >
              <h2 className="font-medium text-foreground group-hover:text-accent-green transition-colors mb-2 leading-snug">
                {a.title}
              </h2>
              <p className="text-sm text-muted-foreground">{a.meta.slice(0, 140)}…</p>
              {a.updated && (
                <p className="font-mono text-[11px] text-muted-foreground/60 mt-3">actualizado {a.updated.toLowerCase()}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

// ── Documento individual ──

function ArticleView({ a }: { a: GeoArticle }) {
  const html = markdownToHtml(a.body);
  const indice = INDICE[a.kind];
  const indiceHref = `/${GEO_KINDS[a.kind].segment}`;
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-24">
        <Crumbs items={[
          { label: "Inicio", href: "/" },
          { label: indice.crumb, href: indiceHref },
          { label: a.title.slice(0, 48) },
        ]} />
        <article>
          <h1 className="text-4xl font-semibold tracking-tight leading-tight mb-4">{a.h1}</h1>
          {a.updated && (
            <p className="font-mono text-xs text-muted-foreground mb-8">actualizado {a.updated.toLowerCase()}</p>
          )}
          <div className="geo-prose" dangerouslySetInnerHTML={{ __html: html }} />
          {a.claims.length > 0 && (
            <section className="mt-14" aria-label="Puntos clave">
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent-green mb-4">
                Puntos clave
              </h2>
              <ul className="grid gap-3">
                {a.claims.map((c, i) => (
                  <li key={i}
                      className="border-l-2 border-accent-green bg-surface rounded-r-md px-5 py-3 text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: markdownToHtml(c).replace(/^<p>|<\/p>$/g, ""),
                      }} />
                ))}
              </ul>
            </section>
          )}
        </article>
        <div className="mt-16 pt-8 border-t border-dashed border-border">
          <Link href={indiceHref}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Volver a {indice.crumb.toLowerCase()}
          </Link>
        </div>
      </div>
    </main>
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
    author: { "@type": "Organization", name: "Omona", url: BASE },
    publisher: { "@type": "Organization", name: "Omona", url: BASE },
  };
  return JSON.stringify(d);
}
