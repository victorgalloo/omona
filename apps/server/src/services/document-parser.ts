import { chatCompletion } from '../ai/client.js';
import { logger } from '../logger.js';
import type { ParsedBusinessInfo } from './website-parser.js';

// ── Text Extraction ─────────────────────────────────────────────────────

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid pdf-parse v1 test file loading at startup
  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(buffer);
  return data.text || '';
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}

function extractTextFromTxt(buffer: Buffer): string {
  return buffer.toString('utf-8');
}

function detectMimeType(filename: string, contentType?: string): string {
  if (contentType) return contentType;
  const ext = filename.toLowerCase().split('.').pop() || '';
  const map: Record<string, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword',
    txt: 'text/plain',
    csv: 'text/csv',
    md: 'text/markdown',
  };
  return map[ext] || 'application/octet-stream';
}

// ── Main Parser ─────────────────────────────────────────────────────────

export async function parseDocument(
  buffer: Buffer,
  filename: string,
  contentType?: string
): Promise<ParsedBusinessInfo> {
  const mime = detectMimeType(filename, contentType);
  logger.info({ filename, mime, size: buffer.length }, 'Parsing document');

  let text = '';

  if (mime === 'application/pdf') {
    text = await extractTextFromPDF(buffer);
  } else if (
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mime === 'application/msword'
  ) {
    text = await extractTextFromDocx(buffer);
  } else if (mime.startsWith('text/')) {
    text = extractTextFromTxt(buffer);
  } else {
    throw new Error(`Formato no soportado: ${mime}. Usa PDF, DOCX o TXT.`);
  }

  if (!text.trim()) {
    throw new Error('No se pudo extraer texto del documento. Verifica que no sea un PDF de solo imágenes.');
  }

  // Truncate to 12k chars for context
  const truncated = text.slice(0, 12000);
  logger.info({ filename, textLen: text.length, truncatedLen: truncated.length }, 'Text extracted, sending to AI');

  const rawText = await chatCompletion({
    system: `Eres un experto en análisis de negocios para LATAM.

Tu trabajo: analizar el contenido de un documento (catálogo, brochure, lista de precios, manual de ventas, etc.) y extraer TODA la información del negocio de forma estructurada.

Reglas:
- Extrae TODOS los productos/servicios con precios si están disponibles
- Identifica el tono de comunicación (casual, profesional, mixto)
- Detecta el idioma principal del documento
- Genera FAQs que los clientes harían basándote en la información del documento
- Identifica puntos de venta únicos (USPs)
- Extrae datos de contacto (email, teléfono, dirección, redes sociales)
- Para precios en LATAM, incluye la moneda (MXN, COP, USD, etc.)
- Si ves categorías de productos, úsalas en el campo "category"
- Si el documento es una lista de precios o catálogo, extrae CADA producto individualmente

Responde SOLO con JSON válido. Sin markdown, sin texto extra.`,
    messages: [{
      role: 'user',
      content: `Analiza este documento y extrae toda la información del negocio:

--- DOCUMENTO: ${filename} ---
${truncated}

Responde con este formato JSON exacto:
{
  "business_name": "nombre del negocio o ''",
  "business_description": "descripción completa del negocio (2-3 oraciones)",
  "industry": "industria/sector",
  "target_audience": "público objetivo detallado",
  "tone": "casual | professional | mixed",
  "language": "es-MX | es-CO | es-AR | en-US | pt-BR | etc",
  "contact_email": "email o ''",
  "contact_phone": "teléfono o ''",
  "address": "dirección o ''",
  "social_links": {},
  "products_services": [
    {
      "name": "nombre",
      "description": "descripción detallada para que un vendedor AI pueda hablar de esto",
      "price": "precio con moneda o ''",
      "currency": "MXN | USD | COP | etc",
      "category": "categoría del producto",
      "features": ["feature1", "feature2"],
      "image_url": ""
    }
  ],
  "faqs": [
    {
      "question": "pregunta que haría un cliente",
      "answer": "respuesta basada en la info del documento"
    }
  ],
  "unique_selling_points": ["USP 1", "USP 2"],
  "competitors_mentioned": []
}`
    }],
    maxTokens: 4096,
  });

  logger.info({ rawLen: rawText.length }, 'AI document extraction complete');

  let parsed: ParsedBusinessInfo;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const match = rawText.match(/```(?:json)?\s*([\s\S]*?)```/) || rawText.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(match?.[1] || match?.[0] || '{}');
  }

  // Ensure arrays
  parsed.products_services = parsed.products_services || [];
  parsed.faqs = parsed.faqs || [];
  parsed.unique_selling_points = parsed.unique_selling_points || [];
  parsed.competitors_mentioned = parsed.competitors_mentioned || [];
  parsed.social_links = parsed.social_links || {};

  logger.info({
    filename,
    products: parsed.products_services.length,
    faqs: parsed.faqs.length,
  }, 'Document parse complete');

  return parsed;
}
