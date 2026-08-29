import { getOrCreateConversation, addMessage, messageExists, getOrCreateLead, updateLead, updateLeadScore, createHandoff, updateConversation, getAgentConfig } from '../db/queries.js';
import { generateResponse } from '../ai/engine.js';
import { getSupabase } from '../db/client.js';
import type { AgentConfig } from '@omona/shared';
import { logger } from '../logger.js';
import { sendHandoffNotification } from './notifications.js';
import { sendPushToOrg } from './push.js';
import { sendAppointmentEmail } from '../api/calendar.js';

/**
 * Check if a conversation has any open (pending/accepted) handoffs.
 * If not, the conversation is stuck in handoff status and should be auto-recovered.
 */
async function hasActiveHandoffs(conversationId: string): Promise<boolean> {
  const { data } = await getSupabase()
    .from('handoffs')
    .select('id')
    .eq('conversation_id', conversationId)
    .in('status', ['pending', 'accepted'])
    .limit(1);
  return (data?.length ?? 0) > 0;
}

export async function processIncomingMessage(
  orgId: string,
  agentConfig: AgentConfig,
  phoneNumber: string,
  messageText: string,
  contactName?: string,
  waMessageId?: string,
  whatsappJid?: string
): Promise<{ reply: string; conversationId: string }> {

  if (waMessageId && await messageExists(waMessageId)) {
    logger.info({ waMessageId }, 'Duplicate message, skipping');
    return { reply: '', conversationId: '' };
  }

  const conv = await getOrCreateConversation(orgId, phoneNumber, contactName);

  // Store original WhatsApp JID so manual sends from the portal work correctly
  // (LID users can't be reached by reconstructing JID from phone number)
  if (whatsappJid && (conv.metadata as any)?.whatsapp_jid !== whatsappJid) {
    try {
      await updateConversation(conv.id, {
        metadata: { ...(conv.metadata as any), whatsapp_jid: whatsappJid },
      } as any);
    } catch (err) {
      logger.warn({ err, conversationId: conv.id }, 'Failed to store WhatsApp JID in conversation metadata');
    }
  }

  if (conv.status === 'handoff') {
    // Check if there are actually open handoffs — if not, auto-recover
    const stillInHandoff = await hasActiveHandoffs(conv.id);
    if (stillInHandoff) {
      logger.info({ conversationId: conv.id, phoneNumber }, 'Message saved during handoff — bot paused, awaiting human reply');
      await addMessage(conv.id, 'user', messageText, waMessageId);
      return { reply: '', conversationId: conv.id };
    }
    // No open handoffs — conversation is stuck, auto-recover to active
    logger.warn({ conversationId: conv.id, phoneNumber }, 'Conversation stuck in handoff with no active handoffs, auto-recovering to active');
    try {
      await updateConversation(conv.id, { status: 'active' } as any);
    } catch (err) {
      logger.error({ err, conversationId: conv.id }, 'Failed to auto-recover conversation status, proceeding anyway');
    }
  }

  await addMessage(conv.id, 'user', messageText, waMessageId);
  const lead = await getOrCreateLead(orgId, conv.id, phoneNumber);


  const aiResponse = await generateResponse(agentConfig, conv.id, orgId);

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
  if (Object.keys(leadUpdate).length > 0) await updateLead(lead.id, leadUpdate);

  if (aiResponse.lead_score_delta !== 0) await updateLeadScore(lead.id, aiResponse.lead_score_delta);

  if (aiResponse.conversation_summary) {
    try {
      await updateConversation(conv.id, { summary: aiResponse.conversation_summary } as any);
    } catch (err) {
      logger.warn({ err, conversationId: conv.id }, 'Failed to update conversation summary');
    }
  }

  // Auto-book appointment if AI scheduled one
  const rawResponse = aiResponse as any;
  if (rawResponse.schedule_appointment?.datetime) {
    try {
      const appt = rawResponse.schedule_appointment;
      const appointmentData = {
        organization_id: orgId,
        conversation_id: conv.id,
        customer_name: appt.customer_name || info.name || conv.contact_name || null,
        customer_phone: phoneNumber,
        customer_email: info.email || null,
        scheduled_at: appt.datetime,
        duration_min: 30,
        status: 'confirmed',
        notes: `Agendado automaticamente por IA. ${aiResponse.conversation_summary || ''}`,
      };
      await getSupabase().from('appointments').insert(appointmentData);
      logger.info({ orgId, phone: phoneNumber, datetime: appt.datetime }, 'AI auto-booked appointment');

      // Send confirmation email
      const agentCfg = await getAgentConfig(orgId);
      sendAppointmentEmail(appointmentData, agentCfg?.business_name || 'Tu negocio').catch(() => {});
    } catch (err) {
      logger.warn({ err }, 'Failed to auto-book appointment');
    }
  }

  if (aiResponse.needs_handoff && aiResponse.handoff_reason) {
    await createHandoff(orgId, conv.id, aiResponse.handoff_reason);
    sendPushToOrg(orgId, 'Nueva solicitud de handoff', aiResponse.handoff_reason, {
      type: 'handoff',
      conversation_id: conv.id,
    }).catch(() => {});
    sendHandoffNotification({
      orgId,
      notificationPhone: agentConfig.notification_phone ?? null,
      notificationEmail: agentConfig.notification_email ?? null,
      contactName: conv.contact_name,
      contactPhone: phoneNumber,
      reason: aiResponse.handoff_reason,
    }).catch((err) => logger.warn({ err }, 'Handoff notification failed'));
  }

  return { reply: aiResponse.reply, conversationId: conv.id };
}
