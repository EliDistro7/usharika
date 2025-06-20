'use client';

import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, Dropdown, Modal } from 'react-bootstrap';
import { 
  Calendar, 
  Clock, 
  Users, 
  Headphones, 
  Edit3, 
  Plus, 
  MoreVertical,
  Download,
  Video,
  BookOpen,
  Lock,
  CheckCircle,
  X
} from 'lucide-react';
import MusicPlayer from './audio-player/index'; // Adjust the import path as needed


const SessionsList = ({ 
  sessions, 
  isCreator, 
  user, 
  playingAudio, 
  onAddSession, 
  onPlayAudio,
  totalSessions,
  seriesId // Add seriesId prop to pass to MusicPlayer
}) => {
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSessionStatus = (sessionDate) => {
    const today = new Date();
    const session = new Date(sessionDate);
    
    if (session < today) return 'completed';
    if (session.toDateString() === today.toDateString()) return 'today';
    return 'upcoming';
  };

  const handleOpenMusicPlayer = () => {
    setShowMusicPlayer(true);
  };

  const handleCloseMusicPlayer = () => {
    setShowMusicPlayer(false);
  };

  // Check if there are any audio sessions available
  const hasAudioSessions = sessions && sessions.some(session => 
    session.audio && session.audio.link && (session.audio.isFree || user)
  );

  return (
    <>
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header 
          className="bg-white border-0 py-3"
          style={{ borderBottom: '2px solid #6f42c1' }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 d-flex align-items-center">
              <Calendar size={24} className="me-2" style={{ color: '#6f42c1' }} />
              Sessions ({totalSessions})
            </h4>
            <div className="d-flex gap-2">
              {/* Music Player Button */}
              {hasAudioSessions && (
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={handleOpenMusicPlayer}
                >
                  <Headphones size={16} className="me-1" />
                  Audio Player
                </Button>
              )}
              {isCreator && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={onAddSession}
                >
                  <Plus size={16} className="me-1" />
                  Add Session
                </Button>
              )}
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {sessions && sessions.length > 0 ? (
            sessions
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((session, index) => {
                const status = getSessionStatus(session.date);
                return (
                  <div
                    key={session._id}
                    className={`p-4 border-bottom ${index === 0 ? '' : 'border-top-0'}`}
                    style={{
                      backgroundColor: status === 'today' ? '#f8f9ff' : 'white',
                      borderLeft: status === 'completed' ? '4px solid #28a745' : 
                                 status === 'today' ? '4px solid #6f42c1' : '4px solid #e9ecef'
                    }}
                  >
                    <Row className="align-items-center">
                      <Col md={8}>
                        <div className="d-flex align-items-start justify-content-between">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <h5 className="mb-0 me-3">{session.title}</h5>
                              {status === 'completed' && (
                                <CheckCircle size={18} className="text-success" />
                              )}
                              {status === 'today' && (
                                <Badge bg="primary" className="pulse">Today</Badge>
                              )}
                              {status === 'upcoming' && (
                                <Badge bg="secondary">Upcoming</Badge>
                              )}
                            </div>
                            
                            <div className="text-muted mb-2 d-flex align-items-center">
                              <Clock size={16} className="me-2" />
                              {formatDate(session.date)}
                            </div>
                            
                            <p className="text-muted mb-3">{session.content}</p>
                            
                            {session.attendanceCount > 0 && (
                              <div className="d-flex align-items-center text-muted">
                                <Users size={16} className="me-2" />
                                <span>{session.attendanceCount} attended</span>
                              </div>
                            )}
                          </div>
                          
                          {isCreator && (
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="link"
                                className="text-muted p-1"
                                style={{ border: 'none', background: 'none' }}
                              >
                                <MoreVertical size={16} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item>
                                  <Edit3 size={14} className="me-2" />
                                  Edit Session
                                </Dropdown.Item>
                                <Dropdown.Item className="text-danger">
                                  Delete Session
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          )}
                        </div>
                      </Col>
                      
                      <Col md={4}>
                        <div className="d-flex flex-column gap-2">
                          {/* Audio Controls */}
                          {session.audio && session.audio.link && (
                            <Button
                              variant={session.audio.isFree ? "outline-success" : "outline-warning"}
                              size="sm"
                              className="d-flex align-items-center justify-content-center gap-2"
                              onClick={handleOpenMusicPlayer}
                              disabled={!session.audio.isFree && !user}
                            >
                              <Headphones size={16} />
                              Play Audio
                              {!session.audio.isFree && <Lock size={12} />}
                            </Button>
                          )}
                          
                          {/* Video Controls */}
                          {session.video && session.video.link && (
                            <Button
                              variant={session.video.isFree ? "outline-info" : "outline-warning"}
                              size="sm"
                              className="d-flex align-items-center justify-content-center gap-2"
                              disabled={!session.video.isFree && !user}
                            >
                              <Video size={16} />
                              Video
                              {!session.video.isFree && <Lock size={12} />}
                            </Button>
                          )}
                          
                          {/* Download Button     {(session.audio?.link || session.video?.link) && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="d-flex align-items-center justify-content-center gap-2"
                            >
                              <Download size={16} />
                              Download
                            </Button>
                          )}*/}
                      
                        </div>
                      </Col>
                    </Row>
                  </div>
                );
              })
          ) : (
            <div className="text-center py-5">
              <BookOpen size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No sessions yet</h5>
              <p className="text-muted">Sessions will appear here as they are added.</p>
              {isCreator && (
                <Button
                  variant="primary"
                  onClick={onAddSession}
                  className="mt-3"
                >
                  <Plus size={16} className="me-2" />
                  Add First Session
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Full-Screen Music Player Modal */}
      <Modal 
        show={showMusicPlayer} 
        onHide={handleCloseMusicPlayer} 
        fullscreen={true}
        backdrop="static"
        keyboard={false}
        className="music-player-modal"
      >
        <div className="music-player-fullscreen">
          <Modal.Header className="music-player-header border-0 pb-0">
            <Modal.Title className="d-flex align-items-center music-player-title">
              <Headphones size={28} className="me-3 headphones-icon" />
              KKKT YOMBO Series Player
            </Modal.Title>
            <Button
              variant="outline-light"
              size="lg"
              onClick={handleCloseMusicPlayer}
              className="music-player-close-btn"
            >
              <X size={24} />
            </Button>
          </Modal.Header>
          <Modal.Body className="music-player-body p-0">
            {showMusicPlayer && seriesId && (
              <MusicPlayer seriesId={seriesId} />
            )}
          </Modal.Body>
        </div>
      </Modal>

      <style jsx>{`
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .card {
          transition: transform 0.2s ease-in-out;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .btn {
          transition: all 0.3s ease;
        }

        /* Music Player Modal Styles */
        .music-player-modal .modal-content {
          background: transparent !important;
          border: none !important;
          border-radius: 0 !important;
        }

        .music-player-fullscreen {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0d26 50%, #0a0a0a 100%);
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .music-player-fullscreen::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(196, 181, 253, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .music-player-header {
          background: linear-gradient(90deg, #1a0d26 0%, #2d1b3d 100%) !important;
          border-bottom: 2px solid #2d1b3d !important;
          padding: 1.5rem 2rem !important;
          position: relative;
          z-index: 10;
        }

        .music-player-title {
          color: #f3f4f6 !important;
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .headphones-icon {
          color: #8b5cf6 !important;
          filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.4));
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from {
            filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.4));
          }
          to {
            filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.6));
          }
        }

        .music-player-close-btn {
          background: rgba(45, 27, 61, 0.8) !important;
          border: 1px solid #2d1b3d !important;
          color: #f3f4f6 !important;
          border-radius: 50% !important;
          width: 50px !important;
          height: 50px !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.3s ease !important;
          backdrop-filter: blur(10px);
        }

        .music-player-close-btn:hover {
          background: rgba(139, 92, 246, 0.2) !important;
          border-color: #8b5cf6 !important;
          color: #8b5cf6 !important;
          transform: scale(1.1) !important;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3) !important;
        }

        .music-player-close-btn:focus {
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3) !important;
        }

        .music-player-body {
          background: transparent !important;
          height: calc(100vh - 100px) !important;
          overflow-y: auto !important;
          position: relative;
          z-index: 5;
        }

        /* Custom scrollbar for music player */
        .music-player-body::-webkit-scrollbar {
          width: 8px;
        }

        .music-player-body::-webkit-scrollbar-track {
          background: rgba(45, 27, 61, 0.3);
        }

        .music-player-body::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8b5cf6, #a855f7);
          border-radius: 4px;
        }

        .music-player-body::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #a855f7, #c4b5fd);
        }

        /* Backdrop blur effect */
        .music-player-modal .modal-backdrop {
          background-color: rgba(10, 10, 10, 0.95) !important;
          backdrop-filter: blur(10px);
        }
      `}</style>
    </>
  );
};

export default SessionsList;