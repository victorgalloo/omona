/**
 * Victor, en un solo lugar: lo que la portada, /about, /now, llms.txt y
 * llms-full.txt dicen de él. Si cambias algo aquí, cambia en todas.
 *
 * Reglas (skill omona-tech):
 * - En SuperLeads su cargo público es, literal, «Experto en procesos comerciales
 *   educativos + IA» (Account Executive: vende sistemas de admisiones a colegios
 *   y universidades privadas en México). NUNCA fundador de SuperLeads: el
 *   fundador es el Ing. Ricardo López Reyero. Sin nombres de clientes; la cifra
 *   pública de la empresa es «+100 instituciones educativas» y va como «en SuperLeads».
 * - FILOSOFIA es un BORRADOR que Victor aprueba (~/.hermes/estrategia/omona/filosofia-borrador.md).
 *   Se publicó porque él la pidió; si la corrige, se cambia aquí y en ese archivo.
 * - Logos: uso nominativo. Cada uno liga a la evidencia (PR, repo, nota) y el pie
 *   dice que no implica patrocinio. OpenAI no va: no hay aporte ni uso público que ligar.
 */
import ossData from '../../data/oss/oss.json';

type Oss = {
  stats: Record<string, number>;
  prs: { repo: string }[];
  issues: { repo: string }[];
  projects?: { repo: string; url: string; en: string }[];
};
const oss = ossData as unknown as Oss;

export const NOMBRE = 'Victor Gallo';
export const NOMBRE_LEGAL = 'Víctor Alejandro Jiménez Gallo';
export const FOTO = '/victor/victor-gallo.webp';
export const FOTO_JPG = 'https://omona.tech/victor/victor-gallo.jpg';
export const CARGO_SL = 'Experto en procesos comerciales educativos + IA';

export const REDES = {
  github: 'https://github.com/victorgalloo',
  linkedin: 'https://www.linkedin.com/in/victorgalloo/',
  x: 'https://x.com/victorgallomx',
  builder: 'https://builder.aws.com/community/@victorgalloo',
  web: 'https://victorgallo.com',
};

export const POSICION = {
  es: 'Construyo agentes de IA que hacen trabajo comercial de verdad.',
  en: 'I build AI agents that do real commercial work.',
};

export const SUPERLEADS = {
  es: `En SuperLeads soy «${CARGO_SL}»: vendo sistemas de admisiones a colegios y universidades privadas de México y construyo los agentes que me ayudan con el seguimiento comercial. Más de 100 instituciones educativas trabajan con SuperLeads.`,
  en: `At SuperLeads I am an Account Executive (public title: “Expert in educational sales processes + AI”). I sell admissions systems to private schools and universities in Mexico and build the agents that help me with the commercial follow-up. More than 100 educational institutions work with SuperLeads.`,
};

export const LAB = {
  es: 'Omona es mi laboratorio: aquí publico lo que arreglo y aporto a los proyectos open source sobre los que corren esos agentes.',
  en: 'Omona is my lab: it is where I publish the fixes and contributions I send to the open-source projects those agents run on.',
};

/** Lo mismo en tercera persona, para llms.txt / llms-full.txt. */
export const TERCERA = {
  posicion: 'Builds AI agents that do real commercial work.',
  superleads:
    'At SuperLeads he is an Account Executive (public title: "Expert in educational sales processes + AI"): he sells admissions systems to private schools and universities in Mexico and builds the agents that help with the commercial follow-up. More than 100 educational institutions work with SuperLeads. He is not a founder of SuperLeads.',
  lab: 'Omona is his lab, where he publishes the fixes and contributions he sends to the open-source projects those agents run on.',
};

/** BORRADOR (22-nov-2026). Texto exacto publicado; Victor lo revisa. */
export const FILOSOFIA = {
  es: [
    'Trato a los agentes como empleados, y un equipo necesita jerarquía: gerentes, agentes y subagentes, cada quien con su área.',
    'Una persona supervisa y el agente pone las horas.',
    'No me gusta el micromanagement. Si tengo que revisar cada paso, el diseño está mal.',
    'Inscribir a un alumno tiene ciencia: qué se dice, cuándo y por qué. Eso es lo que les enseño a los agentes.',
    'En México y en LatAm usamos casi todo lo que se construye afuera. Cuando algo se rompe, mando el arreglo al proyecto original en vez de parcharlo en casa.',
    'Un PR abierto es mi prueba de trabajo: el código, los tests y la revisión quedan a la vista.',
    'Aprendo en público. Lo que sale mal también va a las notas.',
  ],
  en: [
    'I treat agents like employees, and a team needs hierarchy: managers, agents and subagents, each with its own area.',
    'One person supervises; the agent puts in the hours.',
    "I don't like micromanagement. If I have to check every step, the design is wrong.",
    'Enrolling a student has a science to it: what to say, when, and why. That is what I teach the agents.',
    'In Mexico and Latin America we use almost everything that gets built elsewhere. When something breaks, I send the fix to the original project instead of patching it at home.',
    'An open PR is my proof of work: the code, the tests and the review are public.',
    'I learn in public. What goes wrong goes into the notes too.',
  ],
};

