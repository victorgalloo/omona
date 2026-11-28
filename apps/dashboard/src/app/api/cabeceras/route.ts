import { NextResponse } from 'next/server';
import { BASE_CABECERAS, PUNTOS, RECOMENDADA, SEIS_MESES, calificar, type Calificacion, type Estado, type IdCabecera } from '@/lib/cabeceras';

export const runtime = 'nodejs';

/**
 * Verificador público de cabeceras de seguridad HTTP (Área 02 · Ciro, Hito US-5). 0 tokens de LLM.
 * 1 GET a https://<dominio>/ (redirecciones seguidas a mano, cada salto validado contra IPs privadas)
 * + 1 GET a http://<dominio>/ sin seguir. Solo la portada pública: nunca rutas ocultas ni escaneo.
 * La calificación vive en lib/cabeceras.ts (misma especificación que medir_cabeceras_us.py).
 */

const DOMINIO_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;
const BLOQUEADOS = /\.(?:local|internal|localhost|arpa|onion|gov|mil|edu|gob\.[a-z]{2,3}|edu\.[a-z]{2,3})$/i;
const UA = 'Mozilla/5.0 (Omona-Security-Headers-Check/1.0; +https://omona.tech/en/security-headers-checker)';
const RE_RETO = /<title>\s*(?:Just a moment|Attention Required|Access denied|Un momento)|challenge-platform|cf-chl-|_Incapsula_Resource|captcha-delivery\.com/i;

function limpiarDominio(raw: string): string | null {
  let d = String(raw || '').trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').split('/')[0].split('?')[0].split('#')[0].split(':')[0];
  if (!d || d.length > 190 || !DOMINIO_RE.test(d) || BLOQUEADOS.test(d)) return null;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(d)) return null;
  return d;
}

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

