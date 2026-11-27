/**
 * /seguridad y /en/security: «Seguridad para agentes de IA», el servicio
 * DEFENSIVO que la empresa ofrece bajo la marca Omona (pedido de Victor,
 * 24-nov-2026, para la solicitud al Cyber Verification Program de Anthropic,
 * nivel Defense). Tiene que cuadrar con ~/.hermes/personal/cvp/borrador-respuestas.md.
 *
 * Reglas (skill omona-tech):
 * - Solo trabajo defensivo. Nada de pentest ofensivo ni red team contra terceros.
 * - Sin clientes, sin cifras de proyectos de SuperLeads, sin años de experiencia
 *   en seguridad ni certificaciones de seguridad: no existen. Estado honesto:
 *   todavía no hay proyectos con clientes.
 * - Credenciales de Victor: solo las verificables del CV (~/Documents/CV/build_cv.py).
 *   NVIDIA Inception es de SuperLeads, no de Omona ni de Victor.
 * - PRs: «contribuciones abiertas»; el conteo y el estado salen de oss.json.
 * - Sin RFC publicado.
 */
import Link from 'next/link';
import type { Metadata } from 'next';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { Wrap, Eyebrow } from './Home';
import { BASE, ORG, ORG_ID, PERSON } from '@/lib/entidad';
import { CARGO_SL, NOMBRE_LEGAL, REDES } from '@/lib/perfil';
import ossData from '../../../data/oss/oss.json';
import { DiagnosticoSaaS } from './DiagnosticoSaaS';

type Lang = 'es' | 'en';

export const PERSONA_MORAL_ES = 'una persona moral formalmente establecida en México';
export const PERSONA_MORAL_EN = 'a formally incorporated Mexican legal entity';
export const CORREO_SEGURIDAD = 'victor@omona.tech';

const s = (ossData as unknown as { stats: Record<string, number> }).stats;

