const User = require("../../models/yombo/yomboUserSchema.js"); // Adjust the path as needed

module.exports = function seriesNotificationEvents(io, socket, userSockets) {
  // Helper function to notify users in real-time via Socket.io
  const notifyUser = async (userId, event, eventData) => {
    console.log("Sending notification to user:", userId);
    const targetSocketId = userSockets[userId];
    if (targetSocketId) {
      console.log("Successfully sent notification to user:", userId);
      io.to(targetSocketId).emit(event, eventData);
    } else {
      console.log("User is not connected:", userId);
    }
  };

  // Helper function to add a notification to the user's series.notifications
  const addNotificationToUserSeries = async (userId, notification) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.error("User not found:", userId);

        return;
      }

      // Ensure the series field exists
      if (!user.series) {
        user.series = { notifications: [], subscriptions: [] };
      }

      // Add the notification
      user.series.notifications.push(notification);
      await user.save();

      console.log("Notification added to user's series:", userId);
    } catch (err) {
      console.error("Error adding notification to user's series:", err);
    }
  };

  // Listen for 'add_series_notification' event
  socket.on("add_series_notification", async ({ userId, notification }) => {
    try {
      console.log("Handling add_series_notification event...");

      // Add the notification to the user's series
      await addNotificationToUserSeries(userId, notification);

      // Notify the user in real-time
      notifyUser(userId, "new_series_notification", { notification });
    } catch (err) {
      console.error("Error handling add_series_notification event:", err);
    }
  });

  // Listen for 'view_series' event
  socket.on("view_series", async ({ userId, seriesId, senderName }) => {
    try {
      console.log("Handling view_series event...");

      const message = `${senderName} viewed your series.`;

      // Add the notification to the user's series
      await addNotificationToUserSeries(userId, message);

      // Notify the user in real-time
      notifyUser(userId, "view_series", { senderName, message });
    } catch (err) {
      console.error("Error handling view_series event:", err);
    }
  });

  // Listen for 'new_series_session' event
  socket.on("new_series_session", async ({ userId, seriesId, sessionTitle, senderName }) => {
    try {
      console.log("Handling new_series_session event...");

      const message = `${senderName} added a new session "${sessionTitle}" to your series.`;

      // Add the notification to the user's series
      await addNotificationToUserSeries(userId, message);

      // Notify the user in real-time
      notifyUser(userId, "new_series_session", { senderName, sessionTitle, message });
    } catch (err) {
      console.error("Error handling new_series_session event:", err);
    }
  });

  return {
    addNotificationToUserSeries,
  };
};