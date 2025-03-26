"use client";

import React, { useState, useRef } from "react";
import CarouselItem from "./CarouselItem";
import FadeCarousel from "@/components/FadeCarousel2";
import Dropdown from "./Dropdown";
import ControlButtons from "./ControlButtons";
import FullscreenModal from "./FullscreenModal";
import ShareButton from "./ShareButton";
import { Cinzel, Playfair_Display, Cormorant_Garamond } from "next/font/google";

// Font declarations
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
});

// Color scheme
const colors = {
  black: "#1a1a1a",         // Bold black
  purple: "#9370DB",        // Lighter purple
  yellow: "#FFD700",        // Gold yellow
  lightBg: "#F5F3FF",       // Very light purple background
  white: "#ffffff",         // Pure white
  gray: "#666666"           // Medium gray
};

const Highlights = ({ data, datatype = "default" }) => {
  const getActiveTab = () => {
    return datatype === "default" ? Object.keys(data.content)[0] : Object.keys(data.content)[0];
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const videoRefs = useRef([]);

  const togglePause = () => setIsPaused(!isPaused);
  const toggleMute = () => setIsMuted(!isMuted);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  return (
    <div className={`position-relative z-10 mt-4 p-6 rounded-xl shadow-xl ${playfair.className}`}
         style={{  border: `1px solid ${colors.purple}20` }}>
      
      {/* Title */}
      <h1 className={`mb-6 text-center ${cinzel.className}`} style={{
        fontSize: "2rem",
        color: colors.black,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "1px"
      }}>
        {data.name}
      </h1>

      {/* Dropdown for Chapters */}
      <Dropdown
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        content={data.content}
        colors={colors}
        fonts={{ cinzel, playfair, cormorant }}
      />

      {/* Carousel Content */}
      <div className="rounded-lg overflow-hidden shadow-lg border-2" style={{ borderColor: colors.purple }}>
        <FadeCarousel 
          isPaused={isPaused} 
          isMuted={isMuted} 
          onToggleMute={toggleMute}
          colors={colors}
        >
          {data.content[activeTab].content.map((item, index) => (
            <CarouselItem
              key={index}
              item={item}
              isMuted={isMuted}
              videoRef={(el) => (videoRefs.current[index] = el)}
             
              colors={colors}
            />
          ))}
        </FadeCarousel>
      </div>

      {/* Control Buttons */}
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
    </div>
  );
};

export default Highlights;