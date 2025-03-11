'use client';

import React, { useState } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';

const SeriesNotifications = () => {
  // Hardcoded notifications for demonstration
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New session added to Series A" },
    { id: 2, message: "Series B has been updated" },
    { id: 3, message: "Reminder: Upcoming event for Series C" },
  ]);

  const notificationCount = notifications.length;

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="light"
        id="dropdown-notifications"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#FFFFFF',
          padding: '0.5rem 1rem',
          position: 'relative',
          transition: 'all 0.3s ease',
        }}
        className="d-flex align-items-center gap-2"
      >
        {/* Book icon for notifications */}
        <i className="fas fa-book fs-5"></i>

        {notificationCount > 0 && (
          <Badge
            bg="danger"
            className="position-absolute top-0 start-100 translate-middle"
            style={{
              fontSize: '0.75rem',
              padding: '0.3rem 0.5rem',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {notificationCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        style={{
          minWidth: '300px',
          backgroundColor: '#4B0082', // Dark purple background
          border: 'none',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          padding: '0.5rem',
          marginTop: '0.5rem',
        }}
      >
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#6A0DAD #4B0082',
          }}
        >
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <Dropdown.Item
                key={notif.id}
                style={{
                  backgroundColor: '#4B0082',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '0.25rem',
                  transition: 'background-color 0.2s',
                }}
                className="hover-effect"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6A0DAD')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4B0082')}
              >
                {notif.message}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item
              style={{
                backgroundColor: '#4B0082',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
              }}
            >
              Hakuna notifications
            </Dropdown.Item>
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SeriesNotifications;