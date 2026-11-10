# Omona

AI-powered WhatsApp sales assistant for LATAM SMBs. Connects to WhatsApp via Baileys, qualifies leads with AI (Azure AI / Grok), and provides a full CRM dashboard.

## Architecture

**Turborepo monorepo** with npm workspaces. Node ≥ 20, npm 10.9.4.

```
apps/server       → Hono REST API + WhatsApp bot (Node.js, tsx)
apps/dashboard    → Next.js 14 admin dashboard (React 18, Tailwind CSS 3)
packages/shared   → Shared TypeScript types (@omona/shared)
supabase/         → Database migrations
```

## Deployment

- **Server**: Railway (handles cold starts — WhatsApp sessions auto-reconnect on restart)
- **Dashboard**: Vercel
- **Database / Auth**: Supabase (managed Postgres + Auth + RLS)
- **Email**: Resend (from `omona@anthana.agency`)

---

## Server (`apps/server` — `@omona/server`)

### Dependencies

| Package | Purpose |
|---------|---------|
| `hono` + `@hono/node-server` | HTTP framework |
| `openai` | AI model inference via Azure AI (OpenAI-compatible SDK) |
| `baileys` v7 | WhatsApp Web multi-device connection |
| `@supabase/supabase-js` | Database + auth (service_role key) |
| `zod` | Input validation and env config parsing |
| `pino` + `pino-pretty` | Structured logging |
| `pdf-parse` | PDF text extraction for knowledge base |
| `mammoth` | DOCX text extraction for knowledge base |
| `qrcode` | QR code generation for WhatsApp pairing |
| `dotenv` | Environment variable loading |
| `better-sqlite3` | (dependency, not directly used in app code) |
| Groq API (via fetch) | Whisper audio transcription (`GROQ_API_KEY`) |
| Resend API (via fetch) | Email notifications (`RESEND_API_KEY`) |

### Source Structure

```
src/
├── index.ts              # Entry point — Hono app, CORS, health check, cron jobs
├── config.ts             # Zod-validated env config
├── logger.ts             # Pino logger
├── ai/
│   ├── client.ts         # Centralized AI client (OpenAI SDK → Azure AI endpoint)
│   ├── engine.ts         # generateResponse() — main AI call with conversation history
│   ├── prompt-builder.ts # buildSystemPrompt() — sales methodology, personality, calendar context
│   ├── lead-extractor.ts # parseAIResponse() — JSON parsing from AI output
│   ├── demo-engine.ts    # In-memory demo chat (no DB, 30min TTL)
│   └── demo-config.ts    # Hardcoded AgentConfig for Omona's own demo
├── api/
│   ├── routes.ts         # Route registrar  — rate limit → auth → trial check → handlers
│   ├── middleware.ts      # authMiddleware — Supabase JWT verification, auto org/profile creation
│   ├── rate-limit.ts      # 100 req/min per org
│   ├── conversations.ts   # CRUD + search + tags + pin + unread + export CSV
│   ├── leads.ts           # CRUD + pipeline stages + bulk actions + export CSV
│   ├── settings.ts        # Agent config read/write
│   ├── handoff.ts         # List/accept/resolve handoffs, send human replies via WhatsApp
│   ├── whatsapp.ts        # Connect/disconnect/status/QR for WhatsApp sessions
│   ├── onboarding.ts      # Multi-step onboarding (website scraping, doc upload, manual config)
│   ├── analytics.ts       # Metrics: conversations, leads, response time, handoff rate, time series
│   ├── broadcast.ts       # Bulk messaging to filtered contacts
│   ├── calendar.ts        # Availability rules CRUD, appointment CRUD, 24h WhatsApp reminders
│   ├── team.ts            # Team member CRUD + Resend email invitations + role management
│   ├── webhooks.ts        # Webhook subscription CRUD + HMAC signing + event dispatch
│   ├── admin.ts           # Org management, plan/trial updates, team member listing
│   ├── test-chat.ts       # Test chat with org's own agent config
│   └── widget.ts          # Embeddable web chat widget (public, no auth)
├── services/
│   ├── conversation.ts    # processIncomingMessage() — main message pipeline
│   ├── follow-up.ts       # checkStaleConversations() — 24h auto follow-up via WhatsApp
│   ├── handoff.ts         # triggerHandoff(), acceptHandoff(), resolveHandoff()
│   ├── lead.ts            # mergeLeadInfo(), adjustLeadScore()
│   ├── notifications.ts   # Handoff alerts via WhatsApp + Resend email (HTML template)
│   ├── document-parser.ts # PDF/DOCX/TXT → AI extraction for knowledge base
│   └── website-parser.ts  # URL scraping → AI extraction (multi-page, JSON-LD, prices)
├── whatsapp/
│   ├── session-manager.ts # Baileys socket lifecycle, Supabase auth state, Groq Whisper transcription
│   ├── message-handler.ts # Delegates to conversation service
│   ├── qr-manager.ts      # QR code generation/storage
│   └── supabase-auth-state.ts # Persists Baileys auth creds in Supabase (survives Railway deploys)
├── db/
│   ├── client.ts          # Singleton Supabase client (service_role, no session persistence)
│   └── queries.ts         # All DB operations: orgs, agent_configs, conversations, messages, leads, handoffs, whatsapp_sessions
├── utils/
│   └── sanitize.ts        # XSS prevention
└── types/
    └── pdf-parse.d.ts     # Type declaration for pdf-parse
```

