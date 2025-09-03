'use client';

import { useState, useEffect } from 'react';

const NotificationDisplay = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for service worker messages (when app is open)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'push-received') {
          addNotification(event.data.notification);
        }
      });
    }

    // Listen for push events when app is active
    const handlePushMessage = (event) => {
      // This would be triggered by your Socket.io events or direct API calls
      if (event.detail) {
        addNotification(event.detail);
      }
    };

    window.addEventListener('push-notification', handlePushMessage);

    return () => {
      window.removeEventListener('push-notification', handlePushMessage);
    };
  }, []);

  const addNotification = (notificationData) => {
    const notification = {
      id: Date.now(),
      ...notificationData,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only last 5

    // Auto-remove after 10 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 10000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Navigate to the URL if provided
    if (notification.data?.url) {
      window.location.href = notification.data.url;
    }
    
    removeNotification(notification.id);
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-white border-l-4 ${
            notification.read 
              ? 'border-gray-300 bg-gray-50' 
              : 'border-purple-500 bg-white'
          } rounded-lg shadow-lg p-4 cursor-pointer transform transition-all duration-300 hover:scale-105`}
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notification.icon ? (
                <img
                  src={notification.icon}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5v-6a3 3 0 00-3-3H5a3 3 0 00-3 3v6h5" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {notification.body}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationDisplay;