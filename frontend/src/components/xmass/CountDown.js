import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

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
      className="countdown-body text-center text-white mt-0"
      style={{
        position: "relative",
        backgroundImage: backgroundVideo
          ? "none"
          : `linear-gradient(rgba(106, 13, 173, 0.7), rgba(155, 89, 182, 0.7)), url(${backgroundImage})`,
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
          background: "rgba(106, 13, 173, 0.4)",
          backdropFilter: "blur(5px)",
        }}
      />

      {showCountdown && (
        <Container className="py-5" style={{ position: "relative", zIndex: 1 }}>
          <h1
            className="display-3 fw-bold mb-4"
            style={{ color: "#ffffff", fontFamily: "'Poppins', sans-serif" }}
          >
            Countdown to <span style={{ color: "#d8b4e2" }}>{eventName}</span>
          </h1>
          <p
            className="lead mb-5"
            style={{ color: "rgba(255, 255, 255, 0.8)", fontFamily: "'Poppins', sans-serif" }}
          >
            Event Date: <span style={{ color: "#d8b4e2" }}>{eventDate}</span>
          </p>
          <Row className="g-4 justify-content-center">
            {[
              { value: padTo2(months), label: "Months" },
              { value: padTo2(days), label: "Days" },
              { value: padTo2(hours), label: "Hours" },
              { value: padTo2(minutes), label: "Minutes" },
              { value: padTo2(seconds), label: "Seconds" },
            ].map((unit, index) => (
              <Col key={index} xs={6} sm={4} md={2}>
                <div
                  className="countdown-box p-4 rounded shadow"
                  style={{
                    background: "rgba(155, 89, 182, 0.2)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(155, 89, 182, 0.4)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(106, 13, 173, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(106, 13, 173, 0.2)";
                  }}
                >
                  <div
                    className="countdown-number display-4 fw-bold"
                    style={{
                      color: "#d8b4e2",
                      fontFamily: "'Roboto Mono', monospace",
                    }}
                  >
                    {unit.value}
                  </div>
                  <small
                    className="text-uppercase fw-semibold"
                    style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    {unit.label}
                  </small>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
};
