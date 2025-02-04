"use client";

import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const FadeCarousel = ({
  children,
  isPaused = false,
  isFullscreen = false,
  onToggleFullscreen,
  isMuted = false,
  onToggleMute,
}) => {
  return (
    <Carousel
      autoPlay={!isPaused}
      infiniteLoop={true}
      showArrows={false}
      showThumbs={false}
      showStatus={false}
      transitionTime={2000}
      interval={4000}
      animationHandler="fade"
      swipeable={false}
      stopOnHover={false}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...(typeof child.type === "function" && {
              isFullscreen,
              onToggleFullscreen,
              isMuted,
              onToggleMute,
            }),
          });
        }
        return child;
      })}
    </Carousel>
  );
};

export default FadeCarousel;