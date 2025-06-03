"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import CarouselItem from "./CarouselItem";
import FadeCarousel from "./Fade";
import Dropdown from "./Dropdown";
import ControlButtons from "./ControlButtons";
import FullscreenModal from "./FullscreenModal";
import { Cinzel, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";

// Optimized font loading with display swap
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

// Enhanced color palette with better contrast and modern feel
const colors = {
  primary: "#6366F1",        // Modern indigo
  secondary: "#EC4899",      // Vibrant pink
  accent: "#F59E0B",         // Warm amber
  background: "#FAFBFF",     // Subtle blue-white
  surface: "#FFFFFF",        // Pure white
  text: "#1F2937",          // Rich dark gray
  textSecondary: "#6B7280", // Medium gray
  overlay: "rgba(15, 23, 42, 0.8)",
  gradient: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
  shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  glowShadow: "0 0 0 1px rgba(99, 102, 241, 0.1), 0 4px 6px -1px rgba(99, 102, 241, 0.1)",
};

const Highlights = ({ data, datatype = "default" }) => {
  console.log('data ', data);
  // Memoized initial tab to prevent unnecessary recalculations
  const initialTab = useMemo(() => {
    return Object.keys(data.content)[0];
  }, [data.content]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const videoRefs = useRef([]);

  // Optimized callback functions to prevent unnecessary re-renders
  const togglePause = useCallback(() => setIsPaused(prev => !prev), []);
  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);
  const handleModalClose = useCallback(() => setShowModal(false), []);
  const handleModalShow = useCallback(() => setShowModal(true), []);

  // Memoized content to prevent unnecessary re-renders
  const currentContent = useMemo(() => {
    return data.content[activeTab]?.content || [];
  }, [data.content, activeTab]);

  const containerStyle = {
   // background: `linear-gradient(135deg, ${colors.background} 0%, rgba(255, 255, 255, 0.9) 100%)`,
   // backdropFilter: "blur(10px)",
   // border: `1px solid rgba(99, 102, 241, 0.1)`,
    //boxShadow: colors.shadow,
    paddingTop: "8px",
    borderRadius: "24px",
    overflow: "hidden",
    position: "relative",
  };

  const titleStyle = {
    background: colors.gradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "2px",
    textAlign: "center",
    marginBottom: "2rem",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const linkButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    borderRadius: "12px",
    background: colors.gradient,
    color: "white",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: 600,
    letterSpacing: "0.5px",
    boxShadow: colors.glowShadow,
    transition: "all 0.3s ease",
    marginTop: "1rem",
    border: "none",
    cursor: "pointer",
  };

  return (
    <article 
      className={`relative z-10 mt-6 p-8 ${playfair.className}`}
      style={containerStyle}
    >
      {/* Animated background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${colors.primary} 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, ${colors.secondary} 0%, transparent 50%)`,
          animation: "float 6s ease-in-out infinite",
        }}
      />

      {/* Enhanced title with gradient text */}
      <header className="text-center">
        <h1 className={`${cinzel.className}`} style={titleStyle}>
          {data.name}
        </h1>
        
        {/* Link to full page view */}
        <div className="flex justify-center">
          <Link 
            href={`/highlight/${data._id}`}
            style={linkButtonStyle}
            className={`${cormorant.className} hover:scale-105 hover:shadow-lg`}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 8px 25px -5px rgba(99, 102, 241, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = colors.glowShadow;
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Fungua Stori
          </Link>
        </div>
      </header>

      {/* Dropdown for Chapters */}
      <nav className="mb-6">
        <Dropdown
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          content={data.content}
          colors={colors}
          fonts={{ cinzel, playfair, cormorant }}
        />
      </nav>

      {/* Enhanced Carousel Content */}
      <main 
        className="rounded-2xl overflow-hidden"
        style={{
          boxShadow: colors.glowShadow,
         
         // background: colors.surface,
        }}
      >
        <FadeCarousel 
          isPaused={isPaused} 
          isMuted={isMuted} 
          onToggleMute={toggleMute}
          colors={colors}
        >
          {currentContent.map((item, index) => (
            <CarouselItem
              key={`${activeTab}-${index}`} // Better key for tab changes
              item={item}
              isMuted={isMuted}
              videoRef={(el) => (videoRefs.current[index] = el)}
              colors={colors}
            />
          ))}
        </FadeCarousel>
      </main>

      {/* Enhanced Control Buttons */}
      <footer className="mt-6">
        <ControlButtons
          isPaused={isPaused}
          togglePause={togglePause}
          isMuted={isMuted}
          toggleMute={toggleMute}
          handleModalShow={handleModalShow}
          title={data.name}
          colors={colors}
          fonts={{ cormorant }}
        />
      </footer>

      {/* Fullscreen Modal */}
      <FullscreenModal
        showModal={showModal}
        handleModalClose={handleModalClose}
        isPaused={isPaused}
        isMuted={isMuted}
        toggleMute={toggleMute}
        activeTab={activeTab}
        content={data.content}
        videoRefs={videoRefs}
        setIsPaused={setIsPaused}
        title={data.name}
        colors={colors}
        fonts={{ cinzel, playfair }}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        article {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </article>
  );
};

export default Highlights;