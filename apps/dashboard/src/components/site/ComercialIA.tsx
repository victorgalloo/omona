/**
 * /comercial-ia y /en/commercial-ai: «Procesos comerciales + IA», el área
 * central de experiencia real de Victor bajo la marca Omona, integrada con la
 * práctica de ciberseguridad defensiva (/seguridad).
 *
 * Reglas (DESIGN_SYSTEM.md + skill omona-tech):
 * - Cero tarjetas (.ring-card grids): franjas arquitectónicas abiertas con
 *   divisores de 1 px (border-y border-hair, divide-y divide-hair, tabular-nums).
 * - Sin publicar denominación social ni RFC: siempre «persona moral formalmente
 *   establecida en México».
 * - Separación estricta con SuperLeads: cero clientes de SuperLeads, cero .edu.mx,
 *   Victor nunca como fundador de SuperLeads (cargo literal: «Experto en procesos
 *   comerciales educativos + IA»). En Omona el alcance comercial es para empresas
 *   B2B y PyMEs en México fuera de educación.
 */
import Link from 'next/link';
import type { Metadata } from 'next';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { Wrap, Eyebrow } from './Home';
import { BASE, ORG, ORG_ID, PERSON } from '@/lib/entidad';
import { CARGO_SL, NOMBRE_LEGAL, REDES } from '@/lib/perfil';
import { CORREO_SEGURIDAD, PERSONA_MORAL_EN, PERSONA_MORAL_ES } from './Seguridad';

type Lang = 'es' | 'en';

const AGENDA_COMERCIAL_ES =
  'mailto:victor@omona.tech?subject=Diagn%C3%B3stico%20de%20proceso%20comercial%20%2B%20IA%20%E2%80%94%20Omona';
const AGENDA_COMERCIAL_EN =
  'mailto:victor@omona.tech?subject=Commercial%20Process%20%2B%20AI%20Architecture%20Review%20%E2%80%94%20Omona';

