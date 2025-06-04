// Individual Event Card Component with Improved Masking Contrast

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useCountdown } from './CountDown';

// Color scheme
const colors = {
  primary: "#8B5CF6",      // Modern purple
  secondary: "#A855F7",    // Lighter purple
  accent: "#7C3AED",       // Deeper purple
  dark: "#1F2937",         // Dark gray
  light: "#F8FAFC",        // Light background
  white: "#FFFFFF",
  gradient: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #7C3AED 100%)"
};

const padTo2 = (num) => String(num).padStart(2, '0');

export const EventCard = ({ event, index }) => {
  const { months, days, hours, minutes, seconds } = useCountdown(event.targetDate);
  
  const eventDate = new Date(event.targetDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
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
      {/* Background Media with Enhanced Masking */}
      <div 
        className="position-absolute w-100 h-100"
        style={{
          top: 0,
          left: 0,
          zIndex: 1,
          background: event.backgroundVideo ? 'transparent' : colors.gradient,
        }}
      >
        {/* Background Image with Enhanced Mask */}
        {event.backgroundImage && !event.backgroundVideo && (
          <>
            <div
              className="position-absolute w-100 h-100"
              style={{
                backgroundImage: `url(${event.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                // More dramatic masking with stronger contrast
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
                opacity: 0.9, // Increased opacity for better visibility
                filter: "contrast(1.3) saturate(1.2)" // Enhanced contrast and saturation
              }}
            />
            {/* Stronger Gradient Overlay */}
            <div 
              className="position-absolute w-100 h-100"
              style={{
                background: `
                  radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.5) 0%, transparent 40%),
                  radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.6) 0%, transparent 40%),
                  linear-gradient(135deg, rgba(124, 58, 237, 0.4) 0%, rgba(139, 92, 246, 0.6) 50%, rgba(168, 85, 247, 0.4) 100%)
                `,
                mixBlendMode: "multiply" // Blend mode for better integration
              }}
            />
          </>
        )}

        {/* Video Background with Enhanced Mask */}
        {event.backgroundVideo && (
          <>
            <video
              autoPlay
              muted
              loop
              className="position-absolute w-100 h-100"
              style={{
                objectFit: "cover",
                // More dramatic video masking
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
                opacity: 0.8, // Increased opacity
                filter: "contrast(1.4) brightness(1.1) saturate(1.3)" // Enhanced visual impact
              }}
            >
              <source src={event.backgroundVideo} type="video/mp4" />
            </video>
            {/* Enhanced Gradient Overlay for Video */}
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
                mixBlendMode: "screen" // Different blend mode for video
              }}
            />
          </>
        )}

        {/* Enhanced Decorative Overlay */}
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

        {/* Additional Edge Vignette for More Drama */}
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

      {/* Content Overlay with Enhanced Backdrop */}
      <Card.Body className="position-relative p-5 text-center" style={{ zIndex: 2 }}>
        {/* Event Title */}
        <div className="mb-4">
          <h2 
            className="fw-bold mb-3"
            style={{
              fontSize: "2.5rem",
              color: colors.white,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)", // Added text shadow for better readability
              filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))"
            }}
          >
            {event.eventName}
          </h2>
          <div 
            className="mx-auto py-2 px-4 rounded-pill"
            style={{
              background: "rgba(255, 255, 255, 0.25)", // Increased opacity
              backdropFilter: "blur(15px)", // Stronger blur
              border: "1px solid rgba(255, 255, 255, 0.4)", // More visible border
              fontSize: "1.1rem",
              color: colors.white,
              fontWeight: "500",
              maxWidth: "fit-content",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" // Added shadow
            }}
          >
            {eventDate}
          </div>
        </div>

        {/* Countdown Timer */}
        <Row className="g-3 justify-content-center">
          {[
            { value: padTo2(months), label: "Miezi" },
            { value: padTo2(days), label: "Siku" },
            { value: padTo2(hours), label: "Saa" },
            { value: padTo2(minutes), label: "Dakika" },
            { value: padTo2(seconds), label: "Sekunde" },
          ].map((unit, idx) => (
            <Col key={idx} xs={4} sm={2} className="px-2">
              <div
                className="p-3 rounded-4 text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.2)", // Increased base opacity
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)" // Added shadow
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)"; // Higher hover opacity
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.15)";
                }}
              >
                <div
                  className="fw-bold"
                  style={{
                    color: colors.white,
                    fontSize: "1.8rem",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1,
                    textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)" // Added text shadow
                  }}
                >
                  {unit.value}
                </div>
                <div
                  className="mt-1"
                  style={{
                    color: "rgba(255, 255, 255, 0.95)", // Slightly more opaque
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  {unit.label}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Enhanced Decorative Elements */}
        <div className="mt-4 d-flex justify-content-center align-items-center">
          <div 
            style={{
              width: "60px",
              height: "2px",
              background: "rgba(255, 255, 255, 0.8)", // More opaque
              borderRadius: "1px",
              boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)" // Added glow
            }}
          />
          <div 
            className="mx-3 rounded-circle"
            style={{
              width: "8px", // Slightly larger
              height: "8px",
              background: colors.white,
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)" // Added glow
            }}
          />
          <div 
            style={{
              width: "60px",
              height: "2px",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "1px",
              boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)"
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
};