'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import socket, { initializeSocket } from '@/contexts/socket';
import JoinRoomModal from './JoinRoomModal';
import BroadcasterInterface from './BroadcasterInterface';
import ListenerInterface from './ListenerInterface';
import ParticipantsSidebar from './ParticipantsSidebar';

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

  // Initialize Socket.IO connection and event listeners
  useEffect(() => {
    if (isConnected) {
      // Initialize socket with event listeners
      initializeSocket({
        setSocketConnected,
        setConnectionQuality,
        setParticipants,
        setIsReceivingAudio,
        userRole
      });

      // Cleanup function to disconnect socket when component unmounts
      return () => {
        if (socket) {
          socket.disconnect();
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
    if (socketConnected && roomId && userName && socket) {
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

export default AudioBroadcastSystem;