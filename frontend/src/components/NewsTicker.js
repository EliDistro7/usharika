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
  const [animationDuration, setAnimationDuration] = useState("45s");
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
            className="text-red-700 hover:text-green-700 underline decoration-2 underline-offset-4 font-bold transition-all duration-300 hover:decoration-gold-400 hover:scale-105 hover:drop-shadow-lg relative z-20 bg-gradient-to-r from-red-100/40 to-green-100/40 px-1 py-0.5 rounded backdrop-blur-sm"
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
      const secondsPerItem = 3;
      const baseDuration = updates.length * secondsPerItem;

      const scaleFactor = 0.015;
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
        bg: 'bg-gradient-to-r from-red-600 via-green-600 to-red-600', 
        text: 'text-white',
        glow: 'shadow-red-500/50',
        icon: '🎄'
      },
      updates: { 
        bg: 'bg-gradient-to-r from-green-700 via-red-600 to-green-700', 
        text: 'text-white',
        glow: 'shadow-green-500/50',
        icon: '🎅'
      },
      alerts: { 
        bg: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600', 
        text: 'text-gray-900',
        glow: 'shadow-amber-400/60',
        icon: '⭐'
      },
      announcements: { 
        bg: 'bg-gradient-to-r from-red-700 via-amber-500 to-green-700', 
        text: 'text-white',
        glow: 'shadow-red-500/50',
        icon: '🎁'
      },
      default: { 
        bg: 'bg-gradient-to-r from-red-600 via-green-600 to-amber-500', 
        text: 'text-white',
        glow: 'shadow-red-500/50',
        icon: '🔔'
      }
    };
    
    const normalizedGroup = group.toLowerCase();
    return colors[normalizedGroup] || colors.default;
  };

  return (
    <div
      className={`relative overflow-hidden h-20 md:h-24 rounded-2xl shadow-2xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, #991b1b 0%, #166534 25%, #b91c1c 50%, #15803d 75%, #991b1b 100%)',
        backgroundSize: '200% 200%',
        animation: 'christmas-bg 10s ease infinite'
      }}
    >
      {/* Falling Snow Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              fontSize: `${12 + Math.random() * 12}px`,
              opacity: 0.7 + Math.random() * 0.3
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Christmas Lights Border Effect */}
      <div className="absolute top-0 left-0 right-0 h-2 flex justify-around">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="christmas-light"
            style={{
              animationDelay: `${i * 0.1}s`,
              backgroundColor: ['#ef4444', '#22c55e', '#eab308', '#3b82f6'][i % 4]
            }}
          />
        ))}
      </div>

      {/* Festive Overlay Text - Merry Christmas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5 overflow-hidden">
        <div className="festive-text text-5xl md:text-7xl font-black opacity-10 select-none text-red-600">
          🎄 Merry Christmas 🎄
        </div>
      </div>
      
      {/* Festive Overlay Text - Happy New Year */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5 overflow-hidden">
        <div 
          className="festive-text-alt text-5xl md:text-7xl font-black opacity-10 select-none text-green-700"
          style={{animationDelay: '5s'}}
        >
          🎉 Happy New Year 2025 🎊
        </div>
      </div>

      {/* Christmas Ribbon Effect */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center px-3 py-2 ml-3 bg-gradient-to-r from-red-600 via-green-600 to-red-600 rounded-xl shadow-2xl z-20 border-2 border-yellow-300/80">
        <div className="relative mr-2">
          <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-75" />
        </div>
       
      </div>

      {/* Main Content Container */}
      <div
        ref={containerRef}
        className="h-full flex items-center overflow-hidden pl-24 pr-6 relative z-15"
      >
        {loading ? (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 w-8 h-8 border-4 border-green-400 border-b-transparent rounded-full animate-spin" style={{animationDirection: 'reverse'}} />
            </div>
            <span className="text-white font-bold text-lg drop-shadow-lg">
              🎄 Loading festive updates...
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
                  className="flex items-center flex-shrink-0 min-w-[280px] h-14 md:h-16 bg-gradient-to-r from-white/95 via-red-50/90 to-green-50/90 hover:from-red-50 hover:via-white hover:to-green-50 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-yellow-300/70 hover:border-yellow-400/90 transition-all duration-500 cursor-pointer overflow-hidden group backdrop-blur-sm hover:scale-105 transform"
                >
                  {/* Christmas Icon */}
                  <div className="ml-3 mr-2 text-xl animate-bounce-gentle">
                    {groupStyle.icon}
                  </div>

                  {/* Enhanced Group Badge */}
                  <div className={`flex items-center justify-center px-3 py-2 mr-3 ${groupStyle.bg} ${groupStyle.text} rounded-xl shadow-lg ${groupStyle.glow} border-2 border-yellow-200/50 transform group-hover:scale-105 transition-all duration-300`}>
                    <span className="text-xs font-black uppercase tracking-widest drop-shadow-sm">
                      {formatRoleName(update.group)}
                    </span>
                  </div>

                  {/* Enhanced Content */}
                  <div className="flex-1 pr-4 text-sm md:text-base text-gray-800 font-bold leading-tight truncate group-hover:text-gray-900 transition-colors duration-300 drop-shadow-sm">
                    {parseContentWithLinks(update.content)}
                  </div>

                  {/* Festive indicator */}
                  <div className="w-1 h-8 bg-gradient-to-b from-red-500 via-yellow-400 to-green-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg transform group-hover:scale-y-110" />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Enhanced Gradient Fade Edges */}
    
      <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10" style={{background: 'linear-gradient(to left, rgba(153, 27, 27, 1), transparent)'}} />

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

        @keyframes christmas-bg {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes snowfall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110px) translateX(30px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes twinkle-lights {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        @keyframes festive-fade {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.12; }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .snowflake {
          position: absolute;
          top: -20px;
          color: white;
          animation: snowfall linear infinite;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.6);
        }

        .christmas-light {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: twinkle-lights 1.5s ease-in-out infinite;
          box-shadow: 0 0 8px currentColor;
        }

        .festive-text {
          animation: festive-fade 10s ease-in-out infinite;
          text-shadow: 0 0 30px rgba(220, 38, 38, 0.4);
        }

        .festive-text-alt {
          animation: festive-fade 10s ease-in-out infinite;
          text-shadow: 0 0 30px rgba(21, 128, 61, 0.4);
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        @media (max-width: 768px) {
          .festive-text, .festive-text-alt {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};