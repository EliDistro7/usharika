import React, { useState, useEffect, useRef } from 'react';

const AudioVisualizer = ({ 
  audioLevel = 0, 
  isActive = false, 
  barCount = 12,
  size = 'medium', // 'small', 'medium', 'large'
  theme = 'purple', // 'purple', 'gradient', 'live'
  showLabel = true,
  sensitivity = 1.2 // Audio sensitivity multiplier
}) => {
  const [barHeights, setBarHeights] = useState(new Array(barCount).fill(10));
  const animationRef = useRef();
  const lastUpdateRef = useRef(Date.now());

  // Size configurations
  const sizeConfig = {
    small: { width: '4px', minHeight: 8, maxHeight: 40, gap: '2px' },
    medium: { width: '8px', minHeight: 10, maxHeight: 60, gap: '3px' },
    large: { width: '12px', minHeight: 12, maxHeight: 80, gap: '4px' }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Theme configurations
  const getBarStyle = (index, height, isActive) => {
    const baseStyle = {
      width: config.width,
      height: `${height}px`,
      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      borderRadius: '4px',
      transformOrigin: 'bottom'
    };

    switch (theme) {
      case 'gradient':
        return {
          ...baseStyle,
          background: isActive 
            ? `linear-gradient(to top, #8b5cf6, #a78bfa, #c4b5fd)`
            : '#e5e7eb',
          opacity: isActive ? (0.6 + (height / config.maxHeight) * 0.4) : 0.3,
          boxShadow: isActive ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'none'
        };
      
      case 'live':
        return {
          ...baseStyle,
          background: isActive 
            ? `linear-gradient(to top, #dc2626, #ef4444, #f87171)`
            : '#6b7280',
          opacity: isActive ? (0.7 + (height / config.maxHeight) * 0.3) : 0.3,
          boxShadow: isActive ? '0 2px 8px rgba(220, 38, 38, 0.4)' : 'none'
        };
      
      default: // purple
        return {
          ...baseStyle,
          backgroundColor: isActive ? '#8b5cf6' : '#d1d5db',
          opacity: isActive ? (0.6 + (height / config.maxHeight) * 0.4) : 0.3,
        };
    }
  };

  // Enhanced bar height generation with smoother animations
  const generateBarHeights = () => {
    const now = Date.now();
    const timeDelta = now - lastUpdateRef.current;
    
    return barHeights.map((currentHeight, index) => {
      if (!isActive) {
        // Smooth transition to minimum height when inactive
        return Math.max(config.minHeight, currentHeight * 0.95);
      }

      // Create frequency-based variation for each bar
      const frequencyIndex = index / (barCount - 1); // 0 to 1
      const baseAmplitude = audioLevel * sensitivity;
      
      // Different frequency responses for different bars
      let targetHeight;
      if (frequencyIndex < 0.3) {
        // Low frequencies - more responsive to bass
        targetHeight = baseAmplitude * (1.2 + Math.sin(now / 200 + index) * 0.3);
      } else if (frequencyIndex < 0.7) {
        // Mid frequencies - moderate response
        targetHeight = baseAmplitude * (1.0 + Math.sin(now / 150 + index * 1.5) * 0.4);
      } else {
        // High frequencies - more erratic, responsive to treble
        targetHeight = baseAmplitude * (0.8 + Math.sin(now / 100 + index * 2) * 0.5);
      }

      // Add some randomness for more natural look
      const randomVariation = (Math.random() - 0.5) * 0.2 * baseAmplitude;
      targetHeight += randomVariation;

      // Smooth interpolation towards target height
      const smoothingFactor = Math.min(timeDelta / 50, 1); // Adjust smoothing based on time delta
      const newHeight = currentHeight + (targetHeight - currentHeight) * smoothingFactor;

      return Math.max(config.minHeight, Math.min(config.maxHeight, newHeight));
    });
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setBarHeights(generateBarHeights());
      lastUpdateRef.current = Date.now();
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isActive || barHeights.some(h => h > config.minHeight)) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioLevel, isActive, barCount, sensitivity]);

  // Initialize bar heights
  useEffect(() => {
    setBarHeights(new Array(barCount).fill(config.minHeight));
  }, [barCount]);

  return (
    <div className="audio-visualizer-container d-flex flex-column align-items-center">
      {/* Visualizer */}
      <div 
        className="audio-visualizer d-flex align-items-end justify-content-center"
        style={{ 
          gap: config.gap,
          padding: '10px',
          borderRadius: '12px',
          background: isActive && theme === 'live' 
            ? 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.1) 0%, transparent 70%)'
            : isActive && theme === 'gradient'
            ? 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)'
            : 'transparent',
          transition: 'background 0.3s ease'
        }}
      >
        {barHeights.map((height, index) => (
          <div
            key={index}
            style={getBarStyle(index, height, isActive)}
          />
        ))}
      </div>

      {/* Label */}
      {showLabel && (
        <div className="mt-2 text-center">
          <small 
            className={`text-${isActive ? (theme === 'live' ? 'danger' : 'purple') : 'muted'}`}
            style={{ 
              fontSize: size === 'small' ? '0.7rem' : '0.8rem',
              fontWeight: isActive ? '600' : '400',
              transition: 'all 0.3s ease'
            }}
          >
            {isActive 
              ? `${Math.round(audioLevel)}% • ${theme === 'live' ? 'LIVE' : 'ACTIVE'}`
              : 'Microphone Ready'
            }
          </small>
        </div>
      )}

      {/* Pulse effect for live mode */}
      {isActive && theme === 'live' && (
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: '120px',
            height: '120px',
            border: '2px solid rgba(220, 38, 38, 0.3)',
            animation: 'pulse 2s infinite',
            pointerEvents: 'none',
            zIndex: -1
          }}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }

        .audio-visualizer-container {
          position: relative;
        }

        .text-purple {
          color: #8b5cf6 !important;
        }
      `}</style>
    </div>
  );
};

export default AudioVisualizer;