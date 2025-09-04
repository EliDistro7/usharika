'use client';

import React, { useState, useEffect } from 'react';
import { fetchAdminById, markNotificationAsRead, deleteNotification } from '@/actions/admin';
import { Bell, CheckCircle, Circle, User, Trash2, Eye, X } from 'lucide-react';
import FullUserModal from '@/components/admin/FullUserModal';
import axios from 'axios';
//import {fetchUserById} from '@/actions/users';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notific, setCurrentNotification] = useState(null);
  const adminId = process.env.NEXT_PUBLIC_MKUU;

  // Enhanced custom styles
  const customStyles = {
    bellButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '12px',
      padding: '12px',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
      transition: 'all 0.3s ease',
      position: 'relative'
    },
    badge: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
      color: 'white',
      fontSize: '10px',
      fontWeight: 'bold',
      borderRadius: '10px',
      padding: '2px 8px',
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      border: '2px solid white',
      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
    },
    dropdown: {
      background: 'rgba(255, 255, 255, 0.95)',
    
      borderRadius: '16px',
      border: '1px solid rgba(102, 126, 234, 0.2)',
      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
      width: '380px',
      maxHeight: '500px',
      overflowY: 'auto'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px 16px 0 0',
      padding: '16px 20px',
      borderBottom: 'none'
    },
    notificationItem: {
      background: 'transparent',
      border: 'none',
      borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
      padding: '16px 20px',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    unreadItem: {
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
      borderLeft: '4px solid #667eea'
    },
    actionButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '8px',
      padding: '6px 12px',
      color: 'white',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
    },
    deleteButton: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
      border: 'none',
      borderRadius: '8px',
      padding: '6px 12px',
      color: 'white',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.2)'
    },
    badge1: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '10px',
      fontWeight: '600',
      borderRadius: '12px',
      padding: '4px 8px',
      border: 'none'
    },
    badge2: {
      background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
      color: 'white',
      fontSize: '10px',
      fontWeight: '600',
      borderRadius: '12px',
      padding: '4px 8px',
      border: 'none'
    }
  };

  // Fetch admin notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const adminData = await fetchAdminById(adminId);
        console.log(adminData?.admin.registeringNotifications)
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
    setCurrentNotification(notification)
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
      <div className="d-flex justify-content-center align-items-center py-3">
        <div 
          className="spinner-border" 
          role="status"
          style={{color: '#667eea', width: '24px', height: '24px'}}
        >
          <span className="visually-hidden">Inapakia...</span>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="position-relative notification-wrapper" style={{zIndex:2000}} >
      {/* Enhanced Bell Button */}
      <button
        style={customStyles.bellButton}
        onClick={toggleDropdown}
        className="position-relative"
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
        }}
      >
        <Bell size={20} className="text-white" />
        {unreadCount > 0 && (
          <span style={customStyles.badge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Enhanced Notifications Dropdown */}
      {showDropdown && (
        <div
        
          className="position-absolute mt-3 notification-dropdown"
          style={{
            ...customStyles.dropdown,
            right: 0,
            zIndex: 1000,
            top: '100%',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div style={customStyles.header} className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Bell size={18} className="text-white me-2" />
              <h6 className="fw-bold mb-0 text-white">Taarifa</h6>
            </div>
            <div className="d-flex align-items-center gap-2">
              {unreadCount > 0 && (
                <span className="badge bg-white text-purple px-2 py-1 rounded-pill">
                  {unreadCount} mpya
                </span>
              )}
              <button
                onClick={toggleDropdown}
                className="btn btn-link text-white p-0"
                style={{border: 'none', background: 'none'}}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="notification-list" style={{maxHeight: '400px', overflowY: 'auto'}}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={notification._id || index}
                  style={{
                    ...customStyles.notificationItem,
                    ...(notification.status === 'unread' ? customStyles.unreadItem : {})
                  }}
                  className="notification-item"
                  onMouseEnter={(e) => {
                    if (notification.status === 'read') {
                      e.target.style.background = 'rgba(102, 126, 234, 0.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (notification.status === 'read') {
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  <div className="d-flex align-items-start gap-3">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {notification.status === 'unread' ? (
                        <Circle size={16} style={{color: '#667eea'}} />
                      ) : (
                        <CheckCircle size={16} style={{color: '#51cf66'}} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow-1">
                      <div
                        className="d-flex align-items-start justify-content-between mb-2"
                        onClick={() => handleNotificationClick(notification.userId, notification)}
                        style={{cursor: 'pointer'}}
                      >
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <User size={16} style={{color: '#667eea'}} />
                            <h6 className="mb-0 fw-semibold" style={{color: '#2d3748'}}>
                              {notification.name}
                            </h6>
                          </div>
                          
                          <div className="d-flex flex-wrap gap-1 mb-2">
                            {notification.type === 'registeringNotification' && (
                              <span style={customStyles.badge1}>
                                Maombi ya Usajili
                              </span>
                            )}
                            {notification.type === 'kujiungaKikundi' && (
                              <span style={customStyles.badge2}>
                                Kujiunga Kikundi
                              </span>
                            )}
                          </div>
                          
                          <small className="text-muted d-flex align-items-center gap-1">
                            {notification.status === 'unread' ? (
                              <>
                                <Circle size={8} style={{color: '#667eea'}} />
                                Haijasomwa
                              </>
                            ) : (
                              <>
                                <CheckCircle size={8} style={{color: '#51cf66'}} />
                                Imesomwa
                              </>
                            )}
                          </small>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        {notification.status === 'unread' && (
                          <button
                            style={customStyles.actionButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.userId);
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            <Eye size={12} className="me-1" />
                            Soma
                          </button>
                        )}
                        <button
                          style={customStyles.deleteButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.userId);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          <Trash2 size={12} className="me-1" />
                          Futa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <Bell size={48} className="text-muted mb-3" style={{opacity: 0.3}} />
                <p className="text-muted mb-0">Hamna taarifa</p>
                <small className="text-muted">Taarifa zitaonekana hapa</small>
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

      {/* Custom CSS for animations */}
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

        .notification-dropdown::-webkit-scrollbar {
          width: 6px;
        }

        .notification-dropdown::-webkit-scrollbar-track {
          background: rgba(102, 126, 234, 0.1);
          border-radius: 3px;
        }

        .notification-dropdown::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
        }

        .notification-dropdown::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }

        .notification-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default Notification;