// frontend/src/actions/series.js

import axios from 'axios';
const api = process.env.NEXT_PUBLIC_SERVER;
import { sendPushNotification, NotificationTemplates } from '@/utils/notifications';
import { formatRoleName2 } from './utils';

// Create a new Series
export const createSeries = async ({ name, description, startDate, endDate, author, group }) => {
  try {
    const response = await axios.post(`${api}/series`, {
      name,
      description,
      startDate,
      endDate,
      group,
      author,
    });

   // console.log('Series created successfully:', response);

    // Send push notification on successful series creation
    if (response.data && response.status === 201) {
      console.log('Preparing to send series creation notification');
      const notificationPayload = {
        title: `Series mpya imeongezwa: ${name}`,
        body: description || `Series mpya ${name} imeongezwa na ${formatRoleName2(author)}`,
        data: {
          type: 'new-series',
          seriesId: response.data.id || response.data._id,
          seriesName: name,
          author: author,
          url: `/series/${response.data.id || response.data._id}`,
          timestamp: new Date().toISOString()
        }
      };

      try {
        await sendPushNotification(notificationPayload);
        console.log('Series creation notification sent successfully');
      } catch (error) {
        console.error('Error sending series creation notification:', error);
      }
    }

    return response.data;
  } catch (error) {
    console.error('Error creating series:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to create series. Please try again later.'
    );
  }
};

// Get all Series
export const getAllSeries = async ({ author }) => {
  try {
    const response = await axios.post(`${api}/get-series`, { author });
    return response.data;
  } catch (error) {
    console.error('Error fetching series:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch series. Please try again later.'
    );
  }
};

