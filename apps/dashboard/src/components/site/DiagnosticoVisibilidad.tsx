'use client';

import { useState } from 'react';
import { CONTROLES_VISIBILIDAD, type BaseVisibilidad, type IdControl } from '@/lib/visibilidad';

type Control = { id: IdControl; pasa: boolean; peso: number; hallazgo: string; arreglo: string };
type Lector = { bot: string; de: string; permitido: boolean; grupo: 'propio' | '*' | null };

type Resultado = {
  dominio: string;
  fecha: string;
  urlFinal: string;
  puntaje: number;
  controles: Control[];
  rastreadores: Lector[];
  vista: { title: string | null; description: string | null; url: string };
  base: BaseVisibilidad | null;
  markdown: string;
};

const COPY = {
  es: {
    title: '¿Google y los asistentes de IA pueden leer tu sitio?',
    sub: 'Escribe el dominio de tu negocio. Leemos tu portada, robots.txt, llms.txt y, si hace falta, sitemap.xml —4 lecturas como máximo, sin formularios ni rutas ocultas— y te decimos qué arreglar.',
    placeholder: 'tunegocio.com',
    btnRun: 'Revisar mi sitio →',
    btnRunning: 'Leyendo el sitio…',
    de: 'de',
    controlesPasan: 'controles pasan',
    downloadBtn: 'Descargar entregable (.md)',
    copyBtn: 'Copiar reporte',
    copiedBtn: 'Copiado ✓',
    googleH: 'Así te ves en Google',
    googleNota: 'Vista aproximada con lo que trae tu HTML; Google puede reescribir título y descripción.',
    sinTitulo: '(sin título)',
    sinDesc: '(sin meta description)',
    tituloLbl: 'Título',
    descLbl: 'Descripción',
    chars: 'caracteres',
    sobran: (n: number) => `sobran ${n}`,
    faltan: (n: number) => `faltan ${n}`,
    enRango: 'en rango',
    falta: 'falta',
    lectoresH: 'Quién te puede leer',
    lectoresSub: 'Según tu robots.txt, para la raíz «/» de tu sitio.',
    cols: ['Rastreador', 'De', 'Estado'],
    permitido: 'Permitido',
    bloqueado: 'Bloqueado',
    grupo: { propio: 'grupo propio', '*': 'grupo *', ninguno: 'sin grupo' },
    controlesH: 'Los 10 controles',
    pasa: 'PASA',
    noPasa: 'NO PASA',
    pts: 'pts',
    base: (p: number, n: number) => `${p} % de ${n} negocios hispanos medidos lo cumple`,
    ctaTitle: '¿Quieres que tu negocio aparezca cuando alguien pregunta en Google o en un asistente de IA?',
    ctaSub: 'Posicionamiento SEO + GEO es un producto con agente. Escríbenos con tu resultado.',
    ctaBook: 'Escribir a victor@omona.tech →',
    ctaMore: 'Ver el producto',
    err: 'Error de red al revisar el sitio.',
  },
  en: {
    title: 'Can Google and AI assistants read your website?',
    sub: 'Enter your business domain. We read your homepage, robots.txt, llms.txt and, if needed, sitemap.xml —4 requests at most, no forms, no hidden paths— and tell you what to fix.',
    placeholder: 'yourbusiness.com',
    btnRun: 'Check my website →',
    btnRunning: 'Reading the site…',
    de: 'of',
    controlesPasan: 'checks pass',
    downloadBtn: 'Download deliverable (.md)',
    copyBtn: 'Copy report',
    copiedBtn: 'Copied ✓',
    googleH: 'How you look on Google',
    googleNota: 'Approximate preview from your HTML; Google may rewrite the title and description.',
    sinTitulo: '(no title)',
    sinDesc: '(no meta description)',
    tituloLbl: 'Title',
    descLbl: 'Description',
    chars: 'characters',
    sobran: (n: number) => `${n} too many`,
    faltan: (n: number) => `${n} short`,
    enRango: 'in range',
    falta: 'missing',
    lectoresH: 'Who can read you',
    lectoresSub: 'Based on your robots.txt, for the root "/" of your site.',
    cols: ['Crawler', 'Owner', 'Status'],
    permitido: 'Allowed',
    bloqueado: 'Blocked',
    grupo: { propio: 'own group', '*': '* group', ninguno: 'no group' },
    controlesH: 'The 10 checks',
    pasa: 'PASS',
    noPasa: 'FAIL',
    pts: 'pts',
    base: (p: number, n: number) => `${p}% of ${n} Hispanic-owned businesses measured pass this`,
    ctaTitle: 'Want your business to show up when people ask Google or an AI assistant?',
    ctaSub: 'SEO + GEO visibility is a product run with an agent. Email us your result.',
    ctaBook: 'Email victor@omona.tech →',
    ctaMore: 'See the product (Spanish)',
    err: 'Network error while checking the website.',
  },
};

