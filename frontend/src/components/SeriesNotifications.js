'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown, Badge, Spinner } from 'react-bootstrap';
import { getUser } from '@/hooks/useUser';
import Link from 'next/link';
import { BookOpen, Bell, Check, Clock, User } from 'lucide-react';
import { toast } from 'react-toastify';

const SeriesNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState(new Set());

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
    <Dropdown align="end">
      <Dropdown.Toggle
        as="div"
        role="button"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#4a5568',
          padding: '0.5rem',
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
        className="notification-toggler"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f7fafc';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}
      >
        <BookOpen size={20} strokeWidth={2} />

        {unreadCount > 0 && (
          <Badge
            bg="danger"
            className="position-absolute"
            style={{
              fontSize: '0.7rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '10px',
              top: '-4px',
              right: '-4px',
              minWidth: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        style={{
          minWidth: '380px',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          border: 'none',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '0',
          marginTop: '8px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} />
            <span style={{ fontWeight: '600', fontSize: '1rem' }}>
              Series Notifications
            </span>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {loading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                color: '#718096',
              }}
            >
              <Spinner animation="border" size="sm" className="me-2" />
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <div
                key={notif._id}
                style={{
                  borderBottom: index === notifications.length - 1 ? 'none' : '1px solid #e2e8f0',
                }}
              >
                <Dropdown.Item
                  as="div"
                  style={{
                    display: 'block',
                    backgroundColor: '#ffffff',
                    color: '#2d3748',
                    fontSize: '0.9rem',
                    padding: '0',
                    borderRadius: '0',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    position: 'relative',
                  }}
                  className="hover-effect"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <Link 
                    href={`/series/${notif.seriesId}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    onClick={() => handleNotificationClick(notif._id)}
                  >
                    <div style={{ padding: '1rem 1.25rem', position: 'relative' }}>
                      {/* Unread indicator */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '0.5rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: '#3182ce',
                        }}
                      />
                      
                      <div style={{ marginLeft: '1rem' }}>
                        {/* Title and Author */}
                        <div
                          style={{
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            color: '#2d3748',
                            marginBottom: '0.25rem',
                            lineHeight: '1.4',
                          }}
                        >
                          {notif.title}
                        </div>
                        
                        {/* Author */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: '#718096',
                            fontSize: '0.8rem',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <User size={12} />
                          <span>by {notif.author}</span>
                        </div>
                        
                        {/* Timestamp */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: '#a0aec0',
                            fontSize: '0.75rem',
                          }}
                        >
                          <Clock size={12} />
                          <span>{new Date(notif.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Loading state for individual notification */}
                      {markingAsRead.has(notif._id) && (
                        <div
                          style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                        >
                          <Spinner animation="border" size="sm" />
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
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      top: '0.5rem',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.25rem',
                      cursor: 'pointer',
                      opacity: '0',
                      transition: 'opacity 0.2s',
                      color: '#718096',
                    }}
                    className="mark-read-btn"
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <Check size={14} />
                  </button>
                </Dropdown.Item>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                color: '#a0aec0',
                fontSize: '0.9rem',
              }}
            >
              <BookOpen 
                size={48} 
                style={{ 
                  color: '#e2e8f0', 
                  marginBottom: '1rem',
                  display: 'block',
                  margin: '0 auto 1rem auto'
                }} 
              />
              <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                No notifications
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                You're all caught up with your series!
              </div>
            </div>
          )}
        </div>
      </Dropdown.Menu>

      {/* Custom styles */}
      <style jsx>{`
        .dropdown-item:hover .mark-read-btn {
          opacity: 1 !important;
        }
        
        .notification-toggler:hover {
          animation: subtle-bounce 0.6s ease-in-out;
        }
        
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        .dropdown-menu {
          animation: slideDown 0.3s ease-out;
        }
        
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
      `}</style>
    </Dropdown>
  );
};

export default SeriesNotifications;