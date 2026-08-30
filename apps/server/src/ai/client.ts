import OpenAI from 'openai';
import { config } from '../config.js';

// Azure migrated to v1 API (Aug 2025) — auto-fix old /models URLs
function resolveBaseURL(url: string): string {
  if (url.endsWith('/models')) {
    return url.replace(/\/models$/, '/openai/v1');
  }
  return url;
}

export const ai = new OpenAI({
  baseURL: resolveBaseURL(config.AI_BASE_URL),
  apiKey: config.AI_API_KEY,
  defaultHeaders: { 'api-key': config.AI_API_KEY },
});

export const AI_MODEL = config.AI_MODEL;

/**
 * Simple chat completion helper.
 * Converts a system prompt + messages array to an OpenAI-format call.
 */
export async function chatCompletion(opts: {
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
}): Promise<string> {
  const response = await ai.chat.completions.create({
    model: AI_MODEL,
    // GPT-5.x solo acepta max_completion_tokens y rechaza temperature != 1
    max_completion_tokens: opts.maxTokens ?? 1024,
    messages: [
      { role: 'system', content: opts.system },
      ...opts.messages,
    ],
  });

  return response.choices[0]?.message?.content ?? '';
}
