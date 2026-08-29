import { Hono } from 'hono';
import { getAgentConfig, upsertAgentConfig } from '../db/queries.js';
import { getAuth, requireRole } from './middleware.js';
import { logger } from '../logger.js';
import { chatCompletion } from '../ai/client.js';
import { parseWebsite } from '../services/website-parser.js';
import { parseDocument } from '../services/document-parser.js';

export const onboardingRoutes = new Hono();

// Scrape a website and extract business info + products (v2 — multi-page smart parser)
onboardingRoutes.post('/scrape-website', requireRole('admin'), async (c) => {
  const { url } = await c.req.json();
  if (!url) return c.json({ error: 'URL requerida' }, 400);

  try {
    const data = await parseWebsite(url);

    // Auto-save to agent config
    const { orgId } = getAuth(c);
    await upsertAgentConfig(orgId, {
      business_name: data.business_name,
      business_description: data.business_description,
      industry: data.industry,
      target_audience: data.target_audience,
      tone: (data.tone === 'mixed' ? 'casual' : data.tone) as 'casual' | 'professional' | 'custom',
      language: data.language || 'es-MX',
      products_services: data.products_services,
      faqs: data.faqs,
    });

    return c.json({
      success: true,
      data,
      pages_scraped: 1 + (data as any)._subpages_count || 1,
    });
  } catch (error: any) {
    logger.error({ error: error.message, url }, 'Website scrape failed');
    return c.json({ error: `No pude acceder al sitio: ${error.message}` }, 400);
  }
});

// Upload document (PDF, DOCX, TXT) and extract business data
onboardingRoutes.post('/upload-document', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);

  const body = await c.req.parseBody();
  const file = body['file'];

  if (!file || typeof file === 'string') {
    return c.json({ error: 'Archivo requerido. Sube un PDF, DOCX o TXT.' }, 400);
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    return c.json({ error: 'El archivo es muy grande. Máximo 10MB.' }, 400);
  }

  const filename = file.name || 'document';
  const contentType = file.type || undefined;
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/csv',
    'text/markdown',
  ];
  const ext = filename.toLowerCase().split('.').pop() || '';
  const allowedExts = ['pdf', 'docx', 'doc', 'txt', 'csv', 'md'];

  if (contentType && !allowedTypes.includes(contentType) && !allowedExts.includes(ext)) {
    return c.json({ error: `Formato no soportado. Usa PDF, DOCX o TXT.` }, 400);
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await parseDocument(buffer, filename, contentType);

    // Auto-save to agent config (merge, don't overwrite)
    const updates: Record<string, unknown> = {};
    if (data.business_name) updates.business_name = data.business_name;
    if (data.business_description) updates.business_description = data.business_description;
    if (data.industry) updates.industry = data.industry;
    if (data.target_audience) updates.target_audience = data.target_audience;
    if (data.tone) updates.tone = data.tone === 'mixed' ? 'casual' : data.tone;
    if (data.language) updates.language = data.language;
    if (data.products_services?.length) updates.products_services = data.products_services;
    if (data.faqs?.length) updates.faqs = data.faqs;

    if (Object.keys(updates).length > 0) {
      await upsertAgentConfig(orgId, updates);
    }

    return c.json({
      success: true,
      data,
      filename,
      text_length: buffer.length,
    });
  } catch (error: any) {
    logger.error({ error: error.message, filename }, 'Document parse failed');
    return c.json({ error: error.message || 'Error al procesar el documento' }, 400);
  }
});

// Smart config chat — natural language to configure the bot
onboardingRoutes.post('/config-chat', requireRole('admin'), async (c) => {
  const { message, current_config } = await c.req.json();
  if (!message) return c.json({ error: 'Mensaje requerido' }, 400);

  const { orgId } = getAuth(c);
  const existingConfig = await getAgentConfig(orgId);

  const rawText = await chatCompletion({
    system: `Eres un asistente de configuración para Omona, una plataforma de agentes de ventas por WhatsApp.

Tu trabajo es ayudar al usuario a configurar su agente de ventas a través de conversación natural.

La configuración actual del agente es:
${JSON.stringify(current_config || existingConfig, null, 2)}

Cuando el usuario te pida cambios, responde con:
1. Un mensaje confirmando lo que vas a cambiar
2. Un objeto JSON con los campos a actualizar

Responde SOLO con JSON válido:
{
  "reply": "Tu mensaje al usuario confirmando los cambios",
  "updates": {
    "campo": "nuevo_valor"
  },
  "needs_update": true/false
}

Campos que puedes actualizar:
- business_name (string)
- business_description (string)
- industry (string)
- target_audience (string)
- tone ("casual" | "professional" | "custom")
- custom_personality (string — instrucciones de personalidad personalizadas)
- sales_mode ("schedule_demo" | "direct_close" | "lead_capture" | "flexible")
- qualification_questions (number 1-5)
- language (string, default "es-MX")
- products_services (array of {name, description, price, features[]})
- faqs (array of {question, answer})

Si el usuario solo hace una pregunta, responde sin updates (needs_update: false).
Sé amigable y guía al usuario para configurar todo lo necesario.`,
    messages: [{
      role: 'user',
      content: message,
    }],
    maxTokens: 2048,
    temperature: 0.5,
  });
  
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const match = rawText.match(/```(?:json)?\s*([\s\S]*?)```/) || rawText.match(/\{[\s\S]*\}/);
    try {
      parsed = JSON.parse(match?.[1] || match?.[0] || '{}');
    } catch {
      parsed = { reply: rawText, updates: {}, needs_update: false };
    }
  }

  // Apply updates if any
  if (parsed.needs_update && parsed.updates && Object.keys(parsed.updates).length > 0) {
    await upsertAgentConfig(orgId, parsed.updates);
    logger.info({ updates: Object.keys(parsed.updates) }, 'Config updated via chat');
  }

  const updatedConfig = await getAgentConfig(orgId);

  return c.json({
    reply: parsed.reply || 'Configuración actualizada',
    updates_applied: parsed.needs_update ? parsed.updates : null,
    current_config: updatedConfig,
  });
});

// Save onboarding config (bulk update)
onboardingRoutes.post('/save', requireRole('admin'), async (c) => {
  const body = await c.req.json();
  const { orgId, userId } = getAuth(c);
  const updated = await upsertAgentConfig(orgId, body);

  // Mark onboarding as completed
  const { getSupabase } = await import('../db/client.js');
  await getSupabase().from('profiles').update({ onboarding_completed: true, onboarding_step: 4 }).eq('id', userId);

  return c.json({ success: true, config: updated });
});

// Track onboarding step progress
onboardingRoutes.post('/step', async (c) => {
  const { step } = await c.req.json();
  const { userId } = getAuth(c);
  const { getSupabase } = await import('../db/client.js');
  await getSupabase().from('profiles').update({ onboarding_step: step }).eq('id', userId);
  return c.json({ ok: true });
});

// Get current config  
onboardingRoutes.get('/config', async (c) => {
  const { orgId } = getAuth(c);
  const agentConfig = await getAgentConfig(orgId);
  return c.json({ config: agentConfig });
});
