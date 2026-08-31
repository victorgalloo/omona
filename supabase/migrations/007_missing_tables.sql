-- Tablas que el código usa pero que ninguna migración creaba: vivían sólo en el
-- panel de Supabase y se perdieron al borrar el proyecto. Reconstruidas desde
-- los accesos reales en api/team.ts y api/webhooks.ts.

-- ── Invitaciones de equipo (api/team.ts) ──
CREATE TABLE team_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'agent' CHECK (role IN ('admin', 'agent', 'viewer')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  -- team.ts:77 hace upsert con onConflict 'organization_id,email' para reenviar
  -- una invitación pendiente; sin esta restricción ese upsert falla.
  UNIQUE (organization_id, email)
);

-- ── Webhooks salientes (api/webhooks.ts) ──
CREATE TABLE webhooks (
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

CREATE INDEX idx_team_invites_token ON team_invites(token);
CREATE INDEX idx_team_invites_org ON team_invites(organization_id, status);
CREATE INDEX idx_webhooks_org_active ON webhooks(organization_id, active);

ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own org invites" ON team_invites
  FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage own org webhooks" ON webhooks
  FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
