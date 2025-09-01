'use client';

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getLoggedInUserId } from "@/hooks/useUser";
import {
  getUserNotifications,
  markNotificationAsRead,
  removeNotification,
} from "@/actions/users";
import { formatRoleName } from "@/actions/utils";
import { Bell, BellOff, Check, Trash2, Clock, Loader2 } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const userId = getLoggedInUserId();
        if (userId) {
          const fetchedNotifications = await getUserNotifications(userId);
          setNotifications(fetchedNotifications || []);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleDeleteNotification = async (userId: string, id: string) => {
    toast.warn(
      <div className="p-3">
        <p className="font-medium mb-4 text-text-primary">Unafuta tangazo hili?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-error-500 hover:bg-error-600 text-white rounded-lg font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            onClick={async () => {
              try {
                await removeNotification({ userId, notificationId: id });
                setNotifications((prev) => prev.filter((n) => n._id !== id));
                toast.success("Notification deleted successfully.");
              } catch (error) {
                toast.error("Failed to delete the notification. Please try again.");
              }
            }}
          >
            Ndio
          </button>
          <button 
            className="px-4 py-2 bg-text-tertiary hover:bg-text-secondary text-white rounded-lg font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => toast.dismiss()}
          >
            Hapana
          </button>
        </div>
      </div>,
      { 
        autoClose: false,
        className: "!bg-background-50 !rounded-xl"
      }
    );
  };

  const handleMarkAsRead = async (userId: string, id: string) => {
    try {
      await markNotificationAsRead({ userId, notificationId: id });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      toast.info("Tangazo limeshasomwa.", {
        className: "!bg-primary-gradient !text-white !rounded-xl"
      });
    } catch (error) {
      toast.error("Failed to mark the notification as read. Please try again.");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.notification-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!rounded-xl !shadow-primary"
      />
      
      <div className="relative notification-dropdown">
        {/* Notification Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass relative w-12 h-12 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary group"
        >
          <Bell size={20} className="text-primary-700 group-hover:text-primary-800 transition-colors duration-300" />
          
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse-soft">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-14 w-96 max-w-[95vw] glass-strong rounded-4xl shadow-primary-lg border border-border-light z-50 animate-scale-in">
            {/* Header */}
            <div className="bg-primary-gradient text-white p-5 rounded-t-4xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={20} />
                  <span className="font-semibold text-lg">Matangazo</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                    {unreadCount} mpya
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center p-8">
                  <Loader2 size={32} className="text-primary-600 animate-spin mx-auto mb-4" />
                  <p className="text-text-secondary font-medium">Inapakia matangazo...</p>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-border-light">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification._id}
                      className={`
                        p-5 transition-all duration-200 hover:bg-primary-50/50 hover:translate-x-1 relative
                        ${!notification.isRead ? 'bg-background-100 border-l-4 border-primary-600' : 'bg-background-50'}
                        ${index === notifications.length - 1 ? 'rounded-b-4xl' : ''}
                      `}
                    >
                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <div className="absolute top-5 right-5 w-2 h-2 bg-primary-600 rounded-full shadow-primary animate-pulse-soft" />
                      )}

                      <div className="space-y-3">
                        {/* Role Badge */}
                        <div className="flex items-center gap-2">
                          <span className="bg-primary-gradient text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
                            {formatRoleName(notification.group)}
                          </span>
                        </div>
                        
                        {/* Message */}
                        <p className={`text-sm leading-relaxed ${
                          notification.isRead ? 'text-text-secondary' : 'text-text-primary font-medium'
                        }`}>
                          {notification.message}
                        </p>
                        
                        {/* Timestamp */}
                        <div className="flex items-center gap-1 text-text-tertiary text-xs">
                          <Clock size={12} />
                          <span>
                            {new Date(notification.time).toLocaleString('sw-TZ', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {!notification.isRead && (
                            <button
                              onClick={() =>
                                handleMarkAsRead(getLoggedInUserId() || "", notification._id)
                              }
                              className="btn-primary text-xs px-3 py-2 rounded-lg flex items-center gap-1"
                            >
                              <Check size={12} />
                              Soma
                            </button>
                          )}
                          
                          <button
                            onClick={() =>
                              handleDeleteNotification(getLoggedInUserId() || "", notification._id)
                            }
                            className="bg-transparent border border-error-500 text-error-500 hover:bg-error-500 hover:text-white text-xs px-3 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            Futa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-12">
                  <div className="w-16 h-16 bg-background-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BellOff size={24} className="text-text-muted" />
                  </div>
                  <h3 className="text-text-primary font-semibold mb-2">
                    Hamna matangazo
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Matangazo mapya yataonekana hapa
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}