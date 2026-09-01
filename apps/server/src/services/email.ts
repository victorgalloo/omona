import { config } from '../config.js';
import { logger } from '../logger.js';

/**
 * Remitente para Resend. El dominio debe estar verificado en Resend; si no,
 * la API responde con error y el correo nunca sale.
 */
export function emailFrom(displayName?: string): string {
  return `${displayName || config.EMAIL_FROM_NAME} <${config.EMAIL_FROM_ADDRESS}>`;
}

/**
 * Envío único vía Resend. Devuelve el motivo del fallo en vez de solo `false`,
 * para que quien llama pueda decirle algo útil al usuario.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!config.RESEND_API_KEY) {
    logger.warn({ to: opts.to }, 'RESEND_API_KEY sin configurar; correo omitido');
    return { ok: false, reason: 'email_not_configured' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: emailFrom(opts.fromName),
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    logger.error({ err, status: res.status, to: opts.to, from: emailFrom(opts.fromName) },
      'Resend rechazó el envío');
    return { ok: false, reason: res.status === 403 ? 'domain_not_verified' : 'send_failed' };
  }

  return { ok: true };
}
