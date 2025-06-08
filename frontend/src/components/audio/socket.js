import { io } from 'socket.io-client';

// Socket.IO connection manager
export const initializeSocket = ({
  setSocketConnected,
  setConnectionQuality,
  setParticipants,
  setIsReceivingAudio,
  userRole
}) => {
  // Replace with your server URL
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
  
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

  return socket;
};