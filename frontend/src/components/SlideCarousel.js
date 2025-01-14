



"use client";

import React from "react";
import { Carousel } from "react-responsive-carousel"; // Import react-responsive-carousel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the necessary CSS


const SlideCarousel = ({ children, isPaused = false }) => {
  return (
    <Carousel
      autoPlay={!isPaused} // Toggle autoplay based on isPaused prop
      infiniteLoop={true}
      showArrows={false}
      showThumbs={false} // Hides thumbnails
      showStatus={false} // Hides slide status
      transitionTime={300} // Smooth transition
      interval={8000} // Slide interval (5 seconds)
      //animationHandler="fade" // Use fade animation
      swipeable={false} // Disable swiping to support fade animation
    >
      {children}
    </Carousel>
  );
};

export default SlideCarousel;
