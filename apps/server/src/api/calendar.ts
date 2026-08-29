import { Hono } from 'hono';
import { getAuth, requireRole } from './middleware.js';
import { getSupabase } from '../db/client.js';
import { config } from '../config.js';
import { logger } from '../logger.js';
import { getAgentConfig } from '../db/queries.js';
import { whatsappRouter } from '../whatsapp/router.js';

const sb = () => getSupabase();

export const calendarRoutes = new Hono();

// ── Confirmation Email ────────────────────────────────────────────────

export async function sendAppointmentEmail(appointment: {
  customer_name: string | null;
  customer_phone: string;
  customer_email: string | null;
  scheduled_at: string;
  duration_min: number;
  notes: string | null;
}, businessName: string) {
  if (!config.RESEND_API_KEY || !appointment.customer_email) return;

  const date = new Date(appointment.scheduled_at);
  const timeStr = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Mexico_City' });
  const dateStr = date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' });
  const displayName = appointment.customer_name || 'Cliente';

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${businessName} <omona@anthana.agency>`,
        to: [appointment.customer_email],
        subject: `Cita confirmada - ${dateStr}`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 20px;background:#0C0C0C;color:#FAFAFA">
            <div style="text-align:center;margin-bottom:24px">
              <div style="display:inline-flex;align-items:center;gap:6px;margin-bottom:8px">
                <div style="width:10px;height:10px;border-radius:50%;background:#FF5F56;display:inline-block"></div>
                <div style="width:10px;height:10px;border-radius:50%;background:#FFBD2E;display:inline-block"></div>
                <div style="width:10px;height:10px;border-radius:50%;background:#27C93F;display:inline-block"></div>
              </div>
              <div style="font-family:monospace;font-size:20px;font-weight:600;color:#FAFAFA">${businessName}</div>
            </div>
            <div style="background:#161616;border:1px solid #2A2A2A;border-radius:12px;padding:32px">
              <h2 style="margin:0 0 8px;font-size:18px;color:#FAFAFA">Cita confirmada</h2>
              <p style="margin:0 0 20px;color:#8A8A8A;font-size:14px;line-height:1.6">
                Hola ${displayName}, tu cita ha sido agendada exitosamente.
              </p>
              <div style="background:#0C0C0C;border:1px solid #2A2A2A;border-radius:8px;padding:16px;margin-bottom:20px">
                <div style="margin-bottom:12px">
                  <span style="color:#8A8A8A;font-size:12px;text-transform:uppercase;letter-spacing:1px">Fecha</span>
                  <div style="color:#FAFAFA;font-size:15px;font-weight:600;margin-top:2px">${dateStr}</div>
                </div>
                <div style="margin-bottom:12px">
                  <span style="color:#8A8A8A;font-size:12px;text-transform:uppercase;letter-spacing:1px">Hora</span>
                  <div style="color:#FAFAFA;font-size:15px;font-weight:600;margin-top:2px">${timeStr}</div>
                </div>
                <div>
                  <span style="color:#8A8A8A;font-size:12px;text-transform:uppercase;letter-spacing:1px">Duracion</span>
                  <div style="color:#FAFAFA;font-size:15px;font-weight:600;margin-top:2px">${appointment.duration_min} minutos</div>
                </div>
              </div>
              ${appointment.notes ? `<p style="margin:0 0 16px;color:#8A8A8A;font-size:13px"><strong style="color:#FAFAFA">Notas:</strong> ${appointment.notes}</p>` : ''}
              <p style="margin:0;color:#8A8A8A;font-size:12px;text-align:center">
                Si necesitas reagendar o cancelar, responde por WhatsApp.
              </p>
            </div>
            <p style="text-align:center;color:#8A8A8A;font-size:11px;margin-top:24px">
              Enviado por ${businessName} via Omona
            </p>
          </div>
        `,
      }),
    });
    logger.info({ email: appointment.customer_email, scheduled_at: appointment.scheduled_at }, 'Appointment confirmation email sent');
  } catch (err) {
    logger.warn({ err, email: appointment.customer_email }, 'Failed to send appointment confirmation email');
  }
}

