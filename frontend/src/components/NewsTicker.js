"use client";

import React, { useEffect, useState } from "react";
import { getAllUpdates } from "../actions/updates"; // Adjust the import path based on your project structure
import { formatRoleName } from "@/actions/utils";

export const NewsTicker = ({
  direction = "left",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  const [updates, setUpdates] = useState([]);
  const [animationDuration, setAnimationDuration] = useState("60s");
  const [scrollWidth, setScrollWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);

  // Function to parse content and make links clickable
  const parseContentWithLinks = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="news-link"
            style={{
              color: '#8B5CF6',
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
              textUnderlineOffset: '2px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#7C3AED';
              e.currentTarget.style.textDecorationStyle = 'solid';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8B5CF6';
              e.currentTarget.style.textDecorationStyle = 'dotted';
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling to parent elements
            }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Fetch updates only once
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        const updatesData = await getAllUpdates(); // API function to fetch updates
        setUpdates(updatesData);
      } catch (error) {
        console.error("Error fetching updates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Recalculate scroll properties when updates change
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
        (acc, item) => acc + (item).offsetWidth,
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

  const getGroupColor = (group) => {
    const colors = {
      news: { bg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', text: 'white' },
      updates: { bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', text: 'white' },
      alerts: { bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', text: 'white' },
      announcements: { bg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', text: 'white' },
      default: { bg: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', text: 'white' }
    };
    
    const normalizedGroup = group.toLowerCase();
    return colors[normalizedGroup] || colors.default;
  };

  return (
    <div
      className={`news-ticker-container position-relative ${className}`}
      style={{
        overflow: "hidden",
        height: "70px",
        borderRadius: "16px",
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        border: '2px solid rgba(139, 92, 246, 0.1)',
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Animated Background Pattern */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)',
          animation: 'backgroundShift 20s ease-in-out infinite alternate'
        }}
      />

      {/* "LIVE" Indicator */}
      <div 
        className="position-absolute start-0 top-50 translate-middle-y d-flex align-items-center px-3 py-2 ms-3"
        style={{
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          borderRadius: '12px',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
        }}
      >
        <div 
          className="me-2"
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'white',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}
        />
        <span className="text-white small"></span>
      </div>

      {/* Main Content Container */}
      <div
        ref={containerRef}
        className="h-100 d-flex align-items-center"
        style={{
          overflow: "hidden",
          paddingLeft: "90px", // Space for LIVE indicator
          paddingRight: "20px",
          position: "relative",
        }}
      >
        {loading ? (
          <div className="d-flex align-items-center">
            <div 
              className="spinner-border me-3"
              style={{ 
                width: '1.5rem', 
                height: '1.5rem',
                color: '#8B5CF6',
                borderWidth: '2px'
              }}
            />
            <span 
              className="fw-medium"
              style={{ 
                color: '#8B5CF6',
                fontSize: '0.95rem'
              }}
            >
              Loading latest updates...
            </span>
          </div>
        ) : (
          <ul
            ref={scrollerRef}
            className={`news-ticker-list d-flex list-unstyled mb-0 p-0 align-items-center ${
              start ? "animate-scroll" : ""
            } ${pauseOnHover ? "hover-animation-pause" : ""}`}
            style={{
              display: "flex",
              margin: 0,
              padding: 0,
              animation: `scroll ${animationDuration} linear infinite`,
              listStyle: "none",
              willChange: "transform",
              height: '100%'
            }}
          >
            {/* Duplicate items for seamless loop */}
            {[...updates, ...updates].map((update, idx) => {
              const groupStyle = getGroupColor(update.group);
              return (
                <li
                  key={`${idx}-${update.group}`}
                  className="news-item d-flex align-items-center mx-3"
                  style={{
                    display: "inline-flex",
                    flex: "0 0 auto",
                    minWidth: "220px",
                    height: '45px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: "14px",
                    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)",
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {/* Group Badge */}
                  <div
                    className="px-3 py-1 me-3 d-flex align-items-center justify-content-center"
                    style={{
                      background: groupStyle.bg,
                      color: groupStyle.text,
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      minWidth: '60px',
                      height: '28px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    {formatRoleName(update.group)}
                  </div>

                  {/* Content with clickable links */}
                  <div 
                    className="flex-grow-1 pe-2"
                    style={{
                      fontSize: '0.9rem',
                      color: '#374151',
                      fontWeight: '500',
                      lineHeight: '1.4',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {parseContentWithLinks(update.content)}
                  </div>

                  {/* Subtle Separator Line */}
                  <div 
                    className="ms-2"
                    style={{
                      width: '2px',
                      height: '20px',
                      background: 'linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.3), transparent)',
                      borderRadius: '1px'
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Gradient Fade Edges */}
      <div 
        className="position-absolute top-0 start-0 h-100"
        style={{
          width: '100px',
          background: 'linear-gradient(to right, rgba(248, 250, 252, 0.9), transparent)',
          pointerEvents: 'none',
          zIndex: 5
        }}
      />
      <div 
        className="position-absolute top-0 end-0 h-100"
        style={{
          width: '50px',
          background: 'linear-gradient(to left, rgba(248, 250, 252, 0.9), transparent)',
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      <style jsx>{`
        .hover-animation-pause:hover {
          animation-play-state: paused !important;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${scrollWidth}px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(0.8);
          }
        }
        
        @keyframes backgroundShift {
          0% {
            transform: translateX(-10px);
          }
          100% {
            transform: translateX(10px);
          }
        }
        
        .news-ticker-container:hover .news-item {
          animation-play-state: paused;
        }
        
        .news-item {
          position: relative;
        }
        
        .news-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
          border-radius: 14px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .news-item:hover::before {
          opacity: 1;
        }
        
        .news-link {
          position: relative;
          z-index: 10;
        }
        
        .news-link:hover {
          text-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
        }
        
        @media (max-width: 768px) {
          .news-ticker-container {
            height: 60px;
          }
          
          .news-item {
            min-width: 200px;
            height: 40px;
          }
          
          .news-item div:first-child {
            min-width: 50px;
            height: 24px;
            font-size: 0.7rem;
          }
          
          .news-item div:last-child {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};