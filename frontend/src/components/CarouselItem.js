import React from "react";
import VideoComponent from "./VideoComponent";
import ImageComponent from "./ImageComponent";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const CarouselItem = ({
  item,
  isMuted,
  videoRef,
  onPauseCarousel,
  colors
}) => {
  return (
    <div
      className="position-relative"
      onMouseEnter={onPauseCarousel}
      style={{ position: "relative" }}
    >
      {item.imageUrl ? (
        <ImageComponent imageUrl={item.imageUrl} altText="Carousel Item" />
      ) : item.videoUrl ? (
        <VideoComponent
          videoUrl={item.videoUrl}
          isMuted={isMuted}
          videoRef={videoRef}
          onPauseCarousel={onPauseCarousel}
        />
      ) : null}

      {/* Overlay with description */}
      {item.description && (
        <div
          className="position-absolute bottom-0 start-0 w-100 p-4"
          style={{ 
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            zIndex: 1000
          }}
        >
          <p className={`mb-0 ${cormorant.className}`} style={{
            color: colors.white,
            fontSize: "1.1rem",
            lineHeight: "1.4"
          }}>
            {item.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default CarouselItem;