'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';

interface AgentConfig {
  tone: 'casual' | 'professional' | 'custom';
  custom_personality: string | null;
  sales_mode: 'schedule_demo' | 'direct_close' | 'lead_capture' | 'flexible';
  qualification_questions: number;
  system_prompt_override: string | null;
}

const toneLabels: Record<string, string> = {
  casual: 'Casual',
  professional: 'Profesional',
  custom: 'Personalizado',
};

const salesModeLabels: Record<string, string> = {
  schedule_demo: 'Agendar demo',
  direct_close: 'Cierre directo',
  lead_capture: 'Captura de leads',
  flexible: 'Flexible',
};

export function AgentSettings() {
  const [form, setForm] = useState<AgentConfig>({
    tone: 'casual',
    custom_personality: '',
    sales_mode: 'flexible',
    qualification_questions: 3,
    system_prompt_override: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<{ agent_config: AgentConfig }>('/api/settings').then((res) => {
      setForm({
        tone: res.agent_config.tone ?? 'casual',
        custom_personality: res.agent_config.custom_personality ?? '',
        sales_mode: res.agent_config.sales_mode ?? 'flexible',
        qualification_questions: res.agent_config.qualification_questions ?? 3,
        system_prompt_override: res.agent_config.system_prompt_override ?? '',
      });
    }).catch(() => {});
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await api.put('/api/settings/agent', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Handle error
    } finally {
      setSaving(false);
    }
  }, [form]);

  return (
    <div className="space-y-6">
      <div>
        <Label>Tono del agente</Label>
        <p className="mb-2 text-xs text-muted">
          Define cómo se comunica tu agente con los clientes
        </p>
        <Select
          value={form.tone}
          onValueChange={(v) => setForm((f) => ({ ...f, tone: v as AgentConfig['tone'] }))}
        >
          {Object.entries(toneLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </Select>
      </div>

      {form.tone === 'custom' && (
        <div>
          <Label>Personalidad personalizada</Label>
          <Textarea
            value={form.custom_personality ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, custom_personality: e.target.value }))}
            placeholder="Describe cómo quieres que se comporte tu agente..."
            className="mt-1.5"
            rows={4}
          />
        </div>
      )}

      <div>
        <Label>Modo de ventas</Label>
        <p className="mb-2 text-xs text-muted">
          El objetivo principal de tu agente al interactuar con prospectos
        </p>
        <Select
          value={form.sales_mode}
          onValueChange={(v) => setForm((f) => ({ ...f, sales_mode: v as AgentConfig['sales_mode'] }))}
        >
          {Object.entries(salesModeLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <Label>Preguntas de calificación: {form.qualification_questions}</Label>
        <p className="mb-3 text-xs text-muted">
          Cuántas preguntas hace el agente antes de calificar un lead
        </p>
        <Slider
          value={form.qualification_questions}
          onChange={(e) => setForm((f) => ({ ...f, qualification_questions: Number(e.target.value) }))}
          min={1}
          max={10}
          step={1}
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      <div>
        <Label>Instrucciones personalizadas</Label>
        <p className="mb-2 text-xs text-muted">
          Agrega instrucciones adicionales que el agente seguirá en cada conversación
        </p>
        <Textarea
          value={form.system_prompt_override ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, system_prompt_override: e.target.value }))}
          placeholder="Ej: Siempre menciona nuestra garantía de 30 días. Nunca ofrezcas descuentos mayores al 10%..."
          className="mt-1.5"
          rows={5}
        />
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
