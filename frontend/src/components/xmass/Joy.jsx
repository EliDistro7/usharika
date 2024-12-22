'use client';
import React, { useEffect, useState } from 'react';
import './Joy.css';

function Joy() {
  const [animatedText, setAnimatedText] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0); // State to track elapsed time
  const text = 'JOY to the World!';

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      // Stop the interval once we reach the end of the text
      if (currentIndex >= text.length) {
        clearInterval(intervalId);
        return;
      }

      // Update elapsed time
      setElapsedTime((prev) => prev + 100);

      // Prepare the styled text with alternating colors
      const newText = text
        .slice(0, currentIndex + 1)
        .split('')
        .map((char, index) => (
          <span
            key={index}
            className={`christmas-${index % 2 === 0 ? 'gold' : 'blue'}`}
          >
            {char}
          </span>
        ));

      setAnimatedText(newText);
      currentIndex += 1; // Increment the index
    }, 100);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [text]); // No need to depend on elapsedTime

  return (
    <div className="container2">
      <div id="snow"></div>
      <h1 className="christmas h1">{animatedText}</h1>
      <p>Elapsed Time: {elapsedTime}ms</p> {/* Display elapsed time */}
    </div>
  );
}

export default Joy;
