import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Wifi, WifiOff, Settings, MessageCircle } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';
import AudioVisualizer from './AudioVisualizer';
import BroadcastControls from './BroadcastControls';

// Updated Broadcaster Interface Component with AudioStreamManager Integration
const BroadcasterInterface = ({ 
  roomId, 
  userName,
  participants, 
  socket, 
  connectionQuality, 
  socketConnected,
  roomState,
  onStartBroadcast,
  onStopBroadcast,
  onLeaveRoom,
  broadcastStatus,
  audioStreamManager,
  peerConnected
}) => {
  console.log('🔄 BroadcasterInterface render - Props received:', {
    roomId,
    userName,
    participants: participants?.length,
    socketConnected,
    roomState,
    broadcastStatus,
    hasAudioStreamManager: !!audioStreamManager,
    peerConnected
  });

  // Local state for UI management
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Refs for audio processing
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Derive broadcasting state from roomState - Fix the logic
  const isBroadcasting = roomState?.isActive && roomState?.broadcaster?.userName === userName;
  
  console.log('📊 Broadcasting state calculation:', {
    roomStateIsActive: roomState?.isActive,
    broadcasterUserName: roomState?.broadcaster?.userName,
    currentUserName: userName,
    isBroadcasting,
    socketConnected
  });
  
  // Get listener count from participants
  const listenerCount = participants?.filter(p => p.isConnected && p.role === 'listener').length || 0;

  // Setup audio recording and analysis when broadcasting starts
  useEffect(() => {
    console.log('🎵 Audio capture effect triggered:', {
      isBroadcasting,
      socketConnected,
      condition: isBroadcasting && socketConnected
    });

    if (isBroadcasting && socketConnected) {
      console.log('✅ Starting audio capture - conditions met');
      startAudioCapture();
    } else {
      console.log('❌ Not starting audio capture - conditions not met:', {
        isBroadcasting,
        socketConnected,
        reason: !isBroadcasting ? 'Not broadcasting' : 'Socket not connected'
      });
      stopAudioCapture();
    }

    return () => {
      console.log('🧹 Audio capture effect cleanup');
      stopAudioCapture();
    };
  }, [isBroadcasting, socketConnected]);

  // Audio level visualization
  useEffect(() => {
    console.log('📈 Audio level effect triggered:', {
      isBroadcasting,
      isMuted,
      hasAnalyser: !!analyserRef.current
    });

    let animationFrame;
    
    if (isBroadcasting && !isMuted && analyserRef.current) {
      console.log('🎤 Starting audio level monitoring');
      const updateAudioLevel = () => {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const level = (average / 255) * 100;
        setAudioLevel(level);
        animationFrame = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();
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
  }, [isBroadcasting, isMuted]);

  // Listen for broadcast status changes
  useEffect(() => {
    console.log('📡 Broadcast status effect triggered:', broadcastStatus);

    if (broadcastStatus) {
      if (broadcastStatus.type === 'started') {
        console.log('🟢 Broadcast started:', broadcastStatus.data);
      } else if (broadcastStatus.type === 'stopped') {
        console.log('🔴 Broadcast stopped:', broadcastStatus.data);
        // Clean up audio when broadcast stops
        stopAudioCapture();
      }
    }
  }, [broadcastStatus]);

  const startAudioCapture = async () => {
    console.log('🎤 startAudioCapture() called');
    
    try {
      console.log('📱 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      console.log('✅ Microphone access granted, stream obtained:', stream);
      audioStreamRef.current = stream;

      // Setup audio analysis for visualizer
      console.log('🔧 Setting up audio context and analyser...');
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      console.log('✅ Audio analysis setup complete');

      // Setup MediaRecorder for streaming
      console.log('🔧 Setting up MediaRecorder...');
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log('📊 Audio data available:', {
          dataSize: event.data.size,
          isMuted,
          hasAudioStreamManager: !!audioStreamManager
        });

        if (event.data.size > 0 && !isMuted && audioStreamManager) {
          // Send audio data through audioStreamManager
          const reader = new FileReader();
          reader.onload = () => {
            console.log('📤 Sending audio via audioStreamManager');
            audioStreamManager.sendAudioData({
              audioData: reader.result,
              timestamp: Date.now(),
              roomId,
              userName
            });
          };
          reader.readAsDataURL(event.data);
        }
      };

      console.log('▶️ Starting MediaRecorder...');
      mediaRecorderRef.current.start(100); // Send data every 100ms
      console.log('✅ Audio capture fully initialized');

    } catch (error) {
      console.error('❌ Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
      // Use parent's stop handler
      if (onStopBroadcast) {
        console.log('🛑 Calling onStopBroadcast due to error');
        onStopBroadcast();
      }
    }
  };

  const stopAudioCapture = () => {
    console.log('🛑 stopAudioCapture() called');
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('⏹️ Stopping MediaRecorder');
      mediaRecorderRef.current.stop();
    }
    
    if (audioStreamRef.current) {
      console.log('🔇 Stopping audio stream tracks');
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      console.log('🔇 Closing audio context');
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    console.log('✅ Audio capture cleanup complete');
  };

  const toggleBroadcast = () => {
    console.log('🎬 toggleBroadcast() called:', {
      socketConnected,
      isBroadcasting,
      hasOnStartBroadcast: !!onStartBroadcast,
      hasOnStopBroadcast: !!onStopBroadcast
    });

    if (!socketConnected) {
      console.warn('⚠️ Cannot toggle broadcast - not connected to server');
      alert('Not connected to server. Please wait...');
      return;
    }

    if (isBroadcasting) {
      console.log('🛑 Stopping broadcast...');
      if (onStopBroadcast) {
        console.log('📞 Calling onStopBroadcast callback');
        onStopBroadcast();
      }
    } else {
      console.log('▶️ Starting broadcast...');
      if (onStartBroadcast) {
        console.log('📞 Calling onStartBroadcast callback');
        onStartBroadcast();
      }
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    console.log('🔇 toggleMute() called:', {
      currentMuted: isMuted,
      newMuted: newMutedState,
      hasAudioStream: !!audioStreamRef.current
    });
    
    setIsMuted(newMutedState);
    
    if (audioStreamRef.current) {
      console.log('🎤 Toggling audio track enabled state');
      audioStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !newMutedState; // Enable/disable track based on mute state
      });
    }

    // Notify AudioStreamManager about mute state if available
    if (audioStreamManager && audioStreamManager.setMuteState) {
      console.log('📞 Notifying audioStreamManager of mute state');
      audioStreamManager.setMuteState(newMutedState);
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
              <small className="text-muted d-block">
                Broadcaster: {userName}
              </small>
              {peerConnected && (
                <small className="text-success d-block">
                  <span className="badge bg-success">P2P Connected</span>
                </small>
              )}
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

      {/* Main Broadcasting Area */}
      <div className="card flex-grow-1 border-0 shadow-sm">
        <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
          {/* Audio Visualizer */}
          <div className="mb-4">
            <AudioVisualizer 
              audioLevel={audioLevel}
              isActive={isBroadcasting && !isMuted}
            />
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
                  {listenerCount} people listening
                </p>
                {isMuted && <small className="text-warning d-block">Microphone muted</small>}
                {broadcastStatus && (
                  <small className="text-info d-block">
                    Status: {broadcastStatus.type}
                  </small>
                )}
              </div>
            ) : (
              <div>
                <h5 className="mb-2 text-muted">Ready to Broadcast</h5>
                <p className="text-muted mb-0">
                  {socketConnected ? 
                    'Click start when ready to begin the service' : 
                    'Connecting to server...'
                  }
                </p>
                {roomState && !roomState.isActive && (
                  <small className="text-muted d-block">
                    Room inactive • {participants?.length || 0} participants waiting
                  </small>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <BroadcastControls
            isBroadcasting={isBroadcasting}
            isMuted={isMuted}
            socketConnected={socketConnected}
            onToggleBroadcast={toggleBroadcast}
            onToggleMute={toggleMute}
          />
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
                Chat ({participants?.length || 0})
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
              Broadcasting: {isBroadcasting.toString()}<br/>
              RoomActive: {roomState?.isActive?.toString()}<br/>
              BroadcasterName: {roomState?.broadcaster?.userName}<br/>
              CurrentUser: {userName}<br/>
              SocketConnected: {socketConnected.toString()}<br/>
              PeerConnected: {peerConnected?.toString()}<br/>
              AudioStream: {audioStreamRef.current ? 'Active' : 'Inactive'}<br/>
              MediaRecorder: {mediaRecorderRef.current?.state || 'None'}<br/>
              BroadcastStatus: {broadcastStatus?.type || 'None'}<br/>
              Participants: {participants?.length || 0}<br/>
              Listeners: {listenerCount}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcasterInterface;