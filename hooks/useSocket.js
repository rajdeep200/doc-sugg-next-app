'use client'


import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useRouter } from 'next/navigation'


let socket


export function useSocket(userId) {
    const router = useRouter()


    useEffect(() => {
        if (!userId) return


        const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL
        console.log('env:', process.env.NEXT_PUBLIC_SOCKET_SERVER_URL)
        console.log("socketServerUrl :: ", socketServerUrl)


        socket = io(socketServerUrl, {
            query: { userId },
            autoConnect: true,
        })


        socket.on('forceLogout', () => {
            console.warn('You have been logged out from another device.')
            fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                router.push('/login')
            })
        })


        return () => {
            socket.off('forceLogout')
            socket.disconnect()
        }
    }, [userId])
}