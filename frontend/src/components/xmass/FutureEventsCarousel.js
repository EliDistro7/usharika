// Main Component

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { EventCard } from './EventCard';
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

const FutureEventsCarousel = () => {
  const events = [
    {
      targetDate: "2025-08-14T00:00:00Z",
      eventName: "The Cross Episode II",
      backgroundImage: "/img/cross.jpeg",
    },
    {
      targetDate: "2025-06-25T00:00:00Z",
      eventName: "Tamasha la Muziki",
      backgroundVideo: "https://res.cloudinary.com/df9gkjxm8/video/upload/v1736323913/profile/yghwfekbdmjtou9kbv97.mp4",
    },
  ];

  return (
    <div 
      className="py-5"
      style={{
        background: `linear-gradient(135deg, ${colors.light} 0%, #EDE9FE 50%, ${colors.light} 100%)`,
        minHeight: "100vh"
      }}
    >
      <Container fluid className="px-4">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h1 
            className="fw-bold mb-3"
            style={{
              fontSize: "3.5rem",
              background: colors.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.02em"
            }}
          >
            Matukio Yajayo
          </h1>
          <p 
            className="lead"
            style={{
              color: colors.dark,
              fontSize: "1.2rem",
              maxWidth: "600px",
              margin: "0 auto",
              opacity: 0.8
            }}
          >
            Fuatilia matukio yetu makubwa yanayokuja na ujue ni lini hasa
          </p>
        </div>

        {/* Events Grid */}
        <Row className="g-4 justify-content-center">
          {events.map((event, index) => (
            <Col key={index} xl={5} lg={6} md={8} sm={10} xs={12}>
              <EventCard event={event} index={index} />
            </Col>
          ))}
        </Row>

        {/* Bottom Decoration */}
        <div className="text-center mt-5 pt-4">
          <div 
            className="mx-auto rounded-pill"
            style={{
              width: "120px",
              height: "4px",
              background: colors.gradient,
              opacity: 0.6
            }}
          />
        </div>
      </Container>
    </div>
  );
};

export default FutureEventsCarousel;