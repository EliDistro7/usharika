"use client";

import React, { useState, useRef } from "react";
import CarouselItem from "./CarouselItem";
import FadeCarousel from "@/components/FadeCarousel2";
import {
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaChevronDown,
  FaChevronUp,
  FaExpand,
} from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import ShareButton from "./ShareButton"; // Import ShareButton

const Highlights = ({ data, datatype='default' }) => {
 // console.log('datatype', datatype)
  console.log('data',data);
//console.log('content interface:data.content',data.content );


const getActiveTab = ()=>{
 const curAct = datatype === "default" ? Object.keys(data.content)[0] : Object.keys(data.content)[0];
 return curAct;
}


if(datatype === 'searchResults')console.log('interface at Object.keys(data.content[0]) ', Object.keys(data.content[0]))

  const [activeTab, setActiveTab] = useState(getActiveTab());
 
  //console.log('group active is', data.content )

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const videoRefs = useRef([]);

  const togglePause = () => setIsPaused(!isPaused);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
  
  const sanitizeContent = (contentArray) => {
    const seen = new Set();
    
    return contentArray.filter(item => {
      const uniqueKey = item.imageUrl || item.videoUrl;
      
      if (uniqueKey && !seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        return true;
      }
      
      return false;
    });
  };

  return (
    <div className="position-relative z-10 mt-4 p-4 rounded shadow bg-white">
      {/* Title */}
      <h1 className="h4 mb-4 text-dark fw-bold">{data.name}</h1>
  
      {/* Dropdown for Chapters */}
      <div className="mb-4">
        <button
          className="btn btn-dark w-100 text-start d-flex justify-content-between align-items-center py-2"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{data.content[activeTab].groupName}</span>
          {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
  
        {dropdownOpen && (
          <div className="mt-2">
            {Object.keys(data.content).map((tab) => (
              <button
                key={tab}
                className={`btn w-100 text-start mb-1 ${
                  activeTab === tab ? "btn-secondary" : "btn-outline-secondary"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setDropdownOpen(false);
                }}
              >
                {data.content[tab].groupName}
              </button>
            ))}
          </div>
        )}
      </div>
  
      {/* Carousel Content */}
      <FadeCarousel isPaused={isPaused} isMuted={isMuted} onToggleMute={toggleMute}>
        {data.content[activeTab].content.map((item, index) => (
          <CarouselItem
            key={index}
            item={item}
            isMuted={isMuted}
            videoRef={(el) => (videoRefs.current[index] = el)}
            onPauseCarousel={() => setIsPaused(true)}
          />
        ))}
      </FadeCarousel>
  
      {/* Control Buttons */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex gap-2">
          <button
            onClick={togglePause}
            className="btn btn-primary rounded-circle shadow-sm p-2"
          >
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
          <button
            onClick={toggleMute}
            className="btn btn-secondary rounded-circle shadow-sm p-2"
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
        <button
          onClick={handleModalShow}
          className="btn btn-outline-dark rounded-circle shadow-sm p-2"
          title="Fullscreen"
        >
          <FaExpand />
        </button>
        <ShareButton url={window.location.href} title={data.name} />
      </div>
  
      {/* Fullscreen Modal */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        size="lg"
        centered
        backdrop={false}
        className="custom-modal"
      >
        <Modal.Header closeButton className="bg-purple-600 text-white">
          <Modal.Title className="text-white">{data.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <FadeCarousel isPaused={isPaused} isMuted={isMuted} onToggleMute={toggleMute}>
            {data.content[activeTab].content.map((item, index) => (
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
    </div>
  );  
};



export default Highlights;
