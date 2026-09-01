-- CRM completo: bitácora de actividades, tareas, empresas, campos
-- personalizados y vistas guardadas.
--
-- Toda tabla lleva organization_id y filtra por él. Es la misma regla que
-- corrigió 008: la API usa SUPABASE_SERVICE_KEY y salta RLS, así que el
-- filtro por organización tiene que estar en la consulta, no solo en la
-- política.

BEGIN;

-- ── 1. Bitácora de actividades ──────────────────────────────────────────
-- leads.notes era un único TEXT que se sobrescribía: quien escribía pisaba
-- lo anterior y no quedaba registro de autor ni fecha.

CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  -- 'note' la escribe una persona; el resto lo registra el sistema solo.
  kind TEXT NOT NULL DEFAULT 'note'
    CHECK (kind IN ('note', 'call', 'email', 'stage_change', 'task_done', 'agent')),
  body TEXT,

  -- Para stage_change: de dónde a dónde.
  meta JSONB DEFAULT '{}'::jsonb,

  -- NULL cuando lo generó el agente y no una persona.
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead
  ON lead_activities(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_activities_org
  ON lead_activities(organization_id, created_at DESC);

-- Conserva las notas que ya existían como primera entrada de su lead.
INSERT INTO lead_activities (organization_id, lead_id, kind, body, created_at)
SELECT organization_id, id, 'note', notes, COALESCE(updated_at, created_at)
FROM leads
WHERE notes IS NOT NULL AND btrim(notes) <> '';

-- ── 2. Tareas ───────────────────────────────────────────────────────────
-- appointments cubre citas agendadas; esto son compromisos sueltos
-- ("mandar la propuesta antes del viernes").

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  detail TEXT,
  due_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'done', 'cancelled')),

  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  -- true cuando la creó el agente al detectar un compromiso en la conversación
  created_by_agent BOOLEAN NOT NULL DEFAULT FALSE,

  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_org_status ON tasks(organization_id, status, due_at);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id, status, due_at);
CREATE INDEX IF NOT EXISTS idx_tasks_lead ON tasks(lead_id);

-- ── 3. Empresas ─────────────────────────────────────────────────────────
-- leads.company era texto libre: dos leads de la misma empresa no se
-- relacionaban entre sí.

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  -- nombre normalizado, para no duplicar "Ferretería del Norte" y
  -- "ferreteria del norte" como empresas distintas
  slug TEXT NOT NULL,
  domain TEXT,
  size TEXT,
  industry TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (organization_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_companies_org ON companies(organization_id, name);

ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_id UUID
  REFERENCES companies(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_leads_company ON leads(company_id);

-- El texto de leads.company se conserva: sirve de respaldo y de origen para
-- la normalización, que corre desde la aplicación.

-- ── 5. Campos personalizados ────────────────────────────────────────────
-- La definición vive por organización; los valores en JSONB sobre el lead,
-- para no alterar el esquema por cliente.

CREATE TABLE IF NOT EXISTS custom_field_defs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- clave estable usada dentro del JSONB; el label es lo que ve el usuario
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text'
    CHECK (type IN ('text', 'number', 'date', 'select', 'boolean')),
  options JSONB DEFAULT '[]'::jsonb,
  position INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (organization_id, key)
);

ALTER TABLE leads ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_leads_custom_fields ON leads USING GIN (custom_fields);

-- ── 6. Vistas guardadas ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  entity TEXT NOT NULL DEFAULT 'leads' CHECK (entity IN ('leads', 'tasks', 'companies')),
  -- filtros y orden, tal como los arma la interfaz
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort JSONB DEFAULT '{}'::jsonb,

  -- privada del autor, o visible para toda la organización
  is_shared BOOLEAN NOT NULL DEFAULT FALSE,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_views_org ON saved_views(organization_id, entity);

-- ── RLS ─────────────────────────────────────────────────────────────────
-- Mismo criterio que 008: el cliente autenticado solo lee lo de su
-- organización; toda mutación pasa por la API.

ALTER TABLE lead_activities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks             ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies         ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_field_defs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_views       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own org activities" ON lead_activities
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org tasks" ON tasks
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org companies" ON companies
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org custom fields" ON custom_field_defs
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

-- Las vistas privadas solo las ve su autor.
CREATE POLICY "Users can read own org saved views" ON saved_views
  FOR SELECT TO authenticated
  USING (
    organization_id = public.current_organization_id()
    AND (is_shared OR owner_id = auth.uid())
  );

COMMIT;
