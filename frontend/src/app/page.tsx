'use client';

import { useState } from 'react';
import MainNews from "@/components/NewsSection";
import Pledge from "@/components/Pledge";
import HighlightsWrapper from "@/components/HighlightsWrapper";
import { kipaimara, efm, beach } from '@/data/main';
import { NewsTicker } from '@/components/NewsTicker';
import FutureEventsCarousel from "@/components/xmass/FutureEventsCarousel";
import Series from '@/components/admins/Series';
import LiveSeries from '@/components/series/LiveSeries';
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function Home() {
  const dataSets = [beach, kipaimara, efm];
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    subscribeToPushNotifications,
    sendTestNotification 
  } = usePushNotifications();

  const handleTestNotification = async () => {
    if (!isSubscribed) {
      // First subscribe if not already subscribed
      setTestMessage('Please enable notifications first...');
      const result = await subscribeToPushNotifications();
      if (!result.success) {
        setTestMessage('Failed to enable notifications: ' + result.error);
        return;
      }
      setTestMessage('Notifications enabled! Sending test...');
    }

    setIsTestLoading(true);
    setTestMessage('Sending test notification...');

    try {
      // Send test notification via your API
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER || ''}/api/push/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Welcome to Yombo KKKT!',
          body: 'This is your first push notification from our church app. Stay connected with us!',
          data: { 
            url: '/',
            type: 'welcome',
            timestamp: new Date().toISOString()
          }
        }),
      });

      if (response.ok) {
        setTestMessage('Test notification sent successfully! Check your notifications.');
      } else {
        const error = await response.text();
        setTestMessage('Failed to send notification: ' + error);
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      setTestMessage('Error sending notification: ' + (error as any)?.message);
    } finally {
      setIsTestLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setTestMessage(''), 5000);
    }
  };

  return (
    <div className="px-0">
      <NewsTicker 
        direction="left"
        className=""
        pauseOnHover={true}
      /> 

  

      {/* Production version - minimal floating button */}
      {process.env.NODE_ENV === 'production' && isSupported && (
        <button
          onClick={handleTestNotification}
          disabled={isTestLoading}
          className="fixed bottom-20 left-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 disabled:opacity-50 z-50 transition-colors"
          title="Test Push Notifications"
        >
          {isTestLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5v-6a3 3 0 00-3-3H5a3 3 0 00-3 3v6h5"></path>
            </svg>
          )}
        </button>
      )}

      {/* Highlights Section */}
      <HighlightsWrapper />

      {/* Pledge Section */}
      <Pledge />
      
      {/* Future Events Carousel */}
      <FutureEventsCarousel />
    </div>
  );
}