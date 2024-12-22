const mongoose = require('mongoose');

const readerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        firstName: String,
        lastName: String,
        bio: String,
        avatarUrl: String
    },
    favoritePosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    role: {
        type: String,
        default: "Reader"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Reader", readerSchema);
