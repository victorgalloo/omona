/**
 * Definiciones del verificador de visibilidad en Google y asistentes de IA
 * (producto «Posicionamiento SEO + GEO»). Una sola fuente: la API
 * (app/api/visibilidad/route.ts) mide exactamente estos 10 controles y la página
 * (components/site/VerificadorVisibilidad.tsx) lista los mismos. Suman 100.
 */

export type IdControl =
  | 'indexable'
  | 'google_robots'
  | 'ia_robots'
  | 'sitemap'
  | 'llms_txt'
  | 'title'
  | 'description'
  | 'h1'
  | 'datos_estructurados'
  | 'texto_servidor';

export type DefControl = {
  id: IdControl;
  peso: number;
  nombre: { es: string; en: string };
  pasa: { es: string; en: string };
};

export const CONTROLES_VISIBILIDAD: readonly DefControl[] = [
  {
    id: 'indexable',
    peso: 15,
    nombre: { es: 'Portada indexable', en: 'Indexable homepage' },
    pasa: {
      es: 'La portada responde 200 y no lleva noindex (meta robots, meta googlebot ni cabecera X-Robots-Tag).',
      en: 'The homepage returns 200 with no noindex (robots meta, googlebot meta or X-Robots-Tag header).',
    },
  },
  {
    id: 'google_robots',
    peso: 10,
    nombre: { es: 'Google puede rastrear', en: 'Google can crawl' },
    pasa: {
      es: 'robots.txt no bloquea «/» para Googlebot (su grupo propio, o el de * si no hay). Sin robots.txt también pasa.',
      en: 'robots.txt does not block "/" for Googlebot (its own group, or * if none). No robots.txt also passes.',
    },
  },
  {
    id: 'ia_robots',
    peso: 15,
    nombre: { es: 'Asistentes de IA pueden leer', en: 'AI assistants can read' },
    pasa: {
      es: 'robots.txt no bloquea «/» a ninguno de los 8 rastreadores de OpenAI, Anthropic, Perplexity y Google (Gemini).',
      en: 'robots.txt does not block "/" for any of the 8 OpenAI, Anthropic, Perplexity and Google (Gemini) crawlers.',
    },
  },
  {
    id: 'sitemap',
    peso: 8,
    nombre: { es: 'Sitemap', en: 'Sitemap' },
    pasa: {
      es: 'robots.txt trae una línea Sitemap:, o /sitemap.xml responde 200 con <urlset> o <sitemapindex>.',
      en: 'robots.txt has a Sitemap: line, or /sitemap.xml returns 200 with <urlset> or <sitemapindex>.',
    },
  },
  {
    id: 'llms_txt',
    peso: 7,
    nombre: { es: 'llms.txt', en: 'llms.txt' },
    pasa: {
      es: '/llms.txt responde 200, no es HTML y tiene al menos un encabezado que empieza con #.',
      en: '/llms.txt returns 200, is not HTML and has at least one line starting with #.',
    },
  },
  {
    id: 'title',
    peso: 10,
    nombre: { es: 'Título', en: 'Title' },
    pasa: { es: 'Hay <title> de 15 a 60 caracteres.', en: 'There is a <title> of 15 to 60 characters.' },
  },
  {
    id: 'description',
    peso: 10,
    nombre: { es: 'Meta description', en: 'Meta description' },
    pasa: { es: 'Hay meta description de 70 a 160 caracteres.', en: 'There is a meta description of 70 to 160 characters.' },
  },
  {
    id: 'h1',
    peso: 5,
    nombre: { es: 'Un solo H1', en: 'Single H1' },
    pasa: { es: 'La portada tiene exactamente un <h1>.', en: 'The homepage has exactly one <h1>.' },
  },
  {
    id: 'datos_estructurados',
    peso: 10,
    nombre: { es: 'Datos estructurados', en: 'Structured data' },
    pasa: {
      es: 'Al menos un bloque application/ld+json que parsea como JSON y trae @type (también dentro de @graph).',
      en: 'At least one application/ld+json block that parses as JSON and has @type (inside @graph too).',
    },
  },
  {
    id: 'texto_servidor',
    peso: 10,
    nombre: { es: 'Texto sin JavaScript', en: 'Text without JavaScript' },
    pasa: {
      es: 'El HTML inicial, sin scripts, estilos ni etiquetas, trae al menos 150 palabras.',
      en: 'The initial HTML, without scripts, styles or tags, has at least 150 words.',
    },
  },
] as const;

export type Rastreador = { bot: string; de: string };

/** Los 8 rastreadores de asistentes de IA que revisa `ia_robots`, con su dueño. */
export const RASTREADORES_IA: readonly Rastreador[] = [
  { bot: 'GPTBot', de: 'OpenAI / ChatGPT' },
  { bot: 'OAI-SearchBot', de: 'OpenAI / ChatGPT' },
  { bot: 'ChatGPT-User', de: 'OpenAI / ChatGPT' },
  { bot: 'ClaudeBot', de: 'Anthropic / Claude' },
  { bot: 'Claude-SearchBot', de: 'Anthropic / Claude' },
  { bot: 'Claude-User', de: 'Anthropic / Claude' },
  { bot: 'PerplexityBot', de: 'Perplexity' },
  { bot: 'Google-Extended', de: 'Google / Gemini' },
] as const;

/** Forma de la línea base: porcentaje de la muestra que pasa cada control. */
export type BaseVisibilidad = { n: number; fecha: string; pasa: Record<IdControl, number> };

/**
 * Línea base: medición propia del 27-nov-2026 con estas mismas 10 definiciones
 * (~/.hermes/omona/posicionamiento/medir_visibilidad_us.py → medicion_visibilidad_us.json):
 * sitios de miembros de cámaras hispanas en EE. UU., lectura pasiva, 0 tokens.
 * Si re-mides, actualiza n, fecha y los porcentajes; `null` apaga toda comparación.
 */
export const BASE_VISIBILIDAD = {
  n: 595,
  fecha: '2026-11-27',
  pasa: {
    indexable: 99,
    google_robots: 99,
    ia_robots: 95,
    sitemap: 91,
    llms_txt: 28,
    title: 65,
    description: 44,
    h1: 54,
    datos_estructurados: 68,
    texto_servidor: 91,
  },
} as BaseVisibilidad | null;
