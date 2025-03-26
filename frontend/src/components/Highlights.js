"use client";

import React, { useState, useRef } from "react";
import CarouselItem from "./CarouselItem";
import FadeCarousel from "@/components/FadeCarousel2";
import {
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaChevronDown,
  FaChevronUp,
  FaExpand,
} from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
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
  lightPurple: "#E6E6FA",   // Very light purple
  white: "#ffffff",         // Pure white
  gray: "#666666"           // Medium gray
};

const Highlights = ({ data, datatype='default' }) => {
  const getActiveTab = () => {
    return datatype === "default" ? Object.keys(data.content)[0] : Object.keys(data.content)[0];
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const videoRefs = useRef([]);

  const togglePause = () => setIsPaused(!isPaused);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
  
  const sanitizeContent = (contentArray) => {
    const seen = new Set();
    
    return contentArray.filter(item => {
      const uniqueKey = item.imageUrl || item.videoUrl;
      
      if (uniqueKey && !seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        return true;
      }
      
      return false;
    });
  };

  return (
    <div className={`position-relative z-10 mt-4 p-4 rounded-3 shadow-lg ${playfair.className}`} 
         style={{ backgroundColor: colors.white }}>
      {/* Title */}
      <h1 className={`mb-4 ${cinzel.className}`} style={{
        fontSize: "2rem",
        color: colors.black,
        fontWeight: 700,
        textTransform: "uppercase"
      }}>
        {data.name}
      </h1>
  
      {/* Dropdown for Chapters */}
      <div className="mb-4">
        <button
          className={`btn w-100 text-start d-flex justify-content-between align-items-center py-3 rounded-3 ${cormorant.className}`}
          style={{
            backgroundColor: colors.purple,
            color: colors.white,
            fontSize: "1.2rem",
            border: "none"
          }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{data.content[activeTab].groupName}</span>
          {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
  
        {dropdownOpen && (
          <div className="mt-2">
            {Object.keys(data.content).map((tab) => (
              <button
                key={tab}
                className={`btn w-100 text-start mb-2 py-2 rounded-3 ${cormorant.className}`}
                style={{
                  backgroundColor: activeTab === tab ? colors.purple : colors.lightPurple,
                  color: activeTab === tab ? colors.white : colors.black,
                  fontSize: "1.1rem",
                  border: `2px solid ${activeTab === tab ? colors.purple : colors.black}`
                }}
                onClick={() => {
                  setActiveTab(tab);
                  setDropdownOpen(false);
                }}
              >
                {data.content[tab].groupName}
              </button>
            ))}
          </div>
        )}
      </div>
  
      {/* Carousel Content */}
      <FadeCarousel isPaused={isPaused} isMuted={isMuted} onToggleMute={toggleMute}>
        {data.content[activeTab].content.map((item, index) => (
          <CarouselItem
            key={index}
            item={item}
            isMuted={isMuted}
            videoRef={(el) => (videoRefs.current[index] = el)}
            onPauseCarousel={() => setIsPaused(true)}
          />
        ))}
      </FadeCarousel>
  
      {/* Control Buttons */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="d-flex gap-3">
          <button
            onClick={togglePause}
            className="rounded-circle shadow-sm p-3 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: colors.purple,
              color: colors.white,
              border: "none",
              width: "50px",
              height: "50px"
            }}
          >
            {isPaused ? <FaPlay size={18} /> : <FaPause size={18} />}
          </button>
          <button
            onClick={toggleMute}
            className="rounded-circle shadow-sm p-3 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: colors.black,
              color: colors.white,
              border: "none",
              width: "50px",
              height: "50px"
            }}
          >
            {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
          </button>
        </div>
        <div className="d-flex gap-3">
          <button
            onClick={handleModalShow}
            className="rounded-circle shadow-sm p-3 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: colors.yellow,
              color: colors.black,
              border: "none",
              width: "50px",
              height: "50px"
            }}
            title="Fullscreen"
          >
            <FaExpand size={18} />
          </button>
          <ShareButton url={window.location.href} title={data.name} />
        </div>
      </div>
  
      {/* Fullscreen Modal */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        size="lg"
        centered
        backdrop={false}
        className="custom-modal"
      >
        <Modal.Header closeButton style={{ backgroundColor: colors.purple }}>
          <Modal.Title className={`text-white ${cinzel.className}`} style={{ fontSize: "1.5rem" }}>
            {data.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <FadeCarousel isPaused={isPaused} isMuted={isMuted} onToggleMute={toggleMute}>
            {data.content[activeTab].content.map((item, index) => (
              <CarouselItem
                key={index}
                item={item}
                isMuted={isMuted}
                videoRef={(el) => (videoRefs.current[index] = el)}
                onPauseCarousel={() => setIsPaused(true)}
              />
            ))}
          </FadeCarousel>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: colors.lightPurple }}>
          <Button 
            onClick={handleModalClose}
            style={{
              backgroundColor: colors.purple,
              border: "none",
              padding: "8px 20px",
              fontSize: "1.1rem"
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );  
};

export default Highlights;