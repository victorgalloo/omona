export function sanitizeHtml(input: string): string {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}
export function sanitizeObject(obj: Record<string, any>, fields: string[]): Record<string, any> {
  const result = { ...obj };
  for (const field of fields) { if (typeof result[field] === 'string') result[field] = sanitizeHtml(result[field]); }
  return result;
}
