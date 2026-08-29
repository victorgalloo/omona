'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useIsSuperadmin() {
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from('profiles')
        .select('is_superadmin')
        .eq('id', session.user.id)
        .single();
      setIsSuperadmin(!!data?.is_superadmin);
    })();
  }, []);

  return isSuperadmin;
}