const T = {
  es: {
    path: '/seguridad',
    other: { href: '/en/security', label: 'English (US)' },
    eyebrow: 'Ciberseguridad para Negocios Latinos en EE. UU. e IA · Solo defensiva',
    h1: 'Ciberseguridad para tu negocio en EE. UU.: del fraude ACH a la IA',
    sub: 'Ayudamos a dueños de negocios latinos e hispanos en Estados Unidos (contratistas, firmas de impuestos sujetas a FTC Safeguards / IRS WISP, transporte, clínicas y servicios B2B) a blindar Google Workspace o Microsoft 365 contra facturas falsas BEC, cumplir requisitos de cyber insurance y asegurar sus agentes de IA bilingües en AWS. Solo trabajo defensivo, sobre sistemas propios del cliente y con autorización por escrito.',
    status:
      'Servicio nuevo: todavía no hay proyectos con clientes. Algunos servicios dependen de que los proveedores de modelos aprueben nuestra participación en sus programas.',
    pillarLabel: 'Leer guía pilar para negocios latinos en EE. UU. (ACH, FTC Safeguards, Cyber Insurance e IA) →',
    wispLabel: 'Plan WISP del IRS y FTC Safeguards para preparadores de impuestos (con medición de 604 dominios hispanos) →',
    wispHref: '/blog/plan-wisp-irs-ftc-safeguards-preparadores-impuestos',
    pagosLabel: 'Fraude ACH y wire: facturas y W-9 falsos (Microsoft 365 vs. Google Workspace en 604 dominios) →',
    pagosHref: '/blog/fraude-ach-wire-facturas-falsas-contratistas',
    seguroLabel: 'Seguro cibernético: requisitos y solicitud (solo 17.3 % de 595 negocios hispanos pasa el escaneo externo) →',
    seguroHref: '/blog/seguro-cibernetico-pequenas-empresas',
    contactCta: 'Escribir a',
    servicesH: 'Cómo acompañamos a tu negocio en EE. UU. (paso a paso)',
    servicesSub: 'Cuatro etapas que puedes contratar desde lo más básico o en conjunto, siempre con alcance firmado.',
    services: [
      {
        k: '01',
        h: 'Correo empresarial (SPF/DKIM/DMARC), nube AWS Bedrock, IAM y Secrets Store',
        p: 'Freno técnico a suplantación de facturas y desvíos ACH/wire (BEC) en Google Workspace y Microsoft 365, permisos IAM de mínimo privilegio, roles STS efímeros en lugar de llaves fijas, bóveda Secrets Store fuera del código y bitácoras alineadas a FTC Safeguards / WISP y cyber insurance.',
      },
      {
        k: '02',
        h: 'Pruebas y guardrails contra indirect prompt injection y jailbreak',
        p: 'Probamos tus propios asistentes bilingües (español + inglés) con una batería de casos contra indirect prompt injection y exfiltración de PII/SSN/ITIN registrada antes de correrla, con criterios de aprobado o fallido fijados de antemano. Solo contra tu entorno de pruebas o los endpoints que autorices.',
      },
      {
        k: '03',
        h: 'Seguridad en servidores MCP (Model Context Protocol), web y código',
        p: 'Leemos tus repositorios y configuraciones MCP para detectar tool poisoning, falta de aislamiento de tokens OAuth, secretos expuestos, dependencias riesgosas y postura pública Content-Security-Policy, HSTS, DMARC y DNS CAA.',
      },
      {
        k: '04',
        h: 'Recomendaciones de hardening y evidencia para cumplimiento',
        p: 'Un reporte en español o inglés con cada hallazgo, su severidad, la evidencia técnica y los pasos para corregirlo (útil para tu expediente WISP o cuestionarios de cyber insurance en EE. UU.). Si se acuerda, volvemos a probar después de que lo arregles.',
      },
    ],
    notH: 'Lo que NO hacemos',
    not: [
      'Pentest ofensivo ni red team contra terceros.',
      'Pruebas sobre sistemas que no son del cliente o sin autorización de su dueño.',
      'Desarrollo de exploits, denegación de servicio ni acciones destructivas.',
      'Pruebas en producción sin acuerdo explícito por escrito.',
    ],
    howH: 'Cómo trabajamos',
    howSub: 'Las reglas van en el contrato. Si una no se cumple, no se empieza.',
    how: [
      ['Autorización por escrito', 'Antes de cualquier prueba, el cliente firma la autorización y el alcance: repositorios, cuentas de nube, entornos, fechas y un contacto designado.'],
      ['Solo sistemas del cliente', 'Nada fuera de lo listado en el alcance. Si algo pertenece a un tercero, no se toca.'],
      ['Revisión humana', 'Una persona revisa cada hallazgo antes de que entre al reporte. Nada corre contra sistemas del cliente sin una acción explícita del responsable.'],
      ['Datos mínimos', 'Trabajamos en entornos de prueba o con copias cuando se puede, ocultamos datos personales antes de que lleguen a un modelo, no usamos datos del cliente para entrenar modelos y borramos las copias de trabajo al cerrar el proyecto.'],
      ['Bitácora', 'Registro fechado de cada proyecto: alcance, instrucciones y acciones, guardado durante el plazo del contrato.'],
      ['Divulgación responsable', 'Los hallazgos se entregan solo al contacto que designe el cliente. Si una falla es de un proveedor externo, se le reporta a ese proveedor con el consentimiento del cliente.'],
    ] as [string, string][],
    whoH: 'Responsable',
    whoRole: 'Representante legal y responsable de los servicios de seguridad',
    whoSub: 'Solo listamos credenciales que se pueden verificar.',
    creds: [
      ['Formación', 'Licenciatura en Contaduría y Finanzas, Escuela Bancaria y Comercial (EBC), 2015–2019.'],
      ['Certificaciones', 'Asesor en Estrategias de Inversión, Figura III, AMIB (2019). Databricks Partner Training: Advantages of the Lakehouse (2026).'],
      ['Cursos', 'CS50: Introduction to Computer Science, Harvard Online (certificado de conclusión).'],
      ['Agentes en producción', `Construye y opera sistemas de agentes de IA en producción en SuperLeads, donde es «${CARGO_SL}»: agentes conversacionales conectados al CRM y un equipo de agentes siempre encendido en AWS EC2 con Claude en Amazon Bedrock. Ese trabajo usa la membresía NVIDIA Inception y los créditos de AWS de SuperLeads.`],
      ['Open source', `Contribuciones abiertas a Hermes Agent (Nous Research) y Strands Agents (AWS): ${s.prs} PR y ${s.issues} reportes${s.merged === 0 ? ', en revisión de los maintainers' : ` (${s.merged} merged)`}.`],
    ] as [string, string][],
    ossLink: 'Ver los PR con su estado en GitHub',
    discH: 'Aviso legal',
    disc: [
      `Los servicios se representan y prestan a través de ${PERSONA_MORAL_ES}, bajo la marca Omona, con domicilio en León, Guanajuato, México.`,
      'Cada proyecto se hace solo con contrato por escrito y alcance firmado.',
      'Ninguna revisión garantiza seguridad absoluta. Los hallazgos son recomendaciones; decidir y aplicar los cambios le corresponde al cliente.',
      'No probamos ningún sistema sin la autorización de su dueño.',
      'El uso de modelos de IA (por ejemplo, Claude de Anthropic) sigue las políticas de uso de cada proveedor.',
      'No estamos afiliados ni respaldados por Anthropic, AWS ni NVIDIA. Las marcas son de sus dueños.',
      'La disponibilidad de algunos servicios depende de que los programas de los proveedores nos aprueben.',
    ],
    contactH: 'Contacto de seguridad',
    contactP: 'Para cotizar un alcance en EE. UU. o México, o reportar un problema de seguridad en este sitio.',
    title: 'Ciberseguridad Negocios Latinos EE. UU. e IA',
    desc: 'Ciberseguridad defensiva para negocios latinos en EE. UU.: freno a fraude ACH/facturas, correo SPF/DMARC, regla FTC, seguro cyber e IA en AWS.',
    locale: 'es_US',
  },
  en: {
    path: '/en/security',
    other: { href: '/seguridad', label: 'Español (EE. UU.)' },
    eyebrow: 'Hispanic & Bilingual US SMB Security · Defensive only',
    h1: 'Security for AI agents & bilingual US businesses',
    sub: 'We help Hispanic-owned and bilingual small businesses in the United States harden email and cloud posture (BEC/wire fraud prevention, Google Workspace & Microsoft 365, FTC Safeguards / IRS WISP technical controls, cyber insurance readiness) and review production AI agents on AWS so they never leak data or take orders from untrusted inputs. Defensive work only, only on systems you own, always with written authorization.',
    status:
      'New service: there are no customer engagements yet. Some services depend on model providers approving our participation in their programs.',
    pillarLabel: 'Read our US Hispanic Small Business Cybersecurity & Bilingual AI Guide (Spanish) →',
    wispLabel: 'IRS WISP & FTC Safeguards Rule for tax preparers (with data on 604 Hispanic business domains) →',
    wispHref: '/blog/irs-wisp-ftc-safeguards-tax-preparers',
    pagosLabel: 'Wire fraud & ACH fraud playbook (Microsoft 365 vs. Google Workspace across 604 domains) →',
    pagosHref: '/blog/wire-fraud-ach-fraud-small-business',
    seguroLabel: 'Cyber insurance checklist for small business (only 17.3% of 595 Hispanic businesses pass the outside-in scan) →',
    seguroHref: '/blog/cyber-insurance-small-business-checklist',
    contactCta: 'Write to',
    servicesH: 'What we do',
    servicesSub: 'Four pieces, hired together or separately, always with a signed scope.',
    services: [
      {
        k: '01',
        h: 'Email anti-spoofing (SPF/DKIM/DMARC), AWS Bedrock, IAM & Secrets Store review',
        p: 'Technical controls against invoice/ACH wire fraud (BEC) across Google Workspace and Microsoft 365, least-privilege IAM, short-lived STS workload roles instead of long-lived keys, Secrets Store isolation kept out of code and config, and logging aligned with FTC Safeguards / WISP & US cyber insurance checklists.',
      },
      {
        k: '02',
        h: 'Indirect prompt-injection, guardrails and jailbreak testing',
        p: 'We test your own bilingual (English + Spanish) assistants against indirect prompt injection and PII/SSN/ITIN exfiltration with a written battery of cases registered before the run, with pass/fail criteria fixed in advance. Only against your staging environment or the endpoints you authorize.',
      },
      {
        k: '03',
        h: 'MCP server security (Model Context Protocol) & secure code review',
        p: 'We read your repositories and MCP server configurations for tool poisoning, OAuth token isolation gaps, unsafe handling of personal data, exposed secrets, risky dependencies, and Content-Security-Policy, HSTS, DMARC & DNS CAA posture.',
      },
      {
        k: '04',
        h: 'Hardening recommendations & compliance evidence',
        p: 'A bilingual-ready report with every finding, its severity, the evidence and step-by-step remediation. If agreed, a retest after you fix it.',
      },
    ],
    notH: 'What we do NOT do',
    not: [
      'Offensive penetration testing or red teaming against third parties.',
      'Testing systems the customer doesn’t own, or without the owner’s authorization.',
      'Exploit development, denial of service or destructive actions.',
      'Testing in production without explicit written agreement.',
    ],
    howH: 'How we work',
    howSub: 'These rules go into the contract. If one isn’t met, the work doesn’t start.',
    how: [
      ['Written authorization', 'Before any test, the customer signs the authorization and scope: repositories, cloud accounts, environments, dates and a designated contact.'],
      ['Customer-owned systems only', 'Nothing outside the listed scope. If something belongs to a third party, we don’t touch it.'],
      ['Human review', 'A person reviews every finding before it goes into the report. Nothing runs against customer systems without an explicit action by the person responsible.'],
      ['Minimal data', 'We work in staging or on copies where possible, mask personal data before it reaches a model, never use customer data to train models, and delete working copies when the engagement closes.'],
      ['Logs', 'A dated record per engagement of scope, prompts and actions, kept for the contract period.'],
      ['Responsible disclosure', 'Findings go only to the customer’s designated contact. If a flaw belongs to a third-party vendor, it is reported to that vendor with the customer’s consent.'],
    ] as [string, string][],
    whoH: 'Responsible person',
    whoRole: 'Legal representative and person responsible for the security services',
    whoSub: 'We only list credentials that can be verified.',
    creds: [
      ['Education', 'B.A. in Accounting and Finance, Escuela Bancaria y Comercial (EBC), 2015–2019.'],
      ['Certifications', 'Investment Strategies Advisor, Figure III, AMIB (Mexican Association of Securities Firms), 2019. Databricks Partner Training: Advantages of the Lakehouse (2026).'],
      ['Courses', 'CS50: Introduction to Computer Science, Harvard Online (certificate of completion).'],
      ['Agents in production', 'Builds and operates AI-agent systems in production at SuperLeads, where he is an Account Executive (public title: “Expert in educational sales processes + AI”): CRM-integrated conversational agents and an always-on agent team on AWS EC2 using Claude on Amazon Bedrock. That work runs on SuperLeads’ NVIDIA Inception membership and AWS credits.'],
      ['Open source', `Open contributions to Hermes Agent (Nous Research) and Strands Agents (AWS): ${s.prs} pull requests and ${s.issues} issue reports${s.merged === 0 ? ', under maintainer review' : ` (${s.merged} merged)`}.`],
    ] as [string, string][],
    ossLink: 'See the PRs with their GitHub status',
    discH: 'Disclaimer',
    disc: [
      `Services are represented and provided by ${PERSONA_MORAL_EN}, under the brand Omona, based in León, Guanajuato, Mexico.`,
      'Every engagement happens only under a written contract and a signed scope.',
      'No review guarantees absolute security. Findings are recommendations; deciding on and applying changes is the customer’s responsibility.',
      'We don’t test any system without its owner’s authorization.',
      'Use of AI models (for example, Anthropic’s Claude) follows each provider’s usage policies.',
      'We are not affiliated with or endorsed by Anthropic, AWS or NVIDIA. Trademarks belong to their owners.',
      'Availability of some services is subject to approval by the providers’ programs.',
    ],
    contactH: 'Security contact',
    contactP: 'To scope an engagement for your US or cross-border team, or report a security issue on this site.',
    title: 'Hispanic SMB & AI Agent Security in the US',
    desc: 'Defensive cybersecurity for Hispanic & bilingual US businesses: wire/BEC fraud prevention, FTC Safeguards, AWS Bedrock IAM & MCP security.',
    locale: 'en_US',
  },
};

export function seguridadMetadata(lang: Lang): Metadata {
  const t = T[lang];
  return {
    title: t.title,
    description: t.desc,
    alternates: {
      canonical: `${BASE}${t.path}`,
      languages: {
        'es-US': `${BASE}/seguridad`,
        'es-MX': `${BASE}/seguridad`,
        'en-US': `${BASE}/en/security`,
        en: `${BASE}/en/security`,
        'x-default': `${BASE}/seguridad`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.desc,
      url: `${BASE}${t.path}`,
      type: 'website',
      siteName: 'Omona',
      locale: t.locale,
      alternateLocale: lang === 'es' ? ['en_US', 'es_MX'] : ['es_US', 'es_MX'],
    },
    twitter: { card: 'summary_large_image', title: t.title, description: t.desc },
  };
}

function Head({ id, h, sub }: { id?: string; h: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 id={id} className="text-heading text-obsidian">
        {h}
      </h2>
      {sub && <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.5] text-stone">{sub}</p>}
    </div>
  );
}

const linkCls = 'text-obsidian underline decoration-hair underline-offset-2 hover:decoration-obsidian';

export function SeguridadPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const url = `${BASE}${t.path}`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        name: t.title,
        description: t.desc,
        url,
        inLanguage: lang === 'es' ? 'es-US' : 'en-US',
        about: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
      },
      PERSON,
      ORG,
    ],
  };

  return (
    <div lang={lang === 'es' ? 'es-US' : 'en-US'} className="md min-h-screen bg-paper text-obsidian">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <LandingNav lang={lang} />
      <main>
        <header className="pb-10 pt-16 sm:pt-24">
          <Wrap>
            <div className="flex items-baseline justify-between gap-6">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <Link href={t.other.href} hrefLang={lang === 'es' ? 'en-US' : 'es-US'} className="mono-label text-charcoal hover:text-obsidian">
                {t.other.label} →
              </Link>
            </div>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <h1 className="text-heading-lg max-w-[20ch] text-balance text-obsidian">{t.h1}</h1>
                <p className="mt-6 max-w-[58ch] text-[18px] leading-[1.5] text-charcoal">{t.sub}</p>
                <p className="mt-4 max-w-[58ch] text-pretty text-[15px] leading-[1.5] text-stone">{t.status}</p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <a href="#diagnostico" className="btn-fill">
                    {lang === 'es' ? 'Evaluar mi dominio ahora →' : 'Analyze my domain now →'}
                  </a>
                  <a href={`mailto:${CORREO_SEGURIDAD}?subject=${encodeURIComponent(lang === 'es' ? 'Agendar revisión de seguridad para agentes IA — Omona' : 'Schedule an AI Agent Security Review — Omona')}`} className="btn-ghost">
                    {lang === 'es' ? 'Agendar llamada de alcance' : 'Book scope call'}
                  </a>
                </div>
                <p className="mt-4">
                  <Link href="/blog/ciberseguridad-negocios-latinos-estados-unidos" className="mono-label text-[#297a3a] hover:underline">
                    {t.pillarLabel}
                  </Link>
                </p>
                <p className="mt-2">
                  <Link href={t.wispHref} className="mono-label text-[#297a3a] hover:underline">
                    {t.wispLabel}
                  </Link>
                </p>
                <p className="mt-2">
                  <Link href={t.pagosHref} className="mono-label text-[#297a3a] hover:underline">
                    {t.pagosLabel}
                  </Link>
                </p>
                <p className="mt-2">
                  <Link href={t.seguroHref} className="mono-label text-[#297a3a] hover:underline">
                    {t.seguroLabel}
                  </Link>
                </p>
              </div>
              <div className="cli text-[12.5px]">
                <p>
                  <span className="dim">$</span> scope --signed --owner=client
                </p>
                <p className="mt-1">
                  <span className="ok">✓</span> {lang === 'es' ? 'autorización por escrito' : 'written authorization'}
                </p>
                <p className="mt-1">
                  <span className="ok">✓</span> {lang === 'es' ? 'solo sistemas del cliente' : 'customer-owned systems only'}
                </p>
                <p className="mt-1">
                  <span className="ok">✓</span> {lang === 'es' ? 'revisión humana de cada hallazgo' : 'human review of every finding'}
                </p>
                <p className="dim mt-1">{lang === 'es' ? '× sin pentest ofensivo' : '× no offensive pentest'}</p>
                <p className="dim">{lang === 'es' ? '× sin red team a terceros' : '× no third-party red team'}</p>
              </div>
            </div>
            <div className="mt-10">
              <DiagnosticoSaaS lang={lang} showScopeLink={false} />
            </div>
          </Wrap>
        </header>

        <section className="py-10 sm:py-14" aria-labelledby="servicios">
          <Wrap>
            <Head id="servicios" h={t.servicesH} sub={t.servicesSub} />
            <ul className="divide-y divide-hair border-y border-hair">
              {t.services.map((x) => (
                <li key={x.k} className="grid gap-2 py-5 md:grid-cols-[28ch_minmax(0,1fr)] md:items-baseline md:gap-8">
                  <h3 className="text-[18px] font-medium leading-[1.3] tracking-[-0.02em] text-obsidian">{x.h}</h3>
                  <p className="text-[15px] leading-[1.5] text-charcoal">{x.p}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-b border-hair pb-6">
              <h3 className="text-[18px] font-medium leading-[1.3] tracking-[-0.02em] text-obsidian">{t.notH}</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {t.not.map((x) => (
                  <li key={x} className="flex gap-3 text-[15px] leading-[1.5] text-charcoal">
                    <span aria-hidden className="font-mono text-stone">
                      ×
                    </span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Wrap>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="como">
          <Wrap>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-16">
              <Head id="como" h={t.howH} sub={t.howSub} />
              <ol className="divide-y divide-hair border-y border-hair">
                {t.how.map(([h, p], i) => (
                  <li key={h} className="grid grid-cols-[3ch_minmax(0,1fr)] gap-4 py-4">
                    <span className="mono-label pt-1 text-graphite">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="text-[17px] leading-[1.35] tracking-[-0.02em] text-obsidian">{h}</p>
                      <p className="mt-1 text-pretty text-[15px] leading-[1.5] text-charcoal">{p}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Wrap>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="responsable">
          <Wrap>
            <Eyebrow muted>{t.whoH}</Eyebrow>
            <h2 id="responsable" className="text-heading text-obsidian">
              {NOMBRE_LEGAL}
            </h2>
            <p className="mt-2 max-w-[60ch] text-[16px] leading-[1.5] text-charcoal">{t.whoRole}</p>
            <p className="mt-1 max-w-[60ch] text-[15px] leading-[1.5] text-stone">{t.whoSub}</p>
            <dl className="mt-8 divide-y divide-hair border-y border-hair">
              {t.creds.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6">
                  <dt className="mono-label pt-0.5 text-graphite">{k}</dt>
                  <dd className="text-pretty text-[15px] leading-[1.5] text-charcoal">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mono-label mt-4 flex flex-wrap gap-x-5 gap-y-2 text-stone">
              <Link href={lang === 'es' ? '/open-source' : '/en/open-source'} className={linkCls}>
                {t.ossLink} →
              </Link>
              <a href={REDES.linkedin} className="hover:text-obsidian" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
              <a href={REDES.github} className="hover:text-obsidian" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a href={REDES.web} rel="author" className="hover:text-obsidian">
                victorgallo.com ↗
              </a>
            </p>
          </Wrap>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="aviso">
          <Wrap>
            <div className="grid gap-10 border-y border-hair py-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
              <div>
                <h2 id="aviso" className="text-[22px] leading-[1.2] tracking-[-0.03em] text-obsidian">
                  {t.discH}
                </h2>
                <ul className="mt-4 grid gap-2">
                  {t.disc.map((x) => (
                    <li key={x} className="text-pretty text-[14px] leading-[1.55] text-charcoal">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="self-start lg:border-l lg:border-hair lg:pl-8">
                <h2 className="text-[22px] leading-[1.2] tracking-[-0.03em] text-obsidian">{t.contactH}</h2>
                <p className="mt-2 text-[15px] leading-[1.5] text-stone">{t.contactP}</p>
                <p className="mt-4 text-[15px] leading-[1.5] text-charcoal">
                  {NOMBRE_LEGAL}
                  <br />
                  <a href={`mailto:${CORREO_SEGURIDAD}`} className={linkCls}>
                    {CORREO_SEGURIDAD}
                  </a>
                </p>
                <p className="mono-label mt-4 text-stone">
                  <a href="/.well-known/security.txt" className="hover:text-obsidian">
                    security.txt ↗
                  </a>
                </p>
              </div>
            </div>
          </Wrap>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
