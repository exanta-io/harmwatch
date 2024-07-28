import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUserHash = request.cookies.get('currentUserHash')?.value;

  let is_authenticated = false;

  if (currentUserHash === process.env.NEXT_PUBLIC_HASH) {
    is_authenticated = true;
  }

  // Redirect authenticated users trying to access non-conversation paths to /conversations
  if (is_authenticated && !request.nextUrl.pathname.startsWith('/conversations')) {
    return NextResponse.redirect(new URL('/conversations', request.url));
  }

  // Redirect unauthenticated users trying to access paths other than / and /login to /login
  if (!is_authenticated && !['/', '/login'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow requests to proceed if they don't match the above conditions
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
