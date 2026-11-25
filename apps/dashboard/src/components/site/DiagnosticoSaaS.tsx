'use client';

import { useState } from 'react';

type Control = {
  id: string;
  categoria: string;
  control: string;
  estado: 'ok' | 'aviso' | 'brecha';
  detalle: string;
  recomendacion: string;
};

type Resultado = {
  dominio: string;
  fecha: string;
  puntaje: number;
  conteos: { ok: number; aviso: number; brecha: number };
  controles: Control[];
  markdown: string;
};

const COPY = {
  es: {
    title: '¿Qué tan seguros están hoy tu página web y el correo de tu empresa?',
    sub: 'Escribe el dominio de tu negocio (ej. tuempresa.com). En 2 segundos revisamos 9 candados básicos —sin tocar ni alterar tus sistemas— para saber si pueden falsificar tu correo empresarial, si tu web protege los datos de tus clientes y si hay archivos internos expuestos.',
    placeholder: 'tuempresa.com',
    quickLabel: 'Probar ejemplo:',
    authLabel: 'Confirmo que soy propietario o tengo permiso para revisar la seguridad pública de este dominio.',
    btnRun: 'Revisar mi dominio →',
    btnRunning: 'Revisando correo y página web…',
    scoreLabel: 'Calificación',
    okLabel: 'en orden',
    warnLabel: 'avisos',
    failLabel: 'brechas',
    downloadBtn: 'Descargar entregable (.md)',
    copyBtn: 'Copiar reporte para sistemas',
    copiedBtn: 'Copiado ✓',
    ctaDeepTitle: '¿Quieres corregir estas brechas o blindar los accesos, nube e IA de tu empresa?',
    ctaDeepSub:
      'Este diagnóstico revisa tu fachada pública. Si quieres asegurar tu correo empresarial, ordenar los accesos de tu equipo o implementar inteligencia artificial y bots de WhatsApp sin filtrar datos de clientes:',
    ctaBook: 'Agendar llamada con Omona →',
    ctaScope: 'Ver etapas de ciberseguridad',
    badge: { ok: 'OK', aviso: 'AVISO', brecha: 'RIESGO' },
  },
  en: {
    eyebrow: 'Passive architecture diagnostic · 0 tokens · Live',
    title: 'Inspect your domain now and get the technical deliverable',
    sub: 'Passive inspection in seconds covering TLS/HSTS, HTTP security headers, CSP/CORS policies, DNS authentication (SPF, DMARC, CAA), sensitive file exposure, and AI governance (security.txt & llms.txt). Zero intrusive traffic.',
    placeholder: 'yourcompany.com',
    authLabel: 'I confirm I own or am authorized to inspect the public posture of this domain.',
    btnRun: 'Analyze architecture →',
    btnRunning: 'Inspecting DNS & headers…',
    scoreLabel: 'Public surface posture',
    okLabel: 'passing',
    warnLabel: 'warnings',
    failLabel: 'gaps',
    downloadBtn: 'Download deliverable (.md)',
    copyBtn: 'Copy plain-text report',
    copiedBtn: 'Copied ✓',
    ctaDeepTitle: 'Running AI agents or cloud workloads on AWS / Cloudflare?',
    ctaDeepSub:
      'Public posture only covers the perimeter. To audit IAM least privilege, secrets management, private repositories, and prompt-injection resilience under a signed scope:',
    ctaBook: 'Schedule an architecture review with Omona →',
    ctaScope: 'See defensive audit scope',
    badge: { ok: 'PASS', aviso: 'WARN', brecha: 'GAP' },
  },
};

