"use client";

import React, { useState, useEffect, useRef } from "react";
import FadeCarousel from "@/components/FadeCarousel2";
import {
  FaPlay,
  FaPause,
  FaExpandAlt,
  FaCompressAlt,
  FaVolumeMute,
  FaVolumeUp,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const Highlights = ({ data }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(data.content)[0]);
  const [isPaused, setIsPaused] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const videoRef = useRef(null);
  const inactivityTimerRef = useRef(null);

  const togglePause = () => setIsPaused(!isPaused);
  const toggleExpand = (index) => setExpanded(expanded === index ? null : index);
  const toggleMute = () => setIsMuted(!isMuted);

  const resetInactivityTimer = () => {
    setShowProgress(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      setShowProgress(false);
    }, 3000);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateProgress = () => {
        const progress = (video.currentTime / video.duration) * 100;
        setProgress(progress);
      };

      video.addEventListener("timeupdate", updateProgress);

      return () => {
        video.removeEventListener("timeupdate", updateProgress);
      };
    }
  }, []);

  return (
    <div
      className="position-relative mt-4 p-4 px-0 rounded shadow "
      onMouseMove={resetInactivityTimer}
      onTouchStart={resetInactivityTimer}
    >
      <h1 className="fs-4 mb-3 text-dark">{data.name}</h1>

      {/* Dropdown for Chapters */}
      <div className="mb-4">
        <button
          className="btn btn-dark w-100 text-start d-flex justify-content-between align-items-center"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {data.content[activeTab].groupName}
          {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {dropdownOpen && (
          <div className="mt-2">
            {Object.keys(data.content).map((tab) => (
              <button
                key={tab}
                className={`btn w-100 text-start mb-1 ${
                  activeTab === tab ? "btn-secondary" : "btn-outline-secondary"
                }`}
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
      <FadeCarousel isPaused={isPaused}>
        {data.content[activeTab].content.map((item, index) => (
          <div key={index} className="position-relative overflow-hidden rounded">
            {item.imageUrl ? (
              <img className="w-100 h-100 object-cover" src={item.imageUrl} alt="Content" />
            ) : item.videoUrl ? (
              <video
                ref={videoRef}
                src={item.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                className="w-100 h-100 object-cover"
              />
            ) : (
              <div className="w-100 h-100 bg-dark" />
            )}

            {/* Overlay and Controls */}
            <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white bg-gradient-custom">
              <p className={`text-white mb-2 ${expanded === index ? "" : "text-truncate"}`}>
                {item.description}
              </p>

              <button
                onClick={() => toggleExpand(index)}
                className="btn btn-light btn-sm position-absolute top-0 end-0"
              >
                {expanded === index ? <FaCompressAlt /> : <FaExpandAlt />}
              </button>
            </div>

            {/* Progress Bar */}
            {showProgress && item.videoUrl && (
              <div className="position-absolute bottom-0 start-0 w-100 bg-dark">
                <div className="bg-primary" style={{ height: "5px", width: `${progress}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </FadeCarousel>

      {/* Play/Pause, Mute/Unmute, and Share Buttons */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex gap-3">
          <button
            onClick={togglePause}
            className="btn btn-primary rounded-circle shadow-sm"
          >
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
          <button
            onClick={toggleMute}
            className="btn btn-secondary rounded-circle shadow-sm"
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
        <button
          onClick={() => alert("Share functionality coming soon!")}
          className="btn btn-outline-secondary rounded shadow-sm"
          style={{ fontSize: "0.85rem", fontWeight: "400" }}
        >
          <i className="fas fa-share-alt"></i> Share
        </button>
      </div>

      <style jsx>{`
        .bg-gradient-custom {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        }
        button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default Highlights;
