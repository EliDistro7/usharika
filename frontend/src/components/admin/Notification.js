'use client';

import React, { useState, useEffect } from 'react';
import { fetchAdminById, markNotificationAsRead } from '@/actions/admin'; // Adjust your import paths

import { BsBell, BsCheckCircle, BsCircle } from 'react-icons/bs';
import FullUserModal from '@/components/admin/FullUserModal';
import axios from 'axios';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedUserId, setSelectedUserId] = useState(null); // Track selected user
  const adminId = process.env.NEXT_PUBLIC_MKUU; // Replace with dynamic admin ID if necessary

  // Fetch admin notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const adminData = await fetchAdminById(adminId);
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
      // Optimistically update the UI
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.userId === userId
            ? { ...notification, status: 'read' }
            : notification
        )
      );

      // Update the backend
      await markNotificationAsRead({ userId });
    } catch (error) {
      console.error('Error marking notification as read:', error);

      // Revert optimistic UI update in case of error
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.userId === userId
            ? { ...notification, status: 'unread' }
            : notification
        )
      );
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/${userId}`); // Adjust URL as needed
      console.log('user data', response.data)
      setUser(response.data);
      setShowModal(true); // Show modal after user data is fetched
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError("Failed to load user data. Please try again.");
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleNotificationClick = (userId) => {
    fetchUserById(userId); // Fetch the user details when the notification is clicked
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="position-relative">
      {/* Bell Icon */}
      <button
        className="btn btn-light position-relative"
        onClick={toggleDropdown}
      >
        <BsBell className="text-primary fs-4" />
        {notifications.length > 0 && (
          <span className="badge rounded-pill bg-danger position-absolute top-0 end-0">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showDropdown && (
        <div
          className="notification-container bg-white shadow-sm p-4 rounded position-absolute mt-2"
          style={{ width: '300px', right: 0, zIndex: 1050 }}
        >
          <h6 className="fw-bold mb-3 text-primary">Notifications</h6>
          {notifications.length > 0 ? (
            <ul className="list-group">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    notification.status === 'unread' ? 'bg-light border-start border-primary border-4' : ''
                  }`}
                >
                  <div className="d-flex align-items-center">
                    {notification.status === 'unread' ? (
                      <BsCircle className="text-primary me-3" />
                    ) : (
                      <BsCheckCircle className="text-success me-3" />
                    )}
                    <div>
                      <h6 className="mb-1" onClick={() => handleNotificationClick(notification.userId)}>
                        {notification.name}
                        {/* Badge for registration requests */}
                        {notification.type === 'registering' && (
                          <span className="badge bg-warning ms-2">maombi ya usajili</span>
                        )}
                      </h6>
                      <small className={`text-muted`}>
                        {notification.status === 'unread' ? 'New' : 'Read'}
                      </small>
                    </div>
                  </div>
                  {notification.status === 'unread' && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleMarkAsRead(notification.userId)}
                    >
                      Mark as Read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center">No notifications available</p>
          )}
        </div>
      )}

      {/* Full User Modal */}
      {showModal && <FullUserModal user={user} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Notification;
