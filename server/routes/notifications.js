import express from 'express'
import Notification from '../models/Notification.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/notifications
// @desc    Get all notifications for current user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .populate('sender', 'username avatar')
            .limit(50)

        res.json(notifications)
    } catch (error) {
        console.error('Get notifications error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id)
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' })
        }
        if (notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' })
        }

        notification.isRead = true
        await notification.save()
        res.json(notification)
    } catch (error) {
        console.error('Mark notification read error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protect, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        )
        res.json({ message: 'All notifications marked as read' })
    } catch (error) {
        console.error('Read all notifications error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
