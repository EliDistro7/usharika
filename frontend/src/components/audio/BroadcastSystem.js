'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { audioStreamManager } from '@/contexts/socket/audioSocket'; // Update this path
import JoinRoomModal from './JoinRoomModal';
import BroadcasterInterface from './BroadcasterFace';
import ListenerInterface from './ListenerInterface';
import ParticipantsSidebar from './ParticipantsSidebar';
import { getLoggedInUserId } from '@/hooks/useUser';

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
  
  // Additional state from AudioStreamManager
  const [roomState, setRoomState] = useState({
    isActive: false,
    broadcaster: null,
    participants: []
  });
  const [broadcastStatus, setBroadcastStatus] = useState(null);
  const [errors, setErrors] = useState([]);

  // Initialize AudioStreamManager when component mounts and user connects
  useEffect(() => {
    if (isConnected && userRole && userName) {
      console.log('🚀 Initializing AudioStreamManager...');
      
      // Initialize the audio stream manager with callbacks
      audioStreamManager.initialize({
        setSocketConnected,
        setConnectionQuality,
        setParticipants,
        setIsReceivingAudio,
        userRole,
        onError: (errorData) => {
          console.error('AudioStreamManager Error:', errorData);
          setErrors(prev => [...prev, errorData]);
        },
        onRoomJoined: (data) => {
          console.log('Room joined successfully:', data);
          setRoomState({
            isActive: true,
            broadcaster: data.broadcaster,
            participants: data.participants
          });
        }
      });

      // Join the room
      audioStreamManager.joinRoom({
        roomId,
        userName,
        userRole,
        userId: getLoggedInUserId() // You can pass a user ID if available
      });

      // Setup additional event listeners for broadcast status
      const socket = audioStreamManager.socket;
      if (socket) {
        socket.on('broadcast-started', (data) => {
          setBroadcastStatus({ type: 'started', data });
        });

        socket.on('broadcast-stopped', (data) => {
          setBroadcastStatus({ type: 'stopped', data });
        });
      }

      // Cleanup function
      return () => {
        console.log('🧹 Cleaning up AudioStreamManager...');
        audioStreamManager.cleanup();
      };
    }
  }, [isConnected, userRole, userName, roomId]);

  const handleJoinRoom = (role, room, name) => {
    setUserRole(role);
    setRoomId(room);
    setUserName(name);
    setIsConnected(true);
    setShowJoinModal(false);
  };

  // Function to start broadcast (for broadcasters)
  const handleStartBroadcast = () => {
    if (userRole === 'broadcaster') {
      audioStreamManager.startBroadcast(userName);
    }
  };

  // Function to stop broadcast (for broadcasters)
  const handleStopBroadcast = () => {
    if (userRole === 'broadcaster') {
      audioStreamManager.stopBroadcast();
    }
  };

  // Function to raise/lower hand (for listeners)
  const handleRaiseHand = () => {
    audioStreamManager.raiseHand(userName);
  };

  // Function to send audio data (for broadcasters)
  const handleSendAudio = (audioData) => {
    if (userRole === 'broadcaster') {
      audioStreamManager.sendAudioData(audioData);
    }
  };

  // Get current room state and other data from AudioStreamManager
  const getCurrentRoomState = () => {
    return audioStreamManager.getRoomState();
  };

  const getConnectionStatus = () => {
    return {
      connected: socketConnected,
      quality: audioStreamManager.getConnectionQuality(),
      isReceivingAudio: audioStreamManager.getIsReceivingAudio(),
      isBroadcaster: audioStreamManager.isBroadcaster(),
      isRoomActive: audioStreamManager.isRoomActive()
    };
  };

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
                socket={audioStreamManager.socket}
                connectionQuality={connectionQuality}
                socketConnected={socketConnected}
                roomState={roomState}
                onStartBroadcast={handleStartBroadcast}
                onStopBroadcast={handleStopBroadcast}
                onSendAudio={handleSendAudio}
                broadcastStatus={broadcastStatus}
                audioStreamManager={audioStreamManager}
              />
            ) : (
              <ListenerInterface 
                roomId={roomId} 
                socket={audioStreamManager.socket}
                userName={userName}
                isReceivingAudio={isReceivingAudio}
                connectionQuality={connectionQuality}
                socketConnected={socketConnected}
                roomState={roomState}
                onRaiseHand={handleRaiseHand}
                broadcastStatus={broadcastStatus}
                audioStreamManager={audioStreamManager}
              />
            )}
          </div>
          <div className="col-lg-4 col-md-5 bg-white border-start p-3">
            <ParticipantsSidebar 
              participants={participants} 
              userRole={userRole}
              socket={audioStreamManager.socket}
              roomId={roomId}
              roomState={roomState}
              connectionStatus={getConnectionStatus()}
              audioStreamManager={audioStreamManager}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="position-fixed bottom-0 end-0 p-3">
          {errors.slice(-3).map((error, index) => (
            <div key={index} className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error:</strong> {error.message}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setErrors(prev => prev.filter((_, i) => i !== errors.length - 3 + index))}
              ></button>
            </div>
          ))}
        </div>
      )}

      {/* Connection Status Indicator */}
      <div className="position-fixed top-0 end-0 p-3">
        <div className="d-flex align-items-center gap-2">
          {socketConnected ? (
            <>
              <Wifi className="text-success" size={20} />
              <span className="badge bg-success">{connectionQuality}</span>
            </>
          ) : (
            <>
              <WifiOff className="text-danger" size={20} />
              <span className="badge bg-danger">Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Room Status Indicator */}
      {isConnected && (
        <div className="position-fixed top-0 start-0 p-3">
          <div className="card">
            <div className="card-body p-2">
              <small className="text-muted">Room: {roomId}</small><br />
              <small className="text-muted">Role: {userRole}</small><br />
              <small className="text-muted">
                Status: {roomState.isActive ? 
                  <span className="text-success">🔴 Live</span> : 
                  <span className="text-secondary">⚫ Inactive</span>
                }
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioBroadcastSystem;