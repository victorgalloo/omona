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

type Lang = 'es' | 'en';

export const RAZON_SOCIAL = 'COMERCIALIZADORA DE LIBROS DEL BAJIO JIGA S.A.S. de C.V.';
export const CORREO_SEGURIDAD = 'victor@omona.tech';

const s = (ossData as unknown as { stats: Record<string, number> }).stats;

const T = {
  es: {
    path: '/seguridad',
    other: { href: '/en/security', label: 'English' },
    eyebrow: 'Seguridad · Solo defensiva',
    h1: 'Seguridad para agentes de IA',
    sub: 'Revisamos los agentes de IA que ya corren en tu empresa, su nube y su código, para que no filtren datos ni obedezcan a quien no deben. Solo trabajo defensivo, solo sobre sistemas tuyos y siempre con autorización por escrito.',
    status:
      'Servicio nuevo: todavía no hay proyectos con clientes. Algunos servicios dependen de que los proveedores de modelos aprueben nuestra participación en sus programas.',
    contactCta: 'Escribir a',
    servicesH: 'Qué hacemos',
    servicesSub: 'Cuatro piezas. Se contratan juntas o por separado, siempre con alcance firmado.',
    services: [
      {
        k: '01',
        h: 'Revisión de despliegues en AWS Bedrock',
        p: 'Permisos IAM de mínimo privilegio, roles de instancia o de carga de trabajo en lugar de llaves fijas, manejo de secretos fuera del código y de la configuración, bitácoras (logs) y retención de datos.',
      },
      {
        k: '02',
        h: 'Pruebas de prompt injection y jailbreak',
        p: 'Probamos tus propios asistentes con una batería de casos escrita y registrada antes de correrla, con criterios de aprobado o fallido fijados de antemano. Solo contra tu entorno de pruebas o los endpoints que autorices.',
      },
      {
        k: '03',
        h: 'Revisión de código seguro',
        p: 'Leemos los repositorios que nos indiques en busca de vulnerabilidades, manejo inseguro de datos personales, secretos expuestos y dependencias riesgosas.',
      },
      {
        k: '04',
        h: 'Recomendaciones de hardening',
        p: 'Un reporte con cada hallazgo, su severidad, la evidencia y los pasos para corregirlo. Si se acuerda, volvemos a probar después de que lo arregles.',
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
      `Los servicios los presta ${RAZON_SOCIAL}, bajo la marca Omona, con domicilio en León, Guanajuato, México.`,
      'Cada proyecto se hace solo con contrato por escrito y alcance firmado.',
      'Ninguna revisión garantiza seguridad absoluta. Los hallazgos son recomendaciones; decidir y aplicar los cambios le corresponde al cliente.',
      'No probamos ningún sistema sin la autorización de su dueño.',
      'El uso de modelos de IA (por ejemplo, Claude de Anthropic) sigue las políticas de uso de cada proveedor.',
      'No estamos afiliados ni respaldados por Anthropic, AWS ni NVIDIA. Las marcas son de sus dueños.',
      'La disponibilidad de algunos servicios depende de que los programas de los proveedores nos aprueben.',
    ],
    contactH: 'Contacto de seguridad',
    contactP: 'Para cotizar un alcance o reportar un problema de seguridad en este sitio.',
    title: 'Seguridad para agentes de IA (solo defensiva)',
    desc: 'Revisión de seguridad de agentes de IA en AWS Bedrock, pruebas de prompt injection a tus propios asistentes, revisión de código seguro y hardening. Solo defensiva, con autorización por escrito. Omona, León, México.',
    locale: 'es_MX',
  },
  en: {
    path: '/en/security',
    other: { href: '/seguridad', label: 'Español' },
    eyebrow: 'Security · Defensive only',
    h1: 'Security for AI agents',
    sub: 'We review the AI agents your company already runs, their cloud and their code, so they don’t leak data or take orders from the wrong people. Defensive work only, only on systems you own, always with written authorization.',
    status:
      'New service: there are no customer engagements yet. Some services depend on model providers approving our participation in their programs.',
    contactCta: 'Write to',
    servicesH: 'What we do',
    servicesSub: 'Four pieces, hired together or separately, always with a signed scope.',
    services: [
      {
        k: '01',
        h: 'AI-agent deployment review on AWS Bedrock',
        p: 'Least-privilege IAM, instance or workload roles instead of long-lived keys, secrets kept out of code and config, logging and data retention.',
      },
      {
        k: '02',
        h: 'Prompt-injection and jailbreak testing',
        p: 'We test your own assistants with a written battery of cases registered before the run, with pass/fail criteria fixed in advance. Only against your staging environment or the endpoints you authorize.',
      },
      {
        k: '03',
        h: 'Secure code review',
        p: 'We read the repositories you point us to for vulnerabilities, unsafe handling of personal data, exposed secrets and risky dependencies.',
      },
      {
        k: '04',
        h: 'Hardening recommendations',
        p: 'A report with every finding, its severity, the evidence and step-by-step remediation. If agreed, a retest after you fix it.',
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
      `Services are provided by ${RAZON_SOCIAL}, under the brand Omona, based in León, Guanajuato, Mexico.`,
      'Every engagement happens only under a written contract and a signed scope.',
      'No review guarantees absolute security. Findings are recommendations; deciding on and applying changes is the customer’s responsibility.',
      'We don’t test any system without its owner’s authorization.',
      'Use of AI models (for example, Anthropic’s Claude) follows each provider’s usage policies.',
      'We are not affiliated with or endorsed by Anthropic, AWS or NVIDIA. Trademarks belong to their owners.',
      'Availability of some services is subject to approval by the providers’ programs.',
    ],
    contactH: 'Security contact',
    contactP: 'To scope an engagement or report a security issue on this site.',
    title: 'Security for AI agents (defensive only)',
    desc: 'Security reviews of AI-agent deployments on AWS Bedrock, prompt-injection testing of your own assistants, secure code review and hardening. Defensive only, with written authorization. Omona, León, Mexico.',
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
      languages: { 'es-MX': `${BASE}/seguridad`, en: `${BASE}/en/security`, 'x-default': `${BASE}/seguridad` },
    },
    openGraph: { title: t.title, description: t.desc, url: `${BASE}${t.path}`, type: 'website', siteName: 'Omona', locale: t.locale },
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
        inLanguage: lang === 'es' ? 'es-MX' : 'en',
        about: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
      },
      PERSON,
      ORG,
    ],
  };

  return (
    <div lang={lang === 'es' ? 'es-MX' : 'en'} className="md min-h-screen bg-paper text-obsidian">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <LandingNav lang={lang} />
      <main>
        <header className="pb-10 pt-16 sm:pt-24">
          <Wrap>
            <div className="flex items-baseline justify-between gap-6">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <Link href={t.other.href} hrefLang={lang === 'es' ? 'en' : 'es-MX'} className="mono-label text-charcoal hover:text-obsidian">
                {t.other.label} →
              </Link>
            </div>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <h1 className="text-heading-lg max-w-[20ch] text-balance text-obsidian">{t.h1}</h1>
                <p className="mt-6 max-w-[58ch] text-[18px] leading-[1.5] text-charcoal">{t.sub}</p>
                <p className="mt-4 max-w-[58ch] text-pretty text-[15px] leading-[1.5] text-stone">{t.status}</p>
                <p className="mt-6">
                  <a href={`mailto:${CORREO_SEGURIDAD}`} className="btn-fill">
                    {t.contactCta} {CORREO_SEGURIDAD}
                  </a>
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
          </Wrap>
        </header>

        <section className="py-10 sm:py-14" aria-labelledby="servicios">
          <Wrap>
            <Head id="servicios" h={t.servicesH} sub={t.servicesSub} />
            <ul className="grid gap-3 md:grid-cols-2">
              {t.services.map((x) => (
                <li key={x.k} className="ring-card p-5">
                  <p className="mono-label text-graphite">{x.k}</p>
                  <h3 className="mt-4 text-[19px] leading-[1.25] tracking-[-0.03em] text-obsidian">{x.h}</h3>
                  <p className="mt-2 text-[15px] leading-[1.5] text-charcoal">{x.p}</p>
                </li>
              ))}
            </ul>
            <div className="ring-card mt-3 p-5">
              <h3 className="text-[19px] leading-[1.25] tracking-[-0.03em] text-obsidian">{t.notH}</h3>
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
            <dl className="ring-card mt-8 divide-y divide-hair">
              {t.creds.map(([k, v]) => (
                <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6">
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
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="ring-card p-5">
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
              <div className="ring-card self-start p-5">
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
