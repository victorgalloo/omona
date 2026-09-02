-- Historial de difusión.
--
-- Hasta ahora la difusión no persistía NADA: ni campaña, ni destinatario, ni
-- resultado. El mensaje se mandaba y desaparecía — ni siquiera aparecía en el
-- Inbox. Si algo fallaba, el usuario veía un contador y nunca sabía a quién
-- le llegó ni por qué.
--
-- Además `admin.ts` y `scripts/delete-user.ts` ya borran de `broadcast_messages`
-- al eliminar una cuenta, contra una tabla que nunca existió: el borrado
-- fallaba en silencio. Mismo tipo de deriva de esquema que la migración 010.

BEGIN;

-- Una campaña por envío.
CREATE TABLE IF NOT EXISTS broadcast_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Con qué canal salió. Importa para leer el historial: una campaña por
  -- plantilla y una por texto libre no son comparables.
  provider TEXT NOT NULL DEFAULT 'baileys'
    CHECK (provider IN ('baileys', 'cloud_api')),

  body TEXT NOT NULL,
  -- Sólo para cloud_api: qué plantilla aprobada se usó.
  template_name TEXT,
  audience TEXT NOT NULL DEFAULT 'all',

  status TEXT NOT NULL DEFAULT 'running'
    CHECK (status IN ('running', 'done', 'failed')),

  total   INTEGER NOT NULL DEFAULT 0,
  sent    INTEGER NOT NULL DEFAULT 0,
  failed  INTEGER NOT NULL DEFAULT 0,

  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at  TIMESTAMPTZ
);

-- Un renglón por destinatario, para poder decir a quién le llegó y a quién no.
CREATE TABLE IF NOT EXISTS broadcast_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES broadcast_campaigns(id) ON DELETE CASCADE,

  phone_number TEXT NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'failed')),
  -- El motivo real del fallo. Antes todo se colapsaba en un contador:
  -- 'cloud_api_outside_service_window' se veía igual que un número inválido.
  error TEXT,

  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS broadcast_campaigns_org_idx
  ON broadcast_campaigns (organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS broadcast_messages_campaign_idx
  ON broadcast_messages (campaign_id);
CREATE INDEX IF NOT EXISTS broadcast_messages_org_idx
  ON broadcast_messages (organization_id);

ALTER TABLE broadcast_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_messages  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own org campaigns" ON broadcast_campaigns
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org broadcast messages" ON broadcast_messages
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

COMMIT;