const cortar = (s: string, n: number) => (Array.from(s).length > n ? `${Array.from(s).slice(0, n).join('').trimEnd()}…` : s);
const largo = (s: string | null) => (s ? Array.from(s).length : 0);

function migas(url: string): string {
  try {
    const u = new URL(url);
    const partes = u.pathname.split('/').filter(Boolean);
    return [u.hostname, ...partes].join(' › ');
  } catch {
    return url;
  }
}

export function DiagnosticoVisibilidad({ lang = 'es' }: { lang?: 'es' | 'en' }) {
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
      const r = await fetch('/api/visibilidad', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ dominio: d, lang }),
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
    a.download = `${en ? 'ai-visibility' : 'visibilidad-ia'}-omona-${res.dominio}-${res.fecha}.md`;
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
        ? `SEO + GEO visibility — ${res.dominio} (${res.puntaje}/100)`
        : `Visibilidad SEO + GEO — ${res.dominio} (${res.puntaje}/100)`
      : en
        ? 'SEO + GEO visibility — Omona'
        : 'Visibilidad SEO + GEO — Omona',
  )}`;

  /** «72 caracteres · sobran 12» según el rango del control. */
  function medida(s: string | null, min: number, max: number) {
    const n = largo(s);
    if (!n) return t.falta;
    const estado = n > max ? t.sobran(n - max) : n < min ? t.faltan(min - n) : t.enRango;
    return `${n} ${t.chars} · ${estado} (${min}–${max})`;
  }

  const nombre = (id: IdControl) => CONTROLES_VISIBILIDAD.find((c) => c.id === id)?.nombre[lang] ?? id;
  const pasan = res ? res.controles.filter((c) => c.pasa).length : 0;

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
          <button
            type="button"
            onClick={() => {
              setDominio('omona.tech');
              void correr('omona.tech');
            }}
            className="underline decoration-hair underline-offset-4 transition-colors hover:text-obsidian hover:decoration-obsidian"
          >
            omona.tech
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void correr(dominio);
        }}
        className="mt-6"
      >
        <div className="flex flex-col border-y border-obsidian bg-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-obsidian sm:flex-row sm:items-stretch">
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
          {/* 1. Puntaje */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <p className="text-[36px] font-medium leading-none tracking-[-0.04em] text-obsidian">
                {res.puntaje}
                <span className="text-[18px] text-stone">/100</span>
              </p>
              <div>
                <p className="font-mono text-[14px] font-medium text-obsidian">{res.dominio}</p>
                <p className="mono-label mt-0.5 text-stone">
                  {pasan} {t.de} {res.controles.length} {t.controlesPasan} · {res.fecha}
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

          {/* 2. Así te ves en Google */}
          <div className="border-t border-hair pt-6">
            <h3 className="mono-label text-graphite">{t.googleH}</h3>
            <div className="mt-3 max-w-[640px] border-y border-hair bg-white px-4 py-4">
              <p className="truncate font-mono text-[12.5px] text-stone">{migas(res.vista.url)}</p>
              <p className="mt-1 text-[19px] leading-[1.3] tracking-[-0.015em] text-obsidian">
                {res.vista.title ? cortar(res.vista.title, 60) : <span className="text-smoke">{t.sinTitulo}</span>}
              </p>
              <p className="mt-1 text-[14px] leading-[1.5] text-charcoal">
                {res.vista.description ? cortar(res.vista.description, 155) : <span className="text-smoke">{t.sinDesc}</span>}
              </p>
            </div>
            <dl className="mono-label mt-3 grid gap-x-6 gap-y-1 text-stone sm:grid-cols-[max-content_minmax(0,1fr)]">
              <dt className="text-graphite">{t.tituloLbl}</dt>
              <dd>{medida(res.vista.title, 15, 60)}</dd>
              <dt className="text-graphite">{t.descLbl}</dt>
              <dd>{medida(res.vista.description, 70, 160)}</dd>
            </dl>
            <p className="mt-2 text-[13px] leading-[1.5] text-stone">{t.googleNota}</p>
          </div>

          {/* 3. Quién te puede leer */}
          <div className="mt-8">
            <h3 className="mono-label text-graphite">{t.lectoresH}</h3>
            <p className="mt-1 text-[13px] leading-[1.5] text-stone">{t.lectoresSub}</p>
            <div className="mt-3 overflow-x-auto border-y border-hair">
              <table className="w-full min-w-[480px] border-collapse text-left text-[14px]">
                <thead>
                  <tr className="border-b border-hair text-graphite">
                    <th className="py-2.5 pr-6 font-mono text-[12px] font-normal uppercase tracking-[0.06em]">{t.cols[0]}</th>
                    <th className="py-2.5 pr-6 font-mono text-[12px] font-normal uppercase tracking-[0.06em]">{t.cols[1]}</th>
                    <th className="py-2.5 text-right font-mono text-[12px] font-normal uppercase tracking-[0.06em]">{t.cols[2]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hair">
                  {res.rastreadores.map((r) => (
                    <tr key={r.bot}>
                      <td className="py-2.5 pr-6 align-baseline">
                        <span className="font-mono text-[13px] text-obsidian">{r.bot}</span>
                        <span className="mono-label ml-2 text-smoke">{t.grupo[r.grupo ?? 'ninguno']}</span>
                      </td>
                      <td className="py-2.5 pr-6 align-baseline text-charcoal">{r.de}</td>
                      <td className={`mono-label py-2.5 text-right align-baseline ${r.permitido ? 'text-[#297a3a]' : 'font-semibold text-obsidian'}`}>
                        {r.permitido ? `✓ ${t.permitido}` : `× ${t.bloqueado}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Los 10 controles */}
          <div className="mt-8">
            <h3 className="mono-label text-graphite">{t.controlesH}</h3>
            <ul className="mt-3 divide-y divide-hair border-y border-hair">
              {res.controles.map((c) => (
                <li key={c.id} className="grid gap-2 py-4 sm:grid-cols-[11ch_minmax(0,1fr)_8ch] sm:items-baseline sm:gap-6">
                  <span className={`mono-label inline-block w-fit text-[11.5px] ${c.pasa ? 'text-[#297a3a]' : 'font-semibold text-obsidian'}`}>
                    {c.pasa ? `✓ ${t.pasa}` : `× ${t.noPasa}`}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium leading-[1.35] text-obsidian">{nombre(c.id)}</p>
                    <p className="mt-0.5 break-words font-mono text-[12.5px] text-charcoal">{c.hallazgo}</p>
                    <p className="mt-1 text-[13.5px] leading-[1.45] text-stone">→ {c.arreglo}</p>
                    {res.base && <p className="mono-label mt-1.5 text-smoke">{t.base(res.base.pasa[c.id], res.base.n)}</p>}
                  </div>
                  <span className="mono-label text-stone sm:text-right">
                    {c.pasa ? c.peso : 0}/{c.peso} {t.pts}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 6. CTA */}
          <div className="mt-6 flex flex-col justify-between gap-6 border-b border-hair pb-6 lg:flex-row lg:items-center">
            <div className="max-w-[62ch]">
              <p className="text-[17px] font-medium tracking-[-0.02em] text-obsidian">{t.ctaTitle}</p>
              <p className="mt-1 text-[14.5px] leading-[1.5] text-charcoal">{t.ctaSub}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <a href={mailto} className="btn-fill">
                {t.ctaBook}
              </a>
              <a href="/#posicionamiento" className="btn-ghost">
                {t.ctaMore}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
