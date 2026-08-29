# BACKLOG.md — Loomi v2

Prioritized backlog based on market standards (Respond.io, Sintra.ai, ManyChat, Intercom, HubSpot, Drift, Apollo.io) and LATAM-specific needs.

## 🔴 P0 — Critical (ship before any paid user)

### Auth & Onboarding
- [x] **Email confirmation flow polish** — confirm route passes tokens via hash, callback sets session, login shows success/error banners
- [x] **Google/Apple OAuth** — Google OAuth button on login + signup, signInWithGoogle in useAuth (needs GCP credentials in Supabase to activate)
- [x] **Onboarding completion tracking** — profiles.onboarding_completed/step, AuthGuard redirects to /onboarding if not done
- [x] **Team invites** — full CRUD, email invitations via Resend, role management (admin/agent/viewer), /auth/invite acceptance page

### WhatsApp
- [x] **QR reconnection on server restart** — auto-reconnect all active sessions on Railway cold start
- [x] **Multi-device warning** — detect disconnect reasons (too_many_devices, connection_replaced, logged_out), store metadata
- [x] **Message delivery status** — track sent/delivered/read (Baileys provides this) and show ✓✓ in inbox
- [x] **Media messages** — handle images, audio, documents, stickers (not just text)
- [x] **Rate limiting** — cooldown between messages and daily caps

### AI & Conversations
- [x] **Conversation pause during handoff** — AI does NOT respond while status is `handoff`
- [x] **Human agent reply from inbox** — admin types in ChatView → message sends via WhatsApp to customer
- [x] **Conversation context window** — capped at last 20 messages in getRecentMessages()
- [x] **Typing indicator** — show "escribiendo..." on WhatsApp while AI generates response

### Data & Security
- [x] **RLS enforcement** — all 12 tables have org-scoped RLS policies (server uses service_role for admin ops, anon key respects RLS)
- [x] **API rate limiting** — Hono middleware to prevent abuse (100 req/min per org)
- [x] **Input sanitization** — XSS prevention on all user inputs (business name, products, etc.)

---

## 🟡 P1 — High (needed for product-market fit)

### Analytics Dashboard
- [x] **Metrics overview page** — total conversations, avg response time, handoff rate, conversion rate, leads by status
- [ ] **Conversation funnel** — visualize: new → qualified → demo → converted → lost
- [ ] **AI performance stats** — handoff rate, avg lead score, resolution without human, avg conversation length
- [x] **Time-series charts** — conversations/day, leads/week (Recharts line + bar charts)
- [x] **Export to CSV** — leads and conversations export

### CRM Features
- [x] **Lead detail page** — full profile with timeline, all conversations, notes, score history
- [x] **Lead stages pipeline** — Kanban board (drag leads between stages)
- [ ] **Custom fields** — let tenants define their own lead qualification fields
- [ ] **Lead tags/labels** — categorize leads (hot, cold, VIP, by product interest)
- [ ] **Lead assignment** — assign leads to specific team members
- [x] **Bulk actions** — select multiple leads, change status, delete

### AI Improvements
- [x] **Knowledge base / document upload** — upload PDFs, DOCX, TXT for AI to reference (+ website scraper)
- [x] **Custom AI instructions** — freeform system_prompt_override in settings
- [x] **Multi-language auto-detect** — respond in the customer's language
- [x] **AI confidence scoring** — when confidence is low, auto-handoff
- [ ] **Suggested replies** — AI suggests 3 reply options for human agents during handoff
- [x] **Follow-up automation** — if no reply in 24h, AI sends a follow-up message
- [x] **Business hours enforcement** — after-hours auto-reply with custom message

### WhatsApp Advanced
- [x] **Broadcast / bulk messaging** — send messages to segments with filters
- [x] **Quick replies / canned responses** — admin-defined shortcuts in settings
- [ ] **Contact labels** — sync with WhatsApp native labels
- [ ] **WhatsApp Catalog integration** — link products to WhatsApp Business catalog
- [ ] **Voice message transcription** — use Whisper to transcribe audio messages

---

## 🟢 P2 — Medium (competitive differentiation)

### Integrations
- [x] **Zapier/Make webhooks** — CRUD + HMAC signing + event firing
- [ ] **CRM sync** — HubSpot, Pipedrive, Salesforce bi-directional sync
- [x] **Calendar scheduling** — built-in scheduler with availability rules, AI auto-booking, 24h WhatsApp reminders
- [ ] **Google Calendar sync** — OAuth2 to read/write Google Calendar events (phase 2)
- [ ] **Stripe/MercadoPago** — payment links in chat, track revenue per lead
- [ ] **Shopify/WooCommerce** — order status lookup, abandoned cart recovery via WhatsApp
- [ ] **Google Sheets export** — auto-sync leads to a spreadsheet

