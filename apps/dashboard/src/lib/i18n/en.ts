import type { Translations } from './es';
import type { Testimonial } from './types';

export const en: Translations = {
  nav: {
    features: 'Cycle',
    engine: 'Engine',
    process: '6 weeks',
    pricing: 'How we work',
    blog: 'Blog',
    useCases: 'Use Cases',
    demo: 'Demo',
    login: 'Log in',
    signup: 'Book a diagnostic',
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
    heading: 'Six weeks, three phases',
    subheading: 'We measure your starting point before automating anything. Without a baseline there is no way to know whether it worked.',
    steps: [
      { title: 'Week 1 · Diagnostic', detail: 'We map your process and measure the baseline' },
      { title: 'Weeks 2-5 · Pilot', detail: 'One single flow live, with human review' },
      { title: 'Week 6 · Checkpoint', detail: 'We compare against the week 1 baseline' },
      { title: 'After · Operation', detail: 'It expands to more flows, or we refund the pilot' },
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
    sectionLabel: 'guarantee_',
    heading: 'If it does not happen, we refund the full pilot',
    body: 'In week 1 we measure your baseline. If at the end of the six weeks your CRM does not reflect 90% of your sales conversations, and every open opportunity does not have a next task with an owner and a date, we refund 100% of what you paid for the pilot.',
    conditionsLabel: 'What we need from your side',
    conditions: [
      'A kickoff with whoever can approve processes',
      'Access to WhatsApp, CRM and calendar in week 1',
      'Templates reviewed and approved within 5 business days',
      'One designated owner inside your team',
    ],
    note: 'This is not fine print: these are the four things without which the result does not happen.',
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
    heading: 'Start with the diagnostic',
    subheading: 'Thirty minutes. You leave with your baseline measured and one prioritized flow, whether you work with us or not.',
    primary: 'Book a diagnostic',
    secondary: 'See the demo',
    trust: 'And if you would rather see it first, talk to the agent in the demo.',
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
    ctaSubtitle: '14 days free · No credit card · Set up in 5 minutes',
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
    ctaSignup: 'Start 14 days free',
    backHome: 'Back to home',
  },
  faq: {
    sectionLabel: 'questions_',
    heading: 'What everyone asks before starting',
    subheading: 'The honest answers, including the awkward ones.',
    items: [
      {
        q: 'Will my WhatsApp number get blocked?',
        a: 'Omona connects by scanning a QR code, the same way you open WhatsApp Web: you keep your own number and you file nothing with Meta. That also means WhatsApp usage rules apply. If you blast messages at people who never wrote to you, the risk of a block is the same as if you sent them by hand. Omona is built to answer whoever writes to you first, and there that risk does not exist.',
      },
      {
        q: 'Will it sound like a robot?',
        a: 'It does not reply with canned phrases: it reads the whole message and answers with your catalog information, in the tone you configure. Before connecting your number you can talk to the agent in the demo and judge it yourself. If it sounds robotic there, it will sound robotic to your customers.',
      },
      {
        q: 'What happens when it does not know something?',
        a: 'It escalates. When the customer asks something out of scope, requests a discount nobody approved, or gets annoyed, the agent hands the conversation to your team and flags it. Whoever steps in sees the full history, what the customer said and why it was escalated. It does not make up an answer to get by.',
      },
      {
        q: 'Can I turn it off and reply myself?',
        a: 'Yes, any time and per conversation. When you take a chat from the dashboard, the agent goes quiet in that chat and keeps handling the rest. Your number never stops being yours.',
      },
      {
        q: 'How long until it is running?',
        a: 'Connecting your number takes five minutes: you scan a QR and it starts receiving messages. What takes six weeks is the rest: mapping your process, measuring your baseline, loading catalog and prices, and getting every conversation into the CRM with its task. Answering fast is easy; never losing an opportunity is the work.',
      },
      {
        q: 'How much does it cost?',
        a: 'We do not publish a price because it depends on how many salespeople you have, how many conversations they handle, which channels they use, which CRM you already run and how complex your proposals are. Quoting before knowing that forces you to make a number up. The 30-minute diagnostic is free and the figure comes out of it.',
      },
      {
        q: 'Where does it get the information to prospect?',
        a: 'From public sources: the company website, open job postings, press mentions, public registries, and what is already in your own CRM from previous contacts. We do not buy databases or scrape personal data, and when it cannot find something it leaves the field empty instead of filling it in. An entry angle built on an invented fact is worse than no angle at all.',
      },
      {
        q: 'Does it send proposals on its own?',
        a: 'No. It drafts using your catalog, your prices and your approved terms, and then it stops. Someone on your team reviews it and sends it. That is deliberate: a proposal is the part of the process where a mistake costs real money, and the system is not authorized to take that risk by itself.',
      },
      {
        q: 'Do I have to switch CRM?',
        a: 'No, and usually you should not. We work on the one you already use, even if it is badly configured. Switching CRM and fixing your sales process at the same time are two projects competing for the same team’s patience, and both tend to lose.',
      },
      {
        q: 'What if it does not work?',
        a: 'In week 1 we measure your baseline. If at the end of the six weeks your CRM does not reflect 90% of your sales conversations and every open opportunity does not have a next task with an owner and a date, we refund 100% of the pilot. The conditions are in plain sight in the guarantee section, not in fine print.',
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

  /** See es.ts for why the home page was rebuilt around the full sales cycle. */
  home: {
    hero: {
      eyebrow: 'revenue intelligence · b2b · latam',
      title: 'The pipeline looks healthy.',
      titleAccent: 'It almost never is.',
      subtitle:
        'Omona reads every conversation, fills the CRM on its own and hands you the next play: who to reach today, with what message, and why. Prospecting, follow-up, closing and proposals, on the same data.',
      ctaPrimary: 'Book a diagnostic',
      ctaSecondary: 'See how it works',
      note: '30 minutes · no cost · on the CRM you already have',
      card: {
        label: 'play_of_the_day',
        cohort: 'No-show',
        elapsed: '14 min ago',
        contact: 'Mariana Robles · Grupo Zenith',
        why: 'Booked the 10:00 diagnostic and never showed. The first 30 minutes are the window where she actually answers.',
        messageLabel: 'suggested message',
        message:
          'Mariana, good morning. I held the 10:00 and we missed each other — no problem, it happens. Does tomorrow at 11:00 work, or would Thursday at the same time be better?',
        checksLabel: 'only you can confirm this',
        checks: ['The number is hers', 'She is still the decision maker'],
        valueLabel: 'deal value',
        value: '$84,000',
        timeLabel: 'takes',
        time: '2 min',
        actionPrimary: 'Done',
        actionSecondary: 'Not now',
      },
    },

    leak: {
      label: 'diagnostic_',
      title: 'Nobody loses the sale on the ad. They lose it afterwards.',
      body:
        'The prospect raised their hand, somebody answered, and somewhere between that conversation and the close it fell through. Not for lack of effort: because follow-up lives in one person’s memory, and memory breaks exactly when the workload peaks.',
      items: [
        {
          title: 'Opportunities with no next step',
          detail:
            'They sit open on the board, but none has a what-next or a when. In many CRMs the field to store it does not even exist.',
        },
        {
          title: 'Meetings with no logged outcome',
          detail:
            'Nobody marked whether the person showed up. Without that you cannot tell whether people are not showing or nobody is writing it down.',
        },
        {
          title: 'Proposals with no decision date',
          detail:
            'It went out and became "we’ll let you know". A proposal with no date is not alive: it is waiting for someone to remember it.',
        },
        {
          title: 'And it breaks in peak season',
          detail:
            'Exactly when there are more meetings and more pressure is when the least gets logged. The month with the most opportunities is the month with the worst data.',
        },
      ],
      quote: 'An effort breaks in peak season. Always. A system does not.',
    },

    cycle: {
      label: 'cycle_',
      title: 'One sales cycle, four engines',
      subtitle:
        'This is not a chatbot with a CRM bolted on the back. It is the full cycle running on the same data: what prospecting learns feeds follow-up, and what follow-up learns writes the proposal.',
      outputLabel: 'produces',
      stages: [
        {
          id: 'prospeccion',
          index: '01',
          name: 'Prospecting',
          kicker: 'market research',
          headline: 'It knows who it is talking to before the first message.',
          bullets: [
            'Researches the company: what it does, how big it is, what moment it is in, and who signs.',
            'Builds lists from signals, not hunches — they hired, they opened a location, they changed sales directors.',
            'Hands over the entry angle already written, with the concrete reason it applies to that account and not another.',
          ],
          output: 'Researched account + entry angle',
        },
        {
          id: 'seguimiento',
          index: '02',
          name: 'Follow-up',
          kicker: 'the engine',
          headline: 'The part that breaks on its own. This is where the engine lives.',
          bullets: [
            'Computes the real state of every opportunity: what happened, how long ago, and what is due now.',
            'Turns every leak into a concrete play — who, today, with the message already drafted.',
            'A fast clock for what goes cold in minutes; a slow clock for the pipeline queue.',
          ],
          output: 'One play a day, with message and date',
        },
        {
          id: 'cierre',
          index: '03',
          name: 'Closing',
          kicker: 'buying signal',
          headline: 'The conversation reaches the close carrying everything it needs.',
          bullets: [
            'Detects the real objection and when it surfaced — which is rarely the one stated at the end.',
            'Flags the buying signal: budget said out loud, timeline, and who has to authorize.',
            'Alerts leadership when a large opportunity has been sitting still for too long.',
          ],
          output: 'Objections, decision criteria and a date',
        },
        {
          id: 'propuestas',
          index: '04',
          name: 'Proposals',
          kicker: 'and presentations',
          headline: 'The document comes out of the conversation, not a blank template.',
          bullets: [
            'Takes what the client said — need, budget, timeline, who decides — and drafts from that.',
            'With your catalog, your prices and your approved terms. Never with invented figures.',
            'Proposal and deck come from the same source, and both go through human review before they go out.',
          ],
          output: 'A personalized draft, ready for review',
        },
      ],
    },

    engine: {
      label: 'engine_',
      title: 'Five cohorts, each with its own clock',
      subtitle:
        'You do not follow up the same way five minutes after a no-show as three weeks after a proposal. Each cohort has its own tempo, script and goal.',
      table: {
        cohort: 'Cohort',
        trigger: 'Fires when',
        clock: 'Clock',
        goal: 'The goal',
      },
      cohorts: [
        {
          name: 'New prospect',
          trigger: 'Fills a form or writes for the first time',
          clock: 'Minutes',
          goal: 'Human contact in under 20 minutes',
        },
        {
          name: 'Meeting booked',
          trigger: 'Takes a slot on the calendar',
          clock: 'Minutes → days',
          goal: 'That the meeting actually happens',
        },
        {
          name: 'No-show',
          trigger: 'The meeting passed and they did not come',
          clock: 'Minutes → days',
          goal: 'Rebook, or close it with dignity',
        },
        {
          name: 'Proposal',
          trigger: 'The proposal is delivered',
          clock: 'Days',
          goal: 'That it has a decision date',
        },
        {
          name: 'Everything else',
          trigger: '—',
          clock: 'Weekly',
          goal: 'Deliberately ignored',
        },
      ],
      quote:
        'A system that shows you the forty things you ought to be doing is not information: it is guilt. This engine is willing to hide work.',
      clocks: {
        label: 'two clocks, not one',
        items: [
          {
            name: 'Fast clock',
            unit: 'minutes',
            detail:
              'New prospect, meeting booked, no-show, inbound reply. It reacts per event. A no-show recovered in five minutes converts far better than one recovered tomorrow: the person is still at their desk and still feels bad about missing it.',
          },
          {
            name: 'Slow clock',
            unit: 'days',
            detail:
              'The pipeline queue, the weekly scoreboard, the leak measured in money. It runs on its own, early, every day. It answers "how are we doing", not "what do I do now".',
          },
        ],
      },
      play: {
        label: 'one play at a time',
        title: 'The system hands you one card. Never a list.',
        detail:
          'It arrives with the message already written, the phone number, the proposed date, what the deal is worth if it closes and how many minutes it takes. Two buttons: done, or not now — and "not now" asks for a reason, because without one it becomes a loop serving the same card all week.',
        closing:
          'Zero decisions to get started. Deciding what to do is the expensive part; the system solves that and the person executes.',
      },
      guardrails: {
        label: 'the style guide is code',
        title: 'A message that fails the style guide never shows up as a play.',
        detail:
          'Banned words, the emoji ceiling, one question per message, the sending window, and the rule that there is always a next step with a date do not live in a PDF nobody opens: they run as a function that validates every message before it is shown.',
        checksTitle: 'And what the machine cannot judge, it asks',
        checksDetail:
          'Whether a compliment is true, whether the number is the client’s, whether that is still the person who decides. That shows up on the card as boxes only a human can tick. A validator that pretends it can judge those is lying.',
      },
    },

    intel: {
      label: 'intelligence_',
      title: 'Every conversation leaves data, not a paragraph',
      subtitle:
        'WhatsApp, email, calendar and recorded calls land in the same place. What comes out is not a nice summary: it is fields the CRM can store and the engine can read.',
      sourceLabel: 'what came in',
      source:
        'Look, I already went over it with the team. The budget is there for next quarter, not right now. And honestly what worries us is the migration, because it already went badly with our previous vendor. The one who decides this in the end is Rodrigo, our operations director.',
      fieldsLabel: 'what got stored',
      fields: [
        { key: 'need', value: 'Migration with no service interruption' },
        { key: 'budget', value: 'Exists, released next quarter' },
        { key: 'timeline', value: 'Q+1 · not urgency, calendar' },
        { key: 'objection', value: 'Bad prior experience with migration' },
        { key: 'decision_maker', value: 'Rodrigo · operations director' },
        { key: 'next_step', value: 'Migration case study + date with Rodrigo' },
      ],
      aside: {
        title: 'And yes, it answers too.',
        detail:
          'The agent replies in seconds, at any hour, understands voice notes and books the meeting inside the same chat. But answering is the system’s input, not the product: if the message gets answered fast and still nobody knows what comes next, the sale falls through anyway.',
        cta: 'Try it in the demo',
      },
    },

    measure: {
      label: 'measurement_',
      title: 'It does not measure activity. It measures muscle.',
      subtitle:
        'Sending forty messages is not a result. These four are, and all four are compared against previous weeks — trend, not snapshot.',
      metrics: [
        {
          name: 'Time to first contact',
          detail:
            'The median from a prospect raising their hand to a human speaking to them. It is the most honest number in the system because it is 100% under your control.',
        },
        {
          name: 'Time to first touch after a no-show',
          detail: 'Recovery intensity, turned into a number that goes up or down.',
        },
        {
          name: 'Recovery rate',
          detail: 'For no-shows and for proposals that were sitting without a decision date.',
        },
        {
          name: 'Which script converts',
          detail:
            'Every play stores its outcome and where the text came from. In three months that answers which phrases work with evidence instead of opinion.',
        },
      ],
      moneyLabel: 'and the figure that makes it a leadership conversation',
      moneyFormula:
        'no-shows this month × cost per meeting        = money that leaked\nrecovered           × ticket × margin × months = money you plugged',
      moneyNote: 'That subtraction is the whole conversation. Nothing else needs explaining.',
    },

    scope: {
      label: 'scope_',
      title: 'It lives on top of the CRM you already have',
      subtitle:
        'We are not asking you to switch tools. We read the CRM, the calendar and recorded calls, and write back to them.',
      doTitle: 'What it does',
      does: [
        'Writes into your current CRM: contacts, fields, tasks with an owner and a date.',
        'Reads stages, calendar meetings and recorded calls as a single signal.',
        'Adjusts scripts and timing without redeploying anything: the ladders are data, not code.',
        'Adapts to your vocabulary and your voice guide, both loaded as configuration.',
      ],
      dontTitle: 'What it does not do',
      donts: [
        {
          title: 'It is not a CRM',
          detail: 'It lives on top of the one you have. If you want to replace yours, this is not that.',
        },
        {
          title: 'It does not decide',
          detail:
            'It computes state and proposes plays. It does not move stages on its own, does not close deals, and does not send messages unapproved.',
        },
        {
          title: 'It does not see every channel',
          detail:
            'Personal email and WhatsApp sent from someone’s phone are invisible. In Mexico that is a good chunk of the conversation, and it is written here as a known gap, not hidden.',
        },
        {
          title: 'It is not a statistical model',
          detail:
            'The ladders are hand-written rules over your process. They work, but claiming a model is predicting the close would be making things up.',
        },
      ],
    },
  },
};
