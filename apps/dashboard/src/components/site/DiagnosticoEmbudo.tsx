'use client';

import { useState } from 'react';

type Control = {
  id: string;
  categoria: string;
  control: string;
  estado: 'ok' | 'aviso' | 'brecha';
  detalle: string;
  recomendacion: string;
  base: number;
};

type Resultado = {
  dominio: string;
  fecha: string;
  url: string;
  puntaje: number;
  conteos: { ok: number; aviso: number; brecha: number };
  controles: Control[];
  markdown: string;
};

const COPY = {
  es: {
    title: '¿Tu sitio contesta en el primer minuto y en el idioma de tu cliente?',
    sub: 'Escribe el dominio de tu negocio. En 2 segundos leemos tu portada pública —sin enviar formularios ni abrir chats— y te decimos si un cliente puede escribirte por texto al instante, llamarte con un toque, apartar cita y leerte en español y en inglés.',
    placeholder: 'tunegocio.com',
    authLabel: 'Confirmo que el sitio es de mi negocio o que tengo permiso para revisarlo.',
    btnRun: 'Revisar mi sitio →',
    btnRunning: 'Leyendo la portada…',
    okLabel: 'en orden',
    warnLabel: 'avisos',
    failLabel: 'brechas',
    baseLabel: 'de 593 negocios hispanos',
    downloadBtn: 'Descargar entregable (.md)',
    copyBtn: 'Copiar reporte',
    copiedBtn: 'Copiado ✓',
    ctaTitle: '¿Quieres que tu negocio conteste en menos de 60 segundos, en los dos idiomas?',
    ctaSub: 'Diseñamos el proceso y los agentes bilingües de IA que lo ejecutan en WhatsApp, SMS, web y CRM: solo cotizan precios de tu lista y pasan a tu vendedor con un resumen del caso.',
    ctaBook: 'Agendar revisión comercial →',
    ctaMore: 'Ver cómo funciona',
    badge: { ok: 'OK', aviso: 'AVISO', brecha: 'BRECHA' },
    err: 'Error de red al revisar el sitio.',
  },
  en: {
    title: 'Does your website answer in the first minute, in your customer’s language?',
    sub: 'Enter your business domain. In 2 seconds we read your public homepage —no forms submitted, no chats opened— and tell you whether a customer can text you instantly, call with one tap, book a visit, and read you in Spanish and English.',
    placeholder: 'yourbusiness.com',
    authLabel: 'I confirm this is my business website or I am authorized to review it.',
    btnRun: 'Check my website →',
    btnRunning: 'Reading the homepage…',
    okLabel: 'passing',
    warnLabel: 'warnings',
    failLabel: 'gaps',
    baseLabel: 'of 593 Hispanic businesses',
    downloadBtn: 'Download deliverable (.md)',
    copyBtn: 'Copy report',
    copiedBtn: 'Copied ✓',
    ctaTitle: 'Want your business to answer in under 60 seconds, in both languages?',
    ctaSub: 'We design the process and the bilingual AI agents that run it on WhatsApp, SMS, web and CRM: they only quote prices from your approved list and hand off to your rep with a case summary.',
    ctaBook: 'Book a commercial review →',
    ctaMore: 'See how it works',
    badge: { ok: 'PASS', aviso: 'WARN', brecha: 'GAP' },
    err: 'Network error while checking the website.',
  },
};

export function DiagnosticoEmbudo({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const t = COPY[lang];
  const en = lang === 'en';
  const [dominio, setDominio] = useState('');
  const [autorizado, setAutorizado] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [res, setRes] = useState<Resultado | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function correr(d: string, auth: boolean) {
    setError(null);
    setCargando(true);
    try {
      const r = await fetch('/api/embudo', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ dominio: d, autorizado: auth, lang }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) setError(j.error || t.err);
      else setRes(j);
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
    a.download = `${en ? 'speed-to-lead' : 'embudo-bilingue'}-omona-${res.dominio}-${res.fecha}.md`;
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
        ? `Bilingual commercial review — ${res.dominio} (${res.puntaje}/100)`
        : `Revisión comercial bilingüe — ${res.dominio} (${res.puntaje}/100)`
      : en
        ? 'Bilingual commercial review — Omona'
        : 'Revisión comercial bilingüe — Omona',
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
                setAutorizado(true);
                void correr(ej, true);
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
          void correr(dominio, autorizado);
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
        <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.45] text-stone">
          <input type="checkbox" checked={autorizado} onChange={(e) => setAutorizado(e.target.checked)} className="mt-0.5 h-4 w-4 accent-obsidian" />
          <span>{t.authLabel}</span>
        </label>
      </form>

      <div aria-live="polite">
        {error && <p className="mt-4 border-l-2 border-obsidian pl-3 font-mono text-[13px] text-obsidian">× {error}</p>}
      </div>

      {res && (
        <div className="mt-8 border-t border-hair pt-6 tabular-nums">
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <p className="text-[36px] font-medium leading-none tracking-[-0.04em] text-obsidian">
                {res.puntaje}
                <span className="text-[18px] text-stone">/100</span>
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
              <li key={c.id} className="grid gap-2 py-4 sm:grid-cols-[10ch_16ch_minmax(0,1fr)_14ch] sm:items-baseline sm:gap-6">
                <span
                  className={`mono-label inline-block w-fit text-[11.5px] ${
                    c.estado === 'ok' ? 'text-[#297a3a]' : c.estado === 'aviso' ? 'text-charcoal' : 'font-semibold text-obsidian'
                  }`}
                >
                  {c.estado === 'ok' ? '✓ ' : c.estado === 'aviso' ? '! ' : '× '}
                  {t.badge[c.estado]}
                </span>
                <span className="mono-label text-graphite">{c.categoria}</span>
                <div className="min-w-0">
                  <p className="text-[15px] font-medium leading-[1.35] text-obsidian">{c.control}</p>
                  <p className="mt-0.5 font-mono text-[12.5px] text-charcoal">{c.detalle}</p>
                  {c.estado !== 'ok' && <p className="mt-1 text-[13.5px] leading-[1.45] text-stone">→ {c.recomendacion}</p>}
                </div>
                <span className="mono-label text-stone sm:text-right">
                  {c.base}% {t.baseLabel}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col justify-between gap-6 border-b border-hair pb-6 lg:flex-row lg:items-center">
            <div className="max-w-[62ch]">
              <p className="text-[17px] font-medium tracking-[-0.02em] text-obsidian">{t.ctaTitle}</p>
              <p className="mt-1 text-[14.5px] leading-[1.5] text-charcoal">{t.ctaSub}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <a href={mailto} className="btn-fill">
                {t.ctaBook}
              </a>
              <a href={en ? '/en/commercial-ai' : '/comercial-ia'} className="btn-ghost">
                {t.ctaMore}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
