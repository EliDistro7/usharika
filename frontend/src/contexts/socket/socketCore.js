import { io } from 'socket.io-client';
import { getLoggedInUserId } from '@/hooks/useUser';

// Singleton socket instance
let socket = null;

// Socket connection state
let connectionState = {
  isConnected: false,
  isAuthenticated: false,
  userId: null,
  socketId: null,
};

// Initialize socket connection
const createSocket = () => {
  if (!socket) {
    console.log('🔗 Initializing WebSocket connection to:', process.env.NEXT_PUBLIC_SOCKET_URL);
    
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      autoConnect: true,
    });

    setupConnectionHandlers();
    setupAuthenticationHandlers();
  }
  return socket;
};

// Setup core connection event handlers
const setupConnectionHandlers = () => {
  socket.on('connect', () => {
    console.log('✅ Connected to WebSocket server');
    console.log('🆔 Socket ID:', socket.id);
    console.log('🌐 Transport:', socket.io.engine.transport.name);
    
    connectionState.isConnected = true;
    connectionState.socketId = socket.id;
    
    // Attempt user authentication on connection
    authenticateUser();
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error);
    connectionState.isConnected = false;
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Disconnected from WebSocket server. Reason:', reason);
    connectionState.isConnected = false;
    connectionState.isAuthenticated = false;
    connectionState.socketId = null;
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Reconnected to WebSocket server after', attemptNumber, 'attempts');
    connectionState.isConnected = true;
    connectionState.socketId = socket.id;
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
};

// Setup authentication event handlers
const setupAuthenticationHandlers = () => {
  socket.on('loginUserAck', (response) => {
    if (response.status === 'ok') {
      console.log('✅ User login acknowledged by server:', response.user?.username || response.user?.name);
      connectionState.isAuthenticated = true;
      connectionState.userId = response.user?.id || connectionState.userId;
    } else {
      console.error('❌ User login failed:', response.message);
      connectionState.isAuthenticated = false;
    }
  });

  socket.on('guestUserAck', (response) => {
    console.log('✅ Guest user acknowledged by server:', response);
    connectionState.isAuthenticated = true;
    connectionState.userId = null; // Guest users don't have userId
  });

  socket.on('loggedOut', () => {
    console.log('🔐 Logged out by server (another session detected)');
    connectionState.isAuthenticated = false;
    connectionState.userId = null;
  });

  socket.on('userConnected', (data) => {
    console.log('👤 User connected notification:', data.user?.username || data.user?.name);
  });

  socket.on('userDisconnected', (data) => {
    console.log('👤 User disconnected notification:', data.socketId);
  });
};

// Authenticate user with the server
const authenticateUser = () => {
  const userId = getLoggedInUserId();
  
  if (userId) {
    console.log('🔐 Attempting to login user:', userId);
    connectionState.userId = userId;
    socket.emit("loginUser", { userId, socketId: socket.id });
  } else {
    console.log('👤 No logged in user, connecting as guest');
    connectionState.userId = null;
    // Optionally emit guest connection if your server expects it
    // socket.emit("guestConnection", { socketId: socket.id });
  }
};

// Public API
export const getSocket = () => {
  return createSocket();
};

export const getConnectionState = () => {
  return { ...connectionState };
};

export const isSocketConnected = () => {
  return socket?.connected || false;
};

export const isUserAuthenticated = () => {
  return connectionState.isAuthenticated;
};

export const getCurrentUserId = () => {
  return connectionState.userId;
};

export const getCurrentSocketId = () => {
  return connectionState.socketId;
};

// Force re-authentication (useful when user logs in/out)
export const refreshAuthentication = () => {
  if (socket?.connected) {
    authenticateUser();
  }
};

// Initialize and export the socket instance
const socketInstance = createSocket();
export default socketInstance;