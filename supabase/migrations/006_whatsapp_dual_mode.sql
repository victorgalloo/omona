-- WhatsApp dual-mode: Baileys (QR, onboarding rápido) + Cloud API (oficial)
-- Cada org elige su canal; las credenciales Cloud API viven en whatsapp_sessions.

-- Canal de la org
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS whatsapp_provider text NOT NULL DEFAULT 'baileys'
  CHECK (whatsapp_provider IN ('baileys', 'cloud_api'));

-- Credenciales Cloud API (por org): phone_number_id, waba_id, access_token, display_name
ALTER TABLE whatsapp_sessions
  ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'baileys',
  ADD COLUMN IF NOT EXISTS cloud_creds jsonb;

-- Índice para el webhook: resolver org por phone_number_id rápido
CREATE INDEX IF NOT EXISTS whatsapp_sessions_cloud_phone_idx
  ON whatsapp_sessions ((cloud_creds->>'phone_number_id'))
  WHERE cloud_creds IS NOT NULL;
