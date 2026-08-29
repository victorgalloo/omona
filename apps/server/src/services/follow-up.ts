import { getSupabase } from '../db/client.js';
import { getAgentConfig, addMessage, updateConversation } from '../db/queries.js';
import { whatsappRouter } from '../whatsapp/router.js';
import { logger } from '../logger.js';

const FOLLOW_UP_MESSAGE = 'Hola! Solo quería dar seguimiento a nuestra conversación. ¿Hay algo más en lo que te pueda ayudar? 😊';

export async function checkStaleConversations(): Promise<void> {
  logger.info('Running follow-up check for stale conversations');

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: staleConvs, error } = await getSupabase()
    .from('conversations')
    .select('*')
    .eq('status', 'active')
    .lt('last_message_at', cutoff);

  if (error) {
    logger.warn({ error }, 'Failed to query stale conversations');
    return;
  }

  if (!staleConvs || staleConvs.length === 0) {
    logger.info('No stale conversations found');
    return;
  }

  for (const conv of staleConvs) {
    try {
      // Skip if follow-up already sent
      const metadata = (conv.metadata || {}) as Record<string, unknown>;
      if (metadata.follow_up_sent) continue;

      // Check that the last message was from the assistant (we replied, customer didn't)
      const { data: lastMessages } = await getSupabase()
        .from('messages')
        .select('role')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!lastMessages || lastMessages.length === 0) continue;
      if (lastMessages[0]!.role !== 'assistant') continue;

      const agentConfig = await getAgentConfig(conv.organization_id);
      if (!agentConfig) continue;

      // Send via WhatsApp — use stored JID for LID users
      const storedJid = (metadata as any)?.whatsapp_jid as string | undefined;
      await whatsappRouter.sendMessage(conv.organization_id, conv.phone_number, FOLLOW_UP_MESSAGE, storedJid);

      // Save to DB
      await addMessage(conv.id, 'assistant', FOLLOW_UP_MESSAGE);

      // Mark follow-up sent
      await updateConversation(conv.id, {
        metadata: { ...metadata, follow_up_sent: true },
      } as any);

      logger.info({ convId: conv.id, phone: conv.phone_number }, 'Follow-up sent');
    } catch (err) {
      logger.warn({ err, convId: conv.id }, 'Failed to send follow-up for conversation');
    }
  }
}
