import React, { useEffect } from "react";
import FadeCarousel from "@/components/FadeCarousel2";
import CarouselItem from "./CarouselItem";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const FullscreenModal = ({
  showModal,
  handleModalClose,
  isPaused,
  isMuted,
  toggleMute,
  activeTab,
  content,
  videoRefs,
  setIsPaused,
  title,
  colors,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'rgba(0,0,0,0.9)'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: colors.purple,
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 className={`text-white ${cinzel.className}`} style={{
          fontSize: "1.8rem",
          letterSpacing: "1px",
          textTransform: "uppercase",
          margin: 0
        }}>
          {title}
        </h1>
        <button 
          onClick={handleModalClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: colors.white,
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          ×
        </button>
      </div>
      
      {/* Carousel Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <FadeCarousel 
          isPaused={isPaused} 
          isMuted={isMuted} 
          onToggleMute={toggleMute}
          colors={colors}
          isFullscreen={true}
        >
          {content[activeTab].content.map((item, index) => (
            <CarouselItem
              key={index}
              item={item}
              isMuted={isMuted}
              isFullscreen={true}
              videoRef={(el) => (videoRefs.current[index] = el)}
              onPauseCarousel={() => setIsPaused(true)}
              colors={colors}
            />
          ))}
        </FadeCarousel>
      </div>
      
      {/* Footer */}
      <div style={{
        backgroundColor: colors.purple,
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button 
          onClick={handleModalClose}
          style={{
            backgroundColor: colors.yellow,
            color: colors.black,
            border: "none",
            padding: "0.5rem 2rem",
            borderRadius: "50px",
            fontSize: "1.1rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          FUNGA
        </button>
      </div>
    </div>
  );
};

export default FullscreenModal;