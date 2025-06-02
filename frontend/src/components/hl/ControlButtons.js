import React, { memo } from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand } from "react-icons/fa";
import ShareButton from "@/components/ShareButton";

// Memoized button component for better performance
const ControlButton = memo(({ 
  onClick, 
  icon: Icon, 
  bgColor, 
  textColor, 
  title,
  size = 56,
  isActive = false 
}) => {
  const buttonStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    border: "none",
    background: isActive 
      ? `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)` 
      : bgColor,
    color: textColor,
    boxShadow: isActive 
      ? `0 8px 25px rgba(0, 0, 0, 0.2), 0 0 0 3px ${bgColor}33`
      : "0 4px 15px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      title={title}
      className="control-button"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
        e.currentTarget.style.boxShadow = `0 12px 30px rgba(0, 0, 0, 0.2), 0 0 0 3px ${bgColor}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = isActive 
          ? `0 8px 25px rgba(0, 0, 0, 0.2), 0 0 0 3px ${bgColor}33`
          : "0 4px 15px rgba(0, 0, 0, 0.1)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(0.98)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
      }}
    >
      {/* Ripple effect overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${textColor}20 0%, transparent 70%)`,
          opacity: 0,
          transform: "scale(0)",
          transition: "all 0.3s ease",
        }}
        className="ripple-effect"
      />
      <Icon size={18} style={{ zIndex: 1 }} />
    </button>
  );
});

ControlButton.displayName = "ControlButton";

const ControlButtons = ({
  isPaused,
  togglePause,
  isMuted,
  toggleMute,
  handleModalShow,
  title,
  colors
}) => {
  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    background: `linear-gradient(135deg, ${colors.surface}95, ${colors.background}95)`,
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    border: `1px solid rgba(99, 102, 241, 0.1)`,
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  };

  const groupStyle = {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  };

  return (
    <div style={containerStyle} className="control-panel">
      {/* Left control group */}
      <div style={groupStyle}>
        <ControlButton
          onClick={togglePause}
          icon={isPaused ? FaPlay : FaPause}
          bgColor={colors.primary}
          textColor={colors.surface}
          title={isPaused ? "Play" : "Pause"}
          isActive={!isPaused}
        />
        
        <ControlButton
          onClick={toggleMute}
          icon={isMuted ? FaVolumeMute : FaVolumeUp}
          bgColor={colors.text}
          textColor={colors.surface}
          title={isMuted ? "Unmute" : "Mute"}
          isActive={!isMuted}
        />
      </div>
      
      {/* Right control group */}
      <div style={groupStyle}>
        <ControlButton
          onClick={handleModalShow}
          icon={FaExpand}
          bgColor={colors.accent}
          textColor={colors.text}
          title="Fullscreen"
        />
        
        <ShareButton 
          url={typeof window !== 'undefined' ? window.location.href : ''} 
          title={title} 
          colors={colors} 
        />
      </div>

      <style jsx>{`
        .control-button:active .ripple-effect {
          opacity: 1;
          transform: scale(1);
        }
        
        .control-panel {
          animation: slideUp 0.5s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default memo(ControlButtons);