const n = (pred: (repo: string) => boolean) => ({
  prs: oss.prs.filter((p) => pred(p.repo)).length,
  issues: oss.issues.filter((i) => pred(i.repo)).length,
});
const hermes = n((r) => r === 'NousResearch/hermes-agent');
const strands = n((r) => r.startsWith('strands-agents/'));
const plural = (k: number, uno: string, varios: string) => `${k} ${k === 1 ? uno : varios}`;

export type Marca = {
  id: string;
  nombre: string;
  dueno: string;
  logo: string | null;
  /** Alto del logo en px; los wordmarks anchos van más bajos. */
  alto: number;
  /** Texto junto al logo cuando el logo es solo un símbolo. */
  rotulo?: string;
  href: string;
  es: string;
  en: string;
};

export const CONTRIBUYO: Marca[] = [
  {
    id: 'hermes',
    nombre: 'Hermes Agent',
    dueno: 'Nous Research',
    logo: '/logos/nous-research.svg',
    alto: 40,
    rotulo: 'Hermes Agent',
    href: 'https://github.com/NousResearch/hermes-agent/pulls?q=author%3Avictorgalloo',
    // Siglas invariables en español («4 PR»): el rótulo va en mayúsculas y «PRs» se leería «PRS».
    es: `${plural(hermes.prs, 'PR', 'PR')} · ${plural(hermes.issues, 'reporte', 'reportes')}`,
    en: `${plural(hermes.prs, 'pull request', 'pull requests')} · ${plural(hermes.issues, 'issue', 'issues')}`,
  },
  {
    id: 'strands',
    nombre: 'Strands Agents',
    dueno: 'AWS',
    logo: '/logos/strands-agents.svg',
    alto: 32,
    rotulo: 'Strands Agents',
    href: 'https://github.com/pulls?q=author%3Avictorgalloo+org%3Astrands-agents',
    es: plural(strands.prs, 'PR', 'PR'),
    en: plural(strands.prs, 'pull request', 'pull requests'),
  },
];

export const CONSTRUYO_SOBRE: Marca[] = [
  {
    id: 'bedrock',
    nombre: 'Amazon Bedrock',
    dueno: 'AWS',
    logo: null,
    alto: 22,
    href: 'https://github.com/victorgalloo/superleads-ai-aws-nvidia',
    es: 'modelos de los agentes',
    en: 'models behind the agents',
  },
  {
    id: 'claude',
    nombre: 'Claude',
    dueno: 'Anthropic',
    logo: '/logos/claude.svg',
    alto: 22,
    href: 'https://omona.tech/blog/bedrock-credenciales-hermes-agent',
    es: 'Claude en Bedrock',
    en: 'Claude on Bedrock',
  },
  {
    id: 'nvidia',
    nombre: 'NVIDIA',
    dueno: 'NVIDIA',
    logo: '/logos/nvidia.svg',
    alto: 20,
    href: 'https://github.com/victorgalloo/superleads-ai-aws-nvidia',
    es: 'Inception (SuperLeads)',
    en: 'Inception (SuperLeads)',
  },
];

export const AVISO_LOGOS = {
  es: 'Los logos son de sus dueños y aparecen solo para decir sobre qué construyo; no implica patrocinio ni respaldo.',
  en: 'Logos belong to their owners and appear only to show what I build on; no sponsorship or endorsement implied.',
};

