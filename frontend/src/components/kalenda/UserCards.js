import React, { useEffect, useState } from "react";
import { fetchUsersBornThisMonth } from "@/actions/users";
import { Card, Row, Col, Container, Spinner, Alert } from "react-bootstrap";

// Enhanced color scheme
const colors = {
  primary: "#FF6B9D",      // Warm pink
  secondary: "#FFB5C5",    // Light pink
  accent: "#FF85A2",       // Medium pink
  purple: "#8B5CF6",       // Modern purple
  gold: "#FFD700",         // Gold accent
  dark: "#2D1B3D",         // Dark purple
  light: "#FFF8FC",        // Very light pink
  white: "#FFFFFF",
  gradient: "linear-gradient(135deg, #FF6B9D 0%, #FFB5C5 50%, #8B5CF6 100%)",
  cardGradient: "linear-gradient(145deg, #FFFFFF 0%, #FFF8FC 100%)",
  shimmer: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)"
};

const formatDate = (dob) => {
  const date = new Date(dob);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long" });
};

const UserCards = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsersBornThisMonth();
        setUsers(data.users || []);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }
    };
    getUsers();
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
            rgba(255, 107, 157, 0.1) 0%, 
            transparent 50%
          ),
          linear-gradient(135deg, 
            ${colors.light} 0%, 
            #FFE8F1 25%, 
            #FFF0F5 50%, 
            #FFE8F1 75%, 
            ${colors.light} 100%
          )
        `,
        minHeight: "100vh",
        transition: "background 0.3s ease-out",
        paddingTop: "2rem",
        paddingBottom: "4rem"
      }}
    >
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
        {/* Floating Birthday Elements */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="position-absolute"
            style={{
              fontSize: `${20 + i * 4}px`,
              left: `${10 + i * 12}%`,
              top: `${15 + i * 10}%`,
              animation: `float-birthday-${i} ${6 + i * 1.5}s ease-in-out infinite`,
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.01}px)`,
              opacity: 0.6,
              zIndex: 0
            }}
          >
            {['🎂', '🎉', '🎈', '🎁', '🌟', '✨', '🎊', '💝'][i]}
          </div>
        ))}

        {/* Decorative Circles */}
        <div 
          className="position-absolute"
          style={{
            top: "20%",
            right: "15%",
            width: "150px",
            height: "150px",
            background: `conic-gradient(from 0deg, transparent, rgba(255, 107, 157, 0.1), transparent)`,
            borderRadius: "50%",
            animation: "rotate 25s linear infinite",
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        />
        
        <div 
          className="position-absolute"
          style={{
            bottom: "20%",
            left: "10%",
            width: "120px",
            height: "120px",
            background: `linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.08), transparent)`,
            borderRadius: "40%",
            animation: "rotate 20s linear infinite reverse",
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.01}px)`
          }}
        />
      </div>

      <Container className="position-relative" style={{ zIndex: 1 }}>
        {/* Enhanced Header */}
        <div 
          className="text-center mb-5"
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Birthday Badge */}
          <div 
            className="d-inline-block px-4 py-2 rounded-pill mb-3"
            style={{
              background: "rgba(255, 107, 157, 0.15)",
              border: "2px solid rgba(255, 107, 157, 0.3)",
              backdropFilter: "blur(10px)",
              color: colors.primary,
              fontSize: "0.9rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
              boxShadow: "0 4px 15px rgba(255, 107, 157, 0.2)"
            }}
          >
            🎈 Birthday Celebration
          </div>

          {/* Main Title */}
          <h2
            className="fw-bold mb-4 position-relative"
            style={{
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              background: colors.gradient,
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
              animation: "shimmer 4s ease-in-out infinite",
              filter: "drop-shadow(0 4px 8px rgba(107, 157, 255, 0.3))"
            }}
          >
            🎂 Birthdays Mwezi huu 🎉
            
            {/* Decorative Underline */}
            <div 
              className="position-absolute"
              style={{
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40%",
                height: "4px",
                background: colors.gradient,
                borderRadius: "2px",
                opacity: 0.7,
                animation: "shimmer-line 3s ease-in-out infinite"
              }}
            />
          </h2>

          {/* Decorative Elements */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            {['🎈', '🎂', '🎉'].map((emoji, i) => (
              <div
                key={i}
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "50px",
                  height: "50px",
                  background: colors.cardGradient,
                  border: "2px solid rgba(255, 107, 157, 0.2)",
                  fontSize: "1.5rem",
                  animation: `bounce ${1.5 + i * 0.3}s ease-in-out infinite`,
                  boxShadow: "0 4px 15px rgba(255, 107, 157, 0.15)"
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div 
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
            <div className="text-center">
              <div
                className="spinner-border mb-3"
                style={{
                  width: "3rem",
                  height: "3rem",
                  color: colors.primary,
                  animation: "spin 1s linear infinite"
                }}
              />
              <p style={{ color: colors.dark, fontSize: "1.1rem", fontWeight: "500" }}>
                Loading birthday celebrations... 🎉
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            className="text-center border-0 rounded-4"
            style={{
              background: "linear-gradient(135deg, #FFE5E5 0%, #FFF0F0 100%)",
              color: "#D32F2F",
              border: "2px solid rgba(211, 47, 47, 0.2)",
              boxShadow: "0 4px 15px rgba(211, 47, 47, 0.1)"
            }}
          >
            <div style={{ fontSize: "1.5rem" }}>😔</div>
            {error}
          </Alert>
        )}

        {/* No Users State */}
        {!loading && !error && users.length === 0 && (
          <div 
            className="text-center p-5 rounded-4"
            style={{
              background: colors.cardGradient,
              border: "2px solid rgba(255, 107, 157, 0.2)",
              boxShadow: "0 8px 25px rgba(255, 107, 157, 0.1)"
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎈</div>
            <h4 style={{ color: colors.dark, marginBottom: "0.5rem" }}>Hakuna Birthdays kwa mwezi huu</h4>
            <p style={{ color: colors.dark, opacity: 0.7 }}>
              Looks like we'll have to wait for next month's celebrations!
            </p>
          </div>
        )}

        {/* Users Grid */}
        {!loading && !error && users.length > 0 && (
          <div
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
            }}
          >
            <Row className="g-4">
              {users.map((user, index) => (
                <Col key={user._id} xl={4} lg={6} md={6} sm={12}>
                  <div
                    style={{
                      transform: isVisible ? 'scale(1)' : 'scale(0.9)',
                      opacity: isVisible ? 1 : 0,
                      transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 + index * 0.1}s`
                    }}
                  >
                    <Card
                      className="border-0 overflow-hidden position-relative"
                      style={{
                        background: colors.cardGradient,
                        borderRadius: "24px",
                        boxShadow: "0 8px 32px rgba(255, 107, 157, 0.15)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        height: "100%"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 20px 40px rgba(255, 107, 157, 0.25)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "0 8px 32px rgba(255, 107, 157, 0.15)";
                      }}
                    >
                      {/* Birthday Confetti Effect */}
                      <div 
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                          background: `
                            radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 30%),
                            radial-gradient(circle at 80% 30%, rgba(255, 107, 157, 0.1) 0%, transparent 30%),
                            radial-gradient(circle at 30% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 30%)
                          `,
                          pointerEvents: 'none',
                          zIndex: 1
                        }}
                      />

                      {/* Profile Image Container */}
                      <div className="position-relative overflow-hidden" style={{ height: "220px" }}>
                        <img
                          src={user.profilePicture || "https://via.placeholder.com/400x300?text=🎂"}
                          alt={user.name}
                          className="w-100 h-100"
                          style={{
                            objectFit: "cover",
                            transition: "transform 0.4s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        />
                        
                        {/* Image Overlay */}
                        <div 
                          className="position-absolute bottom-0 start-0 w-100"
                          style={{
                            background: "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%)",
                            height: "50%"
                          }}
                        />

                        {/* Birthday Badge */}
                        <div
                          className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill d-flex align-items-center"
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 107, 157, 0.3)",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            color: colors.primary,
                            boxShadow: "0 4px 15px rgba(255, 107, 157, 0.2)"
                          }}
                        >
                          🎈 Birthday
                        </div>
                      </div>

                      {/* Card Content */}
                      <Card.Body className="p-4 text-center position-relative" style={{ zIndex: 2 }}>
                        {/* Name */}
                        <Card.Title 
                          className="fw-bold mb-3"
                          style={{ 
                            fontSize: "1.4rem", 
                            color: colors.dark,
                            fontFamily: "'Inter', sans-serif",
                            letterSpacing: "-0.01em"
                          }}
                        >
                          {user.name}
                        </Card.Title>

                        {/* Birthday Date */}
                        <div
                          className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                          style={{
                            background: "rgba(255, 107, 157, 0.1)",
                            border: "1px solid rgba(255, 107, 157, 0.2)",
                            color: colors.primary,
                            fontSize: "0.95rem",
                            fontWeight: "600"
                          }}
                        >
                          <span className="me-2">🗓️</span>
                          {formatDate(user.dob)}
                        </div>

                        {/* Celebration Elements */}
                        <div className="d-flex justify-content-center gap-2 mt-3">
                          {['🎂', '🎉', '🎁'].map((emoji, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: "1.2rem",
                                animation: `bounce ${1.2 + i * 0.2}s ease-in-out infinite`,
                                animationDelay: `${i * 0.1}s`
                              }}
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Bottom Decoration */}
        {!loading && users.length > 0 && (
          <div 
            className="text-center mt-5 pt-4"
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1s'
            }}
          >
            <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
              <div 
                style={{
                  width: "60px",
                  height: "3px",
                  background: colors.gradient,
                  borderRadius: "2px",
                  opacity: 0.7
                }}
              />
              <span style={{ fontSize: "1.5rem", animation: "pulse 2s ease-in-out infinite" }}>
                🎈
              </span>
              <div 
                style={{
                  width: "60px",
                  height: "3px",
                  background: colors.gradient,
                  borderRadius: "2px",
                  opacity: 0.7
                }}
              />
            </div>
            <p 
              className="small"
              style={{
                color: colors.dark,
                opacity: 0.7,
                fontSize: "0.95rem",
                fontWeight: "500"
              }}
            >
             Usharika unamtakia kila mmoja wenu heri njema ya kumbukumbu ya siku ya kuzaliwa! 🎉
            </p>
          </div>
        )}
      </Container>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer-line {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scaleX(1); }
          50% { opacity: 1; transform: translateX(-50%) scaleX(1.1); }
        }
        
        @keyframes float-birthday-0 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(10deg); } }
        @keyframes float-birthday-1 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(-10deg); } }
        @keyframes float-birthday-2 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(8deg); } }
        @keyframes float-birthday-3 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-18px) rotate(-8deg); } }
        @keyframes float-birthday-4 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-25px) rotate(12deg); } }
        @keyframes float-birthday-5 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(-12deg); } }
        @keyframes float-birthday-6 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-22px) rotate(6deg); } }
        @keyframes float-birthday-7 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-16px) rotate(-6deg); } }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserCards;