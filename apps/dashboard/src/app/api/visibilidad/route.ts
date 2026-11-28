import { NextResponse } from 'next/server';
import { BASE_VISIBILIDAD, CONTROLES_VISIBILIDAD, RASTREADORES_IA, type IdControl } from '@/lib/visibilidad';

export const runtime = 'nodejs';

/**
 * Verificador pasivo de visibilidad en Google y asistentes de IA (producto «Posicionamiento SEO + GEO»).
 * 0 tokens de LLM: como máximo 4 GET al dominio del usuario (portada, /robots.txt, /llms.txt y
 * /sitemap.xml solo si robots.txt no declara Sitemap:). Nunca envía formularios, nunca prueba
 * rutas ocultas. Los 10 controles y sus pesos viven en lib/visibilidad.ts.
 */

/**
 * Porcentaje de la muestra que pasa cada control. `null` hasta que exista una medición real;
 * mientras sea `null` la interfaz no muestra comparación. Forma: { n, fecha, pasa: { [id]: % entero } }.
 */
const BASE = BASE_VISIBILIDAD;

type Control = { id: IdControl; pasa: boolean; peso: number; hallazgo: string; arreglo: string };
type Lector = { bot: string; de: string; permitido: boolean; grupo: 'propio' | '*' | null };

const DOMINIO_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;
const BLOQUEADOS = /\.(?:local|internal|localhost|arpa|onion|gov|mil|edu|gob\.[a-z]{2,3}|edu\.[a-z]{2,3})$/i;
const MAX_HTML = 393216;
const MAX_TXT = 65536;
const UA = 'OmonaVisibilityCheck/1.0 (+https://omona.tech/verificador-visibilidad-ia)';

function limpiarDominio(raw: string): string | null {
  let d = String(raw || '').trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').split('/')[0].split('?')[0].split('#')[0].split(':')[0];
  d = d.replace(/^www\./, '');
  if (!d || d.length > 190 || !DOMINIO_RE.test(d) || BLOQUEADOS.test(d)) return null;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(d)) return null;
  return d;
}

