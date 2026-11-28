'use client';

import { useState } from 'react';

type Control = {
  id: string;
  categoria: string;
  control: string;
  estado: 'ok' | 'aviso' | 'brecha';
  puntos: number;
  max: number;
  base: number;
  detalle: string;
  recomendacion: string;
};

type Resultado = {
  dominio: string;
  url: string;
  fecha: string;
  puntaje: number;
  letra: string;
  conteos: { ok: number; aviso: number; brecha: number };
  controles: Control[];
  crudas: { nombre: string; valor: string }[];
  markdown: string;
};

const COPY = {
  es: {
    title: '¿Qué cabeceras de seguridad manda tu sitio web?',
    sub: 'Escribe el dominio de tu negocio. Leemos tu portada pública una vez por HTTPS y una por HTTP —como cualquier navegador— y calificamos de la A a la F las 8 cabeceras que protegen a tus visitantes, con el texto exacto para copiar en tu servidor o CDN.',
    placeholder: 'tunegocio.com',
    btnRun: 'Revisar cabeceras →',
    btnRunning: 'Leyendo cabeceras…',
    okLabel: 'en orden',
    warnLabel: 'avisos',
    failLabel: 'brechas',
    baseLabel: 'lo pasa',
    rawLabel: 'Cabeceras recibidas',
    downloadBtn: 'Descargar entregable (.md)',
    copyBtn: 'Copiar reporte',
    copiedBtn: 'Copiado ✓',
    ctaTitle: '¿Tu sitio corre en WordPress, Wix o un hosting donde no puedes tocar el servidor?',
    ctaSub: 'El entregable trae las cabeceras listas para Nginx, Apache, Vercel y Cloudflare. Si prefieres que lo revisemos contigo, junto con correo (SPF/DMARC) y los requisitos de tu póliza cyber:',
    ctaBook: 'Agendar revisión →',
    ctaMore: 'Ver ciberseguridad',
    badge: { ok: 'OK', aviso: 'AVISO', brecha: 'BRECHA' },
    err: 'Error de red al revisar el sitio.',
  },
  en: {
    title: 'Which security headers does your website send?',
    sub: 'Enter your business domain. We read your public homepage once over HTTPS and once over HTTP —like any browser— and grade A to F the 8 headers that protect your visitors, with the exact lines to copy into your server or CDN.',
    placeholder: 'yourbusiness.com',
    btnRun: 'Check headers →',
    btnRunning: 'Reading headers…',
    okLabel: 'passing',
    warnLabel: 'warnings',
    failLabel: 'gaps',
    baseLabel: 'pass',
    rawLabel: 'Headers received',
    downloadBtn: 'Download deliverable (.md)',
    copyBtn: 'Copy report',
    copiedBtn: 'Copied ✓',
    ctaTitle: 'Running WordPress, Wix or hosting where you cannot touch the server?',
    ctaSub: 'The deliverable includes the headers ready for Nginx, Apache, Vercel and Cloudflare. If you would rather review it with us, together with email (SPF/DMARC) and your cyber insurance requirements:',
    ctaBook: 'Book a review →',
    ctaMore: 'See security',
    badge: { ok: 'PASS', aviso: 'WARN', brecha: 'GAP' },
    err: 'Network error while checking the website.',
  },
};

