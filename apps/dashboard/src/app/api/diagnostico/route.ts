import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Control = {
  id: string;
  categoria: string;
  control: string;
  estado: 'ok' | 'aviso' | 'brecha';
  detalle: string;
  recomendacion: string;
};

const DOMINIO_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;
const BLOQUEADOS = /\.(?:local|internal|localhost|arpa|onion|gov|mil|gob\.[a-z]{2,3})$/i;

function limpiarDominio(raw: string): string | null {
  let d = String(raw || '').trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').split('/')[0].split('?')[0].split('#')[0].split(':')[0];
  d = d.replace(/^www\./, '');
  if (!d || d.length > 190 || !DOMINIO_RE.test(d) || BLOQUEADOS.test(d)) return null;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(d)) return null;
  return d;
}

async function dnsTxt(name: string, type = 'TXT'): Promise<string[]> {
  try {
    const u = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
    const r = await fetch(u, { headers: { accept: 'application/dns-json' }, signal: AbortSignal.timeout(4000) });
    if (!r.ok) return [];
    const j = (await r.json()) as { Answer?: { data?: string }[] };
    return (j.Answer ?? []).map((a) => String(a.data || '').replace(/^"|"$/g, ''));
  } catch {
    return [];
  }
}

async function headOrGet(url: string, maxBytes = 4096): Promise<{ status: number; headers: Headers; sample: string; finalUrl: string } | null> {
  try {
    const r = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': 'Omona-Passive-Posture-Check/1.0 (+https://omona.tech/seguridad)' },
      signal: AbortSignal.timeout(5500),
    });
    const reader = r.body?.getReader();
    let sample = '';
    if (reader) {
      const { value } = await reader.read();
      if (value) sample = new TextDecoder().decode(value.slice(0, maxBytes));
      await reader.cancel().catch(() => {});
    }
    return { status: r.status, headers: r.headers, sample, finalUrl: r.url };
  } catch {
    return null;
  }
}

type Proveedor = 'microsoft365' | 'google' | 'pasarela' | 'otro' | 'sin-mx';

function proveedorCorreo(mx: string[]): Proveedor {
  const h = mx.join(' ').toLowerCase();
  if (!h.trim()) return 'sin-mx';
  if (h.includes('outlook.com')) return 'microsoft365';
  if (h.includes('google.com') || h.includes('googlemail.com')) return 'google';
  if (/pphosted|mimecast|barracudanetworks|iphmx|messagelabs|mailcontrol|trendmicro|sophos|spamtitan/.test(h)) return 'pasarela';
  return 'otro';
}

