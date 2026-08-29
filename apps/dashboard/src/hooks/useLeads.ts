'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

interface Lead {
  id: string;
  organization_id: string;
  conversation_id: string | null;
  phone_number: string;
  name: string | null;
  email: string | null;
  company: string | null;
  company_size: string | null;
  budget: string | null;
  timeline: string | null;
  interest: string | null;
  pain_points: string | null;
  score: number;
  status: 'new' | 'qualified' | 'contacted' | 'demo_scheduled' | 'converted' | 'lost';
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  data: Lead[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export function useLeads(statusFilter?: string, search?: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await api.get<PaginatedResponse>(`/api/leads${query}`);
      setLeads(res.data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeads]);

  const updateLead = useCallback(async (id: string, data: Partial<Lead>) => {
    await api.patch(`/api/leads/${id}`, data);
    await fetchLeads();
  }, [fetchLeads]);

  return { leads, loading, refetch: fetchLeads, updateLead };
}
