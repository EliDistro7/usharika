'use client';

import React, { useEffect, useState } from "react";
import "./Spinner.css"; // Assuming your spinner CSS is in Spinner.css

const Spinner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000); // Adjust the delay as needed (e.g., 1 second)

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    isVisible && (
      <div
        id="spinner"
        className="show w-100 vh-100 bg-white position-fixed translate-middle top-50 start-50 d-flex align-items-center justify-content-center"
      >
        <div className="spinner-grow " style={{color:"#6f42c1"}} role="status"></div>
      </div>
    )
  );
};

export default Spinner;
