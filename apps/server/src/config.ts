import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  // Supabase
  SUPABASE_URL: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1),

  // AI model — Azure AI Model Inference (OpenAI-compatible)
  // BASE_URL: https://xxx.services.ai.azure.com/models
  AI_BASE_URL: z.string().default('https://omona-ai.services.ai.azure.com/openai/v1'),
  AI_API_KEY: z.string().min(1),
  AI_MODEL: z.string().default('grok-4-1-fast-reasoning'),

  // Baileys
  BAILEYS_AUTH_DIR: z.string().default('./auth_sessions'),

  // WhatsApp Cloud API (canal oficial dual-mode)
  WHATSAPP_APP_SECRET: z.string().default(''),
  WHATSAPP_VERIFY_TOKEN: z.string().default('omona-verify-token'),

  // Dashboard URL (for CORS)
  DASHBOARD_URL: z.string().default('http://localhost:3000'),

  // Resend (email notifications)
  RESEND_API_KEY: z.string().default(''),

  // Supabase Auth Hook secret (for send_email hook verification)
  SUPABASE_HOOK_SECRET: z.string().default(''),

  // Apple Push Notifications (optional)
  APNS_KEY_ID:    z.string().default(''),
  APNS_TEAM_ID:   z.string().default(''),
  APNS_KEY:       z.string().default(''),
  APNS_BUNDLE_ID: z.string().default('com.anthana.omona-ios'),
  APNS_SANDBOX:   z.string().default('').transform(v => v === 'true'),
});

export const config = envSchema.parse(process.env);
