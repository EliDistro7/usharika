const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // The user receiving the notification
    },
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series",
      required: false, // Only required if the notification is related to a series
    },
    type: {
      type: String,
      enum: ["series_follow", "view_series", "media_added", "new_message"], // Updated enum values
      required: true, // Defines the type of notification
    },
    message: {
      type: String,
      required: true, // Notification message
    },
    senderName: {
      type: String,
      required: true, // Name of the sender
    },
    read: {
      type: Boolean,
      default: false, // False by default, marking unread notifications
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notifications", NotificationSchema);