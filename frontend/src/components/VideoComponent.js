

import React from "react";

const VideoComponent = ({ videoUrl, isMuted, videoRef, onPauseCarousel }) => {
  return (
    <video
      ref={videoRef}
      src={videoUrl}
      autoPlay
      loop
      muted={isMuted}
      className="w-100 h-100 object-cover"
      onPlay={onPauseCarousel} // Pause carousel when video plays
    />
  );
};

export default VideoComponent;
