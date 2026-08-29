/**
 * Blog GEO — /blog (artículos) y /comparativas.
 * Server components: leen data/geo con el parser, cero cliente JS.
 * Estilo: mismo sistema terminal macOS + tokens del proyecto.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { getAllGeo, getArticulo, getComparativa, type GeoArticle } from "@/lib/geo/articles";
import { markdownToHtml } from "@/lib/geo/markdown";

const BASE = "https://omona.tech";

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

export function BlogIndex({ kind }: { kind: "articulo" | "comparativa" }) {
  const { articulos, comparativas } = getAllGeo();
  const items = kind === "articulo" ? articulos : comparativas;
  const titulo = kind === "articulo" ? "Blog" : "Comparativas";
  const desc = kind === "articulo"
    ? "Guías de IA para ventas B2B por WhatsApp, actualizadas y con fuentes."
    : "Omona frente a las alternativas, con honestidad competitiva.";
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-24">
        <Crumbs items={[{ label: "Inicio", href: "/" }, { label: titulo }]} />
        <p className="font-mono text-xs uppercase tracking-widest text-terminal-green mb-3">{titulo}</p>
        <h1 className="text-4xl font-semibold tracking-tight mb-3">
          {kind === "articulo" ? "Blog de Omona" : "Omona vs la competencia"}
        </h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">{desc}</p>
        <div className="grid gap-px bg-border rounded-lg overflow-hidden sm:grid-cols-2">
          {items.map((a) => (
            <Link
              key={a.slug}
              href={kind === "articulo" ? `/blog/${a.slug}` : `/comparativas/${a.slug}`}
              className="group bg-background p-6 hover:bg-surface transition-colors"
            >
              <h2 className="font-medium text-foreground group-hover:text-terminal-green transition-colors mb-2 leading-snug">
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

// ── Artículo / comparativa ──

function ArticleView({ a }: { a: GeoArticle }) {
  const html = markdownToHtml(a.body);
  const isComp = a.kind === "comparativa";
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-24">
        <Crumbs items={[
          { label: "Inicio", href: "/" },
          { label: isComp ? "Comparativas" : "Blog", href: isComp ? "/comparativas" : "/blog" },
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
              <h2 className="font-mono text-xs uppercase tracking-widest text-terminal-green mb-4">
                Puntos clave
              </h2>
              <ul className="grid gap-3">
                {a.claims.map((c, i) => (
                  <li key={i}
                      className="border-l-2 border-terminal-green bg-surface rounded-r-md px-5 py-3 text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: markdownToHtml(c).replace(/^<p>|<\/p>$/g, ""),
                      }} />
                ))}
              </ul>
            </section>
          )}
        </article>
        <div className="mt-16 pt-8 border-t border-dashed border-border">
          <Link href={isComp ? "/comparativas" : "/blog"}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Volver a {isComp ? "comparativas" : "blog"}
          </Link>
        </div>
      </div>
    </main>
  );
}

export function ArticuloPage({ slug }: { slug: string }) {
  const a = getArticulo(slug);
  if (!a) return null;
  return <ArticleView a={a} />;
}

export function ComparativaPage({ slug }: { slug: string }) {
  const c = getComparativa(slug);
  if (!c) return null;
  return <ArticleView a={c} />;
}

// ── Metadata + JSON-LD helpers para las rutas ──

export function geoMetadata(a: GeoArticle): Metadata {
  return {
    title: a.title,
    description: a.meta,
    alternates: {
      canonical: `${BASE}/${a.kind === "articulo" ? "blog" : "comparativas"}/${a.slug}/`,
    },
    openGraph: {
      title: a.title,
      description: a.meta,
      url: `${BASE}/${a.kind === "articulo" ? "blog" : "comparativas"}/${a.slug}/`,
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
    url: `${BASE}/${a.kind === "articulo" ? "blog" : "comparativas"}/${a.slug}/`,
    inLanguage: "es-MX",
    author: { "@type": "Organization", name: "Omona", url: BASE },
    publisher: { "@type": "Organization", name: "Omona", url: BASE },
  };
  return JSON.stringify(d);
}
