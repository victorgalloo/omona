import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  // Supabase
  SUPABASE_URL: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1),

  // Modelo de IA. Producción corre OpenAI directo; los defaults reflejan eso.
  // La API es compatible con OpenAI, así que cambiar de proveedor (Azure,
  // Bedrock, Z.ai, cualquier gateway) es sólo cambiar estas tres variables.
  AI_BASE_URL: z.string().default('https://api.openai.com/v1'),
  AI_API_KEY: z.string().min(1),
  AI_MODEL: z.string().default('gpt-5.6-terra'),

  // Baileys
  BAILEYS_AUTH_DIR: z.string().default('./auth_sessions'),

  // WhatsApp Cloud API (canal oficial dual-mode)
  WHATSAPP_APP_SECRET: z.string().default(''),
  WHATSAPP_VERIFY_TOKEN: z.string().default('omona-verify-token'),

  // Dashboard URL (for CORS)
  DASHBOARD_URL: z.string().default('http://localhost:3000'),

  // Resend (email notifications)
  RESEND_API_KEY: z.string().default(''),

  // Dirección remitente. El dominio DEBE estar verificado en Resend o la API
  // rechaza el envío: era la causa de que no llegaran los correos de
  // confirmación (anthana.agency no tenía SPF, DKIM ni MX).
  EMAIL_FROM_ADDRESS: z.string().default('hola@omona.tech'),
  EMAIL_FROM_NAME: z.string().default('Omona'),


  // Apple Push Notifications (optional)
  APNS_KEY_ID:    z.string().default(''),
  APNS_TEAM_ID:   z.string().default(''),
  APNS_KEY:       z.string().default(''),
  APNS_BUNDLE_ID: z.string().default('com.anthana.omona-ios'),
  APNS_SANDBOX:   z.string().default('').transform(v => v === 'true'),
});

export const config = envSchema.parse(process.env);
