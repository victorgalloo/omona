const fs = require('fs');
const path = require('path');

/**
 * Slugs de las guías GEO retiradas del blog (data/geo/articles). Misma regla
 * que `slugify` en src/lib/geo/articles.ts: si cambias una, cambia la otra.
 */
function guiasGeo() {
  const dir = path.join(__dirname, 'data', 'geo', 'articles');
  if (!fs.existsSync(dir)) return [];
  const slug = (s) =>
    s
      .toLowerCase()
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
      .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
      .replace(/[‘’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  const notas = new Set(
    fs.existsSync(path.join(__dirname, 'data', 'notas'))
      ? fs.readdirSync(path.join(__dirname, 'data', 'notas')).map((f) => f.replace(/\.md$/, ''))
      : [],
  );
  return [...new Set(fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => slug(f.replace(/\.md$/, ''))))]
    .filter((s) => s && !notas.has(s));
}

/**
 * Content-Security-Policy del sitio (28-nov-2026). Es el control que el propio
 * verificador de cabeceras de Omona marcaba como brecha en omona.tech.
 *
 * `script-src` lleva 'unsafe-inline' a propósito: el App Router escribe su
 * estado en <script> en línea y la única forma de quitarlo es un nonce por
 * petición desde middleware, que vuelve dinámicas TODAS las páginas (hoy salen
 * de caché). Con esta política el verificador da «aviso», no «ok»; pasar a
 * nonce es una decisión de rendimiento y costo, no un descuido.
 *
 * Orígenes: Google Analytics 4 (gtag) es el único script de terceros; PostHog
 * sale por /ingest (mismo origen). `connect-src https: wss:` cubre Supabase y
 * la API del panel, cuyas URL viven en variables de entorno.
 */
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite levantar un segundo `next dev` sobre el mismo checkout sin que los
  // dos se peleen por `.next`: dos procesos compartiendo ese directorio se
  // corrompen mutuamente y las rutas empiezan a dar 404.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  // PostHog está configurado con api_host: '/ingest' (PostHogProvider.tsx) para
  // que los eventos salgan del propio dominio y no los bloqueen los ad-blockers.
  // Ese proxy nunca existió: cada evento hacía 308 → 404, así que la analítica
  // jamás registró nada y además se pagaban dos viajes de red fallidos.
  //
  // A propósito NO se activa skipTrailingSlashRedirect, aunque la documentación
  // de PostHog lo sugiera: es una bandera global que apagaría la redirección de
  // barra final en TODO el sitio, incluidas las landings de /soluciones y el
  // trabajo de GEO. Sin ella queda un salto 308 extra por lote de eventos, que
  // es inofensivo porque un 308 preserva método y cuerpo.
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://us.i.posthog.com/:path*' },
    ];
  },
  // /pricing existía cuando la oferta era autoservicio con dos planes visibles.
  // La página ya no publica cifras, así que la URL mentía sobre su contenido.
  // Redirección permanente para no perder lo que ya esté indexado o enlazado.
  //
  // 22-nov-2026: omona.tech dejó de presentar un producto. Es el laboratorio
  // open source de Victor (PRs, notas, about). Las rutas del producto se
  // retiraron de app/ y aquí responden 301 a la portada (o al blog, las guías
  // GEO de ventas por WhatsApp). El dashboard (/login, /inbox, …) sigue igual.
  async redirects() {
    const aInicio = [
      '/pricing',
      '/demo',
      '/demo/:path*',
      '/recorrido',
      '/recorrido/:path*',
      '/como-trabajamos',
      '/casos-de-uso',
      '/casos-de-uso/:path*',
      '/comparativas',
      '/comparativas/:path*',
      '/soluciones',
      '/soluciones/:path*',
      '/problemas',
      '/problemas/:path*',
      '/servicios',
      '/servicios/:path*',
      '/delivery',
      '/delivery/:path*',
      '/aplicar',
    ];
    return [
      { source: '/blog/como-usar-ia-en-whatsapp-para-hacer-lead-scoring-automatico-en-ventas-b2b', destination: '/blog/procesos-comerciales-ia-whatsapp-arquitectura', statusCode: 301 },
      { source: '/problemas', destination: '/comercial-ia', statusCode: 301 },
      { source: '/problemas/:path*', destination: '/comercial-ia', statusCode: 301 },
      { source: '/soluciones', destination: '/comercial-ia', statusCode: 301 },
      { source: '/soluciones/:path*', destination: '/comercial-ia', statusCode: 301 },
      ...aInicio.filter((s) => !s.startsWith('/problemas') && !s.startsWith('/soluciones')).map((source) => ({ source, destination: '/', statusCode: 301 })),
      { source: '/articulos/:path*', destination: '/blog', statusCode: 301 },
      ...guiasGeo().map((slug) => ({ source: `/blog/${slug}`, destination: '/blog', statusCode: 301 })),
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
