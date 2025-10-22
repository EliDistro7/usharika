// components/NotificationSender.tsx
'use client';

import React from 'react';
import { useNotificationSender, NotificationPayload, SendNotificationOptions } from '@/hooks/useNotificationsSender';

interface NotificationSenderProps {
  payload: NotificationPayload;
  options?: SendNotificationOptions;
  children?: (props: {
    sendNotification: () => Promise<any>;
    isLoading: boolean;
    statusMessage: string;
    isSupported: boolean;
    isSubscribed: boolean;
  }) => React.ReactNode;
  
  // Button props (if no children provided)
  buttonText?: string;
  buttonClassName?: string;
  loadingText?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

const NotificationSender: React.FC<NotificationSenderProps> = ({
  payload,
  options = {},
  children,
  buttonText = 'Send Notification',
  buttonClassName,
  loadingText = 'Sending...',
  disabled = false,
  variant = 'primary',
  size = 'md',
  showStatus = true
}) => {
  const {
    sendNotification,
    isLoading,
    statusMessage,
    isSupported,
    isSubscribed
  } = useNotificationSender();

  const handleSend = () => {
    return sendNotification(payload, { showStatus, ...options });
  };

  // If children function is provided, use render props pattern
  if (children) {
    return (
      <>
        {children({
          sendNotification: handleSend,
          isLoading,
          statusMessage,
          isSupported,
          isSubscribed
        })}
        {showStatus && statusMessage && (
          <div className="mt-2 text-sm text-gray-600">
            {statusMessage}
          </div>
        )}
      </>
    );
  }

  // Default button styling based on variant and size
  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };
    
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
    };
    
    return buttonClassName || `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  return (
    <div>
      <button
        onClick={handleSend}
        disabled={!isSupported || isLoading || disabled}
        className={getButtonClasses()}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText}
          </span>
        ) : (
          buttonText
        )}
      </button>
      
      {showStatus && statusMessage && (
        <div className="mt-2 text-sm text-gray-600">
          {statusMessage}
        </div>
      )}
      
      {!isSupported && (
        <div className="mt-2 text-sm text-red-600">
          Push notifications are not supported 
        </div>
      )}
    </div>
  );
};

export default NotificationSender;