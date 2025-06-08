import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Hand, MessageCircle, Heart } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';
import ListenerControls from './ListenerControls';
import AudioPlayer from './AudioPlayer';

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
          <AudioPlayer
            isPlaying={isPlaying}
            isReceivingAudio={isReceivingAudio}
            socketConnected={socketConnected}
            onTogglePlay={togglePlay}
          />

          {/* Main Controls */}
          <ListenerControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            socketConnected={socketConnected}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onVolumeChange={setVolume}
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

export default ListenerInterface;