import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Verificador pasivo de primera respuesta y bilingüismo (Área 01 · Darío).
 * 0 tokens de LLM: 1 GET a la portada pública (máx. 384 KB del HTML inicial) y
 * expresiones regulares portadas de ~/.hermes/omona/comercial/medir_embudo_us_hispanos.py,
 * el mismo medidor que dio la línea base de 593 negocios hispanos en EE. UU. (26-nov-2026).
 * Nunca envía formularios, nunca abre chats, nunca prueba rutas ocultas.
 */

type Estado = 'ok' | 'aviso' | 'brecha';
type Control = {
  id: string;
  categoria: string;
  control: string;
  estado: Estado;
  detalle: string;
  recomendacion: string;
  base: number; // % de los 593 negocios hispanos medidos que pasan este control
};

const DOMINIO_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;
const BLOQUEADOS = /\.(?:local|internal|localhost|arpa|onion|gov|mil|edu|gob\.[a-z]{2,3}|edu\.[a-z]{2,3})$/i;
const MAX_BYTES = 393216;
const UA = 'Mozilla/5.0 (Omona-Speed-to-Lead-Check/1.0; +https://omona.tech/en/speed-to-lead-checker)';

function limpiarDominio(raw: string): string | null {
  let d = String(raw || '').trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').split('/')[0].split('?')[0].split('#')[0].split(':')[0];
  d = d.replace(/^www\./, '');
  if (!d || d.length > 190 || !DOMINIO_RE.test(d) || BLOQUEADOS.test(d)) return null;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(d)) return null;
  return d;
}

// Defensa SSRF: el dominio tiene que resolver a IPs públicas antes de pedirle nada.
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

async function leerPortada(dominio: string): Promise<{ html: string; url: string; ms: number } | 'bloqueado' | null> {
  let bloqueado = false;
  for (const url of [`https://${dominio}/`, `https://www.${dominio}/`, `http://${dominio}/`]) {
    const t0 = Date.now();
    try {
      const r = await fetch(url, {
        redirect: 'follow',
        headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml', 'accept-language': 'en-US,en;q=0.8,es;q=0.6' },
        signal: AbortSignal.timeout(6500),
      });
      const reader = r.body?.getReader();
      if (!reader) continue;
      const partes: Uint8Array[] = [];
      let total = 0;
      while (total < MAX_BYTES) {
        const { value, done } = await reader.read();
        if (done || !value) break;
        partes.push(value);
        total += value.length;
      }
      await reader.cancel().catch(() => {});
      const buf = new Uint8Array(Math.min(total, MAX_BYTES));
      let off = 0;
      for (const p of partes) {
        const s = p.slice(0, Math.max(0, buf.length - off));
        buf.set(s, off);
        off += s.length;
        if (off >= buf.length) break;
      }
      const html = new TextDecoder().decode(buf);
      const ctype = (r.headers.get('content-type') || '').toLowerCase();
      if (!ctype.includes('html') && !/<html/i.test(html.slice(0, 3000))) continue;
      // Reto anti-bot (Cloudflare, Imperva, DataDome) o error HTTP: no es la portada real; no la califiques.
      if (r.status >= 400 || RE_RETO.test(html.slice(0, 20000))) {
        bloqueado = true;
        continue;
      }
      return { html, url: r.url || url, ms: Date.now() - t0 };
    } catch {
      /* siguiente candidato */
    }
  }
  return bloqueado ? 'bloqueado' : null;
}

