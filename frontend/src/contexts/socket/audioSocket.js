import { getSocket } from './socketCore';

// Audio stream management
class AudioStreamManager {
  constructor() {
    this.socket = null;
    this.isReceivingAudio = false;
    this.userRole = null;
    this.participants = [];
    this.connectionQuality = 'excellent';
    this.socketConnected = false;
    this.currentRoom = null;
    this.isHandRaised = false;
    this.roomState = {
      isActive: false,
      broadcaster: null,
      participants: []
    };
    
    // Event callbacks
    this.callbacks = {
      onSocketConnected: null,
      onConnectionQuality: null,
      onParticipantsUpdated: null,
      onAudioReceived: null,
      onBroadcastStarted: null,
      onBroadcastStopped: null,
      onUserRaisedHand: null,
      onRoomJoined: null,
      onError: null,
    };
  }

  // Initialize audio stream handlers
// Update your initialize method to check initial connection state
initialize({
  setSocketConnected,
  setConnectionQuality,
  setParticipants,
  setIsReceivingAudio,
  userRole,
  onError = null,
  onRoomJoined = null
}) {
  console.log('🚀 Initializing audio stream manager with role:', userRole);
  
  this.userRole = userRole;
  this.socket = getSocket();
  
  // Store callbacks
  this.callbacks.onSocketConnected = setSocketConnected;
  this.callbacks.onConnectionQuality = setConnectionQuality;
  this.callbacks.onParticipantsUpdated = setParticipants;
  this.callbacks.onAudioReceived = setIsReceivingAudio;
  this.callbacks.onError = onError;
  this.callbacks.onRoomJoined = onRoomJoined;
  
  // Check initial connection state and update React state
  if (this.socket) {
    const isConnected = this.socket.connected;
    this.socketConnected = isConnected;
    
    // Immediately update React state with current connection status
    if (this.callbacks.onSocketConnected) {
      this.callbacks.onSocketConnected(isConnected);
    }
    
    if (this.callbacks.onConnectionQuality) {
      this.callbacks.onConnectionQuality(isConnected ? 'excellent' : 'poor');
    }
    
    console.log('🔍 Initial socket connection state:', isConnected);
  }
  
  this.setupAudioEventHandlers();
  this.setupRoomEventHandlers();
  this.setupConnectionEventHandlers();
  
  console.log('🎯 Audio stream manager initialization complete');
  return this.socket;
}

  // Setup audio-specific event handlers (matching backend events)
  setupAudioEventHandlers() {
    // Handle incoming audio stream from broadcaster
    this.socket.on('audio-stream', (data) => {
      if (this.userRole === 'listener') {
        console.log('🔊 Received audio stream data from broadcaster:', data.broadcasterId);
        this.isReceivingAudio = true;
        
        if (this.callbacks.onAudioReceived) {
          this.callbacks.onAudioReceived(true);
        }
        
        console.log('📊 Audio stream details:', {
          timestamp: data.timestamp,
          broadcasterId: data.broadcasterId,
          dataSize: data.audioData?.length || 'unknown'
        });
        
        // Process the audio data
        this.processAudioData(data.audioData, data.timestamp);
      }
    });

    // Handle broadcast started event
    this.socket.on('broadcast-started', (data) => {
      console.log('📻 Broadcast started by:', data.broadcasterName, 'at', data.startedAt);
      this.isReceivingAudio = true;
      this.roomState.isActive = true;
      
      if (this.callbacks.onAudioReceived) {
        this.callbacks.onAudioReceived(true);
      }
      
      if (this.callbacks.onBroadcastStarted) {
        this.callbacks.onBroadcastStarted(data);
      }
    });

    // Handle broadcast stopped event
    this.socket.on('broadcast-stopped', (data) => {
      console.log('📻 Broadcast stopped by:', data.broadcasterName);
      if (data.reason) {
        console.log('📻 Reason:', data.reason);
      }
      
      this.isReceivingAudio = false;
      this.roomState.isActive = false;
      
      if (this.callbacks.onAudioReceived) {
        this.callbacks.onAudioReceived(false);
      }
      
      if (this.callbacks.onBroadcastStopped) {
        this.callbacks.onBroadcastStopped(data);
      }
    });
  }

