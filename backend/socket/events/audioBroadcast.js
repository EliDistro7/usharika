const User = require("../../models/yombo/yomboUserSchema.js");

module.exports = function audioBroadcastEvents(io, socket, userSockets, activeRooms) {
  
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
      room.participants.forEach(participant => {
        const targetSocketId = userSockets[participant.userId];
       
        if (targetSocketId && targetSocketId !== excludeSocketId) {
          io.to(targetSocketId).emit(event, eventData);
        }
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

  // Listen for 'join-room-listener' event (SimplePeer listener joining)
  socket.on("join-room-listener", async ({ roomId, userName, userId = null }) => {
    try {
      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Check if broadcaster exists
      if (!room.broadcaster) {
        socket.emit('error', { message: 'No broadcaster in room' });
        return;
      }

      // Add listener to room if not already present
      const existingParticipant = room.participants.find(p => p.userId === (userId || socket.id));
      if (!existingParticipant) {
        const participant = {
          userId: userId || socket.id,
          userName,
          userRole: 'listener',
          socketId: socket.id,
          joinedAt: new Date(),
          connectionQuality: 'excellent',
          handRaised: false,
          peerConnected: false
        };
        room.participants.push(participant);
        socket.join(roomId);
      }

      // Notify broadcaster about new listener
      const broadcasterSocketId = userSockets[room.broadcaster.userId];
      if (broadcasterSocketId) {
        io.to(broadcasterSocketId).emit('listener-joined', {
          userName,
          userId: userId || socket.id,
          socketId: socket.id,
          roomId
        });
      }

      // Send current room state to the joining listener
      socket.emit('room-joined', {
        roomId,
        participants: room.participants,
        isActive: room.isActive,
        broadcaster: room.broadcaster
      });

    } catch (err) {
      console.error("Error handling join-room-listener event:", err);
      socket.emit('error', { message: 'Failed to join room as listener' });
    }
  });

  // Listen for 'join-room-broadcaster' event (SimplePeer broadcaster joining)
  socket.on("join-room-broadcaster", async ({ roomId, userName, userId = null }) => {
    try {
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
      
      // Create broadcaster participant
      const participant = {
        userId: userId,
        userName,
        userRole: 'broadcaster',
        socketId: socket.id,
        joinedAt: new Date(),
        connectionQuality: 'excellent',
        handRaised: false,
        peerConnected: false
      };

      // Remove existing participant if rejoining
      room.participants = room.participants.filter(p => p.userId !== participant.userId);
      room.participants.push(participant);

      // Set as broadcaster
      room.broadcaster = participant;

      // Join socket room
      socket.join(roomId);

      // Notify all participants about updated participant list
      notifyRoom(roomId, 'participants-updated', room.participants);

      // Send current room state to the broadcaster
      socket.emit('room-joined', {
        roomId,
        participants: room.participants,
        isActive: room.isActive,
        broadcaster: room.broadcaster
      });

    } catch (err) {
      console.error("Error handling join-room-broadcaster event:", err);
      socket.emit('error', { message: 'Failed to join room as broadcaster' });
    }
  });

  // Listen for 'listener-signal' event (SimplePeer signaling from listener to broadcaster)
  socket.on("listener-signal", async ({ roomId, userName, signal,userId }) => {
    try {
      const room = activeRooms.get(roomId);
      if (!room || !room.broadcaster) {
        socket.emit('error', { message: 'Room or broadcaster not found' });
        return;
      }

      // Forward signal to broadcaster
      const broadcasterSocketId = userSockets[room.broadcaster.userId];
      const targetSocketId = userSockets[userId];
      if (broadcasterSocketId) {
        io.to(broadcasterSocketId).emit('listener-signal', {
          signal,
          userName,
          socketId: targetSocketId,
          roomId,
          userId
        });
      }

    } catch (err) {
      console.error("Error handling listener-signal event:", err);
    }
  });

  // Listen for 'broadcaster-signal' event (SimplePeer signaling from broadcaster to listener)
  socket.on("broadcaster-signal", async ({ roomId, signal, targetSocketId }) => {
    try {
      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Verify sender is broadcaster
      const broadcaster = room.participants.find(p => p.socketId === socket.id && p.userRole === 'broadcaster');
      if (!broadcaster) {
        socket.emit('error', { message: 'Only broadcasters can send broadcaster signals' });
        return;
      }

      // Forward signal to specific listener
      if (targetSocketId) {
        io.to(targetSocketId).emit('broadcaster-signal', {
          signal,
          roomId
        });
      }

    } catch (err) {
      console.error("Error handling broadcaster-signal event:", err);
    }
  });

  // Listen for 'peer-connected' event
  socket.on("peer-connected", async ({ roomId, userId }) => {
    try {
      const room = activeRooms.get(roomId);
      if (room) {
        const participant = room.participants.find(p => p.userId === userId);
        if (participant) {
          participant.peerConnected = true;
          notifyRoom(roomId, 'participants-updated', room.participants);
        }
      }

    } catch (err) {
      console.error("Error handling peer-connected event:", err);
    }
  });

  // Listen for 'peer-disconnected' event
  socket.on("peer-disconnected", async ({ roomId, userId }) => {
    try {
      const room = activeRooms.get(roomId);
      if (room) {
        const participant = room.participants.find(p => p.userId === userId);
        if (participant) {
          participant.peerConnected = false;
          notifyRoom(roomId, 'participants-updated', room.participants);
        }
      }

    } catch (err) {
      console.error("Error handling peer-disconnected event:", err);
    }
  });

  // Listen for 'start-broadcast' event
  socket.on("start-broadcast", async ({ roomId, broadcasterName,userId }) => {
    try {
      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Verify broadcaster
      const broadcaster = room.participants.find(p => p.userId === userId && p.userRole === 'broadcaster');
      if (!broadcaster) {
        socket.emit('error', { message: 'Only broadcasters can start broadcast' });
        return;
      }

      room.isActive = true;
      room.startedAt = new Date();

      // Notify all participants that broadcast started
      notifyRoom(roomId, 'broadcast-started', {
        broadcasterId: broadcaster.userId,
        broadcasterName: broadcaster.userName,
        startedAt: room.startedAt
      });

    } catch (err) {
      console.error("Error handling start-broadcast event:", err);
      socket.emit('error', { message: 'Failed to start broadcast' });
    }
  });

  // Listen for 'stop-broadcast' event
  socket.on("stop-broadcast", async ({ roomId }) => {
    try {
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

    } catch (err) {
      console.error("Error handling stop-broadcast event:", err);
      socket.emit('error', { message: 'Failed to stop broadcast' });
    }
  });

  // Listen for 'raise-hand' event
  socket.on("raise-hand", async ({ roomId, userName, raised }) => {
    try {
      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Find and update participant
      const participant = room.participants.find(p => p.socketId === socket.id);
      if (participant) {
        participant.handRaised = raised;
        
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

  // Listen for 'send-reaction' event
  socket.on("send-reaction", async ({ roomId, userName, reaction }) => {
    try {
      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Find participant
      const participant = room.participants.find(p => p.socketId === socket.id);
      if (participant) {
        // Notify all participants about the reaction
        notifyRoom(roomId, 'reaction-received', {
          userId: participant.userId,
          userName: participant.userName,
          reaction,
          timestamp: new Date()
        });
      }

    } catch (err) {
      console.error("Error handling send-reaction event:", err);
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
        }
      }

    } catch (err) {
      console.error("Error handling leave-room event:", err);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    try {
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