// Lista determinista (0 tokens) para frenar el cambio de cuenta bancaria por correo: BEC, ACH, wire, W-9 falsos.
// Guía completa: /blog/fraude-ach-wire-facturas-falsas-contratistas (es-US) y /blog/wire-fraud-ach-fraud-small-business (en-US).
function checklistPagos(p: { proveedor: Proveedor; dkimDefecto: boolean | null; suplantable: boolean }, en: boolean): string[] {
  const nombre = { microsoft365: 'Microsoft 365', google: 'Google Workspace', pasarela: en ? 'filtering gateway' : 'pasarela de filtrado', otro: en ? 'other provider' : 'otro proveedor', 'sin-mx': en ? 'no MX record' : 'sin registro MX' }[p.proveedor];
  const dkim = p.dkimDefecto === null ? (en ? 'not checked for this provider' : 'no medible con este proveedor') : p.dkimDefecto ? (en ? 'published on the default selector' : 'publicado en el selector por defecto') : (en ? 'NOT found on the default selector' : 'NO encontrado en el selector por defecto');
  const prov: string[] = p.proveedor === 'microsoft365'
    ? en
      ? ['- [ ] Microsoft 365: enable DKIM signing in Defender (selector1/selector2 CNAMEs) and turn on impersonation protection for owners and accounting.', '- [ ] Microsoft 365: set the outbound spam policy to block automatic external forwarding and review inbox rules every month.']
      : ['- [ ] Microsoft 365: activa la firma DKIM en Defender (CNAME selector1/selector2) y la protección contra suplantación para dueños y contabilidad.', '- [ ] Microsoft 365: en la directiva de spam saliente bloquea el reenvío automático externo y revisa las reglas de bandeja cada mes.']
    : p.proveedor === 'google'
      ? en
        ? ['- [ ] Google Workspace: generate the DKIM key in Admin console (Gmail > Authenticate email) and publish google._domainkey.', '- [ ] Google Workspace: disable automatic forwarding to external addresses and turn on the advanced phishing and malware protections.']
        : ['- [ ] Google Workspace: genera la llave DKIM en la consola de administración (Gmail > Autenticar correo) y publica google._domainkey.', '- [ ] Google Workspace: desactiva el reenvío automático a direcciones externas y enciende las protecciones avanzadas contra phishing y malware.']
      : [];
  return en
    ? [
        '## Payment-diversion checklist (ACH, wire, fake invoices and W-9s)',
        `Mail provider detected: **${nombre}** · DKIM: ${dkim} · Domain spoofable today: **${p.suplantable ? 'yes (no DMARC or p=none)' : 'no (DMARC quarantine/reject)'}**`,
        '',
        `- [ ] DMARC at p=quarantine, then p=reject, with reports (rua) — today: ${p.suplantable ? 'missing' : 'done'}.`,
        ...prov,
        '- [ ] Written callback rule: any new or changed bank account is confirmed by phone to a number you already had, never the one in the email.',
        '- [ ] Two people approve every new payee and every wire or ACH above your limit; hold first payments to a new account 24 hours.',
        '- [ ] Ask your bank for Positive Pay / ACH Positive Pay and ACH debit blocks on the operating account.',
        '- [ ] Nacha rules in force since June 19, 2026: every business that originates ACH needs risk-based fraud monitoring, reviewed yearly.',
        '- [ ] If money already left: call your bank for a recall the same day and file at ic3.gov with full transaction details.',
      ]
    : [
        '## Checklist contra desvío de pagos (ACH, wire, facturas y W-9 falsos)',
        `Proveedor de correo detectado: **${nombre}** · DKIM: ${dkim} · Dominio suplantable hoy: **${p.suplantable ? 'sí (sin DMARC o p=none)' : 'no (DMARC quarantine/reject)'}**`,
        '',
        `- [ ] DMARC en p=quarantine y luego p=reject, con reportes (rua) — hoy: ${p.suplantable ? 'pendiente' : 'listo'}.`,
        ...prov,
        '- [ ] Regla de devolución de llamada por escrito: toda cuenta bancaria nueva o cambiada se confirma por teléfono a un número que ya tenías, nunca al del correo.',
        '- [ ] Dos personas aprueban cada beneficiario nuevo y cada wire o ACH arriba de tu límite; retén 24 horas el primer pago a una cuenta nueva.',
        '- [ ] Pide a tu banco Positive Pay / ACH Positive Pay y bloqueo de débitos ACH en la cuenta operativa.',
        '- [ ] Reglas Nacha vigentes desde el 19 de junio de 2026: toda empresa que origina ACH necesita monitoreo de fraude basado en riesgo, revisado cada año.',
        '- [ ] Si el dinero ya salió: pide a tu banco el retiro (recall) el mismo día y denuncia en ic3.gov con todos los datos de la transferencia.',
      ];
}

// ¿El sitio por HTTP plano manda a HTTPS? Una sola petición, sin seguir redirecciones.
async function httpAHttps(dominio: string): Promise<boolean | null> {
  try {
    const r = await fetch(`http://${dominio}/`, {
      method: 'GET',
      redirect: 'manual',
      headers: { 'user-agent': 'Omona-Passive-Posture-Check/1.0 (+https://omona.tech/seguridad)' },
      signal: AbortSignal.timeout(4000),
    });
    await r.body?.cancel().catch(() => {});
    const loc = r.headers.get('location') || '';
    return r.status >= 300 && r.status < 400 && /^https:\/\//i.test(loc);
  } catch {
    return null;
  }
}

type Seguro = {
  senales: { id: string; ok: boolean | null }[];
  cumple: number;
  medibles: number;
};

// Lectura «desde fuera» tipo aseguradora (escaneo externo de suscripción de cyber insurance). No suma al puntaje.
// Mismas 6 señales de la medición de 595 negocios hispanos: /blog/cyber-insurance-small-business-checklist (en-US)
// y /blog/seguro-cibernetico-pequenas-empresas (es-US).
function checklistSeguro(s: Seguro, en: boolean): string[] {
  const nombre: Record<string, [string, string]> = {
    'spf-valido': ['SPF válido (un registro, cierre -all o ~all)', 'Valid SPF (one record, -all or ~all)'],
    'dmarc-aplicado': ['DMARC aplicado (p=quarantine o p=reject)', 'DMARC enforced (p=quarantine or p=reject)'],
    'https-valido': ['HTTPS con certificado válido', 'HTTPS with a valid certificate'],
    'http-a-https': ['HTTP redirige a HTTPS', 'HTTP redirects to HTTPS'],
    hsts: ['HSTS publicado', 'HSTS published'],
    'sin-version': ['Sin versión de software anunciada (Server / X-Powered-By)', 'No software version announced (Server / X-Powered-By)'],
  };
  const marca = (ok: boolean | null) => (ok === null ? (en ? 'not measurable' : 'no medible') : ok ? (en ? 'yes' : 'sí') : en ? 'NO' : 'NO');
  const senales = s.senales.map((x) => `- [${x.ok ? 'x' : ' '}] ${nombre[x.id][en ? 1 : 0]} — ${marca(x.ok)}`);
  return en
    ? [
        '## Cyber insurance: what an outside-in underwriting scan sees',
        `Outside-in signals in order: **${s.cumple}/${s.medibles}** (same 6 signals we measured on 595 US Hispanic chamber members: only 17.3% pass all 6).`,
        '',
        ...senales,
        '',
        '### Application questions to answer "yes" with evidence (does not change the score)',
        '- [ ] MFA on email, remote access (VPN/RDP), cloud and admin accounts — screenshot of the policy.',
        '- [ ] EDR on every laptop and server, not just antivirus — vendor console export.',
        '- [ ] Encrypted backups kept offline or immutable, restore tested in the last 90 days — date and result.',
        '- [ ] Patching: critical updates within 30 days; no end-of-life systems facing the internet.',
        '- [ ] No RDP open to the internet; remote access only through VPN or zero-trust with MFA.',
        '- [ ] Separate admin accounts; nobody reads email with an admin account.',
        '- [ ] Phishing training at least yearly, plus the written callback rule for any bank-account change.',
        '- [ ] Written incident response plan with your insurer\'s breach hotline and your bank\'s fraud line.',
        '- [ ] Ask your agent in writing whether social engineering / funds transfer fraud is covered or needs a crime policy or endorsement (NAIC 2026: standard cyber policies frequently exclude or sharply limit it).',
        '- [ ] Never answer "yes" to a control you do not have: a misstatement on the application is a common reason a claim gets contested.',
      ]
    : [
        '## Seguro cibernético (cyber insurance): lo que ve el escaneo externo de la aseguradora',
        `Señales en orden vistas desde fuera: **${s.cumple}/${s.medibles}** (las mismas 6 que medimos en 595 negocios de cámaras hispanas de EE. UU.: solo 17.3 % cumple las 6).`,
        '',
        ...senales,
        '',
        '### Preguntas de la solicitud que debes contestar «sí» con evidencia (no cambia el puntaje)',
        '- [ ] MFA en correo, acceso remoto (VPN/RDP), nube y cuentas de administrador — captura de la política.',
        '- [ ] EDR en cada laptop y servidor, no solo antivirus — exportación de la consola del proveedor.',
        '- [ ] Respaldos cifrados fuera de línea o inmutables, restauración probada en los últimos 90 días — fecha y resultado.',
        '- [ ] Parches: actualizaciones críticas en menos de 30 días; ningún sistema sin soporte expuesto a internet.',
        '- [ ] Ningún RDP abierto a internet; acceso remoto solo por VPN o zero-trust con MFA.',
        '- [ ] Cuentas de administrador separadas; nadie lee su correo con una cuenta de administrador.',
        '- [ ] Capacitación contra phishing al menos una vez al año, más la regla de devolución de llamada para cualquier cambio de cuenta bancaria.',
        '- [ ] Plan de respuesta a incidentes por escrito con la línea de la aseguradora y la de fraude de tu banco.',
        '- [ ] Pregunta por escrito a tu agente si la ingeniería social / fraude por transferencia está cubierta o requiere póliza de crimen o endoso (NAIC 2026: las pólizas cibernéticas estándar con frecuencia la excluyen o la limitan mucho).',
        '- [ ] Nunca contestes «sí» a un control que no tienes: una declaración falsa en la solicitud es motivo común para disputar un reclamo.',
      ];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { dominio?: string; autorizado?: boolean; lang?: 'es' | 'en' };
    const en = body.lang === 'en';
    if (!body.autorizado) {
      return NextResponse.json(
        { error: en ? 'Confirm you are authorized to inspect this domain.' : 'Confirma que tienes autorización para evaluar la postura pública de este dominio.' },
        { status: 400 },
      );
    }
    const dominio = limpiarDominio(body.dominio || '');
    if (!dominio) {
      return NextResponse.json(
        { error: en ? 'Enter a valid corporate domain (e.g. company.com). Government and internal domains are excluded.' : 'Ingresa un dominio corporativo válido (ej. empresa.com). Dominios gubernamentales o internos están excluidos.' },
        { status: 400 },
      );
    }

    const [mainResp, spfRecords, dmarcRecords, caaRecords, secTxt, llmsTxt, envCheck, gitCheck, mxRecords, httpRedirige] = await Promise.all([
      headOrGet(`https://${dominio}/`),
      dnsTxt(dominio, 'TXT'),
      dnsTxt(`_dmarc.${dominio}`, 'TXT'),
      dnsTxt(dominio, 'CAA'),
      headOrGet(`https://${dominio}/.well-known/security.txt`, 1024),
      headOrGet(`https://${dominio}/llms.txt`, 1024),
      headOrGet(`https://${dominio}/.env`, 512),
      headOrGet(`https://${dominio}/.git/HEAD`, 512),
      dnsTxt(dominio, 'MX'),
      httpAHttps(dominio),
    ]);

    if (!mainResp) {
      return NextResponse.json(
        { error: en ? `Could not reach https://${dominio}/ within 5 seconds.` : `No se pudo conectar por HTTPS a https://${dominio}/ en 5 segundos.` },
        { status: 422 },
      );
    }

    const h = mainResp.headers;
    const controles: Control[] = [];

    // 1. HSTS
    const hsts = h.get('strict-transport-security');
    controles.push({
      id: 'hsts',
      categoria: 'TLS / HTTPS',
      control: 'Strict-Transport-Security (HSTS)',
      estado: hsts ? 'ok' : 'brecha',
      detalle: hsts ? `Presente (${hsts.slice(0, 80)})` : en ? 'Missing header on HTTPS response' : 'Ausente en la respuesta HTTPS principal',
      recomendacion: hsts
        ? en ? 'Keep max-age >= 31536000 with includeSubDomains.' : 'Mantener max-age >= 31536000 con includeSubDomains.'
        : en ? 'Add Strict-Transport-Security: max-age=31536000; includeSubDomains; preload.' : 'Declarar Strict-Transport-Security: max-age=31536000; includeSubDomains; preload.',
    });

    // 2. CSP
    const csp = h.get('content-security-policy');
    controles.push({
      id: 'csp',
      categoria: 'HTTP Headers',
      control: 'Content-Security-Policy (CSP)',
      estado: csp ? 'ok' : 'brecha',
      detalle: csp ? `Definida (${csp.slice(0, 90)}${csp.length > 90 ? '…' : ''})` : en ? 'No CSP policy detected' : 'Sin política CSP declarada',
      recomendacion: csp
        ? en ? 'Review frame-ancestors and script-src for unsafe-inline.' : 'Revisar que script-src y frame-ancestors restrinjan orígenes no autorizados.'
        : en ? 'Define a Content-Security-Policy header restricting script-src, connect-src, and frame-ancestors.' : 'Definir Content-Security-Policy para mitigar XSS, inyección de scripts en widgets de IA y clickjacking.',
    });

    // 3. Clickjacking & MIME sniffing
    const xfo = h.get('x-frame-options');
    const xcto = h.get('x-content-type-options');
    const frameProtected = Boolean(xfo || (csp && csp.includes('frame-ancestors')));
    controles.push({
      id: 'xfo-xcto',
      categoria: 'HTTP Headers',
      control: 'X-Content-Type-Options & Anti-Framing',
      estado: frameProtected && xcto?.toLowerCase() === 'nosniff' ? 'ok' : frameProtected || xcto ? 'aviso' : 'brecha',
      detalle: `X-Content-Type-Options: ${xcto || 'ausente'} · X-Frame-Options: ${xfo || (frameProtected ? 'vía CSP' : 'ausente')}`,
      recomendacion: en
        ? 'Enforce X-Content-Type-Options: nosniff and X-Frame-Options: DENY (or CSP frame-ancestors).'
        : 'Forzar X-Content-Type-Options: nosniff y X-Frame-Options: DENY (o frame-ancestors en CSP).',
    });

    // 4. Referrer & Permissions Policy
    const refPol = h.get('referrer-policy');
    const permPol = h.get('permissions-policy');
    controles.push({
      id: 'referrer-permissions',
      categoria: 'HTTP Headers',
      control: 'Referrer-Policy & Permissions-Policy',
      estado: refPol && permPol ? 'ok' : refPol || permPol ? 'aviso' : 'brecha',
      detalle: `Referrer-Policy: ${refPol || 'ausente'} · Permissions-Policy: ${permPol ? 'presente' : 'ausente'}`,
      recomendacion: en
        ? 'Set Referrer-Policy: strict-origin-when-cross-origin and restrict camera/microphone/geolocation via Permissions-Policy.'
        : 'Configurar Referrer-Policy: strict-origin-when-cross-origin y restringir cámara/micrófono/geolocalización en Permissions-Policy.',
    });

    // 5. CORS & Server fingerprint
    const acao = h.get('access-control-allow-origin');
    const powered = h.get('x-powered-by');
    controles.push({
      id: 'cors-fingerprint',
      categoria: 'Superficie API',
      control: 'CORS & Huella de Servidor',
      estado: acao === '*' || powered ? 'aviso' : 'ok',
      detalle: `Access-Control-Allow-Origin: ${acao || 'restringido'} · X-Powered-By: ${powered || 'oculto'}`,
      recomendacion:
        acao === '*' || powered
          ? en ? 'Avoid wildcard CORS on authenticated endpoints and strip X-Powered-By.' : 'Evitar CORS abierto (*) en rutas con sesión y suprimir la cabecera X-Powered-By.'
          : en ? 'No wildcard CORS or X-Powered-By header exposed on root.' : 'Sin CORS abierto ni X-Powered-By expuesto en la raíz.',
    });

    // 6. SPF & DMARC
    const spf = spfRecords.find((t) => t.toLowerCase().includes('v=spf1'));
    const dmarc = dmarcRecords.find((t) => t.toLowerCase().includes('v=dmarc1'));
    const dmarcStrict = dmarc && /p=(?:quarantine|reject)/i.test(dmarc);
    controles.push({
      id: 'spf-dmarc',
      categoria: 'DNS & Correo',
      control: 'Autenticación de correo (SPF + DMARC)',
      estado: spf && dmarcStrict ? 'ok' : spf && dmarc ? 'aviso' : 'brecha',
      detalle: `SPF: ${spf ? 'presente' : 'ausente'} · DMARC: ${dmarc ? (dmarcStrict ? 'activo (quarantine/reject)' : 'en modo p=none') : 'ausente'}`,
      recomendacion:
        spf && dmarcStrict
          ? en ? 'SPF and enforcement DMARC are active.' : 'SPF y política DMARC de bloqueo activos.'
          : en ? 'Publish SPF (-all/~all) and DMARC with p=quarantine or p=reject to prevent domain spoofing.' : 'Publicar registro SPF y política DMARC con p=quarantine o p=reject para impedir suplantación de identidad (phishing).',
    });

    // 7. CAA
    controles.push({
      id: 'caa',
      categoria: 'DNS & TLS',
      control: 'Restricción de emisores TLS (DNS CAA)',
      estado: caaRecords.length > 0 ? 'ok' : 'aviso',
      detalle: caaRecords.length > 0 ? `${caaRecords.length} regla(s) CAA publicada(s)` : en ? 'No DNS CAA record found' : 'Sin registro DNS CAA publicado',
      recomendacion: en
        ? 'Publish DNS CAA records to restrict which Certificate Authorities can issue TLS certificates for your domain.'
        : 'Publicar registros DNS CAA para limitar qué autoridades certificadoras pueden emitir certificados TLS para el dominio.',
    });

    // 8. Archivos sensibles expuestos (.env / .git/HEAD)
    const envExposed = Boolean(envCheck && envCheck.status === 200 && /(?:API_KEY|SECRET|PASSWORD|DB_|AWS_)=/i.test(envCheck.sample));
    const gitExposed = Boolean(gitCheck && gitCheck.status === 200 && gitCheck.sample.startsWith('ref: refs/'));
    controles.push({
      id: 'archivos-sensibles',
      categoria: 'Exposición en Raíz',
      control: 'Archivos de entorno y repositorio (/.env, /.git)',
      estado: envExposed || gitExposed ? 'brecha' : 'ok',
      detalle:
        envExposed || gitExposed
          ? `EXPUESTO: ${[envExposed ? '/.env' : '', gitExposed ? '/.git/HEAD' : ''].filter(Boolean).join(', ')}`
          : en ? 'Not exposed on public root (404/403)' : 'No expuestos en la raíz pública (bloqueados correctamente)',
      recomendacion:
        envExposed || gitExposed
          ? en ? 'URGENT: Block access to dotfiles (.env, .git) at the CDN/server layer and rotate any exposed secrets immediately.' : 'URGENTE: Bloquear acceso a archivos ocultos (.env, .git) en el CDN/servidor y rotar de inmediato cualquier llave expuesta.'
          : en ? 'Keep dotfiles blocked at the edge and keep secrets in a managed vault.' : 'Mantener archivos ocultos bloqueados en el CDN y guardar secretos en una bóveda administrada.',
    });

    // 9. Gobernanza de seguridad e IA (security.txt & llms.txt)
    const hasSecTxt = Boolean(secTxt && secTxt.status === 200 && /contact:/i.test(secTxt.sample));
    const hasLlmsTxt = Boolean(llmsTxt && llmsTxt.status === 200 && llmsTxt.sample.trim().length > 20 && !llmsTxt.sample.trim().startsWith('<!DOCTYPE'));
    controles.push({
      id: 'gobernanza-ia',
      categoria: 'Gobernanza & IA',
      control: 'Divulgación de seguridad (RFC 9116) y llms.txt',
      estado: hasSecTxt && hasLlmsTxt ? 'ok' : hasSecTxt || hasLlmsTxt ? 'aviso' : 'brecha',
      detalle: `/.well-known/security.txt: ${hasSecTxt ? 'activo' : 'ausente'} · /llms.txt: ${hasLlmsTxt ? 'activo' : 'ausente'}`,
      recomendacion: en
        ? 'Publish /.well-known/security.txt (RFC 9116) for vulnerability disclosure and /llms.txt to control how AI engines index your architecture.'
        : 'Publicar /.well-known/security.txt (RFC 9116) como canal oficial de reporte de vulnerabilidades y /llms.txt para gobernar qué leen los agentes de IA sobre tu empresa.',
    });

    const okCount = controles.filter((c) => c.estado === 'ok').length;
    const warnCount = controles.filter((c) => c.estado === 'aviso').length;
    const failCount = controles.filter((c) => c.estado === 'brecha').length;
    const puntaje = Math.round(((okCount * 1 + warnCount * 0.5) / controles.length) * 100);
    const fechaIso = new Date().toISOString().slice(0, 10);

    // Checklist anti-desvío de pagos (ACH / wire / facturas falsas): no suma al puntaje; solo DNS público.
    const proveedor = proveedorCorreo(mxRecords);
    const dkimSelectores = proveedor === 'microsoft365' ? ['selector1', 'selector2'] : proveedor === 'google' ? ['google'] : [];
    const dkimDefecto = dkimSelectores.length
      ? (await Promise.all(dkimSelectores.map((sel) => dnsTxt(`${sel}._domainkey.${dominio}`, 'TXT')))).some((r) => r.length > 0)
      : null;
    const suplantable = !dmarc || /p=none/i.test(dmarc);
    const pagos = { proveedor, dkimDefecto, suplantable };
    const pagosMd = checklistPagos(pagos, en);

    // Lectura tipo aseguradora (cyber insurance): 6 señales externas; no suma al puntaje.
    const spfLista = spfRecords.filter((t) => t.toLowerCase().startsWith('v=spf1'));
    const serverHdr = h.get('server') || '';
    const seguroSenales: Seguro['senales'] = [
      { id: 'spf-valido', ok: spfLista.length === 1 && /[-~]all\b/i.test(spfLista[0]) },
      { id: 'dmarc-aplicado', ok: Boolean(dmarcStrict) },
      { id: 'https-valido', ok: true },
      { id: 'http-a-https', ok: httpRedirige },
      { id: 'hsts', ok: Boolean(hsts) },
      { id: 'sin-version', ok: !(/\d/.test(serverHdr) || /\d/.test(powered || '')) },
    ];
    const seguro: Seguro = {
      senales: seguroSenales,
      cumple: seguroSenales.filter((x) => x.ok === true).length,
      medibles: seguroSenales.filter((x) => x.ok !== null).length,
    };
    const seguroMd = checklistSeguro(seguro, en);

    const mdLines = [
      `# Diagnóstico Pasivo de Arquitectura y Superficie Pública — ${dominio}`,
      `Fecha: ${fechaIso} · Generado por Omona (https://omona.tech/seguridad)`,
      `Puntaje de postura pública: **${puntaje}/100** (${okCount} controles en orden · ${warnCount} avisos · ${failCount} brechas)`,
      ``,
      `> Nota: Esta evaluación es 100 % pasiva sobre cabeceras HTTP, DNS y rutas de gobernanza pública. No incluye revisión de permisos IAM en la nube (AWS Bedrock / GCP / Cloudflare), código fuente privado ni pruebas de prompt injection contra agentes de IA.`,
      ``,
      `## Controles evaluados`,
      ...controles.map(
        (c, i) =>
          `${i + 1}. **[${c.estado.toUpperCase()}] ${c.categoria} — ${c.control}**\n   - Hallazgo: ${c.detalle}\n   - Acción recomendada: ${c.recomendacion}`,
      ),
      ``,
      ...pagosMd,
      ``,
      ...seguroMd,
      ``,
      `## Siguiente paso: Auditoría profunda (Alcance firmado)`,
      `Para evaluar repositorios privados, configuración IAM/secretos en AWS Bedrock o Cloudflare y resistencia a prompt injection de tus agentes de IA:`,
      `- Agendar revisión con Omona: mailto:victor@omona.tech?subject=${encodeURIComponent(`Auditoría de seguridad y agentes IA — ${dominio} (${puntaje}/100)`)}`,
    ];

    return NextResponse.json({
      ok: true,
      dominio,
      fecha: fechaIso,
      puntaje,
      conteos: { ok: okCount, aviso: warnCount, brecha: failCount },
      controles,
      pagos,
      seguro,
      markdown: mdLines.join('\n'),
    });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}
