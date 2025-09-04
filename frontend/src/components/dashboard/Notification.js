'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { markNotificationAsRead, removeNotification, pinNotification } from '@/actions/users';
import { 
  BsBell, 
  BsCheckCircle, 
  BsCircle, 
  BsPin, 
  BsPinFill,
  BsTrash,
  BsEye,
  BsThreeDotsVertical,
  BsClock,
  BsExclamationCircle
} from 'react-icons/bs';
import { 
  FaChurch, 
  FaPray, 
  FaHeart, 
  FaUsers, 
  FaBullhorn,
  FaCalendarAlt,
  FaDonate
} from 'react-icons/fa';
import { MdNotifications, MdNotificationsActive } from 'react-icons/md';
import { getLoggedInUserId } from '@/hooks/useUser';
import { Bell, X } from 'lucide-react';
import axios from 'axios';

const Notification = ({ notifications, group, userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [notificationList, setNotificationList] = useState(notifications);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (for Next.js SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Get notification icon based on type/content
  const getNotificationIcon = (message, group) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('pray') || lowerMessage.includes('sala')) {
      return <FaPray className="text-blue-500" size={18} />;
    }
    if (lowerMessage.includes('donation') || lowerMessage.includes('michango')) {
      return <FaDonate className="text-green-500" size={18} />;
    }
    if (lowerMessage.includes('meeting') || lowerMessage.includes('mkutano')) {
      return <FaUsers className="text-primary-600" size={18} />;
    }
    if (lowerMessage.includes('announce') || lowerMessage.includes('tangazo')) {
      return <FaBullhorn className="text-yellow-500" size={18} />;
    }
    if (lowerMessage.includes('event') || lowerMessage.includes('hafla')) {
      return <FaCalendarAlt className="text-purple-500" size={18} />;
    }
    
    return <FaChurch className="text-purple-600" size={18} />;
  };

  // Format time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Sasa hivi';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika zilizopita`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} saa zilizopita`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} siku zilizopita`;
    
    return notificationDate.toLocaleDateString('sw-TZ');
  };

  // Get priority styles based on notification content
  const getPriorityStyles = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('urgent') || lowerMessage.includes('haraka')) {
      return 'border-l-4 border-l-error-500 bg-error-50';
    }
    if (lowerMessage.includes('important') || lowerMessage.includes('muhimu')) {
      return 'border-l-4 border-l-warning-500 bg-warning-50';
    }
    return '';
  };

  const handlePinNotification = async (notificationId) => {
    try {
      setNotificationList((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, pinned: !notification.pinned }
            : notification
        )
      );

      await pinNotification({ userId: getLoggedInUserId(), notificationId });
    } catch (error) {
      console.error('Error pinning notification:', error);
      setNotificationList((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, pinned: !notification.pinned }
            : notification
        )
      );
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setNotificationList((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, status: 'read' }
            : notification
        )
      );

      await markNotificationAsRead({ userId: getLoggedInUserId(), notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setNotificationList((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, status: 'unread' }
            : notification
        )
      );
    }
  };

  const handleRemoveNotification = async (notificationId) => {
    try {
      setNotificationList((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );

      await removeNotification({ userId: getLoggedInUserId(), notificationId });
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/${userId}`);
      setUser(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError("Failed to load user data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = (notificationId) => {
    fetchUserById(notificationId);
  };

  // Filter and sort notifications
  const filteredNotifications = notificationList
    .filter(notification => notification.group === group)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (a.status === 'unread' && b.status === 'read') return -1;
      if (a.status === 'read' && b.status === 'unread') return 1;
      return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
    });

  const unreadCount = filteredNotifications.filter(n => n.status === 'unread').length;

  // Modal component
  const Modal = () => (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={() => setShowModal(false)}
      />
      
      {/* Modal Content - Full Screen */}
      <div className="relative w-full h-full bg-light-gradient overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-primary-gradient text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-xl">
                  Taarifa za {group}
                </h2>
                <p className="text-white text-opacity-80 text-sm mt-1">
                  Fuata taarifa muhimu za kanisa
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">
                  {unreadCount} mpya
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 hover:border-opacity-40 rounded-lg p-2 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
          {filteredNotifications.length > 0 ? (
            <div className="p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`group bg-white rounded-xl transition-all duration-300 border hover:border-primary-300 hover:shadow-primary cursor-pointer ${
                      notification.status === 'unread' ? 'border-l-4 border-l-primary-600 bg-primary-50' : ''
                    } ${notification.pinned ? 'border-l-4 border-l-yellow-500 bg-yellow-50' : ''} ${getPriorityStyles(notification.message)}`}
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Notification Icon & Status */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            {getNotificationIcon(notification.message, notification.group)}
                            {notification.status === 'unread' && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-600 rounded-full animate-pulse-soft"></span>
                            )}
                          </div>
                        </div>

                        {/* Notification Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3
                              className="font-semibold text-text-primary text-lg leading-6 group-hover:text-primary-600 transition-colors duration-200 cursor-pointer"
                              onClick={() => handleNotificationClick(notification._id)}
                            >
                              {notification.message}
                              {notification.pinned && (
                                <BsPinFill className="inline ml-2 text-yellow-500 animate-gentle-float" size={14} />
                              )}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="px-2 py-1 bg-background-300 text-text-secondary rounded-lg text-xs font-medium">
                                {notification.group}
                              </span>
                              <div className="flex items-center text-text-tertiary text-sm">
                                <BsClock className="mr-1" size={12} />
                                {getTimeAgo(notification.createdAt || notification.date)}
                              </div>
                            </div>

                            {/* Action Dropdown */}
                            <div className="relative">
                              <button
                                className="flex items-center justify-center w-8 h-8 text-text-tertiary hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDropdown(showDropdown === notification._id ? null : notification._id);
                                }}
                              >
                                <BsThreeDotsVertical size={14} />
                              </button>
                              
                              {showDropdown === notification._id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-strong border border-border-light z-10">
                                  <div className="p-1">
                                    {notification.status === 'unread' && (
                                      <button
                                        className="flex items-center w-full px-3 py-2 text-sm text-text-secondary hover:text-success-600 hover:bg-success-50 rounded-lg transition-colors duration-200"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMarkAsRead(notification._id);
                                          setShowDropdown(null);
                                        }}
                                      >
                                        <BsEye className="mr-2" size={14} />
                                        Weka Nimesoma
                                      </button>
                                    )}
                                    
                                    <button
                                      className="flex items-center w-full px-3 py-2 text-sm text-text-secondary hover:text-warning-600 hover:bg-warning-50 rounded-lg transition-colors duration-200"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePinNotification(notification._id);
                                        setShowDropdown(null);
                                      }}
                                    >
                                      {notification.pinned ? (
                                        <>
                                          <BsPin className="mr-2" size={14} />
                                          Ondoa Pini
                                        </>
                                      ) : (
                                        <>
                                          <BsPinFill className="mr-2" size={14} />
                                          Pini
                                        </>
                                      )}
                                    </button>
                                    
                                    <div className="my-1 h-px bg-border-light"></div>
                                    
                                    <button
                                      className="flex items-center w-full px-3 py-2 text-sm text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveNotification(notification._id);
                                        setShowDropdown(null);
                                      }}
                                    >
                                      <BsTrash className="mr-2" size={14} />
                                      Futa
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-background-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaChurch className="w-10 h-10 text-text-tertiary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2 text-xl">
                  Hakuna taarifa
                </h3>
                <p className="text-text-secondary text-lg">
                  Taarifa mpya zitaonekana hapa
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="p-4 border-t border-border-light bg-white">
            <div className="text-center">
              <div className="flex items-center justify-center text-text-tertiary text-sm">
                <FaHeart className="text-error-500 mr-1" size={12} />
                Church Management System
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Notification Toggle Button */}
      <button
        onClick={() => setShowModal(true)}
        className="relative flex items-center justify-center w-10 h-10 bg-background-200 hover:bg-primary-50 rounded-lg transition-all duration-300 group"
      >
        <MdNotificationsActive className="w-5 h-5 text-text-secondary group-hover:text-primary-600 transition-colors duration-300" />

        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary-600 text-white text-xs font-semibold rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse-soft">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Portal Modal - Renders outside the Header */}
      {mounted && showModal && createPortal(<Modal />, document.body)}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000]">
          <div className="bg-white rounded-xl p-4 shadow-strong border border-border-light">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-background-300 border-t-primary-600 rounded-full animate-spin"></div>
              <span className="text-text-primary font-medium">Inapakia...</span>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-[1]"
          onClick={() => setShowDropdown(null)}
        />
      )}
    </>
  );
};

export default Notification;