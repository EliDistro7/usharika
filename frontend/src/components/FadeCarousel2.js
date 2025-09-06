"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FadeCarousel = ({
  children,
  isPaused = false,
  isFullscreen = false,
  isMuted = false,
  colors,
  onToggleMute,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  const childrenArray = React.Children.toArray(children);
  const totalSlides = childrenArray.length;

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused && totalSlides > 1) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 6000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, currentIndex, totalSlides]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, totalSlides]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, totalSlides]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Touch/swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (totalSlides === 0) return null;

  return (
    <div 
      className="relative w-full h-full overflow-hidden rounded-2xl bg-background-100"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {childrenArray.map((child, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === (currentIndex - 1 + totalSlides) % totalSlides;
          const isNext = index === (currentIndex + 1) % totalSlides;
          
          return (
            <div
              key={index}
              className={`
                absolute inset-0 w-full h-full transition-all duration-500 ease-in-out
                ${isActive 
                  ? 'opacity-100 z-20 scale-100' 
                  : 'opacity-0 z-10 scale-105'
                }
              `}
              style={{
                transform: `translateX(${
                  isActive ? '0%' : 
                  isPrev ? '-100%' : 
                  isNext ? '100%' : '0%'
                })`,
              }}
            >
              {React.isValidElement(child)
                ? React.cloneElement(child, {
                    isFullscreen,
                    isMuted,
                    onToggleMute,
                    colors,
                  })
                : child}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows - Only show if fullscreen and multiple slides */}
      {isFullscreen && totalSlides > 1 && (
        <>
          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            disabled={isTransitioning}
            className="
              absolute left-4 top-1/2 z-30 -translate-y-1/2
              w-12 h-12 rounded-full 
              bg-primary-gradient
              text-white border-none cursor-pointer
              flex items-center justify-center
              transition-all duration-300
              hover:scale-110 hover:shadow-primary
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              focus:outline-none focus:ring-3 focus:ring-white/30
            "
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="
              absolute right-4 top-1/2 z-30 -translate-y-1/2
              w-12 h-12 rounded-full 
              bg-primary-gradient
              text-white border-none cursor-pointer
              flex items-center justify-center
              transition-all duration-300
              hover:scale-110 hover:shadow-primary
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              focus:outline-none focus:ring-3 focus:ring-white/30
            "
            aria-label="Next slide"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {childrenArray.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === currentIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
                }
                disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-white/50
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar (optional) */}
      {!isPaused && totalSlides > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-30">
          <div 
            className="h-full bg-primary-gradient transition-all duration-[6000ms] ease-linear"
            style={{
              width: `${((currentIndex + 1) / totalSlides) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FadeCarousel;