// Delete a Series
export const deleteSeries = async ({ seriesId, author }) => {
  try {
    // When sending a DELETE with a request body, use the 'data' option.
    const response = await axios.delete(`${api}/series/${seriesId}`, {
      data: { author },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting series:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to delete series. Please try again later.'
    );
  }
};

// Add a Session to a Series
export const addSession = async ({ seriesId, date, title, content, author, audio }) => {
  try {
    const payload = { date, title, content, author };
    
    // Include the audio object if provided
    if (audio && typeof audio === 'object') {
      payload.audio = audio;
    }

    const response = await axios.post(`${api}/series/${seriesId}/sessions`, payload);
    
    // Send push notification on successful session addition
    if (response.data && response.status === 200) {
      // First, get the series name (you might need to pass it as a parameter or fetch it)
      // For now, I'll use a generic approach, but you might want to pass seriesName as a parameter
      
      const notificationPayload = {
        title: `New Session: ${title}`,
        body: `A new session "${title}" has been added by ${author}`,
        data: {
          type: 'new-session',
          seriesId: seriesId,
          sessionId: response.data.id || response.data._id,
          sessionTitle: title,
          author: author,
          date: date,
          url: `/series/${seriesId}/sessions/${response.data.id || response.data._id}`,
          timestamp: new Date().toISOString()
        }
      };

      // Send notification (don't wait for it to complete)
      sendPushNotification(notificationPayload).then(result => {
        if (result.success) {
          console.log('Session addition notification sent successfully');
        } else {
          console.error('Failed to send session addition notification:', result.error);
        }
      }).catch(error => {
        console.error('Error sending session addition notification:', error);
      });
    }

    return response.data;
  } catch (error) {
    console.error('Error adding session:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to add session. Please try again later.'
    );
  }
};

// Enhanced version with series name - if you can modify the function signature
export const addSessionWithSeriesInfo = async ({ 
  seriesId, 
  seriesName, // Add this parameter
  date, 
  title, 
  content, 
  author, 
  audio 
}) => {
  try {
    const payload = { date, title, content, author };
    
    // Include the audio object if provided
    if (audio && typeof audio === 'object') {
      payload.audio = audio;
    }

    const response = await axios.post(`${api}/series/${seriesId}/sessions`, payload);
    
    // Send push notification on successful session addition
    if (response.data && response.status === 200) {
      const notificationPayload = {
        title: `New Session in ${seriesName}`,
        body: `"${title}" - ${new Date(date).toLocaleDateString()}`,
        data: {
          type: 'new-session',
          seriesId: seriesId,
          seriesName: seriesName,
          sessionId: response.data.id || response.data._id,
          sessionTitle: title,
          author: author,
          date: date,
          url: `/series/${seriesId}/sessions/${response.data.id || response.data._id}`,
          timestamp: new Date().toISOString()
        }
      };

      // Send notification
      sendPushNotification(notificationPayload).then(result => {
        if (result.success) {
          console.log('Session addition notification sent successfully');
        } else {
          console.error('Failed to send session addition notification:', result.error);
        }
      }).catch(error => {
        console.error('Error sending session addition notification:', error);
      });
    }

    return response.data;
  } catch (error) {
    console.error('Error adding session:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to add session. Please try again later.'
    );
  }
};

// Get a Single Session from a Series
export const getSession = async ({ seriesId, sessionId }) => {
  try {
    const response = await axios.get(`${api}/series/${seriesId}/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch session. Please try again later.'
    );
  }
};

// Delete a Session from a Series
export const deleteSession = async ({ seriesId, sessionId, author }) => {
  try {
    // When sending a DELETE with a request body, use the 'data' option.
    const response = await axios.delete(`${api}/series/${seriesId}/sessions/${sessionId}`, {
      data: { author },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting session:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to delete session. Please try again later.'
    );
  }
};

// Update Attendance for a Session
export const updateAttendance = async ({ seriesId, sessionId, attendanceCount, author }) => {
  try {
    const response = await axios.patch(`${api}/series/${seriesId}/sessions/${sessionId}/attendance`, {
      attendanceCount,
      author,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating attendance:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to update attendance. Please try again later.'
    );
  }
};

// Get a Single Series
export const getSingleSeries = async (seriesId) => {
  try {
    const response = await axios.get(`${api}/series/${seriesId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching single series:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch series. Please try again later.'
    );
  }
};

// Get Audio Sessions for a Series
export const getAudioBySeries = async (seriesId) => {
  try {
    const response = await axios.get(`${api}/series/${seriesId}/audio`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audio sessions:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch audio sessions. Please try again later.'
    );
  }
};

// Add Notification to User Series
export const addNotificationToUser = async ({ userId, notification }) => {
  try {
    const response = await axios.post(`${api}/user/${userId}/series/notifications`, { notification });
    return response.data;
  } catch (error) {
    console.error('Error adding notification:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to add notification. Please try again later.'
    );
  }
};

// Helper function to send custom notifications for series events
export const sendSeriesNotification = async (type, data) => {
  let notificationPayload;

  switch (type) {
    case 'series-created':
      notificationPayload = {
        title: `📚 Series Mpya: ${data.name}`,
        body: data.description || `${formatRoleName2(data.author)} ameunda series mpya`,
        data: {
          type: 'new-series',
          seriesId: data.seriesId,
          seriesName: data.name,
          author: data.author,
          url: `/series/${data.seriesId}`
        }
      };
      break;

    case 'session-added':
      notificationPayload = {
        title: `📖 Kipindi kipya: ${data.title}`,
        body: data.title ? `Kwenye series ya ${data.title}` : `Kipindi kipya kimeongezwa na ${formatRoleName2(data.author)}`,
        data: {
          type: 'new-session',
          seriesId: data.seriesId,
          sessionId: data.sessionId,
          sessionTitle: data.sessionTitle,
          seriesName: data.seriesName,
          author: data.author,
          url: `/series/${data.seriesId}/sessions/${data.sessionId}`
        }
      };
      break;

    default:
      throw new Error('Invalid notification type');
  }

  return await sendPushNotification(notificationPayload);
};