### Background Jobs (setInterval in `index.ts`)

| Job | Interval | Description |
|-----|----------|-------------|
| `reconnectActiveSessions()` | Once at startup (3s delay) | Reconnects all WhatsApp sessions marked `connected`/`connecting` |
| `checkStaleConversations()` | Every 4 hours | Sends follow-up to conversations with no customer reply in 24h |
| `checkUpcomingReminders()` | Every 1 hour | Sends WhatsApp reminders for appointments within 24h |

### AI Pipeline

1. Incoming WhatsApp message → `session-manager.ts` (Baileys event)
2. Audio messages → Groq Whisper transcription (`whisper-large-v3`, Spanish)
3. Media messages → placeholder text (images, video, docs, stickers, contacts, location)
4. `processIncomingMessage()` in `conversation.ts`:
   - Dedup by WhatsApp message ID
   - Skip if conversation is in `handoff` status
   - Business hours check → after-hours auto-reply
   - `generateResponse()` → AI call (Azure AI / Grok) with last 20 messages
   - Parse structured JSON response → extract lead info, score delta, handoff signal
   - Update lead record, score (0–100 range), and conversation summary
   - Auto-book appointment if AI included `schedule_appointment` in response
   - Trigger handoff + notifications if `needs_handoff: true`
5. AI response format: JSON with `reply`, `extracted_info`, `lead_score_delta`, `needs_handoff`, `handoff_reason`, `conversation_summary`

### API Authentication Flow

1. Dashboard sends `Authorization: Bearer <supabase_jwt>`
2. `authMiddleware` verifies JWT via `supabase.auth.getUser(token)`
3. Looks up `profiles.organization_id`
4. If no profile exists (race condition or trigger failure), creates org + profile + default agent_config
5. Sets `c.set('auth', { userId, orgId, email })` for downstream handlers
6. Trial expiration middleware blocks expired free-plan orgs (except onboarding/admin routes)

---

## Dashboard (`apps/dashboard` — `@omona/dashboard`)

### Dependencies

| Package | Purpose |
|---------|---------|
| `next` 14 | App Router framework |
| `react` / `react-dom` 18 | UI library |
| `tailwindcss` 3 + `tailwindcss-animate` + `tailwind-merge` | Styling |
| `framer-motion` | Animations and transitions |
| `lucide-react` | Icon library |
| `class-variance-authority` | Component variant system |
| `recharts` | Analytics charts (line, bar, area, pie) |
| `sonner` | Toast notifications |
| `@supabase/supabase-js` | Client-side auth |
| `clsx` | Conditional classnames |

