"use client";

import React, { useEffect, useState } from "react";
import { getAllUpdates } from "../actions/updates";
import { formatRoleName } from "@/actions/utils";
import { Spinner } from "react-bootstrap";
import { Bell, Clock, Users, Megaphone } from "lucide-react";

export const NewsTicker = ({
  direction = "left",
  pauseOnHover = true,
  className,
}: {
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [updates, setUpdates] = useState<{ content: string; group: string; createdAt?: string }[]>(
    []
  );
  const [animationDuration, setAnimationDuration] = useState("60s");
  const [scrollWidth, setScrollWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch updates only once
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        const updatesData = await getAllUpdates();
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
    if (updates.length > 0) {
      // Small delay to ensure DOM is rendered
      const timer = setTimeout(() => {
        calculateScrollProperties();
      }, 100);
      
      window.addEventListener("resize", calculateScrollProperties);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", calculateScrollProperties);
      };
    }
  }, [updates]);

  const calculateScrollProperties = () => {
    if (scrollerRef.current && updates.length > 0) {
      // Force a reflow to ensure elements are properly measured
      scrollerRef.current.style.animation = 'none';
      scrollerRef.current.offsetHeight; // Trigger reflow
      
      const children = Array.from(scrollerRef.current.children);
      const totalWidth = children.reduce(
        (acc, item) => {
          const element = item as HTMLElement;
          // Get the actual computed width including margins
          const rect = element.getBoundingClientRect();
          return acc + rect.width + 20; // 20px margin between items
        },
        0
      );

      // Calculate duration based on content length and readability
      const averageReadingSpeed = 200; // words per minute
      const totalWords = updates.reduce((acc, update) => 
        acc + update.content.split(' ').length, 0
      );
      const readingTime = (totalWords / averageReadingSpeed) * 60; // seconds
      const minimumTime = updates.length * 3; // minimum 3 seconds per item
      const calculatedDuration = Math.max(readingTime, minimumTime, 30);

      setScrollWidth(totalWidth);
      setAnimationDuration(`${calculatedDuration.toFixed(1)}s`);
      
      // Re-enable animation
      requestAnimationFrame(() => {
        setStart(true);
      });
    }
  };

  const getGroupIcon = (group: string) => {
    const groupLower = group.toLowerCase();
    if (groupLower.includes('admin') || groupLower.includes('management')) {
      return <Megaphone size={14} className="me-1" />;
    }
    if (groupLower.includes('user') || groupLower.includes('member')) {
      return <Users size={14} className="me-1" />;
    }
    return <Bell size={14} className="me-1" />;
  };

  const getGroupColor = (group: string) => {
    const groupLower = group.toLowerCase();
    if (groupLower.includes('admin') || groupLower.includes('management')) {
      return '#dc3545'; // Red for admin
    }
    if (groupLower.includes('moderator')) {
      return '#fd7e14'; // Orange for moderator
    }
    if (groupLower.includes('premium')) {
      return '#b8860b'; // Gold for premium
    }
    return '#6f42c1'; // Purple for others
  };

  return (
    <div
      className={`news-ticker-container position-relative ${className}`}
      style={{
        overflow: "hidden",
        height: "60px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #f8f4ff 0%, #e8d8ff 50%, #f0e8ff 100%)",
        border: "2px solid rgba(111, 66, 193, 0.1)",
        boxShadow: "0 4px 20px rgba(111, 66, 193, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Border */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          borderRadius: "16px",
          background: "linear-gradient(90deg, transparent, rgba(111, 66, 193, 0.3), transparent)",
          animation: "borderGlow 3s ease-in-out infinite alternate",
          zIndex: 0,
        }}
      />

      {/* Header Label */}
      <div
        className="position-absolute top-0 start-0 d-flex align-items-center px-3 h-100"
        style={{
          background: "linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)",
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
          borderTopRightRadius: "0px",
          borderBottomRightRadius: "20px",
          color: "white",
          fontSize: "0.85rem",
          fontWeight: "600",
          zIndex: 3,
          minWidth: "120px",
          boxShadow: "2px 0 10px rgba(111, 66, 193, 0.3)",
        }}
      >
        <Bell size={16} className="me-2" />
        <span>UPDATES</span>
      </div>

      {/* Main Content Area */}
      <div
        ref={containerRef}
        className="position-relative h-100 d-flex align-items-center"
        style={{
          marginLeft: "120px",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        {loading ? (
          <div className="d-flex align-items-center px-4">
            <Spinner
              animation="border"
              size="sm"
              style={{ color: "#6f42c1", width: "20px", height: "20px" }}
              className="me-3"
            />
            <span
              style={{
                color: "#6f42c1",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              Loading latest updates...
            </span>
          </div>
        ) : updates.length === 0 ? (
          <div className="d-flex align-items-center px-4">
            <Clock size={16} className="me-2" style={{ color: "#9ca3af" }} />
            <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              No updates available at the moment
            </span>
          </div>
        ) : (
          <ul
            ref={scrollerRef}
            className={`news-ticker-list d-flex list-unstyled mb-0 p-0 ${
              start ? "animate-scroll" : ""
            } ${pauseOnHover && isPaused ? "paused" : ""}`}
            style={{
              display: "flex",
              margin: 0,
              padding: 0,
              animation: `scroll-${direction} ${animationDuration} linear infinite`,
              listStyle: "none",
              willChange: "transform",
              paddingLeft: "20px",
            }}
          >
            {/* Duplicate updates for seamless loop */}
            {[...updates, ...updates].map((update, idx) => (
              <li
                key={idx}
                className="news-item d-flex align-items-center"
                style={{
                  display: "inline-flex",
                  flex: "0 0 auto",
                  minWidth: "fit-content", // Changed from fixed width
                  maxWidth: "none", // Removed max width constraint
                  marginRight: "20px",
                  padding: "8px 16px",
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "12px",
                  border: "1px solid rgba(111, 66, 193, 0.15)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(111, 66, 193, 0.1)",
                  backdropFilter: "blur(5px)",
                  transition: "all 0.3s ease",
                  // Removed whiteSpace nowrap to allow text wrapping if needed
                }}
              >
                {/* Group Badge */}
                <span
                  className="d-flex align-items-center me-3 px-2 py-1"
                  style={{
                    background: `linear-gradient(135deg, ${getGroupColor(update.group)}15, ${getGroupColor(update.group)}25)`,
                    color: getGroupColor(update.group),
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    border: `1px solid ${getGroupColor(update.group)}30`,
                    flexShrink: 0,
                    whiteSpace: "nowrap", // Keep badge text on one line
                  }}
                >
                  {getGroupIcon(update.group)}
                  {formatRoleName(update.group)}
                </span>

                {/* Content */}
                <span
                  style={{
                    color: "#374151",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    lineHeight: "1.4",
                    whiteSpace: "nowrap", // Keep content on single line for ticker effect
                    // Removed overflow hidden and text-overflow ellipsis
                  }}
                >
                  {update.content}
                </span>

                {/* Separator Dot */}
                <span
                  className="mx-3"
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: "#d1d5db",
                    flexShrink: 0,
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Gradient Overlays for Smooth Fade */}
      <div
        className="position-absolute top-0 end-0 h-100"
        style={{
          width: "60px",
          background: "linear-gradient(to left, rgba(248, 244, 255, 1), transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Pause Indicator */}
      {isPaused && (
        <div
          className="position-absolute top-0 end-0 me-3 mt-2"
          style={{
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.7rem",
            fontWeight: "500",
            zIndex: 4,
          }}
        >
          PAUSED
        </div>
      )}

      <style jsx>{`
        .news-item:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(111, 66, 193, 0.2) !important;
          background: rgba(255, 255, 255, 0.95) !important;
        }

        .paused {
          animation-play-state: paused !important;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes borderGlow {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.7;
          }
        }

        .news-ticker-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
          animation: shimmer 3s infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .news-ticker-list {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        @media (max-width: 768px) {
          .news-ticker-container {
            height: 50px !important;
          }
          
          .news-item {
            min-width: fit-content !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
};