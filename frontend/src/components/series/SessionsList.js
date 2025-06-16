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
import MusicPlayer from './MusicPlayer'; // Adjust the import path as needed

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
                          
                          {/* Download Button */}
                          {(session.audio?.link || session.video?.link) && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="d-flex align-items-center justify-content-center gap-2"
                            >
                              <Download size={16} />
                              Download
                            </Button>
                          )}
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

      {/* Music Player Modal */}
      <Modal 
        show={showMusicPlayer} 
        onHide={handleCloseMusicPlayer} 
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="d-flex align-items-center">
            <Headphones size={24} className="me-2" style={{ color: '#6f42c1' }} />
            Audio Player
          </Modal.Title>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleCloseMusicPlayer}
            className="ms-auto"
          >
            <X size={18} />
          </Button>
        </Modal.Header>
        <Modal.Body className="p-0">
          {showMusicPlayer && seriesId && (
            <MusicPlayer seriesId={seriesId} />
          )}
        </Modal.Body>
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
      `}</style>
    </>
  );
};

export default SessionsList;