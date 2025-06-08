import React from 'react';

const AudioVisualizer = ({ audioLevel, isActive, barCount = 12 }) => {
  // Generate random heights for each bar based on audio level
  const generateBarHeight = (index) => {
    if (!isActive) return 10;
    
    // Create variation in bar heights
    const baseHeight = audioLevel * (Math.random() * 0.5 + 0.7);
    const variation = Math.sin((Date.now() / 100) + index) * 10;
    return Math.max(10, baseHeight + variation + 10);
  };

  return (
    <div className="audio-visualizer d-flex align-items-end justify-content-center gap-1">
      {[...Array(barCount)].map((_, index) => (
        <div
          key={index}
          className="bg-purple rounded"
          style={{
            width: '8px',
            height: `${generateBarHeight(index)}px`,
            opacity: isActive ? 0.8 : 0.3,
            transition: 'all 0.1s ease',
            animation: isActive ? `audioBar 0.5s ease-in-out infinite ${index * 0.1}s` : 'none'
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes audioBar {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default AudioVisualizer;