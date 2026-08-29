import { chatCompletion, AI_MODEL } from '../ai/client.js';
import { logger } from '../logger.js';

// ── Types ──────────────────────────────────────────────────────────────

export interface ParsedProduct {
  name: string;
  description: string;
  price: string;
  currency: string;
  category: string;
  features: string[];
  image_url: string;
}

export interface ParsedBusinessInfo {
  business_name: string;
  business_description: string;
  industry: string;
  target_audience: string;
  tone: string;
  language: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_links: Record<string, string>;
  products_services: ParsedProduct[];
  faqs: { question: string; answer: string }[];
  unique_selling_points: string[];
  competitors_mentioned: string[];
}

// ── HTML Cleaning ──────────────────────────────────────────────────────

function cleanHTML(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, (m) => extractLinks(m) + ' ')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, (m) => extractLinks(m) + ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#\d+;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractLinks(html: string): string {
  const links: string[] = [];
  const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = (match[2] ?? '').replace(/<[^>]+>/g, '').trim();
    if (text) links.push(text);
  }
  return links.join(' | ');
}

// ── Link Discovery ─────────────────────────────────────────────────────

function discoverInternalLinks(html: string, baseUrl: string): string[] {
  const base = new URL(baseUrl);
  const links = new Set<string>();
  const regex = /<a[^>]+href=["']([^"'#]+)["']/gi;
  let match;

  const priorityPatterns = [
    /product/i, /servicio/i, /service/i, /precio/i, /price/i,
    /catalog/i, /catalogo/i, /menu/i, /tienda/i, /shop/i, /store/i,
    /nosotros/i, /about/i, /faq/i, /pregunta/i, /contacto/i, /contact/i,
    /plan/i, /pricing/i, /oferta/i, /offer/i, /paquete/i, /package/i,
  ];

  while ((match = regex.exec(html)) !== null) {
    try {
      const url = new URL(match[1] ?? '', baseUrl);
      if (url.hostname !== base.hostname) continue;
      if (/\.(jpg|jpeg|png|gif|svg|css|js|pdf|zip|mp4|mp3|ico|woff|ttf)$/i.test(url.pathname)) continue;
      
      const path = url.pathname + url.search;
      if (priorityPatterns.some(p => p.test(path))) {
        links.add(url.href);
      }
    } catch {}
  }

  return [...links].slice(0, 8); // Max 8 subpages
}

// ── Structured Data Extraction ──────────────────────────────────────────

function extractStructuredData(html: string): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];
  
  // JSON-LD
  const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse((match[1] ?? '').trim());
      results.push(Array.isArray(data) ? { items: data } : data);
    } catch {}
  }
  
  // Open Graph meta
  const og: Record<string, string> = {};
  const metaRegex = /<meta[^>]+(?:property|name)=["'](og:[^"']+)["'][^>]+content=["']([^"']+)["']/gi;
  while ((match = metaRegex.exec(html)) !== null) {
    if (match[1] != null) og[match[1]] = match[2] ?? '';
  }
  if (Object.keys(og).length > 0) results.push({ _type: 'OpenGraph', ...og });

  return results;
}

// ── Price Extraction ────────────────────────────────────────────────────

function extractPrices(text: string): string[] {
  const patterns = [
    /\$[\d,]+(?:\.\d{2})?(?:\s*(?:MXN|USD|COP|ARS|CLP|PEN))?/gi,
    /(?:MXN|USD|COP|ARS|CLP|PEN)\s*\$?[\d,]+(?:\.\d{2})?/gi,
    /[\d,]+(?:\.\d{2})?\s*(?:pesos|dólares|dolares)/gi,
  ];
  
  const prices = new Set<string>();
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      prices.add(match[0].trim());
    }
  }
  return [...prices];
}

// ── Fetch with retry ────────────────────────────────────────────────────

async function fetchPage(url: string): Promise<string> {
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
  };

  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(12000),
    redirect: 'follow',
  });
  
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

// ── Main Parser ─────────────────────────────────────────────────────────

