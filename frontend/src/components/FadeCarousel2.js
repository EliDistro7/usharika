"use client";

import React from "react";
import { Carousel } from "react-responsive-carousel"; // Import react-responsive-carousel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the necessary CSS

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
    autoPlay={!isPaused} // Toggle autoplay based on isPaused prop
    infiniteLoop={true}
    showArrows={false}
    showThumbs={false} // Hides thumbnails
    showStatus={false} // Hides slide status
    transitionTime={2000} // Smooth transition
    interval={4000} // Slide interval (5 seconds)
    animationHandler="fade" // Use fade animation
    swipeable={false} // Disable swiping to support fade animati
     
      // Ensure autoplay doesn't stop on hover
    >
      {children}
      {/* Map over the children to add props if they are React components */}
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
        return child; // Return the child unmodified if it's not a valid React element
      })}
    </Carousel>
  );
};

export default FadeCarousel;