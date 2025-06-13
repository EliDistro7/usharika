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
      position: "relative", // Ensure container positioning
      transition: "all 0.3s ease-in-out",
      width: isFullscreen ? "100vw" : "100%",
      height: isFullscreen ? "100vh" : "auto",
     
      display: isFullscreen ? "flex" : "block",
      alignItems: isFullscreen ? "center" : "initial",
      justifyContent: isFullscreen ? "center" : "initial",
      overflow: isFullscreen ? "hidden" : "visible",
    },
    button: {
      position: "absolute",
      top: "10px",
      right: "10px",
      zIndex: 1000, // Ensure the button is above other elements
      cursor: "pointer",
      background: "rgba(255, 255, 255, 0.8)", // Add a semi-transparent background for better visibility
    },
  };
  

  return (
    <div style={styles.container}>
      <img
        src={imageUrl}
        alt={altText || "Image Content"}
        style={styles.image}
      />

     
    </div>
  );
};

export default ImageComponent;
