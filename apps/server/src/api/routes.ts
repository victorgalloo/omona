import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware, type AuthContext } from './middleware.js';
import { rateLimitMiddleware } from './rate-limit.js';
import { conversationRoutes } from './conversations.js';
import { leadRoutes } from './leads.js';
import { crmRoutes } from './crm.js';
import { settingsRoutes } from './settings.js';
import { handoffRoutes } from './handoff.js';
import { testChatRoutes } from './test-chat.js';
import { whatsappRoutes } from './whatsapp.js';
import { onboardingRoutes } from './onboarding.js';
import { analyticsRoutes } from './analytics.js';
import { broadcastRoutes } from './broadcast.js';
import { webhookRoutes } from './webhooks.js';
import { calendarRoutes } from './calendar.js';
import { teamRoutes } from './team.js';
import { adminRoutes } from './admin.js';
import { deviceTokenRoutes } from './device-tokens.js';

export const apiRoutes = new Hono();

// CORS on sub-router to ensure headers on all responses (including errors)
apiRoutes.use('/*', cors({
  origin: (origin) => origin || '*',
  credentials: true,
}));

// Rate limiting applied before auth
apiRoutes.use('/*', rateLimitMiddleware);

// All API routes require authentication
apiRoutes.use('/*', authMiddleware);

// Block expired free trials (except onboarding & admin routes)
apiRoutes.use('/*', async (c, next) => {
  const auth = c.get('auth') as AuthContext;
  if (!auth?.orgId) return next();

  // Allow onboarding and admin routes through
  if (c.req.path.includes('/onboarding') || c.req.path.includes('/admin')) return next();

  if (auth.plan === 'free' && auth.trialEndsAt && new Date(auth.trialEndsAt) < new Date()) {
    return c.json({ error: 'Trial expirado. Contacta ventas para continuar.', code: 'TRIAL_EXPIRED' }, 403);
  }

  return next();
});

apiRoutes.route('/conversations', conversationRoutes);
apiRoutes.route('/leads', leadRoutes);
apiRoutes.route('/crm', crmRoutes);
apiRoutes.route('/settings', settingsRoutes);
apiRoutes.route('/handoffs', handoffRoutes);
apiRoutes.route('/test', testChatRoutes);
apiRoutes.route('/whatsapp', whatsappRoutes);
apiRoutes.route('/onboarding', onboardingRoutes);
apiRoutes.route('/analytics', analyticsRoutes);
apiRoutes.route('/broadcast', broadcastRoutes);
apiRoutes.route('/webhooks', webhookRoutes);
apiRoutes.route('/calendar', calendarRoutes);
apiRoutes.route('/team', teamRoutes);
apiRoutes.route('/admin', adminRoutes);
apiRoutes.route('/device-tokens', deviceTokenRoutes);
