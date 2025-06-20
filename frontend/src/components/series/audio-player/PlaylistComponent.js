'use client';

import React, { useState, useEffect } from 'react';
import { Collapse, Spinner } from 'react-bootstrap';

const PlaylistComponent = ({ 
  audioSessions, 
  currentIndex, 
  showPlaylist, 
  onSelectTrack,
  formatTime 
}) => {
  const [durations, setDurations] = useState({});
  const [loadingDurations, setLoadingDurations] = useState({});

  // Function to load audio duration
  const loadAudioDuration = (audioUrl, sessionId) => {
    if (durations[sessionId] || loadingDurations[sessionId]) return;

    setLoadingDurations(prev => ({ ...prev, [sessionId]: true }));

    const audio = new Audio(audioUrl);
    
    audio.addEventListener('loadedmetadata', () => {
      setDurations(prev => ({ ...prev, [sessionId]: audio.duration }));
      setLoadingDurations(prev => ({ ...prev, [sessionId]: false }));
    });

    audio.addEventListener('error', () => {
      setLoadingDurations(prev => ({ ...prev, [sessionId]: false }));
    });
  };

  // Load durations when component mounts or audioSessions change
  useEffect(() => {
    audioSessions.forEach(session => {
      if (session.audio?.link && !durations[session._id]) {
        loadAudioDuration(session.audio.link, session._id);
      }
    });
  }, [audioSessions]);

  const getDuration = (session) => {
    if (loadingDurations[session._id]) {
      return <Spinner size="sm" style={{ color: '#a855f7' }} />;
    }
    
    const duration = durations[session._id] || session.duration;
    return duration ? formatTime(duration) : '0:00';
  };

  const playlistCardStyle = {
    background: '#0a0a0a',
    border: '1px solid #2d1b3d',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
  };

  const playlistHeaderStyle = {
    background: '#1a0d26',
    borderBottom: '2px solid #8b5cf6',
    padding: '1rem 1.25rem'
  };

  const playlistBodyStyle = {
    maxHeight: '400px',
    overflowY: 'auto',
    background: '#0a0a0a',
    scrollbarWidth: 'thin',
    scrollbarColor: '#8b5cf6 #2d1b3d'
  };

  const playlistItemStyle = {
    background: 'transparent',
    border: 'none',
    padding: '0.75rem 1.25rem',
    color: '#e5e7eb',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    borderBottom: '1px solid #2d1b3d',
    listStyle: 'none',
    display: 'block'
  };

  const activeItemStyle = {
    ...playlistItemStyle,
    background: '#1e1b4b',
    color: '#a855f7',
    borderLeft: '3px solid #8b5cf6'
  };

  const hoverItemStyle = {
    background: '#1e1b4b',
    transform: 'translateX(4px)',
    borderLeft: '3px solid #a855f7'
  };

  return (
    <Collapse in={showPlaylist}>
      <div>
        <div style={playlistCardStyle}>
          <div style={playlistHeaderStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ color: '#8b5cf6', marginRight: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
                </svg>
              </div>
              <h5 style={{ 
                margin: 0, 
                fontWeight: 600, 
                letterSpacing: '0.5px', 
                color: '#8b5cf6' 
              }}>
                Playlist
              </h5>
              <span style={{ 
                marginLeft: 'auto',
                fontSize: '0.85rem',
                color: '#a855f7',
                fontWeight: 500,
                opacity: 0.8
              }}>
                {audioSessions.length} tracks
              </span>
            </div>
          </div>
          
          <div style={playlistBodyStyle}>
            <ul style={{ 
              margin: 0, 
              padding: 0, 
              background: 'transparent' 
            }}>
              {audioSessions.map((session, index) => {
                const [isHovered, setIsHovered] = useState(false);
                const isActive = index === currentIndex;
                
                const itemStyle = isActive ? activeItemStyle : 
                  isHovered ? { ...playlistItemStyle, ...hoverItemStyle } : playlistItemStyle;

                return (
                  <li
                    key={session._id}
                    style={itemStyle}
                    onClick={() => onSelectTrack(index)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        marginRight: '1rem'
                      }}>
                        {isActive && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(168, 85, 247, 0.2)',
                            borderRadius: '50%',
                            padding: '8px',
                            border: '1px solid #8b5cf6'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                              <div style={{
                                width: '2px',
                                height: '6px',
                                background: '#8b5cf6',
                                borderRadius: '1px',
                                animation: 'bounce 1.4s ease-in-out infinite both',
                                animationDelay: '-0.32s'
                              }}></div>
                              <div style={{
                                width: '2px',
                                height: '8px',
                                background: '#8b5cf6',
                                borderRadius: '1px',
                                animation: 'bounce 1.4s ease-in-out infinite both',
                                animationDelay: '-0.16s'
                              }}></div>
                              <div style={{
                                width: '2px',
                                height: '6px',
                                background: '#8b5cf6',
                                borderRadius: '1px',
                                animation: 'bounce 1.4s ease-in-out infinite both'
                              }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          marginBottom: '0.25rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: isActive ? '#8b5cf6' : '#f3f4f6'
                        }}>
                          {session.title}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '0.8rem',
                          color: isActive ? '#c4b5fd' : '#9ca3af',
                          gap: '0.5rem'
                        }}>
                          {session.artist && (
                            <>
                              <span style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '150px'
                              }}>
                                {session.artist}
                              </span>
                              <span style={{ opacity: 0.6 }}>•</span>
                            </>
                          )}
                          <span style={{
                            fontVariantNumeric: 'tabular-nums',
                            fontWeight: 500,
                            color: '#8b5cf6'
                          }}>
                            {getDuration(session)}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{
                        color: isActive ? '#8b5cf6' : '#6b7280',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums',
                        minWidth: '24px',
                        textAlign: 'right'
                      }}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scaleY(0.5); }
            40% { transform: scaleY(1); }
          }

          div::-webkit-scrollbar {
            width: 6px;
          }

          div::-webkit-scrollbar-track {
            background: #2d1b3d;
          }

          div::-webkit-scrollbar-thumb {
            background: #8b5cf6;
            border-radius: 3px;
          }
        `}</style>
      </div>
    </Collapse>
  );
};

export default PlaylistComponent;