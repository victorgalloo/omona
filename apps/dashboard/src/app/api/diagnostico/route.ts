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

    const [mainResp, spfRecords, dmarcRecords, caaRecords, secTxt, llmsTxt, envCheck, gitCheck] = await Promise.all([
      headOrGet(`https://${dominio}/`),
      dnsTxt(dominio, 'TXT'),
      dnsTxt(`_dmarc.${dominio}`, 'TXT'),
      dnsTxt(dominio, 'CAA'),
      headOrGet(`https://${dominio}/.well-known/security.txt`, 1024),
      headOrGet(`https://${dominio}/llms.txt`, 1024),
      headOrGet(`https://${dominio}/.env`, 512),
      headOrGet(`https://${dominio}/.git/HEAD`, 512),
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
      markdown: mdLines.join('\n'),
    });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}