const cacheDns = new Map<string, boolean>();
async function resuelvePublico(host: string): Promise<boolean> {
  if (cacheDns.has(host)) return cacheDns.get(host)!;
  let ok = false;
  try {
    const u = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=A`;
    const r = await fetch(u, { headers: { accept: 'application/dns-json' }, signal: AbortSignal.timeout(4000) });
    if (r.ok) {
      const j = (await r.json()) as { Answer?: { type?: number; data?: string }[] };
      const ips = (j.Answer ?? []).filter((a) => a.type === 1).map((a) => String(a.data || ''));
      ok = ips.length > 0 && ips.every((ip) => !ipPrivada(ip));
    }
  } catch {
    ok = false;
  }
  cacheDns.set(host, ok);
  return ok;
}

type Lectura = { status: number; url: string; headers: Record<string, string>; cuerpo: string };

async function leer(url: string, seguir: boolean): Promise<Lectura | null> {
  let actual = url;
  for (let salto = 0; salto < 6; salto++) {
    let host: string;
    try {
      const u = new URL(actual);
      if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
      if ((u.port && u.port !== '80' && u.port !== '443') || u.username) return null;
      host = u.hostname;
    } catch {
      return null;
    }
    if (!(await resuelvePublico(host))) return null;
    let r: Response;
    try {
      r = await fetch(actual, {
        redirect: 'manual',
        headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
        signal: AbortSignal.timeout(6500),
      });
    } catch {
      return null;
    }
    const headers: Record<string, string> = {};
    r.headers.forEach((v, k) => {
      headers[k.toLowerCase()] = v;
    });
    const loc = r.headers.get('location');
    if (seguir && r.status >= 300 && r.status < 400 && loc) {
      await r.body?.cancel().catch(() => {});
      actual = new URL(loc, actual).toString();
      continue;
    }
    let cuerpo = '';
    try {
      const reader = r.body?.getReader();
      if (reader) {
        const partes: Uint8Array[] = [];
        let total = 0;
        while (total < 20000) {
          const { value, done } = await reader.read();
          if (done || !value) break;
          partes.push(value);
          total += value.length;
        }
        await reader.cancel().catch(() => {});
        cuerpo = new TextDecoder().decode(Buffer.concat(partes.map((p) => Buffer.from(p))).subarray(0, 20000));
      }
    } catch {
      /* cabeceras bastan */
    }
    return { status: r.status, url: actual, headers, cuerpo };
  }
  return null;
}

type Texto = { categoria: string; control: string };
const NOMBRE: Record<IdCabecera, { es: Texto; en: Texto }> = {
  https: { es: { categoria: 'Transporte', control: 'HTTPS y redirección desde HTTP' }, en: { categoria: 'Transport', control: 'HTTPS and HTTP-to-HTTPS redirect' } },
  hsts: { es: { categoria: 'Transporte', control: 'Strict-Transport-Security (HSTS)' }, en: { categoria: 'Transport', control: 'Strict-Transport-Security (HSTS)' } },
  csp: { es: { categoria: 'Scripts', control: 'Content-Security-Policy (CSP)' }, en: { categoria: 'Scripts', control: 'Content-Security-Policy (CSP)' } },
  clickjacking: { es: { categoria: 'Marcos', control: 'Anti-clickjacking (X-Frame-Options / frame-ancestors)' }, en: { categoria: 'Framing', control: 'Clickjacking (X-Frame-Options / frame-ancestors)' } },
  xcto: { es: { categoria: 'Tipos MIME', control: 'X-Content-Type-Options: nosniff' }, en: { categoria: 'MIME', control: 'X-Content-Type-Options: nosniff' } },
  referrer: { es: { categoria: 'Privacidad', control: 'Referrer-Policy' }, en: { categoria: 'Privacy', control: 'Referrer-Policy' } },
  permissions: { es: { categoria: 'Permisos', control: 'Permissions-Policy' }, en: { categoria: 'Permissions', control: 'Permissions-Policy' } },
  version: { es: { categoria: 'Huella', control: 'Sin versión de software anunciada' }, en: { categoria: 'Fingerprint', control: 'No software version disclosed' } },
};

const HALL: Record<string, [string, string]> = {
  'unsafe-inline': ["script-src permite 'unsafe-inline' sin nonce ni hash", "script-src allows 'unsafe-inline' without a nonce or hash"],
  'unsafe-eval': ["script-src permite 'unsafe-eval'", "script-src allows 'unsafe-eval'"],
  comodin: ['script-src acepta comodines (*, https:, http: o data:)', 'script-src accepts wildcards (*, https:, http: or data:)'],
  'sin-script-src': ['no hay script-src ni default-src: la política no restringe scripts', 'no script-src or default-src: the policy does not restrict scripts'],
  'sin-object-src': ["falta object-src 'none'", "object-src 'none' is missing"],
  'sin-base-uri': ['falta base-uri', 'base-uri is missing'],
};

function detalle(id: IdCabecera, c: Calificacion, h: Record<string, string>, httpAHttps: boolean | null, en: boolean): { detalle: string; recomendacion: string } {
  const e = c.controles[id].estado;
  const L = (es: string, eng: string) => (en ? eng : es);
  switch (id) {
    case 'https':
      return {
        detalle: e === 'brecha' ? L('Sin HTTPS válido', 'No valid HTTPS') : httpAHttps ? L('HTTPS activo · http:// redirige a https://', 'HTTPS on · http:// redirects to https://') : L('HTTPS activo · http:// NO redirige a https://', 'HTTPS on · http:// does NOT redirect to https://'),
        recomendacion: L('Fuerza la redirección 301 de http:// a https:// en el servidor o el CDN (es una de las señales que mira el escaneo externo de una aseguradora cyber).', 'Force a 301 redirect from http:// to https:// at the server or CDN (an outside-in signal cyber insurers scan for).'),
      };
    case 'hsts':
      return {
        detalle: c.hsts.maxAge > 0 ? `max-age=${c.hsts.maxAge}${c.hsts.subdominios ? '; includeSubDomains' : ''}${c.hsts.preload ? '; preload' : ''}` : L('Ausente', 'Missing'),
        recomendacion: c.hsts.maxAge > 0 && c.hsts.maxAge < SEIS_MESES
          ? L('Sube max-age a 31536000 (un año); con menos de seis meses la protección caduca entre visitas.', 'Raise max-age to 31536000 (one year); under six months the protection lapses between visits.')
          : L(`Agrega «${RECOMENDADA.hsts}». Primero confirma que todos tus subdominios sirven HTTPS.`, `Add "${RECOMENDADA.hsts}". Confirm every subdomain serves HTTPS first.`),
      };
    case 'csp': {
      const hs = c.csp.hallazgos.map((x) => HALL[x][en ? 1 : 0]);
      const base = !c.csp.presente
        ? c.csp.soloReportOnly
          ? L('Solo Content-Security-Policy-Report-Only (observa, no bloquea)', 'Report-Only policy only (monitors, does not block)')
          : L('Ausente', 'Missing')
        : c.csp.soloUpgrade
          ? L('Solo upgrade-insecure-requests: no restringe scripts', 'upgrade-insecure-requests only: does not restrict scripts')
          : e === 'ok'
            ? L(`Restringe scripts (${c.csp.fuente})`, `Restricts scripts (${c.csp.fuente})`)
            : L('Presente pero débil', 'Present but weak');
      return {
        detalle: [base, ...hs].join(' · '),
        recomendacion: L(
          `Empieza en modo observación con «${RECOMENDADA.csp}», revisa los reportes una o dos semanas, agrega los dominios de tus scripts reales (analítica, chat, pagos) y luego cámbiala a Content-Security-Policy. Evita 'unsafe-inline' y 'unsafe-eval'; si tu sitio los necesita, usa nonce o hash.`,
          `Start in monitoring mode with "${RECOMENDADA.csp}", review reports for one or two weeks, add the domains of your real scripts (analytics, chat, payments), then switch it to Content-Security-Policy. Avoid 'unsafe-inline' and 'unsafe-eval'; if your site needs them, use a nonce or hash.`,
        ),
      };
    }
    case 'clickjacking':
      return {
        detalle: c.xfo ? `X-Frame-Options: ${c.xfo.toUpperCase()}${e === 'aviso' ? L(' (valor obsoleto)', ' (deprecated value)') : ''}` : e === 'ok' ? 'CSP frame-ancestors' : L('Ausente', 'Missing'),
        recomendacion: L(`Agrega «${RECOMENDADA.clickjacking}» o frame-ancestors 'self' en tu CSP: impide que otro sitio meta tu página en un marco invisible sobre botones de pago o de WhatsApp.`, `Add "${RECOMENDADA.clickjacking}" or frame-ancestors 'self' in your CSP: it stops another site from loading your page in an invisible frame over pay or contact buttons.`),
      };
    case 'xcto':
      return {
        detalle: h['x-content-type-options'] ? `x-content-type-options: ${h['x-content-type-options']}` : L('Ausente', 'Missing'),
        recomendacion: L(`Agrega «${RECOMENDADA.xcto}».`, `Add "${RECOMENDADA.xcto}".`),
      };
    case 'referrer':
      return {
        detalle: c.referrer ? `referrer-policy: ${c.referrer}${e === 'aviso' ? L(' (filtra la URL completa)', ' (leaks the full URL)') : ''}` : L('Ausente (el navegador aplica su valor por defecto)', 'Missing (the browser applies its default)'),
        recomendacion: L(`Agrega «${RECOMENDADA.referrer}»: evita que la URL completa de tus formularios o portales viaje a sitios de terceros.`, `Add "${RECOMENDADA.referrer}": keeps full URLs of your forms or portals from leaking to third-party sites.`),
      };
    case 'permissions':
      return {
        detalle: h['permissions-policy'] ? L('Presente', 'Present') : h['feature-policy'] ? L('Solo Feature-Policy (nombre viejo)', 'Feature-Policy only (old name)') : L('Ausente', 'Missing'),
        recomendacion: L(`Agrega «${RECOMENDADA.permissions}» y abre solo lo que tu sitio usa.`, `Add "${RECOMENDADA.permissions}" and allow only what your site uses.`),
      };
    case 'version':
      return {
        detalle: c.versionTexto || (h['x-powered-by'] ? `x-powered-by: ${h['x-powered-by'].slice(0, 60)}` : L('No anuncia versión', 'No version disclosed')),
        recomendacion: L('Quita el número de versión de Server y elimina X-Powered-By (en PHP: expose_php = Off; en Apache: ServerTokens Prod; en Nginx: server_tokens off).', 'Strip the version from Server and remove X-Powered-By (PHP: expose_php = Off; Apache: ServerTokens Prod; Nginx: server_tokens off).'),
      };
  }
}

function markdown(dominio: string, fecha: string, c: Calificacion, filas: { id: IdCabecera; estado: Estado; puntos: number; detalle: string; recomendacion: string }[], en: boolean): string {
  const faltan = filas.filter((f) => f.estado !== 'ok' && f.id !== 'https' && f.id !== 'version').map((f) => RECOMENDADA[f.id as keyof typeof RECOMENDADA]);
  const pares = faltan.map((l) => {
    const i = l.indexOf(':');
    return [l.slice(0, i), l.slice(i + 1).trim()] as const;
  });
  const b = BASE_CABECERAS;
  const L = (es: string, eng: string) => (en ? eng : es);
  const out = [
    L(`# Cabeceras de seguridad HTTP — ${dominio}`, `# HTTP security headers — ${dominio}`),
    L(`Fecha: ${fecha} · Generado por Omona (https://omona.tech/verificador-cabeceras-seguridad)`, `Date: ${fecha} · Generated by Omona (https://omona.tech/en/security-headers-checker)`),
    L(`Calificación: **${c.letra} · ${c.puntaje}/100** (mediana de ${b.n} negocios hispanos de EE. UU.: ${b.mediana}/100; solo ${b.letras.A} % saca A).`, `Grade: **${c.letra} · ${c.puntaje}/100** (median of ${b.n} US Hispanic-owned businesses: ${b.mediana}/100; only ${b.letras.A}% get an A).`),
    '',
    L('> Lectura pasiva: 1 GET a la portada pública por HTTPS y 1 por HTTP. No prueba rutas ocultas, no envía formularios y no evalúa tu código, tu nube ni tus agentes de IA.', '> Passive read: 1 GET to the public homepage over HTTPS and 1 over HTTP. No hidden paths, no form submissions, no review of your code, cloud or AI agents.'),
    '',
    L('| Control | Estado | Puntos | Hallazgo | Lo pasan (EE. UU.) |', '| Check | Status | Points | Finding | Pass rate (US) |'),
    '|---|---|---|---|---|',
    ...filas.map((f) => `| ${NOMBRE[f.id][en ? 'en' : 'es'].control} | ${f.estado.toUpperCase()} | ${f.puntos}/${PUNTOS[f.id]} | ${f.detalle.replace(/\|/g, '/')} | ${b.pasa[f.id]}% |`),
    '',
    L('## Qué corregir, en orden', '## What to fix, in order'),
    ...filas.filter((f) => f.estado !== 'ok').sort((x, y) => PUNTOS[y.id] - PUNTOS[x.id]).map((f, i) => `${i + 1}. **${NOMBRE[f.id][en ? 'en' : 'es'].control}** — ${f.recomendacion}`),
  ];
  if (pares.length) {
    out.push(
      '',
      L('## Cabeceras para copiar', '## Headers to copy'),
      '```http',
      ...faltan,
      '```',
      '',
      '### Nginx',
      '```nginx',
      ...pares.map(([k, v]) => `add_header ${k} "${v.replace(/"/g, '\\"')}" always;`),
      '```',
      '',
      '### Apache (.htaccess)',
      '```apache',
      ...pares.map(([k, v]) => `Header always set ${k} "${v.replace(/"/g, '\\"')}"`),
      '```',
      '',
      '### Vercel (vercel.json)',
      '```json',
      JSON.stringify({ headers: [{ source: '/(.*)', headers: pares.map(([key, value]) => ({ key, value })) }] }, null, 2),
      '```',
      '',
      L('### Cloudflare', '### Cloudflare'),
      L('Rules → Transform Rules → Modify Response Header → «Set static» con cada nombre y valor de arriba.', 'Rules → Transform Rules → Modify Response Header → "Set static" with each name and value above.'),
      '',
      L('### WordPress, Wix, Squarespace, GoDaddy', '### WordPress, Wix, Squarespace, GoDaddy'),
      L('En hosting administrado casi nunca puedes tocar el servidor: pon las cabeceras en el CDN (Cloudflare gratis delante del sitio) o pídelas a tu proveedor con este archivo.', 'On managed hosting you rarely control the server: set the headers at the CDN (free Cloudflare in front of the site) or send this file to your provider.'),
    );
  }
  out.push(
    '',
    L('## Por qué importa para tu seguro cibernético', '## Why it matters for your cyber insurance'),
    L(
      'HTTPS, la redirección desde HTTP, HSTS y no anunciar versiones son señales que el escaneo externo de una aseguradora ve sin pedirte permiso. Lista completa: https://omona.tech/blog/seguro-cibernetico-pequenas-empresas',
      'HTTPS, the HTTP redirect, HSTS and hiding software versions are signals an insurer’s outside-in scan sees without asking you. Full checklist: https://omona.tech/blog/cyber-insurance-small-business-checklist',
    ),
    '',
    L('## Siguiente paso', '## Next step'),
    L(
      `Correo, dominio (SPF/DMARC) y archivos expuestos: https://omona.tech/verificador-dmarc-spf · Revisión con alcance firmado: mailto:victor@omona.tech?subject=${encodeURIComponent(`Cabeceras de seguridad — ${dominio} (${c.letra})`)}`,
      `Email, domain (SPF/DMARC) and exposed files: https://omona.tech/en/dmarc-spf-checker · Review under a signed scope: mailto:victor@omona.tech?subject=${encodeURIComponent(`Security headers — ${dominio} (${c.letra})`)}`,
    ),
  );
  return out.join('\n');
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { dominio?: string; lang?: 'es' | 'en' };
  const en = body.lang === 'en';
  const dominio = limpiarDominio(body.dominio || '');
  if (!dominio) {
    return NextResponse.json(
      { error: en ? 'Enter a valid business domain (e.g. company.com). Government, education and internal domains are excluded.' : 'Escribe un dominio de negocio válido (ej. empresa.com). Se excluyen dominios de gobierno, educación e internos.' },
      { status: 400 },
    );
  }
  try {
    let host = dominio;
    let https = await leer(`https://${host}/`, true);
    if (!https && !host.startsWith('www.')) {
      const w = await leer(`https://www.${host}/`, true);
      if (w) {
        https = w;
        host = `www.${host}`;
      }
    }
    const http = await leer(`http://${host}/`, false);
    if (!https && !http) {
      return NextResponse.json({ error: en ? `${dominio} did not answer (or does not resolve to a public IP).` : `${dominio} no respondió (o no resuelve a una IP pública).` }, { status: 422 });
    }
    const httpsOk = Boolean(https && https.url.startsWith('https://'));
    if (https && (https.status >= 400 || RE_RETO.test(https.cuerpo))) {
      return NextResponse.json(
        {
          error: en
            ? `${dominio} answered with ${https.status >= 400 ? `HTTP ${https.status}` : 'an anti-bot challenge'}. The headers would be your CDN’s, not your site’s, so we do not grade it. Try again later or check from your browser’s DevTools (Network → Response Headers).`
            : `${dominio} respondió con ${https.status >= 400 ? `HTTP ${https.status}` : 'un reto anti-bot'}. Las cabeceras serían las de tu CDN y no las de tu sitio, así que no lo calificamos. Intenta más tarde o revísalas en las herramientas de tu navegador (Red → Encabezados de respuesta).`,
        },
        { status: 422 },
      );
    }
    const loc = http?.headers['location'] || '';
    const httpAHttps = http ? http.status >= 300 && http.status < 400 && /^https:\/\//i.test(loc) : null;
    const h = https?.headers ?? {};
    const c = calificar(h, httpsOk, httpAHttps);
    const filas = (Object.keys(PUNTOS) as IdCabecera[]).map((id) => {
      const t = NOMBRE[id][en ? 'en' : 'es'];
      const d = detalle(id, c, h, httpAHttps, en);
      return { id, categoria: t.categoria, control: t.control, estado: c.controles[id].estado, puntos: c.controles[id].puntos, max: PUNTOS[id], base: BASE_CABECERAS.pasa[id], ...d };
    });
    const fecha = new Date().toISOString().slice(0, 10);
    const conteos = {
      ok: filas.filter((f) => f.estado === 'ok').length,
      aviso: filas.filter((f) => f.estado === 'aviso').length,
      brecha: filas.filter((f) => f.estado === 'brecha').length,
    };
    const crudas = ['strict-transport-security', 'content-security-policy', 'content-security-policy-report-only', 'x-frame-options', 'x-content-type-options', 'referrer-policy', 'permissions-policy', 'server', 'x-powered-by']
      .filter((k) => h[k])
      .map((k) => ({ nombre: k, valor: h[k].slice(0, 600) }));
    return NextResponse.json({
      ok: true,
      dominio,
      url: https?.url ?? `http://${host}/`,
      fecha,
      puntaje: c.puntaje,
      letra: c.letra,
      conteos,
      controles: filas,
      crudas,
      markdown: markdown(dominio, fecha, c, filas, en),
    });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}
