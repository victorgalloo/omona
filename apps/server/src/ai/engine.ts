import { config } from '../config.js';
import { chatCompletion, AI_MODEL } from './client.js';
import { buildSystemPrompt, buildCalendarContext } from './prompt-builder.js';
import { getAvailableSlots } from '../api/calendar.js';
import { parseAIResponse } from './lead-extractor.js';
import { getRecentMessages } from '../db/queries.js';
import type { AgentConfig, AIResponse } from '@omona/shared';
import { logger } from '../logger.js';

const MAX_TOKENS = 1024;
const HISTORY_LIMIT = 20;

export async function generateResponse(
  agentConfig: AgentConfig,
  conversationId: string,
  orgId?: string
): Promise<AIResponse> {
  let systemPrompt = buildSystemPrompt(agentConfig);

  // Inject calendar context if org has availability configured
  if (orgId) {
    try {
      const slots = await getAvailableSlots(orgId, 7);
      if (slots.length > 0) {
        systemPrompt += buildCalendarContext(slots);
      }
    } catch {} // silently skip if calendar not configured
  }
  const messages = await getRecentMessages(conversationId, HISTORY_LIMIT);

  const chatMessages = messages
    .filter(m => m.role !== 'system')
    .reduce<Array<{ role: 'user' | 'assistant'; content: string }>>((acc, msg) => {
      const role = msg.role === 'user' ? 'user' as const : 'assistant' as const;
      const last = acc[acc.length - 1];
      if (last && last.role === role) {
        last.content += '\n' + msg.content;
      } else {
        acc.push({ role, content: msg.content });
      }
      return acc;
    }, []);

  if (chatMessages.length > 0 && chatMessages[0]!.role !== 'user') {
    chatMessages.shift();
  }

  if (chatMessages.length === 0) {
    return {
      reply: '¡Hola! 👋 ¿En qué te puedo ayudar?',
      extracted_info: { name: null, email: null, company: null, company_size: null, budget: null, timeline: null, interest: null, pain_points: null },
      lead_score_delta: 0,
      needs_handoff: false,
      handoff_reason: null,
      conversation_summary: 'Conversación iniciada.',
    };
  }

  try {
    logger.info({ conversationId, messageCount: chatMessages.length, model: AI_MODEL }, 'Calling AI');

    const rawText = await chatCompletion({
      system: systemPrompt,
      messages: chatMessages,
      maxTokens: MAX_TOKENS,
    });

    logger.debug({ rawResponse: rawText.substring(0, 300) }, 'AI response');

    const parsed = parseAIResponse(rawText);
    if (!parsed.reply) parsed.reply = 'Disculpa, ¿me podrías repetir eso?';
    return parsed;
  } catch (error: any) {
    logger.error({
      conversationId,
      model: AI_MODEL,
      status: error?.status,
      code: error?.code,
      message: error?.message,
      type: error?.type,
    }, 'AI API error');
    return {
      reply: 'Disculpa, tuve un problema técnico. ¿Me podrías escribir de nuevo en un momento?',
      extracted_info: { name: null, email: null, company: null, company_size: null, budget: null, timeline: null, interest: null, pain_points: null },
      lead_score_delta: 0,
      needs_handoff: false,
      handoff_reason: null,
      conversation_summary: null,
    };
  }
}
