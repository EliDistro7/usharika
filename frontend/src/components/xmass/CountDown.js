import { useEffect, useState } from 'react';
import './CountDown.css';

export const useCountdown = (targetDate) => {
  const validDate = new Date(targetDate);
  if (isNaN(validDate)) {
    console.error('Invalid targetDate provided. Please ensure it is a valid Date or a parsable string.');
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
  return num.toString().padStart(2, '0');
}

export const CountdownDisplay = ({ eventName, targetDate, backgroundImage }) => {
  const { months, days, hours, minutes, seconds } = useCountdown(targetDate);

 

  return (
    <div className="countdown-body">
      {/* Background */}
      <div  style={{
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: -1,
  }}>

      <div className="snow-container">
        {Array.from({ length: 200 }).map((_, index) => (
          <div key={index} className="snowflake" />
        ))}
      </div>
  
      <h1>Countdown to {eventName}</h1>
      <div className="countdown">
        <div id="months" data-desc="Miezi" className="animate-in" style={{ '--d': '1800ms' }}>
          <span>{padTo2(months)}</span>
        </div>
        <div id="days" data-desc="Siku" className="animate-in" style={{ '--d': '1500ms' }}>
          <span>{padTo2(days)}</span>
        </div>
        <div id="hours" data-desc="Masaa" className="animate-in" style={{ '--d': '1200ms' }}>
          <span>{padTo2(hours)}</span>
        </div>
        <div id="minutes" data-desc="Dakika" className="animate-in" style={{ '--d': '800ms' }}>
          <span>{padTo2(minutes)}</span>
        </div>
        <div id="seconds" data-desc="Sekunde" className="animate-in" style={{ '--d': '500ms' }}>
          <span>{padTo2(seconds)}</span>
        </div>
      </div>
      </div>
     
    </div>
  );
  
};