export async function parseWebsite(url: string): Promise<ParsedBusinessInfo> {
  logger.info({ url }, 'Starting website parse');

  // 1. Fetch main page
  const mainHtml = await fetchPage(url);
  const mainText = cleanHTML(mainHtml);
  const structuredData = extractStructuredData(mainHtml);
  const prices = extractPrices(mainText);

  // 2. Discover and fetch subpages
  const subLinks = discoverInternalLinks(mainHtml, url);
  logger.info({ url, subpages: subLinks.length }, 'Found subpages');

  const subPages: { url: string; text: string }[] = [];
  const fetchPromises = subLinks.map(async (link) => {
    try {
      const html = await fetchPage(link);
      const text = cleanHTML(html);
      const pagePrices = extractPrices(text);
      prices.push(...pagePrices);
      subPages.push({ url: link, text: text.slice(0, 3000) });
    } catch (err: any) {
      logger.debug({ url: link, error: err.message }, 'Subpage fetch failed');
    }
  });

  await Promise.allSettled(fetchPromises);

  // 3. Build context for Claude
  const subPagesContext = subPages
    .map((p) => `\n--- PAGE: ${p.url} ---\n${p.text}`)
    .join('\n');

  const structuredContext = structuredData.length > 0
    ? `\n--- STRUCTURED DATA (JSON-LD / OpenGraph) ---\n${JSON.stringify(structuredData, null, 2).slice(0, 3000)}`
    : '';

  const pricesContext = prices.length > 0
    ? `\n--- PRECIOS ENCONTRADOS ---\n${[...new Set(prices)].join(', ')}`
    : '';

  const fullContext = [
    `--- PÁGINA PRINCIPAL: ${url} ---`,
    mainText.slice(0, 6000),
    structuredContext,
    pricesContext,
    subPagesContext,
  ].join('\n').slice(0, 10000); // Max 10k chars for Claude

  // 4. AI extraction
  logger.info({ contextLen: fullContext.length, model: AI_MODEL }, 'Sending to AI for extraction');
  const rawText = await chatCompletion({
    system: `Eres un experto en análisis de negocios y extracción de datos de sitios web para LATAM.

Tu trabajo: analizar el contenido de un sitio web y extraer TODA la información del negocio de forma estructurada.

Reglas:
- Extrae TODOS los productos/servicios con precios si están disponibles
- Identifica el tono de comunicación (casual, profesional, mixto)
- Detecta el idioma principal del sitio
- Busca FAQs explícitas o preguntas implícitas que los clientes harían
- Identifica puntos de venta únicos (USPs)
- Extrae datos de contacto (email, teléfono, dirección, redes sociales)
- Para precios en LATAM, incluye la moneda (MXN, COP, USD, etc.)
- Si ves categorías de productos, úsalas en el campo "category"
- Genera 3-5 FAQs incluso si no están explícitas — piensa qué preguntaría un cliente

Responde SOLO con JSON válido. Sin markdown, sin texto extra.`,
    messages: [{
      role: 'user',
      content: `Analiza este sitio web completo y extrae toda la información del negocio:

${fullContext}

Responde con este formato JSON exacto:
{
  "business_name": "nombre del negocio",
  "business_description": "descripción completa del negocio (2-3 oraciones)",
  "industry": "industria/sector",
  "target_audience": "público objetivo detallado",
  "tone": "casual | professional | mixed",
  "language": "es-MX | es-CO | es-AR | en-US | pt-BR | etc",
  "contact_email": "email o ''",
  "contact_phone": "teléfono o ''",
  "address": "dirección o ''",
  "social_links": { "instagram": "url", "facebook": "url", "tiktok": "url" },
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
      "answer": "respuesta basada en la info del sitio"
    }
  ],
  "unique_selling_points": ["USP 1", "USP 2"],
  "competitors_mentioned": ["competidor mencionado si aplica"]
}`
    }],
    maxTokens: 4096,
    temperature: 0,
  });

  logger.info({ rawLen: rawText.length }, 'AI extraction complete');
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
    url,
    products: parsed.products_services.length,
    faqs: parsed.faqs.length,
    subpages: subPages.length,
  }, 'Website parse complete');

  return parsed;
}
