'use client';

import React, { useState, useEffect } from 'react';
import { fetchAdminById, markNotificationAsRead, deleteNotification } from '@/actions/admin'; // Adjust your import paths
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
  const [notific, setCurrentNotification] = useState(null); //
  const adminId = process.env.NEXT_PUBLIC_MKUU; // Replace with dynamic admin ID if necessary

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

  const handleDeleteNotification = async (userId) => {
    try {
      // Optimistically update the UI
      setNotifications((prev) =>
        prev.filter((notification) => notification.userId !== userId)
      );

      // Update the backend
      await deleteNotification({ userId });
      console.log('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);

      // Reload notifications in case of error
      const adminData = await fetchAdminById(adminId);
      setNotifications(adminData?.admin.registeringNotifications || []);
    }
  };

  const fetchUserById = async (userId, notif) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/${userId}`); // Adjust URL as needed
      setUser(response.data);
     // setCurrentNotification(notif);
      setShowModal(true); // Show modal after user data is fetched
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError("Failed to load user data. Please try again.");
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleNotificationClick = (userId,notification) => {
   // console.log('notification clicked', userId, notification)
    setCurrentNotification(notification)
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
        className="btn btn-link position-relative p-0"
        onClick={toggleDropdown}
        style={{ border: 'none', outline: 'none' }}
      >
        <BsBell className="text-purple fs-4" /> {/* Changed to purple */}
        {notifications.length > 0 && (
          <span className="badge rounded-pill bg-purple position-absolute top-0 end-0">
            {notifications.length}
          </span>
        )}
      </button>
  
      {/* Notifications Dropdown */}
      {showDropdown && (
        <div
          className="notification-container bg-light-purple shadow-lg rounded position-absolute mt-2"
          style={{
            width: '320px',
            right: 0,
            zIndex: 100,
            top: '100%',
            border: '1px solid rgba(128, 0, 128, 0.1)', // Light purple border
          }}
        >
          <h6 className="fw-bold mb-0 p-3 border-bottom text-white bg-primary">Notifications</h6> {/* Purple text */}
          {notifications.length > 0 ? (
            <ul className="list-group list-group-flush">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`list-group-item p-3 ${
                    notification.status === 'unread' ? 'bg-light-purple' : ''
                  }`}
                >
                  <div className="d-flex align-items-center">
                    {notification.status === 'unread' ? (
                      <BsCircle className="me-3 text-purple" /> 
                    ) : (
                      <BsCheckCircle className="text-success me-3" />
                    )}
                    <div className="flex-grow-1">
                      <h6
                        className="mb-1 fw-normal"
                        onClick={() =>
                          handleNotificationClick(notification.userId, notification)
                        }
                      >
                        {notification.name}
                        {notification.type === 'registeringNotification' && (
                          <span className="badge bg-purple ms-2">maombi ya usajili</span> 
                        )}
                        {notification.type === 'kujiungaKikundi' && (
                          <span className="badge bg-light-purple ms-2">Kujiunga kikundi</span> 
                        )}
                      </h6>
                      <small className="text-muted">
                        {notification.status === 'unread' ? 'Mpya' : 'Imesomwa'}
                      </small>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {notification.status === 'unread' && (
                        <button
                          className="btn btn-sm btn-outline-purple" 
                          onClick={() =>
                            handleMarkAsRead(notification.userId)
                          }
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          handleDeleteNotification(notification.userId)
                        }
                      >
                        Futa
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center p-3">Hamna notification</p>
          )}
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
    </div>
  );

};

export default Notification;
