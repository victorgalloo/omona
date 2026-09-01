'use client';

import { useEffect, useState, useCallback } from 'react';
import { Calendar, Clock, Phone, User, Mail, ChevronLeft, ChevronRight, Check, X, RotateCcw, Plus, FileText, Loader2 } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  customer_name: string | null;
  customer_phone: string;
  customer_email: string | null;
  scheduled_at: string;
  duration_min: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  notes: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: 'text-warning', bg: 'bg-yellow-500/10' },
  confirmed: { label: 'Confirmada', color: 'text-accent-green', bg: 'bg-accent-green/10' },
  cancelled: { label: 'Cancelada', color: 'text-error', bg: 'bg-error/10' },
  completed: { label: 'Completada', color: 'text-info', bg: 'bg-info/10' },
  no_show: { label: 'No asistio', color: 'text-muted', bg: 'bg-surface' },
};

function getWeekDates(offset: number): Date[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1 + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const weekDates = getWeekDates(weekOffset);
  const from = weekDates[0].toISOString();
  const to = new Date(weekDates[6].getTime() + 24 * 60 * 60 * 1000).toISOString();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: Appointment[] }>(`/api/calendar/appointments?from=${from}&to=${to}`);
      setAppointments(res.data);
    } catch {} finally { setLoading(false); }
  }, [from, to]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/api/calendar/appointments/${id}`, { status });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: status as Appointment['status'] } : a));
      toast.success('Cita actualizada');
    } catch { toast.error('Error al actualizar'); }
  };

  const weekLabel = `${weekDates[0].toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })} - ${weekDates[6].toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  const sorted = [...appointments].sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  const upcoming = sorted.filter(a => ['pending', 'confirmed'].includes(a.status));
  const past = sorted.filter(a => !['pending', 'confirmed'].includes(a.status));

  // Stats
  const totalWeek = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="flex h-full flex-col">
      <Header title="Calendario">
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Nueva cita
        </Button>
      </Header>

      <div className="flex-1 overflow-y-auto">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 px-4 pt-4 pb-2">
          <div className="border-t border-border p-3">
            <p className="text-[11px] text-muted uppercase tracking-wider">Esta semana</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{totalWeek}</p>
          </div>
          <div className="border-t border-border p-3">
            <p className="text-[11px] text-muted uppercase tracking-wider">Confirmadas</p>
            <p className="text-2xl font-bold text-accent-green mt-0.5">{confirmedCount}</p>
          </div>
          <div className="border-t border-border p-3">
            <p className="text-[11px] text-muted uppercase tracking-wider">Completadas</p>
            <p className="text-2xl font-bold text-info mt-0.5">{completedCount}</p>
          </div>
        </div>

        {/* Week nav */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
          <button onClick={() => setWeekOffset(w => w - 1)} className="rounded-full p-1.5 hover:bg-surface transition-colors">
            <ChevronLeft className="h-5 w-5 text-muted" />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{weekLabel}</p>
            {weekOffset !== 0 && (
              <button onClick={() => setWeekOffset(0)} className="text-[10px] text-accent-green hover:underline">Hoy</button>
            )}
          </div>
          <button onClick={() => setWeekOffset(w => w + 1)} className="rounded-full p-1.5 hover:bg-surface transition-colors">
            <ChevronRight className="h-5 w-5 text-muted" />
          </button>
        </div>

        {/* Appointments list */}
        <div className="p-4 space-y-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-surface" />)}
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-green/10 mb-4">
                <Calendar className="h-8 w-8 text-accent-green" />
              </div>
              <p className="text-[15px] font-semibold text-foreground mb-1">Sin citas esta semana</p>
              <p className="text-sm text-muted mb-4">Las citas agendadas por el bot o tu equipo apareceran aqui</p>
              <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                Agendar cita manual
              </Button>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold text-muted uppercase tracking-wider">Proximas ({upcoming.length})</h3>
                  <div className="space-y-2">
                    {upcoming.map(appt => <AppointmentCard key={appt.id} appt={appt} onStatusChange={updateStatus} />)}
                  </div>
                </div>
              )}
              {past.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold text-muted uppercase tracking-wider">Pasadas ({past.length})</h3>
                  <div className="space-y-2">
                    {past.map(appt => <AppointmentCard key={appt.id} appt={appt} onStatusChange={updateStatus} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* New appointment modal */}
      {showForm && (
        <NewAppointmentModal
          onClose={() => setShowForm(false)}
          onCreated={() => { setShowForm(false); fetchAppointments(); }}
        />
      )}
    </div>
  );
}

