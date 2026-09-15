import type { Testimonial } from './types';

export const es = {
  nav: {
    features: 'Ciclo',
    engine: 'Motor',
    process: '6 semanas',
    pricing: 'Cómo trabajamos',
    blog: 'Blog',
    useCases: 'Casos de uso',
    demo: 'Demo',
    login: 'Iniciar sesión',
    signup: 'Agendar diagnóstico',
  },
  hero: {
    // Estas cuatro ya no se renderizan: el héroe se quedó con titular,
    // subtítulo y un CTA para que el movimiento tenga aire. `chat` se conserva
    // porque es el texto que está horneado en el loop ChatRespondiendo
    // (apps/video); si cambia allá, cambia aquí.
    badge: 'Inteligencia comercial para equipos B2B',
    // El titular apunta al final del mes, no al chat: lo que compra un director
    // comercial no es que el bot conteste, es enterarse de lo que pasó sin
    // perseguir a nadie. La frase carga las dos mitades de abajo de la ecuación
    // de valor —resultado ya ocurrido (tiempo) y cero captura (esfuerzo)— que es
    // donde se compite de verdad; prometer más arriba lo puede firmar cualquiera.
    // El término "inteligencia comercial" vive en el subtítulo a propósito: es
    // #hero-description, que es lo que leen los motores generativos.
    tagline: 'Cerró el mes. Nadie llenó el CRM.',
    subtagline: 'Inteligencia comercial para equipos B2B que venden por WhatsApp: cada conversación entra sola al CRM, con su próxima tarea, su responsable y su fecha.',
    cta: 'Agendar diagnóstico',
    whatsapp: 'WhatsApp',
    whatsappLink: 'O pruébalo tú mismo en el demo',
    setup: 'Diagnóstico de 30 minutos · Sin costo',
    companies: 'Tu número de siempre. Sin trámite con Meta.',
    // La conversación muestra a un NEGOCIO REAL atendiendo a su cliente.
    // Antes era Omona vendiéndose a sí misma, y por eso no se entendía qué hace.
    chatContext: 'Ferretería industrial · lunes 11:40 p.m.',
    chat: [
      { role: 'user', text: '¿Tienen compresores de 5 HP? Los necesito para el jueves' },
      { role: 'agent', text: 'Sí, manejamos el de 5 HP trifásico en $18,400 + IVA, con entrega en 48 h. ¿Es para uso continuo o intermitente?' },
      { role: 'user', text: 'Continuo, es para un taller' },
      { role: 'agent', text: 'Entonces te conviene el de tanque de 300 L. Te preparo la cotización y te la mando ahorita. ¿A qué razón social la emito?' },
    ],
  },
  stats: [
    { value: 'Segundos', label: 'en contestar, a cualquier hora' },
    { value: 'Sin límite', label: 'de conversaciones a la vez' },
    { value: 'Notas de voz', label: 'las entiende y responde' },
    { value: 'Agenda sola', label: 'la cita, dentro del chat' },
  ],
  features: {
    sectionLabel: 'features_',
    heading: 'Qué hace, exactamente',
    subheading: 'No responde frases hechas: entiende la pregunta, consulta tu información y actúa.',
    crm: {
      title: 'Tu CRM, viviendo dentro de Omona',
      subtitle: 'Cada conversación que atiende el agente se convierte sola en un contacto y una oportunidad, sin que nadie capture nada a mano.',
      bullet1: 'Pipeline visual: cada lead que atiende el agente aparece como oportunidad en el tablero, con etapa y valor.',
      bullet2: 'Contactos que se llenan solos: empresa, cargo, teléfono y correo salen de lo que el cliente escribió.',
      bullet3: 'Tu equipo toma el control cuando quiere: mueve etapas, crea tareas y deja notas sobre la conversación del agente.',
      bullet4: 'Y te dice dónde se te caen: cuántas conversaciones entran, en cuánto se contestan y en qué etapa se pierden.',
    },
    items: [
      {
        title: 'Entiende lo que le preguntan',
        subtitle: 'Aunque no venga en el guion',
        description: 'Lee el mensaje completo, identifica qué necesita el cliente y responde con la información real de tu catálogo. Si le ponen una objeción, la reconoce y la contesta.',
        tech: 'razona antes de responder',
        videoAlt: 'Un cliente pregunta por un compresor a las 11:40 de la noche y el agente responde con precio y plazo de entrega.',
      },
      {
        title: 'Entiende las notas de voz',
        subtitle: 'Nadie las va a escuchar dos veces',
        description: 'Transcribe el audio que te mandan y responde a lo que realmente dijeron. No pierdes la venta por no traer audífonos.',
        tech: 'transcribe el audio',
        videoAlt: 'Una nota de voz se transcribe a texto y el agente responde a lo que el cliente pidió.',
      },
      {
        title: 'Agenda la cita él solo',
        subtitle: 'Sin ida y vuelta de mensajes',
        description: 'Cuando detecta que el cliente está listo, consulta tu disponibilidad real, propone horarios concretos y confirma la cita dentro del mismo chat.',
        tech: 'conectado a tu calendario',
        videoAlt: 'El agente ofrece tres horarios, el cliente elige uno y la cita queda marcada en el calendario.',
      },
      {
        title: 'Da seguimiento sin que se lo pidas',
        subtitle: 'La conversación no se enfría',
        description: 'Si el cliente dejó de responder, el agente retoma la conversación por su cuenta con un mensaje que tiene sentido para lo que se estaba hablando.',
        tech: 'retoma conversaciones frías',
        videoAlt: 'Pasan 24 horas sin respuesta y el agente retoma la conversación por su cuenta.',
      },
      {
        title: 'Nota cuándo llamar a un humano',
        subtitle: 'Y te pasa la conversación',
        description: 'Si el cliente se molesta, duda o pregunta algo fuera de su alcance, escala a tu equipo y avisa. Quien entre ve el historial completo.',
        tech: 'sabe cuándo salirse',
        videoAlt: 'El cliente pide un descuento, el agente escala la conversación y una persona del equipo la recibe con todo el contexto.',
      },
      {
        title: 'Te deja el CRM ya ordenado',
        subtitle: 'Tablero por etapas',
        description: 'Cada cliente aparece en un tablero con su etapa, su historial y todo lo que dijo. Y te dice en qué punto se te están cayendo.',
        tech: 'CRM y analítica incluidos',
        videoAlt: 'Una tarjeta de lead aparece en el pipeline, sus campos se llenan solos y avanza a la etapa Calificado.',
      },
    ],
  },
  howItWorks: {
    sectionLabel: 'proceso_',
    heading: 'Seis semanas, tres fases',
    subheading: 'Medimos tu punto de partida antes de automatizar nada. Sin línea base no hay forma de saber si funcionó.',
    steps: [
      { title: 'Semana 1 · Diagnóstico', detail: 'Mapeamos tu proceso y medimos la línea base' },
      { title: 'Semanas 2-5 · Piloto', detail: 'Un solo flujo en vivo, con revisión humana' },
      { title: 'Semana 6 · Corte', detail: 'Comparamos contra la línea base de la semana 1' },
      { title: 'Después · Operación', detail: 'Se amplía a más flujos, o te devolvemos el piloto' },
    ],
  },
  /**
   * El stack de la oferta: núcleo + bonos. Va junto porque el valor no está en
   * ningún módulo suelto, sino en que los cuatro ocurran sobre la misma
   * conversación — que es justo lo que no se puede comparar contra un chatbot.
   */
  offerStack: {
    sectionLabel: 'sistema_',
    heading: 'Qué se implementa',
    subheading: 'Cuatro módulos que convierten conversaciones sueltas en datos, tareas y propuestas.',
    modules: [
      {
        title: 'Captura y clasificación',
        detail: 'WhatsApp, correo y calendario entran al mismo lugar. Cada mensaje queda ligado a su empresa, su contacto y su oportunidad.',
      },
      {
        title: 'Inteligencia de conversaciones',
        detail: 'De cada charla salen necesidades, presupuesto, objeciones y próximos pasos como campos estructurados, no como un párrafo suelto.',
      },
      {
        title: 'Seguimiento que no se olvida',
        detail: 'Tarea con responsable y fecha, recordatorio antes del vencimiento y escalamiento a dirección si la oportunidad se queda quieta.',
      },
      {
        title: 'Borradores de propuesta',
        detail: 'Con tu catálogo, tus precios y tus condiciones aprobadas. Siempre pasan por revisión humana antes de salir.',
      },
    ],
    bonusLabel: 'Y además, incluido',
    bonuses: [
      'Mapa de tu proceso comercial actual',
      'Diccionario de campos del CRM',
      'Biblioteca de plantillas de seguimiento aprobadas',
      'Tablero de pipeline para dirección',
      'Auditoría de calidad de datos del CRM',
      'Acompañamiento de adopción con tu equipo',
    ],
  },
  /**
   * Las condiciones están redactadas como lo que hace falta para que el
   * resultado ocurra, no como excusas para no pagar. Es deliberado: si el
   * cliente cumple las cuatro, la garantía casi nunca se ejerce.
   */
  guarantee: {
    sectionLabel: 'garantía_',
    heading: 'Si no se cumple, te devolvemos el piloto completo',
    body: 'En la semana 1 medimos tu línea base. Si al terminar las seis semanas tu CRM no refleja el 90% de las conversaciones comerciales, y cada oportunidad abierta no tiene próxima tarea con responsable y fecha, te devolvemos el 100% de lo que pagaste por el piloto.',
    conditionsLabel: 'Lo que necesitamos de tu lado',
    conditions: [
      'Kickoff con la persona que puede aprobar procesos',
      'Accesos a WhatsApp, CRM y calendario en la semana 1',
      'Plantillas revisadas y aprobadas en 5 días hábiles o menos',
      'Un responsable designado dentro de tu equipo',
    ],
    note: 'No es letra chica: son las cuatro cosas sin las cuales el resultado no ocurre.',
  },
  useCases: {
    sectionLabel: 'use_cases_',
    heading: 'Funciona para tu negocio',
    subheading: 'Si vendes por WhatsApp, Omona vende por ti.',
    clientLabel: 'cliente →',
    items: [
      {
        tag: 'servicios',
        href: '/casos-de-uso/servicios',
        title: 'Venta de servicios',
        description: 'Agencias, consultoras, freelancers. Omona responde cotizaciones, califica al prospecto y agenda la llamada de cierre mientras tú trabajas.',
        example: '"¿Cuánto cuesta el servicio de diseño web?"',
        metrics: 'Respuesta en <1s · Cotización personalizada · Demo agendada',
      },
      {
        tag: 'salud',
        href: '/casos-de-uso/clinicas',
        title: 'Clínicas y consultorios',
        description: 'Dentistas, psicólogos, veterinarias. Omona agenda citas, envía recordatorios y responde preguntas frecuentes sobre servicios y precios.',
        example: '"¿Tienen citas disponibles para mañana?"',
        metrics: 'Agenda automática · Recordatorio 24h · Sin recepcionista',
      },
      {
        tag: 'inmobiliarias',
        href: '/casos-de-uso/bienes-raices',
        title: 'Bienes raíces',
        description: 'Desarrolladoras, corredores, inmobiliarias. Omona filtra interesados por presupuesto, zona y tipo de propiedad antes de que tu asesor intervenga.',
        example: '"Busco departamento en Polanco, máx 5M"',
        metrics: 'Lead calificado · Filtro por budget · Handoff inteligente',
      },
      {
        tag: 'educación',
        href: '/casos-de-uso/educacion',
        title: 'Escuelas y cursos',
        description: 'Universidades, bootcamps, academias. Omona responde sobre programas, costos y becas, y agenda entrevistas de admisión automáticamente.',
        example: '"¿Qué incluye la maestría en data science?"',
        metrics: 'Info de programas · Becas · Inscripción agendada',
      },
    ],
  },
  cta: {
    heading: 'Empieza por el diagnóstico',
    subheading: 'Treinta minutos. Sales con tu línea base medida y un flujo priorizado, trabajes con nosotros o no.',
    primary: 'Agendar diagnóstico',
    secondary: 'Ver el demo',
    trust: 'Y si prefieres verlo antes, habla con el agente en el demo.',
  },
  footer: {
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    demo: 'Demo',
    copyright: 'omona by anthana · made with ♥ in méxico',
  },
  pricing: {
    sectionLabel: 'precios_',
    heading: 'Simple y transparente',
    subheading: '14 días gratis en cualquier plan. Sin tarjeta de crédito. Cancela cuando quieras.',
    starter: {
      label: 'starter_',
      price: '$499',
      currency: 'MXN/mes',
      usd: '~$25 USD/mes · Para pymes que empiezan',
      cta: 'Empezar gratis 14 días',
    },
    pro: {
      label: 'pro_',
      price: '$1,499',
      currency: 'MXN/mes',
      usd: '~$75 USD/mes · Para pymes en crecimiento',
      cta: 'Empezar gratis 14 días',
      badge: 'Popular',
    },
    starterFeatures: [
      { text: 'Agente IA 24/7 para WhatsApp', included: true },
      { text: 'Respuesta en menos de 1 segundo', included: true },
      { text: 'Calificación de leads (score 0-100)', included: true },
      { text: 'CRM integrado con pipeline Kanban', included: true },
      { text: 'Historial completo de conversaciones', included: true },
      { text: 'Base de conocimiento (docs/PDF)', included: true },
      { text: 'Reportes básicos', included: true },
      { text: 'Agendamiento automático de citas', included: false },
      { text: 'Follow-up automatizado', included: false },
      { text: 'Analytics avanzados', included: false },
      { text: 'Webhooks e integraciones', included: false },
    ],
    proFeatures: [
      { text: 'Todo lo del plan Starter' },
      { text: 'Agendamiento automático de citas' },
      { text: 'Follow-up automatizado de leads' },
      { text: 'Analytics avanzados y tiempo de respuesta' },
      { text: 'Webhooks e integraciones personalizadas' },
      { text: 'Broadcast a contactos filtrados' },
      { text: 'Múltiples miembros del equipo' },
      { text: 'Soporte prioritario por WhatsApp' },
    ],
    stats: [
      { value: 'Sin límite', label: 'de conversaciones' },
      { value: '14 días', label: 'gratis' },
      { value: '0.8s', label: 'respuesta' },
      { value: 'Cancela', label: 'cuando quieras' },
    ],
    faqHeading: 'Preguntas frecuentes',
    faqs: [
      {
        q: '¿Qué incluye la prueba gratuita?',
        a: 'Acceso completo al plan que elijas durante 14 días. Sin tarjeta de crédito. Solo necesitas un correo y un número de WhatsApp. Puedes cancelar en cualquier momento.',
      },
      {
        q: '¿Puedo cambiar de plan después?',
        a: 'Sí, puedes hacer upgrade o downgrade en cualquier momento desde el dashboard. Los cambios se aplican en el siguiente ciclo de facturación.',
      },
      {
        q: '¿Necesito la API oficial de WhatsApp Business?',
        a: 'No. Omona se conecta directamente a tu WhatsApp existente mediante un código QR, sin necesidad de la API oficial de Meta (que requiere aprobación y tiene costos por mensaje). Setup en menos de 5 minutos.',
      },
      {
        q: '¿En qué países está disponible?',
        a: 'Omona funciona en México, Colombia, Argentina, Chile, Perú y el resto de LATAM. Está optimizado para el mercado hispanohablante con precios en MXN, COP, ARS y otras monedas locales.',
      },
    ],
    bottomCta: {
      text: '¿Tienes dudas? Escríbenos por WhatsApp.',
      primary: 'Empezar gratis',
      secondary: 'Hablar con ventas',
    },
  },
  blog: {
    sectionLabel: 'blog_',
    heading: 'Recursos',
    subheading: 'Guías y estrategias para vender más por WhatsApp con inteligencia artificial.',
    readTime: 'min',
    by: 'Omona',
    relatedPosts: 'más artículos_',
    backToBlog: 'blog',
    backToHome: 'Volver al inicio',
    cta: {
      heading: 'Empieza gratis hoy',
      subheading: '14 días de prueba gratuita. Sin tarjeta de crédito. Setup en 5 minutos.',
      primary: 'Empezar gratis',
      secondary: 'Ver demo',
    },
  },
  useCaseLayout: {
    backLabel: 'Casos de uso',
    heroCta: 'Empezar gratis',
    heroDemo: 'Ver demo',
    painMono: 'sin_omona_',
    painTitle: 'El problema que conoces',
    painSubtitle: 'Cada mensaje sin responder es un cliente que se fue con la competencia.',
    benefitsMono: 'con_omona_',
    benefitsTitle: 'La solución que necesitas',
    demoMono: 'live_demo_',
    demoTitle: 'Así se ve en acción',
    demoSubtitle: 'Una conversación real entre un prospecto y Omona.',
    idealTitle: 'Ideal para',
    ctaSubtitle: '14 días gratis · Sin tarjeta de crédito · Configura en 5 minutos',
    ctaPrimary: 'Empezar gratis',
    ctaSecondary: 'Hablar con ventas',
    inputPlaceholder: 'Escribe un mensaje...',
    footer: {
      login: 'Iniciar sesión',
      signup: 'Registrarse',
      demo: 'Demo',
    },
  },
  dashboard: {
    connected: 'Conectado',
    upgradeNow: 'Actualizar a Pro',
    trialBanner: (days: number) => `Prueba gratuita: ${days} días restantes`,
    trialUrgent: (days: number) => `Tu prueba gratuita termina en ${days} día${days === 1 ? '' : 's'} — Actualiza ahora`,
    trialTooltip: (days: number) => `${days} días restantes — Actualizar`,
    freePlan: 'Plan Gratis',
    daysLeft: (days: number) => `${days}d restantes`,
    themeToggle: 'Cambiar tema',
    signOutConfirm: '¿Cerrar sesión?',
    signOut: 'Cerrar sesión',
    sections: {
      monitor: 'Monitorear',
      configure: 'Configurar',
      configuration: 'Configuración',
    },
    items: {
      calendar: 'Calendario',
      tests: 'Pruebas',
    },
    breadcrumbs: {
      '/inbox': 'Inbox',
      '/leads': 'Leads',
      '/leads/pipeline': 'Pipeline',
      '/handoff': 'Handoff',
      '/analytics': 'Analytics',
      '/calendar': 'Calendario',
      '/broadcast': 'Broadcasts',
      '/settings': 'Settings',
      '/test': 'Pruebas',
    } as Record<string, string>,
    language: 'Idioma',
  },
  problems: {
    sectionLabel: 'problemas_',
    // Páginas nombradas con la frase que el dueño del negocio diría en voz alta,
    // no con el nombre de la función que la resuelve. Es la columna "Problems"
    // que ManyChat tiene en su footer, y es superficie de búsqueda pagada y
    // orgánica: la gente busca su problema, no nuestra categoría.
    items: [
      {
        slug: 'no-alcanzo-a-contestar',
        short: 'No alcanzo a contestar',
        title: 'No alcanzas a contestar',
        titleBreak: 'y ahí se va la venta',
        subtitle: 'Cada mensaje que tarda en contestarse es un cliente que ya le está escribiendo a otro. No es falta de ganas: es que no hay manos.',
        video: 'chat-respondiendo',
        videoAlt: 'Un cliente pregunta por un compresor a las 11:40 de la noche y el agente responde con precio y plazo de entrega.',
        metaTitle: 'No alcanzo a contestar los WhatsApp de mi negocio | Omona',
        metaDescription: 'Si tardas en contestar, el cliente ya le escribió a otro. Omona responde cada WhatsApp en segundos con la información real de tu catálogo. Prueba gratis 14 días.',
        pains: [
          'Llegan veinte mensajes juntos y contestas los que alcanzas.',
          'El de la mañana lo ves en la tarde y ya no responde.',
          'Contestas manejando, comiendo, en la junta.',
          'Y aun así sientes que vas atrás.',
        ],
        answers: [
          {
            title: 'Contesta todos, al mismo tiempo',
            body: 'No hay fila. Si llegan veinte mensajes juntos, los veinte reciben respuesta en segundos, cada uno con lo que preguntó.',
          },
          {
            title: 'Con tu información, no con frases hechas',
            body: 'Le cargas tu catálogo, tus precios y tus preguntas frecuentes. De ahí saca lo que responde, así que cotiza como cotizarías tú.',
          },
          {
            title: 'Te avisa solo cuando te necesita',
            body: 'Si el cliente pide algo que el agente no puede autorizar, escala la conversación y te la pasa con el historial completo.',
          },
        ],
      },
      {
        slug: 'se-me-enfrian-los-clientes',
        short: 'Se me enfrían los clientes',
        title: 'Preguntaron, cotizaste',
        titleBreak: 'y nunca volviste a saber',
        subtitle: 'El seguimiento es lo primero que se cae cuando hay trabajo. Y es justo donde estaba el dinero.',
        video: 'seguimiento-automatico',
        videoAlt: 'Pasan 24 horas sin respuesta y el agente retoma la conversación por su cuenta.',
        metaTitle: 'Se me enfrían los clientes que preguntan por WhatsApp | Omona',
        metaDescription: 'Cotizas y nadie da seguimiento. Omona retoma solo las conversaciones que se quedaron a medias, con un mensaje que tiene sentido. Prueba gratis 14 días.',
        pains: [
          'Mandaste la cotización y ahí quedó.',
          'Te acuerdas del cliente tres semanas después.',
          'Nadie tiene la lista de a quién le falta respuesta.',
          'Y volver a escribir a estas alturas se siente raro.',
        ],
        answers: [
          {
            title: 'Retoma sin que se lo pidas',
            body: 'Si el cliente dejó de contestar, el agente vuelve por su cuenta con un mensaje que continúa lo que se estaba hablando, no con un "¿sigues interesado?".',
          },
          {
            title: 'Sabe a quién le falta respuesta',
            body: 'Cada conversación queda con su etapa y su última interacción. No hay lista que llevar a mano ni recordatorio que se te pase.',
          },
          {
            title: 'Y te dice dónde se caen',
            body: 'En qué etapa se pierden los clientes y cuánto tardas en contestar. Con eso se arregla el proceso, no nada más el mensaje.',
          },
        ],
      },
      {
        slug: 'no-puedo-desconectarme',
        short: 'No puedo desconectarme',
        title: 'Tu negocio cierra',
        titleBreak: 'tu WhatsApp no',
        subtitle: 'Domingo, vacaciones, dos de la mañana. El teléfono suena igual, y contestar dejó de ser opcional.',
        video: 'handoff',
        videoAlt: 'El cliente pide un descuento, el agente escala la conversación y una persona del equipo la recibe con todo el contexto.',
        metaTitle: 'No puedo desconectarme del WhatsApp del negocio | Omona',
        metaDescription: 'Tu negocio cierra y tu WhatsApp no. Omona atiende fuera de horario y solo te busca cuando de verdad hace falta. Prueba gratis 14 días.',
        pains: [
          'Revisas el teléfono en la cena, en el cine, en la cama.',
          'Si te desconectas un día, se acumula.',
          'Salir de vacaciones significa dejar el negocio parado.',
          'Y no puedes contratar a alguien nada más para contestar.',
        ],
        answers: [
          {
            title: 'Atiende a la hora que sea',
            body: 'No hay horario. El cliente que escribe a las dos de la mañana recibe respuesta a las dos de la mañana, con precio y disponibilidad.',
          },
          {
            title: 'Solo te busca cuando hace falta',
            body: 'El agente resuelve lo que puede resolver. Cuando aparece algo que necesita a una persona, escala y avisa. El resto no te interrumpe.',
          },
          {
            title: 'Y puedes tomar el chat cuando quieras',
            body: 'Entras al panel, tomas la conversación y el agente se calla en ese chat. Sigue atendiendo los demás.',
          },
        ],
      },
      {
        slug: 'nadie-sabe-en-que-quedo-ese-chat',
        short: 'Nadie sabe en qué quedó',
        title: 'Nadie sabe',
        titleBreak: 'en qué quedó ese chat',
        subtitle: 'Toda la información de tus ventas vive en un teléfono, en un hilo, sin buscador. Y si esa persona no está, no está.',
        video: 'crm-se-llena-solo',
        videoAlt: 'Una tarjeta de lead aparece en el pipeline, sus campos se llenan solos y avanza a la etapa Calificado.',
        metaTitle: 'Nadie sabe en qué quedó ese chat de WhatsApp | Omona',
        metaDescription: 'Tus ventas viven en un hilo de WhatsApp sin orden. Omona convierte cada conversación en un contacto y una oportunidad, sin capturar nada. Prueba gratis 14 días.',
        pains: [
          'Buscas "el señor del compresor" y no lo encuentras.',
          'Nadie capturó el teléfono ni la empresa en ningún lado.',
          'Si el vendedor se va, se va su WhatsApp.',
          'Y el Excel que iban a llenar nunca se llenó.',
        ],
        answers: [
          {
            title: 'El contacto se llena solo',
            body: 'Nombre, empresa, teléfono y correo salen de lo que el cliente escribió. Nadie captura nada y aun así el dato está.',
          },
          {
            title: 'Cada conversación es una oportunidad en el tablero',
            body: 'Con su etapa, su valor y su historial completo. Ves el estado de tus ventas sin abrir WhatsApp.',
          },
          {
            title: 'La información es del negocio',
            body: 'Vive en tu panel, no en el teléfono de quien atendió. Tu equipo entra, mueve etapas y deja notas.',
          },
        ],
      },
    ],
    painsTitle: '¿Te suena?',
    answersTitle: 'Qué hace Omona con eso',
    otherTitle: 'Otros problemas que resuelve',
    ctaTitle: 'Pruébalo antes de darnos un dato tuyo',
    ctaBody: 'Habla con el agente en el demo. Sin registro, sin correo, sin tarjeta.',
    ctaDemo: 'Abrir el demo',
    ctaSignup: 'Empezar gratis 14 días',
    backHome: 'Volver al inicio',
  },
  faq: {
    sectionLabel: 'preguntas_',
    heading: 'Lo que todos preguntan antes de empezar',
    subheading: 'Las respuestas honestas, incluidas las incómodas.',
    items: [
      {
        q: '¿Me van a bloquear el número de WhatsApp?',
        a: 'Omona se conecta escaneando un código QR, igual que cuando abres WhatsApp Web: usas tu mismo número y no haces trámite con Meta. Eso también quiere decir que aplican las reglas de uso de WhatsApp. Si mandas mensajes masivos a gente que no te escribió, el riesgo de bloqueo es el mismo que si los mandaras a mano. Omona está pensado para contestar a quien te escribe primero, y ahí ese riesgo no existe.',
      },
      {
        q: '¿Va a sonar a robot?',
        a: 'No responde con frases hechas: lee el mensaje completo y contesta con la información de tu catálogo, en el tono que tú configures. Antes de conectar tu número puedes hablar con el agente en el demo y juzgarlo tú. Si te suena a robot ahí, te va a sonar a robot con tus clientes.',
      },
      {
        q: '¿Qué pasa cuando no sabe algo?',
        a: 'Lo escala. Cuando el cliente pregunta algo fuera de su alcance, pide un descuento que nadie autorizó o se molesta, el agente pasa la conversación a tu equipo y avisa. Quien entra ve el historial completo, lo que el cliente dijo y por qué se escaló. No inventa una respuesta para salir del paso.',
      },
      {
        q: '¿Puedo apagarlo y contestar yo?',
        a: 'Sí, en cualquier momento y por conversación. Cuando tomas un chat desde el panel, el agente se calla en ese chat y sigue atendiendo los demás. Tu número nunca deja de ser tuyo.',
      },
      {
        q: '¿Cuánto tardo en tenerlo funcionando?',
        a: 'Conectar tu número son cinco minutos: escaneas un QR y empieza a recibir mensajes. Lo que toma seis semanas es lo otro: mapear tu proceso, medir tu línea base, cargar catálogo y precios, y dejar cada conversación entrando al CRM con su tarea. Contestar rápido es fácil; que no se te pierda una oportunidad es el trabajo.',
      },
      {
        q: '¿Cuánto cuesta?',
        a: 'No publicamos precio porque depende de cuántos vendedores son, cuántas conversaciones manejan, qué canales usan, qué CRM ya tienen y qué tan complejas son sus propuestas. Cotizar antes de saber eso obliga a inventar un número. El diagnóstico de 30 minutos no tiene costo y de ahí sale la cifra.',
      },
      {
        q: '¿De dónde saca la información para prospectar?',
        a: 'De fuentes públicas: el sitio de la empresa, sus vacantes abiertas, notas de prensa, registros y lo que ya está en tu propio CRM de contactos anteriores. No compramos bases ni raspamos datos personales, y cuando no encuentra algo lo deja vacío en vez de rellenarlo. Un ángulo de entrada construido sobre un dato inventado es peor que no tener ángulo.',
      },
      {
        q: '¿Las propuestas las manda solo?',
        a: 'No. Genera el borrador con tu catálogo, tus precios y tus condiciones aprobadas, y ahí se detiene. Alguien de tu equipo lo revisa y lo manda. Es a propósito: una propuesta es la parte del proceso donde un error cuesta dinero de verdad, y el sistema no está autorizado a asumir ese riesgo por su cuenta.',
      },
      {
        q: '¿Tengo que cambiar de CRM?',
        a: 'No, y normalmente no conviene. Trabajamos sobre el que ya usas, aunque esté mal configurado. Cambiar de CRM y ordenar el proceso comercial al mismo tiempo son dos proyectos peleándose por la paciencia del mismo equipo, y suelen perder los dos.',
      },
      {
        q: '¿Y si al final no funciona?',
        a: 'En la semana 1 medimos tu línea base. Si al terminar las seis semanas tu CRM no refleja el 90% de las conversaciones comerciales y cada oportunidad abierta no tiene próxima tarea con responsable y fecha, te devolvemos el 100% del piloto. Las condiciones están a la vista en la sección de garantía, no en letra chica.',
      },
    ],
  },
  proof: {
    sectionLabel: 'prueba_',
    heading: 'No te pedimos que nos creas',
    subheading: 'Preferimos que lo compruebes tú, en tres mensajes, antes de darnos un solo dato tuyo.',
    // Cuando existan citas reales de clientes se pegan aquí y el marquee
    // toma el lugar principal. Una cifra inventada haría más daño que el hueco.
    testimonials: [] as Testimonial[],
    demoTitle: 'Habla con el agente ahora mismo',
    demoBody: 'Es el mismo motor que va a atender a tus clientes, configurado para un negocio de ejemplo. Pregúntale precios, ponle objeciones, pídele una cita. Si no te convence en tres mensajes, no te va a convencer un testimonio.',
    demoCta: 'Abrir el demo',
    demoNote: 'sin registro · sin correo · no te pedimos tarjeta',
  },
  beforeAfter: {
    sectionLabel: 'antes_despues_',
    heading: 'Tu WhatsApp, antes y después',
    subheading: 'La misma tienda, el mismo número, la misma semana.',
    beforeKicker: 'sin omona',
    beforeTitle: 'Tú eres el chat',
    beforeItems: [
      'Contestas a las once de la noche porque si no, se va.',
      'El que preguntó el lunes ya compró en otro lado.',
      'Cotizas lo mismo veinte veces al día.',
      'Nadie se acuerda en qué quedó ese chat.',
    ],
    afterKicker: 'con omona',
    afterTitle: 'El chat trabaja solo',
    afterItems: [
      'Contesta él, a la hora que sea, en segundos.',
      'Nadie espera. Nadie se va con el de enfrente.',
      'Cotiza con tu catálogo, no con frases hechas.',
      'Todo queda en el CRM sin que nadie capture nada.',
    ],
  },
  priceAdvantage: {
    sectionLabel: 'comparativa_',
    headingLines: ['La IA conversacional', 'más barata de la región'],
    subheading: 'Y con la IA incluida en el precio, no como un extra que cuesta lo mismo que el plan.',
    tableCaption: 'Comparativa de precio mensual de entrada entre plataformas de WhatsApp con IA para el mercado latinoamericano.',
    colTool: 'plataforma',
    colPrice: 'desde (MXN/mes)',
    colAi: 'IA incluida',
    colCrm: 'CRM incluido',
    colNote: 'la letra chica',
    rows: [
      {
        tool: 'Omona',
        price: '$499',
        ai: true,
        crm: true,
        note: 'Sin cobro por contacto ni por conversación.',
        isOmona: true,
      },
      {
        tool: 'Wati Growth',
        price: '~$835',
        ai: false,
        crm: false,
        note: 'Solo WhatsApp. El agente de IA es un add-on de unos $100 USD al mes.',
        isOmona: false,
      },
      {
        tool: 'ManyChat Pro + IA',
        price: '~$1,150',
        ai: true,
        crm: false,
        note: 'El add-on de IA cuesta lo mismo que el plan. Encima, Meta cobra por mensaje.',
        isOmona: false,
      },
      {
        tool: 'Respond.io Starter',
        price: '~$1,340',
        ai: false,
        crm: false,
        note: 'Los agentes de IA empiezan en el plan Growth, cerca de $2,700.',
        isOmona: false,
      },
      {
        tool: 'Leadsales Basic',
        price: '~$1,650',
        ai: false,
        crm: true,
        note: 'CRM sobre WhatsApp, sin agente de IA que converse.',
        isOmona: false,
      },
      {
        tool: 'Kosmo IA Starter',
        price: '$4,497',
        ai: true,
        crm: true,
        note: 'Cupo de 800 clientes nuevos al mes en el plan de entrada.',
        isOmona: false,
      },
    ],
    source: 'Precios públicos de cada proveedor, verificados el 1 de septiembre de 2026 y convertidos a pesos. Los planes cambian seguido: si ves otra cifra en su sitio, escríbenos y la corregimos.',
    cta: 'Empezar gratis 14 días',
  },

  /**
   * ══ LA HOME ═════════════════════════════════════════════════
   *
   * Todo el copy de la portada vive aquí abajo. Los bloques de arriba
   * (`hero`, `features`, `offerStack`, `stats`, `proof`, `beforeAfter`)
   * siguen existiendo porque los consumen las páginas de problema, las
   * de caso de uso y el blog — pero la portada ya no los usa.
   *
   * El giro que justifica el bloque nuevo: la versión anterior vendía
   * que el agente CONTESTA. Contestar es la parte visible y es la que
   * cualquier chatbot de $20 al mes también dice hacer, así que competir
   * ahí es competir en precio. Lo que no tiene ninguno es lo que pasa
   * DESPUÉS del mensaje: que el CRM se llene solo, que de cada charla
   * salgan campos en vez de un párrafo, y que alguien decida a quién hay
   * que buscar hoy y con qué decirle.
   *
   * Por eso la portada se reordenó alrededor del ciclo completo
   * —prospección, seguimiento, cierre, propuestas— y la conversación
   * bajó a lo que realmente es: la ENTRADA del sistema, no el producto.
   */
  home: {
    hero: {
      eyebrow: 'inteligencia comercial · b2b · latam',
      // El titular no promete una función: nombra un síntoma que el
      // director comercial reconoce sin que se lo expliquen. El pipeline
      // lleno de oportunidades viejas se ve bien en el tablero y es
      // exactamente donde está la fuga.
      title: 'El pipeline se ve sano.',
      titleAccent: 'Casi nunca lo está.',
      subtitle:
        'Omona lee cada conversación, llena el CRM solo y te entrega la siguiente jugada: a quién buscar hoy, con qué mensaje y por qué. Prospección, seguimiento, cierre y propuestas, sobre el mismo dato.',
      ctaPrimary: 'Agendar diagnóstico',
      ctaSecondary: 'Ver cómo funciona',
      note: '30 minutos · sin costo · sobre el CRM que ya tienes',
      // Rótulos de la tarjeta de jugada que se dibuja al lado. Es el
      // producto real: una jugada, no una bandeja de chats.
      card: {
        label: 'jugada_del_día',
        cohort: 'No-show',
        elapsed: 'hace 14 min',
        contact: 'Mariana Robles · Grupo Zenith',
        why: 'Apartó el diagnóstico de las 10:00 y no llegó. Los primeros 30 minutos son la ventana donde sí contesta.',
        messageLabel: 'mensaje propuesto',
        message:
          'Mariana, buen día. Te aparté las 10 y no nos cruzamos — sin problema, pasa. ¿Te queda mañana a las 11:00 o prefieres el jueves a la misma hora?',
        checksLabel: 'lo que solo tú puedes confirmar',
        checks: ['El teléfono es el suyo', 'Sigue siendo la persona que decide'],
        valueLabel: 'valor del deal',
        value: '$84,000',
        timeLabel: 'toma',
        time: '2 min',
        actionPrimary: 'Hecho',
        actionSecondary: 'No ahora',
      },
    },

    /**
     * El diagnóstico. Sin cifras a propósito: las que tenemos son de
     * nuestro propio pipeline y publicarlas sería exponer la operación.
     * Lo que sí se puede afirmar sin inventar nada es la MECÁNICA de la
     * fuga, que es además lo que el visitante reconoce en el suyo.
     */
    leak: {
      label: 'diagnóstico_',
      title: 'Nadie pierde la venta en la publicidad. La pierde después.',
      body:
        'El prospecto levantó la mano, alguien lo atendió, y en algún punto entre esa conversación y el cierre se cayó. No por falta de ganas: porque el seguimiento vive en la memoria de una persona, y la memoria se rompe justo cuando hay más trabajo.',
      items: [
        {
          title: 'Oportunidades sin siguiente paso',
          detail:
            'Están abiertas en el tablero, pero ninguna tiene qué sigue ni cuándo. En muchos CRM ni siquiera existe el campo para guardarlo.',
        },
        {
          title: 'Citas sin resultado registrado',
          detail:
            'Nadie marcó si la persona llegó. Sin eso no se puede saber si el problema es que no llegan o que no se anota.',
        },
        {
          title: 'Propuestas sin fecha de decisión',
          detail:
            'Se entregó y quedó en "me avisan". Una propuesta sin fecha no está viva: está esperando a que alguien se acuerde.',
        },
        {
          title: 'Y se rompe en temporada alta',
          detail:
            'Justo cuando hay más citas y más presión es cuando menos se registra. El mes con más oportunidades es el mes con peor dato.',
        },
      ],
      quote: 'Un esfuerzo se rompe en temporada alta. Siempre. Un sistema, no.',
    },

    /**
     * ══ EL NÚCLEO ══════════════════════════════════════════════
     * Los cuatro ciclos. Esta es la sección que carga la promesa de la
     * página, y va arriba por eso. El orden es el del ciclo real, no el
     * de la importancia: prospección primero porque es lo que ocurre
     * antes del primer mensaje, y propuestas al final porque es lo que
     * sale de todo lo anterior.
     */
    cycle: {
      label: 'ciclo_',
      title: 'Un ciclo de venta, cuatro motores',
      subtitle:
        'No es un chatbot con un CRM pegado atrás. Es el ciclo completo corriendo sobre el mismo dato: lo que se aprende prospectando alimenta el seguimiento, y lo que se aprende en el seguimiento escribe la propuesta.',
      outputLabel: 'produce',
      stages: [
        {
          id: 'prospeccion',
          index: '01',
          name: 'Prospección',
          kicker: 'investigación de mercado',
          headline: 'Antes del primer mensaje, ya sabe con quién habla.',
          bullets: [
            'Investiga la empresa: a qué se dedica, de qué tamaño es, en qué momento está y quién firma.',
            'Arma listas por señal, no por corazonada — contrataron, abrieron sucursal, cambiaron de director comercial.',
            'Entrega el ángulo de entrada ya escrito, con la razón concreta por la que aplica a esa cuenta y no a otra.',
          ],
          output: 'Cuenta investigada + ángulo de entrada',
        },
        {
          id: 'seguimiento',
          index: '02',
          name: 'Seguimiento',
          kicker: 'el motor',
          headline: 'La parte que se rompe sola. Aquí vive el motor.',
          bullets: [
            'Calcula el estado real de cada oportunidad: qué pasó, hace cuánto, y qué toca hacer ahora.',
            'Convierte cada fuga en una jugada concreta — a quién, hoy, con el mensaje ya redactado.',
            'Reloj rápido para lo que se enfría en minutos; reloj lento para la cola del pipeline.',
          ],
          output: 'Una jugada al día, con mensaje y fecha',
        },
        {
          id: 'cierre',
          index: '03',
          name: 'Cierre',
          kicker: 'señal de compra',
          headline: 'La conversación llega al cierre con todo lo que hace falta.',
          bullets: [
            'Detecta la objeción real y en qué momento apareció, que casi nunca es la que se dijo al final.',
            'Marca la señal de compra: presupuesto dicho en voz alta, plazo, y quién tiene que autorizar.',
            'Avisa a dirección cuando una oportunidad grande lleva demasiado tiempo quieta.',
          ],
          output: 'Objeciones, criterio de decisión y fecha',
        },
        {
          id: 'propuestas',
          index: '04',
          name: 'Propuestas',
          kicker: 'y presentaciones',
          headline: 'El documento sale de la conversación, no de una plantilla en blanco.',
          bullets: [
            'Toma lo que el cliente dijo —necesidad, presupuesto, plazo, quién decide— y arma el borrador con eso.',
            'Con tu catálogo, tus precios y tus condiciones aprobadas. Nunca con cifras inventadas.',
            'Propuesta y presentación salen de la misma fuente, y las dos pasan por revisión humana antes de salir.',
          ],
          output: 'Borrador personalizado, listo para revisar',
        },
      ],
    },

    /**
     * El motor de seguimiento, a detalle. Es el ciclo 02 abierto, y va
     * inmediatamente después porque es el que sostiene la diferencia
     * frente a cualquier otra herramienta: los otros tres se pueden
     * imitar con prompts, este necesita relojes y estado.
     */
    engine: {
      label: 'motor_',
      title: 'Cinco cohortes, cada uno con su reloj',
      subtitle:
        'Una oportunidad no se sigue igual cinco minutos después de un no-show que tres semanas después de una propuesta. Cada cohorte tiene su ritmo, su guion y su meta.',
      table: {
        cohort: 'Cohorte',
        trigger: 'Se dispara cuando',
        clock: 'Reloj',
        goal: 'La meta',
      },
      cohorts: [
        {
          name: 'Prospecto nuevo',
          trigger: 'Llena un formulario o escribe por primera vez',
          clock: 'Minutos',
          goal: 'Contacto humano en menos de 20 minutos',
        },
        {
          name: 'Cita agendada',
          trigger: 'Aparta lugar en el calendario',
          clock: 'Minutos → días',
          goal: 'Que la cita efectivamente ocurra',
        },
        {
          name: 'No-show',
          trigger: 'La cita pasó y no llegó',
          clock: 'Minutos → días',
          goal: 'Reagendar, o cerrar con dignidad',
        },
        {
          name: 'Propuesta',
          trigger: 'Se entrega la propuesta',
          clock: 'Días',
          goal: 'Que tenga fecha de decisión',
        },
        {
          name: 'El resto',
          trigger: '—',
          clock: 'Semanal',
          goal: 'Se ignora a propósito',
        },
      ],
      // Esta cita es la decisión de diseño más difícil de defender y la
      // que más confianza gana cuando se dice en voz alta.
      quote:
        'Un sistema que te enseña las cuarenta cosas que deberías hacer no es información: es culpa. El motor está dispuesto a esconder trabajo.',
      clocks: {
        label: 'dos relojes, no uno',
        items: [
          {
            name: 'Reloj rápido',
            unit: 'minutos',
            detail:
              'Prospecto nuevo, cita agendada, no-show, respuesta entrante. Reacciona por evento. Un no-show recuperado a los cinco minutos convierte muchísimo mejor que uno recuperado mañana: la persona sigue en su escritorio y todavía se siente mal por no haber llegado.',
          },
          {
            name: 'Reloj lento',
            unit: 'días',
            detail:
              'La cola del pipeline, el marcador de la semana, la fuga medida en pesos. Corre solo, temprano, todos los días. Es el que contesta "cómo vamos", no "qué hago ahora".',
          },
        ],
      },
      play: {
        label: 'una jugada a la vez',
        title: 'El sistema entrega una tarjeta. Nunca una lista.',
        detail:
          'Llega con el mensaje ya escrito, el teléfono, la fecha propuesta, cuánto vale el deal si cierra y cuántos minutos toma. Dos botones: hecho, o no ahora — y "no ahora" pide razón, porque sin razón se vuelve un loop con la misma tarjeta el resto de la semana.',
        closing:
          'Cero decisiones para arrancar. Decidir qué hacer es la parte cara; el sistema la resuelve y la persona ejecuta.',
      },
      guardrails: {
        label: 'el manual de estilo es código',
        title: 'Un mensaje que no cumple el manual nunca aparece como jugada.',
        detail:
          'Las palabras prohibidas, el máximo de emojis, una sola pregunta por mensaje, la ventana horaria y la regla de que siempre haya un siguiente paso con fecha no viven en un PDF que nadie abre: corren como una función que valida cada mensaje antes de mostrarlo.',
        checksTitle: 'Y lo que la máquina no puede juzgar, lo pregunta',
        checksDetail:
          'Si un elogio es cierto, si el número es el del cliente, si esa sigue siendo la persona que decide. Eso aparece en la tarjeta como casillas que solo una persona puede marcar. Un validador que finja poder juzgar eso, miente.',
      },
    },

    /**
     * Aquí es donde la conversación —que era TODA la portada anterior—
     * queda puesta en su lugar: es la materia prima, no el producto.
     * Se dice explícitamente en `aside`, porque el visitante que llegó
     * buscando "chatbot para WhatsApp" necesita entender por qué esta
     * página le está hablando de otra cosa.
     */
    intel: {
      label: 'inteligencia_',
      title: 'Cada conversación deja datos, no un párrafo',
      subtitle:
        'WhatsApp, correo, calendario y llamadas grabadas entran al mismo lugar. De ahí no sale un resumen bonito: salen campos que el CRM puede guardar y el motor puede leer.',
      sourceLabel: 'lo que entró',
      source:
        'Fíjate, ya lo vi con el equipo. El presupuesto lo tenemos para el siguiente trimestre, no ahorita. Y la verdad lo que nos preocupa es la migración, porque ya nos pasó con el proveedor anterior. Quien decide esto al final es Rodrigo, el director de operaciones.',
      fieldsLabel: 'lo que quedó guardado',
      fields: [
        { key: 'necesidad', value: 'Migración sin interrupción del servicio' },
        { key: 'presupuesto', value: 'Existe, liberado el siguiente trimestre' },
        { key: 'plazo', value: 'Q+1 · no es urgencia, es calendario' },
        { key: 'objeción', value: 'Mala experiencia previa en la migración' },
        { key: 'quién_decide', value: 'Rodrigo · dirección de operaciones' },
        { key: 'siguiente_paso', value: 'Caso de migración + fecha con Rodrigo' },
      ],
      aside: {
        title: 'Y sí, también contesta.',
        detail:
          'El agente responde en segundos, a cualquier hora, entiende notas de voz y agenda la cita dentro del mismo chat. Pero contestar es la entrada del sistema, no el producto: si el mensaje se contesta rápido y aun así nadie sabe qué sigue, la venta se cae igual.',
        cta: 'Pruébalo en el demo',
      },
    },

    measure: {
      label: 'medición_',
      title: 'No mide actividad. Mide músculo.',
      subtitle:
        'Mandar cuarenta mensajes no es un resultado. Estas cuatro sí, y las cuatro se comparan contra las semanas anteriores — tendencia, no foto.',
      metrics: [
        {
          name: 'Tiempo al primer contacto',
          detail:
            'La mediana desde que un prospecto levanta la mano hasta que un humano le habla. Es el número más honesto del sistema porque está 100% bajo tu control.',
        },
        {
          name: 'Tiempo al primer toque tras un no-show',
          detail: 'La intensidad de recuperación, convertida en un número que sube o baja.',
        },
        {
          name: 'Tasa de recuperación',
          detail: 'De no-shows y de propuestas que estaban sin fecha de decisión.',
        },
        {
          name: 'Qué guion convierte',
          detail:
            'Cada jugada guarda su resultado y de dónde salió el texto. En tres meses eso contesta con evidencia cuáles frases funcionan, en vez de con opinión.',
        },
      ],
      moneyLabel: 'y la cifra que lo vuelve un tema de dirección',
      moneyFormula:
        'no-shows del mes   × costo por cita                = pesos que se fugaron\nrecuperados        × ticket × comisión × meses   = pesos que se taparon',
      moneyNote: 'Esa resta es la conversación completa. No hace falta explicar nada más.',
    },

    /**
     * Los límites, escritos como límites. Van en la portada y no
     * escondidos en un FAQ porque el comprador B2B que vale la pena ya
     * los va a descubrir en la semana 2 — y descubrirlos entonces, tras
     * haberlos leído aquí, construye confianza en vez de quemarla.
     */
    scope: {
      label: 'alcance_',
      title: 'Vive encima del CRM que ya tienes',
      subtitle:
        'No te pedimos cambiar de herramienta. Leemos el CRM, el calendario y las llamadas grabadas, y le escribimos de vuelta.',
      doTitle: 'Lo que sí hace',
      does: [
        'Escribe en tu CRM actual: contactos, campos, tareas con responsable y fecha.',
        'Lee etapas, citas del calendario y llamadas grabadas como una sola señal.',
        'Ajusta los guiones y los tiempos sin volver a desplegar nada: las escaleras son datos, no código.',
        'Se adapta a tu léxico y a tu manual de voz, que se cargan como configuración.',
      ],
      dontTitle: 'Lo que no hace',
      donts: [
        {
          title: 'No es un CRM',
          detail: 'Vive encima del que ya existe. Si buscas reemplazar el tuyo, no somos eso.',
        },
        {
          title: 'No decide',
          detail:
            'Calcula estado y propone jugadas. No mueve etapas solo, no cierra deals y no manda mensajes por su cuenta sin que alguien lo apruebe.',
        },
        {
          title: 'No ve todos los canales',
          detail:
            'El correo personal y el WhatsApp saliente desde el teléfono son invisibles. En México eso es buena parte de la conversación, y está escrito aquí como hueco conocido, no disimulado.',
        },
        {
          title: 'No es un modelo estadístico',
          detail:
            'Las escaleras son reglas escritas a mano sobre tu proceso. Funcionan, pero decir que hay un modelo prediciendo el cierre sería inventar.',
        },
      ],
    },
  },
};

export type Translations = typeof es;
