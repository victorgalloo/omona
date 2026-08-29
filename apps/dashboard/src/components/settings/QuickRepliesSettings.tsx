'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Plus, Trash2, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface QuickReply {
  id: string;
  title: string;
  message: string;
}

export function QuickRepliesSettings() {
  const [replies, setReplies] = useState<QuickReply[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<{ agent_config: { quick_replies?: QuickReply[] } }>('/api/settings')
      .then((res) => setReplies(res.agent_config.quick_replies || []))
      .catch(() => {});
  }, []);

  const addReply = () => {
    setReplies([...replies, { id: crypto.randomUUID(), title: '', message: '' }]);
  };

  const removeReply = (id: string) => {
    setReplies(replies.filter(r => r.id !== id));
  };

  const updateReply = (id: string, field: 'title' | 'message', value: string) => {
    setReplies(replies.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const valid = replies.filter(r => r.title.trim() && r.message.trim());
      await api.put('/api/settings/agent', { quick_replies: valid });
      setReplies(valid);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {} finally { setSaving(false); }
  }, [replies]);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-surface p-2">
          <Zap className="h-5 w-5 text-accent-green" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Respuestas rápidas</h3>
          <p className="text-xs text-muted mt-0.5">
            Plantillas de respuesta que puedes usar rápidamente durante el chat
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {replies.map((reply) => (
          <div key={reply.id} className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                value={reply.title}
                onChange={(e) => updateReply(reply.id, 'title', e.target.value)}
                placeholder="Título (ej: Saludo, Precio, Horarios)"
                className="h-8 text-sm flex-1"
              />
              <button
                onClick={() => removeReply(reply.id)}
                className="text-red-400 hover:text-error p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Textarea
              value={reply.message}
              onChange={(e) => updateReply(reply.id, 'message', e.target.value)}
              placeholder="Mensaje de respuesta..."
              rows={2}
              className="text-sm resize-none"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={addReply}>
          <Plus className="mr-1.5 h-4 w-4" />
          Agregar respuesta
        </Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          {saved ? '¡Guardado!' : 'Guardar'}
        </Button>
      </div>
    </div>
  );
}
