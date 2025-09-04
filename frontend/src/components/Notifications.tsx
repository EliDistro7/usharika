'use client';

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getLoggedInUserId } from "@/hooks/useUser";
import {
  getUserNotifications,
  markNotificationAsRead,
  removeNotification,
} from "@/actions/users";
import { formatRoleName } from "@/actions/utils";
import { Bell, BellOff, Check, Trash2, Clock, Loader2, X } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const closeModal = () => setIsOpen(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  // Modal component
  const NotificationModal = () => (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in"
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-4xl max-h-[90vh] glass-strong rounded-4xl shadow-primary-lg border border-border-light animate-scale-in"
          onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        >
          {/* Header */}
          <div className="bg-primary-gradient text-white p-6 rounded-t-4xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={24} />
                <span className="font-bold text-xl">Matangazo</span>
              </div>
              <div className="flex items-center gap-4">
                {unreadCount > 0 && (
                  <span className="bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20">
                    {unreadCount} mpya
                  </span>
                )}
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
                >
                  <X size={20} className="text-white group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] bg-background-50">
            {isLoading ? (
              <div className="text-center py-20">
                <Loader2 size={48} className="text-primary-600 animate-spin mx-auto mb-6" />
                <p className="text-text-secondary font-medium text-lg">Inapakia matangazo...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-border-light">
                {notifications.map((notification, index) => (
                  <div
                    key={notification._id}
                    className={`
                      p-6 transition-all duration-200 hover:bg-primary-50/50 relative
                      ${!notification.isRead ? 'bg-background-100 border-l-4 border-primary-600' : 'bg-background-50'}
                      ${index === notifications.length - 1 ? 'rounded-b-4xl' : ''}
                    `}
                  >
                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div className="absolute top-6 right-6 w-3 h-3 bg-primary-600 rounded-full shadow-primary animate-pulse-soft" />
                    )}

                    <div className="space-y-4">
                      {/* Role Badge */}
                      <div className="flex items-center gap-2">
                        <span className="bg-primary-gradient text-white text-sm font-semibold px-4 py-2 rounded-xl">
                          {formatRoleName(notification.group)}
                        </span>
                      </div>
                      
                      {/* Message */}
                      <p className={`text-base leading-relaxed ${
                        notification.isRead ? 'text-text-secondary' : 'text-text-primary font-medium'
                      }`}>
                        {notification.message}
                      </p>
                      
                      {/* Timestamp */}
                      <div className="flex items-center gap-2 text-text-tertiary text-sm">
                        <Clock size={14} />
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
                      <div className="flex gap-3 pt-3">
                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              handleMarkAsRead(getLoggedInUserId() || "", notification._id)
                            }
                            className="btn-primary text-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <Check size={14} />
                            Soma
                          </button>
                        )}
                        
                        <button
                          onClick={() =>
                            handleDeleteNotification(getLoggedInUserId() || "", notification._id)
                          }
                          className="bg-transparent border border-error-500 text-error-500 hover:bg-error-500 hover:text-white text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Futa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-background-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BellOff size={32} className="text-text-muted" />
                </div>
                <h3 className="text-text-primary font-bold text-xl mb-3">
                  Hamna matangazo
                </h3>
                <p className="text-text-secondary text-base">
                  Matangazo mapya yataonekana hapa
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
      
      <div className="relative">
        {/* Notification Toggle Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-12 h-12 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary group"
        >
          <Bell size={20} className="text-primary-700 group-hover:text-primary-800 transition-colors duration-300" />
          
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse-soft">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Render Modal using React Portal */}
        {mounted && isOpen && createPortal(
          <NotificationModal />,
          document.body
        )}
      </div>

      {/* Additional CSS for animations (add to your global styles) */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}