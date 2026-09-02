import { Hono } from 'hono';
import { getAuth, requireRole } from './middleware.js';
import { listLeads } from '../db/queries.js';
import { getSupabase } from '../db/client.js';
import { whatsappRouter } from '../whatsapp/router.js';
import { logger } from '../logger.js';

export const broadcastRoutes = new Hono();

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

/** Pausa entre envíos. Mandar de corrido es lo que dispara los bloqueos. */
const PAUSA_MS = 2000;

type Audiencia = 'all' | 'qualified' | 'new';

function normalizaAudiencia(filter: unknown): Audiencia {
  return filter === 'all' || filter === 'qualified' || filter === 'new' ? filter : 'all';
}

/** Los destinatarios de una audiencia, con su lead cuando existe. */
async function resolverDestinatarios(
  orgId: string,
  audiencia: Audiencia,
  explicitos?: string[],
): Promise<{ phone: string; leadId: string | null }[]> {
  if (explicitos?.length) {
    return [...new Set(explicitos)].map((phone) => ({ phone, leadId: null }));
  }

  const leads = await listLeads(orgId, audiencia === 'all' ? undefined : audiencia);

  // Un mismo número puede tener más de un lead: se le escribe una sola vez.
  const vistos = new Set<string>();
  const out: { phone: string; leadId: string | null }[] = [];
  for (const l of leads) {
    if (!l.phone_number || vistos.has(l.phone_number)) continue;
    vistos.add(l.phone_number);
    out.push({ phone: l.phone_number, leadId: l.id });
  }
  return out;
}

/**
 * Cuánta gente recibiría este envío. La interfaz no mostraba el número por
 * ningún lado: se mandaba a ciegas.
 */
broadcastRoutes.post('/preview', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const { filter, phone_numbers } = await c.req.json();

  const destinatarios = await resolverDestinatarios(orgId, normalizaAudiencia(filter), phone_numbers);
  const provider = await whatsappRouter.providerOf(orgId);

  // Con Cloud API, a quien no escribió en 24 h sólo se le puede mandar una
  // plantilla aprobada. Saberlo antes de enviar evita una campaña a medias.
  let fueraDeVentana = 0;
  if (provider === 'cloud_api') {
    for (const d of destinatarios) {
      if (!(await whatsappRouter.withinServiceWindow(orgId, d.phone))) fueraDeVentana++;
    }
  }

  return c.json({
    provider,
    total: destinatarios.length,
    fuera_de_ventana: fueraDeVentana,
    requiere_plantilla: provider === 'cloud_api' && fueraDeVentana > 0,
    duracion_estimada_seg: Math.round((destinatarios.length * PAUSA_MS) / 1000),
  });
});

/** Plantillas aprobadas de la org, para elegir en la interfaz. */
broadcastRoutes.get('/templates', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  try {
    const todas = await whatsappRouter.listTemplates(orgId);
    return c.json({ data: todas.filter((t) => t.status === 'APPROVED') });
  } catch (err) {
    logger.warn({ err, orgId }, 'No pude listar plantillas');
    return c.json({ data: [], error: 'No pudimos leer tus plantillas de Meta' });
  }
});

broadcastRoutes.post('/', requireRole('admin'), async (c) => {
  const { orgId, userId } = getAuth(c);
  const { message, phone_numbers, filter, template } = await c.req.json();

  if (!message) return c.json({ error: 'Mensaje requerido' }, 400);

  const audiencia = normalizaAudiencia(filter);
  const destinatarios = await resolverDestinatarios(orgId, audiencia, phone_numbers);
  if (destinatarios.length === 0) {
    return c.json({ error: 'No hay contactos para enviar' }, 400);
  }

  const provider = await whatsappRouter.providerOf(orgId);
  const sb = getSupabase();

  const { data: campaña, error: errCampaña } = await sb
    .from('broadcast_campaigns')
    .insert({
      organization_id: orgId,
      created_by: userId,
      provider,
      body: message,
      template_name: template?.name ?? null,
      audience: audiencia,
      total: destinatarios.length,
    })
    .select()
    .single();

  if (errCampaña || !campaña) {
    logger.error({ error: errCampaña, orgId }, 'No pude crear la campaña');
    return c.json({ error: 'No pudimos registrar el envío' }, 500);
  }

  await sb.from('broadcast_messages').insert(
    destinatarios.map((d) => ({
      organization_id: orgId,
      campaign_id: campaña.id,
      phone_number: d.phone,
      lead_id: d.leadId,
    })),
  );

  // Se responde de inmediato y el envío sigue por su cuenta. Antes el bucle
  // corría dentro del handler con 2 s por contacto: una lista de 500 tenía la
  // petición abierta 17 minutos y terminaba en timeout, que el dashboard
  // mostraba como un silencioso "0 enviados".
  void enviarCampaña(orgId, campaña.id, destinatarios, message, template);

  return c.json({
    campaign_id: campaña.id,
    total: destinatarios.length,
    status: 'running',
    duracion_estimada_seg: Math.round((destinatarios.length * PAUSA_MS) / 1000),
  });
});

/** Progreso de una campaña. */
broadcastRoutes.get('/:id', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const { data } = await getSupabase()
    .from('broadcast_campaigns')
    .select('*')
    .eq('id', c.req.param('id'))
    .eq('organization_id', orgId)
    .maybeSingle();

  if (!data) return c.json({ error: 'Campaña no encontrada' }, 404);
  return c.json(data);
});

/** Historial de campañas. */
broadcastRoutes.get('/', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const { data } = await getSupabase()
    .from('broadcast_campaigns')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .limit(50);

  return c.json({ data: data ?? [] });
});

/** El envío en sí, fuera del ciclo de la petición. */
async function enviarCampaña(
  orgId: string,
  campaignId: string,
  destinatarios: { phone: string; leadId: string | null }[],
  message: string,
  template?: { name: string; language: string; params?: string[] },
): Promise<void> {
  const sb = getSupabase();
  let sent = 0;
  let failed = 0;

  for (const [i, { phone }] of destinatarios.entries()) {
    try {
      await whatsappRouter.sendMessage(orgId, phone, message, undefined, template);
      sent++;
      await sb
        .from('broadcast_messages')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('campaign_id', campaignId)
        .eq('phone_number', phone);
    } catch (err) {
      failed++;
      // El motivo se guarda tal cual: 'cloud_api_outside_service_window' y un
      // número inválido son problemas distintos y antes se veían igual.
      const motivo = err instanceof Error ? err.message : 'error_desconocido';
      await sb
        .from('broadcast_messages')
        .update({ status: 'failed', error: motivo })
        .eq('campaign_id', campaignId)
        .eq('phone_number', phone);
      logger.warn({ err, phone, campaignId }, 'Broadcast send failed');
    }

    await sb.from('broadcast_campaigns').update({ sent, failed }).eq('id', campaignId);

    if (i < destinatarios.length - 1) await sleep(PAUSA_MS);
  }

  await sb
    .from('broadcast_campaigns')
    .update({ status: 'done', sent, failed, finished_at: new Date().toISOString() })
    .eq('id', campaignId);

  logger.info({ orgId, campaignId, sent, failed, total: destinatarios.length }, 'Broadcast complete');
}
