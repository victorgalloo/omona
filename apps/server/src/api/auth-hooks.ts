import { Hono } from 'hono';
import { config } from '../config.js';
import { logger } from '../logger.js';
import { getSupabase } from '../db/client.js';
import { sendEmail } from '../services/email.js';

const sb = () => getSupabase();

export const authHookRoutes = new Hono();


/**
 * POST /auth/signup
 * Public endpoint — creates user via Supabase admin API,
 * generates confirmation link, sends email via Resend.
 */

/** Plantilla del correo de confirmación, compartida por signup y reenvío. */
function confirmationHtml(displayName: string, confirmUrl: string): string {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 20px;background:#0C0C0C;color:#FAFAFA">
      <div style="text-align:center;margin-bottom:24px">
        <img src="https://omona.tech/logo-mark-white.png" width="34" height="34" alt="Omona" style="display:block;margin:0 auto 10px;border:0" />
        <div style="font-family:monospace;font-size:20px;font-weight:600;color:#FAFAFA">omona_</div>
      </div>

      <div style="background:#161616;border:1px solid #2A2A2A;border-radius:12px;padding:32px">
        <h2 style="margin:0 0 8px;font-size:18px;color:#FAFAFA">Hola, ${displayName}</h2>
        <p style="margin:0 0 24px;color:#8A8A8A;font-size:14px;line-height:1.6">
          Gracias por registrarte en Omona. Confirma tu correo para activar tu cuenta.
        </p>

        <div style="text-align:center;margin-bottom:24px">
          <a href="${confirmUrl}"
             style="display:inline-block;background:#34d399;color:#0C0C0C;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:600;font-size:14px">
            Confirmar cuenta
          </a>
        </div>

        <p style="margin:0;color:#8A8A8A;font-size:12px;text-align:center">
          Si no creaste esta cuenta, puedes ignorar este correo.<br/>
          El enlace expira en 24 horas.
        </p>
      </div>

      <p style="text-align:center;color:#8A8A8A;font-size:11px;margin-top:24px">
        &copy; ${new Date().getFullYear()} omona by anthana
      </p>
    </div>
  `;
}

/** Traduce el motivo técnico del fallo a algo accionable para el usuario. */
function emailErrorMessage(reason: string): string {
  if (reason === 'email_not_configured' || reason === 'domain_not_verified') {
    return 'No pudimos enviar el correo por un problema de configuración nuestro. Escríbenos y te activamos la cuenta.';
  }
  return 'No pudimos enviar el correo. Vuelve a intentarlo en unos minutos.';
}

authHookRoutes.post('/signup', async (c) => {
  const { email, password, fullName, next } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'Email y contraseña requeridos' }, 400);
  }
  if (password.length < 6) {
    return c.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, 400);
  }

  // Create user via admin API (no email sent by Supabase)
  const { data: createData, error: createError } = await sb().auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { full_name: fullName || email.split('@')[0] },
  });

  if (createError) {
    // User may already exist
    if (createError.message?.includes('already been registered') || createError.message?.includes('already exists')) {
      return c.json({ error: 'Este correo ya tiene una cuenta. Intenta iniciar sesión.' }, 409);
    }
    logger.error({ error: createError, email }, 'Failed to create user');
    return c.json({ error: createError.message || 'Error al crear cuenta' }, 500);
  }

  // Generate confirmation link via admin API
  const dashboardUrl = config.DASHBOARD_URL;
  const redirectTo = next
    ? `${dashboardUrl}/auth/confirm?next=${encodeURIComponent(next)}`
    : `${dashboardUrl}/auth/confirm`;

  const { data: linkData, error: linkError } = await sb().auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: { redirectTo },
  });

  if (linkError || !linkData?.properties?.hashed_token) {
    logger.error({ error: linkError, email }, 'Failed to generate confirmation link');
    // User was created but we can't send confirmation — they can use "resend confirmation"
    return c.json({ error: 'Cuenta creada pero no pudimos enviar el correo. Intenta reenviar la confirmación.' }, 500);
  }

  const tokenHash = linkData.properties.hashed_token;
  const confirmUrl = `${dashboardUrl}/auth/confirm?token_hash=${tokenHash}&type=signup${next ? `&next=${encodeURIComponent(next)}` : ''}`;
  const displayName = fullName || email.split('@')[0];

  const html = confirmationHtml(displayName, confirmUrl);

  const sent = await sendEmail({ to: email, subject: 'Confirma tu cuenta en Omona', html: html });
  if (!sent.ok) {
    logger.error({ email, reason: sent.reason }, 'Cuenta creada pero el correo no salió');
    return c.json({
      error: emailErrorMessage(sent.reason),
      accountCreated: true,
      canResend: true,
    }, 500);
  }

  logger.info({ email, userId: createData.user?.id }, 'User created + confirmation email sent via Resend');
  return c.json({ ok: true });
});

/**
 * POST /auth/reset-password
 * Public endpoint — generates password reset link and sends via Resend.
 */
authHookRoutes.post('/reset-password', async (c) => {
  const { email } = await c.req.json();

  if (!email) return c.json({ error: 'Email requerido' }, 400);

  const dashboardUrl = config.DASHBOARD_URL;

  const { data: linkData, error: linkError } = await sb().auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: `${dashboardUrl}/auth/confirm` },
  });

  if (linkError || !linkData?.properties?.hashed_token) {
    // Don't reveal if user exists or not
    logger.warn({ error: linkError, email }, 'Failed to generate recovery link');
    return c.json({ ok: true });
  }

  const tokenHash = linkData.properties.hashed_token;
  const resetUrl = `${dashboardUrl}/auth/confirm?token_hash=${tokenHash}&type=recovery`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 20px;background:#0C0C0C;color:#FAFAFA">
      <div style="text-align:center;margin-bottom:24px">
        <img src="https://omona.tech/logo-mark-white.png" width="34" height="34" alt="Omona" style="display:block;margin:0 auto 10px;border:0" />
        <div style="font-family:monospace;font-size:20px;font-weight:600;color:#FAFAFA">omona_</div>
      </div>

      <div style="background:#161616;border:1px solid #2A2A2A;border-radius:12px;padding:32px">
        <h2 style="margin:0 0 8px;font-size:18px;color:#FAFAFA">Restablecer contrase&ntilde;a</h2>
        <p style="margin:0 0 24px;color:#8A8A8A;font-size:14px;line-height:1.6">
          Recibimos una solicitud para restablecer la contrase&ntilde;a de <strong style="color:#FAFAFA">${email}</strong>.
        </p>

        <div style="text-align:center;margin-bottom:24px">
          <a href="${resetUrl}"
             style="display:inline-block;background:#34d399;color:#0C0C0C;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:600;font-size:14px">
            Restablecer contrase&ntilde;a
          </a>
        </div>

        <p style="margin:0;color:#8A8A8A;font-size:12px;text-align:center">
          Si no solicitaste esto, puedes ignorar este correo.<br/>
          El enlace expira en 1 hora.
        </p>
      </div>

      <p style="text-align:center;color:#8A8A8A;font-size:11px;margin-top:24px">
        &copy; ${new Date().getFullYear()} omona by anthana
      </p>
    </div>
  `;

  await sendEmail({ to: email, subject: 'Restablece tu contraseña en Omona', html: html });
  logger.info({ email }, 'Password reset email sent via Resend');

  // Always return ok (don't reveal if user exists)
  return c.json({ ok: true });
});

