
const express = require('express');
const router = express.Router();


const { 
    sendMessage, 
    getMessagesBySenderAndRecipient, 
    deleteMessage,
    getMessagesForUser,
    markAllMessagesAsRead, 
    getMessagesByUserId } = require('../controllers/message-controller.js'); // Import message controller functions

// Route to send a message
router.post('/MessageSend', sendMessage);

router.put('/user/messages/markAllAsRead', markAllMessagesAsRead);

// Route to get all messages between a specific sender and recipient
router.get('/Messages/:senderId/:recipientId', getMessagesBySenderAndRecipient);

// Route to get all messages associated with a specific user ID (sender or recipient)
router.get('/user/:userId', getMessagesByUserId);

router.get('/user/messages/unread/:userId', getMessagesForUser);

router.delete('/delete/:messageId', deleteMessage);

module.exports = router;

