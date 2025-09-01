'use client';

import React, { useState } from "react";
import { Expand, Shrink } from "lucide-react";

const ImageComponent = ({ imageUrl, altText, className, onLoad, onError, ...props }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    console.log(
      `Fullscreen mode ${!isFullscreen ? "enabled" : "disabled"} at ${
        new Date().toLocaleTimeString()
      }`
    );
  };

  return (
    <div 
      className={`
        relative group transition-all duration-300 ease-out
        ${isFullscreen 
          ? 'fixed inset-0 z-[100] bg-black/90 flex items-center justify-center overflow-hidden' 
          : 'w-full h-auto'
        }
      `}
    >
      <img
        src={imageUrl}
        alt={altText || "Image Content"}
        className={`
          ${className || ''}
          ${isFullscreen ? 'max-w-full max-h-full object-contain' : ''}
          transition-all duration-300 ease-out
        `}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />

      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="
          absolute top-3 right-3 z-[1000] p-2 rounded-lg
          bg-background-50/80 hover:bg-background-50/90
          text-text-primary hover:text-primary-700
          transition-all duration-200 ease-out
          hover:scale-105 hover:shadow-primary
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          backdrop-blur-sm border border-border-light
          opacity-0 group-hover:opacity-100
        "
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <Shrink className="w-5 h-5" />
        ) : (
          <Expand className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default ImageComponent;