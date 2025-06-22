import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function middleware(request) {
    const protectedPaths = ['/home', '/']
    const { pathname } = request.nextUrl

    if (!protectedPaths.includes(pathname)) {
        return NextResponse.next()
    }

    const token = request.cookies.get('token')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        const result = await jwtVerify(token, secret)
        return NextResponse.next()
    } catch (err) {
        console.error("ERROR ==>> ",err)
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/home'],
}
