'use client';

import React, { useState, useEffect } from 'react';
import { markNotificationAsRead,removeNotification,pinNotification } from '@/actions/users'; // Adjust your import paths
import { BsBell, BsCheckCircle, BsCircle } from 'react-icons/bs';
import { getLoggedInUserId } from '@/hooks/useUser';
import axios from 'axios';

const Notification = ({ notifications, group, userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedUserId, setSelectedUserId] = useState(null); // Track selected user
  const [notificationList, setNotificationList] = useState(notifications);


  const handlePinNotification = async (notificationId) => {
    try {
      // Optimistically update the UI
      setNotificationList((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, pinned: true }
            : notification
        )
      );
  
      // Update the backend
      await pinNotification({ userId: getLoggedInUserId(), notificationId });
    } catch (error) {
      console.error('Error pinning notification:', error);
  
      // Revert optimistic UI update in case of error
      setNotificationList((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, pinned: false }
            : notification
        )
      );
    }
  };
  

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Optimistically update the UI
      setNotificationList((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, status: 'read' }
            : notification
        )
      );

      // Update the backend
      await markNotificationAsRead({ userId:getLoggedInUserId(), notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);

      // Revert optimistic UI update in case of error
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
      // Remove from UI optimistically
      setNotificationList((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );

      // Remove from backend
      await removeNotification({ userId:getLoggedInUserId(), notificationId });
    } catch (error) {
      console.error('Error removing notification:', error);

      // Revert optimistic UI update in case of error
      // You may choose to handle this differently if you need
    }
  };



  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/${userId}`); // Adjust URL as needed
      setUser(response.data);
      console.log('user data', response.data)
      setShowModal(true); // Show modal after user data is fetched
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError("Failed to load user data. Please try again.");
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleNotificationClick = (notificationId) => {
    fetchUserById(notificationId); // Fetch the user details when the notification is clicked
  };

  return (
    <div className="container-fluid">
      {/* Notifications Dropdown */}
      <div className="modal-overlay d-flex align-items-center justify-content-center">
        {notificationList.length > 0 ? (
          <ul className="list-group">
            {notificationList.map((notification) => {
              if (notification.group === group) {
                return (
                  <li
  key={notification._id}
  className={`list-group-item d-flex justify-content-between align-items-center p-3 mb-3 rounded-3 shadow-sm ${
    notification.status === 'unread'
      ? 'bg-light border-start border-4 border-warning'
      : 'bg-white'
  }`}
>
  <div className="d-flex align-items-center">
    {notification.status === 'unread' ? (
      <BsCircle className="text-warning me-3" size={20} />
    ) : (
      <BsCheckCircle className="text-success me-3" size={20} />
    )}
    <div>
      <h6
        className="mb-1 text-dark font-weight-bold cursor-pointer"
        onClick={() => handleNotificationClick(notification._id)}
      >
        {notification.message}
        <span className="badge bg-secondary ms-2">{notification.group}</span>
      </h6>
      <small className="text-muted">
        {notification.status === 'unread' ? 'Mpya' : 'Tayari Imesomwa'}
      </small>
    </div>
  </div>
  <div className="dropdown">
    <button
      className="btn btn-sm btn-outline-secondary dropdown-toggle"
      type="button"
      id={`dropdownMenuButton-${notification._id}`}
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Actions
    </button>
    <ul
      className="dropdown-menu dropdown-menu-end"
      aria-labelledby={`dropdownMenuButton-${notification._id}`}
    >
      {notification.status === 'unread' && (
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleMarkAsRead(notification._id)}
          >
            Mark as Read
          </button>
        </li>
      )}
      {!notification.pinned && (
        <li>
          <button
            className="dropdown-item"
            onClick={() => handlePinNotification(notification._id)}
          >
            Pin
          </button>
        </li>
      )}
      {notification.pinned && (
        <li>
          <button className="dropdown-item" disabled>
            Pinned
          </button>
        </li>
      )}
      <li>
        <button
          className="dropdown-item text-danger"
          onClick={() => handleRemoveNotification(notification._id)}
        >
          Remove
        </button>
      </li>
    </ul>
  </div>
</li>

                );
              }
              return null;
            })}
          </ul>
        ) : (
          <p className="text-muted text-center">No notifications available</p>
        )}
      </div>
    </div>
  );
  
};

export default Notification;
