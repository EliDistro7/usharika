"use client";

import React, { useEffect, useState } from "react";

export const NewsTicker = ({
  updates,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  updates: {
    content: string;
    group: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current?.appendChild(duplicatedItem);
      });

      setDirection();
      setSpeed();
      setStart(true);
    }
  }

  const setDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const setSpeed = () => {
    const duration =
      speed === "fast" ? "30s" : speed === "normal" ? "60s" : "80s";
    containerRef.current?.style.setProperty("--animation-duration", duration);
  };

  return (
    <div
      className={`news-ticker-container d-flex align-items-center ${className}`}
      style={{
        backgroundColor: "#ddd", // Static background
        color: "#fff",
        
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Breaking News Label */}
     

      {/* Scrolling Updates */}
      <div
        ref={containerRef}
        className="w-100 px-0"
        style={{
           // Space for Breaking News label
          overflow: "hidden",
          
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
            animation: `scroll var(--animation-duration, 30s) linear infinite`,
          }}
        >
          {updates.map((update, idx) => (
            <li
              key={idx}
              className="news-item px-3 py-2 mx-2 rounded text-dark shadow-sm"
              style={{
                display: "inline-block",
                flex: "0 0 auto",
                minWidth: "200px",
                border: "1px solid #ddd",
                borderRadius: "10px",
              }}
            >
              <span className="text-primary fw-bold me-1">{update.group}:</span>
              <span>{update.content}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
