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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
