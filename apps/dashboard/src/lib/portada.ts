/**
 * Texto del héroe de la portada: UNA sola fuente para la página (`Home.tsx`) y
 * para la imagen que sale al compartir el dominio (`app/opengraph-image.tsx`,
 * `app/twitter-image.tsx`).
 *
 * Victor, 27-nov-2026: «Actualiza la imagen cuando se comparte el dominio y
 * cada que haya cambios que se actualicen». Por eso la imagen no lleva texto
 * propio: se dibuja con estas constantes. Si cambias el título o un producto
 * aquí, cambian la portada y la imagen en el mismo despliegue.
 */
export const HERO_EYEBROW = 'Negocios latinos en EE. UU. · ES + EN';

/** Una frase por producto, con el mismo peso; cada una va en su renglón. */
export const HERO_FRASES = ['Te encuentran.', 'Les contestas primero.', 'Cobras seguro.'] as const;

export const HERO_DESC = 'Tres sistemas con agentes de IA para negocios latinos en Estados Unidos, en español e inglés.';

/** `promesa` repite la frase del h1; `nombre` es el producto; `linea` es el titular de su franja. */
export const PRODUCTOS = [
  {
    id: 'posicionamiento',
    promesa: 'Te encuentran',
    nombre: 'Posicionamiento SEO + GEO',
    linea: 'Te posicionamos en Google, ChatGPT, Claude y Gemini para obtener más ventas. Punto.',
  },
  {
    id: 'agentes',
    promesa: 'Les contestas primero',
    nombre: 'Agentes bilingües',
    linea: 'Contesta primero, en el idioma de tu cliente.',
  },
  {
    id: 'defensa',
    promesa: 'Cobras seguro',
    nombre: 'Ciberseguridad defensiva',
    linea: 'Frena la factura falsa antes de que se pague.',
  },
] as const;

export type ProductoId = (typeof PRODUCTOS)[number]['id'];

export function producto(id: ProductoId) {
  return PRODUCTOS.find((p) => p.id === id)!;
}

/** Rótulo de la franja: «Te encuentran · Posicionamiento SEO + GEO». */
export function rotuloProducto(id: ProductoId) {
  const p = producto(id);
  return `${p.promesa} · ${p.nombre}`;
}

/** Texto alternativo de la imagen compartida, armado con lo mismo que se dibuja. */
export const ALT_IMAGEN = `Omona: ${HERO_FRASES.join(' ')} ${PRODUCTOS.map((p) => p.nombre).join(', ')}.`;

/**
 * Versión de la imagen compartida: va en su URL (`/opengraph-image/<versión>`).
 * WhatsApp, LinkedIn y X guardan la imagen por URL; si la URL no cambia, siguen
 * enseñando la vieja. Cambia con el texto de arriba y con cada despliegue
 * (el commit), así que también se renueva cuando solo cambia el dibujo.
 */
export function versionImagen(): string {
  const base = JSON.stringify([HERO_EYEBROW, HERO_FRASES, PRODUCTOS, process.env.VERCEL_GIT_COMMIT_SHA ?? '']);
  let h = 0x811c9dc5; // FNV-1a de 32 bits: sin dependencias, igual en Node y en edge
  for (let i = 0; i < base.length; i++) {
    h ^= base.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
