import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Team name is required'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        logo: {
            type: String,
            default: '',
        },
        captain: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        games: [
            {
                type: String,
            },
        ],
        socials: {
            discord: String,
            twitter: String,
            website: String,
        },
    },
    {
        timestamps: true,
    }
)

const Team = mongoose.model('Team', teamSchema)

export default Team
