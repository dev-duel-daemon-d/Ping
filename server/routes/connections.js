import express from 'express'
import Connection from '../models/Connection.js'
import Notification from '../models/Notification.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   POST /api/connections/request/:userId
// @desc    Send a connection request
// @access  Private
router.post('/request/:userId', protect, async (req, res) => {
    try {
        const recipientId = req.params.userId
        const requesterId = req.user._id

        if (recipientId === requesterId.toString()) {
            return res.status(400).json({ message: 'You cannot connect with yourself' })
        }

        // Check if connection already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        })

        if (existingConnection) {
            return res.status(400).json({ message: 'Connection or request already exists' })
        }

        const connection = await Connection.create({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        })

        // Create notification
        const notification = await Notification.create({
            recipient: recipientId,
            sender: requesterId,
            type: 'connection_request',
            relatedId: connection._id
        })

        // Emit notification via socket
        const io = req.app.get('io')
        io.to(recipientId.toString()).emit('notification:new', {
            ...notification.toObject(),
            sender: {
                _id: req.user._id,
                username: req.user.username,
                avatar: req.user.avatar
            }
        })

        res.status(201).json(connection)
    } catch (error) {
        console.error('Connection request error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   PUT /api/connections/accept/:requestId
// @desc    Accept a connection request
// @access  Private
router.put('/accept/:requestId', protect, async (req, res) => {
    try {
        const connection = await Connection.findById(req.params.requestId)

        if (!connection) {
            return res.status(404).json({ message: 'Request not found' })
        }

        if (connection.recipient.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to accept this request' })
        }

        connection.status = 'accepted'
        await connection.save()

        // Create notification for the requester
        const notification = await Notification.create({
            recipient: connection.requester,
            sender: req.user._id,
            type: 'connection_accepted',
            relatedId: connection._id
        })

        // Emit notification via socket
        const io = req.app.get('io')
        io.to(connection.requester.toString()).emit('notification:new', {
            ...notification.toObject(),
            sender: {
                _id: req.user._id,
                username: req.user.username,
                avatar: req.user.avatar
            }
        })

        res.json({ message: 'Connection accepted', connection })
    } catch (error) {
        console.error('Accept connection error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   GET /api/connections
// @desc    Get all accepted connections
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const targetUserId = req.query.userId || req.user._id

        const connections = await Connection.find({
            $or: [
                { requester: targetUserId, status: 'accepted' },
                { recipient: targetUserId, status: 'accepted' }
            ]
        }).populate('requester recipient', 'username avatar bio status')

        const friends = connections.map(conn => {
            return conn.requester._id.toString() === targetUserId.toString()
                ? conn.recipient
                : conn.requester
        })

        res.json(friends)
    } catch (error) {
        console.error('Get connections error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   GET /api/connections/pending
// @desc    Get pending connection requests
// @access  Private
router.get('/pending', protect, async (req, res) => {
    try {
        const requests = await Connection.find({
            recipient: req.user._id,
            status: 'pending'
        }).populate('requester', 'username avatar bio status')

        res.json(requests)
    } catch (error) {
        console.error('Get pending requests error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
