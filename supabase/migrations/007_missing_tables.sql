-- Tablas que el código usa pero que ninguna migración creaba: vivían sólo en el
-- panel de Supabase. Reconstruidas desde los accesos reales en api/team.ts y
-- api/webhooks.ts.
--
-- Escrita para poder re-ejecutarse: si la tabla ya existe, añade sólo lo que
-- falte (columnas, restricciones, índices) en vez de abortar.

-- ── Invitaciones de equipo (api/team.ts) ──
CREATE TABLE IF NOT EXISTS team_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'agent' CHECK (role IN ('admin', 'agent', 'viewer')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Por si la tabla ya existía con menos columnas de las que el código usa.
ALTER TABLE team_invites ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE team_invites ADD COLUMN IF NOT EXISTS email      TEXT;
ALTER TABLE team_invites ADD COLUMN IF NOT EXISTS role       TEXT DEFAULT 'agent';
ALTER TABLE team_invites ADD COLUMN IF NOT EXISTS invited_by UUID;
ALTER TABLE team_invites ADD COLUMN IF NOT EXISTS status     TEXT DEFAULT 'pending';
ALTER TABLE team_invites ADD COLUMN IF NOT EXISTS token      TEXT;
ALTER TABLE team_invites ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE team_invites ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- team.ts:77 hace upsert con onConflict 'organization_id,email' para reenviar
-- una invitación pendiente; sin esta restricción ese upsert falla en runtime.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'team_invites'::regclass AND conname = 'team_invites_org_email_key'
  ) THEN
    ALTER TABLE team_invites ADD CONSTRAINT team_invites_org_email_key UNIQUE (organization_id, email);
  END IF;
END $$;

-- ── Webhooks salientes (api/webhooks.ts) ──
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  -- fireWebhookEvent filtra con .contains('events', [event]): debe ser array.
  events TEXT[] NOT NULL DEFAULT '{}',
  secret TEXT,                      -- firma HMAC-SHA256 en X-Omona-Signature
  active BOOLEAN DEFAULT TRUE,
  last_error TEXT,
  last_error_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS url             TEXT;
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS events          TEXT[] DEFAULT '{}';
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS secret          TEXT;
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS active          BOOLEAN DEFAULT TRUE;
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS last_error      TEXT;
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS last_error_at   TIMESTAMPTZ;
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS last_success_at TIMESTAMPTZ;
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS created_at      TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_team_invites_token   ON team_invites(token);
CREATE INDEX IF NOT EXISTS idx_team_invites_org     ON team_invites(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_webhooks_org_active  ON webhooks(organization_id, active);

ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks     ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own org invites"   ON team_invites;
CREATE POLICY "Users can manage own org invites" ON team_invites
  FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage own org webhooks" ON webhooks;
CREATE POLICY "Users can manage own org webhooks" ON webhooks
  FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- PostgREST cachea el esquema: sin esto las tablas nuevas devuelven 404 en la
-- API REST hasta el siguiente reinicio.
NOTIFY pgrst, 'reload schema';
