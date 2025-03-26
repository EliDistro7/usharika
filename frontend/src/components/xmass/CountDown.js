import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Cinzel, Playfair_Display, Cormorant_Garamond } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
});

// Color scheme
const colors = {
  black: "#1a1a1a",         // Bold black
  purple: "#9370DB",        // Lighter purple
  yellow: "#FFD700",        // Gold yellow
  lightBg: "#F5F3FF",       // Very light purple background
  white: "#ffffff",         // Pure white
  gray: "#666666"           // Medium gray
};

const padTo2 = (num) => String(num).padStart(2, '0');

const useCountdown = (targetDate) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target - now;

    if (diff <= 0) {
      return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { months, days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

export const CountdownDisplay = ({
  eventName,
  targetDate,
  backgroundImage,
  backgroundVideo,
  showCountdown = true,
}) => {
  const { months, days, hours, minutes, seconds } = useCountdown(targetDate);

  const eventDate = new Date(targetDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className={`countdown-body text-center ${playfair.className}`}
      style={{
        position: "relative",
        backgroundImage: backgroundVideo
          ? "none"
          : `linear-gradient(rgba(26, 26, 26, 0.8), rgba(106, 13, 173, 0.6)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "100px 20px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      <div
        className="overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${colors.black}80, ${colors.purple}80)`,
          backdropFilter: "blur(2px)",
          zIndex: 0,
        }}
      />

      {showCountdown && (
        <Container className="py-5" style={{ position: "relative", zIndex: 1 }}>
          <h1
            className={`mb-4 ${cinzel.className}`}
            style={{
              fontSize: "3rem",
              color: colors.white,
              textTransform: "uppercase",
              letterSpacing: "2px",
              textShadow: `2px 2px 4px ${colors.black}`
            }}
          >
            <span style={{ color: colors.yellow }}>{eventName}</span>
          </h1>
          <p
            className={`mb-5 ${cormorant.className}`}
            style={{
              fontSize: "1.4rem",
              color: colors.white,
              textShadow: `1px 1px 2px ${colors.black}`
            }}
          >
            Siku: <span style={{ color: colors.yellow }}>{eventDate}</span>
          </p>
          <Row className="g-4 justify-content-center">
            {[
              { value: padTo2(months), label: "Miezi" },
              { value: padTo2(days), label: "Siku" },
              { value: padTo2(hours), label: "Saa" },
              { value: padTo2(minutes), label: "Dakika" },
              { value: padTo2(seconds), label: "Sekunde" },
            ].map((unit, index) => (
              <Col key={index} xs={6} sm={4} md={2}>
                <div
                  className="p-4 rounded-3"
                  style={{
                    background: `rgba(26, 26, 26, 0.7)`,
                    backdropFilter: "blur(10px)",
                    border: `2px solid ${colors.purple}`,
                    transition: "all 0.3s ease",
                    boxShadow: `0 4px 8px ${colors.purple}40`,
                    height: "100%"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = `0 8px 16px ${colors.purple}60`;
                    e.currentTarget.style.borderColor = colors.yellow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 4px 8px ${colors.purple}40`;
                    e.currentTarget.style.borderColor = colors.purple;
                  }}
                >
                  <div
                    className={`${cinzel.className}`}
                    style={{
                      color: colors.yellow,
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      lineHeight: 1.2
                    }}
                  >
                    {unit.value}
                  </div>
                  <div
                    className={`mt-2 ${cormorant.className}`}
                    style={{
                      color: colors.white,
                      fontSize: "1rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}
                  >
                    {unit.label}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
};