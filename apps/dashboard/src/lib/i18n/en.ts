import type { Translations } from './es';
import type { Testimonial } from './types';

export const en: Translations = {
  nav: {
    features: 'What we build',
    engine: 'Services',
    process: 'Process',
    pricing: 'How we work',
    blog: 'Blog',
    useCases: 'Use Cases',
    demo: 'Demo',
    login: 'Log in',
    signup: 'Evaluate a project',
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
    sectionLabel: 'process_',
    heading: 'Four phases, and the last one is leaving',
    subheading:
      'The goal is not to stay running your project. **It is to leave it working in your team’s hands.**',
    steps: [
      { title: 'Discover', detail: 'The real process, with its exceptions. What gets automated and what does not.' },
      { title: 'Build', detail: 'Integrations, permissions, approvals and error handling.' },
      { title: 'Evaluate', detail: 'Real cases and edge cases, before the client ever sees it.' },
      { title: 'Hand off', detail: 'Documentation, access and someone on your side who can maintain it.' },
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
    sectionLabel: 'how we evaluate_',
    heading: 'Before we start, we decide whether we can deliver it',
    body:
      'We do not accept every project. We review scope, systems and who decides on the client side. **If we see we cannot deliver it well, we say so in the first conversation** — not in week four.',
    conditionsLabel: 'What we look at',
    conditions: [
      'That a real process exists, with someone who can decide how it runs',
      'That the systems to integrate have an API, access or a viable path',
      'That there is a deadline and a scope, not an open-ended exploration',
      'That your team can take the handoff at close',
    ],
    note: 'All four are conditions for the project to go well, not fine print.',
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
    heading: 'Tell us about the project',
    subheading:
      'The workflow, the systems involved and what state it is in. **We reply with a recommended next step, not a generic demo.**',
    primary: 'Evaluate a project',
    secondary: 'See the services',
    trust: 'if it is not for us, we tell you in the first reply',
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
    heading: 'What people ask before the first call',
    subheading: 'The honest answers, including the uncomfortable ones.',
    items: [
      {
        q: 'Do you work under my brand, in front of my client?',
        a: 'Yes, and it is the most requested arrangement. You keep the commercial relationship and the credit; we do not appear. We sign whatever is needed for that. We also work alongside your team under our own name if you prefer to present it as a partnership.',
      },
      {
        q: 'Do you have case studies or clients I can look at?',
        a: 'None we can publish. The firm is new, and presenting testimonials, logos or metrics we cannot back would mean inventing them. What is verifiable: Omona built and operates its own Claude system in production — multi-tenant with per-organization isolation, audio transcription, human escalation, signed webhooks and continuous deployment. This entire site documents it. It is evidence that we know how to take an agent from prototype to operation.',
      },
      {
        q: 'What if the project is already failing in production?',
        a: 'That is Rescue & Hardening. Stabilize first: understand why it fails, contain the damage and make errors visible. Hardening comes after. We do not rewrite from scratch unless that is cheaper than fixing it, and we argue that case with reasons, not preference.',
      },
      {
        q: 'What does it cost?',
        a: 'We do not publish rates because they depend on scope, how many systems need integrating and what state the existing work is in. Quoting before knowing that forces us to invent a number. Tell us the workflow and the state of the project and we reply with a recommended next step and a range.',
      },
      {
        q: 'Do we end up dependent on you?',
        a: 'No, and it is designed so that cannot happen. Access and credentials stay in your name or your client’s, never in our accounts. At close we hand over documentation, runnable tests and a handoff session with someone on your team. If we leave, nothing switches off.',
      },
      {
        q: 'Do you only work with Claude?',
        a: 'It is where we are good and where we have our own product in production, so it is what we offer. If your project is tied to another provider, the honest answer is to point you at someone specialized in it. We do not bill for learning on your budget.',
      },
      {
        q: 'What do you need from us to start?',
        a: 'A person who can decide how the process works, access to the systems to integrate, and a real deadline. Without the first, the project stalls on questions nobody answers; without the second there is no way to build; without the third it is not a project, it is an exploration.',
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

  /** See es.ts for why the site was repositioned from product to service. */
  home: {
    hero: {
      eyebrow: 'technical delivery partner · claude · latam',
      title: 'Selling the pilot was the easy part.',
      titleAccent: 'Running it is another thing.',
      subtitle:
        'We take Claude automations from prototype to production. Integrations, permissions, evaluations, error handling and handoff to your team. Under your brand, or alongside it.',
      ctaPrimary: 'Evaluate a project',
      ctaSecondary: 'See how we work',
      note: 'tell us the workflow and the systems · we reply with a next step',
      card: {
        label: 'production_review',
        cohort: 'Blocker',
        elapsed: 'finding 3 of 11',
        contact: 'Quoting agent · ERP integration',
        why: 'The agent writes to the ERP with no confirmation. One extraction error creates a real order, and today there is no way to reverse it.',
        messageLabel: 'recommendation',
        message:
          'Add human approval before any write. The agent proposes the order, a person confirms it. We log who approved and on what data.',
        checksLabel: 'your team confirms this',
        checks: ['Who has authority to approve', 'What amount can skip review'],
        valueLabel: 'risk',
        value: 'High',
        timeLabel: 'effort',
        time: '2 days',
        actionPrimary: 'Accepted',
        actionSecondary: 'Defer',
      },
    },

    leak: {
      label: 'the problem_',
      title: 'The demo worked. Operating it is a different system.',
      body:
        'A prototype handles the happy path well. That is enough to close the sale. **What breaks the project is everything else**, and it is almost never budgeted.',
      items: [
        {
          title: 'It fails and nobody notices',
          detail:
            'With no logs or alerts, the client reports the error. By then it has been happening for days.',
        },
        {
          title: 'It acts without permission',
          detail:
            'The agent writes to real systems. **Nobody defined what it can do alone and what needs approval.**',
        },
        {
          title: 'Nobody knows if it improved',
          detail:
            'No evaluations on real data. Every change is a bet, and the team checks it by eye.',
        },
        {
          title: 'Cost runs away',
          detail:
            'It works with ten cases. At a thousand, the bill and the latency stop making sense.',
        },
      ],
      quote: 'A prototype proves it can be done. An operation survives being used.',
    },

    cycle: {
      label: 'what we build_',
      title: 'Four things separate a prototype from an operation',
      subtitle:
        'None of them is exotic. **All of them get skipped when there is a rush to show something**, and all of them get charged later, in production, with the client watching.',
      outputLabel: 'you get',
      stages: [
        {
          id: 'workflow',
          index: '01',
          name: 'Workflow',
          kicker: 'the real process',
          headline: 'Process first. Agent second.',
          bullets: [
            'We map how the work is done today, by whom, and with what exceptions.',
            'We mark what is worth automating and **what is better left to a person**.',
            'The design comes from the process, not from what the model happens to be good at.',
          ],
          output: 'Mapped process and agreed scope',
        },
        {
          id: 'integracion',
          index: '02',
          name: 'Integration',
          kicker: 'with the systems you already run',
          headline: 'An agent earns its keep when it touches business systems.',
          bullets: [
            'CRM, ERP, databases and SaaS, over API, webhooks or MCP.',
            'Authentication, permissions and scope for every tool the agent can reach.',
            '**An agent that only chats changes nothing.** The value shows up when it writes where it matters.',
          ],
          output: 'Systems connected, with scoped permissions',
        },
        {
          id: 'controles',
          index: '03',
          name: 'Controls',
          kicker: 'so it can run unattended',
          headline: 'What happens when something goes wrong.',
          bullets: [
            'Human approval on decisions that cost money or are hard to reverse.',
            'Logs, retries, error handling and a clear escalation path.',
            '**Without this the project ships and nobody dares leave it alone.**',
          ],
          output: 'Approvals, logs and escalation',
        },
        {
          id: 'evaluacion',
          index: '04',
          name: 'Evaluation',
          kicker: 'on real data',
          headline: 'Knowing it works, not believing it works.',
          bullets: [
            'Real cases and edge cases, taken from the client’s own process.',
            'A prompt or model change gets measured before it reaches production.',
            '**Without evals, every adjustment is a bet** and nobody can say whether it improved.',
          ],
          output: 'Eval suite and acceptance criteria',
        },
      ],
    },

    engine: {
      label: 'services_',
      title: 'Five ways in, depending on where you are',
      subtitle:
        'Named by outcome, not by technology. **The first two are where almost everyone starts.**',
      table: {
        cohort: 'Service',
        trigger: 'When it applies',
        clock: 'Format',
        goal: 'Outcome',
      },
      cohorts: [
        {
          name: 'Pilot-to-Production Sprint',
          trigger: 'Project sold, prototype half-built',
          clock: 'Sprint',
          goal: 'An operable, documented automation',
        },
        {
          name: 'White-label Delivery Partner',
          trigger: 'You have the relationship, not the capacity',
          clock: 'Ongoing',
          goal: 'Delivery under your brand or with your team',
        },
        {
          name: 'Production Readiness Audit',
          trigger: 'An agent exists and nobody knows if it holds',
          clock: 'Assessment',
          goal: 'Prioritized plan to reach production',
        },
        {
          name: 'Claude Workflow Build',
          trigger: 'There is a business process and no system',
          clock: 'Project',
          goal: 'Workflow integrated, tested and operable',
        },
        {
          name: 'Rescue & Hardening',
          trigger: 'The automation is already failing in production',
          clock: 'Intervention',
          goal: 'Stabilized system with real controls',
        },
      ],
      quote:
        'We do not build flashy demos that break on the first real case. We build what your client will use on Monday.',
      clocks: {
        label: 'two ways to work',
        items: [
          {
            name: 'Under your brand',
            unit: 'white-label',
            detail:
              'Your firm keeps the relationship and the credit. **We never appear in front of your client.** We deliver architecture, build and hardening, and you present it as yours.',
          },
          {
            name: 'Alongside your team',
            unit: 'together',
            detail:
              'We work with your developers, not instead of them. **When we close, your team can maintain it without us.** That includes documentation, handoff and training.',
          },
        ],
      },
      play: {
        label: 'how it starts',
        title: 'First we understand the project. Then we say whether we take it.',
        detail:
          'You tell us the workflow, the systems involved and what state it is in. We reply with a recommended next step — **not a generic demo and not a template proposal.**',
        closing:
          'If the project is not for us, we say so right there. That is cheaper for both of us than finding out in week four.',
      },
      guardrails: {
        label: 'what stays installed',
        title: 'A project ends when your team can run it without us.',
        detail:
          'Not when the code works on our machine. **At close there is documentation, access, tests and a person on your side who can maintain it.**',
        checksTitle: 'And what we cannot promise, we do not promise',
        checksDetail:
          'There are no testimonials, logos or publishable metrics: the firm is new and presenting them would mean inventing them. **What is verifiable is our own product in production**, and this site documents all of it.',
      },
    },

    intel: {
      label: 'capabilities_',
      title: 'What the business asks for, translated into what has to be built',
      subtitle:
        'Clients do not ask for MCP or human-in-the-loop. **They ask to stop losing paperwork.** Our job is that translation, and then building it.',
      sourceLabel: 'what the client asks for',
      source:
        'We want invoices that arrive by email to be captured into the ERP on their own. But if the vendor is new or the amount is large, someone should see it first. And we need to know what happened to each one.',
      fieldsLabel: 'what has to be built',
      fields: [
        { key: 'workflow', value: 'Document extraction and ERP entry' },
        { key: 'integration', value: 'Email, storage and the ERP API' },
        { key: 'tool_use', value: 'Scoped writes: create only, never delete' },
        { key: 'approval', value: 'New vendor or amount above threshold' },
        { key: 'evaluation', value: 'Real invoices, odd formats included' },
        { key: 'observability', value: 'Per-invoice trace, retries and escalation' },
      ],
      aside: {
        title: 'And yes, we run one ourselves.',
        detail:
          'Omona built and operates its own Claude system over WhatsApp: multi-tenant with per-organization isolation, audio transcription, human escalation, signed webhooks and continuous deployment. **It is production evidence, not the service offering** — and this site’s corpus documents it.',
        cta: 'See the system running',
      },
    },

    measure: {
      label: 'delivery standards_',
      title: 'What is left when we leave',
      subtitle:
        'This is not a promise of results: it is the list of what we always hand over. **If any of it is missing, the project is not closed.**',
      metrics: [
        {
          name: 'Documentation your team can follow',
          detail:
            'Architecture, decisions and how to operate it. Written for whoever maintains it, not for whoever sold it.',
        },
        {
          name: 'Access and credentials in your name',
          detail:
            'Everything lives in your accounts or your client’s. **Never in ours.** Us leaving cannot switch anything off.',
        },
        {
          name: 'Runnable tests and evaluations',
          detail:
            'They run without us. A future change can be validated without guessing whether it broke something.',
        },
        {
          name: 'Handoff with a trained person',
          detail:
            'Someone on your side who understood the system and can change it. Session recorded, questions answered.',
        },
      ],
      moneyLabel: 'the definition of done',
      moneyFormula:
        'runs in production      + your team can operate it\n+ failures are visible   + changes can be tested\n= project closed',
      moneyNote:
        'Anything that misses one of the four is still a prototype, even if it is live.',
    },

    scope: {
      label: 'scope_',
      title: 'What we take and what we do not',
      subtitle:
        'We are a small, specialized firm. **Saying no early is part of the job.**',
      doTitle: 'What we take',
      does: [
        'Claude projects already sold or committed, with a real deadline.',
        'Automations that touch business systems: CRM, ERP, databases, SaaS.',
        'Work under a consultancy’s brand, without appearing in front of their client.',
        'Rescues of automations already failing in production.',
      ],
      dontTitle: 'What we do not take',
      donts: [
        {
          title: 'Demos and proofs of concept',
          detail:
            'If the goal is to show something in a meeting, we are not the firm. We build what will be operated.',
        },
        {
          title: 'Projects with no process owner',
          detail:
            'Someone on the client side has to be able to decide how the work gets done. Without that person, the project stalls.',
        },
        {
          title: 'Training or fine-tuning models',
          detail:
            'We work on existing models. ML research and fine-tuning are not our thing, and saying so saves time.',
        },
        {
          title: 'Bodies by the hour with no scope',
          detail:
            'We do not rent out developers against a bucket of hours. We come in with an agreed outcome and a definition of done.',
        },
      ],
    },
  },
};
