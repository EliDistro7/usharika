import React, { memo } from "react";
import { Play, Pause, VolumeX, Volume2, Expand } from "lucide-react";
import ShareButton from "@/components/ShareButton";

// Memoized button component for better performance
const ControlButton = memo(({ 
  onClick, 
  icon: Icon, 
  variant = "primary",
  title,
  size = 14,
  isActive = false 
}) => {
  const baseClasses = "w-14 h-14 rounded-full border-0 flex items-center justify-center cursor-pointer transition-all duration-300 ease-out relative overflow-hidden group";
  
  const variantClasses = {
    primary: isActive 
      ? "bg-primary-gradient shadow-primary hover:shadow-primary-lg hover:-translate-y-0.5 hover:scale-105" 
      : "bg-primary-gradient shadow-primary hover:shadow-primary-lg hover:-translate-y-0.5 hover:scale-105",
    secondary: "bg-gradient-to-br from-text-primary to-text-secondary text-white shadow-medium hover:shadow-strong hover:-translate-y-0.5 hover:scale-105",
    accent: "bg-secondary-gradient text-text-primary shadow-yellow hover:shadow-yellow-lg hover:-translate-y-0.5 hover:scale-105"
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`${baseClasses} ${variantClasses[variant]} active:scale-95`}
    >
      {/* Ripple effect overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/20 to-transparent opacity-0 scale-0 group-active:opacity-100 group-active:scale-100 transition-all duration-300"></div>
      <Icon size={size} className="relative z-10 text-white" />
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
  fonts
}) => {
  return (
    <div className="flex justify-between items-center p-6 glass-strong rounded-5xl border border-primary-100 shadow-soft animate-slide-up">
      {/* Left control group */}
      <div className="flex gap-4 items-center">
        <ControlButton
          onClick={togglePause}
          icon={isPaused ? Play : Pause}
          variant="primary"
          title={isPaused ? "Play" : "Pause"}
          isActive={!isPaused}
        />
        
        <ControlButton
          onClick={toggleMute}
          icon={isMuted ? VolumeX : Volume2}
          variant="secondary"
          title={isMuted ? "Unmute" : "Mute"}
          isActive={!isMuted}
        />
      </div>
      
      {/* Right control group */}
      <div className="flex gap-4 items-center">
        <ControlButton
          onClick={handleModalShow}
          icon={Expand}
          variant="accent"
          title="Fullscreen"
        />
        
        <ShareButton 
          url={typeof window !== 'undefined' ? window.location.href : ''} 
          title={title} 
        />
      </div>
    </div>
  );
};

export default memo(ControlButtons);