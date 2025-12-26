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
  const [animationDuration, setAnimationDuration] = useState("45s"); // Faster for more energy
  const [scrollWidth, setScrollWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);

  // Function to parse content and make links clickable with bold styling
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
            className="text-yellow-900 hover:text-yellow-900 underline decoration-2 underline-offset-4 font-bold transition-all duration-300 hover:decoration-yellow-300 hover:scale-105 hover:drop-shadow-lg relative z-20 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-1 py-0.5 rounded backdrop-blur-sm"
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
      const secondsPerItem = 3; // Faster scrolling
      const baseDuration = updates.length * secondsPerItem;

      const scaleFactor = 0.015; // Slightly faster
      const extraTime = totalWidth * scaleFactor;

      const totalDuration = (baseDuration + extraTime).toFixed(2);

      setScrollWidth(totalWidth);
      setAnimationDuration(`${totalDuration}s`);
      setStart(true);
    }
  };

  const getGroupColor = (group) => {
    const colors = {
      news: { 
        bg: 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500', 
        text: 'text-white',
        glow: 'shadow-blue-500/50'
      },
      updates: { 
        bg: 'bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500', 
        text: 'text-white',
        glow: 'shadow-emerald-500/50'
      },
      alerts: { 
        bg: 'bg-gradient-to-r from-amber-600 via-orange-500 to-red-500', 
        text: 'text-white',
        glow: 'shadow-amber-500/50'
      },
      announcements: { 
        bg: 'bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500', 
        text: 'text-white',
        glow: 'shadow-purple-500/50'
      },
      default: { 
        bg: 'bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500', 
        text: 'text-white',
        glow: 'shadow-indigo-500/50'
      }
    };
    
    const normalizedGroup = group.toLowerCase();
    return colors[normalizedGroup] || colors.default;
  };

  return (
    <div
      className={`relative overflow-hidden h-20 md:h-24 rounded-2xl shadow-2xl ${className}`}
     
    >
  
    

      {/* Enhanced "LIVE" Indicator */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center px-4 py-2 ml-4 bg-gradient-to-r from-red-600 via-red-500 to-pink-500 rounded-xl shadow-2xl z-20 border border-red-400/50">
        <div className="relative">
          <div className="w-3 h-3rounded-full animate-pulse" />
          <div className="absolute inset-0 w-3 h-3  rounded-full animate-ping opacity-75" />
        </div>
      
      </div>

      {/* Main Content Container */}
      <div
        ref={containerRef}
        className="h-full flex items-center overflow-hidden pl-24 pr-6"
      >
        {loading ? (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 w-8 h-8 border-4 border-pink-400 border-b-transparent rounded-full animate-spin" style={{animationDirection: 'reverse'}} />
            </div>
            <span className="text-white font-bold text-lg drop-shadow-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              updates...
            </span>
          </div>
        ) : (
          <ul
            ref={scrollerRef}
            className={`flex items-center space-x-6 ${
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
                  className="flex items-center flex-shrink-0 min-w-[280px] h-14 md:h-16 hover:from-white hover:to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-white/50 hover:border-purple-300/70 transition-all duration-500 cursor-pointer overflow-hidden group backdrop-blur-sm hover:scale-105 transform"
               
                >
                  {/* Enhanced Group Badge */}
                  <div className={`flex items-center justify-center px-4 py-2 ml-4 mr-4 ${groupStyle.bg} ${groupStyle.text} rounded-xl shadow-lg ${groupStyle.glow} border border-white/20 transform group-hover:scale-105 transition-all duration-300`}>
                    <span className="text-xs font-black uppercase tracking-widest drop-shadow-sm">
                      {formatRoleName(update.group)}
                    </span>
                  </div>

                  {/* Enhanced Content */}
                  <div className="flex-1 pr-4 text-base text-gray-800 font-bold leading-tight truncate group-hover:text-gray-900 transition-colors duration-300 drop-shadow-sm">
                    {parseContentWithLinks(update.content)}
                  </div>

                  {/* Dynamic indicator with gradient */}
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-400 via-pink-400 to-purple-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg transform group-hover:scale-y-110" />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Enhanced Gradient Fade Edges */}
   


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
            height: 80px;
          }
        }

        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-10px) translateX(5px); }
          66% { transform: translateY(5px) translateX(-5px); }
        }
      `}</style>
    </div>
  );
};