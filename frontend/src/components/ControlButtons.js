import React from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand } from "react-icons/fa";
import ShareButton from "./ShareButton";

const ControlButtons = ({
  isPaused,
  togglePause,
  isMuted,
  toggleMute,
  handleModalShow,
  title,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div className="d-flex gap-2">
        <button
          onClick={togglePause}
          className="btn btn-primary rounded-circle shadow-sm p-3 hover:scale-105 transition-transform"
        >
          {isPaused ? <FaPlay /> : <FaPause />}
        </button>
        <button
          onClick={toggleMute}
          className="btn btn-secondary rounded-circle shadow-sm p-3 hover:scale-105 transition-transform"
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>
      <button
        onClick={handleModalShow}
        className="btn btn-outline-dark rounded-circle shadow-sm p-3 hover:scale-105 transition-transform"
        title="Fullscreen"
      >
        <FaExpand />
      </button>
      <ShareButton url={window.location.href} title={title} />
    </div>
  );
};

export default ControlButtons;