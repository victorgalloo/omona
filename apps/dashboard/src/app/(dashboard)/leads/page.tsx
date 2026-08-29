'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Download, LayoutGrid, Table2 } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { LeadTable } from '@/components/leads/LeadTable';
import { useLeads } from '@/hooks/useLeads';
import { Select, SelectItem } from '@/components/ui/select';
import { downloadCSV } from '@/lib/api';

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'new', label: 'Nuevos' },
  { value: 'qualified', label: 'Calificados' },
  { value: 'contacted', label: 'Contactados' },
  { value: 'demo_scheduled', label: 'Demo agendada' },
  { value: 'converted', label: 'Convertidos' },
  { value: 'lost', label: 'Perdidos' },
];

export default function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);
  const { leads, loading, updateLead } = useLeads(statusFilter, search);

  async function handleExport() {
    setExporting(true);
    try {
      await downloadCSV('/api/leads/export', 'leads.csv');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Leads">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5">
          <span className="flex h-7 items-center gap-1 rounded-md bg-accent-green/10 px-2 text-xs font-medium text-accent-green">
            <Table2 className="h-3.5 w-3.5" /> Tabla
          </span>
          <Link href="/leads/pipeline" className="flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted hover:bg-surface">
            <LayoutGrid className="h-3.5 w-3.5" /> Pipeline
          </Link>
        </div>
      </Header>

      {/* Filters — below header on mobile */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-4 md:px-6 py-3 border-b border-border bg-background">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 flex-1">
          <Search className="h-4 w-4 text-muted shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar lead..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none w-full"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="w-full sm:w-40"
        >
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </Select>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          {exporting ? 'Exportando...' : 'Exportar CSV'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-background p-4 animate-pulse">
                <div className="h-4 w-1/4 rounded bg-surface-2" />
                <div className="h-4 w-1/6 rounded bg-surface-2" />
                <div className="h-4 w-1/5 rounded bg-surface-2" />
                <div className="h-6 w-20 rounded-full bg-surface-2 ml-auto" />
              </div>
            ))}
          </div>
        ) : (
          <LeadTable
            leads={leads}
            onStatusChange={(id, status) => updateLead(id, { status: status as never })}
          />
        )}
      </div>
    </div>
  );
}
