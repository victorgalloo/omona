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
 * Son CINCO preguntas y están numeradas porque el copy de la página promete
 * cinco. Llevaba cuatro: quien llegaba contaba y la primera impresión era que
 * el sitio no cuadra con lo que hace.
 *
 * El mensaje precargado hace de filtro: pide las cinco cosas sin las cuales no
 * se puede contestar nada útil. Un "Hola, quiero información" obliga a gastar
 * la primera respuesta preguntándolas.
 */
export const WHATSAPP_NUMERO = '524779083304';

export const CTA_PROYECTO = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(
  [
    'Hola, quiero revisar si Omona aplica para mi proceso.',
    '',
    '1. Qué vende la empresa:',
    '2. A quién le vende:',
    '3. Dónde se pierden oportunidades (prospección, seguimiento o cierre):',
    '4. Qué sistemas usan hoy:',
    '5. Para cuándo necesitan resolverlo:',
  ].join('\n'),
)}`;

/**
 * ⚠️ PLACEHOLDER — sustituir por tu enlace real de agenda (Cal.com, Calendly,
 * Google Calendar appointments) antes de publicar el recorrido.
 *
 * Es el destino del pop-up que cierra /demo. Mientras sea este valor, el
 * botón "Agendar una llamada" no lleva a ningún lado — igual que pasó con
 * TYPEFORM_URL, y por eso vive aquí arriba y no escondido en un componente.
 */
export const AGENDA_URL = 'https://cal.com/REEMPLAZAR';

/**
 * El nombre anterior, cuando la oferta era un diagnóstico de 30 minutos.
 * Se conserva como alias para no romper los componentes retirados que siguen
 * en el repo (LandingHero, LandingCTA, FloatingCTA).
 *
 * @deprecated Usa `CTA_PROYECTO`.
 */
export const CTA_DIAGNOSTICO = CTA_PROYECTO;
