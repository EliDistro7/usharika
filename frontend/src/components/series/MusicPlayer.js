'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getAudioBySeries } from '@/actions/series'; // adjust import path as needed
import { Play, Pause, SkipBack, SkipForward, List, X } from 'lucide-react';

const MusicPlayer = ({ seriesId }) => {
  // console.log('series Id', seriesId);
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
      <div className="container mx-auto px-4 py-12">
        <p className="text-text-primary">Loading audio sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-error-500">Error: {error}</p>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-text-primary">No audio sessions available for this series.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex justify-center">
        <div className="w-full md:w-5/6">
          <div className="bg-gray-900 text-yellow-400 rounded-2xl shadow-strong border-0 mb-6">
            <div className="p-6">
              {/* Toggle Playlist Button */}
              <div className="flex justify-end mb-4">
                <button
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors duration-200 flex items-center gap-2"
                  onClick={() => setShowPlaylist(!showPlaylist)}
                >
                  {showPlaylist ? (
                    <>
                      <X className="w-4 h-4" />
                      Ficha Playlist
                    </>
                  ) : (
                    <>
                      <List className="w-4 h-4" />
                      Onyesha Playlist
                    </>
                  )}
                </button>
              </div>
  
              {/* Toggleable Playlist */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showPlaylist ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="mb-6">
                  <div className="bg-white rounded-lg shadow-medium overflow-hidden">
                    <div className="bg-purple-600 text-white px-4 py-3">
                      <h5 className="text-lg font-semibold mb-0">Playlist</h5>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {audioSessions.map((session, index) => (
                        <div
                          key={session._id}
                          className={`flex items-center p-4 cursor-pointer transition-colors duration-200 border-b border-gray-200 last:border-b-0 ${
                            index === currentIndex 
                              ? 'bg-yellow-400 text-gray-900' 
                              : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                          }`}
                          onClick={() => handleSelectTrack(index)}
                        >
                          <img
                            src="/img/lutherRose.jpg"
                            alt="Track Art"
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div className="flex-1">
                            <div className="font-semibold">{session.title}</div>
                            <div className={`text-sm ${index === currentIndex ? 'text-gray-600' : 'text-gray-400'}`}>
                              {formatTime(session.duration || 0)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Main Player Section */}
              <div className="flex items-center mb-6">
                <img
                  src="/img/lutherRose.jpg"
                  alt="Album Art"
                  className="w-20 h-20 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-1">{currentSession.title}</h2>
                  <p className="text-gray-400 mb-0">{currentSession.content}</p>
                </div>
              </div>
  
              {/* Audio element without native controls */}
              <audio
                ref={audioRef}
                src={currentSession.audio.link}
                className="w-full mb-4 hidden"
                onEnded={handleAudioEnd}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
  
              {/* Custom audio control buttons */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <button
                  className={`p-3 rounded-full transition-all duration-200 ${
                    currentIndex === 0 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                  }`}
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  className="bg-yellow-400 text-gray-900 p-4 rounded-full hover:bg-yellow-500 hover:scale-105 transition-all duration-200 shadow-yellow"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  className={`p-3 rounded-full transition-all duration-200 ${
                    currentIndex >= audioSessions.length - 1 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                  }`}
                  onClick={handleNext}
                  disabled={currentIndex >= audioSessions.length - 1}
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
  
              {/* Custom progress bar */}
              <div className="mt-4">
                <div 
                  ref={progressBarRef} 
                  onClick={handleProgressBarClick} 
                  className="w-full h-2 bg-gray-700 rounded-full cursor-pointer mb-3 relative overflow-hidden"
                >
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-150 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;