'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Users, Wifi, WifiOff, Settings, Hand, MessageCircle, Heart } from 'lucide-react';
import { io } from 'socket.io-client';

// Socket.IO connection
let socket = null;

// Main Audio Broadcast Component
const AudioBroadcastSystem = () => {
  const [userRole, setUserRole] = useState('listener');
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [isReceivingAudio, setIsReceivingAudio] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('excellent');

  // Initialize Socket.IO connection
  useEffect(() => {
    if (isConnected && !socket) {
      // Replace with your server URL
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
      
      socket.on('connect', () => {
        console.log('Connected to server');
        setSocketConnected(true);
        setConnectionQuality('excellent');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
        setSocketConnected(false);
        setConnectionQuality('poor');
      });

      socket.on('participants-updated', (updatedParticipants) => {
        setParticipants(updatedParticipants);
      });

      socket.on('audio-stream', (audioData) => {
        if (userRole === 'listener') {
          setIsReceivingAudio(true);
          // Handle incoming audio data here
          console.log('Received audio stream:', audioData);
        }
      });

      socket.on('broadcast-started', (data) => {
        console.log('Broadcast started by:', data.broadcasterId);
        setIsReceivingAudio(true);
      });

      socket.on('broadcast-stopped', (data) => {
        console.log('Broadcast stopped by:', data.broadcasterId);
        setIsReceivingAudio(false);
      });

      socket.on('user-raised-hand', (data) => {
        console.log('User raised hand:', data.userName);
        // Update UI to show raised hand
      });

      socket.on('connection-quality-changed', (quality) => {
        setConnectionQuality(quality);
      });

      return () => {
        if (socket) {
          socket.disconnect();
          socket = null;
        }
      };
    }
  }, [isConnected, userRole]);

  const handleJoinRoom = (role, room, name) => {
    setUserRole(role);
    setRoomId(room);
    setUserName(name);
    setIsConnected(true);
    setShowJoinModal(false);
  };

  // Join room via Socket.IO after connection
  useEffect(() => {
    if (socketConnected && roomId && userName) {
      socket.emit('join-room', {
        roomId,
        userName,
        userRole
      });
    }
  }, [socketConnected, roomId, userName, userRole]);

  return (
    <div className="container-fluid bg-light min-vh-100">
      {showJoinModal && (
        <JoinRoomModal onJoin={handleJoinRoom} />
      )}
      
      {isConnected && (
        <div className="row h-100">
          <div className="col-lg-8 col-md-7 p-3">
            {userRole === 'broadcaster' ? (
              <BroadcasterInterface 
                roomId={roomId} 
                participants={participants} 
                socket={socket}
                connectionQuality={connectionQuality}
                socketConnected={socketConnected}
              />
            ) : (
              <ListenerInterface 
                roomId={roomId} 
                socket={socket}
                userName={userName}
                isReceivingAudio={isReceivingAudio}
                connectionQuality={connectionQuality}
                socketConnected={socketConnected}
              />
            )}
          </div>
          <div className="col-lg-4 col-md-5 bg-white border-start p-3">
            <ParticipantsSidebar 
              participants={participants} 
              userRole={userRole}
              socket={socket}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Join Room Modal Component
const JoinRoomModal = ({ onJoin }) => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedRole, setSelectedRole] = useState('listener');

  const handleSubmit = () => {
    if (roomId && userName) {
      onJoin(selectedRole, roomId, userName);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-purple text-white">
            <h5 className="modal-title">Join Church Service</h5>
          </div>
          <div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Room ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Join as</label>
                <div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="listener"
                      checked={selectedRole === 'listener'}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    />
                    <label className="form-check-label">Listener (Congregation)</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="broadcaster"
                      checked={selectedRole === 'broadcaster'}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    />
                    <label className="form-check-label">Broadcaster (Pastor/Leader)</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleSubmit} className="btn btn-purple w-100">
                Join Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Broadcaster Interface Component
const BroadcasterInterface = ({ roomId, participants, socket, connectionQuality, socketConnected }) => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Setup audio recording and analysis
  useEffect(() => {
    if (isBroadcasting && socketConnected) {
      startAudioCapture();
    } else {
      stopAudioCapture();
    }

    return () => stopAudioCapture();
  }, [isBroadcasting, socketConnected]);

  // Audio level visualization
  useEffect(() => {
    let animationFrame;
    
    if (isBroadcasting && !isMuted && analyserRef.current) {
      const updateAudioLevel = () => {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel((average / 255) * 100);
        animationFrame = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();
    } else {
      setAudioLevel(0);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isBroadcasting, isMuted]);

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      audioStreamRef.current = stream;

      // Setup audio analysis
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Setup MediaRecorder for streaming
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && socket && !isMuted) {
          // Convert blob to base64 and send via socket
          const reader = new FileReader();
          reader.onload = () => {
            socket.emit('broadcast-audio', {
              roomId,
              audioData: reader.result,
              timestamp: Date.now()
            });
          };
          reader.readAsDataURL(event.data);
        }
      };

      mediaRecorderRef.current.start(100); // Send data every 100ms
      
      // Notify server that broadcast started
      socket.emit('broadcast-started', { roomId });

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
      setIsBroadcasting(false);
    }
  };

  const stopAudioCapture = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (socket && isBroadcasting) {
      socket.emit('broadcast-stopped', { roomId });
    }
  };

  const toggleBroadcast = () => {
    if (!socketConnected) {
      alert('Not connected to server. Please wait...');
      return;
    }
    setIsBroadcasting(!isBroadcasting);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioStreamRef.current) {
      audioStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Toggle track
      });
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      {/* Header */}
      <div className="card mb-3 border-0 shadow-sm">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col">
              <h4 className="mb-1 text-purple">Broadcasting Live</h4>
              <small className="text-muted">Room: {roomId}</small>
            </div>
            <div className="col-auto">
              <span className={`badge ${socketConnected ? 
                (connectionQuality === 'excellent' ? 'bg-success' : 'bg-warning') : 'bg-danger'}`}>
                {socketConnected ? <Wifi size={16} className="me-1" /> : <WifiOff size={16} className="me-1" />}
                {socketConnected ? connectionQuality : 'disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Broadcasting Area */}
      <div className="card flex-grow-1 border-0 shadow-sm">
        <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
          {/* Audio Visualizer */}
          <div className="mb-4">
            <div className="audio-visualizer d-flex align-items-end justify-content-center gap-1">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-purple rounded"
                  style={{
                    width: '8px',
                    height: `${Math.max(10, (audioLevel * (Math.random() * 0.5 + 0.7)) + 10)}px`,
                    opacity: isBroadcasting && !isMuted ? 0.8 : 0.3,
                    transition: 'all 0.1s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            {isBroadcasting ? (
              <div>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="bg-danger rounded-circle me-2" style={{ width: '12px', height: '12px' }}></div>
                  <h5 className="mb-0 text-danger">LIVE</h5>
                </div>
                <p className="text-muted mb-0">
                  {participants.filter(p => p.isConnected && p.role === 'listener').length} people listening
                </p>
                {isMuted && <small className="text-warning">Microphone muted</small>}
              </div>
            ) : (
              <div>
                <h5 className="mb-2 text-muted">Ready to Broadcast</h5>
                <p className="text-muted mb-0">
                  {socketConnected ? 'Click start when ready to begin the service' : 'Connecting to server...'}
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="d-flex gap-3">
            <button
              className={`btn btn-lg rounded-circle ${isBroadcasting ? 'btn-danger' : 'btn-purple'}`}
              style={{ width: '80px', height: '80px' }}
              onClick={toggleBroadcast}
              disabled={!socketConnected}
            >
              {isBroadcasting ? 'Stop' : 'Start'}
            </button>
            
            <button
              className={`btn btn-lg rounded-circle ${isMuted ? 'btn-warning' : 'btn-outline-secondary'}`}
              style={{ width: '60px', height: '60px' }}
              onClick={toggleMute}
              disabled={!isBroadcasting}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="card mt-3 border-0 shadow-sm">
        <div className="card-body">
          <div className="row text-center">
            <div className="col">
              <button className="btn btn-outline-purple btn-sm">
                <Settings size={16} className="me-1" />
                Settings
              </button>
            </div>
            <div className="col">
              <button className="btn btn-outline-purple btn-sm">
                <MessageCircle size={16} className="me-1" />
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Listener Interface Component
const ListenerInterface = ({ roomId, socket, userName, isReceivingAudio, connectionQuality, socketConnected }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioBufferQueue = useRef([]);

  // Setup audio playback
  useEffect(() => {
    if (isPlaying && socketConnected) {
      setupAudioPlayback();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isPlaying, socketConnected]);

  // Handle incoming audio data
  useEffect(() => {
    if (!socket) return;

    const handleAudioStream = async (audioData) => {
      if (isPlaying && !isMuted && audioContextRef.current) {
        try {
          // Convert base64 to arraybuffer
          const audioBuffer = await fetch(audioData.audioData).then(r => r.arrayBuffer());
          const decodedBuffer = await audioContextRef.current.decodeAudioData(audioBuffer);
          
          // Play the audio buffer
          const source = audioContextRef.current.createBufferSource();
          source.buffer = decodedBuffer;
          const gainNode = audioContextRef.current.createGain();
          gainNode.gain.value = volume / 100;
          
          source.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);
          source.start();
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    };

    socket.on('audio-stream', handleAudioStream);

    return () => {
      socket.off('audio-stream', handleAudioStream);
    };
  }, [socket, isPlaying, isMuted, volume]);

  const setupAudioPlayback = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    } catch (error) {
      console.error('Error setting up audio playback:', error);
    }
  };

  const togglePlay = () => {
    if (!socketConnected) {
      alert('Not connected to server. Please wait...');
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleRaiseHand = () => {
    if (socket) {
      const newHandState = !hasRaisedHand;
      setHasRaisedHand(newHandState);
      socket.emit('raise-hand', {
        roomId,
        userName,
        raised: newHandState
      });
    }
  };

  const sendReaction = (reaction) => {
    if (socket) {
      socket.emit('send-reaction', {
        roomId,
        userName,
        reaction
      });
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      {/* Header */}
      <div className="card mb-3 border-0 shadow-sm">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col">
              <h4 className="mb-1 text-purple">Church Service</h4>
              <small className="text-muted">Room: {roomId}</small>
            </div>
            <div className="col-auto">
              <span className={`badge ${socketConnected ? 
                (connectionQuality === 'excellent' ? 'bg-success' : 'bg-warning') : 'bg-danger'}`}>
                {socketConnected ? <Wifi size={16} className="me-1" /> : <WifiOff size={16} className="me-1" />}
                {socketConnected ? connectionQuality : 'disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Audio Player */}
      <div className="card flex-grow-1 border-0 shadow-sm">
        <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
          {/* Speaker Indicator */}
          <div className="mb-4">
            <div className="position-relative">
              <div
                className="rounded-circle bg-purple d-flex align-items-center justify-content-center"
                style={{ width: '120px', height: '120px' }}
              >
                <Volume2 size={48} className="text-white" />
              </div>
              {isPlaying && isReceivingAudio && (
                <div className="position-absolute top-0 start-0 w-100 h-100">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="position-absolute border border-purple rounded-circle"
                      style={{
                        width: `${140 + (i * 20)}px`,
                        height: `${140 + (i * 20)}px`,
                        top: `${-10 - (i * 10)}px`,
                        left: `${-10 - (i * 10)}px`,
                        animation: `pulse 2s infinite ${i * 0.5}s`,
                        opacity: 0.3
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            {isPlaying ? (
              <div>
                <h5 className="mb-2 text-success">
                  {isReceivingAudio ? 'Listening' : 'Waiting for broadcast...'}
                </h5>
                <p className="text-muted mb-0">
                  {isReceivingAudio ? 'Live audio streaming' : 'No active broadcast'}
                </p>
              </div>
            ) : (
              <div>
                <h5 className="mb-2 text-muted">Ready to Listen</h5>
                <p className="text-muted mb-0">
                  {socketConnected ? 'Click play to join the service' : 'Connecting to server...'}
                </p>
              </div>
            )}
          </div>

          {/* Main Controls */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              className={`btn btn-lg rounded-circle ${isPlaying ? 'btn-outline-purple' : 'btn-purple'}`}
              style={{ width: '80px', height: '80px' }}
              onClick={togglePlay}
              disabled={!socketConnected}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              className={`btn btn-lg rounded-circle ${isMuted ? 'btn-warning' : 'btn-outline-secondary'}`}
              style={{ width: '60px', height: '60px' }}
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>

          {/* Volume Control */}
          <div className="w-50">
            <label className="form-label text-muted">Volume</label>
            <input
              type="range"
              className="form-range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              disabled={isMuted}
            />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="card mt-3 border-0 shadow-sm">
        <div className="card-body">
          <div className="row text-center">
            <div className="col">
              <button
                className={`btn btn-sm ${hasRaisedHand ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={toggleRaiseHand}
                disabled={!socketConnected}
              >
                <Hand size={16} className="me-1" />
                {hasRaisedHand ? 'Lower Hand' : 'Raise Hand'}
              </button>
            </div>
            <div className="col">
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={() => sendReaction('amen')}
                disabled={!socketConnected}
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
          </div>
        </div>
      </div>
    </div>
  );
};

// Participants Sidebar Component
const ParticipantsSidebar = ({ participants, userRole, socket }) => {
  const connectedParticipants = participants.filter(p => p.isConnected);
  
  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 text-purple">Participants</h5>
        <span className="badge bg-purple">
          {connectedParticipants.length}
        </span>
      </div>

      <div className="flex-grow-1 overflow-auto">
        {participants.map((participant) => (
          <div key={participant.id} className="card mb-2 border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <strong className="me-2">{participant.name}</strong>
                    {participant.role === 'broadcaster' && (
                      <span className="badge bg-danger">Live</span>
                    )}
                    {participant.hasRaisedHand && (
                      <Hand size={14} className="text-warning ms-1" />
                    )}
                  </div>
                  <small className={`text-${participant.isConnected ? 'success' : 'muted'}`}>
                    {participant.isConnected ? 'Connected' : 'Disconnected'}
                  </small>
                </div>
                <div>
                  <div
                    className={`rounded-circle ${participant.isConnected ? 'bg-success' : 'bg-secondary'}`}
                    style={{ width: '12px', height: '12px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {participants.length === 0 && (
          <div className="text-center text-muted py-4">
            <p>No participants yet</p>
          </div>
        )}
      </div>

      {userRole === 'broadcaster' && (
        <div className="mt-3">
          <button className="btn btn-outline-purple btn-sm w-100">
            <Users size={16} className="me-1" />
            Manage Participants
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioBroadcastSystem;

// Custom CSS for animations and styling
const styles = `
.btn-purple {
  background-color: #6f42c1;
  border-color: #6f42c1;
  color: white;
}

.btn-purple:hover {
  background-color: #5a359a;
  border-color: #5a359a;
  color: white;
}

.btn-outline-purple {
  color: #6f42c1;
  border-color: #6f42c1;
}

.btn-outline-purple:hover {
  background-color: #6f42c1;
  border-color: #6f42c1;
  color: white;
}

.text-purple {
  color: #6f42c1 !important;
}

.bg-purple {
  background-color: #6f42c1 !important;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}
`;