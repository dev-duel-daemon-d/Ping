import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Ensure uploads directory exists
const uploadDir = 'uploads'
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Not an image! Please upload only images.'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

// @route   POST /api/upload
// @desc    Upload an image
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' })
    }

    // In production, you would upload to Cloudinary/S3 here
    // For now, we return the local path (served via express.static)
    const filePath = `/uploads/${req.file.filename}`
    res.json({
        message: 'File uploaded successfully',
        url: filePath
    })
})

export default router
