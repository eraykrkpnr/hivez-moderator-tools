// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    const sessionFlag = request.cookies.get('session-started');
    const authToken = request.cookies.get('auth-token');
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isApiRoute = request.nextUrl.pathname.startsWith('/api');

    if (isApiRoute) {
        return NextResponse.next();
    }

    // İlk ziyarette cookie'leri temizle
    if (!sessionFlag) {
        const response = NextResponse.next();
        response.cookies.delete('auth-token');
        response.cookies.set('session-started', 'true', {
            maxAge: 24 * 60 * 60 // 24 saat
        });
        return response;
    }

    // Normal auth kontrolü
    if (!authToken && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (authToken && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};