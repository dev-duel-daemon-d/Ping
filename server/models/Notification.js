import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['connection_request', 'connection_accepted', 'message'],
            required: true,
        },
        relatedId: {
            type: mongoose.Schema.Types.ObjectId, // Could be Connection ID or Message ID
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
