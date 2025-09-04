// utils/notifications.ts
import { NotificationPayload } from '@/hooks/useNotificationsSender';

/**
 * Standalone function to send notifications without React hooks
 * Useful for server-side or non-component contexts
 */
export const sendPushNotification = async (payload: NotificationPayload): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
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
      return { success: true, message: 'Notification sent successfully!' };
    } else {
      const errorText = await response.text();
      return { success: false, error: `Failed to send notification: ${errorText}` };
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    return { 
      success: false, 
      error: `Error sending notification: ${(error as any)?.message}` 
    };
  }
};

/**
 * Notification templates for common use cases
 */
export const NotificationTemplates = {
  welcome: (): NotificationPayload => ({
    title: 'Welcome to Yombo KKKT!',
    body: 'Thank you for joining our church community. Stay connected with us!',
    data: { 
      url: '/',
      type: 'welcome'
    }
  }),

  newEvent: (eventTitle: string, eventDate: string, eventUrl?: string): NotificationPayload => ({
    title: `New Event: ${eventTitle}`,
    body: `Join us on ${eventDate}`,
    data: { 
      url: eventUrl || '/events',
      type: 'event'
    }
  }),

  eventReminder: (eventTitle: string, timeUntil: string, eventUrl?: string): NotificationPayload => ({
    title: `Event Reminder: ${eventTitle}`,
    body: `Starting ${timeUntil}`,
    data: { 
      url: eventUrl || '/events',
      type: 'event-reminder'
    }
  }),

  newSermon: (sermonTitle: string, preacher: string, sermonUrl?: string): NotificationPayload => ({
    title: `New Sermon: ${sermonTitle}`,
    body: `By ${preacher}`,
    data: { 
      url: sermonUrl || '/sermons',
      type: 'sermon'
    }
  }),

  liveService: (serviceName: string, serviceUrl?: string): NotificationPayload => ({
    title: `${serviceName} is now live!`,
    body: 'Join us for worship online',
    data: { 
      url: serviceUrl || '/live',
      type: 'live-service'
    }
  }),

  announcement: (title: string, message: string, url?: string): NotificationPayload => ({
    title: `Announcement: ${title}`,
    body: message,
    data: { 
      url: url || '/',
      type: 'announcement'
    }
  }),

  prayer: (prayerTitle: string, prayerUrl?: string): NotificationPayload => ({
    title: `Prayer Request: ${prayerTitle}`,
    body: 'The church community is invited to pray',
    data: { 
      url: prayerUrl || '/prayers',
      type: 'prayer'
    }
  }),

  donation: (campaignTitle: string, donationUrl?: string): NotificationPayload => ({
    title: `Support: ${campaignTitle}`,
    body: 'Your generosity makes a difference',
    data: { 
      url: donationUrl || '/donate',
      type: 'donation'
    }
  }),

  newsletter: (title: string, newsletterUrl?: string): NotificationPayload => ({
    title: `Newsletter: ${title}`,
    body: 'Read the latest church news and updates',
    data: { 
      url: newsletterUrl || '/newsletter',
      type: 'newsletter'
    }
  }),

  custom: (title: string, body: string, data?: any): NotificationPayload => ({
    title,
    body,
    data: {
      type: 'custom',
      ...data
    }
  })
};

/**
 * Batch send notifications (useful for admin panel)
 */
export const sendBatchNotifications = async (
  notifications: NotificationPayload[]
): Promise<{
  success: boolean;
  results: Array<{ success: boolean; message?: string; error?: string; }>;
  successCount: number;
  errorCount: number;
}> => {
  const results = await Promise.allSettled(
    notifications.map(notification => sendPushNotification(notification))
  );

  const processedResults = results.map(result => 
    result.status === 'fulfilled' ? result.value : { 
      success: false, 
      error: 'Failed to send notification' 
    }
  );

  const successCount = processedResults.filter(r => r.success).length;
  const errorCount = processedResults.filter(r => !r.success).length;

  return {
    success: errorCount === 0,
    results: processedResults,
    successCount,
    errorCount
  };
};

/**
 * Schedule a notification (client-side scheduling using setTimeout)
 * For server-side scheduling, you'd want to use a proper job queue
 */
export const scheduleNotification = (
  payload: NotificationPayload,
  delayMs: number,
  onSent?: (result: any) => void
): NodeJS.Timeout => {
  return setTimeout(async () => {
    const result = await sendPushNotification(payload);
    onSent?.(result);
  }, delayMs);
};

/**
 * Helper function to calculate delay for scheduling
 */
export const calculateDelay = {
  minutes: (minutes: number) => minutes * 60 * 1000,
  hours: (hours: number) => hours * 60 * 60 * 1000,
  days: (days: number) => days * 24 * 60 * 60 * 1000,
  until: (futureDate: Date) => futureDate.getTime() - new Date().getTime()
};