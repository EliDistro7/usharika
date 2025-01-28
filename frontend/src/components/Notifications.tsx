'use client';

import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { getLoggedInUserId } from "@/hooks/useUser";
import { getUserNotifications } from "@/actions/users";
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

  return (
    <>
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
        <Modal.Header closeButton>
          <Modal.Title id="notifications-modal">Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-muted text-center">No notifications</p>
          ) : (
            <ul className="list-group">
              {notifications.map((notification: any) => (
                <li
                  key={notification._id}
                  className="list-group-item border-0"
                  style={{ padding: "10px 0" }}
                >
                  <strong className="d-block">{formatRoleName(notification.group)}</strong>
                  <p
                    className="mb-0 text-muted"
                    style={{ fontSize: "0.85rem", lineHeight: "1.2" }}
                  >
                    {notification.message}
                  </p>
                  <small className="text-muted d-block">
                    {new Date(notification.time).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalToggle}>
            
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
