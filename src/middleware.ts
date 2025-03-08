import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/lib/auth';

export function middleware(request: NextRequest) {
  // Admin sayfalarını kontrol et
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.includes('/login')) {
    // Admin email'ini cookie'den kontrol et
    const adminEmail = request.cookies.get('adminEmail');
    
    if (!adminEmail) {
      // Admin girişi yapılmamışsa login sayfasına yönlendir
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Admin sayfalarını kontrol et
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;

    // Login sayfası için özel kontrol
    if (request.nextUrl.pathname === '/admin/login') {
      // Eğer token varsa ve geçerliyse, kullanıcıyı dashboard'a yönlendir
      if (token) {
        try {
          const payload = verifyToken(token);
          if (payload.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
          }
        } catch {
          // Token geçersizse devam et
        }
      }
      return NextResponse.next();
    }

    // Diğer admin sayfaları için token kontrolü
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const payload = verifyToken(token);
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
}; 