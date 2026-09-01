/**
 * Consultas del CRM: actividades, tareas, empresas, campos personalizados y
 * vistas guardadas.
 *
 * Regla que aplica a todo este archivo: la API usa SUPABASE_SERVICE_KEY y
 * salta RLS, así que el filtro por organización va SIEMPRE en la consulta.
 * Nunca buscar ni mutar por id solo — fue el defecto que corrigió
 * `fix(security): acota por organización todas las consultas de la API`.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ActivityKind, Company, CustomFieldDef, LeadActivity, SavedView, Task, TaskStatus,
} from '@omona/shared';
import { getSupabase } from './client.js';

const sb = () => getSupabase();

/** Normaliza un nombre de empresa para no duplicarla por acentos o mayúsculas. */
export function companySlug(name: string): string {
  return name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* ── Actividades ──────────────────────────────────────────────────────── */

export async function listActivities(
  orgId: string, leadId: string, client: SupabaseClient = sb(),
): Promise<LeadActivity[]> {
  const { data } = await client
    .from('lead_activities').select('*')
    .eq('organization_id', orgId).eq('lead_id', leadId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function addActivity(
  orgId: string,
  input: { leadId: string; kind: ActivityKind; body?: string | null;
           meta?: Record<string, unknown>; authorId?: string | null },
  client: SupabaseClient = sb(),
): Promise<LeadActivity | null> {
  const { data, error } = await client
    .from('lead_activities')
    .insert({
      organization_id: orgId,
      lead_id: input.leadId,
      kind: input.kind,
      body: input.body ?? null,
      meta: input.meta ?? {},
      author_id: input.authorId ?? null,
    })
    .select().single();
  if (error) throw error;
  return data;
}

/* ── Tareas ───────────────────────────────────────────────────────────── */

export async function listTasks(
  orgId: string,
  filters: { status?: TaskStatus; assigneeId?: string; leadId?: string } = {},
  client: SupabaseClient = sb(),
): Promise<Task[]> {
  let q = client.from('tasks').select('*').eq('organization_id', orgId);
  if (filters.status) q = q.eq('status', filters.status);
  if (filters.assigneeId) q = q.eq('assignee_id', filters.assigneeId);
  if (filters.leadId) q = q.eq('lead_id', filters.leadId);
  const { data } = await q.order('due_at', { ascending: true, nullsFirst: false });
  return data || [];
}

export async function createTask(
  orgId: string,
  input: { title: string; detail?: string | null; dueAt?: string | null;
           leadId?: string | null; assigneeId?: string | null; byAgent?: boolean },
  client: SupabaseClient = sb(),
): Promise<Task | null> {
  const { data, error } = await client
    .from('tasks')
    .insert({
      organization_id: orgId,
      title: input.title,
      detail: input.detail ?? null,
      due_at: input.dueAt ?? null,
      lead_id: input.leadId ?? null,
      assignee_id: input.assigneeId ?? null,
      created_by_agent: input.byAgent ?? false,
    })
    .select().single();
  if (error) throw error;
  return data;
}

export async function updateTask(
  orgId: string, taskId: string, updates: Partial<Task>, client: SupabaseClient = sb(),
): Promise<void> {
  const patch: Record<string, unknown> = { ...updates, updated_at: new Date().toISOString() };
  if (updates.status === 'done' && !updates.completed_at) {
    patch.completed_at = new Date().toISOString();
  }
  const { error } = await client
    .from('tasks').update(patch)
    .eq('id', taskId).eq('organization_id', orgId);
  if (error) throw error;
}

/* ── Empresas ─────────────────────────────────────────────────────────── */

export async function listCompanies(
  orgId: string, client: SupabaseClient = sb(),
): Promise<Company[]> {
  const { data } = await client
    .from('companies').select('*')
    .eq('organization_id', orgId).order('name');
  return data || [];
}

/** Devuelve la empresa existente o la crea. Usa el slug para no duplicar. */
export async function getOrCreateCompany(
  orgId: string, name: string, client: SupabaseClient = sb(),
): Promise<Company | null> {
  const slug = companySlug(name);
  if (!slug) return null;

  const { data: found } = await client
    .from('companies').select('*')
    .eq('organization_id', orgId).eq('slug', slug).single();
  if (found) return found;

  const { data, error } = await client
    .from('companies')
    .insert({ organization_id: orgId, name: name.trim(), slug })
    .select().single();
  // Carrera entre dos inserciones del mismo slug: gana la primera.
  if (error) {
    const { data: retry } = await client
      .from('companies').select('*')
      .eq('organization_id', orgId).eq('slug', slug).single();
    return retry || null;
  }
  return data;
}

/* ── Campos personalizados ────────────────────────────────────────────── */

export async function listCustomFields(
  orgId: string, client: SupabaseClient = sb(),
): Promise<CustomFieldDef[]> {
  const { data } = await client
    .from('custom_field_defs').select('*')
    .eq('organization_id', orgId).order('position');
  return data || [];
}

export async function createCustomField(
  orgId: string,
  input: { key: string; label: string; type: CustomFieldDef['type'];
           options?: string[]; position?: number },
  client: SupabaseClient = sb(),
): Promise<CustomFieldDef | null> {
  const { data, error } = await client
    .from('custom_field_defs')
    .insert({
      organization_id: orgId,
      key: input.key, label: input.label, type: input.type,
      options: input.options ?? [], position: input.position ?? 0,
    })
    .select().single();
  if (error) throw error;
  return data;
}

export async function deleteCustomField(
  orgId: string, fieldId: string, client: SupabaseClient = sb(),
): Promise<void> {
  const { error } = await client
    .from('custom_field_defs').delete()
    .eq('id', fieldId).eq('organization_id', orgId);
  if (error) throw error;
}

/* ── Vistas guardadas ─────────────────────────────────────────────────── */

export async function listSavedViews(
  orgId: string, ownerId: string, entity = 'leads', client: SupabaseClient = sb(),
): Promise<SavedView[]> {
  const { data } = await client
    .from('saved_views').select('*')
    .eq('organization_id', orgId).eq('entity', entity)
    .or(`is_shared.eq.true,owner_id.eq.${ownerId}`)
    .order('created_at');
  return data || [];
}

export async function createSavedView(
  orgId: string,
  input: { name: string; entity?: SavedView['entity']; filters: Record<string, unknown>;
           sort?: Record<string, unknown>; isShared?: boolean; ownerId: string },
  client: SupabaseClient = sb(),
): Promise<SavedView | null> {
  const { data, error } = await client
    .from('saved_views')
    .insert({
      organization_id: orgId,
      name: input.name,
      entity: input.entity ?? 'leads',
      filters: input.filters,
      sort: input.sort ?? {},
      is_shared: input.isShared ?? false,
      owner_id: input.ownerId,
    })
    .select().single();
  if (error) throw error;
  return data;
}

export async function deleteSavedView(
  orgId: string, viewId: string, client: SupabaseClient = sb(),
): Promise<void> {
  const { error } = await client
    .from('saved_views').delete()
    .eq('id', viewId).eq('organization_id', orgId);
  if (error) throw error;
}
