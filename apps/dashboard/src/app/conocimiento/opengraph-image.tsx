import { metadatosImagen, ogPortada } from '@/lib/og';

/**
 * Imagen al compartir /conocimiento: la tarjeta de la portada, dibujada con
 * lib/portada.ts y con la versión en la URL. Se actualiza sola; no lleva texto propio.
 */
export const generateImageMetadata = metadatosImagen;

export default function Image() {
  return ogPortada();
}