export function DiagnosticoSaaS({ lang = 'es', showScopeLink = true }: { lang?: 'es' | 'en'; showScopeLink?: boolean }) {
  const t = COPY[lang];
  const [dominio, setDominio] = useState('');
  const [autorizado, setAutorizado] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [res, setRes] = useState<Resultado | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function ejecutar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const r = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ dominio, autorizado, lang }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        setError(j.error || 'No se pudo completar el diagnóstico.');
      } else {
        setRes(j);
      }
    } catch {
      setError(lang === 'en' ? 'Network error while running diagnostic.' : 'Error de red al ejecutar el diagnóstico.');
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
    a.download = `diagnostico-omona-${res.dominio}-${res.fecha}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copiarMd() {
    if (!res) return;
    await navigator.clipboard.writeText(res.markdown);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const mailtoHref = res
    ? `mailto:victor@omona.tech?subject=${encodeURIComponent(
        lang === 'en'
          ? `Security & AI Agent Architecture Review — ${res.dominio} (${res.puntaje}/100)`
          : `Revisión de Arquitectura y Agentes IA — ${res.dominio} (${res.puntaje}/100)`,
      )}&body=${encodeURIComponent(
        lang === 'en'
          ? `Hello Omona team,\n\nWe ran the passive posture check on ${res.dominio} (score: ${res.puntaje}/100, ${res.conteos.brecha} gaps, ${res.conteos.aviso} warnings) and would like to schedule a call to scope a deep-dive security review (cloud IAM / AWS Bedrock / code / AI agents).\n\nCompany:\nRole:\nPreferred time:`
          : `Hola equipo de Omona,\n\nCorrimos el diagnóstico pasivo en ${res.dominio} (puntaje: ${res.puntaje}/100, ${res.conteos.brecha} brechas, ${res.conteos.aviso} avisos) y queremos agendar una llamada para cotizar una auditoría profunda bajo alcance firmado (nube IAM / AWS Bedrock / código / agentes de IA).\n\nEmpresa:\nCargo:\nHorario preferido:`,
      )}`
    : `mailto:victor@omona.tech?subject=${encodeURIComponent(
        lang === 'en' ? 'Schedule an AI Agent & Cloud Security Review' : 'Agendar Revisión de Seguridad para Agentes IA y Nube',
      )}`;

  return (
    <section id="diagnostico" aria-labelledby="diagnostico-heading" className="border-t border-obsidian pt-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 id="diagnostico-heading" className="text-[22px] font-medium leading-[1.2] tracking-[-0.03em] text-obsidian sm:text-[26px]">
            {t.title}
          </h2>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.5] text-charcoal">{t.sub}</p>
        </div>
        <div className="mono-label flex items-center gap-2 text-stone">
          <span>{lang === 'en' ? 'Try example:' : 'Probar ejemplo:'}</span>
          {['omona.tech', 'superleads.mx'].map((ej) => (
            <button
              key={ej}
              type="button"
              onClick={async () => {
                setDominio(ej);
                setAutorizado(true);
                setError(null);
                setCargando(true);
                try {
                  const r = await fetch('/api/diagnostico', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ dominio: ej, autorizado: true, lang }),
                  });
                  const j = await r.json();
                  if (r.ok && j.ok) setRes(j);
                } finally {
                  setCargando(false);
                }
              }}
              className="underline decoration-hair underline-offset-4 transition-colors hover:text-obsidian hover:decoration-obsidian"
            >
              {ej}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={ejecutar} className="mt-6">
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
          <input
            type="checkbox"
            checked={autorizado}
            onChange={(e) => setAutorizado(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-obsidian"
          />
          <span>{t.authLabel}</span>
        </label>
      </form>

      {error && <p className="mt-4 border-l-2 border-obsidian pl-3 font-mono text-[13px] text-obsidian">× {error}</p>}

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
              <li key={c.id} className="grid gap-2 py-4 sm:grid-cols-[10ch_18ch_minmax(0,1fr)] sm:items-baseline sm:gap-6">
                <span
                  className={`mono-label inline-block w-fit text-[11.5px] ${
                    c.estado === 'ok'
                      ? 'text-[#297a3a]'
                      : c.estado === 'aviso'
                        ? 'text-charcoal'
                        : 'font-semibold text-obsidian'
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
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col justify-between gap-6 border-b border-hair pb-6 lg:flex-row lg:items-center">
            <div className="max-w-[62ch]">
              <p className="text-[17px] font-medium tracking-[-0.02em] text-obsidian">{t.ctaDeepTitle}</p>
              <p className="mt-1 text-[14.5px] leading-[1.5] text-charcoal">{t.ctaDeepSub}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <a href={mailtoHref} className="btn-fill">
                {t.ctaBook}
              </a>
              {showScopeLink && (
                <a href={lang === 'en' ? '/en/security#servicios' : '/seguridad#servicios'} className="btn-ghost">
                  {t.ctaScope}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
