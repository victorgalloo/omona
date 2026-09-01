// ============================================================================
// Database Types (mirrors Supabase schema)
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  organization_id: string | null;
  full_name: string | null;
  role: 'admin' | 'agent' | 'viewer';
  avatar_url: string | null;
  created_at: string;
}

export interface WhatsAppSession {
  id: string;
  organization_id: string;
  phone_number: string | null;
  status: 'disconnected' | 'connecting' | 'connected' | 'qr_pending';
  qr_code: string | null;
  auth_state: Record<string, unknown> | null;
  last_connected_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgentConfig {
  id: string;
  organization_id: string;

  // Business info
  business_name: string;
  business_description: string | null;
  industry: string | null;
  target_audience: string | null;
  website_url: string | null;

  // Products/services
  products_services: Product[];

  // FAQs
  faqs: FAQ[];

  // Personality
  tone: 'casual' | 'professional' | 'custom';
  custom_personality: string | null;
  language: string;

  // Sales behavior
  sales_mode: 'schedule_demo' | 'direct_close' | 'lead_capture' | 'flexible';
  qualification_questions: number;

  // Timezone
  timezone: string;

  // Quick replies
  quick_replies: QuickReply[];

  // Advanced
  system_prompt_override: string | null;

  // Notifications
  notification_phone: string | null;
  notification_email: string | null;

  created_at: string;
  updated_at: string;
}

export interface Product {
  name: string;
  description: string;
  price: string;
  features: string[];
}

export interface QuickReply {
  id: string;
  title: string;
  message: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Conversation {
  id: string;
  organization_id: string;
  phone_number: string;
  contact_name: string | null;
  status: 'active' | 'handoff' | 'resolved' | 'archived';
  lead_id: string | null;
  summary: string | null;
  metadata: Record<string, unknown>;
  tags: string[];
  pinned: boolean;
  unread_count: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  whatsapp_message_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Lead {
  id: string;
  organization_id: string;
  conversation_id: string | null;
  phone_number: string;

  // Contact info
  name: string | null;
  email: string | null;
  company: string | null;

  // Qualification
  company_size: string | null;
  budget: string | null;
  timeline: string | null;
  interest: string | null;
  pain_points: string | null;

  // Scoring
  score: number;
  status: 'new' | 'qualified' | 'contacted' | 'demo_scheduled' | 'converted' | 'lost';

  // Organization
  tags: string[];
  assigned_to: string | null;
  custom_fields: Record<string, unknown>;

  // Meta
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Handoff {
  id: string;
  organization_id: string;
  conversation_id: string;
  reason: string | null;
  status: 'pending' | 'accepted' | 'resolved';
  assigned_to: string | null;
  resolved_at: string | null;
  created_at: string;
}

// ============================================================================
// AI Engine Types
// ============================================================================

export interface AIResponse {
  reply: string;
  extracted_info: ExtractedLeadInfo;
  lead_score_delta: number;
  needs_handoff: boolean;
  handoff_reason: string | null;
  conversation_summary: string | null;
}

export interface ExtractedLeadInfo {
  name: string | null;
  email: string | null;
  company: string | null;
  company_size: string | null;
  budget: string | null;
  timeline: string | null;
  interest: string | null;
  pain_points: string | null;
}

// ============================================================================
// API Types
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ConversationWithLastMessage extends Conversation {
  last_message?: Message;
  lead?: Lead;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
  lead: Lead | null;
  handoff: Handoff | null;
}

export interface TestChatRequest {
  message: string;
  conversation_id?: string;
  organization_id: string;
}

export interface TestChatResponse {
  reply: string;
  conversation_id: string;
  extracted_info: ExtractedLeadInfo;
  lead_score: number;
}

export interface QRCodeResponse {
  qr_code: string | null;
  status: WhatsAppSession['status'];
}

export interface WhatsAppStatusResponse {
  status: WhatsAppSession['status'];
  phone_number: string | null;
  last_connected_at: string | null;
}

/* ── CRM: actividades, tareas, empresas, campos personalizados y vistas ── */

export type ActivityKind = 'note' | 'call' | 'email' | 'stage_change' | 'task_done' | 'agent';

export interface LeadActivity {
  id: string;
  organization_id: string;
  lead_id: string;
  kind: ActivityKind;
  body: string | null;
  /** Para stage_change: { from, to }. */
  meta: Record<string, unknown>;
  /** null cuando la generó el agente y no una persona. */
  author_id: string | null;
  created_at: string;
}

export type TaskStatus = 'open' | 'done' | 'cancelled';

export interface Task {
  id: string;
  organization_id: string;
  lead_id: string | null;
  title: string;
  detail: string | null;
  due_at: string | null;
  status: TaskStatus;
  assignee_id: string | null;
  /** true cuando el agente detectó un compromiso en la conversación. */
  created_by_agent: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  organization_id: string;
  name: string;
  /** Nombre normalizado; evita duplicar la misma empresa por mayúsculas o acentos. */
  slug: string;
  domain: string | null;
  size: string | null;
  industry: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CustomFieldType = 'text' | 'number' | 'date' | 'select' | 'boolean';

export interface CustomFieldDef {
  id: string;
  organization_id: string;
  /** Clave estable dentro de leads.custom_fields. */
  key: string;
  label: string;
  type: CustomFieldType;
  options: string[];
  position: number;
  created_at: string;
}

export interface SavedView {
  id: string;
  organization_id: string;
  name: string;
  entity: 'leads' | 'tasks' | 'companies';
  filters: Record<string, unknown>;
  sort: Record<string, unknown>;
  is_shared: boolean;
  owner_id: string | null;
  created_at: string;
}
