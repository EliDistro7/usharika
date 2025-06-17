'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDesanitezedCookie, getLoggedInUserId } from '@/hooks/useUser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import TopBar from './TopBar';


export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const userId = getLoggedInUserId();
    setIsLoggedIn(userId !== null);

    // Handle scroll effect for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const navLinkStyle = {
    color: '#6a0dad',
    fontWeight: '600',
    fontSize: '1rem',
    position: 'relative',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #6a0dad 0%, #9c27b0 50%, #e91e63 100%)',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 24px',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(106, 13, 173, 0.3)',
  };

  const outlineButtonStyle = {
    background: 'transparent',
    border: '2px solid transparent',
    borderImage: 'linear-gradient(135deg, #6a0dad, #9c27b0, #e91e63) 1',
    borderRadius: '25px',
    padding: '10px 24px',
    fontWeight: '600',
    fontSize: '0.95rem',
    color: '#6a0dad',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <>
      {/* Top bar */}
      <TopBar />

      {/* Main Navbar */}
      <header 
        className={` border-bottom animate__animated animate__fadeInDown ${
          isScrolled ? 'bg-white bg-opacity-95 backdrop-blur' : 'bg-white'
        }`}
        style={{
          transition: 'all 0.3s ease',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(106, 13, 173, 0.1)' : '1px solid #e9ecef',
        }}
      >
        <nav className="navbar navbar-expand-lg py-3">
          <div className="container-fluid px-4">
         

            {/* Mobile Toggle Button */}
            <button
              className="navbar-toggler border-0 shadow-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6a0dad, #9c27b0)',
              }}
            >
              <i className="fas fa-bars text-white"></i>
            </button>

            {/* Navbar Collapse */}
            <div className="collapse navbar-collapse" id="navbarCollapse">
              {/* Navigation Links */}
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item mx-1">
                  <a
                    href="/"
                    className="nav-link position-relative"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(106, 13, 173, 0.1), rgba(156, 39, 176, 0.1))';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(106, 13, 173, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-home me-2"></i>Nyumbani
                  </a>
                </li>
                <li className="nav-item mx-1">
                  <a
                    href="/about"
                    className="nav-link"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(106, 13, 173, 0.1), rgba(156, 39, 176, 0.1))';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(106, 13, 173, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-info-circle me-2"></i>Fahamu Zaidi
                  </a>
                </li>
                <li className="nav-item mx-1">
                  <a
                    href="/kalenda"
                    className="nav-link"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(106, 13, 173, 0.1), rgba(156, 39, 176, 0.1))';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(106, 13, 173, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-calendar-alt me-2"></i>Kalenda ya Matukio
                  </a>
                </li>
                <li className="nav-item mx-1">
                  <a
                    href="/uongozi"
                    className="nav-link"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(106, 13, 173, 0.1), rgba(156, 39, 176, 0.1))';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(106, 13, 173, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-users me-2"></i>Uongozi
                  </a>
                </li>
                <li className="nav-item dropdown mx-1">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="systemDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(106, 13, 173, 0.1), rgba(156, 39, 176, 0.1))';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(106, 13, 173, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-cog me-2"></i>System
                  </a>
                  <ul 
                    className="dropdown-menu shadow-lg border-0 animate__animated animate__fadeIn"
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
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #6a0dad, #9c27b0)';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#6a0dad';
                          e.target.style.transform = 'scale(1)';
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
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #6a0dad, #9c27b0)';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#6a0dad';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <i className="fas fa-user-circle me-2"></i>Akaunti
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
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #6a0dad, #9c27b0)';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#6a0dad';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <i className="fas fa-sign-in-alt me-2"></i>Login
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item mx-1">
                  <a
                    href="/contact"
                    className="nav-link"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(106, 13, 173, 0.1), rgba(156, 39, 176, 0.1))';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(106, 13, 173, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-envelope me-2"></i>Mawasiliano
                  </a>
                </li>
              </ul>

              {/* Right Side Content */}
              <div className="d-flex align-items-center gap-3">
              
              
                {/* Auth buttons for non-logged in users */}
                {!isLoggedIn && (
                  <div className="d-flex align-items-center gap-2 animate__animated animate__fadeInRight">
                    <a
                      href="/auth"
                      className="btn position-relative"
                      style={outlineButtonStyle}
                      title="Log In"
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #6a0dad, #9c27b0)';
                        e.target.style.color = 'white';
                        e.target.style.transform = 'translateY(-3px) scale(1.05)';
                        e.target.style.boxShadow = '0 8px 25px rgba(106, 13, 173, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#6a0dad';
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>Ingia
                    </a>
                    <a
                      href="/usajili"
                      className="btn text-white position-relative"
                      style={buttonStyle}
                      title="Sign Up"
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-3px) scale(1.05)';
                        e.target.style.boxShadow = '0 8px 25px rgba(106, 13, 173, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = '0 4px 15px rgba(106, 13, 173, 0.3)';
                      }}
                    >
                      <i className="fas fa-user-plus me-2"></i>Jisajili
                    </a>
                  </div>
                )}

                {/* Contact Info */}
                <div 
                  className="d-none d-lg-flex align-items-center ms-3 ps-3 animate__animated animate__fadeInRight"
                  style={{
                    borderLeft: '2px solid rgba(106, 13, 173, 0.2)',
                  }}
                >
                  <div 
                    className="me-3 p-2 rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      background: 'linear-gradient(135deg, #6a0dad, #9c27b0)',
                      width: '40px',
                      height: '40px',
                      boxShadow: '0 4px 15px rgba(106, 13, 173, 0.3)',
                    }}
                  >
                    <i className="fas fa-phone-alt text-white"></i>
                  </div>
                  <div>
                    <small className="text-muted fw-500">Wasiliana nasi</small>
                    <p className="mb-0">
                      <a
                        href="tel:+255765647567"
                        className="text-decoration-none fw-bold"
                        style={{ 
                          color: '#6a0dad',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#9c27b0';
                          e.target.style.textShadow = '0 2px 4px rgba(106, 13, 173, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#6a0dad';
                          e.target.style.textShadow = 'none';
                        }}
                      >
                        +255 765 647 567
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        .navbar-nav .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 3px;
          bottom: 0;
          left: 50%;
          background: linear-gradient(135deg, #6a0dad, #9c27b0, #e91e63);
          transition: all 0.3s ease;
          border-radius: 2px;
        }
        
        .navbar-nav .nav-link:hover::after {
          width: 100%;
          left: 0;
        }
        
        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .btn:hover::before {
          left: 100%;
        }
        
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 12px;
            margin-top: 1rem;
            padding: 1rem;
            box-shadow: 0 10px 30px rgba(106, 13, 173, 0.15);
          }
        }
      `}</style>
    </>
  );
}