  // Setup room and participant event handlers (matching backend)
  setupRoomEventHandlers() {
    // Handle successful room join
    this.socket.on('room-joined', (data) => {
      console.log('🏠 Successfully joined room:', data.roomId);
      console.log('👥 Current participants:', data.participants.length);
      
      this.currentRoom = data.roomId;
      this.participants = data.participants;
      this.roomState = {
        isActive: data.isActive,
        broadcaster: data.broadcaster,
        participants: data.participants
      };
      
      if (this.callbacks.onParticipantsUpdated) {
        this.callbacks.onParticipantsUpdated(data.participants);
      }
      
      if (this.callbacks.onRoomJoined) {
        this.callbacks.onRoomJoined(data);
      }
    });

    // Handle participants list updates
    this.socket.on('participants-updated', (updatedParticipants) => {
      console.log('👥 Participants updated:', updatedParticipants.length, 'participants');
      
      this.participants = updatedParticipants;
      this.roomState.participants = updatedParticipants;
      
      // Update broadcaster info
      const broadcaster = updatedParticipants.find(p => p.userRole === 'broadcaster');
      this.roomState.broadcaster = broadcaster || null;
      
      if (this.callbacks.onParticipantsUpdated) {
        this.callbacks.onParticipantsUpdated(updatedParticipants);
      }
    });

    // Handle user raised hand event
    this.socket.on('user-raised-hand', (data) => {
      console.log('✋ User hand status changed:', data.userName, 'raised:', data.handRaised);
      
      if (this.callbacks.onUserRaisedHand) {
        this.callbacks.onUserRaisedHand(data);
      }
    });

    // Handle connection quality changes
    this.socket.on('connection-quality-changed', (quality) => {
      console.log('📶 Connection quality changed to:', quality);
      this.connectionQuality = quality;
      
      if (this.callbacks.onConnectionQuality) {
        this.callbacks.onConnectionQuality(quality);
      }
    });

    // Handle errors from server
    this.socket.on('error', (errorData) => {
      console.error('❌ Server error:', errorData.message);
      
      if (this.callbacks.onError) {
        this.callbacks.onError(errorData);
      }
    });
  }

 // In your setupConnectionEventHandlers method, make sure you're properly handling the connection state

setupConnectionEventHandlers() {
  this.socket.on('connect', () => {
    console.log('✅ Connected to server in audio stream manager');
    this.socketConnected = true;
    this.connectionQuality = 'excellent';
    
    // IMPORTANT: Make sure to call the callback
    if (this.callbacks.onSocketConnected) {
      this.callbacks.onSocketConnected(true);
    }
    
    if (this.callbacks.onConnectionQuality) {
      this.callbacks.onConnectionQuality('excellent');
    }
  });

  this.socket.on('disconnect', (reason) => {
    console.log('🔌 Disconnected from server in audio stream manager. Reason:', reason);
    this.socketConnected = false;
    this.connectionQuality = 'poor';
    this.isReceivingAudio = false;
    
    if (this.callbacks.onSocketConnected) {
      this.callbacks.onSocketConnected(false);
    }
    
    if (this.callbacks.onConnectionQuality) {
      this.callbacks.onConnectionQuality('poor');
    }
    
    if (this.callbacks.onAudioReceived) {
      this.callbacks.onAudioReceived(false);
    }
  });

  // Add connection_error handler
  this.socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error);
    this.socketConnected = false;
    this.connectionQuality = 'poor';
    
    if (this.callbacks.onSocketConnected) {
      this.callbacks.onSocketConnected(false);
    }
    
    if (this.callbacks.onConnectionQuality) {
      this.callbacks.onConnectionQuality('poor');
    }
    
    if (this.callbacks.onError) {
      this.callbacks.onError({ message: `Connection error: ${error.message}` });
    }
  });
}

