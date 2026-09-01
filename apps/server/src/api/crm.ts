import { Hono } from 'hono';
import {
  addActivity, createCustomField, createSavedView, createTask, deleteCustomField,
  deleteSavedView, listActivities, listCompanies, listCustomFields, listSavedViews,
  listTasks, updateTask,
} from '../db/crm-queries.js';
import { getAuth } from './middleware.js';
import { logger } from '../logger.js';

export const crmRoutes = new Hono();

/* ── Actividades de un lead ───────────────────────────────────────────── */

crmRoutes.get('/leads/:id/activities', async (c) => {
  const { orgId } = getAuth(c);
  return c.json({ data: await listActivities(orgId, c.req.param('id')) });
});

crmRoutes.post('/leads/:id/activities', async (c) => {
  const { orgId, userId } = getAuth(c);
  const { kind, body } = await c.req.json();
  if (!body?.trim()) return c.json({ error: 'El contenido es requerido' }, 400);

  const activity = await addActivity(orgId, {
    leadId: c.req.param('id'),
    kind: kind || 'note',
    body,
    authorId: userId,
  });
  return c.json({ data: activity }, 201);
});

/* ── Tareas ───────────────────────────────────────────────────────────── */

crmRoutes.get('/tasks', async (c) => {
  const { orgId, userId } = getAuth(c);
  const status = c.req.query('status') as 'open' | 'done' | 'cancelled' | undefined;
  // ?mine=1 filtra a las del usuario que consulta
  const assigneeId = c.req.query('mine') === '1' ? userId : c.req.query('assignee') || undefined;
  return c.json({
    data: await listTasks(orgId, {
      status,
      assigneeId,
      leadId: c.req.query('lead') || undefined,
    }),
  });
});

crmRoutes.post('/tasks', async (c) => {
  const { orgId, userId } = getAuth(c);
  const { title, detail, dueAt, leadId, assigneeId } = await c.req.json();
  if (!title?.trim()) return c.json({ error: 'El título es requerido' }, 400);

  const task = await createTask(orgId, {
    title,
    detail,
    dueAt,
    leadId,
    // sin responsable explícito, queda a cargo de quien la crea
    assigneeId: assigneeId ?? userId,
  });
  return c.json({ data: task }, 201);
});

crmRoutes.patch('/tasks/:id', async (c) => {
  const { orgId, userId } = getAuth(c);
  const updates = await c.req.json();
  await updateTask(orgId, c.req.param('id'), updates);

  // Completar una tarea ligada a un lead queda en su bitácora.
  if (updates.status === 'done' && updates.lead_id) {
    await addActivity(orgId, {
      leadId: updates.lead_id,
      kind: 'task_done',
      body: updates.title || 'Tarea completada',
      authorId: userId,
    }).catch((e) => logger.warn({ e }, 'No se pudo registrar la actividad de tarea'));
  }
  return c.json({ ok: true });
});

/* ── Empresas ─────────────────────────────────────────────────────────── */

crmRoutes.get('/companies', async (c) => {
  const { orgId } = getAuth(c);
  return c.json({ data: await listCompanies(orgId) });
});

/* ── Campos personalizados ────────────────────────────────────────────── */

crmRoutes.get('/custom-fields', async (c) => {
  const { orgId } = getAuth(c);
  return c.json({ data: await listCustomFields(orgId) });
});

crmRoutes.post('/custom-fields', async (c) => {
  const { orgId } = getAuth(c);
  const { key, label, type, options, position } = await c.req.json();
  if (!key?.trim() || !label?.trim()) {
    return c.json({ error: 'Clave y etiqueta son requeridas' }, 400);
  }
  // La clave viaja dentro de un JSONB: se restringe para que sea estable.
  const safeKey = key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const field = await createCustomField(orgId, { key: safeKey, label, type, options, position });
  return c.json({ data: field }, 201);
});

crmRoutes.delete('/custom-fields/:id', async (c) => {
  const { orgId } = getAuth(c);
  await deleteCustomField(orgId, c.req.param('id'));
  return c.json({ ok: true });
});

/* ── Vistas guardadas ─────────────────────────────────────────────────── */

