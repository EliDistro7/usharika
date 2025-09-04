'use client';

import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

const Notification = ({ notifications, group, userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [notificationList, setNotificationList] = useState(notifications);
  const [isLoading, setIsLoading] = useState(false);

  // Get notification icon based on type/content
  const getNotificationIcon = (message, group) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('pray') || lowerMessage.includes('sala')) {
      return <FaPray className="text-info" size={18} />;
    }
    if (lowerMessage.includes('donation') || lowerMessage.includes('michango')) {
      return <FaDonate className="text-success" size={18} />;
    }
    if (lowerMessage.includes('meeting') || lowerMessage.includes('mkutano')) {
      return <FaUsers className="text-primary" size={18} />;
    }
    if (lowerMessage.includes('announce') || lowerMessage.includes('tangazo')) {
      return <FaBullhorn className="text-warning" size={18} />;
    }
    if (lowerMessage.includes('event') || lowerMessage.includes('hafla')) {
      return <FaCalendarAlt className="text-purple" size={18} />;
    }
    
    return <FaChurch className="text-purple" size={18} />;
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

  // Get priority class based on notification content
  const getPriorityClass = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('urgent') || lowerMessage.includes('haraka')) {
      return 'border-danger bg-danger-subtle';
    }
    if (lowerMessage.includes('important') || lowerMessage.includes('muhimu')) {
      return 'border-warning bg-warning-subtle';
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
      // Pinned notifications first, then by date
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (a.status === 'unread' && b.status === 'read') return -1;
      if (a.status === 'read' && b.status === 'unread') return 1;
      return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
    });

  return (
    <>
      {/* Custom CSS for Notification Component */}
      <style jsx>{`
        .notification-panel {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
          border: 1px solid rgba(157, 78, 221, 0.1);
     
          box-shadow: 0 10px 40px rgba(157, 78, 221, 0.15);
          max-height: 400px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(157, 78, 221, 0.3) transparent;
        }
        
        .notification-panel::-webkit-scrollbar {
          width: 6px;
        }
        
        .notification-panel::-webkit-scrollbar-track {
          background: rgba(157, 78, 221, 0.1);
          border-radius: 3px;
        }
        
        .notification-panel::-webkit-scrollbar-thumb {
          background: rgba(157, 78, 221, 0.3);
          border-radius: 3px;
        }
        
        .notification-item {
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .notification-item:hover {
          transform: translateX(5px);
          box-shadow: 0 5px 20px rgba(157, 78, 221, 0.15);
          border-left-color: #9d4edd;
        }
        
        .notification-item.unread {
          border-left-color: #9d4edd;
          background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
        }
        
        .notification-item.pinned {
          background: linear-gradient(135deg, #fff3cd 0%, #fefefe 100%);
          border-left-color: #ffd700;
        }
        
        .notification-item.priority-high {
          border-left-color: #dc3545;
          background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
        }
        
        .notification-item.priority-medium {
          border-left-color: #ffc107;
          background: linear-gradient(135deg, #fffbf0 0%, #ffffff 100%);
        }
        
        .status-indicator {
          animation: pulse 2s infinite;
        }
        
        .pinned-indicator {
          color: #ffd700;
          animation: bounce 1s infinite;
        }
        
        .notification-badge {
          background: linear-gradient(135deg, #9d4edd, #c77dff);
          font-size: 0.7rem;
          padding: 2px 8px;
        }
        
        .action-btn {
          transition: all 0.2s ease;
          border: 1px solid rgba(157, 78, 221, 0.2);
        }
        
        .action-btn:hover {
          background: rgba(157, 78, 221, 0.1);
          border-color: #9d4edd;
          transform: scale(1.05);
        }
        
        .text-purple { color: #9d4edd !important; }
        
        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #6c757d;
        }
        
        .notification-title {
          background: linear-gradient(135deg, #9d4edd, #c77dff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          60% { transform: translateY(-3px); }
        }
        
        .loading-spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="notification-panel rounded-4 border-0 p-0" style={{ minWidth: "350px", maxWidth: "400px" }}>
        {/* Header */}
        <div className="p-3 border-bottom border-light">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <MdNotificationsActive className="text-purple me-2" size={20} />
              <h6 className="notification-title fw-bold mb-0">
                Taarifa za {group}
              </h6>
            </div>
            <div className="d-flex align-items-center">
              <span className="notification-badge text-white rounded-pill">
                {filteredNotifications.filter(n => n.status === 'unread').length}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-2">
          {filteredNotifications.length > 0 ? (
            <div className="list-group list-group-flush">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item list-group-item border-0 rounded-3 mb-2 p-3 ${
                    notification.status === 'unread' ? 'unread' : ''
                  } ${notification.pinned ? 'pinned' : ''} ${getPriorityClass(notification.message)}`}
                >
                  <div className="d-flex align-items-start">
                    {/* Notification Icon & Status */}
                    <div className="flex-shrink-0 me-3">
                      <div className="position-relative">
                        {getNotificationIcon(notification.message, notification.group)}
                        {notification.status === 'unread' && (
                          <span
                            className="position-absolute top-0 start-100 translate-middle status-indicator rounded-circle bg-purple"
                            style={{ width: "8px", height: "8px" }}
                          ></span>
                        )}
                      </div>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex align-items-start justify-content-between mb-1">
                        <h6
                          className="notification-message fw-semibold text-dark mb-1 cursor-pointer"
                          onClick={() => handleNotificationClick(notification._id)}
                          style={{ fontSize: "0.9rem", lineHeight: "1.4" }}
                        >
                          {notification.message}
                          {notification.pinned && (
                            <BsPinFill className="pinned-indicator ms-2" size={12} />
                          )}
                        </h6>
                      </div>

                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="badge bg-light text-dark me-2" style={{ fontSize: "0.65rem" }}>
                            {notification.group}
                          </span>
                          <small className="text-muted d-flex align-items-center">
                            <BsClock className="me-1" size={12} />
                            {getTimeAgo(notification.createdAt || notification.date)}
                          </small>
                        </div>

                        {/* Action Dropdown */}
                        <div className="dropdown">
                          <button
                            className="btn btn-sm action-btn rounded-circle p-2"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ width: "32px", height: "32px" }}
                          >
                            <BsThreeDotsVertical size={12} />
                          </button>
                          
                          <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-1">
                            {notification.status === 'unread' && (
                              <li>
                                <button
                                  className="dropdown-item d-flex align-items-center py-2 px-3 rounded-2"
                                  onClick={() => handleMarkAsRead(notification._id)}
                                >
                                  <BsEye className="me-2 text-success" size={14} />
                                  <span style={{ fontSize: "0.85rem" }}>Weka Nimesoma</span>
                                </button>
                              </li>
                            )}
                            
                            <li>
                              <button
                                className="dropdown-item d-flex align-items-center py-2 px-3 rounded-2"
                                onClick={() => handlePinNotification(notification._id)}
                              >
                                {notification.pinned ? (
                                  <>
                                    <BsPin className="me-2 text-warning" size={14} />
                                    <span style={{ fontSize: "0.85rem" }}>Ondoa Pini</span>
                                  </>
                                ) : (
                                  <>
                                    <BsPinFill className="me-2 text-warning" size={14} />
                                    <span style={{ fontSize: "0.85rem" }}>Pini</span>
                                  </>
                                )}
                              </button>
                            </li>
                            
                            <li><hr className="dropdown-divider my-1" /></li>
                            
                            <li>
                              <button
                                className="dropdown-item d-flex align-items-center py-2 px-3 rounded-2 text-danger"
                                onClick={() => handleRemoveNotification(notification._id)}
                              >
                                <BsTrash className="me-2" size={14} />
                                <span style={{ fontSize: "0.85rem" }}>Futa</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaChurch className="text-muted mb-3" size={40} />
              <p className="mb-2 fw-medium">Hakuna taarifa</p>
              <small className="text-muted">
                Taarifa mpya zitaonekana hapa
              </small>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="p-3 border-top border-light text-center">
            <small className="text-muted d-flex align-items-center justify-content-center">
              <FaHeart className="text-danger me-1" size={12} />
              Church Management System
            </small>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="position-fixed top-50 start-50 translate-middle">
          <div className="bg-white rounded-3 p-3 shadow">
            <div className="d-flex align-items-center">
              <div className="loading-spinner me-2" style={{ 
                width: "20px", 
                height: "20px", 
                border: "2px solid #f3f3f3", 
                borderTop: "2px solid #9d4edd", 
                borderRadius: "50%" 
              }}></div>
              <span>Inapakia...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;