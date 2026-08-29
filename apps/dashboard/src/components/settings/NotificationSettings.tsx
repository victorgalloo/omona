'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Bell, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export function NotificationSettings() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get<{ agent_config: { notification_phone: string | null; notification_email: string | null } }>(
        '/api/settings',
      )
      .then((res) => {
        setPhone(res.agent_config.notification_phone ?? '');
        setEmail(res.agent_config.notification_email ?? '');
      })
      .catch(() => {});
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await api.put('/api/settings/agent', {
        notification_phone: phone || null,
        notification_email: email || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
    } finally {
      setSaving(false);
    }
  }, [phone, email]);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-surface p-2">
          <Bell className="h-5 w-5 text-accent-green" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Notificaciones de Handoff</h3>
          <p className="text-xs text-muted mt-0.5">
            Cuando el agente de IA detecte que un cliente necesita atención humana, recibirás una
            notificación por WhatsApp y/o email.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="flex items-center gap-1.5 text-xs mb-1.5">
            <Phone className="h-3.5 w-3.5" />
            WhatsApp de notificación
          </Label>
          <Input
            type="tel"
            placeholder="+52 55 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-9 text-sm"
          />
          <p className="text-xs text-muted mt-1">
            Número con código de país. Debe estar conectado a WhatsApp.
          </p>
        </div>

        <div>
          <Label className="flex items-center gap-1.5 text-xs mb-1.5">
            <Mail className="h-3.5 w-3.5" />
            Email de notificación
          </Label>
          <Input
            type="email"
            placeholder="admin@tuempresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {saved ? '¡Guardado!' : 'Guardar cambios'}
      </Button>
    </div>
  );
}
