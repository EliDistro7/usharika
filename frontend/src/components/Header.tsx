'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDesanitezedCookie, getLoggedInUserId } from '@/hooks/useUser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from './TopBar';
import SeriesNotifications from '@/components/SeriesNotifications';
import Notifications from './Notifications';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = getLoggedInUserId();
    setIsLoggedIn(userId !== null);
  }, []);

  const handleAkauntiNavigation = () => {
    const cookieValue = getDesanitezedCookie();
    if (cookieValue) {
      router.push(`/akaunti/${cookieValue}`);
      toast.success('Umefanikiwa kuingia kwenye akaunti yako!');
    } else {
      router.push('/auth');
      toast.warning('Tafadhali, ingia kwenye akaunti yako!');
    }
  };

  return (
    <>
      {/* Top bar */}
      <TopBar />

      {/* Main Navbar */}
      <header className="border-bottom bg-white shadow-sm">
        <nav className="navbar navbar-expand-lg navbar-light py-3 container">

            {/* Notifications and Series Notifications */}
            {isLoggedIn && (
                <div className="d-flex align-items-center gap-3">
                  <div className="position-relative">
                    <i
                      className="fas fa-book"
                      style={{ color: '#6a0dad', fontSize: '1.2rem' }}
                    ></i>
                    {/* Notification Badge */}
                    <span
                      className="badge bg-danger position-absolute"
                      style={{
                        top: '5px',
                        right: '5px',
                        fontSize: '0.7rem',
                        padding: '3px 6px',
                      }}
                    >
                      3 {/* Replace with dynamic count */}
                    </span>
                  </div>
                  <div className="position-relative">
                    <i
                      className="fas fa-bell"
                      style={{ color: '#6a0dad', fontSize: '1.2rem' }}
                    ></i>
                    {/* Notification Badge */}
                    <span
                      className="badge bg-danger position-absolute"
                      style={{
                        top: '5px',
                        right: '5px',
                        fontSize: '0.7rem',
                        padding: '3px 6px',
                      }}
                    >
                      5 {/* Replace with dynamic count */}
                    </span>
                  </div>
                </div>
              )}

              {/* Login/Signup Buttons */}
              {!isLoggedIn && (
                <div className="d-flex align-items-center gap-3">
                  <a
                    href="/auth"
                    className="btn btn-outline-purple px-4 py-2 rounded-pill"
                    title="Log In"
                    style={{
                      transition: 'all 0.3s ease',
                      borderColor: '#6a0dad',
                      color: '#6a0dad',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#6a0dad';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#6a0dad';
                    }}
                  >
                    Ingia
                  </a>
                  <a
                    href="/usajili"
                    className="btn btn-purple text-white px-4 py-2 rounded-pill"
                    title="Sign Up"
                    style={{
                      transition: 'all 0.3s ease',
                      backgroundColor: '#6a0dad',
                      color: '#ffffff',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#4b0082'; // Darker purple
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#6a0dad';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                  >
                    Jisajili
                  </a>
                </div>
              )}
       
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Collapse */}
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a
                  href="/"
                  className="nav-link"
                  style={{ color: '#6a0dad', fontWeight: '500' }}
                >
                  Nyumbani
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/about"
                  className="nav-link"
                  style={{ color: '#6a0dad', fontWeight: '500' }}
                >
                  Fahamu Zaidi
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/kalenda"
                  className="nav-link"
                  style={{ color: '#6a0dad', fontWeight: '500' }}
                >
                  Kalenda ya Matukio
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/uongozi"
                  className="nav-link"
                  style={{ color: '#6a0dad', fontWeight: '500' }}
                >
                  Uongozi
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="systemDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ color: '#6a0dad', fontWeight: '500' }}
                >
                  System
                </a>
                <ul className="dropdown-menu shadow-sm">
                  <li>
                    <a href="/usajili" className="dropdown-item">
                      Kujisajili
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      style={{ cursor: 'pointer' }}
                      onClick={handleAkauntiNavigation}
                    >
                      Akaunti
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      style={{ cursor: 'pointer' }}
                      onClick={handleAkauntiNavigation}
                    >
                      Login
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a
                  href="/contact"
                  className="nav-link"
                  style={{ color: '#6a0dad', fontWeight: '500' }}
                >
                  Mawasiliano
                </a>
              </li>
            </ul>

            {/* Right-aligned Icons and Buttons */}
            <div className="d-flex align-items-center gap-4">
            

              {/* Phone Icon */}
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <i
                    className="fas fa-phone-alt fa-lg"
                    style={{ color: '#6a0dad' }}
                  ></i>
                </div>
                <div>
                  <small className="text-secondary">Wasiliana nasi</small>
                  <p className="mb-0">
                    <a
                      href="tel: +255765647567"
                      className="text-decoration-none"
                      style={{ color: '#9c27b0', fontWeight: '500' }}
                    >
                      +255 765 647 567
                    </a>
                  </p>
                </div>
              </div>

              
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}