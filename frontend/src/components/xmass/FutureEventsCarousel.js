// Main Component with Enhanced Aesthetics

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { EventCard } from './EventCard';
import { useCountdown } from './CountDown';

// Enhanced color scheme
const colors = {
  primary: "#8B5CF6",      // Modern purple
  secondary: "#A855F7",    // Lighter purple
  accent: "#7C3AED",       // Deeper purple
  dark: "#1F2937",         // Dark gray
  light: "#F8FAFC",        // Light background
  white: "#FFFFFF",
  gradient: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #7C3AED 100%)",
  gradientReverse: "linear-gradient(315deg, #8B5CF6 0%, #A855F7 50%, #7C3AED 100%)",
  shimmer: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
};

const FutureEventsCarousel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const events = [
    {
      targetDate: "2025-06-26T00:00:00Z",
      eventName: "Vijana Expirience",
      backgroundImage: "/img/vijana.webp",
    },
    {
      targetDate: "2025-06-19T00:00:00Z",
      eventName: "Twen'zetu Kwa Yesu",
      backgroundVideo: "/videos/YesuVideo.mp4",
    },
  ];

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="position-relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(139, 92, 246, 0.15) 0%, 
            transparent 50%
          ),
          linear-gradient(135deg, 
            ${colors.light} 0%, 
            #EDE9FE 25%, 
            #F3E8FF 50%, 
            #EDE9FE 75%, 
            ${colors.light} 100%
          )
        `,
        minHeight: "100vh",
        transition: "background 0.3s ease-out"
      }}
    >
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="position-absolute rounded-circle"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              background: `radial-gradient(circle, rgba(139, 92, 246, ${0.1 - i * 0.015}) 0%, transparent 70%)`,
              left: `${15 + i * 15}%`,
              top: `${10 + i * 12}%`,
              animation: `float-${i} ${8 + i * 2}s ease-in-out infinite`,
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.01}px)`
            }}
          />
        ))}

      
        <div 
          className="position-absolute"
          style={{
            top: "10%",
            right: "10%",
            width: "200px",
            height: "200px",
            background: `conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.08), transparent)`,
            borderRadius: "50%",
            animation: "rotate 20s linear infinite",
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        />
     
        
        <div 
          className="position-absolute"
          style={{
            bottom: "15%",
            left: "5%",
            width: "150px",
            height: "150px",
            background: `linear-gradient(45deg, transparent, rgba(124, 58, 237, 0.06), transparent)`,
            borderRadius: "30%",
            animation: "rotate 15s linear infinite reverse",
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.01}px)`
          }}
        />
      </div>

      {/* Main Content */}
      <div className="position-relative py-5" style={{ zIndex: 1 }}>
        <Container fluid className="px-4">
          {/* Enhanced Section Header */}
          <div 
            className="text-center mb-5"
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Subtitle */}
            <div 
              className="d-inline-block px-4 py-2 rounded-pill mb-4"
              style={{
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                backdropFilter: "blur(10px)",
                color: colors.accent,
                fontSize: "0.9rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              ✨ Huduma zinazokuja
            </div>

            {/* Main Title with Enhanced Effects */}
            <h1 
              className="fw-bold mb-4 position-relative"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                background: `linear-gradient(135deg, #8B5CF6 0%, #A855F7 30%, #7C3AED 60%, #8B5CF6 100%)`,
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.02em",
                lineHeight: "1.1",
                animation: "shimmer 3s ease-in-out infinite",
                filter: "drop-shadow(0 4px 8px rgba(139, 92, 246, 0.2))"
              }}
            >
              Yajayo
              
              {/* Decorative Underline */}
              <div 
                className="position-absolute"
                style={{
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60%",
                  height: "4px",
                  background: colors.gradient,
                  borderRadius: "2px",
                  opacity: 0.6
                }}
              />
            </h1>

            {/* Enhanced Description */}
            <div className="position-relative">
              <p 
                className="lead mx-auto"
                style={{
                  color: colors.dark,
                  fontSize: "1.25rem",
                  maxWidth: "700px",
                  margin: "0 auto",
                  opacity: 0.85,
                  lineHeight: "1.6",
                  fontWeight: "400"
                }}
              >
                Fuatilia matukio yetu makubwa yanayokuja katika huduma ya Usharika wetu
              </p>
              
              {/* Accent Elements */}
              <div className="d-flex justify-content-center mt-4 gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-circle"
                    style={{
                      width: `${8 + i * 2}px`,
                      height: `${8 + i * 2}px`,
                      background: colors.gradient,
                      opacity: 0.7 - i * 0.1,
                      animation: `pulse ${1.5 + i * 0.5}s ease-in-out infinite`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Events Grid */}
          <div
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(80px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
            }}
          >
            <Row className="g-5 justify-content-center">
              {events.map((event, index) => (
                <Col key={index} xl={5} lg={6} md={8} sm={10} xs={12}>
                  <div
                    style={{
                      transform: isVisible ? 'scale(1)' : 'scale(0.9)',
                      opacity: isVisible ? 1 : 0,
                      transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.5 + index * 0.2}s`
                    }}
                  >
                    <EventCard event={event} index={index}  isPromoImage={!event.backgroundVideo} // Only show as promo image if no video
  isPromoVideo={!!event.backgroundVideo} />
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Enhanced Bottom Decoration */}
          <div 
            className="text-center mt-5 pt-5"
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1s'
            }}
          >
            {/* Decorative Lines */}
            <div className="d-flex justify-content-center align-items-center gap-4 mb-4">
              <div 
                style={{
                  width: "80px",
                  height: "2px",
                  background: colors.gradient,
                  borderRadius: "1px",
                  opacity: 0.6
                }}
              />
              <div 
                className="rounded-circle"
                style={{
                  width: "12px",
                  height: "12px",
                  background: colors.gradient,
                  animation: "pulse 2s ease-in-out infinite"
                }}
              />
              <div 
                style={{
                  width: "80px",
                  height: "2px",
                  background: colors.gradientReverse,
                  borderRadius: "1px",
                  opacity: 0.6
                }}
              />
            </div>

            {/* Additional Info */}
            <p 
              className="small"
              style={{
                color: colors.dark,
                opacity: 0.6,
                fontSize: "0.9rem",
                fontWeight: "500"
              }}
            >
              Kumbuka tarehe, usiache kupita
            </p>
          </div>
        </Container>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-0 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(180deg); } }
        @keyframes float-1 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-30px) rotate(-180deg); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(90deg); } }
        @keyframes float-3 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-25px) rotate(-90deg); } }
        @keyframes float-4 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-35px) rotate(270deg); } }
        @keyframes float-5 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(-270deg); } }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default FutureEventsCarousel;