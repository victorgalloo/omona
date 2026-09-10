/**
 * Destino único del CTA principal de marketing.
 *
 * Vive aquí y no inline en cada componente porque son cinco puntos de entrada
 * —héroe, nav de escritorio, nav móvil, CTA de cierre y el flotante— y cuando
 * el botón decía "Empezar gratis" apuntando a /signup, cambiar la oferta
 * significaba encontrarlos todos. La oferta ya no es autoservicio: se agenda un
 * diagnóstico, y el canal es el mismo WhatsApp que vendemos.
 */
export const WHATSAPP_NUMERO = '529849800629';

export const CTA_DIAGNOSTICO = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(
  'Hola, quiero agendar el diagnóstico de 30 minutos',
)}`;