### Source Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout (fonts, metadata, Toaster)
│   ├── globals.css          # Global styles
│   ├── page.tsx             # SEO landing page (hero + features + pricing + CTA)
│   ├── icon.svg             # Favicon
│   ├── (auth)/              # Auth pages (no sidebar)
│   │   ├── login/           # Email/password + Google OAuth login
│   │   ├── signup/          # Registration
│   │   └── forgot-password/ # Password reset request
│   ├── auth/                # Auth callback routes
│   │   ├── callback/        # Supabase OAuth callback handler
│   │   ├── confirm/         # Email confirmation
│   │   ├── invite/          # Team invite acceptance
│   │   └── reset-password/  # Password reset form
│   ├── onboarding/          # Multi-step onboarding wizard
│   ├── demo/                # Public demo chat page
│   └── (dashboard)/         # Authenticated dashboard (with sidebar)
│       ├── layout.tsx       # Dashboard shell — sidebar, auth guard, onboarding redirect
│       ├── inbox/           # Conversation inbox with chat view
│       ├── leads/           # Lead management + pipeline Kanban + detail view
│       ├── handoff/         # Handoff queue
│       ├── analytics/       # Metrics dashboard
│       ├── calendar/        # Appointment scheduling
│       ├── broadcast/       # Bulk messaging
│       ├── settings/        # Agent config + WhatsApp + team + webhooks
│       ├── test/            # Test chat with own agent
│       └── admin/           # Admin panel (org/plan management)
├── components/
│   ├── ui/                  # Primitives (Button, Input, Modal, Badge, Card, Skeleton, Tabs, etc.)
│   ├── shared/              # Layout (Sidebar, Header, EmptyState, CommandPalette, AuthGuard, etc.)
│   ├── inbox/               # ChatView, MessageBubble, ConversationList, StatusBar, QuickReplies
│   ├── leads/               # LeadDetail
│   ├── onboarding/          # OnboardingWizard steps (Website, ManualConfig, DocumentUpload, Completion)
│   └── settings/            # Settings tabs (GeneralSettings, ProductsEditor, FAQEditor, PersonalitySettings, WhatsAppSettings, TeamSettings, QuickRepliesEditor, WebhooksSettings)
├── hooks/
│   ├── useAuth.ts           # Auth state + signIn/signUp/signOut/signInWithGoogle + profile/org data
│   ├── useAdmin.ts          # Admin operations
│   ├── useConversations.ts  # Conversation CRUD + polling
│   ├── useLeads.ts          # Lead CRUD + filtering
│   ├── useMessages.ts       # Message loading + sending human replies
│   └── useSupabase.ts       # Supabase client re-export
└── lib/
    ├── api.ts               # API client — fetch wrapper with Supabase JWT auth + CSV download
    ├── supabase.ts          # Supabase browser client (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)
    └── utils.ts             # cn(), formatDate/Time/Phone/RelativeTime helpers
```

### Dashboard Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:3001      # Server API URL
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...           # Supabase public anon key
```

---

## Shared Package (`packages/shared` — `@omona/shared`)

Exports TypeScript types from `src/types.ts`, re-exported via `src/index.ts`.

### Database Types (mirrors Supabase schema)

| Type | Key Fields |
|------|------------|
| `Organization` | `id`, `name`, `slug`, `plan` (free/pro/enterprise) |
| `Profile` | `id`, `organization_id`, `full_name`, `role` (admin/agent/viewer) |
| `WhatsAppSession` | `organization_id`, `phone_number`, `status`, `qr_code`, `auth_state` |
| `AgentConfig` | `business_name`, `products_services[]`, `faqs[]`, `tone`, `sales_mode`, `quick_replies[]`, `system_prompt_override`, `notification_*` |
| `Product` | `name`, `description`, `price`, `features[]` |
| `FAQ` | `question`, `answer` |
| `QuickReply` | `id`, `title`, `message` |
| `Conversation` | `phone_number`, `contact_name`, `status` (active/handoff/resolved/archived), `tags[]`, `pinned`, `unread_count`, `summary` |
| `Message` | `conversation_id`, `role` (user/assistant/system), `content`, `whatsapp_message_id`, `metadata` |
| `Lead` | `phone_number`, `name`, `email`, `company`, `score` (0–100), `status` (new/qualified/contacted/demo_scheduled/converted/lost), `tags[]`, `assigned_to`, `custom_fields` |
| `Handoff` | `conversation_id`, `reason`, `status` (pending/accepted/resolved), `assigned_to` |

### AI Types