// Also add a method to check current socket connection status
getSocketConnected() {
  return this.socket ? this.socket.connected : false;
}



  // Room management methods (matching backend API)
  joinRoom({ roomId, userName, userRole, userId = null }) {
    if (this.socket && this.socket.connected) {
      console.log('🚪 Joining room:', roomId, 'as', userRole);
      this.socket.emit('join-room', { roomId, userName, userRole, userId });
      this.currentRoom = roomId;
      this.userRole = userRole;
    } else {
      console.error('❌ Cannot join room - socket not connected');
    }
  }

  leaveRoom() {
    if (this.socket && this.socket.connected && this.currentRoom) {
      console.log('🚪 Leaving room:', this.currentRoom);
      this.socket.emit('leave-room', { roomId: this.currentRoom });
      
      // Reset state
      this.currentRoom = null;
      this.participants = [];
      this.isReceivingAudio = false;
      this.roomState = { isActive: false, broadcaster: null, participants: [] };
    }
  }

  // Audio control methods (matching backend API)
  startBroadcast(broadcasterName) {
    if (this.socket && this.socket.connected && this.currentRoom && this.userRole === 'broadcaster') {
      console.log('📻 Starting broadcast...');
      this.socket.emit('start-broadcast', { 
        roomId: this.currentRoom, 
        broadcasterName 
      });
    } else {
      console.error('❌ Cannot start broadcast - invalid state or not a broadcaster');
    }
  }

  stopBroadcast() {
    if (this.socket && this.socket.connected && this.currentRoom && this.userRole === 'broadcaster') {
      console.log('📻 Stopping broadcast...');
      this.socket.emit('stop-broadcast', { roomId: this.currentRoom });
    } else {
      console.error('❌ Cannot stop broadcast - invalid state or not a broadcaster');
    }
  }

  // Send audio data (for broadcasters)
  sendAudioData(audioData, timestamp = Date.now()) {
    if (this.socket && this.socket.connected && this.currentRoom && this.userRole === 'broadcaster') {
      this.socket.emit('audio-stream', { 
        roomId: this.currentRoom, 
        audioData, 
        timestamp 
      });
    }
  }

  // Raise/lower hand
  raiseHand(userName) {
    if (this.socket && this.socket.connected && this.currentRoom) {
      console.log('✋ Toggling hand raise status');
      this.socket.emit('raise-hand', { 
        roomId: this.currentRoom, 
        userName 
      });
    }
  }

  // Update connection quality
  updateConnectionQuality(quality) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('connection-quality', { quality });
    }
  }

  // Process incoming audio data
  processAudioData(audioData, timestamp) {
    // Implement your audio processing logic here
    // This could include decoding, buffering, playing audio, etc.
    console.log('🎵 Processing audio data with timestamp:', timestamp);
  }

  // Getters
  getConnectionQuality() {
    return this.connectionQuality;
  }

  getParticipants() {
    return this.participants;
  }

  getIsReceivingAudio() {
    return this.isReceivingAudio;
  }

  getUserRole() {
    return this.userRole;
  }

  getCurrentRoom() {
    return this.currentRoom;
  }

  getRoomState() {
    return { ...this.roomState };
  }

  getIsHandRaised() {
    return this.isHandRaised;
  }

  // Check if current user is the broadcaster
  isBroadcaster() {
    return this.userRole === 'broadcaster';
  }

  // Check if room has active broadcast
  isRoomActive() {
    return this.roomState.isActive;
  }

  // Cleanup
  cleanup() {
    if (this.socket) {
      // Leave current room if joined
      if (this.currentRoom) {
        this.leaveRoom();
      }

      // Remove all audio-specific listeners
      this.socket.off('audio-stream');
      this.socket.off('broadcast-started');
      this.socket.off('broadcast-stopped');
      this.socket.off('participants-updated');
      this.socket.off('user-raised-hand');
      this.socket.off('room-joined');
      this.socket.off('connection-quality-changed');
      this.socket.off('error');
    }
    
    // Reset state
    this.isReceivingAudio = false;
    this.participants = [];
    this.connectionQuality = 'unknown';
    this.socketConnected = false;
    this.userRole = null;
    this.currentRoom = null;
    this.isHandRaised = false;
    this.roomState = { isActive: false, broadcaster: null, participants: [] };
    
    console.log('🧹 Audio stream manager cleaned up');
  }
}

// Export singleton instance
export const audioStreamManager = new AudioStreamManager();

// Export initialization function for backward compatibility
export const initializeAudioSocket = (config) => {
  return audioStreamManager.initialize(config);
};

export default audioStreamManager;