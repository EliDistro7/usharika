import React, { memo, useState, useCallback } from "react";
import VideoComponent from "@/components/VideoComponent";
import ImageComponent from "@/components/ImageComponent";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const DescriptionOverlay = memo(({ description, isFullscreen, colors, isVisible }) => {
  const overlayStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
   // background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
    padding: isFullscreen ? "3rem 2rem 2rem" : "2rem 1.5rem 1.5rem",
    zIndex: 1000,
    transform: isVisible ? "translateY(0)" : "translateY(100%)",
    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
   // backdropFilter: "blur(10px)",
  };

  const textStyle = {
    color: colors.surface,
    fontSize: isFullscreen ? "1.6rem" : "1.2rem",
    lineHeight: 1.6,
    maxWidth: "90%",
    margin: "0 auto",
    textAlign: "center",
    fontWeight: 500,
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)",
    letterSpacing: "0.5px",
  };

  return (
    <div style={overlayStyle} className="description-overlay">
      <p className={`mb-0 ${cormorant.className}`} style={textStyle}>
        {description}
      </p>
    </div>
  );
});

DescriptionOverlay.displayName = "DescriptionOverlay";

const LoadingSpinner = memo(({ colors }) => (
  <div 
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 100,
    }}
  >
    <div 
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: `3px solid ${colors.primary}30`,
        borderTop: `3px solid ${colors.primary}`,
        animation: "spin 1s linear infinite",
      }}
    />
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

const CarouselItem = ({
  item,
  isMuted,
  isFullscreen,
  videoRef,
  colors
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
    if (item.description) {
      setTimeout(() => setShowDescription(true), 500);
    }
  }, [item.description]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (item.description) {
      setShowDescription(true);
    }
  }, [item.description]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (!isFullscreen) {
      setTimeout(() => setShowDescription(false), 2000);
    }
  }, [isFullscreen]);

  const containerStyle = {
    position: "relative",
    height: isFullscreen ? "calc(100vh - 140px)" : "60vh",
    minHeight: isFullscreen ? "600px" : "400px",
    overflow: "hidden",
    borderRadius: isFullscreen ? "0" : "12px",
   // background: `linear-gradient(135deg, ${colors.background}, ${colors.surface})`,
    cursor: item.description ? "pointer" : "default",
  };

  const mediaStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
    //transform: isHovered ? "scale(1.02)" : "scale(1)",
  };

  return (
    <div
      style={containerStyle}
    
      className="carousel-item-container"
    >
      {/* Loading spinner 
      {isLoading && <LoadingSpinner colors={colors} />}
      */}

      {/* Media content */}
      {item.imageUrl ? (
        <ImageComponent 
          imageUrl={item.imageUrl} 
          altText={item.description || "Carousel Item"} 
          isFullscreen={isFullscreen}
          style={mediaStyle}
          onLoad={handleLoadComplete}
          onError={() => setIsLoading(false)}
        />
      ) : item.videoUrl ? (
        <VideoComponent
          videoUrl={item.videoUrl}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          videoRef={videoRef}
          style={mediaStyle}
          onLoadedData={handleLoadComplete}
          onError={() => setIsLoading(false)}
        />
      ) : (
        <div 
          style={{
            ...mediaStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
           // background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
            color: colors.textSecondary,
            fontSize: "1.2rem",
          }}
        >
          No media content available
        </div>
      )}

      {/* Enhanced description overlay 
      {item.description && (
        <DescriptionOverlay
          description={item.description}
          isFullscreen={isFullscreen}
          colors={colors}
          isVisible={showDescription || isFullscreen}
        />
      )}
        */}

      {/* Gradient overlay for better text contrast 
      {item.description && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isHovered 
              ? "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.4) 100%)"
              : "transparent",
            transition: "background 0.3s ease",
            pointerEvents: "none",
            zIndex: 500,
          }}
        />
      )}
*/}
      <style jsx>{`
        .carousel-item-container {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
      
        
        .description-overlay {
          animation: fadeInUp 0.5s ease-out;
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
        
        /* Enhanced focus states for accessibility */
        .carousel-item-container:focus-within {
          outline: 2px solid ${colors.primary};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default memo(CarouselItem);