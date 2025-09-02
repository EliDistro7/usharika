// socket/events/pushNotificationEvents.js
const { sendNotificationToUser, sendNotificationToAll } = require("../../routes/push-notifications.js");

module.exports = function pushNotificationEvents(io, socket, userSockets) {
  
  // Helper function to check if user is online
  const isUserOnline = (userId) => {
    return userSockets[userId] !== undefined;
  };

  // Send push notification only if user is offline
  const sendPushIfOffline = async (userId, payload) => {
    if (!isUserOnline(userId)) {
      console.log(`📱 User ${userId} is offline, sending push notification`);
      await sendNotificationToUser(userId, payload);
    } else {
      console.log(`🟢 User ${userId} is online, skipping push notification`);
    }
  };

  // Handle new follower push notifications
  socket.on("push_new_follower", async ({ followerId, followedUserId, followerName }) => {
    try {
      const payload = {
        title: "New Follower",
        body: `${followerName} started following you`,
        icon: '/icon-192x192.png',
        data: { 
          url: '/profile',
          type: 'new_follower',
          followerId 
        }
      };

      await sendPushIfOffline(followedUserId, payload);
    } catch (error) {
      console.error("Error sending new follower push notification:", error);
    }
  });

  // Handle new message push notifications
  socket.on("push_new_message", async ({ userId, senderName, messageContent, eventId }) => {
    try {
      const payload = {
        title: "New Message",
        body: `${senderName}: ${messageContent.length > 50 ? messageContent.substring(0, 50) + '...' : messageContent}`,
        icon: '/icon-192x192.png',
        data: { 
          url: `/events/${eventId}`,
          type: 'new_message',
          eventId,
          senderName
        }
      };

      await sendPushIfOffline(userId, payload);
    } catch (error) {
      console.error("Error sending new message push notification:", error);
    }
  });

  // Handle media added push notifications
  socket.on("push_media_added", async ({ eventFollowers, senderName, mediaType, eventTitle, eventId, senderId }) => {
    try {
      const payload = {
        title: "New Media Added",
        body: `${senderName} added new ${mediaType} in ${eventTitle}`,
        icon: '/icon-192x192.png',
        data: { 
          url: `/events/${eventId}`,
          type: 'media_added',
          eventId,
          mediaType
        }
      };

      // Send to all followers except the sender
      for (const followerId of eventFollowers) {
        if (followerId !== senderId) {
          await sendPushIfOffline(followerId, payload);
        }
      }
    } catch (error) {
      console.error("Error sending media added push notification:", error);
    }
  });

  // Handle event like push notifications
  socket.on("push_event_like", async ({ eventOwnerId, likerName, eventTitle, eventId }) => {
    try {
      const payload = {
        title: "Event Liked",
        body: `${likerName} liked your event "${eventTitle}"`,
        icon: '/icon-192x192.png',
        data: { 
          url: `/events/${eventId}`,
          type: 'event_like',
          eventId
        }
      };

      await sendPushIfOffline(eventOwnerId, payload);
    } catch (error) {
      console.error("Error sending event like push notification:", error);
    }
  });

  // Handle event view push notifications
  socket.on("push_event_view", async ({ eventOwnerId, viewerName, eventTitle, eventId }) => {
    try {
      const payload = {
        title: "Event Viewed",
        body: `${viewerName} viewed your event "${eventTitle}"`,
        icon: '/icon-192x192.png',
        data: { 
          url: `/events/${eventId}`,
          type: 'event_view',
          eventId
        }
      };

      await sendPushIfOffline(eventOwnerId, payload);
    } catch (error) {
      console.error("Error sending event view push notification:", error);
    }
  });

  // Handle room/audio broadcast notifications
  socket.on("push_room_invite", async ({ invitedUserId, inviterName, roomTitle }) => {
    try {
      const payload = {
        title: "Room Invitation",
        body: `${inviterName} invited you to join "${roomTitle}"`,
        icon: '/icon-192x192.png',
        data: { 
          url: '/rooms',
          type: 'room_invite',
          inviterName
        }
      };

      await sendPushIfOffline(invitedUserId, payload);
    } catch (error) {
      console.error("Error sending room invite push notification:", error);
    }
  });

  // Generic push notification sender
  socket.on("send_push_notification", async ({ userId, title, body, data, sendToAll = false }) => {
    try {
      const payload = {
        title,
        body,
        icon: '/icon-192x192.png',
        data: data || {}
      };

      if (sendToAll) {
        console.log("📱 Sending push notification to all users");
        await sendNotificationToAll(payload);
      } else if (userId) {
        await sendPushIfOffline(userId, payload);
      }
    } catch (error) {
      console.error("Error sending generic push notification:", error);
    }
  });

  // Admin broadcast push notification
  socket.on("admin_broadcast_push", async ({ title, body, data }) => {
    try {
      const payload = {
        title,
        body,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        data: data || {}
      };

      console.log("📢 Admin broadcasting push notification to all users");
      await sendNotificationToAll(payload);
      
      // Also emit to online users via WebSocket
      io.emit('admin_broadcast', payload);
    } catch (error) {
      console.error("Error sending admin broadcast push notification:", error);
    }
  });

  console.log("📱 Push notification events initialized");
};