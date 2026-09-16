/**
 * Destino único del CTA principal de marketing.
 *
 * Vive aquí y no inline en cada componente porque son seis puntos de entrada
 * —héroe, nav de escritorio, nav móvil, CTA de cierre, el flotante y las
 * páginas de servicio— y cuando el botón decía "Empezar gratis" apuntando a
 * /signup, cambiar la oferta significaba encontrarlos todos.
 *
 * El mensaje precargado hace de filtro. Pide las tres cosas sin las cuales no
 * se puede contestar nada útil: a qué se dedica, qué se le está cayendo y
 * cuánto volumen maneja. Un "Hola, quiero información" obliga a gastar la
 * primera respuesta en preguntarlas.
 *
 * Está escrito como lo escribiría el cliente, no como lo pediría un
 * consultor: "qué se me está cayendo", no "describe tu proceso comercial".
 */
export const WHATSAPP_NUMERO = '529849800629';

export const CTA_PROYECTO = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(
  [
    'Hola, te escribo por lo de WhatsApp.',
    '',
    'A qué se dedica mi negocio:',
    'Qué se me está cayendo:',
    'Cuántos mensajes me llegan al día:',
  ].join('\n'),
)}`;

/**
 * El nombre anterior, cuando la oferta era un diagnóstico de 30 minutos sobre
 * el CRM del cliente. Se conserva como alias para no romper los componentes
 * retirados que siguen en el repo (LandingHero, LandingCTA, FloatingCTA).
 *
 * @deprecated Usa `CTA_PROYECTO`.
 */
export const CTA_DIAGNOSTICO = CTA_PROYECTO;
