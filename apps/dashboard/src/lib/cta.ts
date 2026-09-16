/**
 * Destino único del CTA principal de marketing.
 *
 * Vive aquí y no inline en cada componente porque son seis puntos de entrada
 * —héroe, nav de escritorio, nav móvil, CTA de cierre, el flotante y las
 * páginas de servicio— y cuando el botón decía "Empezar gratis" apuntando a
 * /signup, cambiar la oferta significaba encontrarlos todos.
 *
 * Ahora la entrada es una aplicación, no una conversación. El motivo no es
 * capturar más datos: es que se toman pocos proyectos a la vez y no todos son
 * resolubles. Cinco preguntas contestadas por escrito dicen si tiene caso
 * hablar, y le ahorran una hora a quien no encaja. WhatsApp tenía menos
 * fricción, pero devolvía "Hola, quiero información" y obligaba a gastar la
 * primera respuesta preguntando lo básico.
 */

/** Sigue siendo el canal de soporte y el que declara el JSON-LD. */
export const WHATSAPP_NUMERO = '529849800629';

/**
 * ⚠️ PLACEHOLDER — sustituir por el formulario real antes de publicar.
 *
 * Las cinco preguntas que debe hacer, en este orden:
 *   1. A qué se dedica la empresa y cómo vende hoy.
 *   2. Qué etapa se está cayendo: prospección, seguimiento o cierre.
 *   3. Qué sistemas usa: CRM, herramientas de prospección, dónde viven las
 *      conversaciones.
 *   4. Quién decide del lado de la empresa.
 *   5. Para cuándo lo necesita.
 */
export const TYPEFORM_URL = 'https://form.typeform.com/to/REEMPLAZAR';

export const CTA_PROYECTO = TYPEFORM_URL;

/**
 * El nombre anterior, cuando la oferta era un diagnóstico de 30 minutos.
 * Se conserva como alias para no romper los componentes retirados que siguen
 * en el repo (LandingHero, LandingCTA, FloatingCTA).
 *
 * @deprecated Usa `CTA_PROYECTO`.
 */
export const CTA_DIAGNOSTICO = CTA_PROYECTO;
