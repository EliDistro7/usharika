'use client';

import React, { useState } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';

const SeriesNotifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New session added to Series A", time: "2m ago" },
    { id: 2, message: "Series B has been updated", time: "1h ago" },
    { id: 3, message: "Reminder: Upcoming event for Series C", time: "1d ago" },
  ]);

  return (
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
        <i className="fas fa-book fs-5"></i>

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

        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Dropdown.Item
              key={notif.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                backgroundColor: '#ffffff',
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
              {notif.message}
              <small style={{ color: '#888', fontSize: '0.8rem' }}>{notif.time}</small>
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
            Hamna notifications za series
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SeriesNotifications;