// ── Señales (idénticas al medidor de la línea base) ─────────────────────────
const RE_WA = /(?:api\.whatsapp\.com\/send|wa\.me\/|web\.whatsapp\.com\/send|whatsapp:\/\/send)[^\s"'<>]*/gi;
const RE_WA_TEXT = /[?&]text=[^&"'<>]{3,}/i;
const RE_SMS = /href\s*=\s*["']sms:([^"']*)["']/gi;
const RE_TEL = /href\s*=\s*["']tel:/i;
const RE_MAILTO = /href\s*=\s*["']mailto:/i;
const RE_AGENDA =
  /(?:calendly\.com\/|cal\.com\/|meetings\.hubspot\.com\/|bookings\.microsoft\.com\/|outlook\.office365\.com\/owa\/calendar|tidycal\.com\/|acuityscheduling\.com\/|as\.me\/|youcanbook\.me\/|setmore\.com|squareup\.com\/appointments|square\.site\/book|book\.squareup|vagaro\.com|booksy\.com|schedulicity|housecallpro\.com|getjobber\.com|clienthub\.getjobber|zocdoc\.com|simplybook\.me|appointy\.com|leadconnectorhq\.com\/widget\/booking|msgsndr\.com\/widget\/booking|\/widget\/booking\/|opentable\.com|resy\.com)/i;
const RE_CHAT_WIDGET =
  /(?:widget\.intercom\.io|js\.intercomcdn\.com|static\.zdassets\.com|code\.tidio\.co|client\.crisp\.chat|embed\.tawk\.to|js\.driftt\.com|cdn\.livechatinc\.com|manychat\.com|landbot\.io|js\.hs-scripts\.com|js\.usemessages\.com|wati\.io|kommo\.com|respond\.io|chatwoot|podium\.com|connect\.podium|birdeye\.com|widget\.birdeye|smith\.ai|ruby\.com\/chat|widgets\.leadconnectorhq\.com|chat-widget|olark\.com|purechat\.com|smartsupp|jivosite|jivochat|zopim|freshchat|wchat\.freshchat|elfsight\.com\/whatsapp|getbutton\.io|joinchat|wp-whatsapp-chat|whatsapp-button|textmagic|signpost\.com|nicejob|gorgias|tars\.chat|chatbase\.co|botpress|voiceflow|liveperson|salesiq\.zoho|messenger\.com\/t\/|m\.me\/)/i;
const RE_FORM = /<form\b[^>]*>([\s\S]*?)<\/form>/gi;
const RE_SEARCH_ONLY = /(?:role\s*=\s*["']search["']|name\s*=\s*["'](?:s|q|query|search)["'])/i;
const RE_CONTACT_INPUT =
  /(?:type\s*=\s*["'](?:email|tel)["']|name\s*=\s*["'][^"']*(?:mail|phone|tel|message|mensaje|name|nombre|company)[^"']*["'])/i;
const RE_FORM_EMBED =
  /(?:wpcf7|gform_wrapper|wpforms|ninja-forms|elementor-form|hsforms\.net|hbspt\.forms|jotform|typeform\.com|forms\.zohopublic|formstack|cognitoforms|leadconnectorhq\.com\/widget\/form|msgsndr\.com\/widget\/form|wix-forms|wixforms|squarespace-form|sqs-block-form|fluentform|formidable|forminator)/i;
const RE_HREFLANG_ES = /hreflang\s*=\s*["']es/i;
const RE_HREFLANG_EN = /hreflang\s*=\s*["']en/i;
const RE_LANG_ATTR = /<html\b[^>]*\blang\s*=\s*["']?([a-zA-Z]{2})/i;
const RE_SELECTOR =
  /(?:href\s*=\s*["'][^"']*\/(?:es|es-us|es-mx|en|en-us)\/["']|href\s*=\s*["'][^"']*[?&](?:lang|language|hl)=(?:es|en)\b|>\s*(?:Espa(?:ñ|&ntilde;|&#241;)ol|Spanish)\s*<|>\s*English\s*<|>\s*(?:ES|EN)\s*\|\s*(?:EN|ES)\s*<)/i;
const RE_TRADUCTOR =
  /(?:gtranslate|weglot|translate\.google\.com\/translate_a\/element|google_translate_element|translatepress|trp-language|wpml|icl_lang|polylang|pll_|conveythis|localizejs|transifex|bablic|langify|linguise)/i;
const RE_HABLA =
  /(?:se\s+habla\s+espa(?:ñ|&ntilde;|n)ol|hablamos\s+espa(?:ñ|&ntilde;|n)ol|we\s+speak\s+spanish|spanish[\s-]+speaking|bilingual|biling(?:ü|u)e)/i;
const STOP_ES = new Set(
  'de la que el en los del las por con para una es se su al lo como más pero sus le ya o este sí porque esta entre cuando muy sin sobre también nuestro nuestros nuestra servicios ofrecemos contáctenos llámenos'.split(' '),
);
const STOP_EN = new Set('the and of to in for is on with your our we you are that this from at by as be it or an can contact us call services about'.split(' '));

function idiomaDominante(html: string): 'es' | 'en' | 'mixto' | 'indeterminado' {
  const texto = html.replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').toLowerCase();
  const palabras = texto.match(/[a-záéíóúñü]+/gi) ?? [];
  let es = 0;
  let en = 0;
  for (const w of palabras) {
    if (STOP_ES.has(w)) es++;
    if (STOP_EN.has(w)) en++;
  }
  if (es + en < 15) return 'indeterminado';
  const r = es / (es + en);
  return r >= 0.65 ? 'es' : r <= 0.2 ? 'en' : 'mixto';
}

function analizar(html: string) {
  const wa = html.match(RE_WA) ?? [];
  const sms = Array.from(html.matchAll(RE_SMS)).map((m) => m[1] || '');
  const smsBody = sms.some((s) => /[?&]body=.{3,}/i.test(s));
  const widget = RE_CHAT_WIDGET.test(html);
  let form = RE_FORM_EMBED.test(html);
  if (!form) {
    for (const m of Array.from(html.matchAll(RE_FORM))) {
      const body = m[1] || '';
      if (RE_CONTACT_INPUT.test(body) && !(RE_SEARCH_ONLY.test(body) && !/email|mail|phone|message|mensaje/i.test(body))) {
        form = true;
        break;
      }
    }
  }
  const hreflang = RE_HREFLANG_ES.test(html) && RE_HREFLANG_EN.test(html);
  const selector = RE_SELECTOR.test(html);
  const traductor = RE_TRADUCTOR.test(html);
  const habla = RE_HABLA.test(html);
  const langAttr = (html.match(RE_LANG_ATTR)?.[1] || '').toLowerCase();
  const dom = idiomaDominante(html);
  const bilingue = hreflang || selector || traductor || dom === 'mixto';
  return {
    whatsapp: wa.length > 0,
    whatsappTexto: wa.some((m) => RE_WA_TEXT.test(m)),
    sms: sms.length > 0,
    smsTexto: smsBody,
    widget,
    agenda: RE_AGENDA.test(html),
    tel: RE_TEL.test(html),
    mailto: RE_MAILTO.test(html),
    form,
    hreflang,
    selector,
    traductor,
    habla,
    langAttr,
    dom,
    bilingue,
    algunEspanol: bilingue || dom === 'es' || langAttr === 'es' || habla,
    textoInmediato: wa.length > 0 || sms.length > 0 || widget,
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { dominio?: string; autorizado?: boolean; lang?: 'es' | 'en' };
    const en = body.lang === 'en';
    const L = (es: string, eng: string) => (en ? eng : es);
    if (!body.autorizado) {
      return NextResponse.json(
        { error: L('Confirma que el sitio es tuyo o que tienes permiso para revisarlo.', 'Confirm you own this website or are authorized to review it.') },
        { status: 400 },
      );
    }
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
    const portada = await leerPortada(dominio);
    if (portada === 'bloqueado') {
      return NextResponse.json(
        {
          error: L(
            `${dominio} responde con un reto anti-bot o un error HTTP a lectores automáticos, así que no calificamos una página que no es tu portada real. Si es tu sitio, revisa que Google y los buscadores de IA sí puedan leerla.`,
            `${dominio} answers automated readers with an anti-bot challenge or an HTTP error, so we do not score a page that is not your real homepage. If it is your site, make sure Google and AI search crawlers can read it.`,
          ),
        },
        { status: 422 },
      );
    }
    if (!portada) {
      return NextResponse.json(
        { error: L(`No se pudo leer la portada de ${dominio} en 6 segundos.`, `Could not read the ${dominio} homepage within 6 seconds.`) },
        { status: 422 },
      );
    }

    const s = analizar(portada.html);
    const canales = [s.widget && 'chat', s.sms && 'SMS', s.whatsapp && 'WhatsApp'].filter(Boolean).join(' + ');
    const controles: Control[] = [];

    controles.push({
      id: 'texto-inmediato',
      categoria: L('Primera respuesta', 'First response'),
      control: L('Canal de texto inmediato (chat, SMS o WhatsApp)', 'Instant text channel (chat, SMS or WhatsApp)'),
      estado: s.textoInmediato ? 'ok' : 'brecha',
      detalle: s.textoInmediato ? L(`Detectado: ${canales}`, `Found: ${canales}`) : L('Ninguno en el HTML de la portada', 'None in the homepage HTML'),
      recomendacion: s.textoInmediato
        ? L('Mide cuánto tarda la primera respuesta real fuera de horario: la meta es menos de 60 segundos.', 'Measure the real after-hours first response: the target is under 60 seconds.')
        : L('Agrega un canal de texto (SMS «Text us», WhatsApp o chat) que conteste en menos de 60 segundos, también de noche y en fin de semana.', 'Add a text channel ("Text us" SMS, WhatsApp or chat) that answers in under 60 seconds, nights and weekends included.'),
      base: 11.3,
    });

    const hayMensajeria = s.whatsapp || s.sms;
    const conContexto = s.whatsappTexto || s.smsTexto;
    controles.push({
      id: 'contexto-precargado',
      categoria: L('Primera respuesta', 'First response'),
      control: L('Mensaje precargado en WhatsApp o SMS', 'Prefilled message on WhatsApp or SMS'),
      estado: conContexto ? 'ok' : hayMensajeria || s.widget ? 'aviso' : 'brecha',
      detalle: conContexto
        ? L('El enlace abre con texto (?text= / ?body=)', 'The link opens with text (?text= / ?body=)')
        : hayMensajeria
          ? L('El enlace abre en blanco, sin decir de qué página o servicio viene', 'The link opens blank, with no page or service context')
          : L('Sin enlace de WhatsApp ni SMS', 'No WhatsApp or SMS link'),
      recomendacion: L(
        'Usa wa.me/<número>?text=Hola, vengo de <página> o sms:<número>?body=…: el cliente ya no tiene que explicar qué busca y el agente sabe desde dónde llegó.',
        'Use wa.me/<number>?text=Hi, I came from <page> or sms:<number>?body=…: the customer no longer has to explain, and the agent knows where they came from.',
      ),
      base: 0.7,
    });

    controles.push({
      id: 'click-to-call',
      categoria: L('Captura', 'Capture'),
      control: L('Botón para llamar (tel:)', 'Click-to-call link (tel:)'),
      estado: s.tel ? 'ok' : 'brecha',
      detalle: s.tel ? L('Enlace tel: presente', 'tel: link present') : L('Sin enlace tel: (en celular no se puede marcar con un toque)', 'No tel: link (mobile visitors cannot call with one tap)'),
      recomendacion: s.tel
        ? s.textoInmediato
          ? L('Activa «missed call text back»: cada llamada perdida recibe un SMS en segundos.', 'Turn on missed-call text back: every missed call gets an SMS within seconds.')
          : L('El teléfono es tu único canal rápido: activa «missed call text back» para que cada llamada perdida reciba un SMS en segundos.', 'The phone is your only fast channel: turn on missed-call text back so every missed call gets an SMS within seconds.')
        : L('Agrega <a href="tel:+1…"> en el encabezado y el pie.', 'Add <a href="tel:+1…"> to the header and footer.'),
      base: 42.2,
    });

    controles.push({
      id: 'formulario',
      categoria: L('Captura', 'Capture'),
      control: L('Formulario de contacto o cotización', 'Contact or quote form'),
      estado: s.form ? 'ok' : s.mailto ? 'aviso' : 'brecha',
      detalle: s.form
        ? L('Formulario detectado en la portada', 'Form found on the homepage')
        : s.mailto
          ? L('Solo mailto: (el correo abre la app del visitante, y muchos no la tienen configurada)', 'Only mailto: (opens the visitor mail app, which many have not set up)')
          : L('Sin formulario en el HTML de la portada', 'No form in the homepage HTML'),
      recomendacion: L(
        'Conecta el formulario a tu CRM y a una respuesta automática por SMS o WhatsApp en menos de 60 segundos; pide el consentimiento TCPA en el mismo formulario.',
        'Wire the form to your CRM and to an automatic SMS or WhatsApp reply within 60 seconds; collect TCPA consent on the same form.',
      ),
      base: 45.4,
    });

    controles.push({
      id: 'agenda',
      categoria: L('Conversión', 'Conversion'),
      control: L('Agenda en línea (citas o visitas)', 'Online booking (appointments or estimates)'),
      estado: s.agenda ? 'ok' : 'aviso',
      detalle: s.agenda ? L('Enlace de agenda detectado', 'Booking link found') : L('Sin agenda en línea visible', 'No visible online booking'),
      recomendacion: L(
        'Deja que el cliente aparte cita o visita de cotización sin esperar a que le devuelvan la llamada (Calendly, Square, Jobber, Housecall Pro o tu CRM).',
        'Let customers book an appointment or estimate visit without waiting for a callback (Calendly, Square, Jobber, Housecall Pro or your CRM).',
      ),
      base: 4.7,
    });

    const senalesBil = [s.hreflang && 'hreflang', s.selector && L('selector de idioma', 'language switcher'), s.traductor && L('plugin de traducción', 'translation plugin'), s.dom === 'mixto' && L('texto en los dos idiomas', 'copy in both languages')].filter(Boolean).join(', ');
    controles.push({
      id: 'bilingue',
      categoria: L('Idioma', 'Language'),
      control: L('Sitio bilingüe (español + inglés)', 'Bilingual website (Spanish + English)'),
      estado: s.bilingue ? 'ok' : s.algunEspanol ? 'aviso' : 'brecha',
      detalle: s.bilingue
        ? L(`Ofrece los dos idiomas: ${senalesBil}`, `Offers both languages: ${senalesBil}`)
        : s.algunEspanol
          ? L(`Dice que atiende en español, pero el sitio no ofrece las dos versiones (idioma dominante: ${s.dom})`, `Says it serves Spanish speakers, but the site does not offer both versions (dominant language: ${s.dom})`)
          : L(`Un solo idioma (dominante: ${s.dom}${s.langAttr ? `, lang="${s.langAttr}"` : ''})`, `Single language (dominant: ${s.dom}${s.langAttr ? `, lang="${s.langAttr}"` : ''})`),
      recomendacion: L(
        'Publica la versión en español de las páginas que venden (servicios, cotización, contacto) y que el primer mensaje se conteste en el idioma en que te escribieron.',
        'Publish a Spanish version of the pages that sell (services, quote, contact) and answer the first message in the language the customer used.',
      ),
      base: 25.5,
    });

    controles.push({
      id: 'hreflang',
      categoria: L('Idioma · SEO', 'Language · SEO'),
      control: L('hreflang es + en declarado', 'hreflang es + en declared'),
      estado: s.hreflang ? 'ok' : 'aviso',
      detalle: s.hreflang ? L('Google sabe qué versión mostrar en cada idioma', 'Google knows which version to show in each language') : L('Sin hreflang es/en: Google puede mostrar la versión en inglés a quien busca en español', 'No es/en hreflang: Google may show the English page to people searching in Spanish'),
      recomendacion: L(
        'Declara <link rel="alternate" hreflang="es-US"> y hreflang="en-US" recíprocos en cada página traducida, más x-default.',
        'Declare reciprocal <link rel="alternate" hreflang="es-US"> and hreflang="en-US" on every translated page, plus x-default.',
      ),
      base: 6.4,
    });

    const okCount = controles.filter((c) => c.estado === 'ok').length;
    const warnCount = controles.filter((c) => c.estado === 'aviso').length;
    const failCount = controles.filter((c) => c.estado === 'brecha').length;
    const puntaje = Math.round(((okCount + warnCount * 0.5) / controles.length) * 100);
    const fecha = new Date().toISOString().slice(0, 10);
    const pagina = en ? 'https://omona.tech/en/speed-to-lead-checker' : 'https://omona.tech/verificador-embudo-bilingue';
    const guia = en ? 'https://omona.tech/blog/bilingual-answering-service-ai-small-business' : 'https://omona.tech/blog/recepcionista-bilingue-ia-negocios-latinos';
    const badge = (e: Estado) => (en ? { ok: 'PASS', aviso: 'WARN', brecha: 'GAP' } : { ok: 'OK', aviso: 'AVISO', brecha: 'BRECHA' })[e];

    const md = [
      L(`# Verificador de atención inmediata y sitio bilingüe — ${dominio}`, `# Speed-to-lead & bilingual website check — ${dominio}`),
      L(`Fecha: ${fecha} · Generado por Omona (${pagina})`, `Date: ${fecha} · Generated by Omona (${pagina})`),
      L(
        `Puntaje: **${puntaje}/100** (${okCount} en orden · ${warnCount} avisos · ${failCount} brechas) · portada leída: ${portada.url}`,
        `Score: **${puntaje}/100** (${okCount} passing · ${warnCount} warnings · ${failCount} gaps) · homepage read: ${portada.url}`,
      ),
      '',
      L(
        '> Lectura 100 % pasiva: 1 GET a la portada pública. No enviamos formularios ni abrimos chats. Los widgets que se inyectan con JavaScript después de cargar no se ven: si tienes uno, cuenta como piso, no como techo.',
        '> 100% passive read: one GET to the public homepage. No forms submitted, no chats opened. Widgets injected by JavaScript after load are not visible: treat results as a floor, not a ceiling.',
      ),
      '',
      L('## Controles evaluados', '## Checks'),
      ...controles.map(
        (c, i) =>
          `${i + 1}. **[${badge(c.estado)}] ${c.categoria} — ${c.control}**\n   - ${L('Hallazgo', 'Finding')}: ${c.detalle}\n   - ${L('Línea base', 'Baseline')}: ${L(`${c.base} % de 593 negocios hispanos en EE. UU. lo cumplen`, `${c.base}% of 593 US Hispanic businesses pass`)}\n   - ${L('Acción', 'Action')}: ${c.recomendacion}`,
      ),
      '',
      L('## Lo que este verificador no puede ver (y conviene revisar)', '## What this check cannot see (worth reviewing)'),
      L('- [ ] Tiempo real de primera respuesta fuera de horario (manda tú un mensaje un domingo a las 9 p. m.).', '- [ ] Real after-hours first-response time (send yourself a message on a Sunday at 9 p.m.).'),
      L('- [ ] «Missed call text back»: ¿cada llamada perdida recibe un SMS en segundos?', '- [ ] Missed-call text back: does every missed call get an SMS within seconds?'),
      L('- [ ] Registro A2P 10DLC del número que manda SMS y consentimiento TCPA guardado por contacto.', '- [ ] A2P 10DLC registration for your texting number and TCPA consent stored per contact.'),
      L('- [ ] Que el agente (humano o IA) solo cotice precios de tu lista autorizada y pase a una persona con resumen del caso.', '- [ ] That the agent (human or AI) only quotes prices from your approved list and hands off to a person with a case summary.'),
      '',
      L(`Guía completa con la medición de 593 negocios hispanos: ${guia}`, `Full guide with the 593-business benchmark: ${guia}`),
      '',
      L('## Siguiente paso', '## Next step'),
      L(
        `- Revisión de tu proceso comercial bilingüe con Omona: mailto:victor@omona.tech?subject=${encodeURIComponent(`Revisión comercial bilingüe — ${dominio} (${puntaje}/100)`)}`,
        `- Bilingual commercial process review with Omona: mailto:victor@omona.tech?subject=${encodeURIComponent(`Bilingual commercial review — ${dominio} (${puntaje}/100)`)}`,
      ),
    ];

    return NextResponse.json({
      ok: true,
      dominio,
      fecha,
      url: portada.url,
      puntaje,
      conteos: { ok: okCount, aviso: warnCount, brecha: failCount },
      controles,
      markdown: md.join('\n'),
    });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}
