'use client';

import React, { useState, useEffect } from 'react';
import { fetchAdminById, markNotificationAsRead, deleteNotification } from '@/actions/admin';
import { Bell, CheckCircle, Circle, User, Trash2, Eye, X } from 'lucide-react';
import FullUserModal from '@/components/admin/FullUserModal';
import axios from 'axios';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notific, setCurrentNotification] = useState(null);
  const adminId = process.env.NEXT_PUBLIC_MKUU;

  // Fetch admin notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const adminData = await fetchAdminById(adminId);
        console.log(adminData?.admin.registeringNotifications);
        setNotifications(adminData?.admin.registeringNotifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, [adminId]);

  const handleMarkAsRead = async (userId) => {
    try {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.userId === userId
            ? { ...notification, status: 'read' }
            : notification
        )
      );
      await markNotificationAsRead({ userId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.userId === userId
            ? { ...notification, status: 'unread' }
            : notification
        )
      );
    }
  };

  const handleDeleteNotification = async (userId) => {
    try {
      setNotifications((prev) =>
        prev.filter((notification) => notification.userId !== userId)
      );
      await deleteNotification({ userId });
      console.log('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
      const adminData = await fetchAdminById(adminId);
      setNotifications(adminData?.admin.registeringNotifications || []);
    }
  };

  const fetchUserById = async (userId, notif) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/${userId}`);
      console.log('user data:', response.data);
      setUser(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError("Failed to load user data. Please try again.");
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleNotificationClick = (userId, notification) => {
    setCurrentNotification(notification);
    fetchUserById(userId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.notification-wrapper')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-3">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="relative notification-wrapper" style={{zIndex: 2000}}>
      {/* Enhanced Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative bg-primary-gradient rounded-xl p-3 shadow-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary-lg border-none z-[10000]"
      >
        <Bell size={20} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-error-500 to-error-600 text-white text-[10px] font-bold rounded-full px-2 py-0.5 border-2 border-white shadow-soft">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Enhanced Notifications Dropdown */}
      {showDropdown && (
        <div
          className="absolute mt-3 right-0 w-96 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-primary-200 shadow-primary-lg max-h-[500px] overflow-y-auto animate-slide-down"
          style={{zIndex: 1000}}
        >
          {/* Header */}
          <div className="bg-primary-gradient rounded-t-2xl px-5 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Bell size={18} className="text-white mr-2" />
              <h6 className="font-bold text-white mb-0">Taarifa</h6>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="bg-white text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {unreadCount} mpya
                </span>
              )}
              <button
                onClick={toggleDropdown}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={notification._id || index}
                  className={`
                    border-b border-primary-100 px-5 py-4 transition-all duration-300 cursor-pointer
                    ${notification.status === 'unread' 
                      ? 'bg-gradient-to-r from-primary-50/50 to-lavender-50/50 border-l-4 border-l-primary-500' 
                      : 'hover:bg-primary-50/30'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {notification.status === 'unread' ? (
                        <Circle size={16} className="text-primary-500" />
                      ) : (
                        <CheckCircle size={16} className="text-success-500" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="flex items-start justify-between mb-2 cursor-pointer"
                        onClick={() => handleNotificationClick(notification.userId, notification)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User size={16} className="text-primary-500" />
                            <h6 className="font-semibold text-text-primary mb-0">
                              {notification.name}
                            </h6>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {notification.type === 'registeringNotification' && (
                              <span className="bg-primary-gradient text-white text-[10px] font-semibold rounded-xl px-2 py-1">
                                Maombi ya Usajili
                              </span>
                            )}
                            {notification.type === 'kujiungaKikundi' && (
                              <span className="bg-gradient-to-r from-success-500 to-success-600 text-white text-[10px] font-semibold rounded-xl px-2 py-1">
                                Kujiunga Kikundi
                              </span>
                            )}
                          </div>
                          
                          <small className="text-text-tertiary flex items-center gap-1">
                            {notification.status === 'unread' ? (
                              <>
                                <Circle size={8} className="text-primary-500" />
                                Haijasomwa
                              </>
                            ) : (
                              <>
                                <CheckCircle size={8} className="text-success-500" />
                                Imesomwa
                              </>
                            )}
                          </small>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {notification.status === 'unread' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.userId);
                            }}
                            className="bg-primary-gradient text-white text-xs font-medium rounded-lg px-3 py-1.5 shadow-primary transition-all duration-300 hover:scale-105 flex items-center"
                          >
                            <Eye size={12} className="mr-1" />
                            Soma
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.userId);
                          }}
                          className="bg-gradient-to-r from-error-500 to-error-600 text-white text-xs font-medium rounded-lg px-3 py-1.5 shadow-soft transition-all duration-300 hover:scale-105 flex items-center"
                        >
                          <Trash2 size={12} className="mr-1" />
                          Futa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell size={48} className="text-text-muted mx-auto mb-3 opacity-30" />
                <p className="text-text-tertiary mb-0">Hamna taarifa</p>
                <small className="text-text-muted">Taarifa zitaonekana hapa</small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full User Modal */}
      {showModal && (
        <FullUserModal
          user={user}
          onClose={() => setShowModal(false)}
          notification={notific}
        />
      )}

      {/* Custom CSS for animations and scrollbar */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        .notification-wrapper .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .notification-wrapper .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(168, 85, 247, 0.1);
          border-radius: 3px;
        }

        .notification-wrapper .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #A855F7 0%, #9333EA 100%);
          border-radius: 3px;
        }

        .notification-wrapper .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
        }
      `}</style>
    </div>
  );
};

export default Notification;