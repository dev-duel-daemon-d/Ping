import express from 'express'
import User from '../models/User.js'
import { protect, generateToken } from '../middleware/auth.js'

const router = express.Router()

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] })
        if (userExists) {
            return res.status(400).json({
                message: userExists.email === email
                    ? 'Email already registered'
                    : 'Username already taken'
            })
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
        })

        // Generate token and respond
        const token = generateToken(user._id)

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                status: user.status,
                lastSeen: user.lastSeen,
            },
        })
    } catch (error) {
        console.error('Register error:', error)
        res.status(500).json({ message: 'Server error during registration' })
    }
})

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        // Check password
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        // Update status to online
        user.status = 'online'
        user.lastSeen = new Date()
        await user.save()

        // Generate token and respond
        const token = generateToken(user._id)

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                status: user.status,
                lastSeen: user.lastSeen,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Server error during login' })
    }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                avatar: req.user.avatar,
                status: req.user.status,
            },
        })
    } catch (error) {
        console.error('Get user error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   POST /api/auth/logout
// @desc    Logout user (update status)
// @access  Private
router.post('/logout', protect, async (req, res) => {
    try {
        req.user.status = 'offline'
        req.user.lastSeen = new Date()
        await req.user.save()

        res.json({ message: 'Logged out successfully' })
    } catch (error) {
        console.error('Logout error:', error)
        res.status(500).json({ message: 'Server error during logout' })
    }
})

export default router
