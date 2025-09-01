'use client';

import React, { useState, useEffect } from 'react';
import { getUser } from '@/hooks/useUser';
import Link from 'next/link';
import { BookOpen, Bell, Check, Clock, User, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const SeriesNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState(new Set());
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications from the user object
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const user = await getUser();
        console.log("user from notifications", user);
        if (user && user.series && user.series.notifications) {
          setNotifications(user.series.notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Function to mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(prev => new Set(prev).add(notificationId));
      
      // API call to mark notification as read
      if(true){
        toast.success('Notification marked as read');
      }
     
        
       else {
        throw new Error('Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    } finally {
      setMarkingAsRead(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  // Function to handle notification click
  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
  };

  // Function to mark all as read
  const markAllAsRead = async () => {
    try {
      if (true) {
        setNotifications([]);
        toast.success('All notifications marked as read');
      } else {
        throw new Error('Failed to mark all as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {/* Notification Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-11 h-11 bg-transparent hover:bg-background-200 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft border border-border-light hover:border-border-medium group"
      >
        <BookOpen className="w-5 h-5 text-text-secondary group-hover:text-primary-600 transition-colors duration-300" strokeWidth={2} />

        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-error-500 text-white text-xs font-semibold rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse-soft">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-4xl shadow-strong border border-border-light overflow-hidden animate-slide-down">
            {/* Header */}
            <div className="bg-primary-gradient text-white p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-primary-700 opacity-90"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-xl backdrop-blur-sm">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-base font-display">
                    Series Notifications
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 hover:border-opacity-40 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 backdrop-blur-sm"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8 text-text-secondary">
                  <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mr-3"></div>
                  <span className="font-medium">Loading notifications...</span>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-border-light">
                  {notifications.map((notif, index) => (
                    <div key={notif._id} className="relative group">
                      <Link 
                        href={`/series/${notif.seriesId}`}
                        onClick={() => handleNotificationClick(notif._id)}
                        className="block p-5 hover:bg-background-200 transition-all duration-200 group-hover:bg-background-300"
                      >
                        <div className="relative">
                          {/* Unread indicator */}
                          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-primary-600 rounded-full"></div>
                          
                          <div className="ml-3">
                            {/* Title */}
                            <div className="font-semibold text-text-primary text-sm leading-5 mb-1 group-hover:text-primary-600 transition-colors duration-200">
                              {notif.title}
                            </div>
                            
                            {/* Author */}
                            <div className="flex items-center space-x-1 text-text-secondary text-xs mb-2">
                              <User className="w-3 h-3" />
                              <span>by {notif.author}</span>
                            </div>
                            
                            {/* Timestamp */}
                            <div className="flex items-center space-x-1 text-text-tertiary text-xs">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(notif.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          {/* Loading state for individual notification */}
                          {markingAsRead.has(notif._id) && (
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                      </Link>
                      
                      {/* Mark as read button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          markAsRead(notif._id);
                        }}
                        disabled={markingAsRead.has(notif._id)}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 bg-transparent hover:bg-border-light rounded-lg p-1.5 transition-all duration-200 text-text-secondary hover:text-primary-600"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-12">
                  <div className="w-16 h-16 bg-background-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-text-tertiary" />
                  </div>
                  <div className="font-medium text-text-secondary mb-2">
                    No notifications
                  </div>
                  <div className="text-sm text-text-tertiary">
                    You're all caught up with your series!
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SeriesNotifications;