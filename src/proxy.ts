import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register', '/api/auth']

export function proxy(request: NextRequest) {
  // Bypass login for now
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|public).*)'],
}
