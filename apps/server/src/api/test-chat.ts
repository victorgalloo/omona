import { Hono } from 'hono';
import { getAgentConfig, getOrCreateConversation, addMessage, getOrCreateLead, updateLead, updateLeadScore, createHandoff, updateConversation } from '../db/queries.js';
import { generateResponse } from '../ai/engine.js';
import { generateDemoResponse } from '../ai/demo-engine.js';
import { sendHandoffNotification } from '../services/notifications.js';
import { getAuth } from './middleware.js';
import { logger } from '../logger.js';

export const testChatRoutes = new Hono();

// Demo mode — Omona selling itself, no config needed (public — auth applied in routes.ts but demo is exempt, see index.ts)
testChatRoutes.post('/demo', async (c) => {
  const { message, conversation_id } = await c.req.json();
  if (!message) return c.json({ error: 'Mensaje requerido' }, 400);

  try {
    const res = await generateDemoResponse(message, conversation_id);
    return c.json(res);
  } catch (error) {
    logger.error({ error }, 'Demo chat error');
    return c.json({ error: 'Error al procesar el mensaje' }, 500);
  }
});

testChatRoutes.post('/chat', async (c) => {
  const { message, conversation_id } = await c.req.json();
  if (!message) return c.json({ error: 'Mensaje requerido' }, 400);

  const { orgId } = getAuth(c);
  const agentConfig = await getAgentConfig(orgId);
  if (!agentConfig) return c.json({ error: 'Configura tu agente primero' }, 400);

  const phoneNumber = conversation_id || `test-${Date.now()}`;
  const conv = await getOrCreateConversation(orgId, phoneNumber, 'Usuario de Prueba');

  await addMessage(conv.id, 'user', message);

  const lead = await getOrCreateLead(orgId, conv.id, phoneNumber);

  try {
    const aiResponse = await generateResponse(agentConfig, conv.id);

    await addMessage(conv.id, 'assistant', aiResponse.reply, undefined, {
      extracted_info: aiResponse.extracted_info,
      lead_score_delta: aiResponse.lead_score_delta,
    });

    const info = aiResponse.extracted_info;
    const leadUpdate: Record<string, any> = {};
    if (info.name) leadUpdate.name = info.name;
    if (info.email) leadUpdate.email = info.email;
    if (info.company) leadUpdate.company = info.company;
    if (info.company_size) leadUpdate.company_size = info.company_size;
    if (info.budget) leadUpdate.budget = info.budget;
    if (info.timeline) leadUpdate.timeline = info.timeline;
    if (info.interest) leadUpdate.interest = info.interest;
    if (info.pain_points) leadUpdate.pain_points = info.pain_points;
    if (Object.keys(leadUpdate).length > 0) await updateLead(orgId, lead.id, leadUpdate);

    if (aiResponse.lead_score_delta !== 0) await updateLeadScore(orgId, lead.id, aiResponse.lead_score_delta);

    if (aiResponse.conversation_summary) {
      await updateConversation(orgId, conv.id, { summary: aiResponse.conversation_summary } as any);
    }

    if (aiResponse.needs_handoff && aiResponse.handoff_reason) {
      await createHandoff(orgId, conv.id, aiResponse.handoff_reason);
      sendHandoffNotification({
        orgId,
        notificationPhone: agentConfig.notification_phone ?? null,
        notificationEmail: agentConfig.notification_email ?? null,
        contactName: conv.contact_name,
        contactPhone: phoneNumber,
        reason: aiResponse.handoff_reason,
      }).catch((err) => logger.warn({ err }, 'Test chat handoff notification failed'));
    }

    return c.json({
      reply: aiResponse.reply,
      conversation_id: conv.phone_number,
      extracted_info: aiResponse.extracted_info,
      lead_score: lead.score + aiResponse.lead_score_delta,
      needs_handoff: aiResponse.needs_handoff,
    });
  } catch (error) {
    logger.error({ error }, 'Test chat error');
    return c.json({ error: 'Error al procesar el mensaje' }, 500);
  }
});
