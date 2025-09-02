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
      {/* Fixed Notification Prompt with proper responsive positioning */}
      {showPrompt && permission === 'default' && (
        <div className="fixed bottom-4 left-4 right-4 md:top-4 md:right-4 md:left-auto bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm md:max-w-xs z-50 mx-auto md:mx-0">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🔔</span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                Pata Taarifas Kwa Wakati!
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Weza kupata taarifa za matukio, machapisho mapya kwa wakati.
              </p>
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="bg-primary-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Inawezesha...' : 'Wezesha'}
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                  Sio sasa
                </button>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={() => setShowPrompt(false)}
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Notification Settings - Only visible on settings page */}
      <div className="notification-settings hidden">
        <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium">Browser Notifications</p>
              <p className="text-sm text-gray-500">
                Receive notifications even when the app is closed
              </p>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              {permission === 'granted' && isSubscribed && (
                <span className="text-green-600 text-sm whitespace-nowrap">✓ Enabled</span>
              )}
              {permission === 'denied' && (
                <span className="text-red-600 text-sm whitespace-nowrap">✗ Blocked</span>
              )}
              
              {permission === 'granted' && (
                <button
                  onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded text-sm font-medium disabled:opacity-50 whitespace-nowrap transition-colors ${
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
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap transition-colors"
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
                className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
              >
                Send Test Notification
              </button>
            </div>
          )}
        </div>

        {/* Instructions for blocked notifications */}
        {permission === 'denied' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800 leading-relaxed">
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