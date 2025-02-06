import React, { useState, useEffect } from 'react';
import SeriesNotifications from '@/components/SeriesNotifications';
import Notifications from './Notifications';
import { getLoggedInUserId } from '@/hooks/useUser';

const TopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = getLoggedInUserId();
    setIsLoggedIn(userId !== null);
  }, []);

  return (
    <div
      className="container-fluid text-white py-3 px-3"
      style={{
        backgroundColor: '#6a0dad', // Deep purple background
        borderRadius: '0 0 46px 46px',
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* Contact Info */}
        <div className="d-flex align-items-center">
          <small className="fs-6 fw-bold">
            <i className="fas fa-phone-alt me-2"></i>
            <a href="tel:+255765647567" className="text-decoration-none text-white">
              +255 765 647 567
            </a>
          </small>
        </div>

        {/* Icons Section */}
        <div className="d-flex align-items-center gap-4">
          {isLoggedIn ? (
            <>
              <SeriesNotifications />
              <Notifications />
            </>
          ) : (
            <div className="d-flex align-items-center gap-3">
              <a href="/auth" className="btn btn-outline-light px-3 py-1" title="Log In">
                Ingia
              </a>
              <a href="/usajili" className="btn btn-light text-dark px-3 py-1" title="Sign Up">
                Jisajili Online
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;