'use client';

import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
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
  const [showModal, setShowModal] = useState(false);
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

  const handleModalToggle = () => setShowModal((prev) => !prev);

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
      {/* Bell Button */}
      <button
        className="btn btn-light btn-square rounded-circle position-relative"
        onClick={handleModalToggle}
        aria-expanded={showModal}
        style={{
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <i
          className="fas fa-bell"
          style={{ color: "#6a1b9a", fontSize: "1.2rem" }}
        ></i>
        {notifications.length > 0 && (
          <span
            className="badge bg-danger position-absolute"
            style={{
              top: "5px",
              right: "5px",
              fontSize: "0.7rem",
              padding: "3px 6px",
            }}
          >
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notifications Modal */}
      <Modal
        show={showModal}
        onHide={handleModalToggle}
        centered
        backdrop="static"
        aria-labelledby="notifications-modal"
      >
        <Modal.Header closeButton style={{ backgroundColor: "#f3e8ff" }}>
          <Modal.Title id="notifications-modal" style={{ color: "#6a1b9a" }}>
            Notifications
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#faf5ff" }}>
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" style={{ color: "#6a1b9a" }}>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-muted text-center">Hamna matangazo</p>
          ) : (
            <ul className="list-group">
              {notifications.map((notification: any) => (
              <li
              key={notification._id}
              className="list-group-item border-0"
              style={{
                padding: "10px 15px",
                backgroundColor: notification.isRead ? "#f9f7fc" : "#ffffff",
                border: "1px solid #e3dced",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            >
              <div>
                <strong className="d-block" style={{ color: "#6a1b9a" }}>
                  {formatRoleName(notification.group)}
                </strong>
                <p
                  className="mb-0 text-muted"
                  style={{ fontSize: "0.85rem", lineHeight: "1.2" }}
                >
                  {notification.message}
                </p>
                <small className="text-muted d-block">
                  {new Date(notification.time).toLocaleString()}
                </small>
                {/* Buttons Row */}
                <div
                  className="d-flex justify-content-start mt-2"
                  style={{
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
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
              </div>
            </li>
            
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#f3e8ff" }}>
          <Button
            variant="primary"
            onClick={handleModalToggle}
            style={{
              backgroundColor: "#6a1b9a",
              borderColor: "#6a1b9a",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            funga
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
