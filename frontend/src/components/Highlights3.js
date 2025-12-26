
import React, { useState, useRef } from "react";
import { ChevronDown, Play, Pause, Volume2, VolumeX, Maximize2, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";

// Minimalistic color scheme
const colors = {
  primary: "#000000",
  secondary: "#666666",
  accent: "#333333",
  surface: "#ffffff",
  border: "#e5e5e5",
  text: "#333333",
  textLight: "#888888",
  background: "#fafafa"
};

// Sample data structure
const sampleData = {
  name: "Summer Music Festival 2024",
  content: {
    day1: {
      groupName: "Day 1",
      content: [
        {
          description: "Festival gates open with incredible energy as thousands of music lovers gather for the opening ceremony",
          author: "Sarah Chen",
          videoUrl: null,
          imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=450&fit=crop",
          timestamp: "6:00 PM",
          location: "Main Gate"
        },
        {
          description: "Local indie band 'The Wavelengths' kicks off the festival with an electrifying performance on the acoustic stage",
          author: "Mike Rodriguez",
          videoUrl: null,
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=450&fit=crop",
          timestamp: "7:30 PM",
          location: "Acoustic Stage"
        },
        {
          description: "Headliner Taylor Swift takes the main stage with spectacular pyrotechnics and a crowd of 50,000 singing along",
          author: "Emma Thompson",
          videoUrl: null,
          imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=450&fit=crop",
          timestamp: "9:00 PM",
          location: "Main Stage"
        }
      ]
    },
    day2: {
      groupName: "Day 2",
      content: [
        {
          description: "Morning workshops begin with guitar masterclasses and songwriting sessions for aspiring musicians",
          author: "David Park",
          videoUrl: null,
          imageUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&h=450&fit=crop",
          timestamp: "10:00 AM",
          location: "Workshop Tent"
        },
        {
          description: "Food trucks arrive and festival-goers enjoy gourmet meals while live jazz plays in the background",
          author: "Lisa Wang",
          videoUrl: null,
          imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=450&fit=crop",
          timestamp: "12:00 PM",
          location: "Food Court"
        }
      ]
    }
  }
};

const Highlights = ({ data = sampleData }) => {
  const getActiveTab = () => {
    return Object.keys(data.content)[0];
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const videoRefs = useRef([]);

  const togglePause = () => setIsPaused(!isPaused);
  const toggleMute = () => setIsMuted(!isMuted);

  const currentContent = data.content[activeTab]?.content || [];
  const currentItem = currentContent[activeContentIndex];

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setActiveContentIndex(0);
    setDropdownOpen(false);
  };

  const handleContentSelect = (index) => {
    setActiveContentIndex(index);
  };

  const nextItem = () => {
    if (activeContentIndex < currentContent.length - 1) {
      setActiveContentIndex(activeContentIndex + 1);
    }
  };

  const prevItem = () => {
    if (activeContentIndex > 0) {
      setActiveContentIndex(activeContentIndex - 1);
    }
  };

  const customStyles = `
    .minimal-card {
      background: ${colors.surface};
      border: 1px solid ${colors.border};
      transition: all 0.2s ease;
    }
    
    .minimal-card:hover {
      border-color: ${colors.primary};
    }
    
    .timeline-item {
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    .timeline-item.active {
      background-color: ${colors.primary} !important;
      color: white !important;
    }
    
    .timeline-item:hover:not(.active) {
      background-color: ${colors.background};
    }
    
    .media-controls {
      background: rgba(0, 0, 0, 0.7);
    }
    
    .nav-arrow {
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      transition: all 0.2s ease;
    }
    
    .nav-arrow:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.8);
    }
    
    .nav-arrow:disabled {
      background: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.5);
    }
    
    .progress-bar {
      background: ${colors.primary};
      height: 2px;
    }
    
    .dropdown-minimal {
      background: ${colors.surface};
      border: 1px solid ${colors.border};
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .btn-minimal {
      background: ${colors.primary};
      color: white;
      border: none;
      transition: all 0.2s ease;
    }
    
    .btn-minimal:hover {
      background: ${colors.accent};
      color: white;
    }
    
    .btn-minimal:disabled {
      background: ${colors.border};
      color: ${colors.textLight};
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      
      <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
        {/* Minimal Header */}
        <div className="border-bottom" style={{ backgroundColor: colors.surface }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 style={{ color: colors.primary, margin: 0, fontSize: '2rem', fontWeight: '600' }}>
                {data.name}
              </h1>
              <span style={{ color: colors.textLight, fontSize: '0.9rem' }}>
                {currentContent.length} moments
              </span>
            </div>

            {/* Day Selector */}
            <div className="position-relative" style={{ width: 'fit-content' }}>
              <button
                className="d-flex align-items-center justify-content-between px-3 py-2"
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  minWidth: '200px',
                  color: colors.text
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{data.content[activeTab]?.groupName || activeTab}</span>
                <ChevronDown 
                  size={16} 
                  style={{ 
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} 
                />
              </button>

              {dropdownOpen && (
                <div 
                  className="dropdown-minimal position-absolute mt-1 rounded"
                  style={{ 
                    minWidth: '200px', 
                    zIndex: 1050,
                    left: 0,
                    top: '100%'
                  }}
                >
                  {Object.entries(data.content).map(([key, tab]) => (
                    <button
                      key={key}
                      className="w-100 text-start px-3 py-2 border-0"
                      style={{
                        backgroundColor: activeTab === key ? colors.primary : 'transparent',
                        color: activeTab === key ? 'white' : colors.text,
                      }}
                      onClick={() => handleTabChange(key)}
                    >
                      {tab.groupName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div className="row g-4">
            {/* Timeline Sidebar */}
            <div className="col-lg-4">
              <div className="minimal-card rounded p-3 position-sticky" style={{ top: '1rem' }}>
                <h3 style={{ color: colors.primary, fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Timeline
                </h3>
                
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {currentContent.map((item, index) => (
                    <div
                      key={index}
                      className={`timeline-item p-3 rounded mb-2 ${
                        index === activeContentIndex ? 'active' : ''
                      }`}
                      style={{
                        backgroundColor: index === activeContentIndex ? colors.primary : 'transparent',
                        color: index === activeContentIndex ? 'white' : colors.text,
                        border: `1px solid ${index === activeContentIndex ? colors.primary : 'transparent'}`
                      }}
                      onClick={() => handleContentSelect(index)}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: '24px',
                            height: '24px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: index === activeContentIndex ? 'rgba(255,255,255,0.2)' : colors.border,
                            color: index === activeContentIndex ? 'white' : colors.text
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-grow-1">
                          <p style={{ 
                            margin: '0 0 0.5rem 0',
                            fontSize: '0.9rem',
                            lineHeight: '1.4'
                          }}>
                            {item.description?.substring(0, 80)}...
                          </p>
                          <div className="d-flex gap-3">
                            {item.timestamp && (
                              <small className="d-flex align-items-center gap-1" style={{ 
                                color: index === activeContentIndex ? 'rgba(255,255,255,0.8)' : colors.textLight 
                              }}>
                                <Clock size={12} />
                                {item.timestamp}
                              </small>
                            )}
                            {item.location && (
                              <small className="d-flex align-items-center gap-1" style={{ 
                                color: index === activeContentIndex ? 'rgba(255,255,255,0.8)' : colors.textLight 
                              }}>
                                <MapPin size={12} />
                                {item.location}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-8">
              {currentItem && (
                <div className="minimal-card rounded overflow-hidden">
                  {/* Media Section */}
                  <div className="position-relative" style={{ aspectRatio: '16/9' }}>
                    {currentItem.videoUrl ? (
                      <video
                        ref={(el) => (videoRefs.current[activeContentIndex] = el)}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        src={currentItem.videoUrl}
                        muted={isMuted}
                        autoPlay={!isPaused}
                        loop
                      />
                    ) : (
                      <img
                        src={currentItem.imageUrl || 'https://via.placeholder.com/800x450/f5f5f5/888888?text=No+Image'}
                        alt="Content"
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    )}

                    {/* Media Controls */}
                    <div className="position-absolute top-0 end-0 m-3">
                      <div className="media-controls d-flex align-items-center gap-2 px-2 py-1 rounded">
                        {currentItem.videoUrl && (
                          <>
                            <button
                              className="btn btn-sm text-white p-1"
                              onClick={togglePause}
                              style={{ background: 'none', border: 'none' }}
                            >
                              {isPaused ? <Play size={14} /> : <Pause size={14} />}
                            </button>
                            <button
                              className="btn btn-sm text-white p-1"
                              onClick={toggleMute}
                              style={{ background: 'none', border: 'none' }}
                            >
                              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-sm text-white p-1"
                          onClick={() => setShowModal(true)}
                          style={{ background: 'none', border: 'none' }}
                        >
                          <Maximize2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="position-absolute bottom-0 start-0 end-0" style={{ height: '2px', background: 'rgba(0,0,0,0.2)' }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${((activeContentIndex + 1) / currentContent.length) * 100}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>

                    {/* Navigation Arrows */}
                    <button
                      className="nav-arrow position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle p-2"
                      disabled={activeContentIndex === 0}
                      onClick={prevItem}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      className="nav-arrow position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle p-2"
                      disabled={activeContentIndex === currentContent.length - 1}
                      onClick={nextItem}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Content Description */}
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span style={{ 
                        background: colors.primary, 
                        color: 'white', 
                        padding: '4px 12px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {activeContentIndex + 1} of {currentContent.length}
                      </span>
                      <div className="d-flex gap-3 text-muted" style={{ fontSize: '0.9rem' }}>
                        {currentItem.timestamp && (
                          <div className="d-flex align-items-center gap-1">
                            <Clock size={14} />
                            <span>{currentItem.timestamp}</span>
                          </div>
                        )}
                        {currentItem.location && (
                          <div className="d-flex align-items-center gap-1">
                            <MapPin size={14} />
                            <span>{currentItem.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p style={{ 
                      color: colors.text, 
                      fontSize: '1.1rem', 
                      lineHeight: '1.6', 
                      marginBottom: '1.5rem' 
                    }}>
                      {currentItem.description}
                    </p>
                    
                    <div style={{ 
                      background: colors.background, 
                      padding: '12px', 
                      borderRadius: '8px',
                      borderLeft: `3px solid ${colors.primary}`,
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ color: colors.textLight, fontSize: '0.9rem' }}>
                        <strong style={{ color: colors.text }}>{currentItem.author}</strong>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn-minimal px-4 py-2 rounded d-flex align-items-center gap-2"
                        disabled={activeContentIndex === 0}
                        onClick={prevItem}
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                      <button
                        className="btn-minimal px-4 py-2 rounded d-flex align-items-center gap-2"
                        disabled={activeContentIndex === currentContent.length - 1}
                        onClick={nextItem}
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fullscreen Modal */}
        {showModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.9)', 
              zIndex: 1060
            }}
            onClick={() => setShowModal(false)}
          >
            <div className="position-relative" style={{ maxWidth: '100%', maxHeight: '100%' }}>
              {currentItem?.videoUrl ? (
                <video
                  className="mw-100 mh-100"
                  src={currentItem.videoUrl}
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={currentItem?.imageUrl}
                  alt="Fullscreen content"
                  className="mw-100 mh-100"
                  style={{ objectFit: 'contain' }}
                />
              )}
              <button
                className="btn position-absolute text-white"
                style={{ 
                  top: '-2rem', 
                  right: '0',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem'
                }}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Highlights;