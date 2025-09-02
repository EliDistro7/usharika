// components/PushNotificationManager.js

'use client';
import { useEffect, useState } from 'react';
import { usePushNotifications } from '../../hooks/usePushNotifications';

const PushNotificationManager = () => {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    sendTestNotification
  } = usePushNotifications();

  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show notification prompt after a delay if not already decided
    if (isSupported && permission === 'default') {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  const handleSubscribe = async () => {
    const result = await subscribeToPushNotifications();
    if (result.success) {
      setShowPrompt(false);
      console.log('Successfully subscribed to push notifications');
    } else {
      console.error('Failed to subscribe:', result.error);
    }
  };

  const handleUnsubscribe = async () => {
    const result = await unsubscribeFromPushNotifications();
    if (result.success) {
      console.log('Successfully unsubscribed from push notifications');
    }
  };

  if (!isSupported) {
    return null; // Don't show anything if not supported
  }

  return (
    <div className="push-notification-manager">
      {/* Notification Prompt */}
      {showPrompt && permission === 'default' && (
        <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                🔔
              </div>
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Stay Updated
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Enable notifications to get updates even when the app is closed.
              </p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Enabling...' : 'Enable'}
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300"
                >
                  Not Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings (for settings page) */}
      <div className="notification-settings">
        <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Browser Notifications</p>
              <p className="text-sm text-gray-500">
                Receive notifications even when the app is closed
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {permission === 'granted' && isSubscribed && (
                <span className="text-green-600 text-sm">✓ Enabled</span>
              )}
              {permission === 'denied' && (
                <span className="text-red-600 text-sm">✗ Blocked</span>
              )}
              
              {permission === 'granted' && (
                <button
                  onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded text-sm font-medium disabled:opacity-50 ${
                    isSubscribed
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {isLoading 
                    ? 'Processing...' 
                    : isSubscribed 
                      ? 'Disable' 
                      : 'Enable'
                  }
                </button>
              )}
              
              {permission === 'default' && (
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Enabling...' : 'Enable'}
                </button>
              )}
            </div>
          </div>

          {/* Test notification button (only in development) */}
          {process.env.NODE_ENV === 'development' && isSubscribed && (
            <div className="pt-4 border-t">
              <button
                onClick={sendTestNotification}
                className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
              >
                Send Test Notification
              </button>
            </div>
          )}
        </div>

        {/* Instructions for blocked notifications */}
        {permission === 'denied' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              Notifications are blocked. To enable them:
              <br />
              1. Click the lock icon in your browser's address bar
              <br />
              2. Change notifications from "Block" to "Allow"
              <br />
              3. Refresh the page
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PushNotificationManager;