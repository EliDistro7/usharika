import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import SeriesNotifications from '@/components/SeriesNotifications';
import Notifications from './Notifications';
import { getLoggedInUserId } from '@/hooks/useUser';

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
    // Add your login navigation logic here
    window.location.href = '/login';
  };

  const handleSignup = () => {
    // Add your signup navigation logic here
    window.location.href = '/signup';
  };

  return (
    <>
      <div
        className={`container-fluid text-white py-4 px-3 position-relative overflow-hidden transition-all ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          background: 'linear-gradient(135deg, #6a0dad 0%, #9c27b0 35%, #e91e63 70%, #ff6b35 100%)',
          borderRadius: '0 0 50px 50px',
          boxShadow: '0 8px 32px rgba(106, 13, 173, 0.3)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          position: 'relative',
          zIndex: 1000,
        }}
      >
        {/* Animated Background Elements */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        
        {/* Floating Particles */}
        <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="position-absolute rounded-circle"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                background: 'rgba(255,255,255,0.3)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particle-float ${3 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="container d-flex justify-content-between align-items-center position-relative">
          {/* Church Logo and Name Section */}
          <div className="d-flex align-items-center animate__animated animate__fadeInLeft">
            <div 
              className="position-relative me-3"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                borderRadius: '50%',
                padding: '8px',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src="/img/lutherRose.jpg"
                alt="Church Logo"
                className="rounded-circle"
                style={{ 
                  width: '60px', 
                  height: '60px',
                  objectFit: 'cover',
                  border: '3px solid rgba(255,255,255,0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1) rotate(5deg)';
                  e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) rotate(0deg)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              {/* Logo Glow Effect */}
              <div 
                className="position-absolute top-50 start-50 translate-middle rounded-circle"
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  animation: 'glow-pulse 3s ease-in-out infinite',
                  zIndex: -1,
                }}
              />
            </div>

            <div className="text-start">
              <h1 
                className="mb-1 position-relative"
                style={{ 
                  fontFamily: 'Georgia, serif', 
                  fontWeight: 'bold', 
                  color: 'white',
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                  letterSpacing: '1px',
                }}
              >
                KKKT USHARIKA WA YOMBO
                <div 
                  className="position-absolute bottom-0 start-0"
                  style={{
                    width: '100%',
                    height: '3px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3), rgba(255,255,255,0.8))',
                    borderRadius: '2px',
                    animation: 'shimmer 2s ease-in-out infinite',
                  }}
                />
              </h1>
              <p 
                className="mb-0 small fw-medium"
                style={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px',
                  textShadow: '1px 1px 4px rgba(0,0,0,0.2)',
                }}
              >
                <i className="fas fa-cross me-2"></i>
                Tulio pamoja katika imani
              </p>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="d-flex align-items-center gap-3 animate__animated animate__fadeInRight">
            {isLoggedIn ? (
              /* Notifications for logged in users */
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="position-relative p-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px) scale(1.05)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                  }}
                >
                  <SeriesNotifications />
                </div>
                
                <div 
                  className="position-relative p-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px) scale(1.05)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                  }}
                >
                  <Notifications />
                </div>
              </div>
            ) : (
              /* Login/Signup buttons for non-logged in users */
              <div className="d-flex align-items-center gap-3">
                {/* Login Button */}
                <Button
                  onClick={handleLogin}
                  className="d-flex align-items-center gap-2 px-4 py-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15))',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderRadius: '25px',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    minWidth: '120px',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.25))';
                    e.target.style.transform = 'translateY(-2px) scale(1.05)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15))';
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                  }}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Ingia</span>
                </Button>

                {/* Signup Button */}
                <Button
                  onClick={handleSignup}
                  className="d-flex align-items-center gap-2 px-4 py-2"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '2px solid rgba(255,255,255,0.8)',
                    borderRadius: '25px',
                    color: '#6a0dad',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    boxShadow: '0 8px 32px rgba(255,255,255,0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    minWidth: '120px',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #6a0dad 0%, #9c27b0 100%)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px) scale(1.05)';
                    e.target.style.boxShadow = '0 12px 40px rgba(106, 13, 173, 0.3)';
                    e.target.style.borderColor = '#6a0dad';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
                    e.target.style.color = '#6a0dad';
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(255,255,255,0.2)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.8)';
                  }}
                >
                  <i className="fas fa-user-plus"></i>
                  <span>Jisajili</span>
                </Button>
              </div>
            )}

            {/* Quick Actions - Show for both logged in and out users */}
            <div className="d-none d-lg-flex align-items-center gap-2 ms-2">
              <div 
                className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  width: '45px',
                  height: '45px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                title="Barua Pepe"
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))';
                }}
              >
                <i className="fas fa-envelope text-white"></i>
              </div>
              
              <div 
                className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  width: '45px',
                  height: '45px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                title="Simu"
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))';
                }}
              >
                <i className="fas fa-phone text-white"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div 
          className="position-absolute bottom-0 start-0 w-100"
          style={{
            height: '20px',
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%)',
            backgroundSize: '20px 20px',
            animation: 'wave-move 4s linear infinite',
          }}
        />
      </div>

      {/* Custom CSS Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes particle-float {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        
        @keyframes glow-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes wave-move {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
        
        .transition-all {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Enhanced button hover effects */
        .btn:active {
          transform: translateY(1px) !important;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1199px) {
          .d-none.d-lg-flex {
            display: none !important;
          }
        }
        
        @media (max-width: 991px) {
          .container {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }
          
          .animate__fadeInLeft,
          .animate__fadeInRight {
            animation: none !important;
          }
        }
        
        @media (max-width: 576px) {
          .d-flex.gap-3 {
            gap: 0.75rem !important;
          }
          
          .btn {
            min-width: 100px !important;
            padding: 0.5rem 0.75rem !important;
            font-size: 0.8rem !important;
          }
          
          .d-flex.align-items-center.gap-3 {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default TopBar;