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
    eyebrow: 'Diagnóstico pasivo de arquitectura · 0 tokens · En vivo',
    title: 'Evalúa tu dominio ahora y obtén el entregable técnico',
    sub: 'Inspección pasiva en segundos de TLS/HSTS, cabeceras HTTP, políticas CSP/CORS, autenticación DNS (SPF, DMARC, CAA), exposición de archivos sensibles y gobernanza de agentes (security.txt y llms.txt). Sin tráfico intrusivo.',
    placeholder: 'tuempresa.com',
    authLabel: 'Confirmo que soy propietario o cuento con autorización para consultar la postura pública de este dominio.',
    btnRun: 'Analizar arquitectura →',
    btnRunning: 'Inspeccionando DNS y cabeceras…',
    scoreLabel: 'Postura de superficie pública',
    okLabel: 'en orden',
    warnLabel: 'avisos',
    failLabel: 'brechas',
    downloadBtn: 'Descargar entregable (.md)',
    copyBtn: 'Copiar reporte en texto',
    copiedBtn: 'Copiado ✓',
    ctaDeepTitle: '¿Corres agentes de IA o infraestructura en AWS / Cloudflare?',
    ctaDeepSub:
      'El diagnóstico público solo ve la fachada. Para auditar permisos IAM, manejo de secretos, repositorios de código y baterías de prompt injection en tus agentes bajo contrato y alcance firmado:',
    ctaBook: 'Agendar revisión de arquitectura con Omona →',
    ctaScope: 'Ver alcance de auditoría defensiva',
    badge: { ok: 'OK', aviso: 'AVISO', brecha: 'BRECHA' },
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
    <div id="diagnostico" className="ring-card bg-white p-5 sm:p-7">
      <p className="mono-label text-graphite">{t.eyebrow}</p>
      <h2 className="mt-2 text-[22px] font-medium leading-[1.2] tracking-[-0.03em] text-obsidian sm:text-[26px]">{t.title}</h2>
      <p className="mt-2 max-w-[64ch] text-[15px] leading-[1.5] text-charcoal">{t.sub}</p>

      <form onSubmit={ejecutar} className="mt-5 space-y-3">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <input
            type="text"
            required
            value={dominio}
            onChange={(e) => setDominio(e.target.value)}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
            className="h-11 flex-1 rounded-[6px] border border-hair bg-[#fafafa] px-3.5 font-mono text-[14px] text-obsidian placeholder:text-graphite focus:border-obsidian focus:outline-none"
          />
          <button type="submit" disabled={cargando} className="btn-fill !h-11 shrink-0 px-5 text-[14px] disabled:opacity-50">
            {cargando ? t.btnRunning : t.btnRun}
          </button>
        </div>
        <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.45] text-stone">
          <input
            type="checkbox"
            checked={autorizado}
            onChange={(e) => setAutorizado(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-hair accent-obsidian"
          />
          <span>{t.authLabel}</span>
        </label>
      </form>

      {error && <p className="mt-4 rounded-[6px] border border-hair bg-[#fafafa] px-3.5 py-2.5 font-mono text-[13px] text-obsidian">× {error}</p>}

      {res && (
        <div className="mt-6 border-t border-hair pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="mono-label text-graphite">
                {res.dominio} · {res.fecha}
              </p>
              <p className="mt-1 text-[28px] font-medium leading-none tracking-[-0.04em] text-obsidian">
                {res.puntaje}
                <span className="text-[16px] text-stone">/100</span>{' '}
                <span className="mono-label ml-2 text-charcoal">
                  {res.conteos.ok} {t.okLabel} · {res.conteos.aviso} {t.warnLabel} · {res.conteos.brecha} {t.failLabel}
                </span>
              </p>
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

          <ul className="mt-5 divide-y divide-hair border-y border-hair">
            {res.controles.map((c) => (
              <li key={c.id} className="grid gap-2 py-3.5 sm:grid-cols-[9ch_18ch_minmax(0,1fr)] sm:items-baseline sm:gap-4">
                <span
                  className={`mono-label inline-block w-fit rounded px-1.5 py-0.5 text-[11px] ${
                    c.estado === 'ok'
                      ? 'bg-[#ebfbee] text-[#297a3a]'
                      : c.estado === 'aviso'
                        ? 'bg-[#f4f4f5] text-charcoal'
                        : 'bg-obsidian text-white'
                  }`}
                >
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

          <div className="mt-6 rounded-[6px] border border-hair bg-[#fafafa] p-4 sm:p-5">
            <p className="text-[16px] font-medium tracking-[-0.02em] text-obsidian">{t.ctaDeepTitle}</p>
            <p className="mt-1.5 max-w-[64ch] text-[14px] leading-[1.5] text-charcoal">{t.ctaDeepSub}</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
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
    </div>
  );
}
