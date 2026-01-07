import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: function() {
            return !this.media; // Content is required if no media is present
        }
    },
    media: {
        type: String, // URL to image/video
    },
    type: {
        type: String,
        enum: ['professional', 'casual'],
        default: 'casual'
    },
    game: {
        type: String, // Tag a game by name
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema]
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

export default Post;
