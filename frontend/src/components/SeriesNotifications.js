'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getUser } from '@/hooks/useUser';
import Link from 'next/link';
import { BookOpen, Bell, Check, Clock, User, X } from 'lucide-react';
import { toast } from 'react-toastify';

const SeriesNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (for Next.js SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Function to mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(prev => new Set(prev).add(notificationId));
      
      // API call to mark notification as read
      if(true){
        // Remove notification from list when marked as read
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        toast.success('Notification marked as read');
      } else {
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
    setIsOpen(false); // Close modal when navigating
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

  // Modal component
  const Modal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pb-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-xl">
                  Series Notifications
                </h2>
                <p className="text-white text-opacity-80 text-sm mt-1">
                  Stay updated with your favorite series
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 hover:border-opacity-40 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 hover:border-opacity-40 rounded-lg p-2 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content - Full Height */}
        <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-600">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <span className="font-medium text-lg">Loading notifications...</span>
              </div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="p-6">
              <div className="space-y-4">
                {notifications.map((notif, index) => (
                  <div key={notif._id} className="relative group bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-purple-300 hover:shadow-md">
                    <Link 
                      href={`/series/${notif.seriesId}`}
                      onClick={() => handleNotificationClick(notif._id)}
                      className="block p-6"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Unread indicator */}
                        <div className="flex-shrink-0 w-3 h-3 bg-purple-600 rounded-full mt-2"></div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <h3 className="font-semibold text-gray-900 text-lg leading-6 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                            {notif.title}
                          </h3>
                          
                          {/* Author */}
                          <div className="flex items-center space-x-2 text-gray-600 text-sm mb-3">
                            <User className="w-4 h-4 flex-shrink-0" />
                            <span>by {notif.author}</span>
                          </div>
                          
                          {/* Timestamp */}
                          <div className="flex items-center space-x-2 text-gray-500 text-sm">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{new Date(notif.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {/* Loading state for individual notification */}
                          {markingAsRead.has(notif._id) ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                markAsRead(notif._id);
                              }}
                              disabled={markingAsRead.has(notif._id)}
                              className="bg-purple-100 hover:bg-purple-200 text-purple-600 hover:text-purple-700 rounded-lg p-2 transition-all duration-200"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2 text-xl">
                  No notifications
                </h3>
                <p className="text-gray-500 text-lg">
                  You're all caught up with your series!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Notification Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 group"
      >
        <BookOpen className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" strokeWidth={2} />

        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center border-2 border-white shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Portal Modal - Renders outside the Header */}
      {mounted && isOpen && createPortal(<Modal />, document.body)}
    </>
  );
};

export default SeriesNotifications;