| Type | Description |
|------|-------------|
| `AIResponse` | `reply`, `extracted_info`, `lead_score_delta` (-10 to +15), `needs_handoff`, `handoff_reason`, `conversation_summary` |
| `ExtractedLeadInfo` | `name`, `email`, `company`, `company_size`, `budget`, `timeline`, `interest`, `pain_points` |

### API Types

`PaginatedResponse<T>`, `ConversationWithLastMessage`, `ConversationDetail`, `TestChatRequest`, `TestChatResponse`, `QRCodeResponse`, `WhatsAppStatusResponse`

---

## Database Tables (Supabase)

All tables are org-scoped with RLS policies. Server uses `SUPABASE_SERVICE_KEY` (service_role) to bypass RLS.

| Table | Description |
|-------|-------------|
| `organizations` | Multi-tenant orgs (name, slug, plan, trial_ends_at) |
| `profiles` | Users linked to orgs (role: admin/agent/viewer, onboarding state) |
| `agent_configs` | AI agent configuration per org (business info, products, FAQs, personality, sales mode) |
| `conversations` | WhatsApp conversations (status, tags, pinned, unread_count, summary) |
| `messages` | Chat messages (role, content, WhatsApp message ID, metadata) |
| `leads` | CRM leads (contact info, qualification fields, score 0–100, pipeline status, tags) |
| `handoffs` | Human handoff requests (reason, status, assignment) |
| `whatsapp_sessions` | WhatsApp connection state (status, QR, phone, auth_creds/keys for Baileys) |
| `appointments` | Calendar appointments (scheduled_at, duration, status, customer info) |
| `availability_rules` | Business availability for scheduling (day_of_week, start/end time, slot duration) |
| `team_invitations` | Pending team invites (email, role, token, expiry) |
| `webhook_subscriptions` | Webhook endpoints (url, events, secret for HMAC, active flag) |
| `knowledge_documents` | Uploaded documents for AI knowledge base |
| `broadcast_messages` | Bulk message records |

---

## Environment Variables (Full Reference)

### Server (root `.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | Server port |
| `NODE_ENV` | No | `development` | development / production |
| `SUPABASE_URL` | **Yes** | — | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | **Yes** | — | Supabase service_role key (bypasses RLS) |
| `AI_BASE_URL` | No | `https://omona-ai.services.ai.azure.com/models` | Azure AI Model Inference endpoint |
| `AI_API_KEY` | **Yes** | — | Azure AI API key |
| `AI_MODEL` | No | `grok-4-1-fast-reasoning-2` | AI model ID |
| `BAILEYS_AUTH_DIR` | No | `./auth_sessions` | Local WhatsApp auth session directory |
| `DASHBOARD_URL` | No | `http://localhost:3000` | Dashboard URL (for CORS) |
| `RESEND_API_KEY` | No | `''` | Resend API key for email notifications |
| `GROQ_API_KEY` | No | — | Groq API key for Whisper audio transcription |

### Dashboard (`apps/dashboard/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | **Yes** | Server API URL |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Supabase anon/public key |

---

## Commands

```bash
# Install dependencies
npm install

# Development (all apps via Turbo)
npm run dev

# Individual apps
npm run dev:server          # tsx watch src/index.ts
npm run dev:dashboard       # next dev

# Build
npm run build               # Build shared package (tsc)
npm run build:server        # Build server
npm run build:dashboard     # Build dashboard (next build)

# Production start
npm run start               # cd apps/server && npx tsx src/index.ts

# Type checking
cd apps/server && npm run typecheck   # tsc --noEmit
```

---

## Code Conventions

- **TypeScript** throughout, strict mode (`tsconfig.base.json` at root)
- **ESM modules** (`"type": "module"` in server)
- **Spanish UI copy** — error messages, notifications, and AI prompts are in Spanish (es-MX)
- **Zod** for env config validation and API input validation
- **Supabase RLS** for multi-tenant data isolation
- **Pino** structured JSON logging
- **No test framework** currently configured
- **CORS**: open (`origin: '*'`) in development
- **DNS**: forced IPv4 (`dns.setDefaultResultOrder('ipv4first')`)
- **Sender domain**: `omona@anthana.agency` (Resend)
- **Dashboard URL**: `dashboard-seven-henna-45.vercel.app` (hardcoded in notifications)
