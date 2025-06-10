import { getSocket } from './socketCore';
import { getLoggedInUserId } from '@/hooks/useUser';
import SimplePeer from 'simple-peer';

// Audio stream management using SimplePeer
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
    
    // SimplePeer specific properties
    this.peer = null;
    this.peers = new Map(); // For broadcasters to manage multiple listener connections
    this.localStream = null;
    this.isInitiator = false;
    this.peerConnected = false;
    
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
      onPeerConnected: null,
      onPeerDisconnected: null,
      onReactionReceived: null
    };
  }

  // Initialize audio stream handlers
  initialize({
    setSocketConnected,
    setConnectionQuality,
    setParticipants,
    setIsReceivingAudio,
    userRole,
    onError = null,
    onRoomJoined = null,
    onPeerConnected = null,
    onPeerDisconnected = null,
    onReactionReceived = null
  }) {
    console.log('🚀 Initializing SimplePeer audio stream manager with role:', userRole);
    
    this.userRole = userRole;
    this.socket = getSocket();
    
    // Store callbacks
    this.callbacks.onSocketConnected = setSocketConnected;
    this.callbacks.onConnectionQuality = setConnectionQuality;
    this.callbacks.onParticipantsUpdated = setParticipants;
    this.callbacks.onAudioReceived = setIsReceivingAudio;
    this.callbacks.onError = onError;
    this.callbacks.onRoomJoined = onRoomJoined;
    this.callbacks.onPeerConnected = onPeerConnected;
    this.callbacks.onPeerDisconnected = onPeerDisconnected;
    this.callbacks.onReactionReceived = onReactionReceived;
    
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
    
    this.setupRoomEventHandlers();
    this.setupConnectionEventHandlers();
    this.setupSimplePeerEventHandlers();
    
    console.log('🎯 SimplePeer audio stream manager initialization complete');
    return this.socket;
  }

  // Setup SimplePeer-specific event handlers
  setupSimplePeerEventHandlers() {
    // Handle listener joining (for broadcaster)
    this.socket.on('listener-joined', (data) => {
      console.log('👂 New listener joined:', data.userName);
      
      if (this.userRole === 'broadcaster') {
        this.createPeerForListener(data);
      }
    });

    // Handle signals from listeners (for broadcaster)
    this.socket.on('listener-signal', (data) => {
      console.log('📡 Received listener signal from:', data.userName);
      
      if (this.userRole === 'broadcaster') {
        this.handleListenerSignal(data);
      }
    });

    // Handle signals from broadcaster (for listeners)
    this.socket.on('broadcaster-signal', (data) => {
      console.log('📡 Received broadcaster signal');
      
      if (this.userRole === 'listener') {
        this.handleBroadcasterSignal(data);
      }
    });

    // Handle reactions
    this.socket.on('reaction-received', (data) => {
      console.log('🎭 Reaction received:', data.reaction, 'from', data.userName);
      
      if (this.callbacks.onReactionReceived) {
        this.callbacks.onReactionReceived(data);
      }
    });
  }

  // Create peer connection for a new listener (broadcaster side)
  createPeerForListener(listenerData) {
    if (this.userRole !== 'broadcaster' || !this.localStream) {
      console.error('❌ Cannot create peer - not broadcaster or no local stream');
      return;
    }

    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: this.localStream
    });

    peer.on('signal', (signal) => {
      console.log('📤 Sending signal to listener:', listenerData.userName);
      this.socket.emit('broadcaster-signal', {
        roomId: this.currentRoom,
        signal,
        targetSocketId: listenerData.socketId
      });
    });

    peer.on('connect', () => {
      console.log('🔗 Connected to listener:', listenerData.userName);
      this.notifyPeerConnected(listenerData.userId);
    });

    peer.on('close', () => {
      console.log('🔌 Disconnected from listener:', listenerData.userName);
      this.peers.delete(listenerData.socketId);
      this.notifyPeerDisconnected(listenerData.userId);
    });

    peer.on('error', (err) => {
      console.error('❌ Peer error with listener:', listenerData.userName, err);
      this.peers.delete(listenerData.socketId);
    });

    this.peers.set(listenerData.socketId, peer);
  }

  // Handle signal from listener (broadcaster side)
  handleListenerSignal(data) {
    const peer = this.peers.get(data.socketId);
    if (peer) {
      console.log('📥 Processing listener signal from:', data.userName);
      peer.signal(data.signal);
    }
  }

  // Handle signal from broadcaster (listener side)
  handleBroadcasterSignal(data) {
    if (this.peer) {
      console.log('📥 Processing broadcaster signal');
      this.peer.signal(data.signal);
    }
  }

  // Setup room and participant event handlers
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

    // Handle broadcast started event
    this.socket.on('broadcast-started', (data) => {
      console.log('📻 Broadcast started by:', data.broadcasterName, 'at', data.startedAt);
      this.roomState.isActive = true;
      
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

      // Clean up peer connections
      this.cleanupPeerConnections();
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

  // Setup connection event handlers
  setupConnectionEventHandlers() {
    this.socket.on('connect', () => {
      console.log('✅ Connected to server in audio stream manager');
      this.socketConnected = true;
      this.connectionQuality = 'excellent';
      
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

      // Clean up peer connections
      this.cleanupPeerConnections();
    });

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

  // Room management methods
  joinRoomAsBroadcaster({ roomId, userName, userId = null }) {
    if (this.socket && this.socket.connected) {
      console.log('🚪 Joining room as broadcaster:', roomId);
      this.socket.emit('join-room-broadcaster', { roomId, userName, userId });
      this.currentRoom = roomId;
      this.userRole = 'broadcaster';
    } else {
      console.error('❌ Cannot join room - socket not connected');
    }
  }

  joinRoomAsListener({ roomId, userName, userId = null }) {
    if (this.socket && this.socket.connected) {
      console.log('🚪 Joining room as listener:', roomId);
      this.socket.emit('join-room-listener', { roomId, userName, userId });
      this.currentRoom = roomId;
      this.userRole = 'listener';
      
      // Create peer connection for receiving audio
      this.createListenerPeer();
    } else {
      console.error('❌ Cannot join room - socket not connected');
    }
  }

  // Create peer connection for listener
  createListenerPeer() {
    this.peer = new SimplePeer({
      initiator: false,
      trickle: false
    });

    this.peer.on('signal', (signal) => {
      console.log('📤 Sending listener signal to broadcaster');
      console.log('userId', getLoggedInUserId())
      this.socket.emit('listener-signal', {
        roomId: this.currentRoom,
        userName: this.getUserName(),
        signal,
        userId:getLoggedInUserId()
      });
    });

    this.peer.on('stream', (stream) => {
      console.log('🎵 Received audio stream from broadcaster');
      this.isReceivingAudio = true;
      this.peerConnected = true;
      
      if (this.callbacks.onAudioReceived) {
        this.callbacks.onAudioReceived(true);
      }
      
      if (this.callbacks.onPeerConnected) {
        this.callbacks.onPeerConnected();
      }
      
      this.notifyPeerConnected(getLoggedInUserId());
      
      // Play the received audio stream
      this.playAudioStream(stream);
    });

    this.peer.on('connect', () => {
      console.log('🔗 Connected to broadcaster');
      this.peerConnected = true;
    });

    this.peer.on('close', () => {
      console.log('🔌 Disconnected from broadcaster');
      this.isReceivingAudio = false;
      this.peerConnected = false;
      
      if (this.callbacks.onAudioReceived) {
        this.callbacks.onAudioReceived(false);
      }
      
      if (this.callbacks.onPeerDisconnected) {
        this.callbacks.onPeerDisconnected();
      }
      
      this.notifyPeerDisconnected(getLoggedInUserId());
    });

    this.peer.on('error', (err) => {
      console.error('❌ Listener peer error:', err);
      if (this.callbacks.onError) {
        this.callbacks.onError({ message: `Peer connection error: ${err.message}` });
      }
    });
  }

  // Start broadcasting (get user media and set up for streaming)
  async startBroadcast(broadcasterName) {
    if (this.userRole !== 'broadcaster') {
      console.error('❌ Only broadcasters can start broadcast');
      return;
    }

    try {
      // Get user media (microphone)
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      });
      
      console.log('🎤 Got local audio stream');
      
      // Start the broadcast on server
      if (this.socket && this.socket.connected && this.currentRoom) {
        this.socket.emit('start-broadcast', { 
          roomId: this.currentRoom, 
          broadcasterName 
        });
      }
      
      return this.localStream;
    } catch (err) {
      console.error('❌ Failed to get user media:', err);
      if (this.callbacks.onError) {
        this.callbacks.onError({ message: `Failed to access microphone: ${err.message}` });
      }
      throw err;
    }
  }

  // Stop broadcasting
  stopBroadcast() {
    if (this.socket && this.socket.connected && this.currentRoom && this.userRole === 'broadcaster') {
      console.log('📻 Stopping broadcast...');
      this.socket.emit('stop-broadcast', { roomId: this.currentRoom });
      
      // Stop local stream
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
      
      // Clean up peer connections
      this.cleanupPeerConnections();
    } else {
      console.error('❌ Cannot stop broadcast - invalid state or not a broadcaster');
    }
  }

  // Play received audio stream
  playAudioStream(stream) {
    const audio = new Audio();
    audio.srcObject = stream;
    audio.play().catch(err => {
      console.error('❌ Failed to play audio:', err);
    });
  }

  // Clean up peer connections
  cleanupPeerConnections() {
    // Clean up listener peer
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    
    // Clean up broadcaster peers
    this.peers.forEach(peer => peer.destroy());
    this.peers.clear();
    
    this.peerConnected = false;
  }

  // Notify server about peer connection status
  notifyPeerConnected(userId) {
    if (this.socket && this.socket.connected && this.currentRoom) {
      this.socket.emit('peer-connected', {
        roomId: this.currentRoom,
        userId
      });
    }
  }

  notifyPeerDisconnected(userId) {
    if (this.socket && this.socket.connected && this.currentRoom) {
      this.socket.emit('peer-disconnected', {
        roomId: this.currentRoom,
        userId
      });
    }
  }

  // Leave room
  leaveRoom() {
    if (this.socket && this.socket.connected && this.currentRoom) {
      console.log('🚪 Leaving room:', this.currentRoom);
      this.socket.emit('leave-room', { roomId: this.currentRoom });
      
      // Clean up peer connections
      this.cleanupPeerConnections();
      
      // Stop local stream if broadcaster
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
      
      // Reset state
      this.currentRoom = null;
      this.participants = [];
      this.isReceivingAudio = false;
      this.roomState = { isActive: false, broadcaster: null, participants: [] };
    }
  }

  // Raise/lower hand
  raiseHand(userName, raised) {
    if (this.socket && this.socket.connected && this.currentRoom) {
      console.log('✋ Setting hand raise status to:', raised);
      this.isHandRaised = raised;
      this.socket.emit('raise-hand', { 
        roomId: this.currentRoom, 
        userName,
        raised
      });
    }
  }

  // Send reaction
  sendReaction(userName, reaction) {
    if (this.socket && this.socket.connected && this.currentRoom) {
      console.log('🎭 Sending reaction:', reaction);
      this.socket.emit('send-reaction', {
        roomId: this.currentRoom,
        userName,
        reaction
      });
    }
  }

  // Update connection quality
  updateConnectionQuality(quality) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('connection-quality', { quality });
    }
  }

  // Helper methods
  getUserName() {
    // You'll need to implement this based on your user management
    return 'Current User'; // Replace with actual username retrieval
  }

  getSocketConnected() {
    return this.socket ? this.socket.connected : false;
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

  getPeerConnected() {
    return this.peerConnected;
  }

  getLocalStream() {
    return this.localStream;
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

      // Remove all event listeners
      this.socket.off('listener-joined');
      this.socket.off('listener-signal');
      this.socket.off('broadcaster-signal');
      this.socket.off('reaction-received');
      this.socket.off('broadcast-started');
      this.socket.off('broadcast-stopped');
      this.socket.off('participants-updated');
      this.socket.off('user-raised-hand');
      this.socket.off('room-joined');
      this.socket.off('connection-quality-changed');
      this.socket.off('error');
    }
    
    // Clean up peer connections
    this.cleanupPeerConnections();
    
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    // Reset state
    this.isReceivingAudio = false;
    this.participants = [];
    this.connectionQuality = 'unknown';
    this.socketConnected = false;
    this.userRole = null;
    this.currentRoom = null;
    this.isHandRaised = false;
    this.peerConnected = false;
    this.roomState = { isActive: false, broadcaster: null, participants: [] };
    
    console.log('🧹 SimplePeer audio stream manager cleaned up');
  }
}

// Export singleton instance
export const audioStreamManager = new AudioStreamManager();

// Export initialization function for backward compatibility
export const initializeAudioSocket = (config) => {
  return audioStreamManager.initialize(config);
};

export default audioStreamManager;