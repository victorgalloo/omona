import type { Testimonial } from './types';

export const es = {
  nav: {
    features: 'Qué construyo',
    engine: 'Cuánto tarda',
    process: 'Preguntas',
    pricing: 'Cómo trabajo',
    blog: 'Blog',
    useCases: 'Casos de uso',
    demo: 'Demo',
    login: 'Iniciar sesión',
    signup: 'Cuéntame tu caso',
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
    sectionLabel: 'cómo trabajo_',
    heading: 'Cuatro pasos, y el último es soltarlo',
    subheading: 'No me quedo operando tu negocio. **Te lo dejo andando y me hago a un lado.**',
    steps: [
      { title: 'Te escucho', detail: 'Cómo vendes hoy, de verdad. Con sus mañas.' },
      { title: 'Lo construyo', detail: 'Empezando por lo que más te duele.' },
      { title: 'Lo probamos', detail: 'Con tus clientes reales, tú revisando.' },
      { title: 'Te lo entrego', detail: 'A tu nombre, con alguien tuyo entrenado.' },
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
    sectionLabel: 'antes de empezar_',
    heading: 'Te digo si tiene arreglo antes de cobrarte',
    body:
      'No todos los casos los resuelvo yo. Reviso cómo vendes, qué sistemas usas y quién decide. **Si veo que no te lo puedo dejar bien, te lo digo en la primera plática** — no a medio proyecto.',
    conditionsLabel: 'Qué necesito de tu lado',
    conditions: [
      'Que ya te lleguen mensajes de clientes',
      'Alguien que pueda decidir cómo se hace el trabajo',
      'Acceso a tu WhatsApp y a donde guardas tus clientes',
      'Una persona tuya que reciba el sistema al final',
    ],
    note: 'No es letra chica: sin esas cuatro, el trabajo no sale bien.',
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
    heading: 'Cuéntame qué se te está cayendo',
    subheading:
      'Cómo vendes hoy y qué se te pierde. **Te contesto con qué haría yo y cuánto tardaría.**',
    primary: 'Escríbeme por WhatsApp',
    secondary: 'Probar el sistema',
    trust: 'si no te lo puedo resolver, te lo digo de una vez',
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
    heading: 'Lo que todos preguntan',
    subheading: 'Respuestas cortas y honestas.',
    items: [
      {
        q: '¿Me van a bloquear el número?',
        a: 'No, si lo usas para contestar a quien te escribe. Se conecta con un código QR, igual que WhatsApp Web: tu mismo número, sin trámites con Meta. Lo que sí bloquea WhatsApp es mandar mensajes masivos a gente que no te buscó, y eso no lo hago.',
      },
      {
        q: '¿Va a sonar a robot?',
        a: 'Júzgalo tú. Ve al demo y ponle las preguntas que quieras antes de darme un solo dato. Si ahí te suena a robot, te va a sonar a robot con tus clientes.',
      },
      {
        q: '¿Puedo contestar yo cuando quiera?',
        a: 'Sí, chat por chat. Tomas la conversación y el sistema se calla en esa, y sigue atendiendo las demás. Tu número nunca deja de ser tuyo.',
      },
      {
        q: '¿Cuánto cuesta?',
        a: 'Depende de qué tanto hay que construir y con qué sistemas conectarlo. Darte un número antes de saberlo sería inventarlo. Cuéntame tu caso y te digo qué haría y cuánto sale, sin costo.',
      },
      {
        q: '¿Cuánto tarda?',
        a: 'Entre una y cuatro semanas, según qué se construya. Conectar tu número son cinco minutos; lo que toma tiempo es enseñarle tu catálogo, tus precios y cómo vendes tú.',
      },
      {
        q: '¿Tengo que cambiar de sistema?',
        a: 'No. Trabajo sobre lo que ya usas, aunque esté a medias. Cambiar de herramienta y ordenar la venta al mismo tiempo son dos broncas peleándose, y normalmente pierden las dos.',
      },
      {
        q: '¿Y si me arrepiento o me quiero ir?',
        a: 'Todo queda a tu nombre: tu número, tus cuentas, tu información. Te la puedes llevar cuando quieras. No hay nada que se apague porque yo deje de estar.',
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
   * Tercera versión, y la primera escrita sobre el negocio real.
   *
   * Las dos anteriores fallaron por el mismo motivo: describían a un cliente
   * que no existe. La primera vendía una plataforma por suscripción; la
   * segunda, delivery técnico para consultoras que subcontratan. El negocio de
   * verdad es más simple: **le construyo sistemas a pymes que venden por
   * WhatsApp, directo y a la medida.**
   *
   * Cuatro reglas de escritura, y son duras:
   *
   *  1. CERO inglés. Ni "workflow", ni "handoff", ni "human-in-the-loop". La
   *     versión anterior tenía 52 términos de jerga en 2,025 palabras —uno
   *     cada 39— y el propio dueño del negocio no la entendía.
   *  2. Frases de menos de 12 palabras.
   *  3. Un ancla en negrita por bloque, para poder escanear sin leer.
   *  4. Si una frase no la diría el dueño de una ferretería, no va.
   *
   * Y el tono lo decide un dato: hoy no llega nadie por el sitio. Así que no
   * le habla a alguien que ya nos conoce y viene a confirmar. Le habla a un
   * desconocido que tiene diez segundos.
   */
  home: {
    hero: {
      eyebrow: 'para negocios que venden por whatsapp',
      title: 'Vendes por WhatsApp.',
      titleAccent: 'Y ahí se te pierde.',
      subtitle:
        'Te construyo el sistema que lo arregla. **Hecho para tu negocio**, no una app que rentas.',
      ctaPrimary: 'Cuéntame tu caso',
      ctaSecondary: 'Ver qué construyo',
      note: 'me escribes por WhatsApp · te digo si tiene arreglo',
      /**
       * La tarjeta muestra una conversación real y lo que el sistema hizo
       * con ella. Nada de diagramas: es lo que le pasa a su negocio, escrito
       * como se lo contaría a un amigo.
       */
      card: {
        label: 'un_martes_cualquiera',
        cohort: 'Cliente nuevo',
        elapsed: '11:40 p.m.',
        contact: 'Ferretería · WhatsApp del negocio',
        why: '"¿Tienen compresores de 5 HP? Los necesito para el jueves."',
        messageLabel: 'contestó solo',
        message:
          'Sí, el de 5 HP trifásico está en $18,400 + IVA. Entrega en 48 horas. ¿Es para uso continuo o de rato?',
        checksLabel: 'y esto quedó guardado',
        checks: ['Quiere compresor · lo necesita el jueves', 'Siguiente paso: pasar cotización'],
        valueLabel: 'tardó',
        value: '8 segundos',
        timeLabel: 'tú',
        time: 'dormido',
        actionPrimary: 'Listo',
        actionSecondary: 'Ver chat',
      },
    },

    /** Los cuatro problemas, en las palabras del dueño. Nada más. */
    leak: {
      label: 'el problema_',
      title: 'Cuatro cosas te están costando dinero',
      body: 'Ninguna es culpa de nadie. **Pasan porque no hay sistema, solo memoria.**',
      items: [
        {
          title: 'No das abasto',
          detail: 'Llegan veinte mensajes juntos. Contestas los que alcanzas. **El resto se va con otro.**',
        },
        {
          title: 'Se pierde el seguimiento',
          detail: 'Cotizaste y nadie volvió a marcar. **La venta no se cayó: se olvidó.**',
        },
        {
          title: 'Capturas todo a mano',
          detail: 'Alguien pasa horas copiando datos de un lado a otro. **Eso no es trabajo, es desgaste.**',
        },
        {
          title: 'No sabes qué está pasando',
          detail: 'Preguntas cómo vamos y nadie tiene el número. **Hay que buscarlo.**',
        },
      ],
      quote: 'Tu negocio no falla por falta de ganas. Falla porque todo vive en la cabeza de alguien.',
    },

    /** Lo que construyo, una respuesta por problema. */
    cycle: {
      label: 'qué construyo_',
      title: 'Una solución para cada una',
      subtitle: 'No es un paquete. **Se arma con lo que tu negocio necesita.**',
      outputLabel: 'resultado',
      stages: [
        {
          id: 'contesta',
          index: '01',
          name: 'Que conteste',
          kicker: 'a cualquier hora',
          headline: 'Nadie se queda esperando.',
          bullets: [
            'Responde en segundos, con tus precios y tu información.',
            'Entiende notas de voz. **No pierdes la venta por no traer audífonos.**',
            'Cuando se pone difícil, te lo pasa a ti.',
          ],
          output: 'Cero mensajes sin contestar',
        },
        {
          id: 'sigue',
          index: '02',
          name: 'Que dé seguimiento',
          kicker: 'sin que te acuerdes',
          headline: 'La cotización no se queda enfriando.',
          bullets: [
            'Retoma solo al que dejó de contestar.',
            'Te avisa a quién hay que marcarle hoy. **Y por qué.**',
            'Agenda la cita dentro del mismo chat.',
          ],
          output: 'Nada se queda a medias',
        },
        {
          id: 'captura',
          index: '03',
          name: 'Que capture solo',
          kicker: 'se acabó el copiar y pegar',
          headline: 'Los datos se guardan donde van.',
          bullets: [
            'Nombre, empresa, qué quiere y cuánto: sale de la conversación.',
            'Entra a tu sistema sin que nadie lo teclee.',
            '**Las horas de captura se vuelven horas de vender.**',
          ],
          output: 'Cero captura manual',
        },
        {
          id: 'reporta',
          index: '04',
          name: 'Que te diga cómo vas',
          kicker: 'sin pedirle reportes a nadie',
          headline: 'Abres y ves el número.',
          bullets: [
            'Cuántos llegaron, cuántos contestaste, cuántos cerraron.',
            'En qué punto se te están cayendo. **Con nombre y apellido.**',
            'Sin hojas de cálculo ni juntas para averiguarlo.',
          ],
          output: 'El número, a la mano',
        },
      ],
    },

    /** Qué se instala y cuánto tarda. Tabla porque se compara. */
    engine: {
      label: 'cuánto tarda_',
      title: 'Empezamos por lo que más te duele',
      subtitle: 'No se construye todo de golpe. **Primero lo que te devuelve dinero más rápido.**',
      table: {
        cohort: 'Si lo tuyo es',
        trigger: 'Se instala',
        clock: 'Tarda',
        goal: 'Lo notas en',
      },
      cohorts: [
        {
          name: 'No dar abasto',
          trigger: 'Respuesta automática con tu catálogo',
          clock: '1 a 2 semanas',
          goal: 'La primera semana',
        },
        {
          name: 'Perder el seguimiento',
          trigger: 'Recordatorios y retomar conversaciones',
          clock: '2 a 3 semanas',
          goal: 'El primer mes',
        },
        {
          name: 'Capturar a mano',
          trigger: 'Conexión con tu sistema actual',
          clock: '2 a 4 semanas',
          goal: 'De inmediato',
        },
        {
          name: 'No saber cómo vas',
          trigger: 'Tablero con tus números',
          clock: '1 a 2 semanas',
          goal: 'El primer corte',
        },
      ],
      quote: 'Prefiero entregarte una cosa funcionando en tres semanas que cuatro a medias en tres meses.',
      clocks: {
        label: 'cómo se arma',
        items: [
          {
            name: 'Primero una',
            unit: 'la que más duele',
            detail:
              'Elegimos el problema que más te cuesta hoy. Eso se construye y se echa a andar. **Lo ves funcionando antes de decidir si sigues.**',
          },
          {
            name: 'Después lo demás',
            unit: 'si quieres',
            detail:
              'Con lo primero ya dando resultado, se agrega lo siguiente. **Sin contrato largo ni comprarlo todo por adelantado.**',
          },
        ],
      },
      play: {
        label: 'cómo empieza',
        title: 'Primero te digo si tiene arreglo.',
        detail:
          'Me cuentas cómo vendes hoy y qué se te cae. **Te contesto con qué haría yo y cuánto tardaría** — no con una presentación.',
        closing: 'Si lo tuyo no lo resuelvo yo, te lo digo ahí. No te cobro por averiguarlo.',
      },
      guardrails: {
        label: 'sin sorpresas',
        title: 'Nada se manda sin que tú lo apruebes.',
        detail:
          'Los mensajes se revisan contigo antes de encender nada. **Tú decides qué contesta solo y qué te pasa a ti.**',
        checksTitle: 'Tu número sigue siendo tuyo',
        checksDetail:
          'Se conecta a tu WhatsApp de siempre. **Puedes tomar cualquier chat cuando quieras** y el sistema se calla en ese.',
      },
    },

    /** Muy concreto: un mensaje, y qué quedó guardado. */
    intel: {
      label: 'cómo se ve_',
      title: 'De una conversación sale tu información',
      subtitle: 'Nadie captura nada. **Lo que el cliente dijo, ya está guardado.**',
      sourceLabel: 'lo que escribió el cliente',
      source:
        'Fíjate, ya lo vi con mi socio. El presupuesto lo tenemos hasta enero, ahorita no. Lo que nos preocupa es la instalación, porque con el proveedor anterior nos fue mal. Al final quien decide es mi papá.',
      fieldsLabel: 'lo que quedó guardado',
      fields: [
        { key: 'qué quiere', value: 'Instalación sin que le paren la operación' },
        { key: 'dinero', value: 'Sí hay · disponible en enero' },
        { key: 'cuándo', value: 'Enero · no es urgencia, es calendario' },
        { key: 'qué le preocupa', value: 'Le fue mal con el proveedor anterior' },
        { key: 'quién decide', value: 'El papá' },
        { key: 'qué sigue', value: 'Mandarle un caso parecido · marcar en enero' },
      ],
      aside: {
        title: 'Esto ya está funcionando.',
        detail:
          'No es una idea: es el sistema que construí y opero todos los días. **Puedes ir a probarlo ahora mismo** y ponerle las preguntas que quieras.',
        cta: 'Probarlo',
      },
    },

    /** Qué te queda. Sin promesas de resultado. */
    measure: {
      label: 'qué te queda_',
      title: 'Cuando termino, esto es tuyo',
      subtitle: 'No rentas nada. **Se queda en tu casa, a tu nombre.**',
      metrics: [
        {
          name: 'Tu número de WhatsApp',
          detail: 'El de siempre. Sin trámites con Meta y sin cambiar de línea.',
        },
        {
          name: 'Tus cuentas y tus accesos',
          detail: 'Todo a tu nombre. **Si me voy, no se apaga nada.**',
        },
        {
          name: 'Tu información, exportable',
          detail: 'Clientes, conversaciones e historial. Te los llevas cuando quieras.',
        },
        {
          name: 'Alguien de tu equipo entrenado',
          detail: 'Le enseño a una persona tuya a moverle. Grabado, para que lo vuelva a ver.',
        },
      ],
      moneyLabel: 'cuándo digo que ya quedó',
      moneyFormula:
        'contesta solo          + tú puedes cambiarle cosas\n+ los errores se ven    + tu gente sabe usarlo\n= terminado',
      moneyNote: 'Si falta una de las cuatro, no está terminado. Aunque ya esté prendido.',
    },

    scope: {
      label: 'para quién sí_',
      title: 'Con quién trabajo y con quién no',
      subtitle: 'Somos pocos. **Decir que no a tiempo nos ahorra tiempo a los dos.**',
      doTitle: 'Sí',
      does: [
        'Negocios que ya venden por WhatsApp y les llegan más mensajes de los que alcanzan.',
        'Equipos de 2 a 20 personas, donde el dueño todavía se mete a vender.',
        'Quien ya tiene clientes y quiere dejar de perderlos por lento o por olvido.',
        'Quien está dispuesto a enseñarme cómo vende de verdad, no cómo debería.',
      ],
      dontTitle: 'No',
      donts: [
        {
          title: 'Mandar mensajes masivos',
          detail: 'No hago envíos a gente que no te escribió. Es como te bloquean el número.',
        },
        {
          title: 'Negocios sin clientes todavía',
          detail: 'Si aún no llegan mensajes, esto no te sirve. Primero hay que traer gente.',
        },
        {
          title: 'Reemplazar a tu equipo',
          detail: 'Esto contesta y ordena. Cerrar y dar la cara sigue siendo de una persona.',
        },
        {
          title: 'Proyectos sin quién decida',
          detail: 'Necesito a alguien que pueda decir cómo se hace. Si no, se atora todo.',
        },
      ],
    },
  },
};

export type Translations = typeof es;
