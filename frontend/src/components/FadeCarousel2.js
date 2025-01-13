"use client";

import React from "react";
import { Carousel } from "react-responsive-carousel"; // Import react-responsive-carousel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

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
      autoPlay={!isPaused} // Autoplay only when not paused
      infiniteLoop={true} // Infinite looping
      showArrows={false} // Hide navigation arrows
      showThumbs={false} // Hide thumbnails
      showStatus={false} // Hide slide status
      transitionTime={2000} // Transition duration in milliseconds
      interval={4000} // Time between slides in milliseconds
      animationHandler="fade" // Use fade animation
      swipeable={false} // Disable swiping for better fade animation
      emulateTouch={false} // Disable touch gestures completely
      stopOnHover={false} // Ensure autoplay doesn't stop on hover
    >
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
