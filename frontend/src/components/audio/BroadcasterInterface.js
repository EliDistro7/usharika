import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Wifi, WifiOff, Settings, MessageCircle } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';
import AudioVisualizer from './AudioVisualizer';
import BroadcastControls from './BroadcastControls';

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

  const listenerCount = participants.filter(p => p.isConnected && p.role === 'listener').length;

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
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcasterInterface;