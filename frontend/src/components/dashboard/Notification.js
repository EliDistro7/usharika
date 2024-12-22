
'use client';

import React, { useState, useEffect } from 'react';
import { fetchAdminById, markNotificationAsRead } from '@/actions/admin'; // Adjust your import paths
import { BsBell, BsCheckCircle, BsCircle } from 'react-icons/bs';
import FullUserModal from '@/components/admin/FullUserModal';
import axios from 'axios';


const Notification = ({notifications,group}) => {
   console.log('group', group)
   console.log('notifications', notifications);
 
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedUserId, setSelectedUserId] = useState(null); // Track selected user


 

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



  return (
    <div className="container-fluid">
      {/* Bell Icon */}
     

      {/* Notifications Dropdown */}
      
        <div
          className="modal-overlay d-flex align-items-center justify-content-center"
          
        >
         
          {notifications.length > 0 ? (
            <ul className="list-group">
              {notifications.map((notification) => {
                if(notification.group === group){
                    return (
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
                          <h6 className="mb-1" onClick={() => handleNotificationClick(notification._id)}>
                            {notification.message}
                            {/* Badge for registration requests */}
                           
                              <span className="badge bg-warning ms-2">{notification.group}</span>
                        
                          </h6>
                          <small className={`text-muted`}>
                            {notification.status === 'unread' ? 'New' : 'Read'}
                          </small>
                        </div>
                      </div>
                      {notification.status === 'unread' && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleMarkAsRead(notification._id)}
                        >
                          Mark as Read
                        </button>
                      )}
                    </li>
                    )
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