const T = {
  es: {
    path: '/comercial-ia',
    other: { href: '/en/commercial-ai', label: 'English (US)' },
    eyebrow: 'Área 01 · Agentes Comerciales Bilingües (ES + EN) · EE. UU.',
    h1: 'Primero el proceso comercial; después los agentes bilingües de IA que lo ejecutan.',
    sub: 'Diseñamos y operamos embudos comerciales con agentes de IA bilingües (español + inglés) en WhatsApp, web y CRM para dueños de negocios latinos en Estados Unidos (contratistas, firmas de impuestos y contabilidad, logística, clínicas y empresas B2B): respuesta en menos de 60 segundos, calificación sin inventar precios, traspaso limpio a tu equipo y ciberseguridad integrada.',
    ctaPrimary: 'Agendar diagnóstico comercial →',
    ctaSecondary: 'Guía EE. UU. (ACH, FTC e IA) →',
    ctaSecondaryHref: '/blog/ciberseguridad-negocios-latinos-estados-unidos',
    ctaMail: AGENDA_COMERCIAL_ES,
    dataEyebrow: 'Medición propia en México · 255 sitios empresariales .mx (nov 2026)',
    dataSub: 'Lectura pasiva de portadas públicas vinculadas por cámaras empresariales y portales PyME (sin enviar formularios):',
    metrics: [
      ['77 %', 'sin canal de atención inmediata en portada (197 de 255)'],
      ['20 %', 'enlaza directo a WhatsApp como canal comercial (51 de 255)'],
      ['65 %', 'de esos WhatsApp abre en blanco sin contexto precargado'],
      ['< 1 %', 'permite agendar reunión en línea al instante (1 de 255)'],
    ] as [string, string][],
    stagesH: 'Qué construimos en un sistema comercial con IA',
    stagesSub: 'Cuatro capas donde el criterio comercial y los candados en código mandan sobre el modelo.',
    stages: [
      {
        k: '01',
        h: 'Diseño del embudo, etapas y atribución en CRM',
        p: 'Antes de escribir un prompt definimos qué convierte a un contacto en prospecto calificado, qué información se pide en cada etapa, una sola pregunta por mensaje y cómo se registra el origen real en el CRM.',
      },
      {
        k: '02',
        h: 'Velocidad en WhatsApp con candados deterministas (0 precios inventados)',
        p: 'Atención en menos de 60 segundos separando en código los hechos verificados de lo que requiere cotización humana. Si un precio, descuento o condición no está en la ficha autorizada, el sistema bloquea la invención y escala a un asesor.',
      },
      {
        k: '03',
        h: 'Traspaso a vendedor humano (handoff) y seguimiento disciplinado',
        p: 'La IA filtra, responde dudas frecuentes, confirma citas y reactiva cuentas frías sin quemar tu número. Cuando el cliente pide a una persona o está listo para cerrar, el vendedor recibe un resumen ejecutivo sin hacer repetir al prospecto.',
      },
      {
        k: '04',
        h: 'Operación en jerarquía de agentes + ciberseguridad integrada',
        p: 'Orquestador, gerentes de área, agentes y subagentes sobre AWS Bedrock con métricas de cumplimiento y resultado, acompañados de nuestra revisión defensiva (SPF/DMARC contra cotizaciones falsas, IAM de mínimo privilegio y defensa contra prompt injection).',
      },
    ],
    contrastYesH: 'Lo que SÍ hacemos',
    contrastYes: [
      'Auditoría y rediseño de proceso comercial de punta a punta (captura → calificación → cita → seguimiento → cierre).',
      'Agentes conversacionales en WhatsApp y CRM con candados deterministas en código y pruebas antes de producción.',
      'Confirmación de reuniones, preparación de llamadas para vendedores y reactivación controlada de cartera.',
      'Blindaje defensivo del canal comercial: dominio, correo empresarial, accesos IAM, bóveda de secretos y guardrails de IA.',
    ],
    contrastNoH: 'Lo que NO hacemos',
    contrastNo: [
      'Chatbots sueltos sin etapas de venta ni conexión real con el equipo comercial.',
      'Dejar precios, descuentos o compromisos contractuales a la improvisación de un modelo generativo.',
      'Envíos masivos no solicitados (spam) que bloquean líneas de WhatsApp y dañan la marca.',
      'Proyectos en el sector educativo (colegios o universidades): ese sector lo atiende exclusivamente SuperLeads.',
    ],
    bridgeH: 'Por qué unimos Procesos Comerciales + IA con Ciberseguridad',
    bridgeP:
      'En cuanto conectas un agente de IA a tu WhatsApp comercial, a tu CRM y a tu correo empresarial, abres dos frentes a la vez: ingresos y riesgo operativo. Un sistema bien hecho aumenta la velocidad y conversión comercial sin exponer bases de clientes, llaves de nube ni permitir suplantación de facturas.',
    whoH: 'Dirección comercial y de ingeniería',
    whoSub: 'Experiencia real operando ventas consultivas y sistemas de agentes en producción.',
    creds: [
      ['Procesos comerciales + IA', `En SuperLeads es «${CARGO_SL}» (Account Executive; más de 100 instituciones educativas trabajan con SuperLeads; no es fundador de SuperLeads): vende sistemas comerciales y construye los agentes de IA en jerarquía que apoyan el seguimiento diario.`],
      ['Trayectoria comercial y tech', 'Banca empresarial PyME en BanBajío, tecnología para ventas en Globant (incorporado vía Walmeric, capacitado uno a uno en Google Ads, Meta Ads y LinkedIn Ads) y asesoría financiera en GBM.'],
      ['Formación e ingeniería', 'Contaduría y Finanzas (EBC), AMIB Figura III, CS50 de Harvard, repositorios abiertos de orquestación multiagente en AWS Bedrock (bedrock-agent-hierarchy) y contribuciones a Hermes Agent y Strands Agents.'],
      ['Entidad y alcance en Omona', `Omona atiende de forma remota y bilingüe a negocios hispanos en Estados Unidos y empresas en México; es operada por ${PERSONA_MORAL_ES} (León, Guanajuato) bajo la dirección de ${NOMBRE_LEGAL}, enfocada exclusivamente fuera del sector educativo.`],
    ] as [string, string][],
  },
  en: {
    path: '/en/commercial-ai',
    other: { href: '/comercial-ia', label: 'Español (EE. UU.)' },
    eyebrow: 'Area 01 · Bilingual Commercial AI (EN + ES) · United States',
    h1: 'Commercial process first; the bilingual AI agents that execute it second.',
    sub: 'We design and operate bilingual (English + Spanish) AI commercial funnels across WhatsApp, SMS, web, and CRM for Hispanic-owned and bilingual businesses in the United States: sub-minute response in whichever language your customer uses, deterministic guardrails with zero hallucinated pricing, clean human handoff, and defensive security built in.',
    ctaPrimary: 'Book commercial review →',
    ctaSecondary: 'Read US Hispanic SMB Guide (ES) →',
    ctaSecondaryHref: '/blog/ciberseguridad-negocios-latinos-estados-unidos',
    ctaMail: AGENDA_COMERCIAL_EN,
    dataEyebrow: 'Original Mexican benchmark · 255 business .mx sites (Nov 2026)',
    dataSub: 'Passive homepage review of non-governmental, non-educational .mx sites linked by Mexican business chambers:',
    metrics: [
      ['77%', 'lack any immediate response channel on their homepage (197 of 255)'],
      ['20%', 'link directly to WhatsApp for sales inquiries (51 of 255)'],
      ['65%', 'of those WhatsApp links open blank with zero prefilled context'],
      ['< 1%', 'offer instant online meeting scheduling on the homepage (1 of 255)'],
    ] as [string, string][],
    stagesH: 'What we build in an AI commercial system',
    stagesSub: 'Four layers where commercial discipline and deterministic code govern the language model.',
    stages: [
      {
        k: '01',
        h: 'Funnel stage design, qualification rules, and CRM attribution',
        p: 'Before writing a single prompt, we define what turns an inquiry into a qualified opportunity, enforce one clear question per turn, and log source attribution cleanly into your CRM.',
      },
      {
        k: '02',
        h: 'Sub-minute WhatsApp speed with code guardrails (0 invented prices)',
        p: 'Fast response backed by deterministic validation in code: verified catalog facts are separated from custom quotes. If a price, discount, or term is not in the authorized source, code blocks fabrication and routes to a rep.',
      },
      {
        k: '03',
        h: 'Context-rich human handoff and disciplined follow-up',
        p: 'AI handles first response, qualification, meeting reminders, and controlled reactivation without burning your WhatsApp line. When a buyer asks for a person or is ready to close, your rep gets an executive brief with full context.',
      },
      {
        k: '04',
        h: 'Manager → agent → subagent hierarchy + integrated cybersecurity',
        p: 'Multi-agent operations on AWS Bedrock with compliance and outcome evaluations, paired with our defensive security practice (SPF/DMARC against fake invoices, least-privilege IAM, and prompt-injection guardrails).',
      },
    ],
    contrastYesH: 'What we DO',
    contrastYes: [
      'End-to-end commercial workflow design (capture → qualification → booking → follow-up → close).',
      'Conversational agents on WhatsApp and CRM with deterministic code guardrails and pre-production evals.',
      'Automated meeting confirmations, pre-call sales briefs, and structured pipeline reactivation.',
      'Defensive hardening of commercial channels: domain/email spoofing protection, IAM, secrets vaults, and AI guardrails.',
    ],
    contrastNoH: 'What we DO NOT do',
    contrastNo: [
      'Standalone chatbots without sales stages, metrics, or CRM integration.',
      'Leaving pricing, discounts, or legal commitments to raw LLM improvisation.',
      'Unsolicited bulk messaging (spam) that gets WhatsApp numbers banned.',
      'Projects in the educational sector (schools or universities): that market is served exclusively by SuperLeads.',
    ],
    bridgeH: 'Why Commercial Processes + AI and Cybersecurity belong together',
    bridgeP:
      'The moment you connect an AI agent to your sales WhatsApp, CRM, and corporate email, you open both a revenue lever and an operational attack surface. Pairing commercial engineering with defensive security lets your team sell faster without leaking customer data or exposing cloud credentials.',
    whoH: 'Commercial & Engineering Lead',
    whoSub: 'Hands-on experience running consultative sales and production multi-agent stacks.',
    creds: [
      ['Commercial processes + AI', `At SuperLeads he is an Account Executive (public title: “${CARGO_SL}”; 100+ educational institutions work with SuperLeads; not a founder of SuperLeads), selling admissions systems and building the multi-agent hierarchy supporting daily commercial follow-up.`],
      ['Sales & tech background', 'SME banking at BanBajío, sales technology at Globant (joined via Walmeric; trained one-on-one in Google Ads, Meta Ads, and LinkedIn Ads), and financial advisory at GBM.'],
      ['Education & open source', 'B.S. in Accounting & Finance (EBC), AMIB Figura III, Harvard CS50, author of open-source Bedrock orchestration templates (bedrock-agent-hierarchy), and contributor to Hermes Agent and Strands Agents.'],
      ['Entity & scope at Omona', `Omona serves Hispanic-owned and bilingual businesses in the United States and cross-border B2B teams in Mexico remotely; it is operated by ${PERSONA_MORAL_EN} (León, Guanajuato, Mexico) led by ${NOMBRE_LEGAL}, strictly outside the education sector.`],
    ] as [string, string][],
  },
} as const;