crmRoutes.get('/views', async (c) => {
  const { orgId, userId } = getAuth(c);
  return c.json({ data: await listSavedViews(orgId, userId, c.req.query('entity') || 'leads') });
});

crmRoutes.post('/views', async (c) => {
  const { orgId, userId } = getAuth(c);
  const { name, entity, filters, sort, isShared } = await c.req.json();
  if (!name?.trim()) return c.json({ error: 'El nombre es requerido' }, 400);

  const view = await createSavedView(orgId, {
    name, entity, filters: filters ?? {}, sort, isShared, ownerId: userId,
  });
  return c.json({ data: view }, 201);
});

crmRoutes.delete('/views/:id', async (c) => {
  const { orgId } = getAuth(c);
  await deleteSavedView(orgId, c.req.param('id'));
  return c.json({ ok: true });
});

/* ── Importar contactos desde CSV ─────────────────────────────────────── */

/** Parser mínimo de CSV: respeta comillas y comas dentro de ellas. */
function parseCsv(text: string): string[][] {
  const filas: string[][] = [];
  let campo = '';
  let fila: string[] = [];
  let enComillas = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (enComillas) {
      if (ch === '"') {
        if (text[i + 1] === '"') { campo += '"'; i++; }   // comilla escapada
        else enComillas = false;
      } else campo += ch;
      continue;
    }
    if (ch === '"') { enComillas = true; continue; }
    if (ch === ',') { fila.push(campo); campo = ''; continue; }
    if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      fila.push(campo); campo = '';
      if (fila.some((c) => c.trim())) filas.push(fila);
      fila = [];
      continue;
    }
    campo += ch;
  }
  fila.push(campo);
  if (fila.some((c) => c.trim())) filas.push(fila);
  return filas;
}

/**
 * POST /api/crm/import/preview
 * Devuelve encabezados y primeras filas para que el usuario mapee columnas
 * antes de confirmar. No escribe nada.
 */
crmRoutes.post('/import/preview', async (c) => {
  getAuth(c);
  const { csv } = await c.req.json();
  if (!csv?.trim()) return c.json({ error: 'Archivo vacío' }, 400);

  const filas = parseCsv(csv);
  if (filas.length < 2) return c.json({ error: 'El archivo no tiene filas de datos' }, 400);

  return c.json({
    headers: (filas[0] ?? []).map((h) => h.trim()),
    sample: filas.slice(1, 6),
    totalRows: filas.length - 1,
  });
});

/**
 * POST /api/crm/import
 * `mapping` asocia cada campo de lead con el índice de su columna.
 * Las empresas se normalizan para no duplicarlas.
 */
crmRoutes.post('/import', async (c) => {
  const { orgId } = getAuth(c);
  const { csv, mapping } = await c.req.json();
  if (!csv?.trim() || !mapping) return c.json({ error: 'Faltan datos' }, 400);

  const filas = parseCsv(csv).slice(1);
  const { getSupabase } = await import('../db/client.js');
  const { getOrCreateCompany } = await import('../db/crm-queries.js');
  const db = getSupabase();

  let creados = 0;
  const errores: string[] = [];

  for (const [i, fila] of filas.entries()) {
    const val = (campo: string): string | null => {
      const idx = mapping[campo];
      if (idx === undefined || idx === null) return null;
      const v = fila[idx]?.trim();
      return v || null;
    };

    const phone = val('phone_number');
    if (!phone) { errores.push(`Fila ${i + 2}: sin teléfono`); continue; }

    let companyId: string | null = null;
    const companyName = val('company');
    if (companyName) {
      const company = await getOrCreateCompany(orgId, companyName);
      companyId = company?.id ?? null;
    }

    const { error } = await db.from('leads').insert({
      organization_id: orgId,
      phone_number: phone,
      name: val('name'),
      email: val('email'),
      company: companyName,
      company_id: companyId,
      status: 'new',
    });

    if (error) errores.push(`Fila ${i + 2}: ${error.message}`);
    else creados++;
  }

  logger.info({ orgId, creados, fallidos: errores.length }, 'Importación de contactos');
  return c.json({ creados, errores: errores.slice(0, 20), totalErrores: errores.length });
});
