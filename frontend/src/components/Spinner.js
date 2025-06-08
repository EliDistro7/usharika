'use client';

import React, { useEffect, useState } from "react";
import "./Spinner.css";

const Spinner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Hide spinner after loading completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    isVisible && (
      <div className="yombo-loader-container">
        {/* Animated background */}
        <div className="yombo-bg-animation"></div>
        
        {/* Main loader content */}
        <div className="yombo-loader-content">
          {/* Logo/Brand area */}
          <div className="yombo-brand">
            <div className="yombo-logo-circle">
              <span className="yombo-logo-text">Y</span>
            </div>
            <h1 className="yombo-title">Yombo KKKT</h1>
            <p className="yombo-subtitle">Loading your experience...</p>
          </div>

          {/* Multiple spinner elements */}
          <div className="yombo-spinners">
            <div className="yombo-spinner-main"></div>
            <div className="yombo-spinner-orbit"></div>
            <div className="yombo-spinner-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="yombo-progress-container">
            <div className="yombo-progress-bar">
              <div 
                className="yombo-progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="yombo-progress-text">{progress}%</span>
          </div>

          {/* Floating particles */}
          <div className="yombo-particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Spinner;