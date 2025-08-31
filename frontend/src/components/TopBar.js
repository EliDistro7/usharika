import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import SeriesNotifications from '@/components/SeriesNotifications';
import Notifications from './Notifications';
import { getLoggedInUserId } from '@/hooks/useUser';
import Header from './Header';

const TopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const userId = getLoggedInUserId();
    setIsLoggedIn(userId !== null);

    // Handle scroll to show/hide topbar
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
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

  const handleLogin = () => {
    window.location.href = '/auth';
  };

  const handleSignup = () => {
    window.location.href = '/usajili';
  };

  const handleMenuClick = () => {
    // Menu handler to be implemented
    console.log('Menu clicked');
  };

  return (
    <>
      <div
        className={`position-fixed top-0 w-100 text-white py-3 px-3 transition-all ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          background: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 25%, #7b1fa2 50%, #8e24aa 75%, #9c27b0 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 20px rgba(74, 20, 140, 0.25)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          zIndex: 1000,
          minHeight: '70px',
        }}
      >
        {/* Subtle animated background */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            animation: 'gentle-float 8s ease-in-out infinite',
          }}
        />

        <div className="container-fluid d-flex justify-content-between align-items-center position-relative h-100">
          {/* Left Section: Menu + Logo + Title */}
          <div className="d-flex align-items-center gap-3">
            {/* Menu Button */}
           <Header />

            {/* Logo and Title */}
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
          </div>

          {/* Right Section: Notifications or Auth Buttons */}
          <div className="d-flex align-items-center gap-2">
            {isLoggedIn ? (
              /* Notifications for logged in users */
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="position-relative d-flex align-items-center justify-content-center"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    width: '44px',
                    height: '44px',
                    transition: 'all 0.2s ease',
                    zIndex: 1050,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.25)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <SeriesNotifications />
                </div>
                
                <div 
                  className="position-relative d-flex align-items-center justify-content-center"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    width: '44px',
                    height: '44px',
                    transition: 'all 0.2s ease',
                    zIndex: 1050,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.25)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Notifications />
                </div>

                {/* Quick Contact Icons - Hidden on small screens when logged in */}
                <div className="d-none d-md-flex align-items-center gap-2 ms-2">
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      width: '36px',
                      height: '36px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    title="Barua Pepe"
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <i className="fas fa-envelope" style={{ fontSize: '14px' }}></i>
                  </div>
                  
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      width: '36px',
                      height: '36px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    title="Simu"
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <i className="fas fa-phone" style={{ fontSize: '14px' }}></i>
                  </div>
                </div>
              </div>
            ) : (
              /* Auth buttons for non-logged in users */
              <div className="d-flex align-items-center gap-2">
                {/* Login Button - Compact */}
                <Button
                  onClick={handleLogin}
                  className="d-flex align-items-center gap-2 px-3 py-2"
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
                    minWidth: 'auto',
                    height: '44px',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.25)';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.25)';
                  }}
                >
                  <i className="fas fa-sign-in-alt" style={{ fontSize: '14px' }}></i>
                  <span className="d-none d-sm-inline">Ingia</span>
                </Button>

                {/* Signup Button - Compact */}
                <Button
                  onClick={handleSignup}
                  className="d-flex align-items-center gap-2 px-3 py-2"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    borderRadius: '12px',
                    color: '#4a148c',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    minWidth: 'auto',
                    height: '44px',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.borderColor = '#4a148c';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
                    e.target.style.color = '#4a148c';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.9)';
                  }}
                >
                  <i className="fas fa-user-plus" style={{ fontSize: '14px' }}></i>
                  <span className="d-none d-sm-inline">Jisajili</span>
                </Button>

                {/* Quick Contact Icons - Only on larger screens when not logged in */}
                <div className="d-none d-lg-flex align-items-center gap-2 ms-2">
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      width: '36px',
                      height: '36px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    title="Barua Pepe"
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <i className="fas fa-envelope" style={{ fontSize: '14px' }}></i>
                  </div>
                  
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      width: '36px',
                      height: '36px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    title="Simu"
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <i className="fas fa-phone" style={{ fontSize: '14px' }}></i>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subtle bottom accent line */}
        <div 
          className="position-absolute bottom-0 start-0 w-100"
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Body padding to account for fixed header */}
      <div style={{ paddingTop: '70px' }} />

      {/* Custom CSS Styles */}
      <style jsx>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-3px) translateX(2px); }
          66% { transform: translateY(2px) translateX(-2px); }
        }
        
        .transition-all {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Ensure notification dropdowns appear above other elements */
        .position-relative .dropdown-menu,
        .position-relative [class*="dropdown"],
        .position-relative [class*="popover"],
        .position-relative [class*="tooltip"] {
          z-index: 1060 !important;
          position: fixed !important;
        }
        
        /* Enhanced button interactions */
        .btn:active {
          transform: translateY(1px) scale(0.98) !important;
        }
        
        /* Mobile optimizations */
        @media (max-width: 767px) {
          .container-fluid {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .gap-3 {
            gap: 0.75rem !important;
          }
          
          .gap-2 {
            gap: 0.5rem !important;
          }
          
          /* Stack elements vertically on very small screens if needed */
          @media (max-width: 480px) {
            .d-flex.justify-content-between {
              flex-wrap: wrap;
              gap: 0.5rem;
            }
            
            /* Reduce logo size on very small screens */
            img {
              width: 40px !important;
              height: 40px !important;
            }
            
            button, .btn {
              width: 40px !important;
              height: 40px !important;
              padding: 0.5rem !important;
            }
            
            .btn i {
              font-size: 12px !important;
            }
          }
        }
        
        /* Smooth scrolling for better UX */
        html {
          scroll-behavior: smooth;
        }
        
        /* Focus states for accessibility */
        button:focus,
        .btn:focus {
          outline: 2px solid rgba(255,255,255,0.5);
          outline-offset: 2px;
        }
        
        /* Improved touch targets for mobile */
        @media (pointer: coarse) {
          button,
          .btn {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </>
  );
};

export default TopBar;