import assert from 'node:assert/strict';
import test from 'node:test';

process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
process.env.AI_API_KEY = 'test-ai-key';

interface FilterCall { column: string; value: unknown }

/**
 * lastInboundAt encadena DOS consultas: primero la conversación, luego su
 * último mensaje entrante. El cliente falso devuelve una fila distinta por
 * tabla y registra todos los .eq() de ambas.
 */
function fakeSupabase(porTabla: Record<string, Record<string, unknown> | null>) {
  const filters: FilterCall[] = [];

  function query(row: Record<string, unknown> | null) {
    const q: Record<string, unknown> = {
      eq(column: string, value: unknown) { filters.push({ column, value }); return q; },
      order() { return q; },
      limit() { return q; },
      async maybeSingle() { return { data: row, error: null }; },
      async single() { return { data: row, error: null }; },
      select() { return q; },
    };
    return q;
  }

  return {
    client: {
      from(tabla: string) {
        const row = porTabla[tabla] ?? null;
        return { select: () => query(row) };
      },
    },
    filters,
  };
}

const ORG = 'org-propia';
const TEL = '5215551234567';

test('lastInboundAt acota la conversación a su organización', async () => {
  const { lastInboundAt } = await import('../src/db/queries.js');
  const fake = fakeSupabase({
    conversations: { id: 'conv-1' },
    messages: { created_at: '2026-09-01T10:00:00Z' },
  });

  await lastInboundAt(ORG, TEL, fake.client as never);

  // Sin este filtro, el número de otra organización decidiría la ventana.
  assert.deepEqual(
    fake.filters.find((f) => f.column === 'organization_id'),
    { column: 'organization_id', value: ORG },
  );
});

test('lastInboundAt sólo mira mensajes entrantes', async () => {
  const { lastInboundAt } = await import('../src/db/queries.js');
  const fake = fakeSupabase({
    conversations: { id: 'conv-1' },
    messages: { created_at: '2026-09-01T10:00:00Z' },
  });

  await lastInboundAt(ORG, TEL, fake.client as never);

  // La ventana la abre el CLIENTE al escribir. Contar nuestras propias
  // respuestas la mantendría abierta para siempre.
  assert.deepEqual(
    fake.filters.find((f) => f.column === 'role'),
    { column: 'role', value: 'user' },
  );
});

test('lastInboundAt devuelve null si el contacto nunca escribió', async () => {
  const { lastInboundAt } = await import('../src/db/queries.js');
  const fake = fakeSupabase({ conversations: { id: 'conv-1' }, messages: null });

  assert.equal(await lastInboundAt(ORG, TEL, fake.client as never), null);
});

test('lastInboundAt devuelve null si no hay conversación', async () => {
  const { lastInboundAt } = await import('../src/db/queries.js');
  const fake = fakeSupabase({ conversations: null, messages: null });

  // Un contacto importado por CSV que nunca escribió: fuera de la ventana,
  // así que necesita plantilla.
  assert.equal(await lastInboundAt(ORG, TEL, fake.client as never), null);
});

test('lastInboundAt convierte la fecha de Postgres a Date', async () => {
  const { lastInboundAt } = await import('../src/db/queries.js');
  const fake = fakeSupabase({
    conversations: { id: 'conv-1' },
    messages: { created_at: '2026-09-01T10:00:00Z' },
  });

  const cuando = await lastInboundAt(ORG, TEL, fake.client as never);
  assert.ok(cuando instanceof Date);
  assert.equal(cuando.toISOString(), '2026-09-01T10:00:00.000Z');
});
