import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Wifi, WifiOff, Settings, MessageCircle } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';
import AudioVisualizer from './AudioVisualizer';
import BroadcastControls from './BroadcastControls';

// Updated Broadcaster Interface Component with AudioStreamManager Integration
const BroadcasterInterface = ({ 
  roomId, 
  participants, 
  socket, 
  connectionQuality, 
  socketConnected,
  roomState,
  onStartBroadcast,
  onStopBroadcast,
  onSendAudio,
  broadcastStatus,
  audioStreamManager
}) => {
  console.log('room state', roomState);
  console.log('socketConnected', socketConnected);
  // Local state for UI management
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Refs for audio processing
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Derive broadcasting state from roomState and broadcastStatus
  const isBroadcasting = roomState?.isActive && roomState?.broadcaster?.role === 'broadcaster';
  
  // Get listener count from participants or roomState
  const listenerCount = participants?.filter(p => p.isConnected && p.role === 'listener').length || 
                       roomState?.participants?.filter(p => p.role === 'listener').length || 0;

  // Setup audio recording and analysis when broadcasting starts
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

  // Listen for broadcast status changes
  useEffect(() => {
    if (broadcastStatus) {
      if (broadcastStatus.type === 'started') {
        console.log('Broadcast started:', broadcastStatus.data);
      } else if (broadcastStatus.type === 'stopped') {
        console.log('Broadcast stopped:', broadcastStatus.data);
        // Clean up audio when broadcast stops
        stopAudioCapture();
      }
    }
  }, [broadcastStatus]);

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

      // Setup audio analysis for visualizer
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
        if (event.data.size > 0 && !isMuted) {
          // Use the parent's onSendAudio handler instead of direct socket emission
          const reader = new FileReader();
          reader.onload = () => {
            if (onSendAudio) {
              onSendAudio({
                audioData: reader.result,
                timestamp: Date.now(),
                roomId
              });
            } else if (audioStreamManager) {
              // Fallback to audioStreamManager if onSendAudio not provided
              audioStreamManager.sendAudioData(reader.result);
            }
          };
          reader.readAsDataURL(event.data);
        }
      };

      mediaRecorderRef.current.start(100); // Send data every 100ms

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
      // Use parent's stop handler
      if (onStopBroadcast) {
        onStopBroadcast();
      }
    }
  };

  const stopAudioCapture = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
  };

  const toggleBroadcast = () => {
    if (!socketConnected) {
      alert('Not connected to server. Please wait...');
      return;
    }

    if (isBroadcasting) {
      // Stop broadcasting using parent handler
      if (onStopBroadcast) {
        onStopBroadcast();
      } else if (audioStreamManager) {
        audioStreamManager.stopBroadcast();
      }
    } else {
      // Start broadcasting using parent handler
      if (onStartBroadcast) {
        onStartBroadcast();
      } else if (audioStreamManager) {
        audioStreamManager.startBroadcast();
      }
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !newMutedState; // Enable/disable track based on mute state
      });
    }

    // Notify AudioStreamManager about mute state if available
    if (audioStreamManager && audioStreamManager.setMuteState) {
      audioStreamManager.setMuteState(newMutedState);
    }
  };

  // Get connection status from AudioStreamManager if available
  const getConnectionStatus = () => {
    if (audioStreamManager && audioStreamManager.getConnectionQuality) {
      return audioStreamManager.getConnectionQuality();
    }
    return connectionQuality;
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
              {/* Show broadcaster info from roomState */}
              {roomState?.broadcaster && (
                <div>
                  <small className="text-muted d-block">
                    Broadcaster: {roomState.broadcaster.userName || 'Unknown'}
                  </small>
                </div>
              )}
            </div>
            <div className="col-auto">
              <ConnectionStatus 
                socketConnected={socketConnected}
                connectionQuality={getConnectionStatus()}
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
                {/* Show broadcast status info */}
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
                {/* Show room state info when not broadcasting */}
                {roomState && !roomState.isActive && (
                  <small className="text-muted d-block">
                    Room inactive • {roomState.participants?.length || 0} participants waiting
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
          </div>
        </div>
      </div>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="card mt-2 border-0 bg-light">
          <div className="card-body p-2">
            <small className="text-muted">
              Debug: Broadcasting={isBroadcasting.toString()}, 
              RoomActive={roomState?.isActive?.toString()}, 
              SocketConnected={socketConnected.toString()}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcasterInterface;