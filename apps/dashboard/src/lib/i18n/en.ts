import type { Translations } from './es';
import type { Testimonial } from './types';

export const en: Translations = {
  nav: {
    features: 'The process',
    engine: 'Testing',
    process: 'Questions',
    pricing: 'How I work',
    blog: 'Blog',
    useCases: 'Use cases',
    demo: 'Demo',
    login: 'Sign in',
    signup: 'Apply',
  },

  hero: {
    // `chat` is kept because it is the text baked into the ChatRespondiendo loop
    // (apps/video); if it changes there, change it here.
    badge: 'Commercial intelligence for B2B teams',
    tagline: 'Month closed. Nobody filled the CRM.',
    subtagline: 'Commercial intelligence for B2B teams selling on WhatsApp: every conversation lands in your CRM on its own, with its next task, its owner and its due date.',
    cta: 'Book a diagnostic',
    whatsapp: 'WhatsApp',
    whatsappLink: 'Or try it yourself in the demo',
    setup: '30-minute diagnostic · No charge',
    companies: 'Your existing number. No Meta approval needed.',
    chatContext: 'Industrial hardware supplier · Monday 11:40 PM',
    chat: [
      { role: 'user', text: 'Do you carry 5 HP compressors? I need them by Thursday' },
      { role: 'agent', text: 'Yes, we stock the 5 HP three-phase at $18,400 + tax, delivered in 48h. Is it for continuous or intermittent use?' },
      { role: 'user', text: "Continuous, it's for a workshop" },
      { role: 'agent', text: 'Then the 300 L tank model is the better fit. Let me put the quote together and send it over. What company name should I bill it to?' },
    ],
  },
  stats: [
    { value: 'Seconds', label: 'to reply, at any hour' },
    { value: 'No limit', label: 'on concurrent conversations' },
    { value: 'Voice notes', label: 'understood and answered' },
    { value: 'Books itself', label: 'the meeting, inside the chat' },
  ],
  features: {
    sectionLabel: 'features_',
    heading: "Not your basic chatbot",
    subheading: 'It does not reply with canned phrases: it understands the question, checks your information and acts.',
    crm: {
      title: 'Your CRM, living inside Omona',
      subtitle: 'Every conversation the agent handles turns itself into a contact and an opportunity, with nobody typing anything in by hand.',
      bullet1: 'Visual pipeline: every lead the agent handles shows up as an opportunity on the board, with stage and value.',
      bullet2: 'Contacts enriched automatically: school, role, and contact details with zero manual entry.',
      bullet3: 'Your team takes over anytime: move stages, create tasks, and leave notes on the agent conversation.',
      bullet4: 'And it tells you where you are losing them: how many conversations come in, how fast they get answered and which stage they drop at.',
    },
    items: [
      {
        title: 'Understands what they ask',
        subtitle: 'Even when it is not in the script',
        description: 'It reads the whole message, works out what the customer needs and answers with the real information from your catalog. If they push back, it acknowledges the objection and handles it.',
        tech: 'reasons before replying',
        videoAlt: 'A customer asks about a compressor at 11:40 at night and the agent replies with price and delivery time.',
      },
      {
        title: 'Understands voice notes',
        subtitle: 'Nobody listens to those twice',
        description: 'It transcribes the audio they send you and answers what they actually said. You do not lose the sale for not having headphones on.',
        tech: 'transcribes the audio',
        videoAlt: 'A voice note is transcribed into text and the agent answers what the customer asked for.',
      },
      {
        title: 'Books the meeting itself',
        subtitle: 'No back-and-forth needed',
        description: 'When it detects the customer is ready, it checks your real availability, offers concrete slots and confirms the meeting inside the same chat.',
        tech: 'connected to your calendar',
        videoAlt: 'The agent offers three slots, the customer picks one and the appointment lands on the calendar.',
      },
      {
        title: 'Follows up on its own',
        subtitle: 'The conversation stays warm',
        description: 'If the customer went quiet, the agent picks the conversation back up by itself with a message that makes sense for what you were discussing.',
        tech: 'revives cold chats',
        videoAlt: 'Twenty-four hours pass with no reply and the agent picks the conversation back up on its own.',
      },
      {
        title: 'Knows when to call a human',
        subtitle: 'And hands the chat over',
        description: 'If the customer gets annoyed, hesitates or asks something out of scope, it escalates to your team and flags it. Whoever steps in sees the full history.',
        tech: 'knows when to step out',
        videoAlt: 'The customer asks for a discount, the agent escalates and a teammate picks it up with the full context.',
      },
      {
        title: 'Leaves your CRM already sorted',
        subtitle: 'A board by stage',
        description: 'Every customer shows up on a board with their stage, their history and everything they said. And it tells you where you are losing them.',
        tech: 'CRM and analytics included',
        videoAlt: 'A lead card appears in the pipeline, its fields fill themselves in and it moves to the Qualified stage.',
      },
    ],
  },
  howItWorks: {
    sectionLabel: 'how i work_',
    heading: 'Four steps, and the last one is letting go',
    subheading: 'I do not stay running your business. **I leave it working and step aside.**',
    steps: [
      { title: 'I listen', detail: 'How you really sell today. Quirks included.' },
      { title: 'I build it', detail: 'Starting with whatever hurts most.' },
      { title: 'We test it', detail: 'With your real customers, you reviewing.' },
      { title: 'I hand it over', detail: 'In your name, with one of your people trained.' },
    ],
  },
  offerStack: {
    sectionLabel: 'system_',
    heading: 'What gets implemented',
    subheading: 'Four modules that turn loose conversations into data, tasks and proposals.',
    modules: [
      {
        title: 'Capture and classification',
        detail: 'WhatsApp, email and calendar land in the same place. Every message is tied to its company, its contact and its opportunity.',
      },
      {
        title: 'Conversation intelligence',
        detail: 'Every conversation yields needs, budget, objections and next steps as structured fields, not as a loose paragraph.',
      },
      {
        title: 'Follow-up that never slips',
        detail: 'A task with an owner and a date, a reminder before it comes due, and escalation to leadership if the opportunity goes quiet.',
      },
      {
        title: 'Proposal drafts',
        detail: 'Built from your catalog, your prices and your approved terms. They always go through human review before they go out.',
      },
    ],
    bonusLabel: 'And also included',
    bonuses: [
      'A map of your current sales process',
      'A CRM field dictionary',
      'A library of approved follow-up templates',
      'A pipeline dashboard for leadership',
      'A CRM data quality audit',
      'Adoption coaching with your team',
    ],
  },
  guarantee: {
    sectionLabel: 'before we start_',
    heading: 'I tell you if it can be fixed before charging you',
    body:
      'I cannot solve every case. I look at how you sell, what systems you use and who decides. **If I can see I cannot leave it working well, I say so in the first conversation** — not halfway through.',
    conditionsLabel: 'What I need from you',
    conditions: [
      'That customer messages are already coming in',
      'Someone who can decide how the work gets done',
      'Access to your WhatsApp and to wherever you keep customers',
      'One of your people to receive the system at the end',
    ],
    note: 'Not fine print: without those four, the work does not come out well.',
  },
  useCases: {
    sectionLabel: 'use_cases_',
    heading: 'Works for your business',
    subheading: 'If you sell on WhatsApp, Omona sells for you.',
    clientLabel: 'client →',
    items: [
      {
        tag: 'services',
        href: '/casos-de-uso/servicios',
        title: 'Service businesses',
        description: 'Agencies, consultants, freelancers. Omona answers quotes, qualifies prospects, and books discovery calls while you work.',
        example: '"How much does web design cost?"',
        metrics: 'Response in <1s · Custom quote · Demo booked',
      },
      {
        tag: 'health',
        href: '/casos-de-uso/clinicas',
        title: 'Clinics & medical offices',
        description: 'Dentists, therapists, vet clinics. Omona books appointments, sends reminders, and answers FAQs about services and pricing.',
        example: '"Do you have appointments available tomorrow?"',
        metrics: 'Auto-scheduling · 24h reminder · No receptionist',
      },
      {
        tag: 'real estate',
        href: '/casos-de-uso/bienes-raices',
        title: 'Real estate',
        description: 'Developers, brokers, agencies. Omona filters prospects by budget, area, and property type before your agent steps in.',
        example: '"Looking for an apartment in Polanco, max 5M"',
        metrics: 'Qualified lead · Budget filter · Smart handoff',
      },
      {
        tag: 'education',
        href: '/casos-de-uso/educacion',
        title: 'Schools & courses',
        description: 'Universities, bootcamps, academies. Omona answers program, pricing, and scholarship questions, and books admission interviews automatically.',
        example: '"What does the data science master include?"',
        metrics: 'Program info · Scholarships · Enrollment booked',
      },
    ],
  },
  cta: {
    heading: 'I review the case first. If it fits, we talk.',
    subheading:
      'Tell me how you sell today and what is slipping. **I review it and tell you if I can help.**',
    primary: 'Apply',
    secondary: 'See the engine',
    trust: 'five questions over WhatsApp · I answer every one, fit or not',
  },

  footer: {
    login: 'Log in',
    signup: 'Sign up',
    demo: 'Demo',
    copyright: 'omona by anthana · made with ♥ in méxico',
  },
  pricing: {
    sectionLabel: 'pricing_',
    heading: 'Simple & transparent',
    subheading: '14-day free trial on any plan. No credit card. Cancel anytime.',
    starter: {
      label: 'starter_',
      price: '$499',
      currency: 'MXN/mo',
      usd: '~$25 USD/mo · For SMBs getting started',
      cta: 'Start free for 14 days',
    },
    pro: {
      label: 'pro_',
      price: '$1,499',
      currency: 'MXN/mo',
      usd: '~$75 USD/mo · For growing businesses',
      cta: 'Start free for 14 days',
      badge: 'Popular',
    },
    starterFeatures: [
      { text: 'AI agent 24/7 for WhatsApp', included: true },
      { text: 'Response in under 1 second', included: true },
      { text: 'Lead qualification (score 0-100)', included: true },
      { text: 'Built-in CRM with Kanban pipeline', included: true },
      { text: 'Full conversation history', included: true },
      { text: 'Knowledge base (docs/PDF)', included: true },
      { text: 'Basic reports', included: true },
      { text: 'Automatic appointment booking', included: false },
      { text: 'Automated follow-up', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'Webhooks & integrations', included: false },
    ],
    proFeatures: [
      { text: 'Everything in Starter' },
      { text: 'Automatic appointment booking' },
      { text: 'Automated lead follow-up' },
      { text: 'Advanced analytics & response time' },
      { text: 'Custom webhooks & integrations' },
      { text: 'Broadcast to filtered contacts' },
      { text: 'Multiple team members' },
      { text: 'Priority WhatsApp support' },
    ],
    stats: [
      { value: 'Unlimited', label: 'conversations' },
      { value: '14 days', label: 'free trial' },
      { value: '0.8s', label: 'response time' },
      { value: 'Cancel', label: 'anytime' },
    ],
    faqHeading: 'Frequently asked questions',
    faqs: [
      {
        q: 'What does the free trial include?',
        a: 'Full access to your chosen plan for 14 days. No credit card required. You just need an email and a WhatsApp number. Cancel anytime.',
      },
      {
        q: 'Can I change plans later?',
        a: 'Yes, you can upgrade or downgrade at any time from the dashboard. Changes apply at the next billing cycle.',
      },
      {
        q: 'Do I need the official WhatsApp Business API?',
        a: 'No. Omona connects directly to your existing WhatsApp via a QR code — no Meta API approval or per-message fees needed. Setup takes under 5 minutes.',
      },
      {
        q: 'Which countries are supported?',
        a: 'Omona works across Mexico, Colombia, Argentina, Chile, Peru, and the rest of LATAM. Optimized for Spanish-speaking markets with pricing in MXN, COP, ARS, and other local currencies.',
      },
    ],
    bottomCta: {
      text: 'Questions? Reach us on WhatsApp.',
      primary: 'Get started free',
      secondary: 'Talk to sales',
    },
  },
  blog: {
    sectionLabel: 'blog_',
    heading: 'Resources',
    subheading: 'Guides and strategies to sell more on WhatsApp with AI.',
    readTime: 'min',
    by: 'Omona',
    relatedPosts: 'more articles_',
    backToBlog: 'blog',
    backToHome: 'Back to home',
    cta: {
      heading: 'Get started free today',
      subheading: '14-day free trial. No credit card. Setup in 5 minutes.',
      primary: 'Get started free',
      secondary: 'See demo',
    },
  },
  useCaseLayout: {
    backLabel: 'Use Cases',
    heroCta: 'Get started free',
    heroDemo: 'See demo',
    painMono: 'without_omona_',
    painTitle: 'The problem you know',
    painSubtitle: 'Every unanswered message is a customer who went to a competitor.',
    benefitsMono: 'with_omona_',
    benefitsTitle: 'The solution you need',
    demoMono: 'live_demo_',
    demoTitle: "See it in action",
    demoSubtitle: 'A real conversation between a prospect and Omona.',
    idealTitle: 'Ideal for',
    ctaSubtitle: 'Tell us the workflow and the systems · We reply with a next step',
    ctaPrimary: 'Get started free',
    ctaSecondary: 'Talk to sales',
    inputPlaceholder: 'Write a message...',
    footer: {
      login: 'Log in',
      signup: 'Sign up',
      demo: 'Demo',
    },
  },
  dashboard: {
    connected: 'Connected',
    upgradeNow: 'Upgrade to Pro',
    trialBanner: (days: number) => `Free trial: ${days} day${days === 1 ? '' : 's'} remaining`,
    trialUrgent: (days: number) => `Your free trial ends in ${days} day${days === 1 ? '' : 's'} — Upgrade now`,
    trialTooltip: (days: number) => `${days} days remaining — Upgrade`,
    freePlan: 'Free Plan',
    daysLeft: (days: number) => `${days}d left`,
    themeToggle: 'Toggle theme',
    signOutConfirm: 'Sign out?',
    signOut: 'Sign out',
    sections: {
      monitor: 'Monitor',
      configure: 'Configure',
      configuration: 'Settings',
    },
    items: {
      calendar: 'Calendar',
      tests: 'Tests',
    },
    breadcrumbs: {
      '/inbox': 'Inbox',
      '/leads': 'Leads',
      '/leads/pipeline': 'Pipeline',
      '/handoff': 'Handoff',
      '/analytics': 'Analytics',
      '/calendar': 'Calendar',
      '/broadcast': 'Broadcasts',
      '/settings': 'Settings',
      '/test': 'Tests',
    } as Record<string, string>,
    language: 'Language',
  },
  problems: {
    sectionLabel: 'problems_',
    items: [
      {
        slug: 'no-alcanzo-a-contestar',
        short: 'I cannot keep up',
        title: 'You cannot keep up',
        titleBreak: 'and that is where the sale goes',
        subtitle: 'Every message that sits unanswered is a customer already writing to someone else. It is not for lack of trying: there are no hands.',
        video: 'chat-respondiendo',
        videoAlt: 'A customer asks about a compressor at 11:40 at night and the agent replies with price and delivery time.',
        metaTitle: 'I cannot keep up with my business WhatsApp | Omona',
        metaDescription: 'If you are slow to reply, the customer already wrote to someone else. Omona answers every WhatsApp in seconds with your real catalog information. 14 days free.',
        pains: [
          'Twenty messages land at once and you answer the ones you can.',
          'You see the morning one in the afternoon and they are gone.',
          'You reply while driving, eating, in a meeting.',
          'And you still feel behind.',
        ],
        answers: [
          {
            title: 'It answers all of them at once',
            body: 'There is no queue. If twenty messages come in together, all twenty get an answer in seconds, each about what they actually asked.',
          },
          {
            title: 'With your information, not canned phrases',
            body: 'You load your catalog, your prices and your FAQs. That is where its answers come from, so it quotes the way you would.',
          },
          {
            title: 'It only calls you when it needs you',
            body: 'If the customer asks for something the agent cannot approve, it escalates and hands you the conversation with the full history.',
          },
        ],
      },
      {
        slug: 'se-me-enfrian-los-clientes',
        short: 'My leads go cold',
        title: 'They asked, you quoted',
        titleBreak: 'and you never heard back',
        subtitle: 'Follow-up is the first thing to go when you are busy. And it is exactly where the money was.',
        video: 'seguimiento-automatico',
        videoAlt: 'Twenty-four hours pass with no reply and the agent picks the conversation back up on its own.',
        metaTitle: 'My WhatsApp leads go cold after I quote | Omona',
        metaDescription: 'You quote and nobody follows up. Omona picks half-finished conversations back up on its own, with a message that makes sense. 14 days free.',
        pains: [
          'You sent the quote and that was that.',
          'You remember the customer three weeks later.',
          'Nobody has the list of who is still waiting.',
          'And writing again now feels awkward.',
        ],
        answers: [
          {
            title: 'It follows up without being asked',
            body: 'If the customer went quiet, the agent comes back on its own with a message that continues the conversation, not a "still interested?".',
          },
          {
            title: 'It knows who is still waiting',
            body: 'Every conversation carries its stage and its last interaction. No list to keep by hand, no reminder to forget.',
          },
          {
            title: 'And it tells you where they drop',
            body: 'Which stage loses customers and how long you take to reply. That fixes the process, not just the message.',
          },
        ],
      },
      {
        slug: 'no-puedo-desconectarme',
        short: 'I cannot log off',
        title: 'Your business closes',
        titleBreak: 'your WhatsApp does not',
        subtitle: 'Sunday, holidays, two in the morning. The phone buzzes anyway, and answering stopped being optional.',
        video: 'handoff',
        videoAlt: 'The customer asks for a discount, the agent escalates and a teammate picks it up with the full context.',
        metaTitle: 'I cannot log off from my business WhatsApp | Omona',
        metaDescription: 'Your business closes and your WhatsApp does not. Omona handles after-hours messages and only reaches you when it truly matters. 14 days free.',
        pains: [
          'You check the phone at dinner, at the movies, in bed.',
          'Log off for a day and it piles up.',
          'Going on holiday means putting the business on hold.',
          'And you cannot hire someone just to reply.',
        ],
        answers: [
          {
            title: 'It works at any hour',
            body: 'There is no schedule. Whoever writes at two in the morning gets an answer at two in the morning, with price and availability.',
          },
          {
            title: 'It only reaches you when it matters',
            body: 'The agent settles what it can settle. When something needs a person, it escalates and flags it. The rest does not interrupt you.',
          },
          {
            title: 'And you can take the chat any time',
            body: 'Open the dashboard, take the conversation and the agent goes quiet in that chat. It keeps handling the rest.',
          },
        ],
      },
      {
        slug: 'nadie-sabe-en-que-quedo-ese-chat',
        short: 'Nobody knows where it landed',
        title: 'Nobody knows',
        titleBreak: 'where that chat landed',
        subtitle: 'All your sales information lives in one phone, in one thread, with no search. And if that person is out, it is out.',
        video: 'crm-se-llena-solo',
        videoAlt: 'A lead card appears in the pipeline, its fields fill themselves in and it moves to the Qualified stage.',
        metaTitle: 'Nobody knows where that WhatsApp chat landed | Omona',
        metaDescription: 'Your sales live in an unsorted WhatsApp thread. Omona turns every conversation into a contact and an opportunity, with nothing typed in. 14 days free.',
        pains: [
          'You search for "the compressor guy" and cannot find him.',
          'Nobody wrote down the phone or the company anywhere.',
          'If the rep leaves, their WhatsApp leaves with them.',
          'And the spreadsheet nobody ever filled in.',
        ],
        answers: [
          {
            title: 'The contact fills itself in',
            body: 'Name, company, phone and email come out of what the customer wrote. Nobody types anything and the data is still there.',
          },
          {
            title: 'Every conversation is an opportunity on the board',
            body: 'With its stage, its value and its full history. You see the state of your sales without opening WhatsApp.',
          },
          {
            title: 'The information belongs to the business',
            body: 'It lives in your dashboard, not in the phone of whoever answered. Your team logs in, moves stages and leaves notes.',
          },
        ],
      },
    ],
    painsTitle: 'Sound familiar?',
    answersTitle: 'What Omona does about it',
    otherTitle: 'Other problems it solves',
    ctaTitle: 'Try it before giving us anything',
    ctaBody: 'Talk to the agent in the demo. No signup, no email, no card.',
    ctaDemo: 'Open the demo',
    ctaSignup: 'Evaluate a project',
    backHome: 'Back to home',
  },
  faq: {
    sectionLabel: 'questions_',
    heading: 'What everyone asks',
    subheading: 'Short, honest answers.',
    items: [
      {
        q: 'Is this a chatbot?',
        a: 'No. A chatbot answers messages. This builds the list of who to go after, extracts what was said on every call and writes it into your CRM, and prepares the proposal from what the customer asked for. Answering is one piece, not the product.',
      },
      {
        q: 'Do I have to switch CRMs?',
        a: 'No. The system writes into the one you already use. If you do not use one, that is the first problem, and it gets solved before automating anything: with nowhere to write, there is no trail to leave.',
      },
      {
        q: 'What happens when it gets something wrong?',
        a: 'It gets things wrong, like any system. That is why nothing touching money or reputation ships without a person approving it, and why the test set exists: so the error shows up in evaluation and not in front of your customer.',
      },
      {
        q: 'What does it cost?',
        a: 'It depends on how many systems it has to connect to and how complex your proposals are. Quoting before knowing that means inventing a number. Applying costs nothing, and the figure comes out of that.',
      },
      {
        q: 'Why apply instead of booking a call?',
        a: 'Because I take few projects at a time and not all of them are mine to solve. Five questions tell me whether talking makes sense. If it does not, I say so in the reply instead of spending an hour of yours finding out.',
      },
    ],
  },

  proof: {
    sectionLabel: 'proof_',
    heading: 'We are not asking you to take our word for it',
    subheading: 'We would rather you checked for yourself, in three messages, before giving us a single detail.',
    testimonials: [] as Testimonial[],
    demoTitle: 'Talk to the agent right now',
    demoBody: 'It is the same engine that will handle your customers, set up for a sample business. Ask it for prices, push back on it, ask for an appointment. If it does not convince you in three messages, a testimonial will not either.',
    demoCta: 'Open the demo',
    demoNote: 'no signup · no email · no card',
  },
  beforeAfter: {
    sectionLabel: 'before_after_',
    heading: 'Your WhatsApp, before and after',
    subheading: 'Same shop, same number, same week.',
    beforeKicker: 'without omona',
    beforeTitle: 'You are the chat',
    beforeItems: [
      'You reply at eleven at night, because otherwise they leave.',
      'Whoever asked on Monday already bought somewhere else.',
      'You quote the same thing twenty times a day.',
      'Nobody remembers where that chat ended up.',
    ],
    afterKicker: 'with omona',
    afterTitle: 'The chat works for you',
    afterItems: [
      'It replies, at any hour, in seconds.',
      'Nobody waits. Nobody leaves for the shop next door.',
      'It quotes from your catalog, not from canned phrases.',
      'Everything lands in the CRM with nobody typing it in.',
    ],
  },
  priceAdvantage: {
    sectionLabel: 'comparison_',
    headingLines: ['The cheapest conversational AI', 'in the region'],
    subheading: 'With the AI in the price, not as an add-on that costs as much as the plan itself.',
    tableCaption: 'Entry monthly price comparison between WhatsApp AI platforms for the Latin American market.',
    colTool: 'platform',
    colPrice: 'from (MXN/mo)',
    colAi: 'AI included',
    colCrm: 'CRM included',
    colNote: 'the fine print',
    rows: [
      {
        tool: 'Omona',
        price: '$499',
        ai: true,
        crm: true,
        note: 'No per-contact or per-conversation charge.',
        isOmona: true,
      },
      {
        tool: 'Wati Growth',
        price: '~$835',
        ai: false,
        crm: false,
        note: 'WhatsApp only. The AI agent is an add-on of around $100 USD a month.',
        isOmona: false,
      },
      {
        tool: 'ManyChat Pro + AI',
        price: '~$1,150',
        ai: true,
        crm: false,
        note: 'The AI add-on costs as much as the plan. On top of that, Meta bills per message.',
        isOmona: false,
      },
      {
        tool: 'Respond.io Starter',
        price: '~$1,340',
        ai: false,
        crm: false,
        note: 'AI agents start on the Growth plan, around $2,700.',
        isOmona: false,
      },
      {
        tool: 'Leadsales Basic',
        price: '~$1,650',
        ai: false,
        crm: true,
        note: 'A CRM on top of WhatsApp, with no AI agent holding the conversation.',
        isOmona: false,
      },
      {
        tool: 'Kosmo IA Starter',
        price: '$4,497',
        ai: true,
        crm: true,
        note: 'Capped at 800 new customers a month on the entry plan.',
        isOmona: false,
      },
    ],
    source: 'Public pricing from each vendor, verified on September 1, 2026 and converted to Mexican pesos. Plans change often: if you see a different figure on their site, tell us and we will fix it.',
    cta: 'Start 14 days free',
  },

  /** See es.ts: third version, first one written about the real business. */
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
    etiqueta: 'tour',
    salir: 'Exit',
    aviso: 'sample data · fictional companies',
    responder: 'See what the system did',
    siguiente: 'Next',
    ultimo: 'See my scorecard',
    tuTiempo: 'took you',
    sistemaTiempo: 'the system',
    elegiste: 'you picked',
    pasos: [
      {
        id: 'prospectar',
        indice: '01',
        titulo: 'Who do you call today?',
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
        titulo: 'What do you take from this call?',
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
        titulo: 'How long to build that proposal?',
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
        titulo: 'Do you let it talk to your customer?',
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
      etiqueta: 'your scorecard',
      titulo: 'Esto fue con el ejemplo fácil.',
      cuerpo: 'Una llamada, un cliente, sin teléfono sonando. **Tu operación real tiene más ruido que esto.**',
      camposLinea: 'fields captured',
      tiempoLinea: 'took you',
      sistemaLinea: 'without anyone opening the CRM',
      cierreTitulo: 'Lo que viste son datos de ejemplo.',
      cierreCuerpo: 'Lo que se construye sale de cómo vendes tú: qué sistemas usas, dónde se te cae y quién decide. Eso se revisa en una llamada de treinta minutos.',
      cta: 'Book a call',
      salir: 'Back to home',
      nota: 'si no hay encaje te lo digo ahí mismo',
    },
  },
  home: {
    hero: {
      eyebrow: 'prospect · follow up · close',
      title: 'Prospect, follow up, close.',
      titleAccent: 'Without typing every step.',
      subtitle:
        'They prioritise accounts, log what was agreed and draft the proposal. **Tested on your own cases before they run.**',
      ctaPrimary: 'Apply',
      ctaSecondary: 'See the engine',
      note: 'few at a time · I review every case, fit or not',
    },

    leak: {
      label: 'the problem_',
      title: 'Pipeline does not collapse. It gets forgotten.',
      body: 'Four leaks, and none of them show up in the report.',
      items: [
        {
          title: 'You do not know who to go after',
          detail: 'By hand. **Or not at all.**',
        },
        {
          title: 'What was said gets lost',
          detail: 'You hung up and nobody wrote it down.',
        },
        {
          title: 'Follow-up lives in someone head',
          detail: '**Whenever someone remembers.**',
        },
        {
          title: 'Proposals take days',
          detail: 'From scratch. Again.',
        },
      ],
      quote: 'It is not effort that is missing. It is a system.',
    },

    cycle: {
      label: 'the engine_',
      title: 'One process. The same context.',
      subtitle: 'What you learn prospecting **carries into follow-up and the proposal.**',
      outputLabel: 'output',
      masLabel: 'how it works',
      stages: [
        {
          id: 'prospectar',
          index: '01',
          name: 'Prospect',
          kicker: 'before the first message',
          headline: 'Know who to go after before going after them.',
          detalle: [
            'The list is built with **Clay, Apollo and LinkedIn Sales Navigator**. It is cross-checked against your CRM so nobody who said no gets touched again.',
            'The first message carries a real reason to write. Something that happened at that company, not a field swapped into a template.',
          ],
          output: 'List with a reason to reach out',
        },
        {
          id: 'seguir',
          index: '02',
          name: 'Follow up',
          kicker: 'without anyone remembering',
          headline: 'What was said on the call does not stay on the call.',
          detalle: [
            '**Granola transcribes and the system extracts**: what was agreed, who decides, what is missing and by when. It writes that into the CRM you already use.',
            'Same with WhatsApp and email. What comes out is a task with an owner and a date, not a loose reminder nobody opens.',
          ],
          output: 'Task with owner and date',
        },
        {
          id: 'cerrar',
          index: '03',
          name: 'Close',
          kicker: 'from what the customer said',
          headline: 'The proposal starts from what the customer already said.',
          detalle: [
            'The draft comes out with the requirements, agreements and open points from the conversation, against your catalog and approved pricing. Nobody rebuilds it from scratch.',
            '**It comes out as a draft.** A person reads it and sends it. The system does not send proposals on its own, and that is a design decision, not a limitation.',
          ],
          output: 'Draft ready for review',
        },
      ],
    },

    intel: {
      label: 'what it looks like_',
      title: 'A conversation turns into data',
      subtitle: 'Nobody types anything. **It is already written.**',
      sourceLabel: 'what the customer said',
      source:
        'I already went over it with my partner. Budget opens in January. We are worried about installation. My father decides.',
      fieldsLabel: 'what got saved',
      fields: [
        { key: 'what they want', value: 'Install without stopping operations' },
        { key: 'money', value: 'Yes · January' },
        { key: 'when', value: 'January · calendar, not urgency' },
        { key: 'their concern', value: 'Bad experience with previous vendor' },
        { key: 'who decides', value: 'The father' },
        { key: 'what is next', value: 'Call on January 8' },
      ],
      aside: {
        title: 'This already runs.',
        detail: 'It is not an idea. **It is the system I operate every day.**',
        cta: 'Try it',
      },
    },

    measure: {
      label: 'before turning it on_',
      title: 'Tested before it talks to a customer',
      subtitle: 'An agent nobody evaluated is a bet. **Here it gets measured.**',
      metrics: [
        {
          name: 'Real cases, not examples',
          detail: 'Built from your conversations, **including the ones that went badly.**',
        },
        {
          name: 'Criteria written first',
          detail: 'What counts as a good answer is defined first.',
        },
        {
          name: 'Every change reruns the set',
          detail: 'If a tweak broke another case, **you see it.**',
        },
        {
          name: 'Sensitive calls go to a person',
          detail: 'Nothing touching money ships without approval.',
        },
      ],
      terminal: {
        comando: 'omona eval --set sales --cases 34',
        casos: [
          { nombre: 'asks for price with no context', marca: '✓', conteo: '12/12', ok: true },
          { nombre: 'objection: we already have a vendor', marca: '✓', conteo: '9/9', ok: true },
          { nombre: 'asks about something off-catalog', marca: '!', conteo: '7/8', ok: false },
          { nombre: 'angry customer → escalate to a person', marca: '✓', conteo: '5/5', ok: true },
        ],
        resumen: '33 of 34. **The one that failed gets reviewed before anything ships.**',
      },
      moneyLabel: 'when I call it done',
      moneyFormula:
        'passes the test set    + your team can run it\n+ failures are visible  + you can change things\n= done',
      moneyNote: 'If one of the four is missing, it is not done. Even if it is already running.',
    },

    scope: {
      label: 'who this is for_',
      title: 'Who I work with, and who I do not',
      subtitle: 'I take few at a time. **Saying no early saves us both the time.**',
      doTitle: 'Yes',
      does: [
        'Consultative sales, long cycles, several decision makers.',
        'You lose to forgetting, not to lack of demand.',
        'You will show me how you actually sell.',
        'Someone there can make decisions.',
      ],
      dontTitle: 'No',
      donts: [
        {
          title: 'Mass messaging',
          detail: 'Not to people who never wrote you. That is how numbers get blocked.',
        },
        {
          title: 'Businesses with no customers yet',
          detail: 'No conversations means no data to work from.',
        },
        {
          title: 'Replacing your team',
          detail: 'It preps the work. Closing is still a person.',
        },
        {
          title: 'Projects with nobody deciding',
          detail: 'With nobody to define the process, it stalls.',
        },
      ],
      mas: {
        resumen: 'how it starts and how long it takes',
        parrafos: [
          'Nothing gets built all at once. **We pick whatever costs you most today** and put it into production. You see it working before deciding whether to continue.',
          'The first piece takes two to four weeks, depending on how many systems it has to connect to. The next one builds on what is already there, with no long contract and nothing paid upfront.',
          'If your problem is not one I can solve, I say so in the first reply. **I do not charge to find that out.**',
        ],
      },
    },
  },
};
