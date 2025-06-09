'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { audioStreamManager } from '@/contexts/socket/audioSocket';
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
  const [peerConnected, setPeerConnected] = useState(false);

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
          // Auto-remove error after 5 seconds
          setTimeout(() => {
            setErrors(prev => prev.filter(e => e !== errorData));
          }, 5000);
        },
        onRoomJoined: (data) => {
          console.log('Room joined successfully:', data);
          setRoomState({
            isActive: data.isActive,
            broadcaster: data.broadcaster,
            participants: data.participants
          });
        },
        onPeerConnected: () => {
          console.log('Peer connection established');
          setPeerConnected(true);
        },
        onPeerDisconnected: () => {
          console.log('Peer connection lost');
          setPeerConnected(false);
        },
        onReactionReceived: (reactionData) => {
          console.log('Reaction received:', reactionData);
          // Handle reactions if needed in your UI
        }
      });

      // Join the room based on role
      if (userRole === 'broadcaster') {
        audioStreamManager.joinRoomAsBroadcaster({
          roomId,
          userName,
          userId: getLoggedInUserId()
        });
      } else {
        audioStreamManager.joinRoomAsListener({
          roomId,
          userName,
          userId: getLoggedInUserId()
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
  const handleStartBroadcast = async () => {
    if (userRole === 'broadcaster') {
      try {
        await audioStreamManager.startBroadcast(userName);
        console.log('Broadcast started successfully');
      } catch (error) {
        console.error('Failed to start broadcast:', error);
        setErrors(prev => [...prev, { message: `Failed to start broadcast: ${error.message}` }]);
      }
    }
  };

  // Function to stop broadcast (for broadcasters)
  const handleStopBroadcast = () => {
    if (userRole === 'broadcaster') {
      audioStreamManager.stopBroadcast();
    }
  };

  // Function to raise/lower hand (for listeners)
  const handleRaiseHand = (raised = true) => {
    audioStreamManager.raiseHand(userName, raised);
  };

  // Function to send reaction
  const handleSendReaction = (reaction) => {
    audioStreamManager.sendReaction(userName, reaction);
  };

  // Leave room
  const handleLeaveRoom = () => {
    audioStreamManager.leaveRoom();
    setIsConnected(false);
    setShowJoinModal(true);
    // Reset all state
    setParticipants([]);
    setIsReceivingAudio(false);
    setRoomState({ isActive: false, broadcaster: null, participants: [] });
    setBroadcastStatus(null);
    setPeerConnected(false);
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
      isRoomActive: audioStreamManager.isRoomActive(),
      peerConnected: audioStreamManager.getPeerConnected()
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
                userName={userName}
                participants={participants} 
                socket={audioStreamManager.socket}
                connectionQuality={connectionQuality}
                socketConnected={socketConnected}
                roomState={roomState}
                onStartBroadcast={handleStartBroadcast}
                onStopBroadcast={handleStopBroadcast}
                onLeaveRoom={handleLeaveRoom}
                broadcastStatus={broadcastStatus}
                audioStreamManager={audioStreamManager}
                peerConnected={peerConnected}
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
                onSendReaction={handleSendReaction}
                onLeaveRoom={handleLeaveRoom}
                broadcastStatus={broadcastStatus}
                audioStreamManager={audioStreamManager}
                peerConnected={peerConnected}
              />
            )}
          </div>
          <div className="col-lg-4 col-md-5 bg-white border-start p-3">
            <ParticipantsSidebar 
              participants={participants} 
              userRole={userRole}
              userName={userName}
              socket={audioStreamManager.socket}
              roomId={roomId}
              roomState={roomState}
              connectionStatus={getConnectionStatus()}
              audioStreamManager={audioStreamManager}
              onLeaveRoom={handleLeaveRoom}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          {errors.slice(-3).map((error, index) => (
            <div key={index} className="alert alert-danger alert-dismissible fade show mb-2" role="alert">
              <strong>Error:</strong> {error.message}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setErrors(prev => prev.filter(e => e !== error))}
              ></button>
            </div>
          ))}
        </div>
      )}

      {/* Connection Status Indicator */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1040 }}>
        <div className="d-flex align-items-center gap-2">
          {socketConnected ? (
            <>
              <Wifi className="text-success" size={20} />
              <span className="badge bg-success">{connectionQuality}</span>
              {peerConnected && <span className="badge bg-info ms-1">P2P Connected</span>}
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
        <div className="position-fixed top-0 start-0 p-3" style={{ zIndex: 1040 }}>
          <div className="card">
            <div className="card-body p-2">
              <small className="text-muted d-block">Room: <strong>{roomId}</strong></small>
              <small className="text-muted d-block">Role: <strong>{userRole}</strong></small>
              <small className="text-muted d-block">
                Status: {roomState.isActive ? 
                  <span className="text-success">🔴 Live</span> : 
                  <span className="text-secondary">⚫ Inactive</span>
                }
              </small>
              <small className="text-muted d-block">
                Participants: <strong>{participants.length}</strong>
              </small>
              {userRole === 'listener' && (
                <small className="text-muted d-block">
                  Audio: {isReceivingAudio ? 
                    <span className="text-success">🎵 Receiving</span> : 
                    <span className="text-warning">🔇 No Audio</span>
                  }
                </small>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioBroadcastSystem;