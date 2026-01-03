import express from 'express'
import Message from '../models/Message.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/messages/history/:userId
// @desc    Get chat history with a specific user
// @access  Private
router.get('/history/:userId', protect, async (req, res) => {
    try {
        const otherUserId = req.params.userId
        const currentUserId = req.user._id

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, recipient: otherUserId },
                { sender: otherUserId, recipient: currentUserId }
            ]
        })
        .sort({ createdAt: 1 })
        .populate('sender recipient', 'username avatar')

        res.json(messages)
    } catch (error) {
        console.error('Get history error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   GET /api/messages/conversations
// @desc    Get list of users the current user has chatted with
// @access  Private
router.get('/conversations', protect, async (req, res) => {
    try {
        const currentUserId = req.user._id

        // Find all unique users the current user has exchanged messages with
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { recipient: currentUserId }]
        })
        .sort({ createdAt: -1 })
        .populate('sender recipient', 'username avatar status')

        const conversationsMap = new Map()

        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === currentUserId.toString()
                ? msg.recipient
                : msg.sender
            
            if (!conversationsMap.has(otherUser._id.toString())) {
                conversationsMap.set(otherUser._id.toString(), {
                    user: otherUser,
                    lastMessage: msg.content,
                    createdAt: msg.createdAt,
                    unread: !msg.readStatus && msg.recipient._id.toString() === currentUserId.toString()
                })
            }
        })

        res.json(Array.from(conversationsMap.values()))
    } catch (error) {
        console.error('Get conversations error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   PUT /api/messages/read/:senderId
// @desc    Mark all messages from a user as read
// @access  Private
router.put('/read/:senderId', protect, async (req, res) => {
    try {
        await Message.updateMany(
            { sender: req.params.senderId, recipient: req.user._id, readStatus: false },
            { readStatus: true }
        )
        res.json({ message: 'Messages marked as read' })
    } catch (error) {
        console.error('Mark read error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
