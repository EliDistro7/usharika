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
        <p>Unafuta tangazo hili?</p>
        <div className="d-flex justify-content-end">
          <Button
            size="sm"
            variant="danger"
            onClick={async () => {
              try {
                await removeNotification({ userId, notificationId: id });
                setNotifications((prev) => prev.filter((n) => n._id !== id));
                toast.success("Notification deleted successfully.");
              } catch (error) {
                toast.error("Failed to delete the notification. Please try again.");
              }
            }}
            style={{ marginRight: "5px" }}
          >
            Yes
          </Button>
          <Button size="sm" variant="secondary" onClick={() => toast.dismiss()}>
            No
          </Button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const handleMarkAsRead = async (userId: string, id: string) => {
    try {
      await markNotificationAsRead({ userId, notificationId: id });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      toast.info("Tangazo limeshasomwa.");
    } catch (error) {
      toast.error("Failed to mark the notification as read. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      
      <Dropdown align="end">
        <Dropdown.Toggle
          as="div"
          role="button"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#333',
            padding: '0.5rem',
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            transition: 'background-color 0.2s',
          }}
          className="notification-toggler"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <i className="fas fa-bell fs-5"></i>

          {notifications.length > 0 && (
            <Badge
              bg="danger"
              className="position-absolute top-0 start-100 translate-middle"
              style={{
                fontSize: '0.75rem',
                padding: '0.3rem 0.5rem',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {notifications.length}
            </Badge>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu
          style={{
            minWidth: '350px',
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '0',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1rem',
              fontWeight: 'bold',
              borderBottom: '1px solid #ddd',
              color: '#333',
            }}
          >
            Notifications
          </div>

          {isLoading ? (
            <div className="text-center p-3">
              <Spinner animation="border" role="status" style={{ color: "#6a1b9a" }}>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <Dropdown.Item
                key={notification._id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  backgroundColor: notification.isRead ? "#f9f7fc" : "#ffffff",
                  color: '#333',
                  fontSize: '0.9rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0',
                  transition: 'background-color 0.2s',
                  borderBottom: '1px solid #eee',
                }}
                className="hover-effect"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <strong style={{ color: "#6a1b9a" }}>
                  {formatRoleName(notification.group)}
                </strong>
                {notification.message}
                <small style={{ color: '#888', fontSize: '0.8rem' }}>
                  {new Date(notification.time).toLocaleString()}
                </small>
                
                {/* Buttons Row */}
                <div
                  className="d-flex justify-content-start mt-2"
                  style={{ gap: "10px", flexWrap: "wrap" }}
                >
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() =>
                      handleMarkAsRead(getLoggedInUserId() || "", notification._id)
                    }
                  >
                    Mark as Read
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() =>
                      handleDeleteNotification(getLoggedInUserId() || "", notification._id)
                    }
                  >
                    Futa
                  </Button>
                </div>
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item
              style={{
                textAlign: 'center',
                padding: '1rem',
                color: '#888',
                fontSize: '0.9rem',
              }}
            >
              Hamna matangazo
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
