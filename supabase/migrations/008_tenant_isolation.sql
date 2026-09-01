-- P0: Aislamiento multi-tenant para clientes autenticados.
-- La API usa SUPABASE_SERVICE_KEY y aplica sus propias verificaciones por org.
-- El cliente web anónimo sólo conserva SELECT de su propia organización para
-- bootstrap/realtime; cualquier mutación pasa por la API autenticada.

BEGIN;

-- Evita que las políticas de profiles se consulten recursivamente entre sí.
CREATE OR REPLACE FUNCTION public.current_organization_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM public.profiles
  WHERE id = auth.uid()
$$;

REVOKE ALL ON FUNCTION public.current_organization_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_organization_id() TO authenticated;

-- Sustituye las políticas FOR ALL heredadas por acceso de lectura mínimo.
DROP POLICY IF EXISTS "Users can view own org" ON organizations;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can manage own org sessions" ON whatsapp_sessions;
DROP POLICY IF EXISTS "Users can manage own org config" ON agent_configs;
DROP POLICY IF EXISTS "Users can view own org conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view own org messages" ON messages;
DROP POLICY IF EXISTS "Users can manage own org leads" ON leads;
DROP POLICY IF EXISTS "Users can manage own org handoffs" ON handoffs;
DROP POLICY IF EXISTS "Users can manage own org availability" ON availability_rules;
DROP POLICY IF EXISTS "Users can manage own org appointments" ON appointments;
DROP POLICY IF EXISTS "Users can manage own org invites" ON team_invites;
DROP POLICY IF EXISTS "Users can manage own org webhooks" ON webhooks;

CREATE POLICY "Users can read own org" ON organizations
  FOR SELECT TO authenticated
  USING (id = public.current_organization_id());

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can read own org sessions" ON whatsapp_sessions
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org config" ON agent_configs
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org conversations" ON conversations
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org messages" ON messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM conversations
      WHERE conversations.id = messages.conversation_id
        AND conversations.organization_id = public.current_organization_id()
    )
  );

CREATE POLICY "Users can read own org leads" ON leads
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org handoffs" ON handoffs
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org availability" ON availability_rules
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org appointments" ON appointments
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org invites" ON team_invites
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

CREATE POLICY "Users can read own org webhooks" ON webhooks
  FOR SELECT TO authenticated
  USING (organization_id = public.current_organization_id());

-- Ningún JWT público puede crear/modificar/borrar datos de negocio de forma
-- directa. El service_role del servidor no se ve afectado por estos REVOKE.
REVOKE INSERT, UPDATE, DELETE ON TABLE
  organizations,
  profiles,
  whatsapp_sessions,
  agent_configs,
  conversations,
  messages,
  leads,
  handoffs,
  availability_rules,
  appointments,
  team_invites,
  webhooks
FROM anon, authenticated;

NOTIFY pgrst, 'reload schema';

COMMIT;
