import type { AIResponse, ExtractedLeadInfo } from '@omona/shared';

const EMPTY_EXTRACTED_INFO: ExtractedLeadInfo = {
  name: null,
  email: null,
  company: null,
  company_size: null,
  budget: null,
  timeline: null,
  interest: null,
  pain_points: null,
};

const FALLBACK_RESPONSE: AIResponse = {
  reply: '',
  extracted_info: EMPTY_EXTRACTED_INFO,
  lead_score_delta: 0,
  needs_handoff: false,
  handoff_reason: null,
  conversation_summary: null,
};

export function parseAIResponse(raw: string): AIResponse {
  // Try direct JSON parse first
  try {
    const parsed = JSON.parse(raw);
    return validateResponse(parsed);
  } catch {
    // Try extracting JSON from markdown code blocks
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch?.[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1].trim());
        return validateResponse(parsed);
      } catch {
        // Fall through
      }
    }

    // Try finding a JSON object in the text
    const objectMatch = raw.match(/\{[\s\S]*\}/);
    if (objectMatch?.[0]) {
      try {
        const parsed = JSON.parse(objectMatch[0]);
        return validateResponse(parsed);
      } catch {
        // Fall through
      }
    }

    // Last resort: use the raw text as the reply
    return {
      ...FALLBACK_RESPONSE,
      reply: raw.trim(),
    };
  }
}

function validateResponse(parsed: Record<string, unknown>): AIResponse {
  const reply = typeof parsed.reply === 'string' ? parsed.reply : '';

  const extractedRaw = (parsed.extracted_info ?? {}) as Record<string, unknown>;
  const extracted_info: ExtractedLeadInfo = {
    name: toNullableString(extractedRaw.name),
    email: toNullableString(extractedRaw.email),
    company: toNullableString(extractedRaw.company),
    company_size: toNullableString(extractedRaw.company_size),
    budget: toNullableString(extractedRaw.budget),
    timeline: toNullableString(extractedRaw.timeline),
    interest: toNullableString(extractedRaw.interest),
    pain_points: toNullableString(extractedRaw.pain_points),
  };

  const lead_score_delta = clampDelta(
    typeof parsed.lead_score_delta === 'number' ? parsed.lead_score_delta : 0
  );

  const needs_handoff = parsed.needs_handoff === true;

  const handoff_reason = needs_handoff
    ? toNullableString(parsed.handoff_reason)
    : null;

  const conversation_summary = toNullableString(parsed.conversation_summary);

  return {
    reply,
    extracted_info,
    lead_score_delta,
    needs_handoff,
    handoff_reason,
    conversation_summary,
  };
}

function toNullableString(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  return String(value);
}

function clampDelta(delta: number): number {
  return Math.max(-10, Math.min(15, Math.round(delta)));
}
