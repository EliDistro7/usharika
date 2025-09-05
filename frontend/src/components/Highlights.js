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
  FaTimes,
} from "react-icons/fa";
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

const Highlights = ({ data, datatype = 'default' }) => {
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
    <div className={`relative z-10 mt-6 p-6 rounded-3xl shadow-strong bg-background-50 ${playfair.className}`}>
      {/* Title */}
      <h1 className={`mb-6 text-4xl font-black text-text-primary uppercase tracking-wide ${cinzel.className}`}>
        {data.name}
      </h1>

      {/* Dropdown for Chapters */}
      <div className="mb-6">
        <button
          className={`w-full text-left flex justify-between items-center py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-primary ${cormorant.className}`}
          style={{
            background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
            color: '#ffffff',
            fontSize: '1.25rem',
            border: 'none'
          }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="font-semibold">{data.content[activeTab].groupName}</span>
          <div className="transition-transform duration-300" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <FaChevronDown />
          </div>
        </button>

        {/* Dropdown Menu */}
        <div className={`mt-3 transition-all duration-300 overflow-hidden ${dropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-2">
            {Object.keys(data.content).map((tab) => (
              <button
                key={tab}
                className={`w-full text-left py-3 px-5 rounded-xl transition-all duration-200 hover:scale-[1.01] ${cormorant.className} ${
                  activeTab === tab 
                    ? 'bg-primary-gradient text-white shadow-primary border-2 border-primary-600' 
                    : 'bg-background-200 text-text-primary border-2 border-border-default hover:border-primary-300 hover:bg-background-300'
                }`}
                style={{ fontSize: '1.1rem' }}
                onClick={() => {
                  setActiveTab(tab);
                  setDropdownOpen(false);
                }}
              >
                <span className="font-medium">{data.content[tab].groupName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel Content */}
      <div className="mb-6 rounded-2xl overflow-hidden shadow-medium">
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
      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePause}
            className="w-14 h-14 rounded-full shadow-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-primary-lg bg-primary-gradient"
          >
            {isPaused ? <FaPlay size={18} className="text-white ml-0.5" /> : <FaPause size={18} className="text-white" />}
          </button>
          
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="w-14 h-14 rounded-full shadow-strong flex items-center justify-content-center transition-all duration-300 hover:scale-110 bg-text-primary"
          >
            {isMuted ? <FaVolumeMute size={18} className="text-white" /> : <FaVolumeUp size={18} className="text-white" />}
          </button>
        </div>
        
        <div className="flex gap-4">
          {/* Fullscreen Button */}
          <button
            onClick={handleModalShow}
            className="w-14 h-14 rounded-full shadow-yellow flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-yellow-lg bg-yellow-500"
            title="Fullscreen"
          >
            <FaExpand size={18} className="text-text-primary" />
          </button>
          
          <ShareButton url={typeof window !== 'undefined' ? window.location.href : ''} title={data.name} />
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleModalClose}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-6xl h-full max-h-[90vh] bg-background-50 rounded-2xl shadow-strong overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 bg-primary-gradient">
              <h2 className={`text-2xl font-bold text-white ${cinzel.className}`}>
                {data.name}
              </h2>
              <button
                onClick={handleModalClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <FaTimes size={16} className="text-white" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-0 h-[calc(90vh-140px)] overflow-hidden">
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
            
            {/* Modal Footer */}
            <div className="flex justify-end p-4 bg-primary-50 border-t border-primary-200">
              <button 
                onClick={handleModalClose}
                className="px-6 py-3 bg-primary-gradient text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-primary"
                style={{ fontSize: '1.1rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
};

export default Highlights;