/** Origen (Victor, 24-nov-2026). Fechas de Globant = las de su LinkedIn; sin roles ni clientes de proyectos. */
export const ORIGEN = {
  historia: 'https://victorgallo.com/inicios/',
  post: 'https://www.linkedin.com/feed/update/urn:li:activity:7531052248143994881/',
  en: [
    'I started with my hands: opening computers, swapping hard drives for SSDs, adding memory and talking servers.',
    'Then came banking (BanBajío, SME banking) and Globant, from November 2021 to April 2023. I joined through Walmeric, the Spanish sales-tech company Globant had acquired, and was trained one-on-one in Google Ads, Meta Ads and LinkedIn Ads.',
    "On my own: Harvard's CS50, Python, editing React until it ran, and reading security in practice labs.",
    'Today I build the AI agents SuperLeads runs in production, and the open-source side lives here.',
  ],
  es: [
    'Empecé con las manos: abrir computadoras, cambiar discos duros por SSD, subir memoria y platicar de servidores.',
    'Después vinieron la banca (BanBajío, banca PyME) y Globant, de noviembre de 2021 a abril de 2023. Llegué por Walmeric, la empresa española de tecnología para ventas que Globant había comprado, y ahí me capacitaron uno a uno en Google Ads, Meta Ads y LinkedIn Ads.',
    'Por mi cuenta: CS50 de Harvard, Python, editar React hasta que corriera y leer de seguridad en laboratorios de práctica.',
    'Hoy construyo los agentes de IA que SuperLeads usa en producción; lo open source vive aquí.',
  ],
};

/**
 * Programas para startups que aceptaron a SuperLeads (la empresa, no Victor). Victor, 24-nov-2026: «Pon los logos
 * oficiales». Arte oficial sin modificar SOLO donde el dueño lo permite al miembro sin aprobación previa; si no, el
 * nombre oficial en texto. Fuentes y guías: apps/dashboard/LOGOS-CREDITOS.md.
 * - NVIDIA Inception: insignia de miembro oficial (design.nvidia.com), a color, alto 52 px (recuadro ~40 px ≥ 30 px).
 * - Google for Startups Cloud Program, AWS Activate, Claude Startups: texto (sus guías piden aprobación escrita).
 */
export type ProgramaSL = {
  nombre: string;
  sub: string;
  href: string;
  insignia?: { src: string; ancho: number; alto: number; alt: string };
};
export const PROGRAMAS_SL: ProgramaSL[] = [
  { nombre: 'Google for Startups', sub: 'Cloud Program', href: 'https://startup.google.com/cloud/' },
  { nombre: 'AWS Activate', sub: 'AWS for Startups', href: 'https://aws.amazon.com/startups/credits' },
  {
    nombre: 'NVIDIA Inception',
    sub: 'Startup program',
    href: 'https://www.nvidia.com/en-us/startups/',
    insignia: {
      src: '/logos/programas/nvidia-inception-program-badge-rgb-for-screen.svg',
      ancho: 120,
      alto: 52,
      alt: 'NVIDIA Inception Program member badge',
    },
  },
  { nombre: 'Claude Startups', sub: 'Anthropic', href: 'https://claude.com/programs/startups' },
];
export const AVISO_PROGRAMAS = {
  es: 'Las marcas pertenecen a sus dueños; su uso no implica patrocinio ni respaldo.',
  en: 'Trademarks belong to their owners; their use does not imply sponsorship or endorsement.',
};

/** Evidencia verificable para revisores de programas (AWS, NVIDIA, Anthropic, OpenAI). */
export const EVIDENCIA: { en: string; href: string }[] = [
  { en: `${oss.stats.prs} upstream pull requests (${oss.stats.merged} merged, ${oss.stats.open} under review) and ${oss.stats.issues} issue reports, with live GitHub status`, href: 'https://omona.tech/en/open-source' },
  { en: 'Pull requests to Hermes Agent (Nous Research) on GitHub', href: 'https://github.com/NousResearch/hermes-agent/pulls?q=author%3Avictorgalloo' },
  { en: 'Pull request to Strands Agents (AWS) on GitHub', href: 'https://github.com/pulls?q=author%3Avictorgalloo+org%3Astrands-agents' },
  // Repos propios: salen de oss.json (PROYECTOS_PROPIOS en scripts/oss-refresh.mjs).
  ...(oss.projects ?? []).map((p) => ({ en: `${p.repo.split('/')[1]}: ${p.en}`, href: p.url })),
  { en: 'Engineering notes (Spanish): Bedrock credentials, TTS loudness, agent hierarchies', href: 'https://omona.tech/blog' },
  { en: 'AWS Builder Center profile @victorgalloo', href: 'https://builder.aws.com/community/@victorgalloo' },
  { en: 'What I am doing now, updated daily', href: 'https://omona.tech/now' },
];

export const KNOWS_ABOUT = [
  'AI agents',
  'Multi-agent orchestration',
  'Amazon Bedrock',
  'Strands Agents',
  'Hermes Agent',
  'Anthropic Claude',
  'NVIDIA Nemotron',
  'Sales operations in education',
  'Student admissions and enrollment',
  'Open source',
];
