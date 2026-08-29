-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (multi-tenant)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (linked to Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'agent', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Sessions (Baileys auth state per org)
CREATE TABLE whatsapp_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  phone_number TEXT,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('disconnected', 'connecting', 'connected', 'qr_pending')),
  qr_code TEXT, -- Current QR code for scanning
  auth_state JSONB, -- Baileys auth credentials (encrypted in production)
  last_connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Configuration (per org — the "soul" of each business's bot)
CREATE TABLE agent_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  
  -- Business info
  business_name TEXT NOT NULL DEFAULT 'Mi Empresa',
  business_description TEXT,
  industry TEXT,
  target_audience TEXT,
  website_url TEXT,
  
  -- Products/services (array of objects)
  products_services JSONB DEFAULT '[]'::jsonb,
  -- Format: [{ "name": "...", "description": "...", "price": "...", "features": ["...", "..."] }]
  
  -- FAQs
  faqs JSONB DEFAULT '[]'::jsonb,
  -- Format: [{ "question": "...", "answer": "..." }]
  
  -- Personality
  tone TEXT DEFAULT 'casual' CHECK (tone IN ('casual', 'professional', 'custom')),
  custom_personality TEXT, -- Override for 'custom' tone
  language TEXT DEFAULT 'es-MX', -- Primary language
  
  -- Sales behavior
  sales_mode TEXT DEFAULT 'flexible' CHECK (sales_mode IN ('schedule_demo', 'direct_close', 'lead_capture', 'flexible')),
  qualification_questions INTEGER DEFAULT 3,
  
  -- Business hours
  timezone TEXT DEFAULT 'America/Mexico_City',
  business_hours_start INTEGER DEFAULT 9, -- 24h format
  business_hours_end INTEGER DEFAULT 18,
  after_hours_message TEXT DEFAULT 'Gracias por escribirnos. Te responderemos en horario de atención.',
  
  -- Advanced
  system_prompt_override TEXT, -- Full override for power users
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL, -- WhatsApp number (E.164)
  contact_name TEXT, -- WhatsApp display name
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'handoff', 'resolved', 'archived')),
  
  -- AI-managed metadata
  lead_id UUID, -- FK added after leads table
  summary TEXT, -- Running conversation summary
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique per org + phone
  UNIQUE(organization_id, phone_number)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  whatsapp_message_id TEXT, -- Original WA message ID
  metadata JSONB DEFAULT '{}'::jsonb, -- Claude's structured extraction
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads (auto-extracted from conversations)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  phone_number TEXT NOT NULL,
  
  -- Contact info (extracted by AI)
  name TEXT,
  email TEXT,
  company TEXT,
  
  -- Qualification (extracted by AI)
  company_size TEXT,
  budget TEXT,
  timeline TEXT,
  interest TEXT,
  pain_points TEXT,
  
  -- Scoring
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'contacted', 'demo_scheduled', 'converted', 'lost')),
  
  -- Meta
  source TEXT DEFAULT 'whatsapp',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK from conversations to leads
ALTER TABLE conversations ADD CONSTRAINT fk_lead FOREIGN KEY (lead_id) REFERENCES leads(id);

-- Handoffs (human escalation)
CREATE TABLE handoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'resolved')),
  assigned_to UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conversations_org ON conversations(organization_id);
CREATE INDEX idx_conversations_status ON conversations(organization_id, status);
CREATE INDEX idx_conversations_last_msg ON conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_leads_org ON leads(organization_id);
CREATE INDEX idx_leads_status ON leads(organization_id, status);
CREATE INDEX idx_handoffs_org_status ON handoffs(organization_id, status);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE handoffs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their organization's data
CREATE POLICY "Users can view own org" ON organizations
  FOR ALL USING (id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own profile" ON profiles
  FOR ALL USING (id = auth.uid() OR organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage own org sessions" ON whatsapp_sessions
  FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage own org config" ON agent_configs
  FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org conversations" ON conversations
  FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org messages" ON messages
  FOR ALL USING (conversation_id IN (
    SELECT id FROM conversations WHERE organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage own org leads" ON leads
  FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage own org handoffs" ON handoffs
  FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Enable Realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE handoffs;
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_sessions;

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_organizations_updated BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_whatsapp_sessions_updated BEFORE UPDATE ON whatsapp_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_agent_configs_updated BEFORE UPDATE ON agent_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_conversations_updated BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_leads_updated BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
