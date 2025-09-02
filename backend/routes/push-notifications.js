//routes/push-notifications.js
// Backend route for managing push notifications using web-push and MongoDB

const dotenv = require("dotenv");

dotenv.config();

const webpush = require('web-push');
const express = require('express');
const router = express.Router();

// Set VAPID keys (generate these with web-push)
webpush.setVapidDetails(
  'mailto:elidistro@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// MongoDB model for push subscriptions
const mongoose = require('mongoose');

const PushSubscriptionSchema = new mongoose.Schema({
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true }
  },
  userId: { type: String }, // Optional: link to user account
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date, default: Date.now }
});

const PushSubscription = mongoose.model('PushSubscription', PushSubscriptionSchema);

// Subscribe endpoint
router.post('/api/push/subscribe', async (req, res) => {
  try {
    const subscriptionData = req.body;
    
    // Add user ID if available (from authentication middleware)
    // subscriptionData.userId = req.user?.id;
    
    // Save or update subscription in MongoDB
    await PushSubscription.findOneAndUpdate(
      { endpoint: subscriptionData.endpoint },
      { 
        ...subscriptionData,
        lastUsed: new Date()
      },
      { upsert: true, new: true }
    );
    
    console.log('Subscription saved to database:', subscriptionData.endpoint);
    res.status(201).json({ message: 'Subscription added' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

// Unsubscribe endpoint
router.post('/api/push/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    
    await PushSubscription.deleteOne({ endpoint });
    
    console.log('Subscription removed from database:', endpoint);
    res.status(200).json({ message: 'Subscription removed' });
  } catch (error) {
    console.error('Error removing subscription:', error);
    res.status(500).json({ error: 'Failed to remove subscription' });
  }
});

// Send notification to specific user
const sendNotificationToUser = async (userId, payload) => {
  try {
    // Get subscriptions for specific user from MongoDB
    const userSubscriptions = await PushSubscription.find({ userId });
    
    const promises = userSubscriptions.map(subscription => {
      return webpush.sendNotification(subscription, JSON.stringify(payload))
        .catch(async (error) => {
          console.error('Error sending notification:', error);
          // Remove invalid subscription from database
          if (error.statusCode === 410) {
            await PushSubscription.deleteOne({ endpoint: subscription.endpoint });
            console.log('Removed invalid subscription:', subscription.endpoint);
          }
        });
    });
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Error in sendNotificationToUser:', error);
  }
};

// Send notification to all users
const sendNotificationToAll = async (payload) => {
  try {
    // Get all subscriptions from MongoDB
    const allSubscriptions = await PushSubscription.find({});
    
    const promises = allSubscriptions.map(subscription => {
      return webpush.sendNotification(subscription, JSON.stringify(payload))
        .catch(async (error) => {
          console.error('Error sending notification:', error);
          // Remove invalid subscription from database
          if (error.statusCode === 410) {
            await PushSubscription.deleteOne({ endpoint: subscription.endpoint });
            console.log('Removed invalid subscription:', subscription.endpoint);
          }
        });
    });
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Error in sendNotificationToAll:', error);
  }
};

// Example endpoint to trigger notifications
router.post('/api/push/send', async (req, res) => {
  const { title, body, userId, data } = req.body;
  
  const payload = {
    title,
    body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data || {}
  };
  
  try {
    if (userId) {
      await sendNotificationToUser(userId, payload);
    } else {
      await sendNotificationToAll(payload);
    }
    
    res.status(200).json({ message: 'Notification sent' });
  } catch (error) {
    console.error('Failed to send notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = { 
  router, 
  sendNotificationToUser, 
  sendNotificationToAll 
};