'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface AvailabilityRule {
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_min: number;
  is_active: boolean;
}

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const DEFAULT_RULES: AvailabilityRule[] = [
  { day_of_week: 1, start_time: '09:00', end_time: '18:00', slot_duration_min: 30, is_active: true },
  { day_of_week: 2, start_time: '09:00', end_time: '18:00', slot_duration_min: 30, is_active: true },
  { day_of_week: 3, start_time: '09:00', end_time: '18:00', slot_duration_min: 30, is_active: true },
  { day_of_week: 4, start_time: '09:00', end_time: '18:00', slot_duration_min: 30, is_active: true },
  { day_of_week: 5, start_time: '09:00', end_time: '18:00', slot_duration_min: 30, is_active: true },
  { day_of_week: 6, start_time: '10:00', end_time: '14:00', slot_duration_min: 30, is_active: false },
  { day_of_week: 0, start_time: '10:00', end_time: '14:00', slot_duration_min: 30, is_active: false },
];

export function CalendarSettings() {
  const [rules, setRules] = useState<AvailabilityRule[]>(DEFAULT_RULES);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slotDuration, setSlotDuration] = useState(30);

  useEffect(() => {
    api.get<{ data: AvailabilityRule[] }>('/api/calendar/availability')
      .then(res => {
        if (res.data.length > 0) {
          // Merge with defaults for any missing days
          const merged = DEFAULT_RULES.map(def => {
            const existing = res.data.find(r => r.day_of_week === def.day_of_week);
            return existing || def;
          });
          setRules(merged);
          setSlotDuration(res.data[0]?.slot_duration_min || 30);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleDay = (dayOfWeek: number) => {
    setRules(prev => prev.map(r =>
      r.day_of_week === dayOfWeek ? { ...r, is_active: !r.is_active } : r
    ));
  };

  const updateTime = (dayOfWeek: number, field: 'start_time' | 'end_time', value: string) => {
    setRules(prev => prev.map(r =>
      r.day_of_week === dayOfWeek ? { ...r, [field]: value } : r
    ));
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const rulesWithDuration = rules.map(r => ({ ...r, slot_duration_min: slotDuration }));
      await api.put('/api/calendar/availability', { rules: rulesWithDuration });
      toast.success('Horarios guardados');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  }, [rules, slotDuration]);

  // Reorder: Mon-Sun
  const ordered = [1, 2, 3, 4, 5, 6, 0].map(d => rules.find(r => r.day_of_week === d)!);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-surface p-2">
          <Calendar className="h-5 w-5 text-accent-green" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Disponibilidad para citas</h3>
          <p className="text-xs text-muted mt-0.5">
            Configura los horarios en que tu equipo puede atender demos y reuniones. El bot de IA ofrecerá estos horarios automáticamente.
          </p>
        </div>
      </div>

      {/* Slot duration */}
      <div className="flex items-center gap-3">
        <Clock className="h-4 w-4 text-muted" />
        <span className="text-sm text-foreground">Duración de cada cita:</span>
        <select
          value={slotDuration}
          onChange={e => setSlotDuration(Number(e.target.value))}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        >
          <option value={15}>15 min</option>
          <option value={30}>30 min</option>
          <option value={45}>45 min</option>
          <option value={60}>1 hora</option>
        </select>
      </div>

      {/* Days grid */}
      <div className="space-y-2">
        {ordered.map(rule => (
          <div
            key={rule.day_of_week}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
              rule.is_active ? 'border-accent-green/30 bg-accent-green/5' : 'border-border bg-surface'
            }`}
          >
            {/* Toggle */}
            <button
              onClick={() => toggleDay(rule.day_of_week)}
              className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                rule.is_active ? 'bg-accent-green' : 'bg-gray-300'
              }`}
            >
              <div className={`h-4 w-4 rounded-full bg-background transition-transform ${
                rule.is_active ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>

            {/* Day name */}
            <span className={`w-24 text-sm font-medium ${rule.is_active ? 'text-foreground' : 'text-muted'}`}>
              {DAY_NAMES[rule.day_of_week]}
            </span>

            {/* Time inputs */}
            {rule.is_active ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={rule.start_time}
                  onChange={e => updateTime(rule.day_of_week, 'start_time', e.target.value)}
                  className="rounded-md border border-border px-2 py-1 text-sm"
                />
                <span className="text-xs text-muted">a</span>
                <input
                  type="time"
                  value={rule.end_time}
                  onChange={e => updateTime(rule.day_of_week, 'end_time', e.target.value)}
                  className="rounded-md border border-border px-2 py-1 text-sm"
                />
              </div>
            ) : (
              <span className="text-xs text-muted">No disponible</span>
            )}
          </div>
        ))}
      </div>

      <Button onClick={handleSave} disabled={saving} size="sm">
        {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
        Guardar horarios
      </Button>
    </div>
  );
}