// ── Availability Rules ─────────────────────────────────────────────────

calendarRoutes.get('/availability', async (c) => {
  const { orgId } = getAuth(c);
  const { data } = await sb().from('availability_rules')
    .select('*').eq('organization_id', orgId).order('day_of_week');
  return c.json({ data: data ?? [] });
});

calendarRoutes.put('/availability', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const { rules } = await c.req.json();
  if (!Array.isArray(rules)) return c.json({ error: 'rules debe ser un array' }, 400);

  // Upsert all rules
  for (const rule of rules) {
    if (rule.day_of_week == null || !rule.start_time || !rule.end_time) continue;
    await sb().from('availability_rules').upsert({
      organization_id: orgId,
      day_of_week: rule.day_of_week,
      start_time: rule.start_time,
      end_time: rule.end_time,
      slot_duration_min: rule.slot_duration_min || 30,
      is_active: rule.is_active ?? true,
    }, { onConflict: 'organization_id,day_of_week' });
  }

  const { data } = await sb().from('availability_rules')
    .select('*').eq('organization_id', orgId).order('day_of_week');
  return c.json({ data: data ?? [] });
});

// ── Available Slots (public-ish — used by AI) ──────────────────────────

calendarRoutes.get('/slots', async (c) => {
  const { orgId } = getAuth(c);
  const days = parseInt(c.req.query('days') || '7');
  const tz = c.req.query('tz') || 'America/Mexico_City';
  const slots = await getAvailableSlots(orgId, days, tz);
  return c.json({ slots });
});

// ── Appointments CRUD ──────────────────────────────────────────────────

calendarRoutes.get('/appointments', async (c) => {
  const { orgId } = getAuth(c);
  const status = c.req.query('status');
  const from = c.req.query('from');
  const to = c.req.query('to');

  let query = sb().from('appointments').select('*').eq('organization_id', orgId);
  if (status) query = query.eq('status', status);
  if (from) query = query.gte('scheduled_at', from);
  if (to) query = query.lte('scheduled_at', to);

  const { data } = await query.order('scheduled_at');
  return c.json({ data: data ?? [] });
});

calendarRoutes.post('/appointments', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  const body = await c.req.json();

  if (!body.customer_phone || !body.scheduled_at) {
    return c.json({ error: 'Telefono y fecha requeridos' }, 400);
  }

  // Check slot is available
  const scheduled = new Date(body.scheduled_at);
  const duration = body.duration_min || 30;
  const endTime = new Date(scheduled.getTime() + duration * 60000);

  const { data: conflicts } = await sb().from('appointments')
    .select('id')
    .eq('organization_id', orgId)
    .in('status', ['pending', 'confirmed'])
    .lt('scheduled_at', endTime.toISOString())
    .gt('scheduled_at', new Date(scheduled.getTime() - duration * 60000).toISOString());

  if (conflicts && conflicts.length > 0) {
    return c.json({ error: 'Ya hay una cita en ese horario' }, 409);
  }

  const appointmentData = {
    organization_id: orgId,
    conversation_id: body.conversation_id || null,
    customer_name: body.customer_name || null,
    customer_phone: body.customer_phone,
    customer_email: body.customer_email || null,
    scheduled_at: body.scheduled_at,
    duration_min: duration,
    status: 'confirmed',
    notes: body.notes || null,
  };

  const { data, error } = await sb().from('appointments')
    .insert(appointmentData).select().single();

  if (error) return c.json({ error: error.message }, 500);

  // Send confirmation email
  const agentConfig = await getAgentConfig(orgId);
  const businessName = agentConfig?.business_name || 'Tu negocio';
  sendAppointmentEmail(appointmentData, businessName).catch(() => {});

  logger.info({ orgId, appointmentId: data.id, scheduled_at: body.scheduled_at }, 'Appointment created');
  return c.json(data, 201);
});

