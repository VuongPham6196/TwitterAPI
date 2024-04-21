import { Server as HttpSever } from 'http'

import { Server } from 'socket.io'
import { verifyAuthorization } from '~/middlewares/users.schemas'
import { IChatUserInfo } from '..'
import messageServices from '~/services/conversation.services'
import Constants from '~/constants/constants'

const connectedSockets = new Map<string, { userInfo: IChatUserInfo; socket_id: string }>()

const createIOSocket = (httpServer: HttpSever) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })

  io.use(async (socket, next) => {
    try {
      const { authorization } = socket.handshake.auth
      await verifyAuthorization({ value: authorization })
      next()
    } catch (error) {
      next({
        message: Constants.MESSAGES.GENERAL_MESSAGE.UNAUTHORIZED,
        name: Constants.MESSAGES.GENERAL_MESSAGE.UNAUTHORIZED,
        data: error
      })
      socket.disconnect()
    }
  })

  io.on('connection', (socket) => {
    console.log('connected')
    const userInfo = socket.handshake.auth.userInfo as IChatUserInfo
    connectedSockets.set(userInfo.userId, { userInfo, socket_id: socket.id })
    io.emit('user-online', { users: Array.from(connectedSockets.values()) })

    socket.use(async (packet, next) => {
      try {
        const { authorization } = socket.handshake.auth
        await verifyAuthorization({ value: authorization })
        next()
      } catch (error) {
        socket.emit('unauthorized')
        socket.disconnect()
      }
    })

    socket.on('message', async (message) => {
      const newMessage = await messageServices.createMessage(message)
      const toSocketId = connectedSockets.get(message.to)?.socket_id
      if (toSocketId) {
        const toSocket = io.sockets.sockets.get(toSocketId)
        if (toSocket) {
          toSocket.emit('message-new', { message: newMessage })
        }
      }
    })

    socket.on('disconnect', () => {
      connectedSockets.delete(userInfo.userId)
      io.emit('user-online', { users: Array.from(connectedSockets.values()) })
      console.log(`User ${socket.handshake.auth.userInfo.userId} disconnected`)
    })
  })
}

export default createIOSocket
