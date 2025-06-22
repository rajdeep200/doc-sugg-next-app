'use client'

import PdfViewerWrapper from './PdfViewerWrapper'
import { useRouter } from 'next/navigation'
// import { getUserIdFromToken } from '../../utils/auth'
import { useSocket } from '../../hooks/useSocket'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

function getUserIdFromToken() {
    console.log("INSIDE getUserIdFromToken")
    const token = Cookies.get('token')
    console.log("document.cookie token :: ", token)

    // const token = document.cookie
    //     .split('; ')
    //     .find(row => row.startsWith('token='))?.split('=')[1]

    if (!token) return null

    try {
        const base64Payload = token.split('.')[1]
        const payload = JSON.parse(atob(base64Payload))
        return payload.userId
    } catch (err) {
        console.error('Invalid token', err)
        return null
    }
}

export default function HomePage() {
    const router = useRouter()
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        const uid = getUserIdFromToken()
        console.log("uid :: ", uid)
        setUserId(uid)
    }, [])

    console.log("Home userID :: ", userId)

    useSocket(userId)

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/login')
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* 🔓 Logout button */}
            <div className="w-full p-4 bg-white shadow flex justify-end">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>

            {/* 📄 PDF Viewer */}
            <div className="flex-grow">
                <PdfViewerWrapper />
            </div>
        </div>
    )
}
