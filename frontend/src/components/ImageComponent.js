import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaExpandAlt, FaCompressAlt } from "react-icons/fa";

const ImageComponent = ({ imageUrl, altText }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    console.log(
      `Fullscreen mode ${!isFullscreen ? "enabled" : "disabled"} at ${
        new Date().toLocaleTimeString()
      }`
    );
  };

  // Inline styles for fullscreen and normal modes
  const styles = {
    container: {
      position: "relative",
      transition: "all 0.3s ease-in-out",
      width: isFullscreen ? "100vw" : "100%",
      height: isFullscreen ? "100vh" : "auto",
      backgroundColor: isFullscreen ? "#000" : "transparent",
      display: isFullscreen ? "flex" : "block",
      alignItems: isFullscreen ? "center" : "initial",
      justifyContent: isFullscreen ? "center" : "initial",
      overflow: isFullscreen ? "hidden" : "visible",
      // Remove tap highlight on mobile devices
      WebkitTapHighlightColor: "transparent",
      tapHighlightColor: "transparent",
    },
    image: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
      transition: "all 0.3s ease-in-out",
      // Remove tap highlight specifically for the image
      WebkitTapHighlightColor: "transparent",
      tapHighlightColor: "transparent",
      // Prevent text selection on touch
      WebkitUserSelect: "none",
      userSelect: "none",
      // Prevent touch callout on iOS
      WebkitTouchCallout: "none",
    },
    button: {
      position: "absolute",
      top: "10px",
      right: "10px",
      zIndex: 1000,
      cursor: "pointer",
      background: "rgba(255, 255, 255, 0.8)",
      // Remove tap highlight for button
      WebkitTapHighlightColor: "transparent",
      tapHighlightColor: "transparent",
    },
  };

  return (
    <div style={styles.container}>
      <img
        src={imageUrl}
        alt={altText || "Image Content"}
        style={styles.image}
        onClick={toggleFullscreen} // Make image clickable
      />

      <Button
        style={styles.button}
        onClick={toggleFullscreen}
        variant="light"
        size="sm"
      >
        {isFullscreen ? <FaCompressAlt /> : <FaExpandAlt />}
      </Button>
    </div>
  );
};

export default ImageComponent;