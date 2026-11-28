/**
 * Verificador de cabeceras de seguridad HTTP (Área 02 · Ciro, Hito US-5). 0 tokens de LLM.
 *
 * MISMA especificación que ~/.hermes/omona/seguridad/medir_cabeceras_us.py (la línea base):
 * 8 controles = 100 puntos y letra A–F. Cambia una y cambias las dos, y si re-mides, actualiza
 * BASE_CABECERAS y la línea de /llms-full.txt.
 */

export type Estado = 'ok' | 'aviso' | 'brecha';
export type IdCabecera = 'https' | 'hsts' | 'csp' | 'clickjacking' | 'xcto' | 'referrer' | 'permissions' | 'version';

export const PUNTOS: Record<IdCabecera, number> = {
  https: 10,
  hsts: 15,
  csp: 20,
  clickjacking: 15,
  xcto: 10,
  referrer: 10,
  permissions: 10,
  version: 10,
};

export const SEIS_MESES = 15552000;
const VERSION_RE = /[A-Za-z][\w.-]*\/\d+(\.\d+)+/;
const REF_OK = new Set(['no-referrer', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin', 'origin', 'origin-when-cross-origin']);

export type HallazgoCsp = 'unsafe-inline' | 'unsafe-eval' | 'comodin' | 'sin-script-src' | 'sin-object-src' | 'sin-base-uri';

/** Primera aparición de cada directiva (varias políticas llegan unidas por coma). */
export function directivas(csp: string): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const parte of csp.split(/[;,]/)) {
    const tok = parte.trim().split(/\s+/).filter(Boolean);
    if (!tok.length) continue;
    const nombre = tok[0].toLowerCase();
    if (!out.has(nombre)) out.set(nombre, tok.slice(1).map((t) => t.toLowerCase()));
  }
  return out;
}

