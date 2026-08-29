'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus, Trash2, Users, Mail, Shield, Eye, UserCog } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Member {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface Invite {
  id: string;
  email: string;
  role: string;
  status: string;
  expires_at: string;
}

const ROLE_CONFIG: Record<string, { label: string; icon: any; color: string; desc: string; detail: string }> = {
  admin: {
    label: 'Admin',
    icon: Shield,
    color: 'text-error bg-error-muted',
    desc: 'Acceso total',
    detail: 'Puede configurar el agente, conectar WhatsApp, gestionar equipo, enviar broadcasts y acceder a todos los ajustes',
  },
  agent: {
    label: 'Agente',
    icon: UserCog,
    color: 'text-info bg-info-muted',
    desc: 'Chat + leads',
    detail: 'Puede responder conversaciones, gestionar leads, aceptar handoffs y agendar citas. No puede cambiar ajustes ni equipo',
  },
  viewer: {
    label: 'Viewer',
    icon: Eye,
    color: 'text-muted bg-surface',
    desc: 'Solo lectura',
    detail: 'Puede ver conversaciones, leads y analytics. No puede responder mensajes ni hacer cambios',
  },
};

export function TeamSettings() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('agent');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<{ data: Member[] }>('/api/team/members'),
      api.get<{ data: Invite[] }>('/api/team/invites'),
    ]).then(([m, i]) => {
      setMembers(m.data);
      setInvites(i.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const sendInvite = useCallback(async () => {
    if (!inviteEmail.trim()) return;
    setSending(true);
    try {
      await api.post('/api/team/invites', { email: inviteEmail, role: inviteRole });
      toast.success(`Invitación enviada a ${inviteEmail}`);
      setInviteEmail('');
      // Refresh
      const res = await api.get<{ data: Invite[] }>('/api/team/invites');
      setInvites(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Error al enviar invitación');
    } finally { setSending(false); }
  }, [inviteEmail, inviteRole]);

  const revokeInvite = async (id: string) => {
    await api.delete(`/api/team/invites/${id}`);
    setInvites(prev => prev.filter(i => i.id !== id));
    toast.success('Invitación revocada');
  };

  const removeMember = async (id: string) => {
    if (!confirm('¿Eliminar a este miembro del equipo?')) return;
    try {
      await api.delete(`/api/team/members/${id}`);
      setMembers(prev => prev.filter(m => m.id !== id));
      toast.success('Miembro eliminado');
    } catch (err: any) {
      toast.error(err.message || 'Error');
    }
  };

  const changeRole = async (id: string, newRole: string) => {
    await api.patch(`/api/team/members/${id}`, { role: newRole });
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    toast.success('Rol actualizado');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-surface p-2">
          <Users className="h-5 w-5 text-accent-green" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Equipo</h3>
          <p className="text-xs text-muted mt-0.5">
            Invita agentes para que manejen conversaciones y leads
          </p>
        </div>
      </div>

      {/* Role descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {Object.entries(ROLE_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div key={key} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`rounded-full p-1 ${config.color}`}>
                  <Icon className="h-3 w-3" />
                </span>
                <span className="text-xs font-semibold text-foreground">{config.label}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted">{config.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Invite form */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={inviteEmail}
          onChange={e => setInviteEmail(e.target.value)}
          placeholder="email@empresa.com"
          type="email"
          className="flex-1 h-9 text-sm"
        />
        <select
          value={inviteRole}
          onChange={e => setInviteRole(e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm h-9"
        >
          <option value="agent">Agente — {ROLE_CONFIG.agent.desc}</option>
          <option value="admin">Admin — {ROLE_CONFIG.admin.desc}</option>
          <option value="viewer">Viewer — {ROLE_CONFIG.viewer.desc}</option>
        </select>
        <Button size="sm" onClick={sendInvite} disabled={sending || !inviteEmail.trim()} className="h-9">
          {sending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Plus className="mr-1.5 h-4 w-4" />}
          Invitar
        </Button>
      </div>

      {/* Pending invites */}
      {invites.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold text-muted uppercase tracking-wider">Invitaciones pendientes</h4>
          <div className="space-y-1.5">
            {invites.map(inv => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border border-dashed border-border p-2.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted" />
                  <span className="text-sm text-foreground">{inv.email}</span>
                  <RoleBadge role={inv.role} />
                </div>
                <button onClick={() => revokeInvite(inv.id)} className="text-red-400 hover:text-error">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members */}
      <div>
        <h4 className="mb-2 text-xs font-semibold text-muted uppercase tracking-wider">Miembros ({members.length})</h4>
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map(i => <div key={i} className="h-14 animate-pulse rounded-lg bg-surface" />)}
          </div>
        ) : (
          <div className="space-y-1.5">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-green/10 text-sm font-semibold text-accent-green">
                    {(member.full_name || member.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{member.full_name || member.email}</p>
                    <p className="text-xs text-muted">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={member.role}
                    onChange={e => changeRole(member.id, e.target.value)}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  >
                    <option value="admin">Admin — {ROLE_CONFIG.admin.desc}</option>
                    <option value="agent">Agente — {ROLE_CONFIG.agent.desc}</option>
                    <option value="viewer">Viewer — {ROLE_CONFIG.viewer.desc}</option>
                  </select>
                  <button onClick={() => removeMember(member.id)} className="text-red-400 hover:text-error p-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.agent;
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
