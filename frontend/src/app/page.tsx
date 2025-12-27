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
    <div className="px-0 mx-0">
      <NewsTicker 
        direction="left"
        className=""
        pauseOnHover={true}
      /> 

  

  

      {/* Highlights Section */}
      <HighlightsWrapper />

      {/* Pledge Section */}
      <Pledge />
      
      {/* Future Events Carousel */}
      <FutureEventsCarousel />
    </div>
  );
}