export function metadataComercialIA(lang: Lang): Metadata {
  const en = lang === 'en';
  const title = en
    ? 'Bilingual AI Sales Agents for US Businesses | Omona'
    : 'Agentes de IA Bilingües para Negocios en EE. UU.';
  const description = en
    ? 'Bilingual Spanish-English AI sales agents on WhatsApp, web & CRM for US Hispanic businesses: fast response, zero invented prices & clean handoff.'
    : 'Embudos comerciales y agentes de IA bilingües (español + inglés) en WhatsApp y CRM para negocios latinos en EE. UU., con candados en código.';
  const url = `${BASE}${en ? '/en/commercial-ai' : '/comercial-ia'}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        'es-US': `${BASE}/comercial-ia`,
        'es-MX': `${BASE}/comercial-ia`,
        'en-US': `${BASE}/en/commercial-ai`,
        en: `${BASE}/en/commercial-ai`,
        'x-default': `${BASE}/comercial-ia`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Omona',
      locale: en ? 'en_US' : 'es_US',
      alternateLocale: en ? ['es_US', 'es_MX'] : ['en_US', 'es_MX'],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export function ComercialIA({ lang = 'es' }: { lang?: Lang }) {
  const t = T[lang];
  const en = lang === 'en';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ORG,
      PERSON,
      {
        '@type': 'WebPage',
        '@id': `${BASE}${t.path}#page`,
        url: `${BASE}${t.path}`,
        name: t.h1,
        description: t.sub,
        inLanguage: en ? 'en-US' : 'es-US',
        isPartOf: { '@id': `${BASE}/#website` },
        about: { '@id': ORG_ID },
      },
    ],
  };

  return (
    <div lang={en ? 'en-US' : 'es-US'} className="md min-h-screen bg-paper text-obsidian">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingNav lang={lang} />
      <main>
        {/* 1. Héroe arquitectónico */}
        <header className="pb-12 pt-14 sm:pb-20 sm:pt-24">
          <Wrap>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <Link href={t.other.href} hrefLang={en ? 'es-US' : 'en-US'} className="mono-label text-stone hover:text-obsidian">
                {t.other.label} →
              </Link>
            </div>
            <h1 className="max-w-[26ch] text-heading-lg text-balance text-obsidian">{t.h1}</h1>
            <p className="mt-6 max-w-[64ch] text-[19px] leading-[1.5] text-charcoal">{t.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={t.ctaMail} className="btn-fill">
                {t.ctaPrimary}
              </a>
              <Link href={t.ctaSecondaryHref} className="btn-ghost">
                {t.ctaSecondary}
              </Link>
              <Link href="/blog/procesos-comerciales-ia-whatsapp-arquitectura" className="btn-ghost">
                {en ? 'Architecture & .mx benchmark →' : 'Arquitectura y estudio base →'}
              </Link>
            </div>

            {/* Franja de datos propios (0 cards: divisores de 1 px) */}
            <div className="mt-14 border-t border-hair pt-6">
              <p className="mono-label text-graphite">{t.dataEyebrow}</p>
              <p className="mt-1.5 text-[14px] leading-[1.5] text-stone">{t.dataSub}</p>
              <dl className="mt-5 grid divide-y divide-hair border-y border-hair tabular-nums sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
                {t.metrics.map(([val, label], idx) => (
                  <div key={val + label} className={`py-5 ${idx > 0 ? 'lg:pl-6' : ''} ${idx < 3 ? 'lg:pr-6' : ''}`}>
                    <dt className="text-[28px] font-medium leading-none tracking-[-0.04em] text-obsidian">{val}</dt>
                    <dd className="mt-2 text-[13.5px] leading-[1.45] text-charcoal">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Wrap>
        </header>

        {/* 2. Cuatro etapas del sistema comercial con IA */}
        <section className="py-12 sm:py-20" aria-labelledby="etapas-comercial">
          <Wrap>
            <h2 id="etapas-comercial" className="text-heading text-obsidian">
              {t.stagesH}
            </h2>
            <p className="mt-2.5 max-w-[58ch] text-[15px] leading-[1.5] text-stone">{t.stagesSub}</p>
            <ol className="mt-8 divide-y divide-hair border-y border-hair">
              {t.stages.map((sItem) => (
                <li key={sItem.k} className="grid gap-3 py-6 md:grid-cols-[5ch_minmax(0,22rem)_minmax(0,1fr)] md:gap-8">
                  <span className="mono-label pt-1 text-[#297a3a]">{sItem.k}</span>
                  <h3 className="text-[18px] font-medium leading-[1.35] tracking-[-0.02em] text-obsidian">{sItem.h}</h3>
                  <p className="text-[15px] leading-[1.55] text-charcoal">{sItem.p}</p>
                </li>
              ))}
            </ol>
          </Wrap>
        </section>

        {/* 3. Alcance claro: Qué SÍ hacemos vs Qué NO hacemos */}
        <section className="py-10 sm:py-16" aria-labelledby="alcance-comercial">
          <Wrap>
            <div className="grid gap-10 border-y border-hair py-10 lg:grid-cols-2 lg:divide-x lg:divide-hair lg:gap-0">
              <div className="lg:pr-10">
                <h2 id="alcance-comercial" className="text-[20px] font-medium tracking-[-0.02em] text-obsidian">
                  {t.contrastYesH}
                </h2>
                <ul className="mt-5 space-y-3">
                  {t.contrastYes.map((line) => (
                    <li key={line} className="flex gap-3 text-[15px] leading-[1.5] text-charcoal">
                      <span aria-hidden className="mono-label pt-0.5 text-[#297a3a]">✓</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-hair pt-8 lg:border-t-0 lg:pl-10 lg:pt-0">
                <h2 className="text-[20px] font-medium tracking-[-0.02em] text-obsidian">{t.contrastNoH}</h2>
                <ul className="mt-5 space-y-3">
                  {t.contrastNo.map((line) => (
                    <li key={line} className="flex gap-3 text-[15px] leading-[1.5] text-charcoal">
                      <span aria-hidden className="mono-label pt-0.5 text-stone">—</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Wrap>
        </section>

        {/* 4. Puente con el Área 02: Ciberseguridad */}
        <section className="py-10 sm:py-16" aria-labelledby="puente-seguridad">
          <Wrap>
            <div className="grid gap-6 border-b border-hair pb-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="max-w-[62ch]">
                <Eyebrow>{en ? 'Area 02 · Connected Practice' : 'Área 02 · Práctica conectada'}</Eyebrow>
                <h2 id="puente-seguridad" className="text-heading text-obsidian">
                  {t.bridgeH}
                </h2>
                <p className="mt-3 text-[15.5px] leading-[1.55] text-charcoal">{t.bridgeP}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={en ? '/en/security' : '/seguridad'} className="btn-ghost">
                  {en ? 'Explore AI & Cloud Security →' : 'Ver Ciberseguridad defensiva →'}
                </Link>
                <Link href={en ? '/en/security#diagnostico' : '/#diagnostico'} className="btn-fill">
                  {en ? 'Run free domain check →' : 'Diagnosticar dominio gratis →'}
                </Link>
              </div>
            </div>
          </Wrap>
        </section>

        {/* 5. Dirección comercial y respaldo */}
        <section className="py-10 sm:py-16" aria-labelledby="responsable-comercial">
          <Wrap>
            <h2 id="responsable-comercial" className="text-heading text-obsidian">
              {t.whoH}
            </h2>
            <p className="mt-2 text-[15px] leading-[1.5] text-stone">{t.whoSub}</p>
            <dl className="mt-8 divide-y divide-hair border-y border-hair">
              {t.creds.map(([k, v]) => (
                <div key={k} className="grid gap-2 py-4 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-8">
                  <dt className="mono-label pt-1 text-graphite">{k}</dt>
                  <dd className="text-[15px] leading-[1.55] text-charcoal">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mono-label mt-6 flex flex-wrap gap-x-5 gap-y-2 text-stone">
              <a href={`mailto:${CORREO_SEGURIDAD}`} className="text-obsidian hover:underline">
                {CORREO_SEGURIDAD}
              </a>
              <a href={REDES.linkedin} rel="me" className="hover:text-obsidian">
                LinkedIn
              </a>
              <a href={REDES.github} rel="me" className="hover:text-obsidian">
                GitHub
              </a>
              <a href={REDES.web} rel="author" className="hover:text-obsidian">
                victorgallo.com
              </a>
            </p>
          </Wrap>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
