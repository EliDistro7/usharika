"use client";

import React, { memo, useMemo } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const NavigationButton = memo(({ direction, onClick, colors, label }) => {
  const isNext = direction === "next";
  
  const buttonStyle = {
    position: 'absolute',
    zIndex: 500,
    [isNext ? 'right' : 'left']: '20px',
    top: '50%',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    color: colors.surface,
    border: 'none',
    cursor: 'pointer',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
      }}
    >
      {isNext ? '→' : '←'}
    </button>
  );
});

NavigationButton.displayName = "NavigationButton";

const FadeCarousel = ({
  children,
  isPaused = false,
  isFullscreen = false,
  isMuted = false,
  colors,
  onToggleMute,
}) => {
  // Memoized carousel settings for better performance
  const carouselSettings = useMemo(() => ({
    autoPlay: !isPaused,
    infiniteLoop: true,
    showArrows: isFullscreen,
    showThumbs: false,
    showStatus: false,
    showIndicators: true,
    transitionTime: 600,
    interval: 7000,
    animationHandler: "fade",
    swipeable: true,
    stopOnHover: false,
    useKeyboardArrows: true,
    dynamicHeight: false,
  }), [isPaused, isFullscreen]);

  // Enhanced render functions with memoization
  const renderArrowPrev = useMemo(() => 
    (onClickHandler, hasPrev, label) => (
      <NavigationButton 
        direction="prev"
        onClick={onClickHandler}
        colors={colors}
        label={label}
      />
    ), [colors]
  );

  const renderArrowNext = useMemo(() => 
    (onClickHandler, hasNext, label) => (
      <NavigationButton 
        direction="next"
        onClick={onClickHandler}
        colors={colors}
        label={label}
      />
    ), [colors]
  );

  // Custom indicator dots
  const renderIndicator = useMemo(() => 
    (onClickHandler, isSelected, index, label) => {
      const indicatorStyle = {
        background: isSelected ? colors.primary : `${colors.textSecondary}50`,
        width: isSelected ? '12px' : '8px',
        height: isSelected ? '12px' : '8px',
        borderRadius: '50%',
        margin: '0 4px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: isSelected ? `2px solid ${colors.surface}` : 'none',
        boxShadow: isSelected ? `0 0 0 2px ${colors.primary}33` : 'none',
      };

      return (
        <button
          type="button"
          onClick={onClickHandler}
          onKeyDown={onClickHandler}
          value={index}
          key={index}
          role="button"
          tabIndex={0}
          title={`${label} ${index + 1}`}
          style={indicatorStyle}
        />
      );
    }, [colors]
  );

  const containerStyle = {
    position: 'relative',
    background: isFullscreen ? 'transparent' : colors.surface,
    borderRadius: isFullscreen ? '0' : '16px',
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle} className="enhanced-carousel">
      <Carousel
        {...carouselSettings}
        renderArrowPrev={renderArrowPrev}
        renderArrowNext={renderArrowNext}
        renderIndicator={renderIndicator}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              key: `carousel-item-${index}`,
              isFullscreen,
              isMuted,
              onToggleMute,
              colors
            });
          }
          return child;
        })}
      </Carousel>

      <style jsx global>{`
        .enhanced-carousel .carousel .control-dots {
          position: absolute;
          bottom: 15px;
          margin: 0;
          padding: 10px 0;
          text-align: center;
          background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
          backdrop-filter: blur(5px);
          border-radius: 25px;
          left: 50%;
          transform: translateX(-50%);
          width: auto;
          display: inline-flex;
          justify-content: center;
          gap: 4px;
        }
        
        .enhanced-carousel .carousel .control-dots .dot {
          box-shadow: none;
          text-indent: -9999px;
          opacity: 1;
        }
        
        .enhanced-carousel .carousel.carousel-slider {
          position: relative;
          margin: 0;
          overflow: hidden;
        }
        
        .enhanced-carousel .carousel .slider-wrapper {
          overflow: hidden;
          margin: auto;
          width: 100%;
          transition: height 0.15s ease-in;
        }
        
        .enhanced-carousel .carousel .slider {
          margin: 0;
          padding: 0;
          position: relative;
          list-style: none;
          width: 100%;
        }
        
        .enhanced-carousel .carousel .slide {
          min-width: 100%;
          margin: 0;
          position: relative;
          text-align: center;
          background: ${colors.surface};
        }
        
        /* Fade animation enhancement */
        .enhanced-carousel .carousel.carousel-slider .control-arrow {
          transition: all 0.3s ease;
        }
        
        .enhanced-carousel .carousel.carousel-slider .control-arrow:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default memo(FadeCarousel);