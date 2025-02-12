'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getAudioBySeries } from '@/actions/series'; // adjust import path as needed
import { Container, Row, Col, Card, Button, ListGroup, Image, Collapse } from 'react-bootstrap';

const MusicPlayer = ({ seriesId }) => {
  console.log('series Id', seriesId);
  const [audioSessions, setAudioSessions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // State for custom progress bar
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // State to track if the audio is currently playing
  const [isPlaying, setIsPlaying] = useState(false);
  // Flag to determine if a track change was triggered by a natural end event
  const [autoPlayNext, setAutoPlayNext] = useState(false);
  // State to control playlist view toggle
  const [showPlaylist, setShowPlaylist] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Fetch audio sessions for the given seriesId on mount or when seriesId changes
  useEffect(() => {
    if (!seriesId) return;
    const fetchAudioSessions = async () => {
      setLoading(true);
      try {
        const sessions = await getAudioBySeries(seriesId);
        console.log('audio', sessions);
        if (sessions && sessions.length > 0) {
          setAudioSessions(sessions);
          setCurrentIndex(0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioSessions();
  }, [seriesId]);

  // Determine the current session from the list based on currentIndex
  const currentSession = audioSessions[currentIndex];

  // When the audio ends naturally, move to the next session (if available) and mark autoPlayNext true
  const handleAudioEnd = () => {
    if (currentIndex < audioSessions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAutoPlayNext(true);
      // Reset progress states for new audio
      setCurrentTime(0);
      setDuration(0);
    } else {
      // Optionally, reset the player when reaching the end of the playlist
      setIsPlaying(false);
    }
  };

  // When the currentSession changes and autoPlayNext is true, start playing automatically
  useEffect(() => {
    if (autoPlayNext && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Auto-play failed:', err);
        });
      setAutoPlayNext(false);
    }
  }, [currentSession, autoPlayNext]);

  // Toggle play/pause behavior
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Play failed:', err);
        });
    }
  };

  // Handlers for Next/Previous buttons (manual navigation does not auto-play)
  const handleNext = () => {
    if (currentIndex < audioSessions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  // When a user selects a track from the playlist, load and auto-play it immediately
  const handleSelectTrack = (index) => {
    setCurrentIndex(index);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Play failed:', err);
        });
    }
    // Optionally, hide the playlist after selection
    setShowPlaylist(false);
  };

  // Update current time and duration for custom progress bar
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Allow user to seek by clicking on the progress bar
  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left; // X position relative to the progress bar
    const newTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Calculate progress percentage
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  // Format time helper function
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}`;
  };

  if (loading) {
    return (
      <Container className="my-5">
        <p>Loading audio sessions...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <p className="text-danger">Error: {error}</p>
      </Container>
    );
  }

  if (!currentSession) {
    return (
      <Container className="my-5">
        <p>No audio sessions available for this series.</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="mb-4 shadow-sm border-0" style={{ backgroundColor: '#1a1a1a', color: '#ffd700' }}>
            <Card.Body className="p-4">
              {/* Toggle Playlist Button */}
              <div className="d-flex justify-content-end mb-3">
                <Button
                  style={{ backgroundColor: '#ffd700', color: '#1a1a1a', border: 'none' }}
                  onClick={() => setShowPlaylist(!showPlaylist)}
                >
                  {showPlaylist ? 'Ficha Playlist' : 'Onyesha Playlist'}
                </Button>
              </div>
  
              {/* Toggleable Playlist */}
              <Collapse in={showPlaylist}>
                <div>
                  <Card className="mb-4">
                    <Card.Header style={{ backgroundColor: '#6a0dad', color: '#fff' }}>
                      <h5 className="mb-0">Playlist</h5>
                    </Card.Header>
                    <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {audioSessions.map((session, index) => (
                        <ListGroup.Item
                          key={session._id}
                          action
                          active={index === currentIndex}
                          onClick={() => handleSelectTrack(index)}
                          style={{
                            backgroundColor: index === currentIndex ? '#ffd700' : '#333',
                            color: index === currentIndex ? '#1a1a1a' : '#ffd700',
                            border: 'none',
                          }}
                          className="d-flex align-items-center"
                        >
                          <Image
                            src={'https://via.placeholder.com/50'}
                            alt="Track Art"
                            roundedCircle
                            className="me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                          <div>
                            <strong>{session.title}</strong>
                            <br />
                            <small style={{ color: '#bfbfbf' }}>{formatTime(session.duration || 0)}</small>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                </div>
              </Collapse>
  
              {/* Main Player Section */}
              <div className="d-flex align-items-center mb-4">
                <Image
                  src={'/img/lutherRose.jpg'}
                  alt="Album Art"
                  roundedCircle
                  className="me-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <div>
                  <h2 className="mb-0 fw-bold" style={{ color: '#ffd700' }}>{currentSession.title}</h2>
                  <p className="mb-0" style={{ color: '#bfbfbf' }}>{currentSession.content}</p>
                </div>
              </div>
  
              {/* Audio element without native controls */}
              <audio
                ref={audioRef}
                src={currentSession.audio.link}
                className="w-100 mb-3"
                onEnded={handleAudioEnd}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
  
              {/* Custom audio control buttons */}
              <div className="d-flex justify-content-center mb-3">
                <Button
                  style={{ backgroundColor: '#6a0dad', color: '#fff', border: 'none' }}
                  className="mx-2"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <i className="fas fa-backward"></i>
                </Button>
                <Button
                  style={{ backgroundColor: '#ffd700', color: '#1a1a1a', border: 'none' }}
                  className="mx-2"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
                </Button>
                <Button
                  style={{ backgroundColor: '#6a0dad', color: '#fff', border: 'none' }}
                  className="mx-2"
                  onClick={handleNext}
                  disabled={currentIndex >= audioSessions.length - 1}
                >
                  <i className="fas fa-forward"></i>
                </Button>
              </div>
  
              {/* Custom progress bar */}
              <div className="mt-3" ref={progressBarRef} onClick={handleProgressBarClick} style={{ cursor: 'pointer' }}>
                <div className="progress" style={{ height: '5px', backgroundColor: '#333' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%`, backgroundColor: '#ffd700' }}
                    aria-valuenow={progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span style={{ color: '#bfbfbf' }}>{formatTime(currentTime)}</span>
                  <span style={{ color: '#bfbfbf' }}>{formatTime(duration)}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  
};

export default MusicPlayer;
