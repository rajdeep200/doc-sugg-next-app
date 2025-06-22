import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function middleware(request) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value

    const protectedPaths = ['/', '/home']
    const publicPages = ['/login', '/register']

    // 🔐 Redirect unauthenticated users from protected routes
    if (protectedPaths.includes(pathname)) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            await jwtVerify(token, secret)
            return NextResponse.next()
        } catch (err) {
            console.error("JWT verification failed:", err)
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // 🚫 Redirect authenticated users away from login/register
    if (publicPages.includes(pathname) && token) {
        try {
            await jwtVerify(token, secret)
            return NextResponse.redirect(new URL('/home', request.url))
        } catch {
            return NextResponse.next()
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/home', '/login', '/register'],
}
