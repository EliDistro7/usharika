'use client';

import React, { useState } from "react";

const VideoCard = ({ videoSrc, thumbnail, title, description }) => {
  const [currentVideoSrc, setCurrentVideoSrc] = useState(null);

  const handlePlayClick = () => {
    setCurrentVideoSrc(`${videoSrc}?autoplay=1&modestbranding=1&showinfo=0`);
  };

  const handleClose = () => {
    setCurrentVideoSrc(null);
  };

  return (
    <>
      <div className="card shadow-sm border-0 mb-4 videobg">
        {/* Video Thumbnail */}
        <div className="position-relative">
          <img
            src={thumbnail}
            className="card-img-top rounded"
            alt={title}
          />
          <button
            type="button"
            className="btn btn-light btn-lg position-absolute top-50 start-50 translate-middle rounded-circle"
            onClick={handlePlayClick}
            data-bs-toggle="modal"
            data-bs-target="#videoModal"
          >
            <i className="bi bi-play-circle text-primary fs-1"></i>
          </button>
        </div>

        {/* Title and Description */}
        <div className="card-body text-center">
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{description}</p>
        </div>
      </div>

      {/* Video Modal */}
      <div
        className="modal fade"
        id="videoModal"
        tabIndex="-1"
        aria-labelledby="videoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="videoModalLabel">
                {title}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body p-0">
              <iframe
                className="w-100"
                height="400"
                src={currentVideoSrc}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCard;
