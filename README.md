# 🤖 Omona

**AI-powered WhatsApp sales assistant for LATAM businesses.**

Omona connects to your WhatsApp, responds to customers 24/7 with a trained AI agent, qualifies leads automatically, and gives you a full CRM dashboard to manage everything.

---

## ✨ Features

### WhatsApp AI Agent
- 🔌 **One-click WhatsApp connection** — scan a QR code, no Meta API needed
- 🧠 **AI-powered conversations** — natural sales conversations in Spanish (auto-detects other languages)
- 📊 **Automatic lead qualification** — extracts name, email, company, budget, timeline from chat
- 🔄 **Smart handoff** — AI detects when a human is needed and escalates with notifications
- ⏰ **Business hours** — after-hours auto-reply with custom message
- 🔁 **Follow-up automation** — auto follow-up if no reply in 24h
- 🎤 **Voice message transcription** — Whisper via Groq for audio messages

### CRM Dashboard
- 💬 **Unified inbox** — all WhatsApp conversations in one place with search, tags, and pinning
- 👥 **Lead pipeline** — Kanban board with stages (new → qualified → demo → converted → lost)
- 📈 **Analytics** — conversations/day, response time, handoff rate, lead scoring trends
- 📅 **Calendar** — availability rules, AI auto-booking, 24h WhatsApp reminders
- 📢 **Broadcast** — bulk messaging to filtered contacts
- 👥 **Team management** — invite members via email, assign roles (admin/agent/viewer)
- 🔗 **Webhooks** — HMAC-signed event notifications for external integrations
- 📤 **CSV export** — export leads and conversations

### Onboarding
- 🌐 **Website scraping** — paste your URL, AI extracts products, FAQs, and business info automatically
- 📄 **Document upload** — upload PDF, DOCX, or TXT catalogs for AI knowledge base
- ✏️ **Manual config** — set up products, FAQs, personality, and sales strategy by hand

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Server** | [Hono](https://hono.dev) + Node.js |
| **Dashboard** | [Next.js 14](https://nextjs.org) (App Router) + Tailwind CSS + Framer Motion |
| **AI** | [Azure AI Model Inference](https://ai.azure.com) (Grok via OpenAI-compatible SDK) |
| **WhatsApp** | [Baileys](https://github.com/WhiskeySockets/Baileys) (multi-device, no Meta API) |
| **Database** | [Supabase](https://supabase.com) (Postgres + Auth + RLS) |
| **Email** | [Resend](https://resend.com) |
| **Audio** | [Groq](https://groq.com) Whisper (voice message transcription) |
| **Charts** | [Recharts](https://recharts.org) |
| **Monorepo** | [Turborepo](https://turbo.build) + npm workspaces |
| **Hosting** | Railway (server) + Vercel (dashboard) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- A [Supabase](https://supabase.com) project
- An [Azure AI](https://ai.azure.com) API key (or compatible endpoint)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/omona.git
cd omona
npm install
```

### 2. Configure Environment

Copy the example and fill in your keys:

```bash
cp .env.example .env
```

**Server** (root `.env`):

| Variable | Required | Description |
|----------|:--------:|-------------|
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | ✅ | Service role key (server-side, bypasses RLS) |
| `AI_API_KEY` | ✅ | Azure AI API key |
| `AI_MODEL` | | Model ID (default: `grok-4-1-fast-reasoning-2`) |
| `AI_BASE_URL` | | Azure AI endpoint (default: `https://omona-ai.services.ai.azure.com/models`) |
| `PORT` | | Server port (default: `3001`) |
| `DASHBOARD_URL` | | Dashboard URL for CORS (default: `http://localhost:3000`) |
| `RESEND_API_KEY` | | Resend key for email notifications |
| `GROQ_API_KEY` | | Groq key for voice message transcription |
| `BAILEYS_AUTH_DIR` | | WhatsApp auth session path (default: `./auth_sessions`) |

**Dashboard** (`apps/dashboard/.env`):

| Variable | Required | Description |
|----------|:--------:|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | Server URL (e.g. `http://localhost:3001`) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |

### 3. Set Up Database

Run the Supabase migrations in `supabase/` to create all required tables and RLS policies.

### 4. Run

```bash
# All apps (server + dashboard)
npm run dev

# Or individually
npm run dev:server      # http://localhost:3001
npm run dev:dashboard   # http://localhost:3000
```

---

## 📁 Project Structure

```
omona/
├── apps/
│   ├── server/           # Hono REST API + WhatsApp bot
│   │   └── src/
│   │       ├── ai/       # AI engine, prompts, lead extraction
│   │       ├── api/      # Route handlers (13 modules)
│   │       ├── services/ # Business logic (conversations, follow-ups, notifications, parsers)
│   │       ├── whatsapp/ # Baileys session management
│   │       └── db/       # Supabase client and queries
│   └── dashboard/        # Next.js 14 admin dashboard
│       └── src/
│           ├── app/      # Pages (landing, auth, onboarding, dashboard)
│           ├── components/ # UI components (inbox, leads, settings, etc.)
│           ├── hooks/    # React hooks (auth, conversations, leads, messages)
│           └── lib/      # API client, Supabase client, utilities
├── packages/
│   └── shared/           # Shared TypeScript types (@omona/shared)
├── supabase/             # Database migrations
├── turbo.json            # Turborepo config
└── package.json          # Workspace root
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run dev:server` | Start server only (with hot reload) |
| `npm run dev:dashboard` | Start dashboard only |
| `npm run build` | Build shared package |
| `npm run build:server` | Build server |
| `npm run build:dashboard` | Build dashboard |
| `npm run start` | Start server in production |

---

## 🏢 Multi-Tenant Architecture

Omona is fully multi-tenant. Each organization has isolated data enforced by Supabase Row Level Security (RLS). The server uses a `service_role` key for admin operations while the dashboard uses the `anon` key respecting RLS policies.

**Plans**: Free (with trial) → Pro → Enterprise

**Roles**: Admin · Agent · Viewer

---

## 📄 License

Private — All rights reserved.

---

Built with ❤️ for LATAM by [Anthana](https://anthana.agency)
