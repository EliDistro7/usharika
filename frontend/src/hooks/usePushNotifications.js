// hooks/usePushNotifications.js
import { useState, useEffect, useCallback } from 'react';

const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY;

export const usePushNotifications = () => {
  const [subscription, setSubscription] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      // Check if already subscribed
      checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          setSubscription(existingSubscription);
        }
      }
    } catch (error) {
      console.error('Error checking existing subscription:', error);
    }
  };

  const registerServiceWorker = async () => {
    if (!isSupported) return null;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
      
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPushNotifications = useCallback(async () => {
    if (!isSupported || !PUBLIC_VAPID_KEY) {
      console.error('Push notifications not supported or VAPID key missing');
      return { success: false, error: 'Not supported' };
    }

    setIsLoading(true);

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== 'granted') {
        console.log('Push notification permission denied');
        setIsLoading(false);
        return { success: false, error: 'Permission denied' };
      }

      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        setIsLoading(false);
        return { success: false, error: 'Service worker registration failed' };
      }

      // Subscribe to push notifications
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      setSubscription(pushSubscription);

      // Send subscription to your backend
      const result = await sendSubscriptionToBackend(pushSubscription);
      
      setIsLoading(false);
      
      if (result.success) {
        return { success: true, subscription: pushSubscription };
      } else {
        return { success: false, error: result.error };
      }

    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  }, [isSupported]);

  const sendSubscriptionToBackend = async (subscription) => {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (response.ok) {
        console.log('Subscription sent to backend successfully');
        return { success: true };
      } else {
        const error = await response.text();
        console.error('Failed to send subscription to backend:', error);
        return { success: false, error };
      }
    } catch (error) {
      console.error('Network error sending subscription:', error);
      return { success: false, error: error.message };
    }
  };

  const unsubscribeFromPushNotifications = useCallback(async () => {
    if (!subscription) return { success: false, error: 'No subscription found' };

    setIsLoading(true);

    try {
      await subscription.unsubscribe();
      setSubscription(null);

      // Notify backend to remove subscription
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  }, [subscription]);

  // Test notification function
  const sendTestNotification = async () => {
    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Notification',
          body: 'This is a test push notification!',
          data: { url: '/notifications' }
        }),
      });
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  };

  return {
    isSupported,
    permission,
    subscription,
    isLoading,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    sendTestNotification,
    isSubscribed: !!subscription,
  };
};