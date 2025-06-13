import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

// Mock countdown hook for demonstration
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const target = new Date(targetDate);
    const now = new Date();
    const difference = target - now;
    
    if (difference > 0) {
      const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
      const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { months, days, hours, minutes, seconds };
    }
    
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(targetDate);
      const now = new Date();
      const difference = target - now;
      
      if (difference > 0) {
        const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ months, days, hours, minutes, seconds });
      } else {
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// Color scheme
const colors = {
  primary: "#8B5CF6",
  secondary: "#A855F7",
  accent: "#7C3AED",
  dark: "#1F2937",
  light: "#F8FAFC",
  white: "#FFFFFF",
  gradient: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #7C3AED 100%)"
};

const padTo2 = (num) => String(num).padStart(2, '0');

// Promo Image Component
const PromoImage = ({ event, isPromoImage }) => {
  if (!event.backgroundImage || !isPromoImage) return null;

  return (
    <div className="position-relative" style={{ height: "300px" }}>
      <div
        className="w-100 h-100"
        style={{
          backgroundImage: `url(${event.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "20px 20px 0 0",
          boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.1)"
        }}
      />
      
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)",
          borderRadius: "20px 20px 0 0"
        }}
      />

      <div
        className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill"
        style={{
          background: colors.gradient,
          color: colors.white,
          fontSize: "0.875rem",
          fontWeight: "600",
          boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        🖼️ Promo Image
      </div>

      <div
        className="position-absolute bottom-0 start-0 w-100 p-4"
        style={{
          background: "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%)",
          borderRadius: "0 0 0 0"
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "8px 16px",
            border: "1px solid rgba(255, 255, 255, 0.3)"
          }}
        >
          <span
            style={{
              color: colors.white,
              fontSize: "0.875rem",
              fontWeight: "500",
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
            }}
          >
            📸 Click to view full image
          </span>
        </div>
      </div>
    </div>
  );
};

// Promo Video Component
const PromoVideo = ({ event, isPromoVideo }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!event.backgroundVideo || !isPromoVideo) return null;

  return (
    <div className="position-relative" style={{ height: "300px" }}>
      <video
        controls
        className="w-100 h-100"
        style={{
          objectFit: "cover",
          borderRadius: "20px 20px 0 0",
          background: colors.dark
        }}
        poster={event.backgroundImage}
        onPlay={() => setIsVideoPlaying(true)}
        onPause={() => setIsVideoPlaying(false)}
      >
        <source src={event.backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {!isVideoPlaying && (
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            borderRadius: "20px 20px 0 0",
            pointerEvents: "none"
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(139, 92, 246, 0.9)",
              backdropFilter: "blur(10px)",
              border: "3px solid rgba(255, 255, 255, 0.8)",
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)"
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "20px solid white",
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                marginLeft: "4px"
              }}
            />
          </div>
        </div>
      )}

      <div
        className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill"
        style={{
          background: colors.gradient,
          color: colors.white,
          fontSize: "0.875rem",
          fontWeight: "600",
          boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        🎬 Promo Video
      </div>
    </div>
  );
};

// Background Media Component
const BackgroundMedia = ({ event, hasPromoContent }) => {
  if (hasPromoContent) return null;

  return (
    <div 
      className="position-absolute w-100 h-100"
      style={{
        top: 0,
        left: 0,
        zIndex: 1,
        background: event.backgroundVideo || event.backgroundImage ? 'transparent' : colors.gradient,
      }}
    >
      {event.backgroundImage && (
        <>
          <div
            className="position-absolute w-100 h-100"
            style={{
              backgroundImage: `url(${event.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              mask: `
                radial-gradient(ellipse 80% 60% at center, black 25%, transparent 65%),
                linear-gradient(45deg, black 15%, transparent 35%, black 50%, transparent 75%)
              `,
              WebkitMask: `
                radial-gradient(ellipse 80% 60% at center, black 25%, transparent 65%),
                linear-gradient(45deg, black 15%, transparent 35%, black 50%, transparent 75%)
              `,
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
              opacity: 0.9,
              filter: "contrast(1.3) saturate(1.2)"
            }}
          />
          <div 
            className="position-absolute w-100 h-100"
            style={{
              background: `
                radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.5) 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.6) 0%, transparent 40%),
                linear-gradient(135deg, rgba(124, 58, 237, 0.4) 0%, rgba(139, 92, 246, 0.6) 50%, rgba(168, 85, 247, 0.4) 100%)
              `,
              mixBlendMode: "multiply"
            }}
          />
        </>
      )}

      {event.backgroundVideo && (
        <>
          <video
            autoPlay
            muted
            loop
            className="position-absolute w-100 h-100"
            style={{
              objectFit: "cover",
              mask: `
                radial-gradient(ellipse 75% 55% at center, black 30%, transparent 70%),
                linear-gradient(135deg, black 20%, transparent 45%, black 65%, transparent 85%)
              `,
              WebkitMask: `
                radial-gradient(ellipse 75% 55% at center, black 30%, transparent 70%),
                linear-gradient(135deg, black 20%, transparent 45%, black 65%, transparent 85%)
              `,
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
              opacity: 0.8,
              filter: "contrast(1.4) brightness(1.1) saturate(1.3)"
            }}
          >
            <source src={event.backgroundVideo} type="video/mp4" />
          </video>
          <div 
            className="position-absolute w-100 h-100"
            style={{
              background: `
                radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.6) 0%, transparent 35%),
                radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.7) 0%, transparent 35%),
                conic-gradient(from 45deg at center, 
                  rgba(124, 58, 237, 0.5), 
                  rgba(139, 92, 246, 0.7), 
                  rgba(168, 85, 247, 0.6),
                  rgba(124, 58, 237, 0.5)
                )
              `,
              mixBlendMode: "screen"
            }}
          />
        </>
      )}

      <div 
        className="position-absolute w-100 h-100"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 3px,
              rgba(255, 255, 255, 0.08) 3px,
              rgba(255, 255, 255, 0.08) 6px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 8px,
              rgba(255, 255, 255, 0.04) 8px,
              rgba(255, 255, 255, 0.04) 12px
            )
          `,
          pointerEvents: 'none',
          opacity: 0.6
        }}
      />

      <div 
        className="position-absolute w-100 h-100"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.3) 90%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.2) 100%)
          `,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

// Event Header Component
const EventHeader = ({ event, hasPromoContent }) => {
  const eventDate = new Date(event.targetDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mb-4">
      <h2 
        className="fw-bold mb-3"
        style={{
          fontSize: "2.5rem",
          color: hasPromoContent ? colors.dark : colors.white,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: "1.2",
          textShadow: hasPromoContent ? "none" : "0 2px 8px rgba(0, 0, 0, 0.5)",
          filter: hasPromoContent ? "none" : "drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))"
        }}
      >
        {event.eventName}
      </h2>
      <div 
        className="mx-auto py-2 px-4 rounded-pill"
        style={{
          background: hasPromoContent ? "rgba(139, 92, 246, 0.1)" : "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(15px)",
          border: hasPromoContent ? "1px solid rgba(139, 92, 246, 0.3)" : "1px solid rgba(255, 255, 255, 0.4)",
          fontSize: "1.1rem",
          color: hasPromoContent ? colors.primary : colors.white,
          fontWeight: "500",
          maxWidth: "fit-content",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
        }}
      >
        {eventDate}
      </div>
    </div>
  );
};

// Countdown Timer Component
const CountdownTimer = ({ targetDate, hasPromoContent }) => {
  const { months, days, hours, minutes, seconds } = useCountdown(targetDate);

  const timeUnits = [
    { value: padTo2(months), label: "Miezi" },
    { value: padTo2(days), label: "Siku" },
    { value: padTo2(hours), label: "Saa" },
    { value: padTo2(minutes), label: "Dakika" },
    { value: padTo2(seconds), label: "Sekunde" },
  ];

  return (
    <Row className="g-3 justify-content-center">
      {timeUnits.map((unit, idx) => (
        <Col key={idx} xs={4} sm={2} className="px-2">
          <div
            className="p-3 rounded-4 text-center"
            style={{
              background: hasPromoContent ? "rgba(139, 92, 246, 0.1)" : "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(20px)",
              border: hasPromoContent ? "1px solid rgba(139, 92, 246, 0.2)" : "1px solid rgba(255, 255, 255, 0.3)",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = hasPromoContent ? "rgba(139, 92, 246, 0.2)" : "rgba(255, 255, 255, 0.35)";
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = hasPromoContent ? "rgba(139, 92, 246, 0.1)" : "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.15)";
            }}
          >
            <div
              className="fw-bold"
              style={{
                color: hasPromoContent ? colors.primary : colors.white,
                fontSize: "1.8rem",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1,
                textShadow: hasPromoContent ? "none" : "0 1px 4px rgba(0, 0, 0, 0.3)"
              }}
            >
              {unit.value}
            </div>
            <div
              className="mt-1"
              style={{
                color: hasPromoContent ? "rgba(139, 92, 246, 0.8)" : "rgba(255, 255, 255, 0.95)",
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                textShadow: hasPromoContent ? "none" : "0 1px 2px rgba(0, 0, 0, 0.2)"
              }}
            >
              {unit.label}
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

// Description Button Component
const DescriptionButton = ({ event, hasPromoContent, onShow }) => {
  if (!event.description) return null;

  return (
    <div className="mt-4">
      <Button
        onClick={onShow}
        className="border-0 fw-semibold"
        style={{
          background: hasPromoContent ? colors.gradient : "rgba(255, 255, 255, 0.2)",
          color: hasPromoContent ? colors.white : colors.white,
          padding: "12px 24px",
          borderRadius: "50px",
          fontSize: "0.95rem",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
          border: hasPromoContent ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
          transition: "all 0.3s ease",
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(139, 92, 246, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(139, 92, 246, 0.3)";
        }}
      >
        📖 Soma Maelezo Zaidi
      </Button>
    </div>
  );
};

// Decorative Elements Component
const DecorativeElements = ({ hasPromoContent }) => (
  <div className="mt-4 d-flex justify-content-center align-items-center">
    <div 
      style={{
        width: "60px",
        height: "2px",
        background: hasPromoContent ? "rgba(139, 92, 246, 0.6)" : "rgba(255, 255, 255, 0.8)",
        borderRadius: "1px",
        boxShadow: hasPromoContent ? "0 0 8px rgba(139, 92, 246, 0.3)" : "0 0 8px rgba(255, 255, 255, 0.3)"
      }}
    />
    <div 
      className="mx-3 rounded-circle"
      style={{
        width: "8px",
        height: "8px",
        background: hasPromoContent ? colors.primary : colors.white,
        boxShadow: hasPromoContent ? "0 0 10px rgba(139, 92, 246, 0.5)" : "0 0 10px rgba(255, 255, 255, 0.5)"
      }}
    />
    <div 
      style={{
        width: "60px",
        height: "2px",
        background: hasPromoContent ? "rgba(139, 92, 246, 0.6)" : "rgba(255, 255, 255, 0.8)",
        borderRadius: "1px",
        boxShadow: hasPromoContent ? "0 0 8px rgba(139, 92, 246, 0.3)" : "0 0 8px rgba(255, 255, 255, 0.3)"
      }}
    />
  </div>
);

// Event Description Modal Component
const EventDescriptionModal = ({ show, onHide, event }) => {
  const eventDate = new Date(event.targetDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const { months, days, hours, minutes } = useCountdown(event.targetDate);

  // Custom markdown components for styling
  const markdownComponents = {
    h1: ({children}) => (
      <h1 style={{
        color: colors.primary,
        fontSize: '1.8rem',
        fontWeight: '700',
        marginBottom: '1rem',
        fontFamily: "'Inter', sans-serif"
      }}>
        {children}
      </h1>
    ),
    h2: ({children}) => (
      <h2 style={{
        color: colors.primary,
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '0.8rem',
        fontFamily: "'Inter', sans-serif"
      }}>
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3 style={{
        color: colors.primary,
        fontSize: '1.3rem',
        fontWeight: '600',
        marginBottom: '0.6rem',
        fontFamily: "'Inter', sans-serif"
      }}>
        {children}
      </h3>
    ),
    p: ({children}) => (
      <p style={{
        color: colors.dark,
        fontSize: '1.1rem',
        lineHeight: '1.7',
        marginBottom: '1rem'
      }}>
        {children}
      </p>
    ),
    ul: ({children}) => (
      <ul style={{
        color: colors.dark,
        fontSize: '1.1rem',
        lineHeight: '1.7',
        marginBottom: '1rem',
        paddingLeft: '1.5rem'
      }}>
        {children}
      </ul>
    ),
    li: ({children}) => (
      <li style={{
        marginBottom: '0.5rem',
        listStyleType: 'disc'
      }}>
        {children}
      </li>
    ),
    strong: ({children}) => (
      <strong style={{
        color: colors.primary,
        fontWeight: '700'
      }}>
        {children}
      </strong>
    ),
    em: ({children}) => (
      <em style={{
        color: colors.secondary,
        fontStyle: 'italic'
      }}>
        {children}
      </em>
    ),
    blockquote: ({children}) => (
      <blockquote style={{
        borderLeft: `4px solid ${colors.primary}`,
        paddingLeft: '1rem',
        margin: '1rem 0',
        background: 'rgba(139, 92, 246, 0.05)',
        padding: '1rem',
        borderRadius: '8px',
        fontStyle: 'italic'
      }}>
        {children}
      </blockquote>
    )
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header 
        closeButton
        style={{
          background: colors.gradient,
          color: colors.white,
          border: "none",
          borderRadius: "12px 12px 0 0"
        }}
      >
        <Modal.Title 
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          📅 {event.eventName}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body 
        style={{
          background: "linear-gradient(135deg, #F8FAFC 0%, #EDE9FE 100%)",
          padding: "2rem"
        }}
      >
        <div 
          className="d-inline-block mb-4 px-3 py-2 rounded-pill"
          style={{
            background: "rgba(139, 92, 246, 0.1)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            color: colors.primary,
            fontSize: "0.9rem",
            fontWeight: "600"
          }}
        >
          🗓️ {eventDate}
        </div>
        
        <div className="markdown-content">
          <ReactMarkdown components={markdownComponents}>
            {event.description || ''}
          </ReactMarkdown>
        </div>
        
        <div className="mt-4 p-3 rounded-3" style={{ background: "rgba(139, 92, 246, 0.05)" }}>
          <div className="text-center">
            <div style={{ color: colors.primary, fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px" }}>
              ⏰ Muda uliobaki
            </div>
            <div style={{ color: colors.dark, fontSize: "1.1rem", fontWeight: "500" }}>
              {padTo2(months)} miezi, {padTo2(days)} siku, {padTo2(hours)} saa, {padTo2(minutes)} dakika
            </div>
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer 
        style={{
          background: colors.light,
          border: "none",
          borderRadius: "0 0 12px 12px",
          padding: "1.5rem"
        }}
      >
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          style={{
            borderRadius: "50px",
            padding: "10px 20px",
            fontWeight: "500"
          }}
        >
          Funga
        </Button>
        <Button 
          onClick={onHide}
          style={{
            background: colors.gradient,
            border: "none",
            borderRadius: "50px",
            padding: "10px 20px",
            fontWeight: "500",
            boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)"
          }}
        >
          Sawa, Nimeelewa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Main Event Card Component
export const EventCard = ({ event, index, isPromoVideo = false, isPromoImage = false }) => {
  const [showModal, setShowModal] = useState(false);
  
  const hasPromoContent = (event.backgroundVideo && isPromoVideo) || (event.backgroundImage && isPromoImage);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <Card 
        className="h-100 border-0 shadow-lg overflow-hidden position-relative"
        style={{
          background: colors.white,
          borderRadius: "20px",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 25px 50px rgba(139, 92, 246, 0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)";
        }}
      >
        {/* Promo Content */}
        <PromoImage event={event} isPromoImage={isPromoImage && !isPromoVideo} />
        <PromoVideo event={event} isPromoVideo={isPromoVideo} />

        {/* Background Media */}
        <BackgroundMedia event={event} hasPromoContent={hasPromoContent} />

        {/* Content Overlay */}

        <Card.Body 
          className="position-relative p-4 text-center"
          style={{
            zIndex: 2,
            minHeight: hasPromoContent ? "auto" : "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <EventHeader event={event} hasPromoContent={hasPromoContent} />
          <CountdownTimer targetDate={event.targetDate} hasPromoContent={hasPromoContent} />
          <DescriptionButton 
            event={event} 
            hasPromoContent={hasPromoContent} 
            onShow={handleShow} 
          />
          <DecorativeElements hasPromoContent={hasPromoContent} />
        </Card.Body>
      </Card>

      <EventDescriptionModal 
        show={showModal} 
        onHide={handleClose} 
        event={event} 
      />
    </>
  );
};

// Demo component to show the EventCard in action
export default function EventCountdownDemo() {
  const sampleEvent = {
    eventName: "Harusi ya Amina na Hassan",
    targetDate: "2025-08-15T14:00:00",
    description: `# Karibu Harusi ya Amina na Hassan! 🎉

Tunafurahi kuwaalika katika sherehe hii ya kipekee ya kuungana kwa mapenzi ya Amina na Hassan.

## Maelezo ya Sherehe

**Tarehe:** Ijumaa, Agosti 15, 2025  
**Muda:** 2:00 PM - 10:00 PM  
**Mahali:** Gardens za Mlimani, Dar es Salaam

### Ratiba ya Siku:
- **2:00 PM** - Kupokelewa kwa wageni
- **3:00 PM** - Ibada ya ndoa
- **4:00 PM** - Picha za kumbukumbu
- **6:00 PM** - Chakula cha jioni
- **8:00 PM** - Ngoma na burudani

### Maelezo Muhimu:
- Mavazi: **Rangi za bluu na nyeupe**
- Zawadi: *Hiari, lakini mapenzi yako ni zawadi kubwa zaidi*
- Mawasiliano: Hassan (+255 123 456 789) au Amina (+255 987 654 321)

> *"Mapenzi ni safari nzuri zaidi tunapoisafiri pamoja"*

Tunasubiri kuonana nanyi siku hiyo ya furaha!`,
    backgroundImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "2rem"
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <EventCard 
              event={sampleEvent} 
              index={0}
              isPromoImage={false}
              isPromoVideo={false}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}