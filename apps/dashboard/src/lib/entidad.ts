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
 * Regla: Victor es fundador de Omona, NUNCA de SuperLeads (ahí lidera ventas; el fundador es
 * Ricardo López Reyero). SuperLeads solo aparece en /about como contexto de los créditos.
 */
export const BASE = 'https://omona.tech';
export const ORG_ID = `${BASE}/#org`;
export const PERSON_ID = 'https://victorgallo.com/#victor';

export const PERSON_SAME_AS = [
  'https://victorgallo.com',
  'https://github.com/victorgalloo',
  'https://www.linkedin.com/in/victorgalloo/',
  'https://builder.aws.com/community/@victorgalloo',
];

export const PERSON_REF = { '@id': PERSON_ID };

export const PERSON = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Victor Gallo',
  alternateName: 'Víctor Alejandro Jiménez Gallo',
  url: 'https://victorgallo.com',
  sameAs: PERSON_SAME_AS,
  // Sin jobTitle/worksFor: victorgallo.com publica los suyos (SuperLeads) con este mismo @id.
  // La relación con Omona va del lado de la organización (`founder`).
  homeLocation: { '@type': 'Place', name: 'León, Guanajuato, México' },
  knowsAbout: ['AI agents', 'Amazon Bedrock', 'Hermes Agent', 'Strands Agents', 'open source'],
};

export const ORG = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Omona',
  url: BASE,
  logo: `${BASE}/logo-mark.png`,
  description:
    "Victor Gallo's independent engineering lab for open-source work on AI agents: upstream pull requests, issue reports and engineering notes. Not a commercial product.",
  founder: PERSON_REF,
};

export const ORG_DESC_ES =
  'Laboratorio de ingeniería independiente de Victor Gallo para su trabajo open source sobre agentes de IA: pull requests a otros proyectos, reportes de bugs y notas de ingeniería. No es un producto comercial.';

export const AUTOR = {
  nombre: 'Victor Gallo',
  url: 'https://victorgallo.com',
  github: 'https://github.com/victorgalloo',
  linkedin: 'https://www.linkedin.com/in/victorgalloo/',
  bio: 'Construye agentes de IA sobre Amazon Bedrock y aporta a Hermes Agent (Nous Research) y a Strands Agents (AWS). Omona es su laboratorio open source. León, Gto.',
  bioEn: 'Builds AI agents on Amazon Bedrock and contributes to Hermes Agent (Nous Research) and Strands Agents (AWS). Omona is his open-source lab. León, Mexico.',
};
