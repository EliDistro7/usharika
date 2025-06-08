import { io } from 'socket.io-client';
import { getLoggedInUserId } from '@/hooks/useUser';

// Create singleton socket instance
let socket = null;

// Initialize socket connection
const createSocket = () => {
  if (!socket) {
    console.log('🔗 Initializing WebSocket connection to:', process.env.NEXT_PUBLIC_SOCKET_URL);
    
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ['websocket', 'polling'], // Specify transports for better debugging
      timeout: 20000,
    });

    console.log("🔗 Socket instance created:", socket.id);

    // Connection event listeners for debugging
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      console.log('🆔 Socket ID:', socket.id);
      console.log('🌐 Transport:', socket.io.engine.transport.name);
      
      const userId = getLoggedInUserId();
      if (userId) {
        console.log('🔐 Attempting to login user:', userId);
        socket.emit("loginUser", { userId, socketId: socket.id });
      } else {
        console.log('👤 No logged in user, connecting as guest');
      }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from WebSocket server. Reason:', reason);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected to WebSocket server after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Attempting to reconnect... Attempt #', attemptNumber);
    });

    socket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('💥 Failed to reconnect to WebSocket server');
    });

    // Server response listeners
    socket.on('loginUserAck', (response) => {
      if (response.status === 'ok') {
        console.log('✅ User login acknowledged by server:', response.user?.username || response.user?.name);
      } else {
        console.error('❌ User login failed:', response.message);
      }
    });

    socket.on('guestUserAck', (response) => {
      console.log('✅ Guest user acknowledged by server:', response);
    });

    socket.on('userConnected', (data) => {
      console.log('👤 User connected notification:', data.user?.username || data.user?.name);
    });

    socket.on('userDisconnected', (data) => {
      console.log('👤 User disconnected notification:', data.socketId);
    });

    socket.on('loggedOut', () => {
      console.log('🔐 Logged out by server (another session detected)');
    });
  }
  return socket;
};

// Socket.IO connection manager
export const initializeSocket = ({
  setSocketConnected,
  setConnectionQuality,
  setParticipants,
  setIsReceivingAudio,
  userRole
}) => {
  console.log('🚀 Initializing socket with role:', userRole);
  
  // Get or create socket instance
  const socketInstance = createSocket();

  // Note: 'connection' event doesn't exist on client side, using 'connect' instead
  socketInstance.on('connect', () => {
    console.log('✅ Connected to server in initializeSocket');
    setSocketConnected(true);
    setConnectionQuality('excellent');
  });

  socketInstance.on('disconnect', (reason) => {
    console.log('🔌 Disconnected from server in initializeSocket. Reason:', reason);
    setSocketConnected(false);
    setConnectionQuality('poor');
  });

  socketInstance.on('participants-updated', (updatedParticipants) => {
    console.log('👥 Participants updated:', updatedParticipants.length, 'participants');
    setParticipants(updatedParticipants);
  });

  socketInstance.on('audio-stream', (audioData) => {
    if (userRole === 'listener') {
      console.log('🔊 Received audio stream data');
      setIsReceivingAudio(true);
      // Handle incoming audio data here
      console.log('📊 Audio stream details:', {
        size: audioData?.length || 'unknown',
        type: typeof audioData
      });
    }
  });

  socketInstance.on('broadcast-started', (data) => {
    console.log('📻 Broadcast started by:', data.broadcasterId);
    setIsReceivingAudio(true);
  });

  socketInstance.on('broadcast-stopped', (data) => {
    console.log('📻 Broadcast stopped by:', data.broadcasterId);
    setIsReceivingAudio(false);
  });

  socketInstance.on('user-raised-hand', (data) => {
    console.log('✋ User raised hand:', data.userName);
    // Update UI to show raised hand
  });

  socketInstance.on('connection-quality-changed', (quality) => {
    console.log('📶 Connection quality changed to:', quality);
    setConnectionQuality(quality);
  });

  socketInstance.on('assignedRole', (data) => {
    console.log('🎭 Role assigned:', data.role);
  });

  socketInstance.on('updateRoomUsers', (roomData) => {
    console.log('🏠 Room users updated:', roomData);
  });

  socketInstance.on('onlineUsersResponse', (data) => {
    console.log('👥 Online users response:', {
      registered: data.registeredUsers?.length || 0,
      guests: data.guestUsers?.length || 0
    });
  });

  socketInstance.on('liveGroupsResponse', (data) => {
    console.log('🔴 Live groups response:', Object.keys(data.liveGroupsNow || {}).length, 'active rooms');
  });

  console.log('🎯 Socket initialization complete');
  return socketInstance;
};

// Export socket instance as default
export default createSocket();