export function evaluarCsp(csp: string) {
  const d = directivas(csp);
  const nombres = Array.from(d.keys());
  const soloUpgrade = nombres.length > 0 && nombres.every((n) => n === 'upgrade-insecure-requests' || n === 'block-all-mixed-content');
  const script = d.get('script-src') ?? d.get('default-src');
  const fuente = d.has('script-src') ? 'script-src' : d.has('default-src') ? 'default-src' : null;
  const hallazgos: HallazgoCsp[] = [];
  if (!script) {
    hallazgos.push('sin-script-src');
  } else {
    const moderno = script.some((t) => /^'(?:nonce-|sha256-|sha384-|sha512-)/.test(t) || t === "'strict-dynamic'");
    if (script.includes("'unsafe-inline'") && !moderno) hallazgos.push('unsafe-inline');
    if (script.includes("'unsafe-eval'")) hallazgos.push('unsafe-eval');
    if (!moderno && script.some((t) => t === '*' || t === 'http:' || t === 'https:' || t === 'data:')) hallazgos.push('comodin');
  }
  const def = d.get('default-src');
  if (!d.has('object-src') && !(def && def.length === 1 && def[0] === "'none'")) hallazgos.push('sin-object-src');
  if (!d.has('base-uri')) hallazgos.push('sin-base-uri');
  const graves: HallazgoCsp[] = ['sin-script-src', 'unsafe-inline', 'unsafe-eval', 'comodin'];
  const fuerte = Boolean(script) && !hallazgos.some((x) => graves.includes(x));
  return { directivas: nombres, soloUpgrade, fuente, hallazgos, fuerte, frameAncestors: d.has('frame-ancestors') };
}

export type Calificacion = {
  controles: Record<IdCabecera, { estado: Estado; puntos: number }>;
  puntaje: number;
  letra: 'A' | 'B' | 'C' | 'D' | 'F';
  hsts: { maxAge: number; subdominios: boolean; preload: boolean };
  csp: { presente: boolean; soloUpgrade: boolean; soloReportOnly: boolean; hallazgos: HallazgoCsp[]; fuente: string | null };
  xfo: string;
  referrer: string;
  versionTexto: string;
};

export function letra(p: number): Calificacion['letra'] {
  return p >= 90 ? 'A' : p >= 75 ? 'B' : p >= 60 ? 'C' : p >= 40 ? 'D' : 'F';
}

/** h = cabeceras en minúsculas de la respuesta HTTPS final (duplicadas unidas por ", "). */
export function calificar(hIn: Record<string, string>, httpsOk: boolean, httpAHttps: boolean | null): Calificacion {
  const h: Record<string, string> = httpsOk ? hIn : {};
  const c = {} as Calificacion['controles'];
  const set = (id: IdCabecera, estado: Estado, puntos: number) => (c[id] = { estado, puntos });

  if (!httpsOk) set('https', 'brecha', 0);
  else if (httpAHttps) set('https', 'ok', 10);
  else set('https', 'aviso', 5);

  const hsts = h['strict-transport-security'] || '';
  const m = /max-age\s*=\s*"?(\d+)/i.exec(hsts);
  const maxAge = m ? Number(m[1]) : 0;
  if (hsts && maxAge >= SEIS_MESES) set('hsts', 'ok', 15);
  else if (hsts && maxAge > 0) set('hsts', 'aviso', 7);
  else set('hsts', 'brecha', 0);

  const csp = h['content-security-policy'] || '';
  const ro = h['content-security-policy-report-only'] || '';
  const ev = csp ? evaluarCsp(csp) : null;
  if (ev && !ev.soloUpgrade) set('csp', ev.fuerte ? 'ok' : 'aviso', ev.fuerte ? 20 : 10);
  else set('csp', 'brecha', 0);

  const xfo = (h['x-frame-options'] || '').trim().toLowerCase();
  if ((ev && ev.frameAncestors) || xfo === 'deny' || xfo === 'sameorigin') set('clickjacking', 'ok', 15);
  else if (xfo) set('clickjacking', 'aviso', 7);
  else set('clickjacking', 'brecha', 0);

  if ((h['x-content-type-options'] || '').trim().toLowerCase() === 'nosniff') set('xcto', 'ok', 10);
  else set('xcto', 'brecha', 0);

  const refs = (h['referrer-policy'] || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
  const ref = refs.length ? refs[refs.length - 1] : '';
  if (REF_OK.has(ref)) set('referrer', 'ok', 10);
  else if (ref) set('referrer', 'aviso', 5);
  else set('referrer', 'brecha', 0);

  if ((h['permissions-policy'] || '').trim()) set('permissions', 'ok', 10);
  else if ((h['feature-policy'] || '').trim()) set('permissions', 'aviso', 5);
  else set('permissions', 'brecha', 0);

  const server = h['server'] || '';
  const powered = h['x-powered-by'] || '';
  if (VERSION_RE.test(server) || VERSION_RE.test(powered)) set('version', 'brecha', 0);
  else if (powered.trim()) set('version', 'aviso', 5);
  else set('version', 'ok', 10);

  const puntaje = (Object.keys(PUNTOS) as IdCabecera[]).reduce((s, k) => s + c[k].puntos, 0);
  return {
    controles: c,
    puntaje,
    letra: letra(puntaje),
    hsts: { maxAge, subdominios: /includesubdomains/i.test(hsts), preload: /preload/i.test(hsts) },
    csp: { presente: Boolean(csp), soloUpgrade: Boolean(ev?.soloUpgrade), soloReportOnly: Boolean(ro) && !csp, hallazgos: ev?.hallazgos ?? [], fuente: ev?.fuente ?? null },
    xfo,
    referrer: ref,
    versionTexto: [server, powered].filter((x) => VERSION_RE.test(x)).join(' | ').slice(0, 120),
  };
}

/**
 * Línea base pública: medir_cabeceras_us.py, 28-nov-2026. 654 portadas activas de miembros de las
 * cámaras hispanas FWHCC (Fort Worth, TX) y SHCCNJ (New Jersey); 586 calificables (se excluyen 18 sin
 * HTTPS válido y 50 que respondieron reto anti-bot o error HTTP). % = pasa el control completo.
 */
export const BASE_CABECERAS = {
  fecha: '2026-11-28',
  leidos: 654,
  n: 586,
  mediana: 45,
  promedio: 41.4,
  pasa: { https: 93.0, hsts: 49.7, csp: 0.9, clickjacking: 36.2, xcto: 53.2, referrer: 11.4, permissions: 9.6, version: 74.4 } as Record<IdCabecera, number>,
  letras: { A: 2.7, B: 3.9, C: 17.7, D: 29.7, F: 45.9 },
  cspPresente: 26.3,
  cspEnPresentes: { 'unsafe-inline': 19.5, 'unsafe-eval': 17.5, 'sin-script-src': 76.0 },
  hstsSubdominios: 111,
  hstsPreload: 86,
  hstsPresente: 328,
} as const;

/** Cabecera recomendada por control (para el bloque «copia y pega» del entregable). */
export const RECOMENDADA: Record<Exclude<IdCabecera, 'https' | 'version'>, string> = {
  hsts: 'Strict-Transport-Security: max-age=31536000; includeSubDomains',
  csp: "Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; upgrade-insecure-requests",
  clickjacking: 'X-Frame-Options: SAMEORIGIN',
  xcto: 'X-Content-Type-Options: nosniff',
  referrer: 'Referrer-Policy: strict-origin-when-cross-origin',
  permissions: 'Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()',
};
