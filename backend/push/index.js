// Install required packages:
// npm install web-push

const webpush = require('web-push');
const express = require('express');
const router = express.Router();

// Set VAPID keys (generate these with web-push)
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Store subscriptions (use database in production)
let subscriptions = [];

// Subscribe endpoint
router.post('/api/push/subscribe', (req, res) => {
  const subscription = req.body;
  
  // Add user ID or identifier if needed
  // subscription.userId = req.user.id;
  
  subscriptions.push(subscription);
  
  console.log('New subscription:', subscription.endpoint);
  res.status(201).json({ message: 'Subscription added' });
});

// Unsubscribe endpoint
router.post('/api/push/unsubscribe', (req, res) => {
  const { endpoint } = req.body;
  
  subscriptions = subscriptions.filter(sub => sub.endpoint !== endpoint);
  
  console.log('Subscription removed:', endpoint);
  res.status(200).json({ message: 'Subscription removed' });
});

// Send notification to specific user
const sendNotificationToUser = async (userId, payload) => {
  // Filter subscriptions by user ID
  const userSubscriptions = subscriptions.filter(sub => sub.userId === userId);
  
  const promises = userSubscriptions.map(subscription => {
    return webpush.sendNotification(subscription, JSON.stringify(payload))
      .catch(error => {
        console.error('Error sending notification:', error);
        // Remove invalid subscription
        if (error.statusCode === 410) {
          subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
        }
      });
  });
  
  await Promise.all(promises);
};

// Send notification to all users
const sendNotificationToAll = async (payload) => {
  const promises = subscriptions.map(subscription => {
    return webpush.sendNotification(subscription, JSON.stringify(payload))
      .catch(error => {
        console.error('Error sending notification:', error);
        if (error.statusCode === 410) {
          subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
        }
      });
  });
  
  await Promise.all(promises);
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