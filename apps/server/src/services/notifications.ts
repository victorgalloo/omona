import { config } from '../config.js';
import { whatsappRouter } from '../whatsapp/router.js';
import { logger } from '../logger.js';

const DASHBOARD_URL = config.DASHBOARD_URL;

export async function sendHandoffNotification(params: {
  orgId: string;
  notificationPhone: string | null;
  notificationEmail: string | null;
  contactName: string | null;
  contactPhone: string;
  reason: string;
}): Promise<void> {
  const { orgId, notificationPhone, notificationEmail, contactName, contactPhone, reason } = params;

  const displayName = contactName || contactPhone;

  await Promise.allSettled([
    notificationPhone
      ? sendWhatsAppNotification(orgId, notificationPhone, displayName, reason)
      : Promise.resolve(),
    notificationEmail
      ? sendEmailNotification(notificationEmail, displayName, contactPhone, reason)
      : Promise.resolve(),
  ]);
}

async function sendWhatsAppNotification(
  orgId: string,
  phone: string,
  contactName: string,
  reason: string,
): Promise<void> {
  const text =
    `🚨 Handoff solicitado\n\n` +
    `Contacto: ${contactName}\n` +
    `Motivo: ${reason}\n\n` +
    `Abre el dashboard para atenderlo: ${DASHBOARD_URL}/handoff`;

  try {
    await whatsappRouter.sendMessage(orgId, phone, text);
    logger.info({ orgId, phone }, 'Handoff WhatsApp notification sent');
  } catch (err) {
    logger.warn({ err, orgId, phone }, 'Failed to send handoff WhatsApp notification');
  }
}

async function sendEmailNotification(
  toEmail: string,
  contactName: string,
  contactPhone: string,
  reason: string,
): Promise<void> {
  if (!config.RESEND_API_KEY) {
    logger.warn('RESEND_API_KEY not set, skipping email notification');
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 40px 20px; }
    .card { background: #fff; border-radius: 12px; max-width: 520px; margin: 0 auto; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .badge { display: inline-block; background: #ef4444; color: #fff; border-radius: 6px; padding: 4px 10px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 20px; }
    h1 { margin: 0 0 8px; font-size: 22px; color: #111; }
    .sub { color: #6b7280; font-size: 14px; margin-bottom: 28px; }
    .info-row { display: flex; gap: 8px; margin-bottom: 10px; }
    .label { font-size: 13px; color: #6b7280; min-width: 80px; }
    .value { font-size: 13px; color: #111; font-weight: 500; }
    .reason-box { background: #fef9ec; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px; margin: 20px 0; font-size: 14px; color: #92400e; }
    .btn { display: inline-block; background: #25d366; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; margin-top: 24px; }
    .footer { margin-top: 32px; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🚨 HANDOFF</div>
    <h1>${contactName} necesita atención</h1>
    <p class="sub">El agente de IA ha detectado que este contacto requiere atención humana.</p>
    <div class="info-row">
      <span class="label">Contacto</span>
      <span class="value">${contactName}</span>
    </div>
    <div class="info-row">
      <span class="label">Teléfono</span>
      <span class="value">${contactPhone}</span>
    </div>
    <div class="reason-box">
      <strong>Motivo:</strong> ${reason}
    </div>
    <a href="${DASHBOARD_URL}/handoff" class="btn">Ver en el Dashboard →</a>
    <div class="footer">Omona — Tu agente de ventas IA</div>
  </div>
</body>
</html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'omona@anthana.agency',
      to: [toEmail],
      subject: `🚨 Handoff: ${contactName} necesita atención`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    logger.warn({ status: res.status, body }, 'Failed to send handoff email notification');
  } else {
    logger.info({ toEmail }, 'Handoff email notification sent');
  }
}
