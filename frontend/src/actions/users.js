

import axios from 'axios';
const api = process.env.NEXT_PUBLIC_SERVER;

export const getUsersByRole = async ({ adminId, role, page = 1, limit = 10 }) => {
  // Update with your actual API endpoint if needed

  try {
    const response = await axios.post(`${api}/getUsersByRole`, {
      adminId,
      role,
      page,
      limit,
    });

    return response.data; // Contains users, categories, pagination info
  } catch (error) {
    console.error('Error fetching users by role:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch users. Please try again later.'
    );
  }
};


// Push a new matangazo notification
export const pushMatangazoNotification = async ({ group, message }) => {
  console.log('group', group);
  console.log('message', message);
  try {
    const response = await axios.post(`${api}/users/pushMatangazoNotifications`, {
      group,
      message,
    });
    return response.data; // Contains success message or updated notifications
  } catch (error) {
    console.error('Error pushing matangazo notification:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to push notification. Please try again later.'
    );
  }
};

// Fetch notifications for a user
export const getUserNotifications = async (userId) => {
  try {
    const response = await axios.get(`${api}/users/${userId}/notifications`);
    return response.data.notifications; // Array of notifications
  } catch (error) {
    console.error('Error fetching user notifications:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch notifications. Please try again later.'
    );
  }
};

// Mark a specific notification as read
export const markNotificationAsRead = async ({ userId, notificationId }) => {
  try {
    const response = await axios.put(
      `${api}/users/${userId}/notifications/${notificationId}/read`
    );
    return response.data.message; // Success message
  } catch (error) {
    console.error('Error marking notification as read:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to mark notification as read. Please try again later.'
    );
  }
};

// Mark a specific notification as read
export const removeNotification = async ({ userId, notificationId }) => {
  try {
    const response = await axios.delete(
      `${api}/users/${userId}/notifications/${notificationId}/remove`
    );
    return response.data.message; // Success message
  } catch (error) {
    console.error('Error marking notification as read:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to mark notification as read. Please try again later.'
    );
  }
};