/**
 * Landings de solución (/soluciones/[slug]).
 *
 * Estas URLs ya reciben enlaces internos desde los artículos del blog
 * (data/geo/articles). Cada slug aquí repara los enlaces que apuntaban a él.
 * El conteo de enlaces entrantes está en `inboundLinks` — sirve para priorizar
 * qué landing construir primero.
 *
 * Los iconos se guardan como string y se resuelven en el cliente
 * (ver SolucionContent.tsx): un componente no es serializable de servidor a cliente.
 */

export interface SolucionFaq {
  q: string;
  a: string;
}

export interface Solucion {
  slug: string;
  /** Enlaces entrantes desde el blog, para priorización */
  inboundLinks: number;
  /* SEO */
  metaTitle: string;
  metaDescription: string;
  /* Hero */
  iconName: string;
  tag: string;
  title: string;
  titleBreak?: string;
  /** Answer-first: responde la pregunta del usuario en el primer párrafo */
  subtitle: string;
  heroImage: string;
  stats: { value: string; label: string }[];
  painPoints: string[];
  benefits: { iconName: string; title: string; description: string }[];
  conversation: { role: 'user' | 'assistant'; text: string }[];
  industriesLabel: string;
  industries: string[];
  ctaTitle: string;
  /** Se renderizan en la página y alimentan el JSON-LD de FAQPage */
  faqs: SolucionFaq[];
}

const CANALES = [
  'E-commerce y retail',
  'Agencias de marketing',
  'Consultoras y despachos',
  'Software y SaaS',
  'Servicios profesionales',
  'Inmobiliarias',
  'Manufactura y distribución',
  'Educación y capacitación',
];

