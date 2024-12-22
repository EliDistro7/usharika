
const mongoose = require('mongoose');

const chatListSchema = new mongoose.Schema({
    participants: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            name: {
                type: String,
                required: true,
            }
          
        },
    ],
    lastMessage: {
        content: {
            type: String,
            required: false,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
        },
        senderName: {
            type: String,
            required: false,
        },
      
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
});

module.exports = mongoose.model('ChatList', chatListSchema);
