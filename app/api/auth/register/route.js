import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '../../../../lib/db'
import { User } from '../../../../models/User'
import { AccessCode } from '../../../../models/AccessCode'

export async function POST(req) {
    try {
        const { name, email, password, accessCode } = await req.json()
        await connectDB()

        if (!password || password.length < 6) {
            return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 })
        }

        // admin creds
        // id: 685702791106a5379e9556b4
        // "email": "admin@gmail.com",
        // "password": "admin@1234",

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 })
        }

        const codeDoc = await AccessCode.findOne({ code: accessCode, usedBy: null })
        if (!codeDoc) {
            return NextResponse.json({ message: 'Invalid or already used access code' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ name, email, password: hashedPassword, accessCodeUsed: codeDoc._id })

        codeDoc.usedBy = newUser._id
        await codeDoc.save()

        return NextResponse.json({ message: 'User registered', userId: newUser._id })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
    }
}
