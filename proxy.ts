import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 1. Get the token and role from Cookies
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('user-role')?.value
  
  const { pathname } = request.nextUrl

  // 2. Define Public Routes (don't protect these)
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/unauthorized'

  // 3. If no token and trying to access a protected route -> Redirect to Home
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 4. Role-Based Protection Logic
  if (token && role) {
    // Admin routes protection
    if (pathname.startsWith('/dashboard') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Pharmacist routes protection
    if (pathname.startsWith('/pharmacy') && role !== 'PHARMACIST') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Cashier routes protection
    if (pathname.startsWith('/casher') && role !== 'CASHIER') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// 5. Matcher: Apply this to all routes except system files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}