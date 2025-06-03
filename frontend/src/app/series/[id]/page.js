'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Badge, 
  Button, 
  Spinner, 
  Modal, 
  Form,
  Dropdown,
  ProgressBar 
} from 'react-bootstrap';
import { 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Video, 
  Headphones, 
  Edit3, 
  Plus, 
  MoreVertical,
  Download,
  Share2,
  BookOpen,
  User,
  Crown,
  Lock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getUser } from '@/hooks/useUser';
import Link from 'next/link';

const SeriesPage = () => {
  const params = useParams();
  const router = useRouter();
  const [series, setSeries] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showEditSeries, setShowEditSeries] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [newSession, setNewSession] = useState({
    title: '',
    content: '',
    date: '',
    audio: { link: '', isFree: true },
    video: { link: '', isFree: true }
  });

  useEffect(() => {
    fetchSeriesData();
    fetchUser();
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchSeriesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/series/${params.id}`);
      console.log('response', response)
      if (response.ok) {
        const data = await response.json();
        setSeries(data);
      } else {
        toast.error('Failed to load series');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching series:', error);
      toast.error('Error loading series');
    } finally {
      setLoading(false);
    }
  };

  const isCreator = user && series && user.username === series.author;
  const completedSessions = series?.sessions?.filter(session => 
    new Date(session.date) <= new Date()
  ).length || 0;
  const totalSessions = series?.sessions?.length || 0;
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/series/${params.id}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession)
      });

      if (response.ok) {
        toast.success('Session added successfully!');
        setShowAddSession(false);
        setNewSession({
          title: '', content: '', date: '',
          audio: { link: '', isFree: true },
          video: { link: '', isFree: true }
        });
        fetchSeriesData();
      } else {
        toast.error('Failed to add session');
      }
    } catch (error) {
      console.error('Error adding session:', error);
      toast.error('Error adding session');
    }
  };

  const handlePlayAudio = (sessionId, audioLink) => {
    if (playingAudio === sessionId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(sessionId);
      // Implement audio player logic here
    }
  };

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

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" className="mb-3" style={{ color: '#6f42c1' }} />
          <p className="text-muted">Loading series...</p>
        </div>
      </Container>
    );
  }

  if (!series) {
    return (
      <Container className="text-center py-5">
        <h3>Series not found</h3>
        <Button variant="primary" onClick={() => router.push('/series')}>
          Back to Series
        </Button>
      </Container>
    );
  }

  return (
    <>
      <div 
        className="hero-section py-5 mb-4"
        style={{
          background: 'linear-gradient(135deg, #6f42c1 0%, #495057 50%, #b8860b 100%)',
          color: 'white'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <div className="d-flex align-items-center mb-3">
                <BookOpen size={32} className="me-3" />
                <div>
                  <Badge 
                    bg="light" 
                    text="dark" 
                    className="mb-2"
                    style={{ fontSize: '0.8rem' }}
                  >
                    {series.group}
                  </Badge>
                  <h1 className="display-4 fw-bold mb-0 text-white">{series.name}</h1>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3 flex-wrap gap-3">
                <div className="d-flex align-items-center">
                  <User size={18} className="me-2" />
                  <span>by {series.author}</span>
                  {isCreator && <Crown size={16} className="ms-2 text-warning" />}
                </div>
                <div className="d-flex align-items-center">
                  <Calendar size={18} className="me-2" />
                  <span>{formatDate(series.startDate)} - {formatDate(series.endDate)}</span>
                </div>
                <div className="d-flex align-items-center">
                  <Users size={18} className="me-2" />
                  <span>{series.totalAttendance} total attendance</span>
                </div>
              </div>
              
              <p className="lead mb-4">{series.description}</p>
              
              <div className="progress-section mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Progress</span>
                  <span>{completedSessions}/{totalSessions} sessions completed</span>
                </div>
                <ProgressBar 
                  now={progressPercentage} 
                  style={{ height: '8px' }}
                  className="bg-light"
                />
              </div>
            </Col>
            
            <Col lg={4} className="text-lg-end">
              <div className="d-flex flex-column gap-2">
                {isCreator && (
                  <>
                    <Button
                      variant="light"
                      size="lg"
                      onClick={() => setShowAddSession(true)}
                      className="d-flex align-items-center justify-content-center gap-2"
                    >
                      <Plus size={20} />
                      Add Session
                    </Button>
                    <Button
                      variant="outline-light"
                      onClick={() => setShowEditSeries(true)}
                      className="d-flex align-items-center justify-content-center gap-2"
                    >
                      <Edit3 size={18} />
                      Edit Series
                    </Button>
                  </>
                )}
                <Button
                  variant="outline-light"
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  <Share2 size={18} />
                  Share Series
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          <Col lg={8}>
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
                  {isCreator && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setShowAddSession(true)}
                    >
                      <Plus size={16} className="me-1" />
                      Add Session
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {series.sessions && series.sessions.length > 0 ? (
                  series.sessions
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
                                    onClick={() => handlePlayAudio(session._id, session.audio.link)}
                                    disabled={!session.audio.isFree && !user}
                                  >
                                    <Headphones size={16} />
                                    {playingAudio === session._id ? 'Pause' : 'Audio'}
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
                        onClick={() => setShowAddSession(true)}
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
          </Col>
          
          {/* Sidebar */}
          <Col lg={4}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header 
                className="bg-light border-0"
                style={{ borderBottom: '2px solid #b8860b' }}
              >
                <h5 className="mb-0">Series Stats</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Total Sessions</span>
                  <Badge bg="primary" pill>{totalSessions}</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Completed</span>
                  <Badge bg="success" pill>{completedSessions}</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Remaining</span>
                  <Badge bg="secondary" pill>{totalSessions - completedSessions}</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Total Attendance</span>
                  <Badge bg="info" pill>{series.totalAttendance}</Badge>
                </div>
              </Card.Body>
            </Card>
            
            {/* Quick Actions */}
            <Card className="shadow-sm border-0">
              <Card.Header 
                className="bg-light border-0"
                style={{ borderBottom: '2px solid #6f42c1' }}
              >
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" size="sm">
                    <Share2 size={16} className="me-2" />
                    Share Series
                  </Button>
                  <Button variant="outline-success" size="sm">
                    <Download size={16} className="me-2" />
                    Download All
                  </Button>
                  {user && (
                    <Button variant="outline-info" size="sm">
                      <BookOpen size={16} className="me-2" />
                      Mark as Favorite
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add Session Modal */}
      <Modal show={showAddSession} onHide={() => setShowAddSession(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Session</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSession}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Session Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newSession.title}
                    onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Content/Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newSession.content}
                onChange={(e) => setNewSession({...newSession, content: e.target.value})}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Audio Link</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://..."
                    value={newSession.audio.link}
                    onChange={(e) => setNewSession({
                      ...newSession, 
                      audio: {...newSession.audio, link: e.target.value}
                    })}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Free Audio"
                    checked={newSession.audio.isFree}
                    onChange={(e) => setNewSession({
                      ...newSession,
                      audio: {...newSession.audio, isFree: e.target.checked}
                    })}
                    className="mt-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Video Link</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://..."
                    value={newSession.video.link}
                    onChange={(e) => setNewSession({
                      ...newSession,
                      video: {...newSession.video, link: e.target.value}
                    })}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Free Video"
                    checked={newSession.video.isFree}
                    onChange={(e) => setNewSession({
                      ...newSession,
                      video: {...newSession.video, isFree: e.target.checked}
                    })}
                    className="mt-2"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddSession(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Session
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        .hero-section {
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
          z-index: 1;
        }
        
        .hero-section > * {
          position: relative;
          z-index: 2;
        }
        
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
        
        .progress-bar {
          background: linear-gradient(90deg, #6f42c1, #b8860b);
        }
      `}</style>
    </>
  );
};

export default SeriesPage;