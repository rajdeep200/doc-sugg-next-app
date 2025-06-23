export async function GET() {
    try {
        const res = await fetch(process.env.SOCKET_SERVER_PING_URL || 'https://your-sio-server.onrender.com/ping')
        const data = await res.json()

        console.log('✅ SIO ping response:', data)

        return new Response(JSON.stringify({ success: true, data }), { status: 200 })
    } catch (error) {
        console.error('❌ SIO ping failed:', error)
        return new Response(JSON.stringify({ success: false }), { status: 500 })
    }
}