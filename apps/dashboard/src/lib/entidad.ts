/**
 * La entidad: Omona (organización) y Victor Gallo (persona, fundador).
 *
 * Desde el 22-nov-2026 Omona NO es un producto: es el laboratorio de ingeniería
 * independiente de Victor para su trabajo open source (PRs, reportes, notas).
 * Nada de ofertas, precios ni servicios en el JSON-LD.
 *
 * Los `@id` son los mismos que usa victorgallo.com (`https://victorgallo.com/#victor`),
 * así los buscadores y los motores generativos unen las dos páginas como una
 * sola persona sin que ninguna de las dos lo grite. Si cambias redes o cargo,
 * cámbialo también en ~/victorgallo-com (inicio.py) — skill `omona-tech`.
 *
 * Regla: Victor es fundador de Omona, NUNCA de SuperLeads (ahí es «Experto en procesos
 * comerciales educativos + IA», Account Executive; el fundador es Ricardo López Reyero).
 * v2 (22-nov-2026): jobTitle/worksFor iguales a los de victorgallo.com (mismo @id), más
 * knowsAbout, image y sameAs completos para motores de IA. Textos de Victor: lib/perfil.ts.
 */
import { CARGO_SL, FOTO_JPG, KNOWS_ABOUT, REDES } from './perfil';

export const BASE = 'https://omona.tech';
export const ORG_ID = `${BASE}/#org`;
export const PERSON_ID = 'https://victorgallo.com/#victor';

export const PERSON_SAME_AS = [REDES.web, REDES.github, REDES.linkedin, REDES.x, REDES.builder];

export const PERSON_REF = { '@id': PERSON_ID };

export const PERSON = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Victor Gallo',
  alternateName: 'Víctor Alejandro Jiménez Gallo',
  url: 'https://victorgallo.com',
  sameAs: PERSON_SAME_AS,
  image: FOTO_JPG,
  jobTitle: CARGO_SL,
  worksFor: { '@type': 'Organization', '@id': 'https://superleads.mx/#org', name: 'SuperLeads', url: 'https://superleads.mx' },
  // La relación con Omona va del lado de la organización (`founder`).
  homeLocation: { '@type': 'Place', name: 'León, Guanajuato, México' },
  nationality: { '@type': 'Country', name: 'México' },
  knowsLanguage: ['es', 'en'],
  knowsAbout: KNOWS_ABOUT,
};

export const ORG = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Omona',
  url: BASE,
  logo: `${BASE}/logo-mark.png`,
  description:
    'Commercial processes with AI agents, defensive AI/cloud cybersecurity, and open-source engineering in Mexico: WhatsApp/CRM workflows with deterministic guardrails, domain posture diagnostics, and AWS Bedrock reviews.',
  founder: PERSON_REF,
  address: { '@type': 'PostalAddress', addressLocality: 'León', addressRegion: 'Guanajuato', addressCountry: 'MX' },
  email: 'victor@omona.tech',
};

export const ORG_DESC_ES =
  'Procesos comerciales con agentes de IA y ciberseguridad defensiva en México, operada como persona moral formalmente establecida en México, más contribuciones verificables a código abierto.';

export const AUTOR = {
  nombre: 'Victor Gallo',
  url: 'https://victorgallo.com',
  github: 'https://github.com/victorgalloo',
  linkedin: 'https://www.linkedin.com/in/victorgalloo/',
  bio: 'Construye agentes de IA sobre Amazon Bedrock y aporta a Hermes Agent (Nous Research) y a Strands Agents (AWS). Omona es su laboratorio open source. León, Gto.',
  bioEn: 'Builds AI agents on Amazon Bedrock and contributes to Hermes Agent (Nous Research) and Strands Agents (AWS). Omona is his open-source lab. León, Mexico.',
};
