import type { Testimonial } from './types';

export const es = {
  nav: {
    features: 'El proceso',
    engine: 'Se prueba',
    process: 'Preguntas',
    pricing: 'Cómo trabajo',
    blog: 'Blog',
    useCases: 'Casos de uso',
    demo: 'Demo',
    login: 'Iniciar sesión',
    signup: 'Aplicar',
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
    heading: 'Primero reviso el caso. Si hay encaje, hablamos.',
    subheading:
      'Cuéntame cómo vendes hoy y qué se te cae. **Lo reviso y te digo si puedo.**',
    primary: 'Aplicar',
    secondary: 'Ver el motor',
    trust: 'cinco preguntas por WhatsApp · contesto todas, haya encaje o no',
  },

  footer: {
    allGuides: 'Ver todas →',
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
  /**
   * Cinco, no ocho. Eran 267 palabras: la sección más pesada de la portada,
   * aunque estuviera colapsada. Las que salieron preguntaban por el bloqueo
   * del número y por si suena a robot — dudas del producto anterior, cuando
   * lo que se vendía era contestar WhatsApp.
   */
  faq: {
    sectionLabel: 'preguntas_',
    heading: 'Lo que todos preguntan',
    subheading: 'Respuestas cortas y honestas.',
    items: [
      {
        q: '¿Esto es un chatbot?',
        a: 'No. Un chatbot contesta mensajes. Esto arma la lista de a quién buscar, extrae lo que se dijo en cada llamada y lo escribe en tu CRM, y prepara la propuesta con lo que el cliente pidió. Contestar es una de las piezas, no el producto.',
      },
      {
        q: '¿Tengo que cambiar de CRM?',
        a: 'No. El sistema escribe en el que ya usas. Si no usas ninguno, ese es el primer problema y se resuelve antes de automatizar nada: sin un lugar donde escribir, no hay dónde dejar el rastro.',
      },
      {
        q: '¿Qué pasa cuando se equivoca?',
        a: 'Se equivoca, como cualquier sistema. Por eso nada que comprometa dinero o reputación sale sin que una persona lo apruebe, y por eso existe el set de prueba: para que el error aparezca en la evaluación y no frente a tu cliente.',
      },
      {
        q: '¿Hasta dónde actúa solo?',
        a: 'Hasta donde tú decidas, y se empieza abajo. Al principio sólo mira y recomienda; después prepara borradores; después ejecuta pero pidiéndote confirmación. Sube de nivel cuando pasa las pruebas acordadas, no cuando pasa el tiempo, y lo que sale hacia un cliente sigue necesitando que alguien lo apruebe.',
      },
      {
        q: '¿Cuánto cuesta?',
        a: 'Depende de a cuántos sistemas hay que conectarse y de qué tan complejas son tus propuestas. Cotizar antes de saber eso obliga a inventar un número. La aplicación no cuesta nada, y de ahí sale la cifra.',
      },
      {
        q: '¿Por qué se aplica en vez de agendar?',
        a: 'Porque tomo pocos proyectos a la vez y no todos los puedo resolver yo. Cinco preguntas me dicen si tiene caso que hablemos. Si no lo tiene, te lo digo en la respuesta y no te gasto una hora para averiguarlo.',
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
   * Cuarta versión. Las tres anteriores le hablaban a un cliente equivocado:
   * una plataforma por suscripción, luego delivery técnico para consultoras
   * que subcontratan, luego pymes que venden por WhatsApp.
   *
   * Esta parte de la tesis real del negocio, que es más ancha que un canal:
   * **prospectar, seguir y cerrar**, con agentes que corren esa operación y
   * con evaluaciones que prueban que sirven antes de dejarlos hablar con un
   * cliente. WhatsApp sigue estando — es de donde entra buena parte de la
   * señal — pero es una pieza, no el producto.
   *
   * Cuatro reglas de escritura:
   *
   *  1. Inglés solo para nombres propios de herramientas: Clay, Apollo,
   *     LinkedIn Sales Navigator, Granola. Cero jerga de consultoría. La
   *     versión que tenía 52 términos en 2,025 palabras no la entendía ni el
   *     dueño del negocio.
   *  2. Frases de menos de 12 palabras.
   *  3. Un ancla en negrita por bloque, para poder escanear sin leer.
   *  4. Una idea visible por sección. Lo demás va dentro de <Mas>, que lo
   *     colapsa y anuncia cuánto tarda leerlo.
   *
   * El presupuesto, y es duro: **320 palabras visibles sin abrir nada.** Eran
   * 1,384, siete minutos de lectura antes de entender qué se vende. El tono lo
   * decide el mismo dato de siempre: le habla a un desconocido que tiene diez
   * segundos, no a alguien que viene a confirmar lo que ya sabe.
   */
  /**
   * ══ EL RECORRIDO ════════════════════════════════════════════
   *
   * No enseña el sistema: hace que el visitante intente el trabajo PRIMERO y
   * después le muestra qué se le fue. Esa diferencia es todo el diseño.
   *
   * Un recorrido que solo muestra pantallas se lee como folleto. Uno donde
   * eliges la cuenta equivocada, o marcas tres de seis campos, produce el
   * único argumento que no se puede discutir: te pasó a ti, hace diez
   * segundos, con el ejemplo más fácil posible.
   *
   * La gamificación es seca a propósito. Nada de confeti ni de puntos
   * inventados: el marcador cuenta CAMPOS CAPTURADOS y segundos reales
   * medidos en el navegador. Un marcador honesto pega más fuerte que uno
   * generoso, y además encaja con el resto del sitio.
   *
   * Datos sembrados y empresas inventadas, rotulado en pantalla. El dashboard
   * real manda WhatsApps y borra leads; no se le abre a un anónimo.
   */
  recorrido: {
    etiqueta: 'recorrido',
    salir: 'Salir',
    aviso: 'datos de ejemplo · empresas inventadas',
    responder: 'Ver qué hizo el sistema',
    siguiente: 'Siguiente',
    ultimo: 'Ver mi marcador',
    tuTiempo: 'te tomó',
    sistemaTiempo: 'el sistema',
    elegiste: 'elegiste',
    pasos: [
      {
        id: 'prospectar',
        indice: '01',
        titulo: '¿A quién le marcas hoy?',
        instruccion: 'Tienes cinco minutos antes de tu siguiente junta. Una sola llamada. **Elige una.**',
        tipo: 'una',
        opciones: [
          {
            id: 'zenith',
            texto: 'Grupo Zenith',
            detalle: 'Último contacto: hace 3 meses · cotización enviada',
            acierto: true,
          },
          {
            id: 'delta',
            texto: 'Delta Industrial',
            detalle: 'Último contacto: hace 2 semanas · dijeron que no',
            acierto: false,
          },
          {
            id: 'norte',
            texto: 'Norte Logística',
            detalle: 'Último contacto: hace 8 meses · pidió precios',
            acierto: false,
          },
          {
            id: 'sur',
            texto: 'Aceros del Sur',
            detalle: 'Último contacto: ayer · todo en orden',
            acierto: false,
          },
        ],
        revelacion: {
          titulo: 'El sistema marcó Grupo Zenith.',
          cuerpo: 'No por la fecha del último contacto, que es lo único que te daba el CRM. **Abrieron planta nueva y contrataron cuarenta personas en operaciones este trimestre.** Esa señal no estaba en tu lista.',
          puntos: [
            'Delta dijo que no hace dos semanas, pero cambió de director comercial. Vuelve a la lista en marzo, no hoy.',
            'Norte pidió precios hace ocho meses y su contrato vence en marzo. Es la siguiente, no la de hoy.',
            'Aceros del Sur está atendido. Marcarle hoy gasta tu única llamada.',
          ],
        },
      },
      {
        id: 'seguir',
        indice: '02',
        titulo: '¿Qué te llevas de esta llamada?',
        instruccion: 'Colgaste hace un minuto. **Marca todo lo que deba quedar registrado.** Hay seis cosas.',
        cita: 'Ya lo vi con mi socio y nos interesa, pero el presupuesto lo tenemos hasta enero. Lo que nos preocupa es la instalación, porque con el proveedor anterior nos pararon la línea tres días. Al final quien decide es mi papá, y él quiere ver un caso parecido antes de firmar.',
        tipo: 'varias',
        opciones: [
          { id: 'necesidad', texto: 'Qué quiere: instalar sin parar la operación', acierto: true },
          { id: 'dinero', texto: 'Presupuesto: sí hay, disponible en enero', acierto: true },
          { id: 'plazo', texto: 'Plazo: enero — es calendario, no urgencia', acierto: true },
          { id: 'objecion', texto: 'Objeción: le pararon la línea tres días', acierto: true },
          { id: 'decisor', texto: 'Quién decide: el papá', acierto: true },
          { id: 'siguiente', texto: 'Siguiente paso: mandarle un caso parecido', acierto: true },
          { id: 'socio', texto: 'Tiene un socio', acierto: false },
          { id: 'amable', texto: 'Sonó interesado', acierto: false },
        ],
        revelacion: {
          titulo: 'El sistema sacó las seis sin que nadie abriera el CRM.',
          cuerpo: 'Y creó la tarea: **marcar el 8 de enero, responsable Ana.** No un recordatorio suelto — una tarea con fecha, dueño y todo el contexto de arriba pegado.',
          puntos: [
            '"Tiene un socio" y "sonó interesado" no son campos: no cambian qué haces mañana.',
            'La objeción importa más que el presupuesto. Sin ella, la propuesta no menciona la contingencia y el papá no firma.',
            'Lo que se te fue no se pierde por descuido. Se pierde porque nadie transcribe una llamada de 32 minutos.',
          ],
        },
      },
      {
        id: 'cerrar',
        indice: '03',
        titulo: '¿Cuánto tardas en armar esa propuesta?',
        instruccion: 'Con lo que acabas de escuchar. Catálogo, precios, el caso parecido que pidió el papá. **Sé honesto.**',
        tipo: 'una',
        opciones: [
          { id: 'veinte', texto: '20 minutos', detalle: 'Si tengo la plantilla a la mano', acierto: false },
          { id: 'hora', texto: 'Una hora', detalle: 'Buscando precios y el caso parecido', acierto: true },
          { id: 'medio', texto: 'Media tarde', detalle: 'Y la mando mañana', acierto: true },
          { id: 'semana', texto: 'Se queda pendiente', detalle: 'Y a los tres días ya no es urgente', acierto: true },
        ],
        revelacion: {
          titulo: 'El borrador ya estaba hecho cuando colgaste.',
          cuerpo: 'Con el alcance por etapas que pidió, el arranque en enero, **la contingencia por lo que le pasó con el proveedor anterior** y el precio del catálogo aprobado. No inventa cifras.',
          puntos: [
            'Sale como borrador, sin enviar. Una persona lo lee y lo manda.',
            'La parte cara de una propuesta no es escribirla: es acordarse de lo que dijo el cliente tres semanas después.',
            'Si la respuesta honesta fue "se queda pendiente", ahí está la venta que se cae. No en la llamada.',
          ],
        },
      },
      {
        id: 'prueba',
        indice: '04',
        titulo: '¿Lo dejas hablar con tu cliente?',
        instruccion: 'Corriste el set de prueba. Treinta y tres de treinta y cuatro casos pasaron. **Tú decides.**',
        tipo: 'una',
        opciones: [
          { id: 'enciende', texto: 'Enciéndelo', detalle: '97% está bien para empezar', acierto: false },
          { id: 'revisa', texto: 'Revisa el caso que falló primero', detalle: 'Aunque sea uno', acierto: true },
        ],
        revelacion: {
          titulo: 'Se revisa. Siempre.',
          cuerpo: 'El caso que falló es "pregunta fuera de catálogo". Si sale así a producción, **el agente inventa una respuesta delante de tu cliente** — y ese es exactamente el error que hace que la gente no vuelva a confiar en un sistema.',
          puntos: [
            'El set se arma con conversaciones reales, incluidas las que salieron mal.',
            'El criterio de qué cuenta como buena respuesta se escribe antes de la prueba, no después.',
            'Cada cambio vuelve a correr el set completo: si un ajuste arregla un caso y rompe otro, se ve el mismo día.',
          ],
        },
      },
    ],
    marcador: {
      etiqueta: 'tu marcador',
      titulo: 'Esto fue con el ejemplo fácil.',
      cuerpo: 'Una llamada, un cliente, sin teléfono sonando. **Tu operación real tiene más ruido que esto.**',
      camposLinea: 'campos capturados',
      tiempoLinea: 'te tomó',
      sistemaLinea: 'sin que nadie abriera el CRM',
      cierreTitulo: 'Lo que viste son datos de ejemplo.',
      cierreCuerpo: 'Lo que se construye sale de cómo vendes tú: qué sistemas usas, dónde se te cae y quién decide. Eso se revisa en una llamada de treinta minutos.',
      cta: 'Agendar una llamada',
      salir: 'Volver al inicio',
      nota: 'si no hay encaje te lo digo ahí mismo',
    },
  },
  home: {
    hero: {
      eyebrow: 'prospectar · seguir · cerrar',
      title: 'Prospectar, seguir y cerrar.',
      titleAccent: 'Sin capturar cada paso a mano.',
      subtitle:
        'Priorizan cuentas, registran lo acordado y preparan la propuesta. **Se prueban con tus casos antes de operar.**',
      ctaPrimary: 'Aplicar',
      ctaSecondary: 'Ver el motor',
      note: 'tomo pocos a la vez · reviso cada caso, haya encaje o no',
    },

    /** Las cuatro fugas. Titular y una línea. Nada más. */
    leak: {
      label: 'el problema_',
      title: 'El pipeline no se cae. Se olvida.',
      body: 'Cuatro fugas, y ninguna aparece en el reporte.',
      items: [
        {
          title: 'No sabes a quién buscar',
          detail: 'A mano. **O no se arma.**',
        },
        {
          title: 'Lo que se dijo se pierde',
          detail: 'Colgaste y nadie escribió nada.',
        },
        {
          title: 'El seguimiento vive en la memoria',
          detail: '**Cuando alguien se acuerda.**',
        },
        {
          title: 'La propuesta tarda días',
          detail: 'Desde cero. Otra vez.',
        },
      ],
      quote: 'No falta esfuerzo. Falta sistema.',
    },

    /**
     * El motor. Tres etapas, una línea visible cada una.
     *
     * La versión anterior eran cuatro etapas con tres viñetas cada una: 201
     * palabras y doce elementos de lista, la segunda sección más pesada de la
     * página. Lo que se leía sin abrir nada era casi todo. Ahora cada etapa
     * dice una frase y el resto vive en <Mas>, que además anuncia cuánto
     * tarda leerlo.
     */
    cycle: {
      label: 'el motor_',
      title: 'Un proceso. El mismo contexto.',
      subtitle: 'Lo que se aprende prospectando **acompaña al seguimiento y a la propuesta.**',
      outputLabel: 'resultado',
      masLabel: 'cómo funciona',
      stages: [
        {
          id: 'prospectar',
          index: '01',
          name: 'Prospectar',
          kicker: 'antes del primer mensaje',
          headline: 'Saber a quién buscar antes de buscarlo.',
          detalle: [
            'La lista se arma con **Clay, Apollo y LinkedIn Sales Navigator**. Se cruza con tu CRM para no volver a tocar a quien ya dijo que no.',
            'El primer mensaje lleva una razón real para escribir. Algo que pasó en esa empresa, no un campo en una plantilla.',
          ],
          output: 'Lista con razón de contacto',
        },
        {
          id: 'seguir',
          index: '02',
          name: 'Seguir',
          kicker: 'sin que nadie se acuerde',
          headline: 'Lo que se dijo en la llamada no se queda en la llamada.',
          detalle: [
            '**Granola transcribe y el sistema extrae**: qué se acordó, quién decide, qué falta y para cuándo. Lo escribe en el CRM que ya usas.',
            'Lo mismo con WhatsApp y con el correo. Sale una tarea con responsable y fecha, no un recordatorio suelto que nadie abre.',
          ],
          output: 'Tarea con responsable y fecha',
        },
        {
          id: 'cerrar',
          index: '03',
          name: 'Cerrar',
          kicker: 'con lo que el cliente dijo',
          headline: 'La propuesta parte de lo que el cliente ya dijo.',
          detalle: [
            'El borrador sale con los requisitos, los acuerdos y los pendientes de la conversación, contra tu catálogo y tus precios aprobados. Nadie vuelve a reconstruirlo desde cero.',
            '**Sale como borrador.** Alguien lo lee y lo manda. El sistema no manda propuestas solo, y esa es una decisión de diseño, no una limitación.',
          ],
          output: 'Borrador listo para revisar',
        },
      ],
    },

    /**
     * La categoría.
     *
     * Existe porque la objeción real del visitante no es "¿funciona?" sino
     * "¿en qué se diferencia de los otros veinte que me escribieron?". Y esa
     * no se contesta con adjetivos: se contesta poniendo las dos columnas
     * juntas y dejando que compare.
     *
     * Seis renglones y ninguna prosa. Es la sección que más rápido se lee de
     * la página a propósito — va justo después del diagnóstico, donde el
     * visitante todavía está decidiendo si esto es otra agencia de bots.
     */
    shift: {
      label: 'la categoría_',
      title: 'No es un bot con mejor prompt',
      subtitle:
        'La diferencia no está en el modelo. **Está en todo lo que va alrededor del modelo.**',
      commonTitle: 'Lo que se vende como IA',
      omonaTitle: 'Lo que se construye aquí',
      rows: [
        { common: 'Un bot que contesta preguntas', omona: 'Un proceso comercial que se completa' },
        { common: 'Un flujo lineal en n8n o Make', omona: 'Estado, decisiones y recuperación de errores' },
        { common: 'Una demo armada con prompts', omona: 'Producción con pruebas y control de versiones' },
        { common: 'Se mide en mensajes atendidos', omona: 'Se mide en oportunidades que avanzaron' },
        { common: 'Automatizar todo de golpe', omona: 'Autonomía por niveles, con aprobaciones' },
        { common: 'Una integración suelta', omona: 'CRM, correo, calendario y datos en una sola capa' },
      ],
    },

    /**
     * Los niveles de autonomía.
     *
     * Es la respuesta a la pregunta que todo director comercial hace en
     * silencio: "¿y si le manda una babosada a mi mejor cuenta?". La respuesta
     * honesta no es "no pasa" — es esta escala, donde lo que sale a un cliente
     * requiere que alguien lo apruebe hasta que haya evidencia de lo contrario.
     *
     * Seis renglones de una línea. Es información densa en el formato más
     * rápido de leer que existe: una escala numerada.
     */
    ladder: {
      label: 'cuánta autonomía_',
      title: 'Empieza mirando. No tocando.',
      subtitle:
        'Seis niveles. **Se sube cuando el anterior pasa las pruebas, no cuando pasa el tiempo.**',
      levelWord: 'nivel',
      levels: [
        { n: '0', name: 'Observa', detail: 'Lee el pipeline y detecta lo que se está cayendo. No cambia nada.' },
        { n: '1', name: 'Recomienda', detail: 'Dice a quién seguir primero y por qué, con la evidencia.' },
        { n: '2', name: 'Prepara', detail: 'Deja el correo, la tarea o la propuesta listos para revisar.' },
        { n: '3', name: 'Ejecuta con permiso', detail: 'Manda y registra, pero sólo después de que tú confirmas.' },
        { n: '4', name: 'Ejecuta por regla', detail: 'Tareas, notas y campos seguros sin preguntar cada vez.' },
        { n: '5', name: 'Autónomo acotado', detail: 'Opera el ciclo completo y te escala lo que se sale de la regla.' },
      ],
      note: 'Lo que sale hacia un cliente no pasa del 3 mientras tú no lo decidas.',
      mas: {
        resumen: 'cómo se sube de nivel',
        parrafos: [
          'Antes de empezar se escribe qué tiene que pasar para subir: **cuánto coincide con lo que tu equipo habría hecho**, cuántas alertas salieron falsas, cuántos borradores se mandaron sin reescribir y cero acciones fuera de la regla.',
          'Se escribe también lo contrario: qué evento lo baja de nivel. Una queja de un cliente, una acción que no debía salir, o una caída sostenida en la calidad de los borradores.',
          'Y la autonomía se define por acción, no por sistema. El mismo agente puede estar en nivel 4 para escribir en tu CRM y en nivel 2 para cualquier cosa que salga por correo.',
        ],
      },
    },

    /**
     * Enlaces a las guías largas. Van en el pie por la misma razón que la
     * columna de problemas: es la superficie donde alguien que llegó a leer
     * encuentra lo siguiente que leer, y es el único sitio de la portada que
     * reparte enlaces hacia el corpus.
     */
    guides: {
      label: 'guías_',
      items: [
        { slug: 'gtm-ai-engineering-que-es', short: 'Qué es GTM AI Engineering' },
        { slug: 'niveles-autonomia-agente-comercial', short: 'Los 6 niveles de autonomía' },
        { slug: 'agente-recuperacion-pipeline', short: 'Recuperar el pipeline' },
        { slug: 'evaluaciones-agentes-comerciales-evals', short: 'Cómo se prueba un agente' },
        { slug: 'crm-first-no-solo-whatsapp', short: 'Por qué no sólo WhatsApp' },
        { slug: 'cuanto-cuesta-agente-ia-ventas-mexico', short: 'Cuánto cuesta' },
        { slug: 'plan-90-dias-agente-comercial', short: 'Plan de 90 días' },
      ],
    },

    /** El único visual concreto del sitio: entra una frase, salen campos. */
    intel: {
      label: 'cómo se ve_',
      title: 'De una conversación salen datos',
      subtitle: 'Nadie captura nada. **Ya está escrito.**',
      sourceLabel: 'lo que dijo el cliente',
      source:
        'Ya lo vi con mi socio. Presupuesto hasta enero. Nos preocupa la instalación. Decide mi papá.',
      fieldsLabel: 'lo que quedó guardado',
      fields: [
        { key: 'qué quiere', value: 'Instalar sin parar la operación' },
        { key: 'dinero', value: 'Sí hay · enero' },
        { key: 'cuándo', value: 'Enero · calendario, no urgencia' },
        { key: 'qué le preocupa', value: 'Le fue mal con el anterior' },
        { key: 'quién decide', value: 'El papá' },
        { key: 'qué sigue', value: 'Marcar el 8 de enero' },
      ],
      aside: {
        title: 'Esto ya está funcionando.',
        detail: 'No es una idea. **Es el sistema que opero todos los días.**',
        cta: 'Probarlo',
      },
    },

    /**
     * La sección que separa esto de un chatbot.
     *
     * Reemplaza a la de "qué te queda". El contenido viene de la mitad menos
     * comentada de la vacante de Anthropic: la otra parte del trabajo es
     * construir las evaluaciones que prueban que el agente sirve antes de
     * dejarlo hablar con un cliente. Dicho sin la palabra "eval".
     */
    measure: {
      label: 'antes de encenderlo_',
      title: 'Se prueba antes de hablar con un cliente',
      subtitle: 'Un agente que nadie evaluó es una apuesta. **Aquí se mide.**',
      metrics: [
        {
          name: 'Casos reales, no ejemplos',
          detail: 'Se arma con tus conversaciones, **incluidas las que salieron mal.**',
        },
        {
          name: 'El criterio se escribe antes',
          detail: 'Qué es una buena respuesta se define antes.',
        },
        {
          name: 'Cada cambio se vuelve a correr',
          detail: 'Si un ajuste rompió otro caso, **se ve.**',
        },
        {
          name: 'Lo sensible pasa por una persona',
          detail: 'Nada que comprometa dinero sale sin aprobación.',
        },
      ],
      /**
       * La corrida de evaluaciones que dibuja <Terminal>. Los conteos son de
       * un SET DE PRUEBA, no resultados de negocio: dicen cuántos casos pasó
       * el agente, no cuánto vendió nadie. El caso que falla va a propósito —
       * una corrida donde todo pasa no la cree nadie, y el punto de la
       * sección es justamente que los errores se vean antes de producción.
       */
      terminal: {
        comando: 'omona eval --set ventas --casos 34',
        casos: [
          { nombre: 'pide precio sin dar contexto', marca: '✓', conteo: '12/12', ok: true },
          { nombre: 'objeción: ya tenemos proveedor', marca: '✓', conteo: '9/9', ok: true },
          { nombre: 'pregunta fuera de catálogo', marca: '!', conteo: '7/8', ok: false },
          { nombre: 'cliente molesto → escala a una persona', marca: '✓', conteo: '5/5', ok: true },
        ],
        resumen: '33 de 34. **El que falló se revisa antes de encender nada.**',
      },
      moneyLabel: 'cuándo digo que ya quedó',
      moneyFormula:
        'pasa el set de prueba   + tu gente sabe operarlo\n+ los errores se ven     + tú puedes cambiarle cosas\n= terminado',
      moneyNote: 'Si falta una de las cuatro, no está terminado. Aunque ya esté prendido.',
    },

    scope: {
      label: 'para quién sí_',
      title: 'Con quién trabajo y con quién no',
      subtitle: 'Tomo pocos a la vez. **Decir que no a tiempo nos ahorra el tiempo a los dos.**',
      doTitle: 'Sí',
      does: [
        'Venta consultiva, ciclo largo, varios decisores.',
        'Pierdes por olvido, no por falta de demanda.',
        'Me dejas ver cómo vendes de verdad.',
        'Hay alguien que puede decidir.',
      ],
      dontTitle: 'No',
      donts: [
        {
          title: 'Mensajes masivos',
          detail: 'A quien no te escribió. Así bloquean números.',
        },
        {
          title: 'Negocios sin clientes',
          detail: 'Sin conversaciones no hay de dónde sacar datos.',
        },
        {
          title: 'Reemplazar a tu equipo',
          detail: 'Prepara el trabajo. Cerrar sigue siendo de una persona.',
        },
        {
          title: 'Proyectos sin quien decida',
          detail: 'Sin quien defina el proceso, se atora.',
        },
      ],
      /**
       * Lo rescatable de la sección "cuánto tarda", que salió de la portada
       * por pesar 265 palabras en cinco bloques distintos. Aquí vive colapsado:
       * es la pregunta que hace quien ya se convenció, no quien está llegando.
       */
      mas: {
        resumen: 'cómo empieza y cuánto tarda',
        parrafos: [
          'No se construye todo de golpe. **Elegimos lo que más te cuesta hoy** y eso se echa a andar. Lo ves funcionando antes de decidir si sigues.',
          'La primera pieza tarda entre dos y cuatro semanas, según a cuántos sistemas haya que conectarse. Lo siguiente se agrega sobre lo que ya quedó, sin contrato largo ni comprarlo todo por adelantado.',
          'Si lo tuyo no lo resuelvo yo, te lo digo en la primera respuesta. **No cobro por averiguarlo.**',
        ],
      },
    },
  },
};

export type Translations = typeof es;
