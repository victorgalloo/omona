import { createHandoff, updateHandoff, updateConversation } from '../db/queries.js';
import { sendPushToOrg } from './push.js';
import { logger } from '../logger.js';

/**
 * Create a handoff for a conversation.
 */
export async function triggerHandoff(orgId: string, conversationId: string, reason: string) {
  const handoff = createHandoff(orgId, conversationId, reason);
  logger.info({ conversationId, reason }, 'Handoff created');

  sendPushToOrg(orgId, 'Nueva solicitud de handoff', reason || 'El agente IA requiere atención humana', {
    type: 'handoff',
    conversation_id: conversationId,
  }).catch(() => {});

  return handoff;
}

/**
 * Accept a handoff — mark as accepted.
 */
export function acceptHandoff(handoffId: string) {
  updateHandoff(handoffId, { status: 'accepted' });
}

/**
 * Resolve a handoff and set conversation back to active.
 */
export function resolveHandoff(handoffId: string, conversationId: string) {
  updateHandoff(handoffId, { status: 'resolved', resolved_at: new Date().toISOString() });
  updateConversation(conversationId, { status: 'active' } as any);
}
