

'use client';

import React from "react";
import VideoCard from "./VideoCard";

const VideoGallery = ({ videos }) => {
  return (
    <div className="container-fluid wow fadeIn videobg">
      {/* Section Title */}
      <div className="text-center my-0">
      
        <p className="text-muted">
          Explore our curated collection of videos to learn more about our work and impact.
        </p>
      </div>

      {/* Video Cards Grid */}
      <div className="row g-4">
        {videos.map((video, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <VideoCard
              videoSrc={video.videoSrc}
              thumbnail={video.thumbnail}
              title={video.title}
              description={video.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
