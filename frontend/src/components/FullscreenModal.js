

// components/FullscreenModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";
import FadeCarousel from "@/components/FadeCarousel2";
import CarouselItem from "./CarouselItem";

const FullscreenModal = ({
  showModal,
  handleModalClose,
  isPaused,
  isMuted,
  toggleMute,
  activeTab,
  content,
  videoRefs,
  setIsPaused,
  title,
}) => {
  return (
    <Modal
      show={showModal}
      onHide={handleModalClose}
      size="lg"
      centered
      backdrop={false}
      className="custom-modal"
    >
      <Modal.Header closeButton className="bg-purple-600 text-white">
        <Modal.Title className="text-white">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <FadeCarousel isPaused={isPaused} isMuted={isMuted} onToggleMute={toggleMute}>
          {content[activeTab].content.map((item, index) => (
            <CarouselItem
              key={index}
              item={item}
              isMuted={isMuted}
              videoRef={(el) => (videoRefs.current[index] = el)}
              onPauseCarousel={() => setIsPaused(true)}
            />
          ))}
        </FadeCarousel>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FullscreenModal;