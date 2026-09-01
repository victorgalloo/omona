import assert from 'node:assert/strict';
import test from 'node:test';

process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
process.env.AI_API_KEY = 'test-ai-key';

interface FilterCall {
  column: string;
  value: unknown;
}

function fakeSupabase(row: Record<string, unknown> | null = null) {
  const filters: FilterCall[] = [];
  const query = {
    eq(column: string, value: unknown) {
      filters.push({ column, value });
      return query;
    },
    async single() {
      return { data: row };
    },
    then(resolve: (value: { data: Record<string, unknown> | null; error: null }) => unknown) {
      return Promise.resolve({ data: row, error: null }).then(resolve);
    },
  };

  return {
    client: {
      from() {
        return {
          select() {
            return query;
          },
          update() {
            return query;
          },
        };
      },
    },
    filters,
  };
}

test('getConversation scopes the lookup to its organization', async () => {
  const { getConversation } = await import('../src/db/queries.js');
  const fake = fakeSupabase({ id: 'conv-b', organization_id: 'org-b', metadata: {} });

  await getConversation('org-a', 'conv-b', fake.client as never);

  assert.deepEqual(fake.filters, [
    { column: 'id', value: 'conv-b' },
    { column: 'organization_id', value: 'org-a' },
  ]);
});

test('getLead scopes the lookup to its organization', async () => {
  const { getLead } = await import('../src/db/queries.js');
  const fake = fakeSupabase({ id: 'lead-b', organization_id: 'org-b' });

  await getLead('org-a', 'lead-b', fake.client as never);

  assert.deepEqual(fake.filters, [
    { column: 'id', value: 'lead-b' },
    { column: 'organization_id', value: 'org-a' },
  ]);
});

test('updateConversation scopes the mutation to its organization', async () => {
  const { updateConversation } = await import('../src/db/queries.js');
  const fake = fakeSupabase();

  await updateConversation('org-a', 'conv-b', { status: 'archived' } as never, fake.client as never);

  assert.deepEqual(fake.filters, [
    { column: 'id', value: 'conv-b' },
    { column: 'organization_id', value: 'org-a' },
  ]);
});

test('updateLead scopes the mutation to its organization', async () => {
  const { updateLead } = await import('../src/db/queries.js');
  const fake = fakeSupabase();

  await updateLead('org-a', 'lead-b', { status: 'lost' } as never, fake.client as never);

  assert.deepEqual(fake.filters, [
    { column: 'id', value: 'lead-b' },
    { column: 'organization_id', value: 'org-a' },
  ]);
});

test('updateHandoff scopes the mutation to its organization', async () => {
  const { updateHandoff } = await import('../src/db/queries.js');
  const fake = fakeSupabase();

  await updateHandoff('org-a', 'handoff-b', { status: 'resolved' }, fake.client as never);

  assert.deepEqual(fake.filters, [
    { column: 'id', value: 'handoff-b' },
    { column: 'organization_id', value: 'org-a' },
  ]);
});

test('getOrCreateConversation scopes a contact-name update to its organization', async () => {
  const { getOrCreateConversation } = await import('../src/db/queries.js');

  assert.equal(getOrCreateConversation.length, 4);

  const fake = fakeSupabase({ id: 'conversation-1', contact_name: null });
  await getOrCreateConversation('org-a', '5550000000', 'Ada', fake.client as never);

  assert.deepEqual(fake.filters, [
    { column: 'organization_id', value: 'org-a' },
    { column: 'phone_number', value: '5550000000' },
    { column: 'id', value: 'conversation-1' },
    { column: 'organization_id', value: 'org-a' },
  ]);
});

test('getOrCreateLead scopes its conversation link update to its organization', async () => {
  const { getOrCreateLead } = await import('../src/db/queries.js');

  assert.equal(getOrCreateLead.length, 4);

  const filters: FilterCall[] = [];
  const leadQuery = {
    eq(column: string, value: unknown) {
      filters.push({ column, value });
      return leadQuery;
    },
    async single() {
      return { data: null };
    },
  };
  const conversationQuery = {
    eq(column: string, value: unknown) {
      filters.push({ column, value });
      return conversationQuery;
    },
    then(resolve: (value: { data: null; error: null }) => unknown) {
      return Promise.resolve({ data: null, error: null }).then(resolve);
    },
  };
  const client = {
    from(table: string) {
      if (table === 'leads') {
        return {
          select() {
            return leadQuery;
          },
          insert() {
            return {
              select() {
                return {
                  async single() {
                    return { data: { id: 'lead-1' }, error: null };
                  },
                };
              },
            };
          },
        };
      }
      if (table === 'conversations') {
        return {
          update() {
            return conversationQuery;
          },
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    },
  };

  await getOrCreateLead('org-a', 'conversation-1', '5550000000', client as never);

  assert.deepEqual(filters, [
    { column: 'organization_id', value: 'org-a' },
    { column: 'conversation_id', value: 'conversation-1' },
    { column: 'id', value: 'conversation-1' },
    { column: 'organization_id', value: 'org-a' },
  ]);
});
