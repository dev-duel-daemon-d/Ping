import express from 'express'
import Enchantment from '../models/Enchantment.js'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   POST /api/enchantments/:userId
// @desc    Toggle enchantment on a user (enchant or unenchant)
// @access  Private
router.post('/:userId', protect, async (req, res) => {
    try {
        const targetUserId = req.params.userId
        const enchanterId = req.user._id

        // Prevent self-enchantment
        if (targetUserId === enchanterId.toString()) {
            return res.status(400).json({ message: 'You cannot enchant yourself' })
        }

        // Check if target user exists
        const targetUser = await User.findById(targetUserId)
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Check if enchantment already exists
        const existingEnchantment = await Enchantment.findOne({
            enchanter: enchanterId,
            enchanted: targetUserId
        })

        let hasEnchanted = false
        let newCount = targetUser.enchantmentCount || 0

        if (existingEnchantment) {
            // Remove enchantment
            await Enchantment.findByIdAndDelete(existingEnchantment._id)
            newCount = Math.max(0, newCount - 1)
            await User.findByIdAndUpdate(targetUserId, { enchantmentCount: newCount })
            hasEnchanted = false
        } else {
            // Create enchantment
            await Enchantment.create({
                enchanter: enchanterId,
                enchanted: targetUserId
            })
            newCount = newCount + 1
            await User.findByIdAndUpdate(targetUserId, { enchantmentCount: newCount })
            hasEnchanted = true
        }

        // Emit socket event for real-time update
        const io = req.app.get('io')
        io.to(targetUserId.toString()).emit('enchantment:update', {
            userId: targetUserId,
            count: newCount
        })

        res.json({
            hasEnchanted,
            count: newCount,
            message: hasEnchanted ? 'User enchanted successfully' : 'Enchantment removed'
        })
    } catch (error) {
        console.error('Toggle enchantment error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   GET /api/enchantments/:userId/status
// @desc    Check if current user has enchanted target user
// @access  Private
router.get('/:userId/status', protect, async (req, res) => {
    try {
        const targetUserId = req.params.userId
        const enchanterId = req.user._id

        const enchantment = await Enchantment.findOne({
            enchanter: enchanterId,
            enchanted: targetUserId
        })

        const targetUser = await User.findById(targetUserId).select('enchantmentCount')

        res.json({
            hasEnchanted: !!enchantment,
            count: targetUser?.enchantmentCount || 0
        })
    } catch (error) {
        console.error('Get enchantment status error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   GET /api/enchantments/:userId/count
// @desc    Get enchantment count for a user
// @access  Public
router.get('/:userId/count', async (req, res) => {
    try {
        const targetUserId = req.params.userId

        const user = await User.findById(targetUserId).select('enchantmentCount')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.json({
            count: user.enchantmentCount || 0
        })
    } catch (error) {
        console.error('Get enchantment count error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
