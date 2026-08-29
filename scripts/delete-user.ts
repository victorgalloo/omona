import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const EMAIL = process.argv[2];

if (!EMAIL) {
  console.error('Usage: SUPABASE_URL=... SUPABASE_SERVICE_KEY=... npx tsx scripts/delete-user.ts <email>');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`Deleting all data for user: ${EMAIL}`);

  // 1. Find auth user by email
  const { data: { users }, error: listErr } = await sb.auth.admin.listUsers();
  if (listErr) throw listErr;
  const authUser = users.find((u) => u.email === EMAIL);
  if (!authUser) {
    console.log('Auth user not found, checking profiles table directly...');
  } else {
    console.log(`Found auth user: ${authUser.id}`);
  }

  // 2. Find profile and org
  const userId = authUser?.id;
  let orgId: string | null = null;

  if (userId) {
    const { data: profile } = await sb.from('profiles').select('*').eq('id', userId).single();
    if (profile) {
      orgId = profile.organization_id;
      console.log(`Found profile: org=${orgId}, role=${profile.role}`);
    }
  }

  if (!orgId) {
    const { data: profiles } = await sb.from('profiles').select('*').eq('email', EMAIL);
    if (profiles?.length) {
      orgId = profiles[0]!.organization_id;
      console.log(`Found profile by email: org=${orgId}`);
    }
  }

  if (!orgId) {
    console.log('No organization found for this user. Nothing to delete.');
    if (authUser) {
      console.log('Deleting orphaned auth user...');
      await sb.auth.admin.deleteUser(authUser.id);
      console.log('Auth user deleted.');
    }
    return;
  }

  // 3. Get all conversations for the org
  const { data: convs } = await sb.from('conversations').select('id').eq('organization_id', orgId);
  const convIds = convs?.map((c) => c.id) || [];
  console.log(`Found ${convIds.length} conversations`);

  // 4. Delete in order (respecting FK constraints)
  if (convIds.length > 0) {
    const { count: msgCount } = await sb.from('messages').delete({ count: 'exact' }).in('conversation_id', convIds);
    console.log(`Deleted ${msgCount ?? 0} messages`);

    const { count: apptCount } = await sb.from('appointments').delete({ count: 'exact' }).eq('organization_id', orgId);
    console.log(`Deleted ${apptCount ?? 0} appointments`);

    const { count: handoffCount } = await sb.from('handoffs').delete({ count: 'exact' }).eq('organization_id', orgId);
    console.log(`Deleted ${handoffCount ?? 0} handoffs`);

    // Break circular FK: conversations.lead_id -> leads.id and leads.conversation_id -> conversations.id
    for (const id of convIds) {
      await sb.from('conversations').update({ lead_id: null }).eq('id', id);
    }

    const { count: leadCount } = await sb.from('leads').delete({ count: 'exact' }).eq('organization_id', orgId);
    console.log(`Deleted ${leadCount ?? 0} leads`);

    const { count: convCount } = await sb.from('conversations').delete({ count: 'exact' }).eq('organization_id', orgId);
    console.log(`Deleted ${convCount ?? 0} conversations`);
  }

  // 5. Delete org-level data
  const orgTables = [
    'availability_rules', 'broadcast_messages', 'knowledge_documents',
    'webhook_subscriptions', 'team_invitations', 'team_invites',
    'whatsapp_sessions', 'agent_configs',
  ];
  for (const table of orgTables) {
    const { count, error } = await sb.from(table).delete({ count: 'exact' }).eq('organization_id', orgId);
    if (error && !error.message.includes('does not exist')) {
      console.log(`${table}: error - ${error.message}`);
    } else {
      console.log(`Deleted ${count ?? 0} ${table}`);
    }
  }

  // 6. Delete all profiles in the org
  const { count: profCount } = await sb.from('profiles').delete({ count: 'exact' }).eq('organization_id', orgId);
  console.log(`Deleted ${profCount ?? 0} profiles`);

  // 7. Delete the organization
  const { error: orgErr } = await sb.from('organizations').delete().eq('id', orgId);
  if (orgErr) {
    console.error('Failed to delete organization:', orgErr.message);
  } else {
    console.log('Deleted organization');
  }

  // 8. Delete auth user
  if (authUser) {
    const { error: authErr } = await sb.auth.admin.deleteUser(authUser.id);
    if (authErr) {
      console.error('Failed to delete auth user:', authErr.message);
    } else {
      console.log('Deleted auth user');
    }
  }

  console.log('\nDone! All data for', EMAIL, 'has been deleted.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
