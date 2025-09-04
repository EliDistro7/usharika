// Example Usage in Different Components

// 1. Using the hook directly in a component
// pages/admin/notifications.tsx
'use client';
import { useNotificationSender } from '@/hooks/useNotificationsSender';
import { NotificationTemplates } from '@/utils/notifications';

export default function AdminNotifications() {
  const {
    sendNotification,
    sendWelcomeNotification,
    sendEventNotification,
    sendAnnouncementNotification,
    isLoading,
    statusMessage,
    isSupported
  } = useNotificationSender();

  const handleCustomNotification = async () => {
    const result = await sendNotification({
      title: 'Custom Notification',
      body: 'This is a custom message from the admin panel',
      data: { type: 'admin', url: '/admin' }
    });
    
    if (result.success) {
      console.log('Notification sent successfully!');
    }
  };

  const handleEventNotification = async () => {
    await sendEventNotification(
      'Sunday Service',
      'Join us this Sunday at 10:00 AM',
      '/events/sunday-service'
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Send Notifications</h1>
      
      <div className="space-y-4">
        <button 
          onClick={handleCustomNotification}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send Custom Notification
        </button>
        
        <button 
          onClick={handleEventNotification}
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Send Event Notification
        </button>
        
        <button 
          onClick={() => sendWelcomeNotification()}
          disabled={isLoading}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Send Welcome Message
        </button>
      </div>
      
      {statusMessage && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded">
          {statusMessage}
        </div>
      )}
    </div>
  );
}

