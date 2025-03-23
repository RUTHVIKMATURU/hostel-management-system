const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    postedBy: {
        rollNumber: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        enum: ['general', 'missing item', 'interchanged clothes'],
        default: 'general'
    }
}, { timestamps: true });

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

module.exports = CommunityPost;
