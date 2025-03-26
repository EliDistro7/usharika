import React from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand } from "react-icons/fa";
import ShareButton from "./ShareButton";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const ControlButtons = ({
  isPaused,
  togglePause,
  isMuted,
  toggleMute,
  handleModalShow,
  title,
  colors
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-4">
      <div className="d-flex gap-3">
        <button
          onClick={togglePause}
          className="rounded-full shadow-lg d-flex align-items-center justify-content-center transition-all hover:shadow-xl"
          style={{
            backgroundColor: colors.purple,
            color: colors.white,
            width: "50px",
            height: "50px",
            border: "none",
            transform: "scale(1)",
            transformOrigin: "center"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {isPaused ? <FaPlay size={16} /> : <FaPause size={16} />}
        </button>
        
        <button
          onClick={toggleMute}
          className="rounded-full shadow-lg d-flex align-items-center justify-content-center transition-all hover:shadow-xl"
          style={{
            backgroundColor: colors.black,
            color: colors.white,
            width: "50px",
            height: "50px",
            border: "none",
            transform: "scale(1)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
        </button>
      </div>
      
      <div className="d-flex gap-3">
        <button
          onClick={handleModalShow}
          className="rounded-full shadow-lg d-flex align-items-center justify-content-center transition-all hover:shadow-xl"
          style={{
            backgroundColor: colors.yellow,
            color: colors.black,
            width: "50px",
            height: "50px",
            border: "none",
            transform: "scale(1)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          title="Fullscreen"
        >
          <FaExpand size={16} />
        </button>
        
        <ShareButton 
          url={window.location.href} 
          title={title} 
          colors={colors} 
        />
      </div>
    </div>
  );
};

export default ControlButtons;