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
      className="container-fluid text-white py-3 px-3 shadow-sm"
      style={{
        backgroundColor: '#6a0dad', // Deep purple background
        borderRadius: '0 0 46px 46px',
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* Church Logo or Name */}
        <div className="d-flex align-items-center">
          <img
            src="/img/lutherRose.jpg" // Replace with your church logo
            alt="Church Logo"
            style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
          />
          <h2 className="mb-0" style={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color:"white" }}>
            KKKT USHARIKA WA YOMBO
          </h2>
        </div>

        {/* Icons Section */}
        <div className="d-flex align-items-center gap-4">
          {/* Login/Signup Buttons */}
        
        </div>
      </div>
    </div>
  );
};

export default TopBar;