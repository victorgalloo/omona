import { chatCompletion, AI_MODEL } from './client.js';
import { buildSystemPrompt } from './prompt-builder.js';
import { parseAIResponse } from './lead-extractor.js';
import { DEMO_CONFIG } from './demo-config.js';
import { logger } from '../logger.js';

// In-memory conversation store for demo (no DB needed)
const demoConversations = new Map<string, Array<{ role: 'user' | 'assistant'; content: string }>>();

// Clean up old conversations every 30 min
setInterval(() => {
  demoConversations.clear();
}, 30 * 60 * 1000);

export async function generateDemoResponse(
  message: string,
  conversationId?: string
): Promise<{
  reply: string;
  conversation_id: string;
  extracted_info: any;
  lead_score: number;
}> {
  const convId = conversationId || `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Get or create conversation history
  if (!demoConversations.has(convId)) {
    demoConversations.set(convId, []);
  }
  const history = demoConversations.get(convId)!;

  // Add user message
  history.push({ role: 'user', content: message });

  // Build system prompt from demo config
  const systemPrompt = buildSystemPrompt(DEMO_CONFIG);

  // Keep last 20 messages
  const recentHistory = history.slice(-20);

  try {
    logger.info({ convId, messageCount: recentHistory.length, model: AI_MODEL }, 'Demo: calling AI');

    const rawText = await chatCompletion({
      system: systemPrompt,
      messages: recentHistory,
      maxTokens: 1024,
    });

    const parsed = parseAIResponse(rawText);

    if (!parsed.reply) parsed.reply = '¿Me podrías repetir eso?';

    // Save assistant reply to history
    history.push({ role: 'assistant', content: parsed.reply });

    return {
      reply: parsed.reply,
      conversation_id: convId,
      extracted_info: parsed.extracted_info,
      lead_score: parsed.lead_score_delta,
    };
  } catch (error) {
    logger.error({ error }, 'Demo AI error');
    return {
      reply: 'Disculpa, tuve un problema técnico. ¿Me podrías escribir de nuevo?',
      conversation_id: convId,
      extracted_info: {},
      lead_score: 0,
    };
  }
}
