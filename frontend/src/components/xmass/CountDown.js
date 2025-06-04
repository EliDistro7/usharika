import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

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

// Countdown hook
export const useCountdown = (targetDate) => {
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


