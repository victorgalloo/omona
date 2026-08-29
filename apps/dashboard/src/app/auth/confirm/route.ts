import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/inbox';

  if (token_hash && type) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error && data.session) {
      // Pass tokens as query params (Brave strips URL hash fragments from server redirects)
      const redirectUrl = new URL('/auth/callback', request.url);
      if (next !== '/inbox') redirectUrl.searchParams.set('next', next);
      redirectUrl.searchParams.set('access_token', data.session.access_token);
      redirectUrl.searchParams.set('refresh_token', data.session.refresh_token);
      redirectUrl.searchParams.set('type', type);
      return NextResponse.redirect(redirectUrl);
    }

    if (!error) {
      // Verified but no session (e.g. email change) — go to login
      return NextResponse.redirect(new URL('/login?confirmed=true', request.url));
    }
  }

  return NextResponse.redirect(new URL('/login?error=confirmation_failed', request.url));
}
