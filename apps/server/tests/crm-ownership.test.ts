import assert from 'node:assert/strict';
import test from 'node:test';

process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
process.env.AI_API_KEY = 'test-ai-key';

interface FilterCall { column: string; value: unknown }

/**
 * Cliente falso que registra cada .eq() encadenado. Sirve para comprobar que
 * ninguna consulta del CRM busca ni muta por id solo: todas deben filtrar
 * también por organization_id.
 */
function fakeSupabase(row: Record<string, unknown> | null = null) {
  const filters: FilterCall[] = [];
  const query: Record<string, unknown> = {
    eq(column: string, value: unknown) { filters.push({ column, value }); return query; },
    or() { return query; },
    order() { return Promise.resolve({ data: row ? [row] : [], error: null }); },
    async single() { return { data: row, error: null }; },
    select() { return query; },
    then(resolve: (v: { data: unknown; error: null }) => unknown) {
      return Promise.resolve({ data: row, error: null }).then(resolve);
    },
  };
  return {
    client: {
      from() {
        return {
          select: () => query,
          update: () => query,
          delete: () => query,
          insert: () => ({ select: () => ({ async single() { return { data: row, error: null }; } }) }),
        };
      },
    },
    filters,
  };
}

const ORG = 'org-propia';
const OTRA = 'id-de-otra-org';

test('listActivities filtra por organización', async () => {
  const { listActivities } = await import('../src/db/crm-queries.js');
  const { client, filters } = fakeSupabase();
  await listActivities(ORG, OTRA, client as never);
  assert.deepEqual(
    filters.find((f) => f.column === 'organization_id'),
    { column: 'organization_id', value: ORG },
  );
});

test('listTasks filtra por organización', async () => {
  const { listTasks } = await import('../src/db/crm-queries.js');
  const { client, filters } = fakeSupabase();
  await listTasks(ORG, {}, client as never);
  assert.ok(filters.some((f) => f.column === 'organization_id' && f.value === ORG));
});

test('updateTask acota la mutación a su organización', async () => {
  const { updateTask } = await import('../src/db/crm-queries.js');
  const { client, filters } = fakeSupabase();
  await updateTask(ORG, OTRA, { status: 'done' }, client as never);
  assert.ok(filters.some((f) => f.column === 'id' && f.value === OTRA));
  assert.ok(filters.some((f) => f.column === 'organization_id' && f.value === ORG));
});

test('getOrCreateCompany busca dentro de su organización', async () => {
  const { getOrCreateCompany } = await import('../src/db/crm-queries.js');
  const { client, filters } = fakeSupabase({ id: 'c1', slug: 'ferreteria-del-norte' });
  await getOrCreateCompany(ORG, 'Ferretería del Norte', client as never);
  assert.ok(filters.some((f) => f.column === 'organization_id' && f.value === ORG));
});

test('deleteCustomField acota el borrado a su organización', async () => {
  const { deleteCustomField } = await import('../src/db/crm-queries.js');
  const { client, filters } = fakeSupabase();
  await deleteCustomField(ORG, OTRA, client as never);
  assert.ok(filters.some((f) => f.column === 'id' && f.value === OTRA));
  assert.ok(filters.some((f) => f.column === 'organization_id' && f.value === ORG));
});

test('deleteSavedView acota el borrado a su organización', async () => {
  const { deleteSavedView } = await import('../src/db/crm-queries.js');
  const { client, filters } = fakeSupabase();
  await deleteSavedView(ORG, OTRA, client as never);
  assert.ok(filters.some((f) => f.column === 'organization_id' && f.value === ORG));
});

test('companySlug normaliza acentos y mayúsculas para no duplicar empresas', async () => {
  const { companySlug } = await import('../src/db/crm-queries.js');
  assert.equal(companySlug('Ferretería del Norte'), companySlug('ferreteria del norte'));
  assert.equal(companySlug('  Grupo  ACME, S.A.  '), 'grupo-acme-s-a');
});