function AppointmentCard({ appt, onStatusChange }: { appt: Appointment; onStatusChange: (id: string, status: string) => void }) {
  const date = new Date(appt.scheduled_at);
  const config = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;
  const isPast = date < new Date();
  const isActive = ['pending', 'confirmed'].includes(appt.status);

  return (
    <div className="border-t border-border p-4 hover:border-border/80 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}>
              {config.label}
            </span>
            <span className="text-xs text-muted">{appt.duration_min} min</span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-3.5 w-3.5 text-accent-green shrink-0" />
            <span className="text-sm font-medium text-foreground">
              {date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3.5 w-3.5 text-muted shrink-0" />
            <span className="text-sm text-muted">
              {date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {appt.customer_name && (
              <div className="flex items-center gap-1 text-xs text-muted">
                <User className="h-3 w-3 shrink-0" /> {appt.customer_name}
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-muted">
              <Phone className="h-3 w-3 shrink-0" /> {appt.customer_phone}
            </div>
            {appt.customer_email && (
              <div className="flex items-center gap-1 text-xs text-muted">
                <Mail className="h-3 w-3 shrink-0" /> {appt.customer_email}
              </div>
            )}
          </div>

          {appt.notes && (
            <div className="flex items-start gap-1 mt-2 text-xs text-muted">
              <FileText className="h-3 w-3 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{appt.notes}</span>
            </div>
          )}
        </div>

        {isActive && (
          <div className="flex gap-1 ml-3 shrink-0">
            <button
              onClick={() => onStatusChange(appt.id, 'completed')}
              className="rounded-lg bg-accent-green/10 p-1.5 text-accent-green hover:bg-accent-green/20 transition-colors"
              title="Marcar completada"
            >
              <Check className="h-4 w-4" />
            </button>
            {isPast && (
              <button
                onClick={() => onStatusChange(appt.id, 'no_show')}
                className="rounded-lg bg-surface p-1.5 text-muted hover:bg-surface-2 transition-colors"
                title="No asistio"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onStatusChange(appt.id, 'cancelled')}
              className="rounded-lg bg-error/10 p-1.5 text-error hover:bg-error/20 transition-colors"
              title="Cancelar cita"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NewAppointmentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    date: '',
    time: '',
    duration_min: 30,
    notes: '',
  });

  // Default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setForm(f => ({ ...f, date: tomorrow.toISOString().split('T')[0], time: '10:00' }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_phone || !form.date || !form.time) {
      toast.error('Telefono, fecha y hora son requeridos');
      return;
    }

    setSaving(true);
    try {
      const scheduled_at = new Date(`${form.date}T${form.time}:00`).toISOString();
      await api.post('/api/calendar/appointments', {
        customer_name: form.customer_name || null,
        customer_phone: form.customer_phone.startsWith('+') ? form.customer_phone : `+${form.customer_phone}`,
        customer_email: form.customer_email || null,
        scheduled_at,
        duration_min: form.duration_min,
        notes: form.notes || null,
      });
      toast.success('Cita creada. Se envio email de confirmacion.');
      onCreated();
    } catch (err: any) {
      toast.error(err.message || 'Error al crear cita');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md border-t border-border p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Nueva cita</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-muted hover:text-foreground hover:bg-surface transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Nombre</label>
              <input
                type="text"
                value={form.customer_name}
                onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                placeholder="Juan Perez"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:border-accent-green focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Telefono *</label>
              <input
                type="tel"
                value={form.customer_phone}
                onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                placeholder="+521234567890"
                required
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:border-accent-green focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">Email (para confirmacion)</label>
            <input
              type="email"
              value={form.customer_email}
              onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))}
              placeholder="cliente@email.com"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:border-accent-green focus:outline-none"
            />
          </div>

          {/* Date & time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-medium text-muted mb-1">Fecha *</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent-green focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Hora *</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                required
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent-green focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Duracion</label>
              <select
                value={form.duration_min}
                onChange={e => setForm(f => ({ ...f, duration_min: Number(e.target.value) }))}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent-green focus:outline-none"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hora</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">Notas</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Detalles de la cita..."
              rows={2}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:border-accent-green focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="flex-1" disabled={saving}>
              {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Calendar className="mr-1.5 h-4 w-4" />}
              Agendar cita
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
