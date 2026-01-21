import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    let user = null;

    if (token) {
        user = await verifyToken(token);
    }

    // Protected customer routes (checkout, orders)
    if (pathname.startsWith('/checkout') || pathname.startsWith('/orders')) {
        if (!user) {
            const url = new URL('/login', request.url);
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
    }

    // Protected admin routes
    if (pathname.startsWith('/admin')) {
        // Allow access to admin login page
        if (pathname === '/admin/login') {
            // If already logged in as admin, redirect to dashboard
            if (user?.role === 'admin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.next();
        }

        // For all other admin routes, require admin authentication
        if (!user || user.role !== 'admin') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/checkout/:path*',
        '/orders/:path*',
        '/admin/:path*',
    ],
};
