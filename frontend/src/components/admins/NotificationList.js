

'use client';

import React, { useEffect, useState } from "react";
import {
  getMatangazoNotifications,
  deleteMatangazoNotification,
  editMatangazoNotification,
} from "@/actions/users";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';
import { getLoggedInUserId } from "@/hooks/useUser";

const NotificationsList = () => {
  const userId = getLoggedInUserId();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getMatangazoNotifications(userId);
        setNotifications(data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleDelete = async (notificationId, message)=>{ 
    try {
      await deleteMatangazoNotification({ userId, notificationId, group: Cookies.get('role')  ,message });
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
      toast.success("Notification deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete notification.");
    }
  };

  const handleEdit = async (notificationId) => {
    try {
      await editMatangazoNotification({
        userId,
        notificationId,
        updatedData: { message: editedMessage },
        group:Cookies.get('role')
      });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, message: editedMessage }
            : notification
        )
      );
      toast.success("Notification updated successfully!");
      setEditingId(null);
      setEditedMessage("");
    } catch (err) {
      toast.error(err.message || "Failed to update notification.");
    }
  };

  return (
    <div className="container mt-0 px-0">
      <ToastContainer position="top-right" autoClose={3000} />
      
   

      <div className="card shadow-sm">
        <div className="card-header text-white">
          <h4 className="mb-0">Matangazo</h4>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            <ul className="list-group">
              {notifications.map((notification) => (
                <li key={notification._id} className="list-group-item">
                  {editingId === notification._id ? (
                    <div>
                      <textarea
                        className="form-control mb-2"
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                      />
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleEdit(notification._id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between">
                      <span>{notification.message}</span>
                      <div>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => {
                            setEditingId(notification._id);
                            setEditedMessage(notification.message);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(notification._id, notification.message )}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsList;
