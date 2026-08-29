import { getLead, updateLead, updateLeadScore } from '../db/queries.js';
import type { ExtractedLeadInfo } from '@omona/shared';

/**
 * Merge extracted lead info — only update fields that are non-null
 * and don't overwrite existing data with null.
 */
export function mergeLeadInfo(leadId: string, info: ExtractedLeadInfo): void {
  const updates: Record<string, any> = {};
  for (const [key, value] of Object.entries(info)) {
    if (value !== null && value !== undefined) {
      updates[key] = value;
    }
  }
  if (Object.keys(updates).length > 0) {
    updateLead(leadId, updates);
  }
}

/**
 * Adjust lead score with bounds checking.
 */
export function adjustLeadScore(leadId: string, delta: number): void {
  updateLeadScore(leadId, delta);
}
