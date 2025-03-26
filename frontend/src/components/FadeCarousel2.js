"use client";

import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const FadeCarousel = ({
  children,
  isPaused = false,
  isFullscreen = false,
  isMuted = false,
  colors,
  onToggleMute,
}) => {
  return (
    <Carousel
      autoPlay={!isPaused}
      infiniteLoop={true}
      showArrows={isFullscreen}
      showThumbs={false}
      showStatus={false}
      transitionTime={500}
      interval={6000}
      animationHandler="fade"
      swipeable={true}
      stopOnHover={false}
      renderArrowPrev={(onClickHandler, hasPrev, label) => (
        <button
          type="button"
          onClick={onClickHandler}
          title={label}
          style={{
            position: 'absolute',
            zIndex: 2,
            left: 15,
            top: '50%',
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: colors.purple,
            color: colors.white,
            border: 'none',
            cursor: 'pointer',
            transform: 'translateY(-50%)'
          }}
        >
          ←
        </button>
      )}
      renderArrowNext={(onClickHandler, hasNext, label) => (
        <button
          type="button"
          onClick={onClickHandler}
          title={label}
          style={{
            position: 'absolute',
            zIndex: 400,
            right: 15,
            top: '50%',
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: colors.purple,
            color: colors.white,
            border: 'none',
            cursor: 'pointer',
            transform: 'translateY(-50%)'
          }}
        >
          →
        </button>
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isFullscreen,
            isMuted,
            onToggleMute,
            colors
          });
        }
        return child;
      })}
    </Carousel>
  );
};

export default FadeCarousel;