'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import SeriesNotifications from '@/components/SeriesNotifications';
import Notifications from './Notifications';
import { getDesanitezedCookie, getLoggedInUserId } from '@/hooks/useUser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const userId = getLoggedInUserId();
    setIsLoggedIn(userId !== null);

    // Handle scroll effects for both visibility and background
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state for background blur
      setIsScrolled(currentScrollY > 50);
      
      // Handle visibility (hide on scroll down, show on scroll up)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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

  const handleLogin = () => {
    router.push('/auth');
  };

  const handleSignup = () => {
    router.push('/usajili');
  };

  const navLinkStyle = {
    color: 'white',
    fontWeight: '600',
    fontSize: '0.95rem',
    position: 'relative',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
  };

  return (
    <>
      {/* Unified Header */}
      <header 
        className={`position-fixed top-0 w-100 animate__animated animate__fadeInDown ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          background: isScrolled 
            ? 'linear-gradient(135deg, rgba(74, 20, 140, 0.95) 0%, rgba(106, 27, 154, 0.95) 25%, rgba(123, 31, 162, 0.95) 50%, rgba(142, 36, 170, 0.95) 75%, rgba(156, 39, 176, 0.95) 100%)'
            : 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 25%, #7b1fa2 50%, #8e24aa 75%, #9c27b0 100%)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 20px rgba(74, 20, 140, 0.25)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          zIndex: 1050,
          minHeight: '80px',
        }}
      >
        {/* Animated background overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            animation: 'gentle-float 8s ease-in-out infinite',
          }}
        />

        <nav className="navbar navbar-expand-lg py-2">
          <div className="container-fluid px-4">
            {/* Left Section: Logo + Title */}
            <div className="d-flex align-items-center gap-3">
              <div 
                className="position-relative"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  padding: '6px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <img
                  src="/img/lutherRose.jpg"
                  alt="Church Logo"
                  className="rounded-3"
                  style={{ 
                    width: '48px', 
                    height: '48px',
                    objectFit: 'cover',
                    transition: 'all 0.3s ease',
                  }}
                />
              </div>

              <div className="d-none d-sm-block">
                <h1 
                  className="mb-0"
                  style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif', 
                    fontWeight: '700', 
                    color: 'white',
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    letterSpacing: '0.5px',
                  }}
                >
                  KKKT YOMBO
                </h1>
              </div>
            </div>

           

            {/* Right Section: Always visible auth/notifications + Navigation on large screens */}
              {/* Navigation Links - Only on large screens */}
              <ul className="navbar-nav d-none d-lg-flex flex-row mb-0 gap-1 me-3">
                <li className="nav-item">
                  <a
                    href="/"
                    className="nav-link position-relative"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.15)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="fas fa-home me-2"></i>Nyumbani
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="/about"
                    className="nav-link"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.15)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="fas fa-info-circle me-2"></i>Fahamu Zaidi
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="/kalenda"
                    className="nav-link"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.15)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="fas fa-calendar-alt me-2"></i>Kalenda
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="/uongozi"
                    className="nav-link"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.15)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="fas fa-users me-2"></i>Uongozi
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="/contact"
                    className="nav-link"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.15)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="fas fa-envelope me-2"></i>Mawasiliano
                  </a>
                </li>
              </ul>

           

              {/* Divider - Only on large screens */}
              <div 
                className="d-none d-lg-block"
                style={{
                  width: '1px',
                  height: '40px',
                  background: 'rgba(255,255,255,0.2)',
                  marginRight: '0.5rem',
                }}
              />

              {/* Auth/Notifications Section - Always visible */}
              {isLoggedIn ? (
                /* Notifications for logged in users - Compact for mobile */
                <div className="d-flex align-items-center gap-2">
                  {/* System Dropdown - Hidden on small screens */}
                  <div className="dropdown d-none d-md-block">
                    <button
                      className="btn dropdown-toggle d-flex align-items-center gap-2"
                      type="button"
                      id="systemDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        padding: '8px 16px',
                        height: '44px',
                      }}
                    >
                      <i className="fas fa-cog"></i>
                      <span>System</span>
                    </button>
                    <ul 
                      className="dropdown-menu shadow-lg border-0"
                      style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        boxShadow: '0 10px 30px rgba(106, 13, 173, 0.2)',
                        border: '1px solid rgba(106, 13, 173, 0.1)',
                      }}
                    >
                      <li>
                        <a 
                          href="/usajili" 
                          className="dropdown-item py-2 px-3"
                          style={{
                            borderRadius: '8px',
                            margin: '4px',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <i className="fas fa-user-plus me-2"></i>Kujisajili
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item py-2 px-3"
                          style={{
                            cursor: 'pointer',
                            borderRadius: '8px',
                            margin: '4px',
                            transition: 'all 0.3s ease',
                          }}
                          onClick={handleAkauntiNavigation}
                        >
                          <i className="fas fa-user-circle me-2"></i>Akaunti
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Mobile System Dropdown - Compact */}
                  <div className="dropdown d-md-none">
                    <button
                      className="btn dropdown-toggle"
                      type="button"
                      id="systemDropdownMobile"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        padding: '8px 12px',
                        height: '44px',
                        minWidth: '44px',
                      }}
                    >
                      <i className="fas fa-cog"></i>
                    </button>
                    <ul className="dropdown-menu shadow-lg border-0">
                  {!isLoggedIn && ( <li>
                        <a href="/usajili" className="dropdown-item py-2 px-3">
                          <i className="fas fa-user-plus me-2"></i>Kujisajili
                        </a>
                      </li>
                  )}

                      <li>
                        <a
                          className="dropdown-item py-2 px-3"
                          style={{ cursor: 'pointer' }}
                          onClick={handleAkauntiNavigation}
                        >
                          <i className="fas fa-user-circle me-2"></i>Akaunti
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Notifications - Always visible when logged in */}
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      width: '44px',
                      height: '44px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <SeriesNotifications />
                  </div>
                  
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      width: '44px',
                      height: '44px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Notifications />
                  </div>
                </div>
              ) : (
                /* Auth buttons - Always visible, responsive design */
                <div className="d-flex align-items-center gap-2">
                  {/* Login Button - Responsive text */}
                  <Button
                    onClick={handleLogin}
                    className="d-flex align-items-center gap-2"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: '12px',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      transition: 'all 0.2s ease',
                      height: '44px',
                      padding: '8px 16px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.25)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.15)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="fas fa-sign-in-alt" style={{ fontSize: '14px' }}></i>
                    <span className="d-none d-sm-inline">Ingia</span>
                  </Button>

                  {/* Signup Button - Responsive text */}
                  <Button
                    onClick={handleSignup}
                    className="d-flex align-items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      border: '1px solid rgba(255,255,255,0.9)',
                      borderRadius: '12px',
                      color: '#4a148c',
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      height: '44px',
                      padding: '8px 16px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%)';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
                      e.target.style.color = '#4a148c';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="fas fa-user-plus" style={{ fontSize: '14px' }}></i>
                    <span className="d-none d-sm-inline">Jisajili</span>
                  </Button>
                </div>
              )}

                  {/* Mobile Toggle Button */}
            <button
              className="navbar-toggler border-0 shadow-none d-lg-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <i className="fas fa-bars text-white"></i>
            </button>

              {/* Contact Info - Only on extra large screens */}
              <div 
                className="d-none d-xl-flex align-items-center ms-3 ps-3"
                style={{
                  borderLeft: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div 
                  className="me-3 p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    width: '40px',
                    height: '40px',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <i className="fas fa-phone-alt text-white"></i>
                </div>
                <div>

                  <p className="mb-0">
                    <a
                      href="tel:+255765647567"
                      className="text-decoration-none fw-bold text-white"
                      style={{ 
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.textShadow = '0 2px 4px rgba(255,255,255,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textShadow = 'none';
                      }}
                    >
            
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Navbar Collapse */}
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="d-lg-none mt-3">
                {/* Mobile Navigation Links */}
                <ul className="navbar-nav mb-3">
                  <li className="nav-item">
                    <a href="/" className="nav-link text-white py-2">
                      <i className="fas fa-home me-2"></i>Nyumbani
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/about" className="nav-link text-white py-2">
                      <i className="fas fa-info-circle me-2"></i>Fahamu Zaidi
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/kalenda" className="nav-link text-white py-2">
                      <i className="fas fa-calendar-alt me-2"></i>Kalenda ya Matukio
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/uongozi" className="nav-link text-white py-2">
                      <i className="fas fa-users me-2"></i>Uongozi
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/contact" className="nav-link text-white py-2">
                      <i className="fas fa-envelope me-2"></i>Mawasiliano
                    </a>
                  </li>
                </ul>


                {/* Mobile Contact Info */}
                <div className="mt-3 pt-3 border-top border-white-25">
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        width: '40px',
                        height: '40px',
                      }}
                    >
                      <i className="fas fa-phone-alt text-white"></i>
                    </div>
                    <div>
                      <small className="text-white-50">Wasiliana nasi</small>
                      <p className="mb-0">
                        <a href="tel:+255765647567" className="text-white text-decoration-none fw-bold">
                          +255 765 647 567
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
       
        </nav>

        {/* Bottom accent line */}
        <div 
          className="position-absolute bottom-0 start-0 w-100"
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          }}
        />
      </header>

      {/* Body padding to account for fixed header */}
      <div style={{ paddingTop: '80px' }} />

      {/* Custom CSS Styles */}
      <style jsx>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-3px) translateX(2px); }
          66% { transform: translateY(2px) translateX(-2px); }
        }
        
        .navbar-nav .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background: linear-gradient(135deg, #ffffff, rgba(255,255,255,0.8));
          transition: all 0.3s ease;
          border-radius: 2px;
        }
        
        .navbar-nav .nav-link:hover::after {
          width: 100%;
          left: 0;
        }
        
        .dropdown-item:hover {
          background: linear-gradient(135deg, #6a0dad, #9c27b0) !important;
          color: white !important;
          transform: scale(1.02);
        }
        
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background: rgba(74, 20, 140, 0.95);
            border-radius: 12px;
            margin-top: 1rem;
            padding: 1rem;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
          }
        }
        
        /* Focus states for accessibility */
        button:focus,
        .btn:focus,
        .nav-link:focus {
          outline: 2px solid rgba(255,255,255,0.5);
          outline-offset: 2px;
        }
        
        /* Improved touch targets for mobile */
        @media (pointer: coarse) {
          button,
          .btn,
          .nav-link {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
}