### Multi-Channel
- [ ] **Instagram DMs** — same AI agent responds on IG
- [ ] **Facebook Messenger** — unified inbox
- [ ] **Telegram** — for markets where Telegram is popular
- [x] **Web chat widget** — embeddable chat bubble (`/widget/loomi-widget.js`)
- [ ] **Email channel** — handle inbound sales emails with same AI

### Automation Workflows
- [ ] **Visual flow builder** — drag-and-drop conversation flows (like ManyChat)
- [ ] **Trigger-based automations** — "when lead score > 50, assign to sales team"
- [ ] **Drip campaigns** — timed message sequences (day 1: welcome, day 3: follow-up, day 7: offer)
- [ ] **A/B testing** — test different AI personalities, opening messages, follow-up timing

### Dashboard UX
- [x] **Dark mode** — toggle, persisted to localStorage
- [ ] **Real-time notifications** — browser push notifications for new messages and handoffs
- [x] **Keyboard shortcuts** — Cmd+K command palette
- [x] **Conversation search** — full-text search across all messages
- [x] **Conversation tags** — tag conversations by topic, urgency, product
- [x] **Pinned conversations** — pin important chats to top
- [x] **Unread count badge** — show unread count on conversation list
- [x] **Devolver al bot** — fixed: resolves open handoffs + refetches state

---

## 🔵 P3 — Low (scale & enterprise)

### Multi-Tenant & Billing
- [ ] **Stripe billing** — subscription plans (free/pro/enterprise), usage-based pricing
- [ ] **Usage limits** — cap conversations/month by plan, show usage meter
- [ ] **Plan upgrade flow** — in-app upgrade with payment
- [ ] **White-label** — custom domain, logo, colors per tenant (agency reseller model)
- [ ] **Audit log** — track all admin actions

### Enterprise
- [ ] **SSO / SAML** — enterprise single sign-on
- [ ] **Multi-workspace** — one account, multiple businesses (agency model)
- [ ] **Role-based permissions** — granular access control (partially done with team roles)
- [ ] **API keys** — REST API for external integrations
- [x] **Webhook subscriptions** — real-time event streaming (CRUD + HMAC signing)
- [ ] **SLA monitoring** — response time SLAs with alerts

### AI Advanced
- [ ] **Fine-tuned models** — train on tenant's historical conversations
- [ ] **Sentiment analysis** — detect angry/frustrated customers, auto-escalate
- [ ] **Intent classification** — route to different flows: sales vs support vs billing
- [ ] **Conversation summarization** — daily digest email with AI summary
- [ ] **Voice AI** — handle WhatsApp voice calls with AI

### Infrastructure
- [ ] **Redis for session state** — move WhatsApp auth state from filesystem to Redis
- [ ] **Queue system** — BullMQ for message processing, retries, dead letter queue
- [ ] **CDN for media** — Cloudflare R2 for WhatsApp media storage
- [ ] **Monitoring** — Sentry for errors, Grafana for metrics
- [ ] **Database backups** — automated daily backups
- [ ] **Horizontal scaling** — Redis pub/sub for multi-instance coordination

---

## 💡 Quick Wins (< 1 day each)

- [x] Favicon and OG meta tags for the dashboard
- [x] Loading skeletons on all pages
- [x] Toast notifications for save/error actions (sonner)
- [x] Empty states with illustrations for inbox, leads, handoffs
- [x] "Cerrar sesión" confirmation modal
- [x] Copy phone number to clipboard on click (leads table)
- [x] Relative time updates without page refresh (useInterval every 60s)
- [ ] Mobile: swipe to archive conversations
- [ ] Settings: preview how the AI responds with current config
- [ ] Demo page: show Loomi branding + "Powered by Loomi" link
- [x] SEO landing page at `/` (hero + features + how it works + CTA)

---

## 📊 Progress Summary

| Priority | Done | Total | % |
|----------|------|-------|---|
| P0       | 17   | 17    | 100% |
| P1       | 16   | 24    | 67% |
| P2       | 11   | 26    | 42% |
| P3       | 1    | 17    | 6% |
| Quick Wins | 8  | 11    | 73% |
| **Total** | **53** | **95** | **56%** |

---

*Last updated: 2026-02-26 3:00 PM CST*
*Benchmarked against: Respond.io, Sintra.ai, ManyChat, Intercom, HubSpot, Drift, Apollo.io, Wati.io, Tidio*
