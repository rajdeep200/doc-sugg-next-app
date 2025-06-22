import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AccessCode } from '@/models/AccessCode'
import { User } from '@/models/User'

function generateRandomCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

export async function POST(req) {
    try {
        const { adminUserId, count } = await req.json()
        await connectDB()

        const admin = await User.findById(adminUserId)
        console.log(admin)
        if (!admin || admin.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
        }

        const codes = []
        for (let i = 0; i < count; i++) {
            const code = generateRandomCode(8)
            codes.push({ code, owner: adminUserId })
        }

        const created = await AccessCode.insertMany(codes)
        return NextResponse.json({ message: 'AccessCode codes created', count: created.length })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}
