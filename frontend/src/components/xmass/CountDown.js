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
  white: "#ffffff",
  lightPurple: "#F5F3FF",
  purple: "#9370DB",
  darkPurple: "#6a0dad",
  black: "#1a1a1a",
  gold: "#FFD700"
};

const padTo2 = (num) => String(num).padStart(2, '0');

// Complete useCountdown hook implementation
const useCountdown = (targetDate) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target - now;

    if (diff <= 0) {
      return { 
        months: 0, 
        days: 0, 
        hours: 0, 
        minutes: 0, 
        seconds: 0 
      };
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
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
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
          : `linear-gradient(rgba(255, 255, 255, 0.9), rgba(245, 243, 255, 0.95)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "80px 20px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
            opacity: 0.2
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {showCountdown && (
        <Container className="py-4">
          <div className="mb-5">
            <h1
              className={`${cinzel.className} mb-3`}
              style={{
                fontSize: "2.8rem",
                color: colors.darkPurple,
                fontWeight: 700,
                letterSpacing: "1px",
                lineHeight: 1.2
              }}
            >
              {eventName}
            </h1>
            <div 
              className={`${cormorant.className} mx-auto`}
              style={{
                fontSize: "1.3rem",
                color: colors.black,
                maxWidth: "600px",
                borderTop: `2px solid ${colors.purple}`,
                borderBottom: `2px solid ${colors.purple}`,
                padding: "12px 0"
              }}
            >
              Siku: <span style={{ color: colors.darkPurple, fontWeight: 600 }}>{eventDate}</span>
            </div>
          </div>

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
                  className="p-4 rounded-lg h-100 d-flex flex-column justify-content-center"
                  style={{
                    background: colors.white,
                    border: `3px solid ${colors.lightPurple}`,
                    boxShadow: `0 4px 12px ${colors.purple}20`,
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${colors.purple}30`;
                    e.currentTarget.style.borderColor = colors.purple;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.purple}20`;
                    e.currentTarget.style.borderColor = colors.lightPurple;
                  }}
                >
                  <div
                    className={`${cinzel.className}`}
                    style={{
                      color: colors.darkPurple,
                      fontSize: "2.2rem",
                      fontWeight: 700,
                      lineHeight: 1
                    }}
                  >
                    {unit.value}
                  </div>
                  <div
                    className={`mt-2 ${cormorant.className}`}
                    style={{
                      color: colors.purple,
                      fontSize: "0.9rem",
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

          <div className="mt-5 pt-4">
            <div 
              style={{
                height: "2px",
                width: "120px",
                background: `linear-gradient(90deg, transparent, ${colors.purple}, transparent)`,
                margin: "0 auto",
                opacity: 0.6
              }} 
            />
          </div>
        </Container>
      )}
    </div>
  );
};