export const SOLUCIONES: Solucion[] = [
  /* ──────────────────────────────────────────────────────────
     1. automatizacion-de-ventas — 45 enlaces entrantes
     ────────────────────────────────────────────────────────── */
  {
    slug: 'automatizacion-de-ventas',
    inboundLinks: 45,
    metaTitle: 'Automatización de Ventas por WhatsApp',
    metaDescription:
      'Automatiza tu proceso comercial en WhatsApp: respuesta inmediata, calificación de leads, agendado y seguimiento. Agente de ventas con IA para pymes en México y LATAM.',
    iconName: 'Zap',
    tag: 'automatización',
    title: 'Automatización de ventas',
    titleBreak: 'donde tus clientes ya están',
    subtitle:
      'Automatizar tus ventas significa que cada mensaje entrante recibe respuesta en segundos, el lead se califica solo, la cita se agenda sin ida y vuelta, y el seguimiento ocurre aunque nadie lo recuerde. Omona hace eso dentro de WhatsApp, el canal donde tus clientes ya te escriben.',
    heroImage: '/images/use-cases/sales.jpg',
    stats: [
      { value: '24/7', label: 'Siempre disponible' },
      { value: 'ES/EN', label: 'Detecta el idioma' },
      { value: 'Multi-CRM', label: 'Se integra a tu stack' },
      { value: 'Sin código', label: 'Configuración por chat' },
    ],
    painPoints: [
      'Los mensajes llegan fuera de horario y para el día siguiente el prospecto ya compró en otro lado',
      'Tu vendedor contesta las mismas cinco preguntas todo el día en vez de cerrar',
      'El seguimiento depende de que alguien se acuerde, y nadie se acuerda',
      'No sabes cuántas oportunidades se pierden porque nada queda registrado',
      'Cuando hay campaña, el volumen de mensajes rebasa al equipo',
      'Cada vendedor responde distinto, así que la experiencia es inconsistente',
    ],
    benefits: [
      {
        iconName: 'Clock',
        title: 'Respuesta inmediata, siempre',
        description:
          'El agente contesta apenas entra el mensaje, a cualquier hora. El prospecto no espera y no se va con quien conteste primero.',
      },
      {
        iconName: 'Filter',
        title: 'Calificación automática',
        description:
          'Detecta necesidad, presupuesto y urgencia durante la conversación, y etiqueta al lead sin que nadie llene un formulario.',
      },
      {
        iconName: 'CalendarCheck',
        title: 'Agendado sin fricción',
        description:
          'Consulta tu disponibilidad real, propone horarios y confirma la cita dentro del mismo chat.',
      },
      {
        iconName: 'RefreshCw',
        title: 'Seguimiento que no se olvida',
        description:
          'Si el prospecto no responde, el agente retoma la conversación solo. Ninguna oportunidad se enfría por descuido.',
      },
    ],
    conversation: [
      { role: 'user', text: 'Hola, vi su anuncio. ¿Cómo funciona lo que ofrecen?' },
      {
        role: 'assistant',
        text: '¡Hola! Con gusto te explico. Ayudamos a empresas a automatizar la atención comercial por WhatsApp. Para darte algo concreto y no marearte: ¿a qué se dedica tu negocio y cuántos mensajes de clientes reciben más o menos al día?',
      },
      { role: 'user', text: 'Vendemos equipo médico, nos llegan como 60 al día y no nos damos abasto' },
      {
        role: 'assistant',
        text: 'Entiendo, 60 al día es justo el punto donde el equipo empieza a dejar mensajes sin contestar. Para equipo médico lo interesante es que el agente puede responder fichas técnicas y disponibilidad sin pasar por un vendedor. ¿Te late que agendemos 20 minutos para mostrarte cómo quedaría con tu catálogo? Tengo espacio mañana a las 11 o el jueves a las 4.',
      },
    ],
    industriesLabel: 'sectores',
    industries: CANALES,
    ctaTitle: 'Automatiza tu proceso comercial esta semana',
    faqs: [
      {
        q: '¿Qué es la automatización de ventas por WhatsApp?',
        a: 'Es delegar a un agente de IA las tareas repetibles del proceso comercial que ocurren en WhatsApp: responder al instante, resolver preguntas frecuentes del catálogo, calificar al prospecto, agendar la cita y dar seguimiento. El vendedor humano entra solo cuando la conversación lo amerita.',
      },
      {
        q: '¿Reemplaza a mi equipo de ventas?',
        a: 'No. Absorbe el volumen repetitivo —preguntas de precio, horario, disponibilidad, primer filtro— y escala al humano cuando detecta intención de compra alta o una situación que requiere criterio. Tu equipo dedica su tiempo a cerrar, no a contestar lo mismo.',
      },
      {
        q: '¿Necesito la API oficial de WhatsApp Business?',
        a: 'No es obligatoria. Omona funciona conectando tu número existente mediante código QR, sin trámite con Meta. También soporta la WhatsApp Cloud API oficial si tu operación ya la usa o la necesita por volumen.',
      },
      {
        q: '¿Cuánto tarda la configuración?',
        a: 'El onboarding parte de la información que ya existe: puedes pegar la URL de tu sitio para que el agente extraiga productos y preguntas frecuentes automáticamente, subir un catálogo en PDF o Word, o configurarlo conversando. No requiere programar.',
      },
      {
        q: '¿El agente responde en español mexicano?',
        a: 'Sí. Está construido para el español de México y LATAM, con el tono comercial de la región, y detecta automáticamente si el cliente escribe en otro idioma.',
      },
      {
        q: '¿Qué pasa si el agente no sabe responder algo?',
        a: 'Escala la conversación a una persona de tu equipo y envía una notificación. El historial completo del chat queda visible para que quien entre tenga contexto y no haga repetir al cliente.',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     2. automatizacion-whatsapp — 20 enlaces entrantes
     ────────────────────────────────────────────────────────── */
  {
    slug: 'automatizacion-whatsapp',
    inboundLinks: 20,
    metaTitle: 'Automatización de WhatsApp para Empresas',
    metaDescription:
      'Conecta tu WhatsApp y deja que un agente con IA responda, califique y agende 24/7. Sin trámite con Meta, con inbox y CRM integrados.',
    iconName: 'MessageCircle',
    tag: 'whatsapp',
    title: 'Automatización de WhatsApp',
    titleBreak: 'que sí entiende de negocio',
    subtitle:
      'Automatizar WhatsApp no es poner un menú de opciones. Es conectar tu número a un agente que entiende lo que el cliente pregunta, responde con la información real de tu catálogo, agenda y escala a un humano cuando hace falta — desde el primer día, sin escribir una línea de código.',
    heroImage: '/images/use-cases/whatsapp.jpg',
    stats: [
      { value: 'QR', label: 'Conexión en minutos' },
      { value: 'Dual', label: 'QR o API oficial' },
      { value: 'Audio', label: 'Entiende notas de voz' },
      { value: 'Inbox', label: 'Todo en un lugar' },
    ],
    painPoints: [
      'Los menús de "marca 1, marca 2" frustran al cliente y no resuelven nada',
      'Tener varios números repartidos entre vendedores hace imposible dar seguimiento',
      'Las notas de voz se acumulan sin que nadie las escuche',
      'Al cambiar de vendedor, el historial de la conversación se pierde',
      'Contestar fuera de horario significa contestar desde el celular personal',
      'No hay forma de medir cuántas conversaciones terminan en venta',
    ],
    benefits: [
      {
        iconName: 'QrCode',
        title: 'Conecta escaneando un QR',
        description:
          'Vinculas tu número actual como si fuera WhatsApp Web. Sin solicitud a Meta, sin esperar aprobación, sin cambiar de número.',
      },
      {
        iconName: 'Mic',
        title: 'Entiende notas de voz',
        description:
          'Transcribe los audios entrantes y los responde como cualquier mensaje. En México y LATAM la nota de voz es el formato dominante.',
      },
      {
        iconName: 'Inbox',
        title: 'Inbox unificado',
        description:
          'Todas las conversaciones en un solo tablero, con búsqueda, etiquetas y fijado. El historial vive en la empresa, no en un celular.',
      },
      {
        iconName: 'UserCheck',
        title: 'Handoff con contexto',
        description:
          'Cuando el agente escala, la persona que entra ve la conversación completa y continúa sin pedirle al cliente que repita.',
      },
    ],
    conversation: [
      { role: 'user', text: '[nota de voz] Oye, ¿ustedes manejan facturación? Y si compro 20 piezas, ¿me hacen precio?' },
      {
        role: 'assistant',
        text: 'Sí, facturamos con complemento de pago y CFDI 4.0 sin costo extra. Y sí, a partir de 10 piezas aplica precio de mayoreo. Para 20 piezas te queda en $840 por unidad en lugar de $980. ¿Te preparo la cotización formal?',
      },
      { role: 'user', text: 'Sí porfa, y ¿cuánto tardan en entregar en Guadalajara?' },
      {
        role: 'assistant',
        text: 'A Guadalajara son 2 a 3 días hábiles con envío incluido en compras de mayoreo. Te mando la cotización con esos tiempos. ¿A qué razón social la emito?',
      },
    ],
    industriesLabel: 'sectores',
    industries: CANALES,
    ctaTitle: 'Conecta tu WhatsApp y pruébalo hoy',
    faqs: [
      {
        q: '¿Cómo conecto mi WhatsApp con Omona?',
        a: 'Escaneando un código QR desde el panel, igual que vinculas WhatsApp Web. Conservas tu número actual y no necesitas hacer ningún trámite con Meta. Si prefieres el canal oficial, Omona también soporta la WhatsApp Cloud API.',
      },
      {
        q: '¿Puedo usar mi número actual o necesito uno nuevo?',
        a: 'Puedes usar el número que ya tienes. Es el mismo con el que tus clientes te escriben hoy, así que no pierdes las conversaciones ni tienes que avisar de un cambio.',
      },
      {
        q: '¿El agente entiende notas de voz?',
        a: 'Sí. Las transcribe automáticamente y las responde como si fueran texto. Es una función importante en México y LATAM, donde buena parte de los clientes prefiere mandar audio antes que escribir.',
      },
      {
        q: '¿En qué se diferencia de un chatbot de menús?',
        a: 'Un chatbot de menús obliga al cliente a elegir entre opciones predefinidas y falla en cuanto la pregunta se sale del guion. Omona interpreta lenguaje natural, consulta la información real de tu negocio y sostiene una conversación comercial completa.',
      },
      {
        q: '¿Qué pasa con las conversaciones cuando cambia el vendedor?',
        a: 'El historial vive en el inbox de la empresa, no en el celular de una persona. Cualquier miembro del equipo con acceso puede retomar una conversación con todo el contexto.',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     3. integracion-con-crm — 18 enlaces entrantes
     ────────────────────────────────────────────────────────── */
  {
    slug: 'integracion-con-crm',
    inboundLinks: 18,
    metaTitle: 'Integración de WhatsApp con tu CRM',
    metaDescription:
      'Sincroniza las conversaciones de WhatsApp con tu CRM: contactos, oportunidades y actividades actualizadas sin captura manual.',
    iconName: 'Database',
    tag: 'integraciones',
    title: 'Integración con tu CRM',
    titleBreak: 'sin captura manual',
    subtitle:
      'El problema no es que falte CRM: es que lo que pasa en WhatsApp nunca llega ahí. Omona convierte cada conversación en datos estructurados —contacto, empresa, presupuesto, etapa— y los sincroniza con tu CRM automáticamente, para que el pipeline refleje la realidad sin que nadie capture nada.',
    heroImage: '/images/use-cases/crm.jpg',
    stats: [
      { value: 'Auto', label: 'Sin captura manual' },
      { value: 'Webhooks', label: 'Eventos firmados' },
      { value: 'CSV', label: 'Exportación libre' },
      { value: 'API', label: 'Integración abierta' },
    ],
    painPoints: [
      'Las conversaciones de WhatsApp nunca llegan al CRM, así que el pipeline miente',
      'Los vendedores capturan a mano y capturan tarde, o de plano no capturan',
      'Un lead escribe por WhatsApp y ya existía en el CRM, pero nadie lo nota',
      'Los reportes de dirección se arman sobre datos incompletos',
      'Cuando alguien renuncia, sus conversaciones se van con él',
      'Marketing no sabe qué campaña generó qué conversación',
    ],
    benefits: [
      {
        iconName: 'Database',
        title: 'Contactos y oportunidades al día',
        description:
          'Cada conversación crea o actualiza el registro correspondiente, con los datos que el agente extrajo del propio chat.',
      },
      {
        iconName: 'Webhook',
        title: 'Webhooks firmados',
        description:
          'Notificaciones de eventos con firma HMAC para integrarte con cualquier sistema propio sin depender de un conector prearmado.',
      },
      {
        iconName: 'FileDown',
        title: 'Exportación sin candado',
        description:
          'Descarga leads y conversaciones en CSV cuando quieras. Tus datos son tuyos y salen en formato abierto.',
      },
      {
        iconName: 'GitMerge',
        title: 'Sin duplicados',
        description:
          'Reconoce al contacto que ya existía y suma la conversación a su historial en lugar de crear un registro paralelo.',
      },
    ],
    conversation: [
      { role: 'user', text: 'Buenas, soy Andrea Ruiz de Grupo Ferretero del Norte, quiero cotizar' },
      {
        role: 'assistant',
        text: 'Mucho gusto Andrea. Con gusto preparo tu cotización. ¿Qué producto necesitas y para qué volumen aproximado?',
      },
      { role: 'user', text: 'Necesitamos como 200 unidades, es para surtir 4 sucursales. El presupuesto anda por los 300 mil' },
      {
        role: 'assistant',
        text: 'Perfecto, con ese volumen entras en precio de distribuidor. Te preparo la propuesta para las 4 sucursales y te la mando hoy mismo. ¿Te sirve que agendemos una llamada esta semana para revisarla juntos?',
      },
    ],
    industriesLabel: 'sectores',
    industries: CANALES,
    ctaTitle: 'Haz que tu CRM refleje lo que pasa en WhatsApp',
    faqs: [
      {
        q: '¿Con qué CRMs se integra Omona?',
        a: 'Omona incluye su propio CRM con inbox, pipeline de leads y analítica, y expone webhooks firmados con HMAC más exportación en CSV para conectarse con sistemas externos. Si usas un CRM específico, esa es la vía de integración.',
      },
      {
        q: '¿Qué información extrae de la conversación?',
        a: 'Nombre, correo, empresa, presupuesto y horizonte de tiempo, más la etapa del lead. Los extrae de lo que el prospecto dice de forma natural en el chat, sin obligarlo a llenar un formulario.',
      },
      {
        q: '¿Se duplican los contactos que ya tenía?',
        a: 'No. Cuando el contacto ya existe, la conversación se suma a su historial en lugar de generar un registro nuevo.',
      },
      {
        q: '¿Puedo sacar mis datos si dejo de usar Omona?',
        a: 'Sí. Leads y conversaciones se exportan en CSV en cualquier momento, sin trámite ni restricción.',
      },
      {
        q: '¿Cómo funcionan los webhooks?',
        a: 'Omona envía notificaciones de eventos a la URL que configures, firmadas con HMAC para que puedas verificar que el mensaje proviene realmente de Omona y no fue alterado en el camino.',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     4. calificacion-leads-b2b — 16 enlaces entrantes
     ────────────────────────────────────────────────────────── */
  {
    slug: 'calificacion-leads-b2b',
    inboundLinks: 16,
    metaTitle: 'Calificación de Leads B2B por WhatsApp',
    metaDescription:
      'Califica leads B2B automáticamente en WhatsApp: necesidad, presupuesto y autoridad detectados en la conversación, sin formularios.',
    iconName: 'Filter',
    tag: 'calificación',
    title: 'Calificación de leads B2B',
    titleBreak: 'sin formularios',
    subtitle:
      'Calificar un lead B2B por WhatsApp significa averiguar si tiene necesidad real, presupuesto y capacidad de decidir — antes de que un vendedor invierta una hora. Omona lo hace durante la conversación, con preguntas que suenan naturales, y te entrega el lead ya etiquetado y priorizado.',
    heroImage: '/images/use-cases/qualify.jpg',
    stats: [
      { value: 'Auto', label: 'Sin formularios' },
      { value: 'Pipeline', label: 'Etapas visuales' },
      { value: 'Scoring', label: 'Prioriza solo' },
      { value: 'Alertas', label: 'Avisa al equipo' },
    ],
    painPoints: [
      'Tus vendedores dedican horas a prospectos que nunca iban a comprar',
      'Los formularios de calificación espantan al prospecto antes de conocerlo',
      'Los leads de campañas llegan sin filtrar y en volumen',
      'No hay criterio uniforme: cada vendedor califica distinto',
      'Los buenos leads se enfrían esperando en la fila detrás de los malos',
      'Nadie sabe qué campaña trae prospectos con presupuesto real',
    ],
    benefits: [
      {
        iconName: 'Filter',
        title: 'Califica conversando',
        description:
          'Detecta necesidad, presupuesto, urgencia y autoridad a partir de lo que el prospecto cuenta, sin cuestionarios que lo ahuyenten.',
      },
      {
        iconName: 'TrendingUp',
        title: 'Prioriza automáticamente',
        description:
          'Ordena el pipeline por probabilidad real, para que tu equipo empiece por donde hay dinero.',
      },
      {
        iconName: 'Bell',
        title: 'Alerta en caliente',
        description:
          'Cuando aparece intención de compra alta, notifica al equipo en el momento, no al día siguiente.',
      },
      {
        iconName: 'Layers',
        title: 'Pipeline visual',
        description:
          'Tablero con etapas —nuevo, calificado, demo, convertido, perdido— que refleja el estado real de cada oportunidad.',
      },
    ],
    conversation: [
      { role: 'user', text: 'Hola, me interesa saber más de lo que hacen' },
      {
        role: 'assistant',
        text: '¡Hola! Claro. Para orientarte bien y no hacerte perder tiempo: ¿qué problema estás tratando de resolver ahorita en tu operación?',
      },
      { role: 'user', text: 'Somos 12 vendedores y se nos caen los seguimientos, perdemos deals por eso' },
      {
        role: 'assistant',
        text: 'Ese es exactamente el escenario donde más se nota el cambio. Con 12 vendedores el problema no es esfuerzo, es que el seguimiento manual no escala. ¿Tú tomas la decisión sobre herramientas para el equipo comercial, o hay alguien más que deba estar en la conversación?',
      },
    ],
    industriesLabel: 'sectores',
    industries: CANALES,
    ctaTitle: 'Deja de perseguir leads que no van a comprar',
    faqs: [
      {
        q: '¿Cómo califica Omona un lead B2B sin formularios?',
        a: 'Analiza la conversación en tiempo real y extrae señales de necesidad, presupuesto, urgencia y autoridad de decisión a partir de lo que el prospecto dice espontáneamente. Cuando falta información clave, la pregunta de forma natural dentro del flujo del chat.',
      },
      {
        q: '¿Qué criterios usa para decidir si un lead es bueno?',
        a: 'Los que tú configures. La calificación parte del perfil de cliente ideal, los productos y la estrategia comercial que defines durante el onboarding, así que el criterio es el de tu negocio y no uno genérico.',
      },
      {
        q: '¿Qué pasa cuando detecta un lead con alta intención?',
        a: 'Notifica al equipo en ese momento y escala la conversación a una persona, con el historial completo para que pueda entrar directo al punto.',
      },
      {
        q: '¿Sirve para leads que vienen de campañas de Meta o Google?',
        a: 'Sí, y es uno de sus casos de uso principales. Los leads de campañas suelen llegar en volumen y sin filtrar; el agente los atiende a todos al instante y separa los que valen la pena de los que no.',
      },
      {
        q: '¿Puedo ver por qué calificó a un lead de cierta forma?',
        a: 'Sí. La conversación completa queda en el inbox junto al registro del lead, así que puedes revisar exactamente en qué se basó la clasificación.',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     5. conversion-de-leads — 7 enlaces entrantes
     ────────────────────────────────────────────────────────── */
  {
    slug: 'conversion-de-leads',
    inboundLinks: 7,
    metaTitle: 'Conversión de Leads en WhatsApp',
    metaDescription:
      'Convierte más leads en WhatsApp: respuesta en segundos, seguimiento automático y agendado sin fricción. Deja de perder oportunidades por lentitud.',
    iconName: 'TrendingUp',
    tag: 'conversión',
    title: 'Conversión de leads',
    titleBreak: 'que no se enfrían',
    subtitle:
      'La mayoría de los leads no se pierden por precio: se pierden por tiempo. Se enfrían mientras esperan respuesta, o se caen porque nadie dio seguimiento al tercer día. Omona ataca las dos causas: contesta en segundos y retoma solo las conversaciones que quedaron abiertas.',
    heroImage: '/images/use-cases/convert.jpg',
    stats: [
      { value: 'Segundos', label: 'Tiempo de respuesta' },
      { value: 'Auto', label: 'Follow-up sin recordar' },
      { value: 'Agenda', label: 'Cita en el mismo chat' },
      { value: 'Métricas', label: 'Ves dónde se cae' },
    ],
    painPoints: [
      'El prospecto escribe, nadie contesta en el momento y se va con la competencia',
      'La conversación queda abierta y nadie la retoma nunca',
      'Agendar una llamada toma cinco mensajes de ida y vuelta',
      'No sabes en qué punto del proceso se te caen los prospectos',
      'El seguimiento depende del ánimo y la memoria de cada vendedor',
      'Los leads de fin de semana se atienden hasta el lunes, si bien va',
    ],
    benefits: [
      {
        iconName: 'Zap',
        title: 'Contesta antes de que se enfríe',
        description:
          'Respuesta inmediata a cualquier hora. La ventana en que un prospecto está receptivo es corta y no espera al horario de oficina.',
      },
      {
        iconName: 'RefreshCw',
        title: 'Follow-up automático',
        description:
          'Si la conversación quedó sin respuesta, el agente la retoma solo con un mensaje pertinente al contexto.',
      },
      {
        iconName: 'CalendarCheck',
        title: 'Agenda en el mismo chat',
        description:
          'Propone horarios reales de tu calendario y cierra la cita ahí mismo, sin mandar al prospecto a otra herramienta.',
      },
      {
        iconName: 'BarChart3',
        title: 'Analítica del embudo',
        description:
          'Conversaciones por día, tiempo de respuesta, tasa de escalamiento y evolución del scoring, para ver dónde se rompe el proceso.',
      },
    ],
    conversation: [
      { role: 'user', text: 'Hola, ¿siguen ofreciendo el servicio? Escribí hace rato pero no me contestaron' },
      {
        role: 'assistant',
        text: '¡Hola! Sí, aquí estamos y con gusto te atiendo ahora mismo. Perdón por la espera. Cuéntame qué necesitas y lo resolvemos de una vez.',
      },
      { role: 'user', text: 'Quiero saber precios pero ya casi me decidía por otra opción' },
      {
        role: 'assistant',
        text: 'Te entiendo, y te agradezco que preguntes antes de decidir. Nuestros planes arrancan en $499 MXN al mes con todo incluido y sin contrato forzoso. Si quieres, en 15 minutos te muestro cómo quedaría con tu caso concreto y ya con eso comparas peras con peras. ¿Te acomoda hoy a las 5?',
      },
    ],
    industriesLabel: 'sectores',
    industries: CANALES,
    ctaTitle: 'Convierte los leads que hoy se te enfrían',
    faqs: [
      {
        q: '¿Por qué se pierden los leads en WhatsApp?',
        a: 'Por dos razones sobre todo: la respuesta llega tarde, cuando el prospecto ya buscó en otro lado, y el seguimiento no ocurre porque depende de que alguien lo recuerde manualmente. Ambas son problemas de proceso, no de precio ni de producto.',
      },
      {
        q: '¿Cómo funciona el seguimiento automático?',
        a: 'Cuando una conversación queda sin respuesta del prospecto, el agente la retoma pasado un tiempo configurable con un mensaje pertinente al contexto de lo que se estaba hablando, no un recordatorio genérico.',
      },
      {
        q: '¿El agente puede agendar en mi calendario real?',
        a: 'Sí. Consulta tu disponibilidad según las reglas que definas, propone horarios concretos, confirma la cita y envía recordatorio por WhatsApp antes del evento.',
      },
      {
        q: '¿Qué métricas puedo ver?',
        a: 'Conversaciones por día, tiempo de respuesta, tasa de escalamiento a humano y la evolución del scoring de leads, dentro del panel de analítica.',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     6. agente-ia-ventas — 6 enlaces entrantes
     ────────────────────────────────────────────────────────── */
  {
    slug: 'agente-ia-ventas',
    inboundLinks: 6,
    metaTitle: 'Agente de Ventas con IA para WhatsApp',
    metaDescription:
      'Un agente de ventas con IA que responde, califica, agenda y escala a un humano cuando hace falta. Para pymes de México y LATAM que venden por WhatsApp.',
    iconName: 'Bot',
    tag: 'agente ia',
    title: 'Agente de ventas con IA',
    titleBreak: 'entrenado con tu negocio',
    subtitle:
      'Un agente de ventas con IA no es un chatbot con respuestas prearmadas: es un sistema que conoce tu catálogo, tu forma de vender y tus políticas, sostiene una conversación comercial completa y sabe cuándo pasar la batuta a una persona. Omona es eso, dentro de WhatsApp.',
    heroImage: '/images/use-cases/agent.jpg',
    stats: [
      { value: 'Tu catálogo', label: 'Aprende de tu negocio' },
      { value: 'Personalidad', label: 'Configurable' },
      { value: 'Handoff', label: 'Sabe cuándo salirse' },
      { value: 'Horarios', label: 'Respeta tus reglas' },
    ],
    painPoints: [
      'Los chatbots genéricos contestan cosas que no aplican a tu negocio',
      'Entrenar a un vendedor nuevo toma meses y se va con lo aprendido',
      'Cada quien improvisa el discurso de venta y el resultado es disparejo',
      'Cuando el bot no sabe, deja al cliente colgado en vez de escalar',
      'Los bots suenan a robot y el cliente lo nota de inmediato',
      'Fuera de horario nadie atiende, aunque el cliente esté listo para comprar',
    ],
    benefits: [
      {
        iconName: 'BookOpen',
        title: 'Aprende de tu catálogo',
        description:
          'Se configura con tu sitio web, tus documentos en PDF o Word, o conversando. Responde con tu información real, no con generalidades.',
      },
      {
        iconName: 'Sparkles',
        title: 'Personalidad ajustable',
        description:
          'Defines el tono, qué tanto empuja, qué puede prometer y qué no. La conversación suena a tu marca.',
      },
      {
        iconName: 'UserCheck',
        title: 'Sabe cuándo escalar',
        description:
          'Detecta cuándo una conversación necesita criterio humano y la pasa con todo el contexto, en lugar de improvisar.',
      },
      {
        iconName: 'Clock',
        title: 'Respeta tus horarios',
        description:
          'Fuera de horario responde con el mensaje que tú definas, sin dejar al cliente en el vacío ni prometer lo que no puedes cumplir.',
      },
    ],
    conversation: [
      { role: 'user', text: '¿Ustedes trabajan con proyectos chicos o nada más con empresas grandes?' },
      {
        role: 'assistant',
        text: 'Trabajamos con ambos. De hecho, buena parte de nuestros clientes son equipos de menos de 20 personas. ¿De qué tamaño es tu operación?',
      },
      { role: 'user', text: 'Somos 6, apenas vamos empezando. ¿No les resulta muy chico?' },
      {
        role: 'assistant',
        text: 'Para nada, seis personas es un tamaño ideal para arrancar: el proceso todavía es flexible y los cambios se notan rápido. Te soy honesto en una cosa: si hoy reciben pocos mensajes al día, quizá te convenga esperar. ¿Más o menos cuántas conversaciones de clientes manejan por día?',
      },
    ],
    industriesLabel: 'sectores',
    industries: CANALES,
    ctaTitle: 'Prueba el agente con tu propio catálogo',
    faqs: [
      {
        q: '¿Qué diferencia hay entre un agente de ventas con IA y un chatbot?',
        a: 'Un chatbot sigue un guion de reglas y se rompe cuando la pregunta se sale de lo previsto. Un agente con IA interpreta lenguaje natural, razona sobre la información de tu negocio, decide qué hacer en cada turno de la conversación y ejecuta acciones como agendar o escalar a un humano.',
      },
      {
        q: '¿Cómo aprende el agente sobre mi negocio?',
        a: 'De tres formas, según lo que te resulte más cómodo: pegando la URL de tu sitio para que extraiga productos y preguntas frecuentes, subiendo catálogos en PDF, Word o texto, o configurándolo manualmente por chat.',
      },
      {
        q: '¿Puedo controlar qué dice y qué no?',
        a: 'Sí. Configuras personalidad, tono, estrategia de venta, horarios de atención y las condiciones bajo las cuales debe escalar a una persona.',
      },
      {
        q: '¿Cómo sabe cuándo pasar la conversación a un humano?',
        a: 'Detecta señales como intención de compra alta, molestia del cliente o preguntas que salen de su alcance configurado. En esos casos notifica al equipo y entrega la conversación con el historial completo.',
      },
      {
        q: '¿En qué idiomas conversa?',
        a: 'Está construido para español de México y LATAM, y detecta automáticamente cuando el cliente escribe en otro idioma para responder en el mismo.',
      },
    ],
  },
];

export function getSolucion(slug: string): Solucion | undefined {
  return SOLUCIONES.find((s) => s.slug === slug);
}

export function getAllSoluciones(): Solucion[] {
  return SOLUCIONES;
}
