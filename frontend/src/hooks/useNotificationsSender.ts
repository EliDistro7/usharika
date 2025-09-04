// hooks/useNotificationSender.ts
import { useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: {
    url?: string;
    type?: string;
    timestamp?: string;
    [key: string]: any;
  };
  icon?: string;
  badge?: string;
  tag?: string;
}

export interface SendNotificationOptions {
  autoSubscribe?: boolean; // Whether to auto-subscribe if not subscribed
  showStatus?: boolean; // Whether to show status messages
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: string) => void;
}

export const useNotificationSender = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    subscribeToPushNotifications
  } = usePushNotifications();

  const sendNotification = async (
    payload: NotificationPayload,
    options: SendNotificationOptions = {}
  ) => {
    const {
      autoSubscribe = true,
      showStatus = true,
      onSuccess,
      onError,
      onStatusChange
    } = options;

    // Check if notifications are supported
    if (!isSupported) {
      const error = 'Push notifications are not supported on this device';
      if (showStatus) setStatusMessage(error);
      onError?.(error);
      return { success: false, error };
    }

    // Check if user needs to subscribe
    if (!isSubscribed && autoSubscribe) {
      const subscribeMessage = 'Enabling notifications...';
      if (showStatus) setStatusMessage(subscribeMessage);
      onStatusChange?.(subscribeMessage);

      const result = await subscribeToPushNotifications();
      if (!result.success) {
        const error = `Failed to enable notifications: ${result.error}`;
        if (showStatus) setStatusMessage(error);
        onError?.(error);
        return { success: false, error };
      }
    } else if (!isSubscribed) {
      const error = 'Please enable notifications first';
      if (showStatus) setStatusMessage(error);
      onError?.(error);
      return { success: false, error };
    }

    setIsLoading(true);
    const sendingMessage = 'Sending notification...';
    if (showStatus) setStatusMessage(sendingMessage);
    onStatusChange?.(sendingMessage);

    try {
      // Add timestamp if not provided
      const notificationPayload = {
        ...payload,
        data: {
          timestamp: new Date().toISOString(),
          ...payload.data
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER || ''}/api/push/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationPayload),
      });

      if (response.ok) {
        const successMessage = 'Notification sent successfully!';
        if (showStatus) {
          setStatusMessage(successMessage);
          // Clear message after 3 seconds
          setTimeout(() => setStatusMessage(''), 3000);
        }
        onSuccess?.(successMessage);
        return { success: true, message: successMessage };
      } else {
        const errorText = await response.text();
        const error = `Failed to send notification: ${errorText}`;
        if (showStatus) setStatusMessage(error);
        onError?.(error);
        return { success: false, error };
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      const errorMessage = `Error sending notification: ${(error as any)?.message}`;
      if (showStatus) setStatusMessage(errorMessage);
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Predefined notification templates
  const sendWelcomeNotification = (options?: SendNotificationOptions) => {
    return sendNotification({
      title: 'Welcome to Yombo KKKT!',
      body: 'Thank you for enabling notifications. Stay connected with our church community!',
      data: { 
        url: '/',
        type: 'welcome'
      }
    }, options);
  };

  const sendEventNotification = (
    eventTitle: string, 
    eventDetails: string, 
    eventUrl?: string,
    options?: SendNotificationOptions
  ) => {
    return sendNotification({
      title: `New Event: ${eventTitle}`,
      body: eventDetails,
      data: { 
        url: eventUrl || '/events',
        type: 'event'
      }
    }, options);
  };

  const sendSermonNotification = (
    sermonTitle: string, 
    preacher: string,
    sermonUrl?: string,
    options?: SendNotificationOptions
  ) => {
    return sendNotification({
      title: `New Sermon: ${sermonTitle}`,
      body: `By ${preacher}`,
      data: { 
        url: sermonUrl || '/sermons',
        type: 'sermon'
      }
    }, options);
  };

  const sendAnnouncementNotification = (
    title: string,
    message: string,
    url?: string,
    options?: SendNotificationOptions
  ) => {
    return sendNotification({
      title: `Announcement: ${title}`,
      body: message,
      data: { 
        url: url || '/',
        type: 'announcement'
      }
    }, options);
  };

  const clearStatusMessage = () => setStatusMessage('');

  return {
    // Main function
    sendNotification,
    
    // Template functions
    sendWelcomeNotification,
    sendEventNotification,
    sendSermonNotification,
    sendAnnouncementNotification,
    
    // State
    isLoading,
    statusMessage,
    isSupported,
    permission,
    isSubscribed,
    
    // Utilities
    clearStatusMessage
  };
};