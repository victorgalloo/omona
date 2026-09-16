import type { Testimonial } from './types';

export const es = {
  nav: {
    features: 'Qué construimos',
    engine: 'Servicios',
    process: 'Proceso',
    pricing: 'Cómo trabajamos',
    blog: 'Blog',
    useCases: 'Casos de uso',
    demo: 'Demo',
    login: 'Iniciar sesión',
    signup: 'Evaluar un proyecto',
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
    heading: 'Cuatro fases, y la última es irnos',
    subheading:
      'El objetivo no es quedarnos operando tu proyecto. **Es dejarlo funcionando en manos de tu equipo.**',
    steps: [
      {
        title: 'Descubrir',
        detail: 'El proceso real, con sus excepciones. Qué se automatiza y qué no.',
      },
      {
        title: 'Construir',
        detail: 'Integraciones, permisos, aprobaciones y manejo de errores.',
      },
      {
        title: 'Evaluar',
        detail: 'Casos reales y casos límite, antes de que lo use el cliente.',
      },
      {
        title: 'Transferir',
        detail: 'Documentación, accesos y una persona tuya capaz de mantenerlo.',
      },
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
  /**
   * Antes esto era la devolución del 100% del piloto de seis semanas — una
   * garantía atada a un producto que ya no se vende, y que sobre proyectos de
   * delivery (más caros y más largos) sería imprudente sostener.
   *
   * La reemplaza el criterio de aceptación: en qué condiciones entramos a un
   * proyecto. Es la prueba honesta que pide docs/posicionamiento.md — no
   * promete un resultado, describe cómo decidimos, que es lo que un comprador
   * técnico realmente quiere saber antes de la primera llamada.
   */
  guarantee: {
    sectionLabel: 'cómo evaluamos_',
    heading: 'Antes de entrar, decidimos si podemos entregarlo',
    body:
      'No aceptamos todos los proyectos. Revisamos alcance, sistemas y quién decide del lado del cliente. **Si vemos que no lo podemos entregar bien, lo decimos en la primera conversación** — no en la semana cuatro.',
    conditionsLabel: 'Qué miramos',
    conditions: [
      'Que exista un proceso real, con alguien que pueda decidir cómo se hace',
      'Que los sistemas a integrar tengan API, acceso o una ruta viable',
      'Que haya fecha y alcance, no una exploración abierta',
      'Que tu equipo pueda recibir el handoff al cerrar',
    ],
    note: 'Las cuatro son condiciones para que el proyecto salga bien, no letra chica.',
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
    heading: 'Cuéntanos el proyecto',
    subheading:
      'El workflow, los sistemas involucrados y en qué estado está. **Respondemos con una recomendación de siguiente paso, no con una demo genérica.**',
    primary: 'Evaluar un proyecto',
    secondary: 'Ver los servicios',
    trust: 'si no es para nosotros, te lo decimos en la primera respuesta',
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
      heading: '¿Tienes un proyecto de Claude que entregar?',
      subheading: 'Cuéntanos el workflow, los sistemas y en qué estado está. Respondemos con una recomendación de siguiente paso.',
      primary: 'Evaluar un proyecto',
      secondary: 'Ver demo',
    },
  },
  useCaseLayout: {
    backLabel: 'Casos de uso',
    heroCta: 'Evaluar un proyecto',
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
    ctaSubtitle: 'Cuéntanos el workflow y los sistemas · Respondemos con un siguiente paso',
    ctaPrimary: 'Evaluar un proyecto',
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
        metaDescription: 'Si tardas en contestar, el cliente ya le escribió a otro. Omona responde cada WhatsApp en segundos con la información real de tu catálogo. Así lo construimos y lo operamos.',
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
        metaDescription: 'Cotizas y nadie da seguimiento. Omona retoma solo las conversaciones que se quedaron a medias, con un mensaje que tiene sentido. Así lo construimos y lo operamos.',
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
        metaDescription: 'Tu negocio cierra y tu WhatsApp no. Omona atiende fuera de horario y solo te busca cuando de verdad hace falta. Así lo construimos y lo operamos.',
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
        metaDescription: 'Tus ventas viven en un hilo de WhatsApp sin orden. Omona convierte cada conversación en un contacto y una oportunidad, sin capturar nada. Así lo construimos y lo operamos.',
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
    ctaSignup: 'Evaluar un proyecto',
    backHome: 'Volver al inicio',
  },
  faq: {
    sectionLabel: 'preguntas_',
    heading: 'Lo que preguntan antes de la primera llamada',
    subheading: 'Las respuestas honestas, incluidas las incómodas.',
    items: [
      {
        q: '¿Trabajan bajo mi marca, frente a mi cliente?',
        a: 'Sí, y es la modalidad más pedida. Tú conservas la relación comercial y el crédito; nosotros no aparecemos. Firmamos lo que haga falta para eso. También trabajamos junto a tu equipo con nuestro nombre a la vista, si prefieres presentarlo como una alianza.',
      },
      {
        q: '¿Tienen casos de éxito o clientes que pueda ver?',
        a: 'No publicables. La firma es nueva y presentar testimonios, logos o métricas que no podemos sostener sería inventarlos. Lo que sí es verificable: Omona construyó y opera en producción su propio sistema con Claude — multi-tenant con aislamiento por organización, transcripción de audio, escalamiento a humano, webhooks firmados y despliegue continuo. Todo el corpus de este sitio lo documenta. Es evidencia de que sabemos llevar un agente de prototipo a operación.',
      },
      {
        q: '¿Qué pasa si el proyecto ya está fallando en producción?',
        a: 'Ese es Rescue & Hardening. Primero estabilizamos: entender por qué falla, contener el daño y hacer visibles los errores. Después viene el endurecimiento. No reescribimos desde cero salvo que sea más barato que arreglarlo, y eso lo decimos con argumentos, no por preferencia.',
      },
      {
        q: '¿Cuánto cuesta?',
        a: 'No publicamos tarifas porque dependen del alcance, de cuántos sistemas hay que integrar y de en qué estado está lo que ya existe. Cotizar antes de saber eso obliga a inventar un número. Cuéntanos el workflow y el estado del proyecto y respondemos con una recomendación de siguiente paso y un rango.',
      },
      {
        q: '¿Nos quedamos dependiendo de ustedes?',
        a: 'No, y está diseñado para que no pase. Los accesos y las credenciales quedan a nombre tuyo o de tu cliente, nunca en cuentas nuestras. Al cerrar entregamos documentación, pruebas ejecutables y una sesión de handoff con alguien de tu equipo. Si nos vamos, nada se apaga.',
      },
      {
        q: '¿Solo trabajan con Claude?',
        a: 'Es donde somos buenos y donde tenemos producto propio en producción, así que es lo que ofrecemos. Si tu proyecto está atado a otro proveedor, lo honesto es decirte que busques a alguien especializado en eso. No cobramos por aprender sobre tu presupuesto.',
      },
      {
        q: '¿Qué necesitan de mi lado para empezar?',
        a: 'Una persona que pueda decidir cómo se hace el proceso, accesos a los sistemas a integrar, y una fecha real. Sin la primera el proyecto se atasca en preguntas que nadie contesta; sin la segunda no hay forma de construir; sin la tercera no es un proyecto, es una exploración.',
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
   * Reposicionamiento: de PRODUCTO a SERVICIO.
   *
   * Lo que vendía esta página —inteligencia comercial sobre WhatsApp— dejó de
   * ser la oferta. Ahora es la evidencia. El comprador ya no es un director
   * comercial que quiere llenar su CRM, sino un AI Practice Lead que ya vendió
   * un proyecto de Claude y no tiene con quién entregarlo.
   *
   * El corpus viejo (74 documentos) se queda publicado a propósito. No se
   * esconde ni se contradice: se le cambia el rol. Deja de decir "esto es lo
   * que vendemos" y pasa a decir "esto es lo que construimos y operamos" — que
   * es la única prueba verificable que tenemos, porque docs/posicionamiento.md
   * prohíbe inventar testimonios, logos, métricas y casos de éxito.
   *
   * Los slots de sección no cambiaron de forma, sólo de contenido, para no
   * tocar los componentes de `components/home/*`.
   */
  home: {
    hero: {
      eyebrow: 'socio técnico de delivery · claude · latam',
      // No dice qué somos: dice el momento en el que el comprador está.
      // Vender el piloto ya lo hizo él; lo que no sabe es cómo entregarlo.
      title: 'Vender el piloto fue la parte fácil.',
      titleAccent: 'Operarlo es otra cosa.',
      subtitle:
        'Llevamos automatizaciones Claude de prototipo a producción. Integraciones, permisos, evaluaciones, manejo de errores y transferencia a tu equipo. Bajo tu marca, o junto a él.',
      ctaPrimary: 'Evaluar un proyecto',
      ctaSecondary: 'Ver cómo trabajamos',
      note: 'nos cuentas el workflow y los sistemas · respondemos con un siguiente paso',
      /**
       * La tarjeta dejó de ser una jugada de seguimiento y pasó a ser un
       * hallazgo de Production Readiness Audit — que es la oferta de entrada.
       * Enseña el entregable, no una promesa.
       */
      card: {
        label: 'revisión_de_producción',
        cohort: 'Bloqueante',
        elapsed: 'hallazgo 3 de 11',
        contact: 'Agente de cotizaciones · integración con ERP',
        why: 'El agente escribe en el ERP sin confirmación. Un error de extracción genera una orden real, y hoy no hay forma de revertirla.',
        messageLabel: 'recomendación',
        message:
          'Meter aprobación humana antes de escribir. El agente propone la orden, una persona la confirma. Se registra quién aprobó y con qué datos.',
        checksLabel: 'lo que confirma tu equipo',
        checks: ['Quién tiene autoridad para aprobar', 'Qué monto puede ir sin revisión'],
        valueLabel: 'riesgo',
        value: 'Alto',
        timeLabel: 'esfuerzo',
        time: '2 días',
        actionPrimary: 'Aceptado',
        actionSecondary: 'Aplazar',
      },
    },

    /**
     * El problema. Son los modos de falla reales de un agente que pasó de
     * demo a operación — no una lista de miedos genéricos. Cada uno es algo
     * que el comprador ya vivió o está a punto de vivir.
     */
    leak: {
      label: 'el problema_',
      title: 'La demo funcionó. La operación es otro sistema.',
      body:
        'Un prototipo contesta bien el caso feliz. Eso basta para cerrar la venta. **Lo que rompe el proyecto es todo lo demás**, y casi nunca está presupuestado.',
      items: [
        {
          title: 'Falla y nadie se entera',
          detail:
            'Sin logs ni alertas, el error lo reporta el cliente. Para entonces lleva días ocurriendo.',
        },
        {
          title: 'Actúa sin permiso',
          detail:
            'El agente escribe en sistemas reales. **Nadie definió qué puede hacer solo y qué necesita aprobación.**',
        },
        {
          title: 'Nadie sabe si mejoró',
          detail:
            'No hay evaluaciones con datos reales. Cada cambio es una apuesta y el equipo lo prueba a ojo.',
        },
        {
          title: 'El costo se dispara',
          detail:
            'Funciona con diez casos. Con mil, la factura y la latencia dejan de tener sentido.',
        },
      ],
      quote: 'Un prototipo demuestra que se puede. Una operación aguanta que se use.',
    },

    /**
     * Los cuatro pilares de lo que hace falta para que una automatización
     * aguante producción. Es el reemplazo del ciclo de venta, y ocupa el
     * mismo componente sin tocarlo.
     */
    cycle: {
      label: 'qué construimos_',
      title: 'Cuatro cosas separan un prototipo de una operación',
      subtitle:
        'Ninguna es exótica. **Todas se saltan cuando hay prisa por enseñar algo**, y todas se cobran después, en producción y con el cliente mirando.',
      outputLabel: 'queda',
      stages: [
        {
          id: 'workflow',
          index: '01',
          name: 'Workflow',
          kicker: 'el proceso real',
          headline: 'Primero el proceso. Después el agente.',
          bullets: [
            'Levantamos cómo se hace hoy, con quién y con qué excepciones.',
            'Marcamos qué pasos conviene automatizar y **cuáles es mejor dejar en manos de una persona**.',
            'El diseño sale del proceso, no de lo que el modelo sabe hacer.',
          ],
          output: 'Proceso mapeado y alcance acordado',
        },
        {
          id: 'integracion',
          index: '02',
          name: 'Integración',
          kicker: 'con los sistemas que ya existen',
          headline: 'El agente sirve cuando toca los sistemas del negocio.',
          bullets: [
            'CRM, ERP, bases de datos y SaaS, por API, webhooks o MCP.',
            'Autenticación, permisos y alcance de cada herramienta que el agente puede usar.',
            '**Un agente que solo conversa no cambia nada.** El valor aparece cuando escribe donde importa.',
          ],
          output: 'Sistemas conectados, con permisos acotados',
        },
        {
          id: 'controles',
          index: '03',
          name: 'Controles',
          kicker: 'para operar sin sustos',
          headline: 'Lo que pasa cuando algo sale mal.',
          bullets: [
            'Aprobación humana en las decisiones que cuestan dinero o son difíciles de revertir.',
            'Logs, reintentos, manejo de errores y una ruta de escalamiento clara.',
            '**Sin esto el proyecto se entrega y nadie se atreve a dejarlo solo.**',
          ],
          output: 'Aprobaciones, logs y escalamiento',
        },
        {
          id: 'evaluacion',
          index: '04',
          name: 'Evaluación',
          kicker: 'con datos reales',
          headline: 'Saber si funciona, no creer que funciona.',
          bullets: [
            'Casos reales y casos límite, sacados del proceso del cliente.',
            'Un cambio de prompt o de modelo se mide antes de salir a producción.',
            '**Sin evaluaciones, cada ajuste es una apuesta** y nadie puede decir si mejoró.',
          ],
          output: 'Suite de evaluación y criterio de aceptación',
        },
      ],
    },

    /**
     * Los cinco servicios. Van en la tabla que antes tenía las cohortes: son
     * cinco filas comparables por las mismas columnas, que es justo para lo
     * que sirve una tabla. Los dos primeros son las ofertas de entrada.
     */
    engine: {
      label: 'servicios_',
      title: 'Cinco formas de entrar, según dónde estés',
      subtitle:
        'Se nombran por resultado, no por tecnología. **Los dos primeros son por donde empieza casi todo el mundo.**',
      table: {
        cohort: 'Servicio',
        trigger: 'Cuándo aplica',
        clock: 'Formato',
        goal: 'Resultado',
      },
      cohorts: [
        {
          name: 'Pilot-to-Production Sprint',
          trigger: 'Proyecto vendido, con prototipo a medias',
          clock: 'Sprint',
          goal: 'Automatización operable y documentada',
        },
        {
          name: 'White-label Delivery Partner',
          trigger: 'Tienes la relación, no la capacidad',
          clock: 'Continuo',
          goal: 'Entrega bajo tu marca o con tu equipo',
        },
        {
          name: 'Production Readiness Audit',
          trigger: 'Hay un agente y nadie sabe si aguanta',
          clock: 'Diagnóstico',
          goal: 'Plan priorizado para llegar a producción',
        },
        {
          name: 'Claude Workflow Build',
          trigger: 'Hay proceso de negocio y no hay sistema',
          clock: 'Proyecto',
          goal: 'Workflow integrado, probado y operable',
        },
        {
          name: 'Rescue & Hardening',
          trigger: 'La automatización ya falla en producción',
          clock: 'Intervención',
          goal: 'Sistema estabilizado y con controles',
        },
      ],
      quote:
        'No construimos demos vistosas que se rompen al primer caso real. Construimos lo que tu cliente va a usar el lunes.',
      clocks: {
        label: 'dos modos de trabajar',
        items: [
          {
            name: 'Bajo tu marca',
            unit: 'white-label',
            detail:
              'Tu consultora conserva la relación y el crédito. **Nosotros no aparecemos frente a tu cliente.** Entregamos arquitectura, construcción y hardening, y tú lo presentas como tuyo.',
          },
          {
            name: 'Junto a tu equipo',
            unit: 'en conjunto',
            detail:
              'Trabajamos con tus desarrolladores, no en lugar de ellos. **Al cerrar, tu equipo puede mantenerlo sin nosotros.** Eso incluye documentación, handoff y capacitación.',
          },
        ],
      },
      play: {
        label: 'cómo arranca',
        title: 'Primero entendemos el proyecto. Después decimos si entramos.',
        detail:
          'Nos cuentas el workflow, los sistemas involucrados y en qué estado está. Respondemos con una recomendación de siguiente paso — **no con una demo genérica ni con una propuesta de plantilla.**',
        closing:
          'Si el proyecto no es para nosotros, lo decimos ahí. Es más barato para los dos que descubrirlo en la semana cuatro.',
      },
      guardrails: {
        label: 'qué queda instalado',
        title: 'Un proyecto termina cuando tu equipo puede operarlo sin nosotros.',
        detail:
          'No cuando el código funciona en nuestra máquina. **Al cerrar queda documentación, accesos, pruebas y una persona de tu lado capaz de mantenerlo.**',
        checksTitle: 'Y lo que no podemos prometer, no lo prometemos',
        checksDetail:
          'No hay testimonios, logos ni métricas publicables: la firma es nueva y presentarlos sería inventarlos. **Lo verificable es nuestro propio producto en producción**, y este sitio lo documenta entero.',
      },
    },

    /**
     * Capacidades técnicas. El componente muestra "lo que entró → lo que quedó
     * guardado", y ese par sigue funcionando: entra un encargo en lenguaje de
     * negocio, sale la lista de piezas técnicas que hay que construir.
     */
    intel: {
      label: 'capacidades_',
      title: 'Lo que pide el negocio, traducido a lo que hay que construir',
      subtitle:
        'El cliente no pide MCP ni human-in-the-loop. **Pide que deje de perderse el papeleo.** Nuestro trabajo es esa traducción, y luego construirla.',
      sourceLabel: 'lo que pide el cliente',
      source:
        'Queremos que las facturas que llegan por correo se capturen solas en el ERP. Pero si el proveedor es nuevo o el monto es alto, que lo vea alguien antes. Y necesitamos saber qué pasó con cada una.',
      fieldsLabel: 'lo que hay que construir',
      fields: [
        { key: 'workflow', value: 'Extracción de documento y alta en ERP' },
        { key: 'integración', value: 'Correo, almacenamiento y API del ERP' },
        { key: 'tool_use', value: 'Escritura acotada, solo altas, sin borrado' },
        { key: 'aprobación', value: 'Proveedor nuevo o monto sobre el umbral' },
        { key: 'evaluación', value: 'Facturas reales, incluidos los formatos raros' },
        { key: 'observabilidad', value: 'Traza por factura, reintentos y escalamiento' },
      ],
      aside: {
        title: 'Y sí, nosotros mismos lo operamos.',
        detail:
          'Omona construyó y opera su propio sistema con Claude sobre WhatsApp: multi-tenant con aislamiento por organización, transcripción de audio, escalamiento a humano, webhooks firmados y despliegue continuo. **Es evidencia de producción, no la oferta de servicios** — y el corpus de este sitio lo documenta.',
        cta: 'Ver el sistema funcionando',
      },
    },

    /**
     * Estándares de entrega. Reemplaza a las métricas del producto viejo, que
     * medían conversaciones y seguimiento. Aquí lo que se mide es qué queda
     * instalado — que es la prueba honesta que pide docs/posicionamiento.md.
     */
    measure: {
      label: 'estándares de entrega_',
      title: 'Qué queda cuando nos vamos',
      subtitle:
        'No es una promesa de resultado: es la lista de lo que entregamos siempre. **Si algo de esto falta, el proyecto no está cerrado.**',
      metrics: [
        {
          name: 'Documentación que tu equipo puede seguir',
          detail:
            'Arquitectura, decisiones y cómo operarlo. Escrita para quien lo mantiene, no para quien lo vendió.',
        },
        {
          name: 'Accesos y credenciales a tu nombre',
          detail:
            'Todo queda en cuentas tuyas o de tu cliente. **Nunca en las nuestras.** Irnos no puede apagar nada.',
        },
        {
          name: 'Pruebas y evaluaciones ejecutables',
          detail:
            'Corren sin nosotros. Un cambio futuro se puede validar sin adivinar si rompió algo.',
        },
        {
          name: 'Handoff con una persona capacitada',
          detail:
            'Alguien de tu lado que entendió el sistema y puede modificarlo. Sesión grabada, dudas resueltas.',
        },
      ],
      moneyLabel: 'la definición de terminado',
      moneyFormula:
        'corre en producción        + tu equipo puede operarlo\n+ los errores son visibles  + los cambios se pueden probar\n= proyecto cerrado',
      moneyNote:
        'Cualquier cosa que no cumpla las cuatro sigue siendo un prototipo, aunque esté en producción.',
    },

    /**
     * El anti-ICP, escrito como anti-ICP. Decir a quién NO servimos filtra
     * mejor que cualquier lista de beneficios, y ahorra la llamada que no
     * iba a ningún lado.
     */
    scope: {
      label: 'alcance_',
      title: 'Qué tomamos y qué no',
      subtitle:
        'Somos una firma pequeña y especializada. **Decir que no a tiempo es parte del trabajo.**',
      doTitle: 'Lo que tomamos',
      does: [
        'Proyectos de Claude ya vendidos o comprometidos, con fecha real.',
        'Automatizaciones que tocan sistemas del negocio: CRM, ERP, bases de datos, SaaS.',
        'Trabajo bajo la marca de una consultora, sin aparecer frente a su cliente.',
        'Rescates de automatizaciones que ya están fallando en producción.',
      ],
      dontTitle: 'Lo que no tomamos',
      donts: [
        {
          title: 'Demos y pruebas de concepto',
          detail:
            'Si lo que se busca es enseñar algo en una junta, no somos la firma. Construimos lo que se va a operar.',
        },
        {
          title: 'Proyectos sin dueño del proceso',
          detail:
            'Alguien del lado del cliente tiene que poder decidir cómo se hace el trabajo. Sin esa persona, el proyecto se atasca.',
        },
        {
          title: 'Entrenar o afinar modelos',
          detail:
            'Trabajamos sobre modelos existentes. Investigación de ML y fine-tuning no es lo nuestro, y decirlo ahorra tiempo.',
        },
        {
          title: 'Cuerpos por hora sin alcance',
          detail:
            'No rentamos desarrolladores para una bolsa de horas. Entramos con un resultado acordado y una definición de terminado.',
        },
      ],
    },
  },
};

export type Translations = typeof es;
