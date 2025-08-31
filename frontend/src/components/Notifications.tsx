'use client';

import React, { useState, useEffect } from "react";
import { Dropdown, Badge, Button, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getLoggedInUserId } from "@/hooks/useUser";
import {
  getUserNotifications,
  markNotificationAsRead,
  removeNotification,
} from "@/actions/users";
import { formatRoleName } from "@/actions/utils";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);

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
      <div>
        <p className="mb-3 fw-medium">Unafuta tangazo hili?</p>
        <div className="d-flex justify-content-end gap-2">
          <Button
            size="sm"
            className="px-3"
            style={{
              backgroundColor: '#dc3545',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
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
          </Button>
          <Button 
            size="sm" 
            className="px-3"
            style={{
              backgroundColor: '#6c757d',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onClick={() => toast.dismiss()}
          >
            Hapana
          </Button>
        </div>
      </div>,
      { 
        autoClose: false,
        style: {
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
        }
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
        style: {
          background: 'linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)',
          color: 'white',
          borderRadius: '12px'
        }
      });
    } catch (error) {
      toast.error("Failed to mark the notification as read. Please try again.");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        toastStyle={{
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }}
      />
      
      <Dropdown align="end">
        <Dropdown.Toggle
          as="div"
          role="button"
          style={{
           
            border: '1px solid transparent',
            backgroundClip: 'padding-box',
            color: '#6f42c1',
            padding: '0.75rem',
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 16px rgba(111, 66, 193, 0.1)',
          }}
          className="notification-toggler"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(111, 66, 193, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)';
            e.currentTarget.style.color = '#6f42c1';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(111, 66, 193, 0.1)';
          }}
        >
          <i className="fas fa-bell" ></i>

          {unreadCount > 0 && (
            <Badge
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '600',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                minWidth: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
              }}
            >
              {unreadCount}
            </Badge>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu
          style={{
            minWidth: '380px',
            maxWidth: '420px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(111, 66, 193, 0.1)',
            padding: '0',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)',
              color: 'white',
              padding: '1rem 1.25rem',
              fontWeight: '600',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-bell"></i>
              <span>Matangazo</span>
            </div>
            {unreadCount > 0 && (
              <Badge 
                bg="light" 
                text="dark" 
                style={{ 
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}
              >
                {unreadCount} mpya
              </Badge>
            )}
          </div>

          {/* Content */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {isLoading ? (
              <div className="text-center p-4">
                <Spinner 
                  animation="border" 
                  role="status" 
                  style={{ 
                    color: "#6f42c1",
                    width: '2rem',
                    height: '2rem'
                  }}
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3 mb-0 text-muted">Inapakia matangazo...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <Dropdown.Item
                  key={notification._id}
                  style={{
                    background: notification.isRead 
                      ? 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' 
                      : 'linear-gradient(135deg, #ffffff 0%, #f8f4ff 100%)',
                    color: '#333',
                    fontSize: '0.9rem',
                    padding: '1rem 1.25rem',
                    borderRadius: '0',
                    transition: 'all 0.2s ease',
                    borderBottom: index < notifications.length - 1 ? '1px solid rgba(111, 66, 193, 0.1)' : 'none',
                    borderLeft: notification.isRead ? 'none' : '4px solid #6f42c1',
                    position: 'relative',
                  }}
                  className="hover-effect"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f0e6ff 0%, #f8f4ff 100%)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.isRead 
                      ? 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' 
                      : 'linear-gradient(135deg, #ffffff 0%, #f8f4ff 100%)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)',
                        boxShadow: '0 0 8px rgba(111, 66, 193, 0.5)',
                      }}
                    />
                  )}

                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <Badge
                        style={{
                          background: 'linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '8px',
                          textTransform: 'none',
                        }}
                      >
                        {formatRoleName(notification.group)}
                      </Badge>
                    </div>
                    
                    <p className="mb-2" style={{ 
                      lineHeight: '1.5',
                      color: '#2d3748',
                      fontWeight: notification.isRead ? '400' : '500'
                    }}>
                      {notification.message}
                    </p>
                    
                    <small style={{ 
                      color: '#6a737d', 
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <i className="fas fa-clock" style={{ fontSize: '0.7rem' }}></i>
                      {new Date(notification.time).toLocaleString('sw-TZ', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                    
                    {/* Action Buttons */}
                    <div className="d-flex gap-2 mt-2">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          style={{
                            background: 'linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            padding: '0.4rem 0.8rem',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(111, 66, 193, 0.2)',
                          }}
                          onClick={() =>
                            handleMarkAsRead(getLoggedInUserId() || "", notification._id)
                          }
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(111, 66, 193, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(111, 66, 193, 0.2)';
                          }}
                        >
                          <i className="fas fa-check me-1"></i>
                          Soma
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        style={{
                          background: 'transparent',
                          border: '1px solid #dc3545',
                          borderRadius: '8px',
                          color: '#dc3545',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          padding: '0.4rem 0.8rem',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() =>
                          handleDeleteNotification(getLoggedInUserId() || "", notification._id)
                        }
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#dc3545';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#dc3545';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Futa
                      </Button>
                    </div>
                  </div>
                </Dropdown.Item>
              ))
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1.5rem',
                  color: '#6a737d',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}
                >
                  <i 
                    className="fas fa-bell-slash" 
                    style={{ 
                      fontSize: '1.5rem', 
                      color: '#adb5bd' 
                    }}
                  ></i>
                </div>
                <h6 className="mb-2" style={{ color: '#495057', fontWeight: '600' }}>
                  Hamna matangazo
                </h6>
                <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                  Matangazo mapya yataonekana hapa
                </p>
              </div>
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .notification-toggler:hover {
          animation: none !important;
        }

        /* Custom scrollbar for notifications */
        .dropdown-menu div::-webkit-scrollbar {
          width: 4px;
        }

        .dropdown-menu div::-webkit-scrollbar-track {
          background: rgba(111, 66, 193, 0.1);
          border-radius: 2px;
        }

        .dropdown-menu div::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%);
          border-radius: 2px;
        }

        .dropdown-menu div::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a2d91 0%, #7c3aed 100%);
        }
      `}</style>
    </>
  );
}