/**
 * Destino único del CTA principal de marketing.
 *
 * Vive aquí y no inline en cada componente porque son seis puntos de entrada
 * —héroe, nav de escritorio, nav móvil, CTA de cierre, el flotante y las
 * páginas de servicio— y cuando el botón decía "Empezar gratis" apuntando a
 * /signup, cambiar la oferta significaba encontrarlos todos.
 *
 * El mensaje precargado hace de formulario de calificación. Pide las tres
 * cosas sin las cuales no se puede recomendar un siguiente paso: qué proceso
 * se quiere automatizar, contra qué sistemas, y en qué estado está hoy. Un
 * "Hola, quiero información" obliga a gastar la primera respuesta en
 * preguntarlas.
 */
export const WHATSAPP_NUMERO = '529849800629';

export const CTA_PROYECTO = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(
  [
    'Hola, quiero evaluar un proyecto.',
    '',
    'Workflow:',
    'Sistemas involucrados:',
    'Estado del proyecto:',
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
