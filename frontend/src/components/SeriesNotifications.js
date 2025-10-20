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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const user = await getUser();
        if (user?.series?.notifications) {
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const markAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(prev => new Set(prev).add(notificationId));
      
      if(true){
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        toast.success('Marked as read');
      } else {
        throw new Error('Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark as read');
    } finally {
      setMarkingAsRead(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
    setIsOpen(false);
  };

  const markAllAsRead = async () => {
    try {
      if (true) {
        setNotifications([]);
        toast.success('All marked as read');
      } else {
        throw new Error('Failed to mark all as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const unreadCount = notifications.length;

  const Modal = () => (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-gradient-to-br from-purple-50 to-white">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium px-3 py-1.5 hover:bg-purple-50 rounded-lg transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div key={notif._id} className="group bg-white hover:bg-purple-50 rounded-xl transition-all border border-gray-100 hover:border-purple-200 hover:shadow-sm">
                  <Link 
                    href={`/series/${notif.seriesId}`}
                    onClick={() => handleNotificationClick(notif._id)}
                    className="block p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1.5 group-hover:text-purple-600 transition-colors">
                          {notif.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            {notif.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(notif.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {markingAsRead.has(notif._id) ? (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markAsRead(notif._id);
                            }}
                            className="w-8 h-8 flex items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-colors"
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
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">All caught up</h3>
                <p className="text-sm text-gray-500">No new notifications</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all group"
      >
        <BookOpen className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" strokeWidth={2} />

        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center border-2 border-white shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {mounted && isOpen && createPortal(<Modal />, document.body)}
    </>
  );
};

export default SeriesNotifications;