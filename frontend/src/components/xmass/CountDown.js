import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./CountDown.css";

export const useCountdown = (targetDate) => {
  const validDate = new Date(targetDate);
  if (isNaN(validDate)) {
    console.error(
      "Invalid targetDate provided. Please ensure it is a valid Date or a parsable string."
    );
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(validDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(validDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [validDate]);

  return timeLeft;
};

function calculateTimeLeft(targetDate) {
  const now = new Date();
  const timeDifference = targetDate.getTime() - now.getTime();

  if (timeDifference <= 0) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(timeDifference / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return { months, days, hours, minutes, seconds };
}

function padTo2(num) {
  return num.toString().padStart(2, "0");
}

export const CountdownDisplay = ({
  eventName,
  targetDate,
  backgroundImage,
  backgroundVideo,
  showCountdown = true, // Default is to show the countdown
}) => {
  const { months, days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <div
      className="countdown-body text-center text-white mt-0"
      style={{
        position: "relative",
        backgroundImage: backgroundVideo ? "none" : `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#000",
        padding: "50px 20px",
      }}
    >
      {/* Video Background */}
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

      {/* Overlay */}
      <div className="overlay" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)" }} />

      {showCountdown && (
        <Container className="py-5" style={{ position: "relative", zIndex: 1 }}>
          <h1 className="display-4 fw-bold mb-4">
            Countdown to <span className="text-warning">{eventName}</span>
          </h1>
          <Row className="g-3 justify-content-center">
            {[
              { value: padTo2(months), label: "Miezi" },
              { value: padTo2(days), label: "Siku" },
              { value: padTo2(hours), label: "Masaa" },
              { value: padTo2(minutes), label: "Dakika" },
              { value: padTo2(seconds), label: "Sekunde" },
            ].map((unit, index) => (
              <Col key={index} xs={6} sm={4} md={2}>
                <div className="countdown-box p-3 rounded shadow text-dark">
                  <div className="countdown-number display-5 fw-bold">
                    {unit.value}
                  </div>
                  <small className="text-muted text-uppercase">
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
