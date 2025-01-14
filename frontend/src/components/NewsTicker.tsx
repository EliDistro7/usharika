"use client";

import React, { useEffect, useState } from "react";

export const NewsTicker = ({
  updates,
  direction = "left",
  pauseOnHover = true,
  className,
}: {
  updates: {
    content: string;
    group: string;
  }[];
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [animationDuration, setAnimationDuration] = useState("60s");
  const [scrollWidth, setScrollWidth] = useState(0);
  const [start, setStart] = useState(false);

  useEffect(() => {
    calculateScrollProperties();
    window.addEventListener("resize", calculateScrollProperties);

    return () => {
      window.removeEventListener("resize", calculateScrollProperties);
    };
  }, [updates]);

  const calculateScrollProperties = () => {
    if (scrollerRef.current) {
      const totalWidth = Array.from(scrollerRef.current.children).reduce(
        (acc, item) => acc + (item as HTMLElement).offsetWidth,
        0
      );

      const estimatedCharsPerItem = 180; // Approx characters per bulletin
      const secondsPerItem = 4; // Approx seconds to read a single bulletin
      const baseDuration = updates.length * secondsPerItem;

      // Add scaling based on total width (to slow down further for larger widths)
      const scaleFactor = 0.02; // Slower for larger widths
      const extraTime = totalWidth * scaleFactor;

      // Add buffer time for smoother experience
      const totalDuration = (baseDuration + extraTime).toFixed(2);

      setScrollWidth(totalWidth);
      setAnimationDuration(`${totalDuration}s`);
      setStart(true);
    }
  };

  return (
    <div
      className={`news-ticker-container d-flex align-items-center ${className}`}
      style={{
        overflow: "hidden",
        position: "relative",
        height: "50px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        ref={containerRef}
        className="w-100 px-0"
        style={{
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <ul
          ref={scrollerRef}
          className={`news-ticker-list w-100 d-flex list-unstyled mb-0 p-0 ${
            start ? "animate-scroll" : ""
          } ${pauseOnHover ? "hover-animation-pause" : ""}`}
          style={{
            display: "flex",
            margin: 0,
            padding: 0,
            animation: `scroll ${animationDuration} linear infinite`,
            listStyle: "none",
            willChange: "transform",
          }}
        >
          {updates.map((update, idx) => (
            <li
              key={idx}
              className="news-item px-3 py-2 mx-2"
              style={{
                display: "inline-block",
                flex: "0 0 auto",
                minWidth: "200px",
                backgroundColor: "#f8f9fa",
              
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span className="text-primary fw-bold me-1" style={{ color: "#007bff" }}>
                {update.group}:
              </span>
              <span>{update.content}</span>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .hover-animation-pause:hover {
          animation-play-state: paused !important;
        }
        @keyframes scroll {
          0% {
            transform: translateX(-5%);
          }
          100% {
            transform: translateX(-${scrollWidth}px);
          }
            
        }
      `}</style>
    </div>
  );
};
