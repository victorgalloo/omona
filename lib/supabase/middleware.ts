import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const { pathname } = request.nextUrl

  // Public routes — skip Supabase session refresh for performance
  const publicPrefixes = ['/api', '/demo', '/blog', '/comparativas', '/login']
  const isPublic = publicPrefixes.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`)
  )
  // Páginas de contenido público (landing, sitemap, robots, llms.txt) también
  // se sirven sin sesión: solo dashboard/onboarding requieren Supabase.
  const isContent =
    pathname === '/' ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/robots') ||
    pathname === '/llms.txt' ||
    pathname === '/llms.txt/'
  if (isPublic || isContent) {
    return response
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // Sin credenciales (preview local), dejar pasar: las rutas privadas
  // fallarán solas al usar la DB, pero el contenido público funciona.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes - redirect to login if not authenticated
  const protectedRoutes = ['/dashboard', '/onboarding']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // If trying to access protected route without auth, redirect to login
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  // If already authenticated and on landing or login, redirect to dashboard
  if ((pathname === '/' || pathname === '/login') && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}