// Defensa SSRF: el host tiene que resolver a IPs públicas antes de pedirle nada.
function ipPrivada(ip: string): boolean {
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return true;
  const [a, b] = p;
  return (
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

async function resuelvePublico(host: string): Promise<boolean> {
  try {
    const u = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=A`;
    const r = await fetch(u, { headers: { accept: 'application/dns-json' }, signal: AbortSignal.timeout(4000) });
    if (!r.ok) return false;
    const j = (await r.json()) as { Answer?: { type?: number; data?: string }[] };
    const ips = (j.Answer ?? []).filter((a) => a.type === 1).map((a) => String(a.data || ''));
    return ips.length > 0 && ips.every((ip) => !ipPrivada(ip));
  } catch {
    return false;
  }
}

const RE_RETO = /<title>\s*(?:Just a moment|Attention Required|Access denied|Un momento)|challenge-platform|cf-chl-|_Incapsula_Resource|captcha-delivery\.com/i;

type Lectura = { status: number; url: string; ctype: string; headers: Headers; texto: string };

/** Un GET con tope de bytes y de tiempo. `null` = no respondió (red, DNS, TLS o tiempo). */
async function leer(url: string, maxBytes: number, ms: number, accept: string): Promise<Lectura | null> {
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': UA, accept, 'accept-language': 'es-US,es;q=0.9,en;q=0.8' },
      signal: AbortSignal.timeout(ms),
    });
    const reader = r.body?.getReader();
    const partes: Uint8Array[] = [];
    let total = 0;
    if (reader) {
      while (total < maxBytes) {
        const { value, done } = await reader.read();
        if (done || !value) break;
        partes.push(value);
        total += value.length;
      }
      await reader.cancel().catch(() => {});
    }
    const buf = new Uint8Array(Math.min(total, maxBytes));
    let off = 0;
    for (const p of partes) {
      const s = p.slice(0, Math.max(0, buf.length - off));
      buf.set(s, off);
      off += s.length;
      if (off >= buf.length) break;
    }
    return {
      status: r.status,
      url: r.url || url,
      ctype: (r.headers.get('content-type') || '').toLowerCase(),
      headers: r.headers,
      texto: new TextDecoder().decode(buf),
    };
  } catch {
    return null;
  }
}

// ── HTML ────────────────────────────────────────────────────────────────────
function decodificar(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => safeChar(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => safeChar(parseInt(d, 10)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&hellip;/gi, '…')
    .replace(/&amp;/gi, '&');
}
function safeChar(n: number): string {
  try {
    return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '';
  } catch {
    return '';
  }
}
const limpio = (s: string) => decodificar(s).replace(/\s+/g, ' ').trim();
const largo = (s: string) => Array.from(s).length;

function atributos(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  const cuerpo = tag.replace(/^<\s*[a-z0-9]+/i, '').replace(/\/?>$/, '');
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const m of Array.from(cuerpo.matchAll(re))) {
    const k = m[1].toLowerCase();
    if (!(k in out)) out[k] = decodificar(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return out;
}

const etiquetas = (html: string, nombre: string) =>
  (html.match(new RegExp(`<${nombre}\\b[^>]*>`, 'gi')) ?? []).map(atributos);

function noindexEnCabecera(valor: string): boolean {
  // X-Robots-Tag: «noindex», «googlebot: noindex, nofollow» u «otrobot: noindex» (este último no aplica a Google).
  const NO_UA = new Set(['unavailable_after', 'max-snippet', 'max-image-preview', 'max-video-preview']);
  let ua: string | null = null;
  for (const token of valor.split(',')) {
    let dir = token;
    const m = token.match(/^\s*([a-z0-9_-]+)\s*:\s*(.*)$/i);
    if (m && !NO_UA.has(m[1].toLowerCase())) {
      ua = m[1].toLowerCase();
      dir = m[2];
    }
    const d = dir.trim().toLowerCase();
    if ((d === 'noindex' || d === 'none') && (ua === null || ua === 'googlebot')) return true;
  }
  return false;
}

function conTipo(x: unknown, tipos: string[]): boolean {
  if (Array.isArray(x)) return x.map((y) => conTipo(y, tipos)).some(Boolean);
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  let hay = false;
  const t = o['@type'];
  if ((typeof t === 'string' && t) || (Array.isArray(t) && t.length)) {
    hay = true;
    for (const v of Array.isArray(t) ? t : [t]) if (typeof v === 'string' && !tipos.includes(v)) tipos.push(v);
  }
  if (Array.isArray(o['@graph']) && conTipo(o['@graph'], tipos)) hay = true;
  return hay;
}

// ── robots.txt ──────────────────────────────────────────────────────────────
type Regla = { tipo: 'allow' | 'disallow'; valor: string };
type Robots = { grupos: { agentes: string[]; reglas: Regla[] }[]; sitemaps: string[] };

function parsearRobots(txt: string): Robots {
  const grupos: Robots['grupos'] = [];
  const sitemaps: string[] = [];
  let actual: Robots['grupos'][number] | null = null;
  let ultimoFueAgente = false;
  for (const crudo of txt.replace(/^﻿/, '').split(/\r?\n|\r/)) {
    const linea = crudo.replace(/#.*$/, '').trim();
    const m = linea.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const clave = m[1].toLowerCase();
    const valor = m[2].trim();
    if (clave === 'sitemap') {
      if (valor) sitemaps.push(valor);
      continue;
    }
    if (clave === 'user-agent') {
      // Varias líneas User-agent seguidas comparten grupo.
      if (!actual || !ultimoFueAgente) {
        actual = { agentes: [], reglas: [] };
        grupos.push(actual);
      }
      actual.agentes.push(valor.split('/')[0].trim().toLowerCase());
      ultimoFueAgente = true;
      continue;
    }
    if ((clave === 'allow' || clave === 'disallow') && actual) {
      actual.reglas.push({ tipo: clave, valor });
      ultimoFueAgente = false;
      continue;
    }
    ultimoFueAgente = false;
  }
  return { grupos, sitemaps };
}

/** Reglas que aplican a un rastreador: su grupo propio (fusionado si se repite) o, si no hay, el de «*». */
function reglasPara(r: Robots, bot: string): { reglas: Regla[]; grupo: 'propio' | '*' | null } {
  const b = bot.toLowerCase();
  const propias = r.grupos.filter((g) => g.agentes.includes(b));
  if (propias.length) return { reglas: propias.flatMap((g) => g.reglas), grupo: 'propio' };
  const todos = r.grupos.filter((g) => g.agentes.includes('*'));
  if (todos.length) return { reglas: todos.flatMap((g) => g.reglas), grupo: '*' };
  return { reglas: [], grupo: null };
}

/** «Bloquea /» = Disallow: / (o /*) exacto y sin Allow: / exacto. No resuelve reglas parciales. */
const bloqueaRaiz = (reglas: Regla[]) =>
  reglas.some((x) => x.tipo === 'disallow' && (x.valor === '/' || x.valor === '/*')) &&
  !reglas.some((x) => x.tipo === 'allow' && x.valor === '/');

const esHtml = (l: Lectura) => l.ctype.includes('html') || /^\s*(?:<!doctype html|<html)/i.test(l.texto.slice(0, 500));

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { dominio?: string; lang?: 'es' | 'en' };
    const en = body.lang === 'en';
    const L = (es: string, eng: string) => (en ? eng : es);
    const dominio = limpiarDominio(body.dominio || '');
    if (!dominio) {
      return NextResponse.json(
        { error: L('Escribe un dominio válido (ej. tunegocio.com). Dominios de gobierno, educación o internos están excluidos.', 'Enter a valid domain (e.g. yourbusiness.com). Government, education and internal domains are excluded.') },
        { status: 400 },
      );
    }
    const [pub, pubWww] = await Promise.all([resuelvePublico(dominio), resuelvePublico(`www.${dominio}`)]);
    if (!pub && !pubWww) {
      return NextResponse.json(
        { error: L(`${dominio} no resuelve a una IP pública.`, `${dominio} does not resolve to a public IP address.`) },
        { status: 422 },
      );
    }

    // GET 1: portada (un solo intento, siguiendo redirecciones). Si el dominio desnudo no resuelve, se pide www.
    const portada = await leer(pub ? `https://${dominio}/` : `https://www.${dominio}/`, MAX_HTML, 6500, 'text/html,application/xhtml+xml');
    if (!portada) {
      return NextResponse.json(
        { error: L(`No se pudo leer la portada de ${dominio} en 6 segundos.`, `Could not read the ${dominio} homepage within 6 seconds.`) },
        { status: 422 },
      );
    }
    if (portada.status >= 400 || RE_RETO.test(portada.texto.slice(0, 20000))) {
      return NextResponse.json(
        {
          error: L(
            `${dominio} responde con un reto anti-bot o un error HTTP (${portada.status}) a lectores automáticos, así que no calificamos una página que no es tu portada real. Si es tu sitio, revisa que Google y los rastreadores de los asistentes de IA sí puedan leerla.`,
            `${dominio} answers automated readers with an anti-bot challenge or an HTTP error (${portada.status}), so we do not score a page that is not your real homepage. If it is your site, make sure Google and AI assistant crawlers can read it.`,
          ),
        },
        { status: 422 },
      );
    }
    if (!esHtml(portada)) {
      return NextResponse.json(
        { error: L(`La portada de ${dominio} no devolvió HTML.`, `The ${dominio} homepage did not return HTML.`) },
        { status: 422 },
      );
    }

    const final = new URL(portada.url);
    if (final.hostname !== dominio && final.hostname !== `www.${dominio}` && !(await resuelvePublico(final.hostname))) {
      return NextResponse.json(
        { error: L(`La portada redirige a ${final.hostname}, que no resuelve a una IP pública.`, `The homepage redirects to ${final.hostname}, which does not resolve to a public IP address.`) },
        { status: 422 },
      );
    }
    const origen = final.origin;

    // GET 2 y 3: robots.txt y llms.txt en el mismo origen al que llegó la portada.
    const [robotsL, llmsL] = await Promise.all([
      leer(`${origen}/robots.txt`, MAX_TXT, 4000, 'text/plain,*/*;q=0.5'),
      leer(`${origen}/llms.txt`, MAX_TXT, 4000, 'text/plain,text/markdown,*/*;q=0.5'),
    ]);
    const robotsOk = !!robotsL && robotsL.status === 200 && !esHtml(robotsL);
    const robotsAusente = !!robotsL && ((robotsL.status >= 400 && robotsL.status < 500) || (robotsL.status === 200 && esHtml(robotsL)));
    const robots = robotsOk ? parsearRobots(robotsL!.texto) : { grupos: [], sitemaps: [] };
    const robotsIlegible = !robotsOk && !robotsAusente; // 5xx o sin respuesta: Google lo trata como bloqueo total.

    // GET 4 (opcional): /sitemap.xml solo si robots.txt no declara Sitemap:.
    let sitemapL: Lectura | null = null;
    if (!robots.sitemaps.length) sitemapL = await leer(`${origen}/sitemap.xml`, MAX_TXT, 4000, 'application/xml,text/xml,*/*;q=0.5');

    const html = portada.texto;
    const head = html.split(/<\/head>/i)[0];
    const metas = etiquetas(html, 'meta');
    const links = etiquetas(html, 'link');
    const contenidoMeta = (n: string) => metas.find((m) => (m.name || '').toLowerCase() === n)?.content;

    const titleRaw = limpio((head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) ?? html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i))?.[1] ?? '');
    const descRaw = limpio(contenidoMeta('description') ?? '');
    const canonical = links.find((l) => (l.rel || '').toLowerCase().split(/\s+/).includes('canonical'))?.href ?? null;
    const ogImage = metas.some((m) => (m.property || m.name || '').toLowerCase() === 'og:image' && !!(m.content || '').trim());
    const lang = atributos((html.match(/<html\b[^>]*>/i) ?? [''])[0] || '<html>').lang ?? null;
    const hreflang = links
      .filter((l) => (l.rel || '').toLowerCase().split(/\s+/).includes('alternate') && l.hreflang)
      .map((l) => ({ hreflang: l.hreflang, href: l.href ?? '' }));

    const controles: Control[] = [];
    const def = (id: IdControl) => CONTROLES_VISIBILIDAD.find((c) => c.id === id)!;
    const push = (id: IdControl, pasa: boolean, hallazgo: string, arreglo: string) => controles.push({ id, pasa, peso: def(id).peso, hallazgo, arreglo });

    // 1. indexable
    const metaRobots = [contenidoMeta('robots'), contenidoMeta('googlebot')].filter(Boolean).join(', ');
    const noindexMeta = /\b(?:noindex|none)\b/i.test(metaRobots);
    const xrt = portada.headers.get('x-robots-tag') || '';
    const noindexHdr = !!xrt && noindexEnCabecera(xrt);
    push(
      'indexable',
      portada.status === 200 && !noindexMeta && !noindexHdr,
      portada.status !== 200
        ? L(`La portada responde ${portada.status}, no 200.`, `The homepage returns ${portada.status}, not 200.`)
        : noindexMeta
          ? L(`<meta name="robots"> dice «${metaRobots}»: Google no la indexa.`, `<meta name="robots"> says "${metaRobots}": Google will not index it.`)
          : noindexHdr
            ? L(`La cabecera X-Robots-Tag dice «${xrt}»: Google no la indexa.`, `The X-Robots-Tag header says "${xrt}": Google will not index it.`)
            : L(`200 sin noindex${metaRobots ? ` (meta robots: «${metaRobots}»)` : ''}.`, `200 with no noindex${metaRobots ? ` (robots meta: "${metaRobots}")` : ''}.`),
      portada.status !== 200
        ? L('Haz que la URL principal responda 200 directo o con una sola redirección 301.', 'Make the main URL return 200 directly or through a single 301 redirect.')
        : noindexMeta || noindexHdr
          ? L('Quita noindex de la portada (meta robots o cabecera X-Robots-Tag) si quieres aparecer en Google.', 'Remove noindex from the homepage (robots meta or X-Robots-Tag header) if you want to appear on Google.')
          : L('Nada que cambiar: revisa que el noindex no se cuele al publicar desde un entorno de pruebas.', 'Nothing to change: make sure a staging noindex never ships to production.'),
    );

    // 2. google_robots
    const g = reglasPara(robots, 'Googlebot');
    const gBloq = robotsIlegible || bloqueaRaiz(g.reglas);
    const estadoRobots = robotsAusente
      ? L('No hay robots.txt', 'No robots.txt')
      : robotsIlegible
        ? L(`robots.txt no se pudo leer (${robotsL ? robotsL.status : L('sin respuesta', 'no response')}); Google lo trata como bloqueo total`, `robots.txt could not be read (${robotsL ? robotsL.status : 'no response'}); Google treats that as a full block`)
        : '';
    push(
      'google_robots',
      !gBloq,
      estadoRobots
        ? `${estadoRobots}.`
        : g.grupo
          ? L(`Grupo ${g.grupo === 'propio' ? 'User-agent: Googlebot' : 'User-agent: *'}: ${bloqueaRaiz(g.reglas) ? 'Disallow: / sin Allow: /' : 'no bloquea /'}.`, `Group ${g.grupo === 'propio' ? 'User-agent: Googlebot' : 'User-agent: *'}: ${bloqueaRaiz(g.reglas) ? 'Disallow: / with no Allow: /' : 'does not block /'}.`)
          : L('robots.txt no tiene grupo para Googlebot ni para *.', 'robots.txt has no group for Googlebot or *.'),
      gBloq
        ? robotsIlegible
          ? L('Haz que /robots.txt responda 200 (o 404 si no lo usas); un 5xx frena el rastreo.', 'Make /robots.txt return 200 (or 404 if unused); a 5xx stalls crawling.')
          : L(`Quita «Disallow: /» del grupo ${g.grupo === 'propio' ? 'Googlebot' : '*'} en robots.txt.`, `Remove "Disallow: /" from the ${g.grupo === 'propio' ? 'Googlebot' : '*'} group in robots.txt.`)
        : L('Nada que cambiar.', 'Nothing to change.'),
    );

    // 3. ia_robots
    const rastreadores: Lector[] = RASTREADORES_IA.map((r) => {
      const x = reglasPara(robots, r.bot);
      return { bot: r.bot, de: r.de, permitido: !robotsIlegible && !bloqueaRaiz(x.reglas), grupo: x.grupo };
    });
    const bloqueados = rastreadores.filter((r) => !r.permitido);
    push(
      'ia_robots',
      bloqueados.length === 0,
      robotsIlegible
        ? `${estadoRobots}.`
        : bloqueados.length
          ? L(`Bloqueados (Disallow: /): ${bloqueados.map((b) => `${b.bot}${b.grupo === '*' ? ' (por *)' : ''}`).join(', ')}.`, `Blocked (Disallow: /): ${bloqueados.map((b) => `${b.bot}${b.grupo === '*' ? ' (via *)' : ''}`).join(', ')}.`)
          : L(`Los 8 rastreadores pueden leer «/»${robotsAusente ? ' (no hay robots.txt)' : ''}.`, `All 8 crawlers can read "/"${robotsAusente ? ' (no robots.txt)' : ''}.`),
      bloqueados.length
        ? robotsIlegible
          ? L('Haz que /robots.txt responda 200 (o 404 si no lo usas).', 'Make /robots.txt return 200 (or 404 if unused).')
          : L(`Si quieres que te citen, quita «Disallow: /» para ${bloqueados.map((b) => b.bot).join(', ')} en robots.txt.`, `If you want to be cited, remove "Disallow: /" for ${bloqueados.map((b) => b.bot).join(', ')} in robots.txt.`)
        : L('Nada que cambiar: revisa también que tu CDN o firewall no los rechace.', 'Nothing to change: also check that your CDN or firewall does not reject them.'),
    );

    // 4. sitemap
    const smXml = !!sitemapL && sitemapL.status === 200 && /<(?:urlset|sitemapindex)\b/i.test(sitemapL.texto);
    const smPasa = robots.sitemaps.length > 0 || smXml;
    push(
      'sitemap',
      smPasa,
      robots.sitemaps.length
        ? L(`robots.txt declara: ${robots.sitemaps[0]}${robots.sitemaps.length > 1 ? ` (+${robots.sitemaps.length - 1})` : ''}.`, `robots.txt declares: ${robots.sitemaps[0]}${robots.sitemaps.length > 1 ? ` (+${robots.sitemaps.length - 1})` : ''}.`)
        : smXml
          ? L('/sitemap.xml responde 200 con un sitemap válido, pero robots.txt no lo declara.', '/sitemap.xml returns 200 with a valid sitemap, but robots.txt does not declare it.')
          : L(`Sin línea Sitemap: en robots.txt y /sitemap.xml ${sitemapL ? `responde ${sitemapL.status}${sitemapL.status === 200 ? ' sin <urlset> ni <sitemapindex>' : ''}` : 'no respondió'}.`, `No Sitemap: line in robots.txt and /sitemap.xml ${sitemapL ? `returns ${sitemapL.status}${sitemapL.status === 200 ? ' with no <urlset> or <sitemapindex>' : ''}` : 'did not respond'}.`),
      smPasa
        ? robots.sitemaps.length
          ? L('Nada que cambiar.', 'Nothing to change.')
          : L(`Agrega «Sitemap: ${origen}/sitemap.xml» a robots.txt.`, `Add "Sitemap: ${origen}/sitemap.xml" to robots.txt.`)
        : L(`Publica /sitemap.xml con tus páginas y declara «Sitemap: ${origen}/sitemap.xml» en robots.txt.`, `Publish /sitemap.xml with your pages and declare "Sitemap: ${origen}/sitemap.xml" in robots.txt.`),
    );

    // 5. llms_txt
    const llmsHtml = !!llmsL && esHtml(llmsL);
    const llmsTitulo = !!llmsL && /^#/m.test(llmsL.texto.replace(/^﻿/, ''));
    const llmsPasa = !!llmsL && llmsL.status === 200 && !llmsHtml && llmsTitulo;
    push(
      'llms_txt',
      llmsPasa,
      !llmsL
        ? L('/llms.txt no respondió.', '/llms.txt did not respond.')
        : llmsL.status !== 200
          ? L(`/llms.txt responde ${llmsL.status}.`, `/llms.txt returns ${llmsL.status}.`)
          : llmsHtml
            ? L('/llms.txt devuelve HTML (probablemente tu página de error o la portada).', '/llms.txt returns HTML (probably your error page or homepage).')
            : llmsTitulo
              ? L(`/llms.txt existe (${largo(llmsL.texto)} caracteres leídos) y empieza con encabezados #.`, `/llms.txt exists (${largo(llmsL.texto)} characters read) with # headings.`)
              : L('/llms.txt existe pero no tiene ninguna línea que empiece con #.', '/llms.txt exists but has no line starting with #.'),
      llmsPasa
        ? L('Nada que cambiar: mantenlo al día cuando cambien tus páginas.', 'Nothing to change: keep it current as your pages change.')
        : L('Publica /llms.txt en texto plano: «# Tu negocio», una línea de qué haces y ligas a tus páginas clave.', 'Publish /llms.txt as plain text: "# Your business", one line on what you do, and links to key pages.'),
    );

    // 6. title
    const tl = largo(titleRaw);
    push(
      'title',
      tl >= 15 && tl <= 60,
      titleRaw ? L(`«${titleRaw}» (${tl} caracteres).`, `"${titleRaw}" (${tl} characters).`) : L('Sin <title>.', 'No <title>.'),
      !titleRaw
        ? L('Agrega un <title> de 15 a 60 caracteres: qué haces y dónde, luego tu marca.', 'Add a 15–60 character <title>: what you do and where, then your brand.')
        : tl > 60
          ? L(`Recórtalo ${tl - 60} caracteres: Google lo corta en la pantalla de resultados.`, `Trim it by ${tl - 60} characters: Google cuts it in results.`)
          : tl < 15
            ? L(`Alárgalo ${15 - tl} caracteres o más: di qué haces y dónde, no solo tu marca.`, `Lengthen it by at least ${15 - tl} characters: say what you do and where, not just your brand.`)
            : L('Nada que cambiar.', 'Nothing to change.'),
    );

    // 7. description
    const dl = largo(descRaw);
    push(
      'description',
      dl >= 70 && dl <= 160,
      descRaw ? L(`«${descRaw}» (${dl} caracteres).`, `"${descRaw}" (${dl} characters).`) : L('Sin meta description.', 'No meta description.'),
      !descRaw
        ? L('Agrega <meta name="description"> de 70 a 160 caracteres que conteste qué ofreces y a quién.', 'Add a 70–160 character <meta name="description"> that says what you offer and to whom.')
        : dl > 160
          ? L(`Recórtala ${dl - 160} caracteres.`, `Trim it by ${dl - 160} characters.`)
          : dl < 70
            ? L(`Alárgala ${70 - dl} caracteres o más con qué ofreces y a quién.`, `Lengthen it by at least ${70 - dl} characters with what you offer and to whom.`)
            : L('Nada que cambiar.', 'Nothing to change.'),
    );

    // 8. h1
    const h1s = html.match(/<h1\b/gi)?.length ?? 0;
    push(
      'h1',
      h1s === 1,
      L(`${h1s} etiqueta${h1s === 1 ? '' : 's'} <h1> en la portada.`, `${h1s} <h1> tag${h1s === 1 ? '' : 's'} on the homepage.`),
      h1s === 1
        ? L('Nada que cambiar.', 'Nothing to change.')
        : h1s === 0
          ? L('Pon un <h1> con lo que haces; si tu tema lo dibuja como imagen o con JavaScript, no cuenta.', 'Add one <h1> stating what you do; if your theme renders it as an image or via JavaScript, it does not count.')
          : L(h1s === 2 ? 'Deja un solo <h1> y cambia el otro a <h2>.' : `Deja un solo <h1> y cambia los otros ${h1s - 1} a <h2>.`, h1s === 2 ? 'Keep a single <h1> and change the other one to <h2>.' : `Keep a single <h1> and change the other ${h1s - 1} to <h2>.`),
    );

    // 9. datos_estructurados
    const tipos: string[] = [];
    let bloques = 0;
    let rotos = 0;
    let conTipos = false;
    for (const m of Array.from(html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))) {
      if (!/type\s*=\s*["']?application\/ld\+json/i.test(m[1])) continue;
      bloques++;
      try {
        const j = JSON.parse(m[2].trim().replace(/^<!\[CDATA\[|\]\]>$/g, '').replace(/^<!--|-->$/g, '').trim());
        if (conTipo(j, tipos)) conTipos = true;
      } catch {
        rotos++;
      }
    }
    push(
      'datos_estructurados',
      conTipos,
      bloques === 0
        ? L('Sin bloques application/ld+json.', 'No application/ld+json blocks.')
        : conTipos
          ? L(`${bloques} bloque${bloques === 1 ? '' : 's'} JSON-LD · @type: ${tipos.slice(0, 6).join(', ')}${tipos.length > 6 ? '…' : ''}${rotos ? ` · ${rotos} no parsea` : ''}.`, `${bloques} JSON-LD block${bloques === 1 ? '' : 's'} · @type: ${tipos.slice(0, 6).join(', ')}${tipos.length > 6 ? '…' : ''}${rotos ? ` · ${rotos} fail to parse` : ''}.`)
          : L(`${bloques} bloque${bloques === 1 ? '' : 's'} JSON-LD, ${rotos ? `${rotos} no parsea como JSON` : 'ninguno trae @type'}.`, `${bloques} JSON-LD block${bloques === 1 ? '' : 's'}, ${rotos ? `${rotos} fail to parse as JSON` : 'none has @type'}.`),
      conTipos
        ? L('Nada que cambiar: valida que los datos coincidan con lo que dice la página.', 'Nothing to change: make sure the data matches what the page says.')
        : L('Agrega un bloque JSON-LD con @type Organization o LocalBusiness: nombre, URL, logo y forma de contacto.', 'Add a JSON-LD block with @type Organization or LocalBusiness: name, URL, logo and contact point.'),
    );

    // 10. texto_servidor
    const texto = decodificar(
      html
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<(script|style|noscript)\b[\s\S]*?<\/\1\s*>/gi, ' ')
        .replace(/<[^>]+>/g, ' '),
    );
    const palabras = texto.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
    push(
      'texto_servidor',
      palabras >= 150,
      L(`${palabras} palabras en el HTML inicial, sin JavaScript.`, `${palabras} words in the initial HTML, without JavaScript.`),
      palabras >= 150
        ? L('Nada que cambiar.', 'Nothing to change.')
        : L('Haz que el texto principal venga en el HTML del servidor (SSR o sitio estático), no solo después de ejecutar JavaScript.', 'Serve your main copy in the server HTML (SSR or static), not only after JavaScript runs.'),
    );

    const puntaje = controles.reduce((s, c) => s + (c.pasa ? c.peso : 0), 0);
    const pasan = controles.filter((c) => c.pasa).length;
    const fecha = new Date().toISOString().slice(0, 10);
    const pagina = en ? 'https://omona.tech/en/ai-visibility-checker' : 'https://omona.tech/verificador-visibilidad-ia';
    const nombre = (id: IdControl) => def(id).nombre[en ? 'en' : 'es'];
    const extra = { canonical, ogImage, lang, hreflang, title: titleRaw || null, description: descRaw || null };

    const md = [
      L(`# Visibilidad en Google y asistentes de IA — ${dominio}`, `# Visibility on Google and AI assistants — ${dominio}`),
      L(`Fecha: ${fecha} · Generado por Omona (${pagina})`, `Date: ${fecha} · Generated by Omona (${pagina})`),
      L(`Puntaje: **${puntaje}/100** (${pasan} de ${controles.length} controles pasan) · portada leída: ${portada.url}`, `Score: **${puntaje}/100** (${pasan} of ${controles.length} checks pass) · homepage read: ${portada.url}`),
      '',
      L(
        `> Lectura 100 % pasiva: GET a la portada, /robots.txt, /llms.txt${sitemapL ? ' y /sitemap.xml' : ''}. Sin formularios ni rutas ocultas. Solo vemos el HTML inicial: lo que aparece después con JavaScript no cuenta, igual que para la mayoría de los rastreadores de asistentes.`,
        `> 100% passive read: GET to the homepage, /robots.txt, /llms.txt${sitemapL ? ' and /sitemap.xml' : ''}. No forms, no hidden paths. Only the initial HTML is read: content added later by JavaScript does not count, as for most AI assistant crawlers.`,
      ),
      '',
      L('## Controles', '## Checks'),
      ...controles.map((c, i) => {
        const lineas = [
          `${i + 1}. **[${c.pasa ? L('PASA', 'PASS') : L('NO PASA', 'FAIL')}] ${nombre(c.id)}** (${c.pasa ? c.peso : 0}/${c.peso})`,
          `   - ${L('Hallazgo', 'Finding')}: ${c.hallazgo}`,
          `   - ${L('Arreglo', 'Fix')}: ${c.arreglo}`,
        ];
        if (BASE) lineas.push(`   - ${L('Línea base', 'Baseline')}: ${L(`${BASE.pasa[c.id]} % de ${BASE.n} negocios hispanos medidos lo cumple`, `${BASE.pasa[c.id]}% of ${BASE.n} Hispanic-owned businesses measured pass this`)}`);
        return lineas.join('\n');
      }),
      '',
      L('## Quién te puede leer (robots.txt)', '## Who can read you (robots.txt)'),
      L('| Rastreador | De | Estado |', '| Crawler | Owner | Status |'),
      '|---|---|---|',
      ...rastreadores.map((r) => `| ${r.bot} | ${r.de} | ${r.permitido ? L('Permitido', 'Allowed') : L('Bloqueado', 'Blocked')} |`),
      '',
      L('## Datos que no puntúan', '## Data that does not score'),
      `- canonical: ${canonical ?? L('(ninguno)', '(none)')}`,
      `- og:image: ${ogImage ? L('presente', 'present') : L('ausente', 'missing')}`,
      `- <html lang>: ${lang ?? L('(sin atributo)', '(no attribute)')}`,
      `- hreflang: ${hreflang.length ? hreflang.map((h) => h.hreflang).join(', ') : L('(ninguno)', '(none)')}`,
      '',
      L('## Arreglos, en orden de peso', '## Fixes, by weight'),
      ...[...controles]
        .filter((c) => !c.pasa)
        .sort((a, b) => b.peso - a.peso)
        .map((c) => `- [ ] ${nombre(c.id)} (${c.peso}): ${c.arreglo}`),
      ...(controles.every((c) => c.pasa) ? [L('- Los 10 controles pasan.', '- All 10 checks pass.')] : []),
      '',
      L('## Siguiente paso', '## Next step'),
      L(
        `- Escríbenos con este resultado: mailto:victor@omona.tech?subject=${encodeURIComponent(`Visibilidad SEO + GEO — ${dominio} (${puntaje}/100)`)}`,
        `- Email us this result: mailto:victor@omona.tech?subject=${encodeURIComponent(`SEO + GEO visibility — ${dominio} (${puntaje}/100)`)}`,
      ),
    ];

    return NextResponse.json({
      ok: true,
      dominio,
      fecha,
      urlFinal: portada.url,
      puntaje,
      controles,
      rastreadores,
      vista: { title: titleRaw || null, description: descRaw || null, url: portada.url },
      extra,
      base: BASE,
      markdown: md.join('\n'),
    });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}
