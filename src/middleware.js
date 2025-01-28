import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define public paths and protected paths
  const publicPaths = ['/auth/login', '/auth/register', '/'];
  const isPublicPath = publicPaths.includes(pathname);
  const isInvitePath = pathname.startsWith('/invite');
  const isProtectedPath = pathname.startsWith('/workspace');

  // Special handling for invite paths
  if (isInvitePath) {
    if (!token) {
      // If no token on invite path, redirect to login with invite code
      const inviteCode = pathname.split('/').pop();
      return NextResponse.redirect(new URL(`/auth/login?invite=${inviteCode}`, request.url));
    }
    // If has token, allow access to invite path
    return NextResponse.next();
  }

  // If there's a token and trying to access public paths, redirect to workspace
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  // If no token and trying to access protected paths, redirect to login
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/workspace/:path*',
    '/invite/:path*'  // Add invite paths to the matcher
  ]
};