calendarRoutes.patch('/appointments/:id', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  const body = await c.req.json();
  const { data, error } = await sb().from('appointments')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', c.req.param('id'))
    .eq('organization_id', orgId)
    .select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

calendarRoutes.delete('/appointments/:id', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  await sb().from('appointments')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', c.req.param('id'))
    .eq('organization_id', orgId);
  return c.json({ ok: true });
});

// ── Slot Generation Logic ──────────────────────────────────────────────

export async function getAvailableSlots(orgId: string, days: number = 7, tz: string = 'America/Mexico_City') {
  const { data: rules } = await sb().from('availability_rules')
    .select('*').eq('organization_id', orgId).eq('is_active', true);
  if (!rules?.length) return [];

  // Get existing appointments for the date range
  const now = new Date();
  const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const { data: appointments } = await sb().from('appointments')
    .select('scheduled_at, duration_min')
    .eq('organization_id', orgId)
    .in('status', ['pending', 'confirmed'])
    .gte('scheduled_at', now.toISOString())
    .lte('scheduled_at', endDate.toISOString());

  const bookedSlots = new Set(
    (appointments ?? []).map(a => new Date(a.scheduled_at).toISOString())
  );

  const slots: { date: string; time: string; datetime: string }[] = [];

  for (let d = 0; d < days; d++) {
    const date = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
    const dayOfWeek = date.getDay(); // 0=Sunday

    const rule = rules.find(r => r.day_of_week === dayOfWeek);
    if (!rule) continue;

    // Parse start/end times
    const [startH, startM] = rule.start_time.split(':').map(Number);
    const [endH, endM] = rule.end_time.split(':').map(Number);
    const duration = rule.slot_duration_min || 30;

    // Generate slots
    const dateStr = date.toLocaleDateString('en-CA', { timeZone: tz }); // YYYY-MM-DD
    let slotMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (slotMinutes + duration <= endMinutes) {
      const h = Math.floor(slotMinutes / 60);
      const m = slotMinutes % 60;
      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

      // Create datetime in the business timezone
      const slotDate = new Date(`${dateStr}T${timeStr}:00`);

      // Skip past slots
      if (slotDate > now && !bookedSlots.has(slotDate.toISOString())) {
        const dayName = slotDate.toLocaleDateString('es-MX', { weekday: 'long', timeZone: tz });
        const dateFormatted = slotDate.toLocaleDateString('es-MX', {
          day: 'numeric', month: 'long', timeZone: tz
        });

        slots.push({
          date: `${dayName} ${dateFormatted}`,
          time: timeStr,
          datetime: slotDate.toISOString(),
        });
      }

      slotMinutes += duration;
    }
  }

  return slots;
}

// ── Reminder Check (called by cron/interval) ───────────────────────────

export async function checkUpcomingReminders() {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000);

  const { data: upcoming } = await sb().from('appointments')
    .select('*')
    .in('status', ['pending', 'confirmed'])
    .eq('reminder_sent', false)
    .gte('scheduled_at', in23h.toISOString())
    .lte('scheduled_at', in24h.toISOString());

  if (!upcoming?.length) return 0;

  let sent = 0;
  for (const appt of upcoming) {
    try {
      const date = new Date(appt.scheduled_at);
      const timeStr = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Mexico_City' });
      const dateStr = date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Mexico_City' });

      await whatsappRouter.sendMessage(
        appt.organization_id,
        appt.customer_phone,
        `*Recordatorio de tu cita*\n\nHola${appt.customer_name ? ` ${appt.customer_name}` : ''}! Te recordamos tu cita programada para *${dateStr}* a las *${timeStr}*.\n\nSi necesitas reagendar, responde a este mensaje.`
      );

      await sb().from('appointments')
        .update({ reminder_sent: true })
        .eq('id', appt.id);

      sent++;
    } catch (err) {
      logger.warn({ err, appointmentId: appt.id }, 'Reminder send failed');
    }
  }

  logger.info({ sent, total: upcoming.length }, 'Appointment reminders sent');
  return sent;
}
