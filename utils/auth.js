export function getUserIdFromToken() {
    if (typeof document === 'undefined') return null

    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))?.split('=')[1]

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
