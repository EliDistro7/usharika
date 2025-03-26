import React from "react";
import VideoComponent from "./VideoComponent";
import ImageComponent from "./ImageComponent";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const CarouselItem = ({
  item,
  isMuted,
  isFullscreen,
  videoRef,
  colors
}) => {
  return (
    <div
      className="position-relative"
    
      style={{ 
        position: "relative",
        height: isFullscreen ? "calc(100vh - 120px)" : "auto"
      }}
    >
      {item.imageUrl ? (
        <ImageComponent 
          imageUrl={item.imageUrl} 
          altText="Carousel Item" 
          isFullscreen={isFullscreen}
        />
      ) : item.videoUrl ? (
        <VideoComponent
          videoUrl={item.videoUrl}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          videoRef={videoRef}
          
        />
      ) : null}

      {/* Overlay with description */}
      {item.description && (
        <div
          className="position-absolute bottom-0 start-0 w-100 p-4"
          style={{ 
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            zIndex: 1000
          }}
        >
          <p className={`mb-0 ${cormorant.className}`} style={{
            color: colors.white,
            fontSize: isFullscreen ? "1.4rem" : "1.1rem",
            lineHeight: "1.5",
            maxWidth: "80%",
            margin: "0 auto",
            textAlign: "center"
          }}>
            {item.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default CarouselItem;