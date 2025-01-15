
import React from "react";
import { Container, Button } from "react-bootstrap";

const Header = ({ title, subtitle, backgroundImage }) => {
  const styles = {
    headerWrapper: {
      position: "relative",
      minHeight: "60vh",
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      textShadow: "0 2px 5px rgba(0, 0, 0, 0.7)",
    },
    overlay: {
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      zIndex: 1,
    },
    content: {
      position: "relative",
      zIndex: 2,
      textAlign: "center",
    },
    title: {
      fontSize: "3.5rem",
      fontWeight: "700",
      marginBottom: "1rem",
    },
    subtitle: {
      fontSize: "1.5rem",
      fontWeight: "400",
      marginBottom: "2rem",
    },
    button: {
      fontSize: "1rem",
      fontWeight: "500",
      borderRadius: "5px",
      margin: "0 0.5rem",
    },
  };

  return (
    <div style={styles.headerWrapper}>
      <div style={styles.overlay} />
      <Container>
        <div style={styles.content}>
          <h1 style={styles.title} className="text-white">{title}</h1>
          <p style={styles.subtitle}>{subtitle}</p>
          <Button
            variant="warning"
            style={styles.button}
            href="/about"
          >
            Jifunze zaidi
          </Button>
          <Button
            variant="outline-light"
            style={styles.button}
            href="#contact-us"
          >
            Wasiliana nasi
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Header;
