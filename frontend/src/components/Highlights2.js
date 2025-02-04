"use client";

import React, { useState, useRef } from "react";
import CarouselItem from "./CarouselItem";
import FadeCarousel from "@/components/FadeCarousel2";
import Dropdown from "./Dropdown";
import ControlButtons from "./ControlButtons";
import FullscreenModal from "./FullscreenModal";
import ShareButton from "./ShareButton";

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

  const sanitizeContent = (contentArray) => {
    const seen = new Set();
    return contentArray.filter((item) => {
      const uniqueKey = item.imageUrl || item.videoUrl;
      if (uniqueKey && !seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        return true;
      }
      return false;
    });
  };

  return (
    <div className="position-relative z-10 mt-4 p-4 rounded-lg shadow-lg bg-gradient-to-r from-purple-50 to-blue-50 backdrop-blur-sm border border-opacity-20 border-white">
      {/* Title */}
      <h1 className="h4 mb-4 text-dark fw-bold text-center font-serif">{data.name}</h1>

      {/* Dropdown for Chapters */}
      <Dropdown
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        content={data.content}
      />

      {/* Carousel Content */}
      <div className="rounded-lg overflow-hidden shadow-md">
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
      </div>

      {/* Control Buttons */}
      <ControlButtons
        isPaused={isPaused}
        togglePause={togglePause}
        isMuted={isMuted}
        toggleMute={toggleMute}
        handleModalShow={handleModalShow}
        title={data.name}
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
      />
    </div>
  );
};

export default Highlights;