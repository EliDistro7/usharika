'use client';
import React, { memo, useState, useCallback } from "react";
import VideoComponent from "@/components/VideoComponent";
import ImageComponent from "@/components/ImageComponent";
import { Cormorant_Garamond } from "next/font/google";
import * as LucideIcons from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const DescriptionOverlay = memo(({ description, isFullscreen, isVisible, icon }) => {
  // Dynamically get the icon component
  const IconComponent = icon && LucideIcons[icon] ? LucideIcons[icon] : null;

  return (
    <div 
      className={`
        absolute bottom-0 left-0 right-0 z-[1000]
        ${isFullscreen ? 'p-12 pb-8' : 'p-6 pb-6'}
        transform transition-transform duration-400 ease-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        description-overlay
      `}
    >
      <div className="flex items-center justify-center gap-3 max-w-[90%] mx-auto">
        {IconComponent && (
          <IconComponent 
            className={`
              text-background-50 drop-shadow-lg
              ${isFullscreen ? 'w-8 h-8' : 'w-6 h-6'}
            `}
          />
        )}
        <p 
          className={`
            ${cormorant.className} mb-0 text-center font-medium
            text-background-50 text-shadow-lg tracking-wide
            ${isFullscreen ? 'text-6xl' : 'text-xl'}
            leading-relaxed
          `}
        >
          {description}
        </p>
      </div>
    </div>
  );
});

DescriptionOverlay.displayName = "DescriptionOverlay";

const LoadingSpinner = memo(() => (
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-100">
    <div className="w-10 h-10 rounded-full border-3 border-primary-300 border-t-primary-700 animate-spin" />
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

const CarouselItem = ({
  item,
  isMuted,
  isFullscreen,
  videoRef,
  icon // New prop for icon name
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

  return (
    <div
      className={`
        relative overflow-hidden
        ${isFullscreen 
          ? 'h-[calc(100vh-140px)] min-h-[600px] rounded-none' 
          : 'h-[60vh] min-h-[400px] rounded-xl'
        }
        bg-gradient-to-br from-background-200 to-background-400
        ${item.description ? 'cursor-pointer' : 'cursor-default'}
        transition-all duration-300 ease-out
        carousel-item-container
        focus-within:outline-2 focus-within:outline-primary-700 focus-within:outline-offset-2
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Loading spinner */}
      {isLoading && <LoadingSpinner />}

      {/* Media content */}
      {item.imageUrl ? (
        <ImageComponent 
          imageUrl={item.imageUrl} 
          altText={item.description || "Carousel Item"} 
          isFullscreen={isFullscreen}
          className={`
            w-full h-full object-cover
            transition-transform duration-300 ease-out
            ${isHovered ? 'scale-102' : 'scale-100'}
          `}
          onLoad={handleLoadComplete}
          onError={() => setIsLoading(false)}
        />
      ) : item.videoUrl ? (
        <VideoComponent
          videoUrl={item.videoUrl}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          videoRef={videoRef}
          className={`
            w-full h-full object-cover
            transition-transform duration-300 ease-out
            ${isHovered ? 'scale-102' : 'scale-100'}
          `}
          onLoadedData={handleLoadComplete}
          onError={() => setIsLoading(false)}
        />
      ) : (
        <div 
          className={`
            w-full h-full flex items-center justify-center
            bg-gradient-to-br from-primary-100 to-purple-100
            text-text-secondary text-xl
            transition-transform duration-300 ease-out
            ${isHovered ? 'scale-102' : 'scale-100'}
          `}
          onLoad={handleLoadComplete}
        >
          No media content available
        </div>
      )}

      {/* Description overlay */}
      {item.description && (
        <DescriptionOverlay
          description={item.description}
          isFullscreen={isFullscreen}
          isVisible={showDescription || isFullscreen}
          icon={icon}
        />
      )}

      {/* Gradient overlay for better text contrast */}
      {item.description && (
        <div
          className={`
            absolute inset-0 pointer-events-none z-[500]
            transition-all duration-300 ease-out
            ${isHovered 
              ? 'bg-gradient-to-t from-black/40 via-black/10 to-transparent' 
              : 'bg-transparent'
            }
          `}
        />
      )}

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
      `}</style>
    </div>
  );
};

export default memo(CarouselItem);