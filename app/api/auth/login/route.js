import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '../../../../lib/db'
import { User } from '../../../../models/User'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export async function POST(req) {
    try {
        const { email, password } = await req.json()
        await connectDB()

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' })

        cookies().set('token', token, {
            httpOnly: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24,
        })

        return NextResponse.json({ message: 'Login successful' })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
    }
}