export function DiagnosticoCabeceras({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const t = COPY[lang];
  const en = lang === 'en';
  const [dominio, setDominio] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [res, setRes] = useState<Resultado | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function correr(d: string) {
    setError(null);
    setCargando(true);
    try {
      const r = await fetch('/api/cabeceras', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ dominio: d, lang }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        setRes(null);
        setError(j.error || t.err);
      } else setRes(j);
    } catch {
      setError(t.err);
    } finally {
      setCargando(false);
    }
  }

  function descargarMd() {
    if (!res) return;
    const blob = new Blob([res.markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${en ? 'security-headers' : 'cabeceras-seguridad'}-omona-${res.dominio}-${res.fecha}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copiarMd() {
    if (!res) return;
    await navigator.clipboard.writeText(res.markdown);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const mailto = `mailto:victor@omona.tech?subject=${encodeURIComponent(
    res
      ? en
        ? `Security headers review — ${res.dominio} (${res.letra}, ${res.puntaje}/100)`
        : `Revisión de cabeceras — ${res.dominio} (${res.letra}, ${res.puntaje}/100)`
      : en
        ? 'Security headers review — Omona'
        : 'Revisión de cabeceras de seguridad — Omona',
  )}`;

  return (
    <section id="verificador" aria-labelledby="verificador-heading" className="border-t border-obsidian pt-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 id="verificador-heading" className="text-[22px] font-medium leading-[1.2] tracking-[-0.03em] text-obsidian sm:text-[26px]">
            {t.title}
          </h2>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.5] text-charcoal">{t.sub}</p>
        </div>
        <div className="mono-label flex items-center gap-2 text-stone">
          <span>{en ? 'Try example:' : 'Probar ejemplo:'}</span>
          {['omona.tech', 'ushcc.com'].map((ej) => (
            <button
              key={ej}
              type="button"
              onClick={() => {
                setDominio(ej);
                void correr(ej);
              }}
              className="underline decoration-hair underline-offset-4 transition-colors hover:text-obsidian hover:decoration-obsidian"
            >
              {ej}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void correr(dominio);
        }}
        className="mt-6"
      >
        <div className="flex flex-col border-y border-obsidian bg-white sm:flex-row sm:items-stretch">
          <div className="flex flex-1 items-center px-4 py-3">
            <span className="select-none font-mono text-[14px] text-graphite">https://</span>
            <input
              type="text"
              required
              value={dominio}
              onChange={(e) => setDominio(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              autoCapitalize="none"
              spellCheck={false}
              className="w-full bg-transparent pl-1 font-mono text-[15px] text-obsidian placeholder:text-graphite focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="h-12 shrink-0 bg-obsidian px-6 font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:h-auto"
          >
            {cargando ? t.btnRunning : t.btnRun}
          </button>
        </div>
      </form>

      <div aria-live="polite">
        {error && <p className="mt-4 border-l-2 border-obsidian pl-3 font-mono text-[13px] text-obsidian">× {error}</p>}
      </div>

      {res && (
        <div className="mt-8 border-t border-hair pt-6 tabular-nums">
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <p className="text-[44px] font-semibold leading-none tracking-[-0.04em] text-obsidian">{res.letra}</p>
              <p className="text-[28px] font-medium leading-none tracking-[-0.04em] text-obsidian">
                {res.puntaje}
                <span className="text-[16px] text-stone">/100</span>
              </p>
              <div>
                <p className="font-mono text-[14px] font-medium text-obsidian">{res.dominio}</p>
                <p className="mono-label mt-0.5 text-stone">
                  {res.conteos.ok} {t.okLabel} · {res.conteos.aviso} {t.warnLabel} · {res.conteos.brecha} {t.failLabel} · {res.fecha}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={descargarMd} className="btn-ghost !h-8 text-[13px]">
                {t.downloadBtn}
              </button>
              <button type="button" onClick={copiarMd} className="btn-ghost !h-8 text-[13px]">
                {copiado ? t.copiedBtn : t.copyBtn}
              </button>
            </div>
          </div>

          <ul className="divide-y divide-hair border-y border-hair">
            {res.controles.map((c) => (
              <li key={c.id} className="grid gap-2 py-4 sm:grid-cols-[10ch_12ch_minmax(0,1fr)_12ch] sm:items-baseline sm:gap-6">
                <span
                  className={`mono-label inline-block w-fit text-[11.5px] ${
                    c.estado === 'ok' ? 'text-[#297a3a]' : c.estado === 'aviso' ? 'text-charcoal' : 'font-semibold text-obsidian'
                  }`}
                >
                  {c.estado === 'ok' ? '✓ ' : c.estado === 'aviso' ? '! ' : '× '}
                  {t.badge[c.estado]}
                </span>
                <span className="mono-label text-graphite">
                  {c.puntos}/{c.max}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-medium leading-[1.35] text-obsidian">{c.control}</p>
                  <p className="mt-0.5 break-words font-mono text-[12.5px] text-charcoal">{c.detalle}</p>
                  {c.estado !== 'ok' && <p className="mt-1 text-[13.5px] leading-[1.45] text-stone">→ {c.recomendacion}</p>}
                </div>
                <span className="mono-label text-stone sm:text-right">
                  {c.base}% {t.baseLabel}
                </span>
              </li>
            ))}
          </ul>

          {res.crudas.length > 0 && (
            <details className="border-b border-hair py-4">
              <summary className="mono-label cursor-pointer text-graphite">{t.rawLabel} ({res.crudas.length})</summary>
              <dl className="mt-3 space-y-1.5 font-mono text-[12px] leading-[1.5] text-charcoal">
                {res.crudas.map((h) => (
                  <div key={h.nombre} className="break-all">
                    <dt className="inline text-obsidian">{h.nombre}:</dt> <dd className="inline">{h.valor}</dd>
                  </div>
                ))}
              </dl>
            </details>
          )}

          <div className="mt-6 flex flex-col justify-between gap-6 border-b border-hair pb-6 lg:flex-row lg:items-center">
            <div className="max-w-[62ch]">
              <p className="text-[17px] font-medium tracking-[-0.02em] text-obsidian">{t.ctaTitle}</p>
              <p className="mt-1 text-[14.5px] leading-[1.5] text-charcoal">{t.ctaSub}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <a href={mailto} className="btn-fill">
                {t.ctaBook}
              </a>
              <a href={en ? '/en/security' : '/seguridad'} className="btn-ghost">
                {t.ctaMore}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
