import { initSocket } from '../../../lib/socketServer'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log('Starting Socket.IO server...')
        initSocket(res.socket.server)
    }
    res.end()
}
