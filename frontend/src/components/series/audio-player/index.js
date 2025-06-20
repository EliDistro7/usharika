'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getAudioBySeries } from '@/actions/series'; // adjust import path as needed
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import PlaylistComponent from './PlaylistComponent';
import PlayerControls from './PlayerControls';

const MusicPlayer = ({ seriesId }) => {
  // State management
  const [audioSessions, setAudioSessions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(false);
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

  const currentSession = audioSessions[currentIndex];

  // Auto-play logic when track changes naturally
  const handleAudioEnd = () => {
    if (currentIndex < audioSessions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAutoPlayNext(true);
      setCurrentTime(0);
      setDuration(0);
    } else {
      setIsPlaying(false);
    }
  };

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

  // Player control handlers
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
    setShowPlaylist(false);
  };

  // Audio event handlers
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

  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Utility function
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Loading and error states
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

              {/* Playlist Component */}
              <PlaylistComponent
                audioSessions={audioSessions}
                currentIndex={currentIndex}
                showPlaylist={showPlaylist}
                onSelectTrack={handleSelectTrack}
                formatTime={formatTime}
              />

              {/* Main Player Section */}
              <div className="d-flex align-items-center mb-4 mt-4">
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

              {/* Audio element */}
              <audio
                ref={audioRef}
                src={currentSession.audio.link}
                className="w-100 mb-3"
                onEnded={handleAudioEnd}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />

              {/* Player Controls Component */}
              <PlayerControls
                isPlaying={isPlaying}
                currentIndex={currentIndex}
                totalTracks={audioSessions.length}
                onTogglePlayPause={togglePlayPause}
                onPrev={handlePrev}
                onNext={handleNext}
                currentTime={currentTime}
                duration={duration}
                onProgressBarClick={handleProgressBarClick}
                formatTime={formatTime}
                progressBarRef={progressBarRef}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MusicPlayer;