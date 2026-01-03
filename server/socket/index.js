import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Message from '../models/Message.js'
import Notification from '../models/Notification.js'

// Store connected users
const connectedUsers = new Map()

export const initSocket = (io) => {
    // Authentication middleware for socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token

            if (!token) {
                return next(new Error('Authentication error: No token provided'))
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key')
            const user = await User.findById(decoded.id).select('-password')

            if (!user) {
                return next(new Error('Authentication error: User not found'))
            }

            socket.user = user
            next()
        } catch (error) {
            console.error('Socket auth error:', error)
            next(new Error('Authentication error: Invalid token'))
        }
    })

    io.on('connection', async (socket) => {
        console.log(`🔌 User connected: ${socket.user.username} (${socket.id})`)

        // Add user to connected users
        connectedUsers.set(socket.user._id.toString(), {
            socketId: socket.id,
            user: socket.user,
        })

        // Update user status to online
        try {
            await User.findByIdAndUpdate(socket.user._id, {
                status: 'online',
                lastSeen: new Date(),
            })
        } catch (error) {
            console.error('Error updating user status:', error)
        }

        // Broadcast user online status
        socket.broadcast.emit('user:online', {
            userId: socket.user._id,
            username: socket.user.username,
        })

        // Join user to their own room for private messages
        socket.join(socket.user._id.toString())

        // Handle private messages
        socket.on('message:private', async (data) => {
            try {
                const { recipientId, content } = data

                // Save message to database
                const newMessage = await Message.create({
                    sender: socket.user._id,
                    recipient: recipientId,
                    content,
                })

                                const recipient = connectedUsers.get(recipientId)

                                if (recipient) {

                                    io.to(recipient.socketId).emit('message:receive', {

                                        _id: newMessage._id,

                                        senderId: socket.user._id,

                                        senderName: socket.user.username,

                                        content: newMessage.content,

                                        createdAt: newMessage.createdAt,

                                    })

                                }

                

                                // Create notification for the recipient

                                const notification = await Notification.create({

                                    recipient: recipientId,

                                    sender: socket.user._id,

                                    type: 'message',

                                    relatedId: newMessage._id

                                })

                

                                // Emit notification

                                io.to(recipientId).emit('notification:new', {

                                    ...notification.toObject(),

                                    sender: {

                                        _id: socket.user._id,

                                        username: socket.user.username,

                                        avatar: socket.user.avatar

                                    }

                                })

                                

                                // Also send back the created message to the sender to confirm save and provide ID/timestamp
                socket.emit('message:sent', {
                    _id: newMessage._id,
                    recipientId,
                    content: newMessage.content,
                    createdAt: newMessage.createdAt,
                })

            } catch (error) {
                console.error('Error handling private message:', error)
                socket.emit('error', { message: 'Failed to send message' })
            }
        })

        // Handle typing indicator
        socket.on('typing:start', (data) => {
            const { recipientId } = data
            const recipient = connectedUsers.get(recipientId)
            if (recipient) {
                io.to(recipient.socketId).emit('typing:indicator', {
                    userId: socket.user._id,
                    username: socket.user.username,
                    isTyping: true,
                })
            }
        })

        socket.on('typing:stop', (data) => {
            const { recipientId } = data
            const recipient = connectedUsers.get(recipientId)
            if (recipient) {
                io.to(recipient.socketId).emit('typing:indicator', {
                    userId: socket.user._id,
                    username: socket.user.username,
                    isTyping: false,
                })
            }
        })

        // Handle disconnect
        socket.on('disconnect', async () => {
            console.log(`👋 User disconnected: ${socket.user.username}`)

            // Remove from connected users
            connectedUsers.delete(socket.user._id.toString())

            // Update user status to offline
            try {
                await User.findByIdAndUpdate(socket.user._id, {
                    status: 'offline',
                    lastSeen: new Date(),
                })
            } catch (error) {
                console.error('Error updating user status on disconnect:', error)
            }

            // Broadcast user offline status
            socket.broadcast.emit('user:offline', {
                userId: socket.user._id,
                username: socket.user.username,
            })
        })
    })

    return io
}

export const getConnectedUsers = () => connectedUsers

export default { initSocket, getConnectedUsers }
