import { processIncomingMessage } from '../services/conversation.js';
import { logger } from '../logger.js';
import type { AgentConfig } from '@omona/shared';

export interface IncomingMessage {
  orgId: string;
  phoneNumber: string;
  contactName?: string;
  messageText: string;
  whatsappMessageId: string;
  whatsappJid?: string;
}

export async function handleIncomingMessage(
  msg: IncomingMessage,
  agentConfig: AgentConfig,
  sendReply: (phoneNumber: string, text: string) => Promise<void>
): Promise<void> {
  const { orgId, phoneNumber, contactName, messageText, whatsappMessageId, whatsappJid } = msg;

  try {
    const result = await processIncomingMessage(
      orgId,
      agentConfig,
      phoneNumber,
      messageText,
      contactName,
      whatsappMessageId,
      whatsappJid
    );

    if (result.reply) {
      try {
        await sendReply(phoneNumber, result.reply);
        logger.info({ orgId, phoneNumber, conversationId: result.conversationId }, 'Reply sent to WhatsApp');
      } catch (sendError) {
        logger.error({ error: sendError, orgId, phoneNumber, conversationId: result.conversationId }, 'Failed to send reply to WhatsApp');
      }
    }
  } catch (error) {
    logger.error({ error, orgId, phoneNumber, whatsappMessageId }, 'Error processing incoming message');
  }
}
