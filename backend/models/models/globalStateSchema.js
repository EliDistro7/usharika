const mongoose = require('mongoose');

const globalStateSchema = new mongoose.Schema({
    trendingTopics: [{
        topic: String,
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        popularity: {
            type: Number,
            default: 0
        }
    }],
    siteAnnouncements: [{
        title: String,
        content: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    systemMetrics: {
        totalUsers: {
            type: Number,
            default: 0
        },
        totalPosts: {
            type: Number,
            default: 0
        },
        activeUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        totalUsersToday: {
            type: Number,
            default: 0
        },
        postsToday: {
            type: Number,
            default: 0
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("GlobalState", globalStateSchema);