/**
 * POST /auth/resend-confirmation
 * Público. Reenvía el correo de confirmación a una cuenta que ya existe pero
 * sigue sin verificar. Existía el mensaje de error que lo sugería, pero no la
 * ruta: quien fallaba al registrarse quedaba sin salida.
 *
 * Responde igual exista o no la cuenta, para no revelar qué correos están
 * registrados.
 */
authHookRoutes.post('/resend-confirmation', async (c) => {
  const { email, next } = await c.req.json();
  if (!email) return c.json({ error: 'Email requerido' }, 400);

  const dashboardUrl = config.DASHBOARD_URL;
  const redirectTo = next
    ? `${dashboardUrl}/auth/confirm?next=${encodeURIComponent(next)}`
    : `${dashboardUrl}/auth/confirm`;

  const { data: linkData, error: linkError } = await sb().auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo },
  });

  if (linkError || !linkData?.properties?.hashed_token) {
    // Cuenta inexistente o ya confirmada: se responde ok igual.
    logger.info({ email, error: linkError?.message }, 'Reenvío sin enlace generable');
    return c.json({ ok: true });
  }

  const tokenHash = linkData.properties.hashed_token;
  const confirmUrl = `${dashboardUrl}/auth/confirm?token_hash=${tokenHash}&type=magiclink${next ? `&next=${encodeURIComponent(next)}` : ''}`;
  const displayName = email.split('@')[0];

  const sent = await sendEmail({
    to: email,
    subject: 'Confirma tu cuenta en Omona',
    html: confirmationHtml(displayName, confirmUrl),
  });

  if (!sent.ok) {
    logger.error({ email, reason: sent.reason }, 'No se pudo reenviar la confirmación');
    return c.json({ error: emailErrorMessage(sent.reason) }, 500);
  }

  return c.json({ ok: true });
});
