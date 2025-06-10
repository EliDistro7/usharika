import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Hand, MessageCircle, Heart } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';
import ListenerControls from './ListenerControls';
import AudioPlayer from './AudioPlayer';

// Updated Listener Interface Component with AudioStreamManager Integration
const ListenerInterface = ({ 
  roomId, 
  socket, 
  userName, 
  isReceivingAudio, 
  connectionQuality, 
  socketConnected,
  roomState,
  onRaiseHand,
  onSendReaction,
  onLeaveRoom,
  broadcastStatus,
  audioStreamManager,
  peerConnected
}) => {
  console.log('🔄 ListenerInterface render - Props received:', {
    roomId,
    userName,
    isReceivingAudio,
    socketConnected,
    roomState,
    hasAudioStreamManager: !!audioStreamManager,
    peerConnected,
    broadcastStatus
  });

  // Local state for UI management
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Derive broadcasting state from roomState
  const isBroadcasting = roomState?.isActive;
  const broadcasterName = roomState?.broadcaster?.userName || 'Unknown';
  
  console.log('📊 Listener state calculation:', {
    isBroadcasting,
    broadcasterName,
    isReceivingAudio,
    peerConnected,
    socketConnected
  });

  // SEPARATE effect for handling audio source updates (don't mix concerns)
  useEffect(() => {
    console.log('🎵 Audio stream effect triggered:', {
      hasAudioStreamManager: !!audioStreamManager,
      peerConnected
    });

    if (audioStreamManager && peerConnected) {
      console.log('🔧 Setting up audio stream listener');
      
      const handleAudioData = (audioData) => {
        console.log('📥 Received audio data:', {
          dataSize: audioData?.size || 'unknown',
          hasAudioRef: !!audioRef.current
        });
        
        if (audioRef.current && audioData) {
          const audioElement = audioRef.current;
          
          // Update audio source but don't control play/pause here
          if (typeof audioData === 'string' && audioData.startsWith('data:')) {
            audioElement.src = audioData;
          } else if (audioData instanceof Blob) {
            // Revoke old URL to prevent memory leaks
            if (audioElement.src && audioElement.src.startsWith('blob:')) {
              URL.revokeObjectURL(audioElement.src);
            }
            const audioUrl = URL.createObjectURL(audioData);
            audioElement.src = audioUrl;
          }
          
          // Load the new audio
          audioElement.load();
        }
      };

      if (audioStreamManager.onAudioReceived) {
        audioStreamManager.onAudioReceived = handleAudioData;
      }

      return () => {
        console.log('🧹 Cleaning up audio stream listener');
        if (audioStreamManager.onAudioReceived) {
          audioStreamManager.onAudioReceived = null;
        }
        
        // Clean up any blob URLs
        if (audioRef.current && audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
      };
    }
  }, [audioStreamManager, peerConnected]);

  // Handle volume and mute changes
  useEffect(() => {
    console.log('🔊 Volume/mute effect triggered:', { volume, isMuted });
    
    if (audioRef.current) {
      audioRef.current.volume = (volume / 100) * (isMuted ? 0 : 1);
      console.log('🔊 Audio volume set to:', audioRef.current.volume);
    }
  }, [volume, isMuted]);

  // RECOMMENDED FIX: Simplified audio control effect - only depends on user intent and broadcast status
  useEffect(() => {
    console.log('▶️ Audio control effect triggered:', {
      isPlaying,
      isBroadcasting,
      hasAudioRef: !!audioRef.current
    });
    
    if (!audioRef.current) return;
    
    const audioElement = audioRef.current;
    
    // Simple logic: Only control based on user intent and broadcast status
    if (isPlaying && isBroadcasting) {
      // User wants to listen AND there's an active broadcast
      console.log('▶️ Starting audio playback');
      
      if (audioElement.paused) {
        audioElement.play().catch(err => {
          console.error('❌ Error playing audio:', err);
          
          // Retry once after a delay (except for permission errors)
          if (err.name !== 'NotAllowedError') {
            setTimeout(() => {
              if (isPlaying && isBroadcasting && audioElement.paused) {
                audioElement.play().catch(console.error);
              }
            }, 1000);
          }
        });
      }
      
    } else {
      // User paused OR broadcast ended
      console.log('⏸️ Stopping audio - Reason:', {
        userPaused: !isPlaying,
        noBroadcast: !isBroadcasting
      });
      
      if (!audioElement.paused) {
        audioElement.pause();
      }
    }
  }, [isPlaying, isBroadcasting]); // Only depend on these two states

  // SEPARATE effect for handling audio data reception (don't mix concerns)
  useEffect(() => {
    console.log('🎵 Audio data reception state changed:', isReceivingAudio);
    
    // You can show UI indicators here, but don't control play/pause
    // The audio element will handle buffering/loading states automatically
    
  }, [isReceivingAudio]);

  // Add event listeners to better handle audio state
  useEffect(() => {
    if (audioRef.current) {
      const audioElement = audioRef.current;
      
      const handleCanPlay = () => {
        console.log('🎵 Audio can play - ready state:', audioElement.readyState);
      };
      
      const handleLoadStart = () => {
        console.log('🔄 Audio load started');
      };
      
      const handleError = (e) => {
        console.error('🚨 Audio error:', e);
      };
      
      audioElement.addEventListener('canplay', handleCanPlay);
      audioElement.addEventListener('loadstart', handleLoadStart);
      audioElement.addEventListener('error', handleError);
      
      return () => {
        audioElement.removeEventListener('canplay', handleCanPlay);
        audioElement.removeEventListener('loadstart', handleLoadStart);
        audioElement.removeEventListener('error', handleError);
      };
    }
  }, []);

  // Audio level visualization (if receiving audio)
  useEffect(() => {
    console.log('📈 Audio level effect triggered:', {
      isReceivingAudio,
      isPlaying,
      hasAudioRef: !!audioRef.current
    });

    let animationFrame;
    
    if (isReceivingAudio && isPlaying && audioRef.current) {
      console.log('🎤 Starting audio level monitoring for listener');
      
      const setupAudioAnalysis = () => {
        try {
          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          }
          
          if (!analyserRef.current && audioRef.current) {
            const source = audioContextRef.current.createMediaElementSource(audioRef.current);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            source.connect(analyserRef.current);
            source.connect(audioContextRef.current.destination);
          }

          const updateAudioLevel = () => {
            if (analyserRef.current) {
              const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
              analyserRef.current.getByteFrequencyData(dataArray);
              const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
              const level = (average / 255) * 100;
              setAudioLevel(level);
              animationFrame = requestAnimationFrame(updateAudioLevel);
            }
          };
          updateAudioLevel();
        } catch (error) {
          console.error('❌ Error setting up audio analysis:', error);
        }
      };

      setupAudioAnalysis();
    } else {
      console.log('🔇 Stopping audio level monitoring');
      setAudioLevel(0);
    }

    return () => {
      if (animationFrame) {
        console.log('🧹 Cancelling audio level animation frame');
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isReceivingAudio, isPlaying]);

  // Listen for broadcast status changes
  useEffect(() => {
    console.log('📡 Broadcast status effect triggered:', broadcastStatus);

    if (broadcastStatus) {
      if (broadcastStatus.type === 'started') {
        console.log('🟢 Broadcast started - listener ready');
      } else if (broadcastStatus.type === 'stopped') {
        console.log('🔴 Broadcast stopped - pausing playback');
        setIsPlaying(false);
      }
    }
  }, [broadcastStatus]);

  const togglePlay = () => {
    console.log('▶️ togglePlay() called:', {
      peerConnected,
      socketConnected,
      isBroadcasting,
      isReceivingAudio,
      currentPlaying: isPlaying
    });

    if (!peerConnected || !socketConnected) {
      alert('Not connected to broadcaster. Please wait...');
      return;
    }

    if (!isBroadcasting) {
      alert('No active broadcast to listen to.');
      return;
    }

    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    console.log('🔇 toggleMute() called:', {
      currentMuted: isMuted,
      newMuted: newMutedState
    });
    
    setIsMuted(newMutedState);

    // Notify audioStreamManager about mute state if available
    if (audioStreamManager && audioStreamManager.setMuteState) {
      console.log('📞 Notifying audioStreamManager of mute state');
      audioStreamManager.setMuteState(newMutedState);
    }
  };

  const handleRaiseHand = (raised = !hasRaisedHand) => {
    console.log('✋ handleRaiseHand() called:', {
      currentRaised: hasRaisedHand,
      newRaised: raised,
      hasCallback: !!onRaiseHand
    });

    setHasRaisedHand(raised);
    
    if (onRaiseHand) {
      console.log('📞 Calling onRaiseHand callback');
      onRaiseHand(raised);
    }
  };

  const handleSendReaction = (reaction) => {
    console.log('❤️ handleSendReaction() called:', {
      reaction,
      hasCallback: !!onSendReaction
    });

    if (onSendReaction) {
      console.log('📞 Calling onSendReaction callback');
      onSendReaction(reaction);
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      {/* Hidden audio element for playing the stream */}
      <audio
        ref={audioRef}
        autoPlay={false}
        controls={false}
        style={{ display: 'none' }}
        crossOrigin="anonymous"
      />

      {/* Header */}
      <div className="card mb-3 border-0 shadow-sm">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col">
              <h4 className="mb-1 text-purple">Church Service</h4>
              <small className="text-muted">Room: {roomId}</small>
              <br />
              <small className="text-muted d-block">
                Listener: {userName}
              </small>
              {isBroadcasting && (
                <small className="text-muted d-block">
                  Broadcaster: {broadcasterName}
                </small>
              )}
              <div className="mt-1">
                <span className={`badge me-1 ${peerConnected ? 'bg-success' : 'bg-warning'}`}>
                  {peerConnected ? 'P2P Connected' : 'Connecting...'}
                </span>
                {isBroadcasting && (
                  <span className="badge bg-danger me-1">LIVE</span>
                )}
                {isReceivingAudio && (
                  <span className="badge bg-info">Receiving Audio</span>
                )}
              </div>
            </div>
            <div className="col-auto">
              <ConnectionStatus 
                socketConnected={socketConnected}
                connectionQuality={connectionQuality}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Audio Player */}
      <div className="card flex-grow-1 border-0 shadow-sm">
        <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
          {/* Audio Visualizer */}
          {isReceivingAudio && isPlaying && (
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-center">
                <div 
                  className="bg-primary rounded-circle me-2" 
                  style={{ 
                    width: Math.max(8, audioLevel / 2) + 'px', 
                    height: Math.max(8, audioLevel / 2) + 'px',
                    transition: 'all 0.1s ease'
                  }}
                ></div>
                <div 
                  className="bg-primary rounded-circle me-2" 
                  style={{ 
                    width: Math.max(6, audioLevel / 3) + 'px', 
                    height: Math.max(6, audioLevel / 3) + 'px',
                    transition: 'all 0.1s ease'
                  }}
                ></div>
                <div 
                  className="bg-primary rounded-circle" 
                  style={{ 
                    width: Math.max(4, audioLevel / 4) + 'px', 
                    height: Math.max(4, audioLevel / 4) + 'px',
                    transition: 'all 0.1s ease'
                  }}
                ></div>
              </div>
            </div>
          )}

          <AudioPlayer
            isPlaying={isPlaying}
            isReceivingAudio={isReceivingAudio && peerConnected}
            socketConnected={peerConnected}
            onTogglePlay={togglePlay}
            isBroadcasting={isBroadcasting}
          />

          {/* Main Controls */}
          <ListenerControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            socketConnected={peerConnected}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onVolumeChange={setVolume}
            isReceivingAudio={isReceivingAudio}
            isBroadcasting={isBroadcasting}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="card mt-3 border-0 shadow-sm">
        <div className="card-body">
          <div className="row text-center">
            <div className="col">
              <button
                className={`btn btn-sm ${hasRaisedHand ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={() => handleRaiseHand()}
                disabled={!socketConnected || !peerConnected}
              >
                <Hand size={16} className="me-1" />
                {hasRaisedHand ? 'Lower Hand' : 'Raise Hand'}
              </button>
            </div>
            <div className="col">
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleSendReaction('amen')}
                disabled={!socketConnected || !peerConnected}
              >
                <Heart size={16} className="me-1" />
                Amen
              </button>
            </div>
            <div className="col">
              <button className="btn btn-outline-purple btn-sm">
                <MessageCircle size={16} className="me-1" />
                Chat
              </button>
            </div>
            <div className="col">
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={onLeaveRoom}
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="card mt-2 border-0 bg-light">
          <div className="card-body p-2">
            <small className="text-muted">
              <strong>Debug Info:</strong><br/>
              Listening: {isPlaying.toString()}<br/>
              Broadcasting: {isBroadcasting.toString()}<br/>
              ReceivingAudio: {isReceivingAudio.toString()}<br/>
              SocketConnected: {socketConnected.toString()}<br/>
              PeerConnected: {peerConnected.toString()}<br/>
              Broadcaster: {broadcasterName}<br/>
              CurrentUser: {userName}<br/>
              AudioLevel: {Math.round(audioLevel)}<br/>
              Volume: {volume}% {isMuted ? '(Muted)' : ''}<br/>
              HandRaised: {hasRaisedHand.toString()}<br/>
              BroadcastStatus: {broadcastStatus?.type || 'None'}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListenerInterface;