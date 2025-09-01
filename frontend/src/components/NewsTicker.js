"use client";

import React, { useEffect, useState } from "react";
import { getAllUpdates } from "../actions/updates";
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
            className="text-purple-600 hover:text-purple-700 underline decoration-dotted underline-offset-2 font-semibold transition-all duration-200 hover:decoration-solid hover:drop-shadow-sm relative z-10"
            onClick={(e) => {
              e.stopPropagation();
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
    calculateScrollProperties();
    window.addEventListener("resize", calculateScrollProperties);

    return () => {
      window.removeEventListener("resize", calculateScrollProperties);
    };
  }, [updates]);

  const calculateScrollProperties = () => {
    if (scrollerRef.current) {
      const totalWidth = Array.from(scrollerRef.current.children).reduce(
        (acc, item) => acc + item.offsetWidth,
        0
      );

      const estimatedCharsPerItem = 180;
      const secondsPerItem = 4;
      const baseDuration = updates.length * secondsPerItem;

      const scaleFactor = 0.02;
      const extraTime = totalWidth * scaleFactor;

      const totalDuration = (baseDuration + extraTime).toFixed(2);

      setScrollWidth(totalWidth);
      setAnimationDuration(`${totalDuration}s`);
      setStart(true);
    }
  };

  const getGroupColor = (group) => {
    const colors = {
      news: { bg: 'bg-blue-600', text: 'text-white' },
      updates: { bg: 'bg-green-600', text: 'text-white' },
      alerts: { bg: 'bg-amber-600', text: 'text-white' },
      announcements: { bg: 'bg-red-600', text: 'text-white' },
      default: { bg: 'bg-purple-600', text: 'text-white' }
    };
    
    const normalizedGroup = group.toLowerCase();
    return colors[normalizedGroup] || colors.default;
  };

  return (
    <div
      className={`relative overflow-hidden h-16 md:h-18 rounded-xl bg-white border border-gray-200 shadow-sm ${className}`}
      style={{
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/30 via-transparent to-purple-50/30" />

      {/* "LIVE" Indicator */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center px-3 py-1.5 ml-3 bg-red-600 rounded-lg shadow-sm z-10">
        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
        <span className="text-white text-xs font-medium"></span>
      </div>

      {/* Main Content Container */}
      <div
        ref={containerRef}
        className="h-full flex items-center overflow-hidden pl-20 pr-5"
      >
        {loading ? (
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-purple-600 font-medium text-sm">
              Loading latest updates...
            </span>
          </div>
        ) : (
          <ul
            ref={scrollerRef}
            className={`flex items-center space-x-4 ${
              start ? "animate-scroll" : ""
            } ${pauseOnHover ? "hover:pause" : ""}`}
            style={{
              animation: `scroll ${animationDuration} linear infinite`,
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
                  className="flex items-center flex-shrink-0 min-w-[220px] h-10 md:h-12 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  {/* Group Badge */}
                  <div className={`flex items-center justify-center px-2.5 py-1 ml-3 mr-3 ${groupStyle.bg} ${groupStyle.text} rounded-md shadow-sm`}>
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {formatRoleName(update.group)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pr-3 text-sm text-gray-700 font-medium leading-tight truncate">
                    {parseContentWithLinks(update.content)}
                  </div>

                  {/* Subtle indicator */}
                  <div className="w-0.5 h-4 bg-gradient-to-b from-transparent via-purple-300 to-transparent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Gradient Fade Edges */}
      <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-5" />
      <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-5" />

      <style jsx>{`
        .hover\\:pause:hover {
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
        
        .animate-scroll {
          animation: scroll ${animationDuration} linear infinite;
        }
        
        @media (max-width: 768px) {
          .news-ticker-container {
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};