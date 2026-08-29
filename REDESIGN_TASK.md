# Dashboard Redesign Task

## Overview
Redesign the entire Loomi dashboard from WhatsApp green bubble aesthetic to the new **Terminal macOS + Vercel** dark-first design system documented in `DESIGN_SYSTEM.md`.

## Critical Rules
1. **Read `DESIGN_SYSTEM.md` first** — it has EVERY detail: colors, fonts, components, animations, spacing
2. **Spanish-first** — all UI text stays in Mexican Spanish (es-MX)
3. **Don't break functionality** — all API calls, auth, routing must keep working
4. **Build must pass** — `npx next build` must succeed with zero errors when done
5. **Mobile-first responsive** — bottom nav on mobile, sidebar on desktop

## What to Change

### 1. Global Styles (`src/app/globals.css`)
- Replace all WhatsApp colors with the new design system tokens
- Add CSS variables from DESIGN_SYSTEM.md Section 2 (both light/dark modes)
- Use `data-theme` attribute on `<html>` instead of class-based dark mode
- Add custom scrollbar styles, utility classes from Section 15
- Add font imports: Inter (next/font/google) + JetBrains Mono (Google Fonts @import)
- Add keyframe animations: blink, float, pulse-subtle

### 2. Tailwind Config (`tailwind.config.ts`)
- Map all design tokens to Tailwind theme
- Add custom colors: surface, surface-2, surface-elevated, muted, border, border-hover, accent-green, terminal-red/yellow/green, info, warning, success, error + muted variants
- Add font families: font-sans (Inter), font-mono (JetBrains Mono)
- Add custom text sizes: text-label (13px), text-body (15px)

### 3. Layout (`src/app/layout.tsx`)
- `<html lang="es" data-theme="light" suppressHydrationWarning>`
- Load Inter via next/font/google
- Theme provider with localStorage persistence (key: `loomi-theme`)

### 4. Dashboard Layout (`src/app/(dashboard)/layout.tsx`)
- New Sidebar: 240px expanded / 64px collapsed, collapsible, localStorage persistence
- Traffic light dots logo (`loomi_` in font-mono)
- Navigation sections: Monitorear (Pipeline, Inbox, Broadcasts), Configurar (Setup, Prompt, Knowledge), Configuración (Analytics, WhatsApp, Settings)
- Active item: spring-animated background with layoutId
- WhatsApp status dot at bottom
- User section with avatar + logout
- Mobile: slide-in sidebar with backdrop blur
- Top bar: h-12, breadcrumb, connection badge, theme toggle

### 5. All Pages — Apply Design System
- **Inbox**: Split panel (350px list + flex-1 detail), message bubbles (user: `bg-foreground text-background`, agent: `bg-surface-2 border`), typing dots with terminal-green
- **Leads**: Table with sticky header, stage badges (Cold=info, Warm=yellow, Hot=warning)
- **Lead Detail**: Terminal-style cards, tags, assignment, suggested replies
- **Pipeline/Kanban**: Columns with colored header dots, drag cards
- **Analytics**: Terminal stat cards (not rounded cards — use `gap-px bg-border` grid pattern), funnel bars
- **Calendar**: Clean dark cards
- **Settings**: Section headers with colored left border, settings rows pattern, danger zone with terminal-red
- **Handoff**: Alert banners with priority colors and left border accent
- **Broadcast**: Terminal-style compose window

### 6. Shared Components
- **Header**: Replace with top bar (h-12, breadcrumb, connection badge)
- **Sidebar**: Complete rewrite per DESIGN_SYSTEM.md Section 7
- **MobileNav**: Replace bottom nav with sidebar slide-in on mobile
- **ThemeToggle**: Sun/Moon with rotation animation, `data-theme` based
- **CommandPalette**: Update colors to surface/border tokens
- **Buttons**: Use the shadcn button variants from Section 6.1 (rounded-full, shadow-soft)
- **Badges**: New variants (default, terminal, success, info, warning, error) per Section 6.4
- **Inputs**: h-12 rounded-xl border-border bg-surface, focus ring info/30

### 7. Brand Elements
- Logo: Traffic light dots (red/yellow/green) + `loomi_` in font-mono
- NO more WhatsApp green (#25D366) as primary — use `accent-green` (#34d399 dark / #059669 light)
- Message bubbles: user=`bg-foreground text-background`, agent=`bg-surface-2 border border-border`

## Files to Modify (minimum)
- `src/app/globals.css` — complete rewrite of color system
- `tailwind.config.ts` — new theme tokens
- `src/app/layout.tsx` — font loading, theme
- `src/app/(dashboard)/layout.tsx` — sidebar + shell
- `src/components/shared/Sidebar.tsx` — complete rewrite
- `src/components/shared/Header.tsx` — becomes top bar
- `src/components/shared/MobileNav.tsx` — becomes mobile sidebar
- `src/components/shared/ThemeToggle.tsx` — data-theme based
- `src/components/shared/CommandPalette.tsx` — new colors
- `src/components/inbox/ChatView.tsx` — new bubble styles
- `src/components/inbox/ConversationList.tsx` — new list style
- `src/app/(dashboard)/analytics/page.tsx` — stat grid + funnel
- `src/app/(dashboard)/settings/page.tsx` — section headers + rows
- `src/app/(dashboard)/leads/page.tsx` — table + badges
- `src/app/(dashboard)/leads/[id]/page.tsx` — terminal cards
- `src/app/(dashboard)/handoff/page.tsx` — alert banners
- `src/app/(dashboard)/inbox/page.tsx` — split panel
- `src/app/(dashboard)/calendar/page.tsx` — dark cards
- `src/app/(dashboard)/leads/pipeline/page.tsx` — kanban
- `src/app/(dashboard)/broadcast/page.tsx` — compose window
- All settings components in `src/components/settings/`

## Don't Touch
- `src/lib/api.ts` — API layer
- `src/lib/supabase.ts` — Supabase client  
- `src/hooks/*` — data hooks
- Auth pages (`login`, `signup`, `forgot-password`) — redesign those too but keep auth logic
- `src/app/auth/*` — keep callback/confirm/invite logic

## Verification
After all changes, run:
```bash
cd /home/clawd/projects/loomi/apps/dashboard && npx next build
```
Fix any errors until build passes clean.

Then commit everything:
```bash
cd /home/clawd/projects/loomi && git add -A && git commit -m "feat: complete dashboard redesign — Terminal macOS + Vercel aesthetic"
```
