import express from 'express'
import crypto from 'crypto'
import { body } from 'express-validator'
import User from '../models/User.js'
import { protect, generateToken } from '../middleware/auth.js'
import { validate } from '../middleware/validator.js'

const router = express.Router()

const userResponse = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bannerImage: user.bannerImage,
    bio: user.bio,
    location: user.location,
    skills: user.skills,
    gamingAccounts: user.gamingAccounts,
    status: user.status,
    lastSeen: user.lastSeen,
})

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
    '/register',
    [
        body('username')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters')
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('Username can only contain letters, numbers, and underscores'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        validate,
    ],
    async (req, res) => {
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
                user: userResponse(user),
            })
        } catch (error) {
            console.error('Register error:', error)
            res.status(500).json({ message: 'Server error during registration' })
        }
    }
)

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
        validate,
    ],
    async (req, res) => {
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
                user: userResponse(user),
            })
        } catch (error) {
            console.error('Login error:', error)
            res.status(500).json({ message: 'Server error during login' })
        }
    }
)

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        res.json({
            user: userResponse(req.user),
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

// @route   POST /api/auth/forgotpassword
// @desc    Forgot password
// @access  Public
router.post('/forgotpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken()

        await user.save({ validateBeforeSave: false })

        // Create reset url
        // In production, this would be the frontend URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`
        
        // For development, we'll log it. In production, send via email
        console.log(`Password Reset URL: ${resetUrl}`)

        res.status(200).json({ success: true, data: 'Email sent' })
    } catch (error) {
        console.error('Forgot password error:', error)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        res.status(500).json({ message: 'Email could not be sent' })
    }
})

// @route   PUT /api/auth/resetpassword/:resettoken
// @desc    Reset password
// @access  Public
router.put('/resetpassword/:resettoken', async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex')

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        })

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' })
        }

        // Set new password
        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        // Generate new token
        const token = generateToken(user._id)

        res.status(200).json({
            success: true,
            token,
            user: userResponse(user),
        })
    } catch (error) {
        console.error('Reset password error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
