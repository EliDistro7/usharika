import React from "react";
import VideoComponent from "./VideoComponent";
import ImageComponent from "./ImageComponent";

const CarouselItem = ({
  item,
  isMuted,
  videoRef,
  onPauseCarousel,
  onToggleMute,
}) => {
  return (
    <div
      className="position-relative"
      onMouseEnter={onPauseCarousel} // Pause carousel on hover
      style={{ position: "relative" }} // Ensure the container is positioned
    >
      {item.imageUrl ? (
        <ImageComponent imageUrl={item.imageUrl} altText="Carousel Item" />
      ) : item.videoUrl ? (
        <VideoComponent
          videoUrl={item.videoUrl}
          isMuted={isMuted}
          videoRef={videoRef}
          onPauseCarousel={onPauseCarousel}
          onToggleMute={onToggleMute}
        />
      ) : (
        null
      )}

      {/* Overlay with description */}
      <div
        className="position-absolute bottom-0 start-0 w-100 p-3 text-white"
        style={{ zIndex: 1000 }} // Ensures proper layering
      >
        <p className="mb-2 text-truncate">{item.description}</p>
      </div>
    </div>
  );
};

export default CarouselItem;
