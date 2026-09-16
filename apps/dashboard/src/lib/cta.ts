/**
 * Destino único del CTA principal de marketing.
 *
 * Vive aquí y no inline en cada componente porque son seis puntos de entrada
 * —héroe, nav de escritorio, nav móvil, CTA de cierre, el flotante y el cierre
 * de los 74 artículos del corpus— y cuando el botón decía "Empezar gratis"
 * apuntando a /signup, cambiar la oferta significaba encontrarlos todos.
 *
 * El formulario de aplicación es el destino que toca, pero mientras no exista
 * el botón manda a WhatsApp. Un placeholder que no lleva a ningún lado es peor
 * que un canal con más fricción.
 *
 * El mensaje precargado hace de filtro: pide las cuatro cosas sin las cuales no
 * se puede contestar nada útil. Un "Hola, quiero información" obliga a gastar
 * la primera respuesta preguntándolas.
 */
export const WHATSAPP_NUMERO = '524779083304';

export const CTA_PROYECTO = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(
  [
    'Hola, quiero aplicar.',
    '',
    'A qué se dedica la empresa:',
    'Qué etapa se me está cayendo (prospección, seguimiento o cierre):',
    'Qué sistemas usamos:',
    'Para cuándo lo necesito:',
  ].join('\n'),
)}`;

/**
 * El nombre anterior, cuando la oferta era un diagnóstico de 30 minutos.
 * Se conserva como alias para no romper los componentes retirados que siguen
 * en el repo (LandingHero, LandingCTA, FloatingCTA).
 *
 * @deprecated Usa `CTA_PROYECTO`.
 */
export const CTA_DIAGNOSTICO = CTA_PROYECTO;
