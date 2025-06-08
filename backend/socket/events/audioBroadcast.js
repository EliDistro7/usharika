const User = require("../../models/yombo/yomboUserSchema.js");

module.exports = function audioBroadcastEvents(io, socket, userSockets) {
  // Store active rooms and their participants
  const activeRooms = new Map();
  
  // Helper function to get user info by userId
  const getUserById = async (userId) => {
    try {
      const user = await User.findById(userId);
      return user ? { id: user._id, username: user.name } : null;
    } catch (err) {
      console.error("Error fetching user:", err);
      return null;
    }
  };

  // Helper function to notify all users in a room
  const notifyRoom = (roomId, event, eventData, excludeSocketId = null) => {
    const room = activeRooms.get(roomId);
    if (room) {
        console.log(`Notifying room ${roomId} about event: ${event}`, eventData);

      room.participants.forEach(participant => {
        const targetSocketId = userSockets[participant.userId];
       
                if (targetSocketId && targetSocketId !== excludeSocketId) {
          io.to(targetSocketId).emit(event, eventData);
          console.log(`Emitted event ${event} to user ${participant.userName} (${participant.userId}) via socket ${targetSocketId}`);
        }
        console.log(`Emitted event ${event} to user ${participant.userName} (${participant.userId})`);
      });
    }
  };

  // Helper function to get room participants
  const getRoomParticipants = (roomId) => {
    const room = activeRooms.get(roomId);
    return room ? room.participants : [];
  };

  // Helper function to update connection quality
  const updateConnectionQuality = (socketId, quality) => {
    // Find user by socket ID and update quality
    for (const [roomId, room] of activeRooms.entries()) {
      const participant = room.participants.find(p => userSockets[p.userId] === socketId);
      if (participant) {
        participant.connectionQuality = quality;
        notifyRoom(roomId, 'participants-updated', room.participants);
        break;
      }
    }
  };

  // Listen for 'join-room' event
  socket.on("join-room", async ({ roomId, userName, userRole, userId = null }) => {
    try {
      console.log(`User ${userName} joining room ${roomId} as ${userRole}`);

      // Get or create room
      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, {
          id: roomId,
          participants: [],
          broadcaster: null,
          isActive: false,
          createdAt: new Date()
        });
      }

      const room = activeRooms.get(roomId);
      
      // Add participant to room
      const participant = {
        userId: userId || socket.id,
        userName,
        userRole,
        socketId: socket.id,
        joinedAt: new Date(),
        connectionQuality: 'excellent',
        handRaised: false
      };

      // Remove existing participant if rejoining
      room.participants = room.participants.filter(p => p.userId !== participant.userId);
      room.participants.push(participant);

      // Set broadcaster if role is broadcaster
      if (userRole === 'broadcaster') {
        room.broadcaster = participant;
      }

      // Join socket room
      socket.join(roomId);

      // Notify all participants about updated participant list
      notifyRoom(roomId, 'participants-updated', room.participants);

      // Send current room state to the joining user
      socket.emit('room-joined', {
        roomId,
        participants: room.participants,
        isActive: room.isActive,
        broadcaster: room.broadcaster
      });

      console.log(`Room ${roomId} now has ${room.participants.length} participants`);

    } catch (err) {
      console.error("Error handling join-room event:", err);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Listen for 'start-broadcast' event
  socket.on("start-broadcast", async ({ roomId, broadcasterName }) => {
    try {
      console.log(`Starting broadcast in room ${roomId} by ${broadcasterName}`);

      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        console.log(`Room ${roomId} not found for broadcaster ${broadcasterName}`);
        return;
      }

      // Verify broadcaster
      const broadcaster = room.participants.find(p => p.socketId === socket.id && p.userRole === 'broadcaster');
      if (!broadcaster) {
        socket.emit('error', { message: 'Only broadcasters can start broadcast' });
        console.log(`User ${broadcasterName} attempted to start broadcast without broadcaster role`);
        return;
      }

      room.isActive = true;
      room.startedAt = new Date();
      console.log(`Broadcast started by ${broadcasterName} in room ${roomId}`);

      // Notify all participants that broadcast started
      notifyRoom(roomId, 'broadcast-started', {
        broadcasterId: broadcaster.userId,
        broadcasterName: broadcaster.userName,
        startedAt: room.startedAt
      });

      console.log(`Broadcast started in room ${roomId}`);

    } catch (err) {
      console.error("Error handling start-broadcast event:", err);
      socket.emit('error', { message: 'Failed to start broadcast' });
    }
  });

  // Listen for 'stop-broadcast' event
  socket.on("stop-broadcast", async ({ roomId }) => {
    try {
      console.log(`Stopping broadcast in room ${roomId}`);

      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Verify broadcaster
      const broadcaster = room.participants.find(p => p.socketId === socket.id && p.userRole === 'broadcaster');
      if (!broadcaster) {
        socket.emit('error', { message: 'Only broadcasters can stop broadcast' });
        return;
      }

      room.isActive = false;
      room.endedAt = new Date();

      // Notify all participants that broadcast stopped
      notifyRoom(roomId, 'broadcast-stopped', {
        broadcasterId: broadcaster.userId,
        broadcasterName: broadcaster.userName,
        endedAt: room.endedAt
      });

      console.log(`Broadcast stopped in room ${roomId}`);

    } catch (err) {
      console.error("Error handling stop-broadcast event:", err);
      socket.emit('error', { message: 'Failed to stop broadcast' });
    }
  });

  // Listen for 'audio-stream' event
  socket.on("audio-stream", async ({ roomId, audioData, timestamp }) => {
    try {
      const room = activeRooms.get(roomId);
      if (!room || !room.isActive) {
        return;
      }

      // Verify broadcaster
      const broadcaster = room.participants.find(p => p.socketId === socket.id && p.userRole === 'broadcaster');
      if (!broadcaster) {
        return;
      }

      // Forward audio stream to all listeners in the room
      notifyRoom(roomId, 'audio-stream', {
        audioData,
        timestamp,
        broadcasterId: broadcaster.userId
      }, socket.id);

    } catch (err) {
      console.error("Error handling audio-stream event:", err);
    }
  });

  // Listen for 'raise-hand' event
  socket.on("raise-hand", async ({ roomId, userName }) => {
    try {
      console.log(`${userName} raised hand in room ${roomId}`);

      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Find and update participant
      const participant = room.participants.find(p => p.socketId === socket.id);
      if (participant) {
        participant.handRaised = !participant.handRaised;
        
        // Notify all participants
        notifyRoom(roomId, 'user-raised-hand', {
          userId: participant.userId,
          userName: participant.userName,
          handRaised: participant.handRaised
        });

        // Update participants list
        notifyRoom(roomId, 'participants-updated', room.participants);
      }

    } catch (err) {
      console.error("Error handling raise-hand event:", err);
    }
  });

  // Listen for 'connection-quality' event
  socket.on("connection-quality", async ({ quality }) => {
    try {
      updateConnectionQuality(socket.id, quality);
      socket.emit('connection-quality-changed', quality);
    } catch (err) {
      console.error("Error handling connection-quality event:", err);
    }
  });

  // Listen for 'leave-room' event
  socket.on("leave-room", async ({ roomId }) => {
    try {
      console.log(`User leaving room ${roomId}`);
      
      const room = activeRooms.get(roomId);
      if (room) {
        // Remove participant
        const leavingParticipant = room.participants.find(p => p.socketId === socket.id);
        room.participants = room.participants.filter(p => p.socketId !== socket.id);

        // If broadcaster left, stop broadcast
        if (leavingParticipant && leavingParticipant.userRole === 'broadcaster') {
          room.isActive = false;
          room.broadcaster = null;
          notifyRoom(roomId, 'broadcast-stopped', {
            broadcasterId: leavingParticipant.userId,
            broadcasterName: leavingParticipant.userName,
            reason: 'Broadcaster left'
          });
        }

        // Leave socket room
        socket.leave(roomId);

        // Notify remaining participants
        notifyRoom(roomId, 'participants-updated', room.participants);

        // Clean up empty rooms
        if (room.participants.length === 0) {
          activeRooms.delete(roomId);
          console.log(`Room ${roomId} deleted - no participants left`);
        }
      }

    } catch (err) {
      console.error("Error handling leave-room event:", err);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    try {
      console.log(`Socket ${socket.id} disconnected`);
      
      // Find and remove user from all rooms
      for (const [roomId, room] of activeRooms.entries()) {
        const participant = room.participants.find(p => p.socketId === socket.id);
        if (participant) {
          // Remove participant
          room.participants = room.participants.filter(p => p.socketId !== socket.id);

          // If broadcaster disconnected, stop broadcast
          if (participant.userRole === 'broadcaster') {
            room.isActive = false;
            room.broadcaster = null;
            notifyRoom(roomId, 'broadcast-stopped', {
              broadcasterId: participant.userId,
              broadcasterName: participant.userName,
              reason: 'Broadcaster disconnected'
            });
          }

          // Notify remaining participants
          notifyRoom(roomId, 'participants-updated', room.participants);

          // Clean up empty rooms
          if (room.participants.length === 0) {
            activeRooms.delete(roomId);
            console.log(`Room ${roomId} deleted - no participants left`);
          }
          
          break;
        }
      }

    } catch (err) {
      console.error("Error handling disconnect:", err);
    }
  });

  return {
    getRoomParticipants,
    getActiveRooms: () => Array.from(activeRooms.values()),
    getRoomById: (roomId) => activeRooms.get(roomId)
  };
};