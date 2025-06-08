const socketIo = require('socket.io');
const postEvents = require('./events/postEvents');
const commentEvents = require('./events/commentEvents');
const messageEvents = require('./events/messageEvents'); // Import messageEvents
const NotificationsEvents = require('./events/notificationEvents');
const searchEvents = require('./events/searchEvents');

const questionsEvents = require('./events/seriesEvent.js');

const room2 = require('./events/room2');
const User = require("../models/yombo/yomboUserSchema.js");
const taggingUser = require('./events/taggingUser');
const audio3 = require('./events/audio3');
const audioBroadcast = require('./events/audioBroadcast');

const getUserDetails = async (userId) => {
  return await User.findById(userId);  // Assuming you have a generic User schema/model
};

let io;
const userSockets = {}; // Object to store userId-socketId mapping
const roomSocketsMap = {}; // Object to store roomId-socketId mapping
const liveRoomsNow = [];

const activeRoomMembers = []
const onlineUsers = []; // Array to store online registered users
const guestUsers = []; // Array to store guest user socket IDs

function initSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: process.env.ORIGIN, // Adjust this to match your client-side domain
      methods: ['GET', 'POST'],
      pingInterval: 10000, // Set ping interval for detecting dead connections
      pingTimeout: 5000,   // Timeout to wait for pong response
    },
  });

  console.log('🚀 Socket.IO server initialized');

  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);
    console.log('📊 Total connected clients:', io.engine.clientsCount);

    // Handle guest users (unregistered users)
    socket.on('guestUser', () => {
      console.log('👤 Guest user connected:', socket.id);
      
      guestUsers.push(socket.id); // Add guest user to guestUsers array
      console.log('📈 Total guest users:', guestUsers.length);

      // Emit event to notify all clients that a guest user is online
      io.emit('guestUserConnected', { socketId: socket.id });

      // Acknowledge guest user connection
      socket.emit('guestUserAck', { status: 'ok' });
      console.log('✅ Guest user acknowledged:', socket.id);
    });

    // Handle registered/logged-in users
    socket.on('loginUser', async ({ userId }) => {
      console.log('🔐 User login attempt:', { userId, socketId: socket.id });
     
      try {
        const userDetails = await getUserDetails(userId);

        if (userDetails) {
          console.log('✅ User details found:', userDetails.username || userDetails.name || userId);

          // Notify the old session to log out if the user is already connected
          if (userSockets[userId]) {
            console.log('⚠️ User already connected, logging out old session:', userSockets[userId]);
            io.to(userSockets[userId]).emit('loggedOut');
            console.log(`🔄 User ${userId} logged out from socket ID: ${userSockets[userId]}`);
          }

          // Map userId to the new socket.id
          userSockets[userId] = socket.id;

          // Add the socket ID to the userDetails object
          const userWithSocket = {
            ...userDetails._doc,  // Spread user details (assuming it's a Mongoose document)
            socketId: socket.id   // Add the socket ID to the user object
          };

          onlineUsers.push(userWithSocket); // Add the user to the onlineUsers array
          console.log('📈 Total registered online users:', onlineUsers.length);

          // Emit event to all clients about the new online user
          io.emit('userConnected', { user: userWithSocket });

          // Acknowledge the login event
          socket.emit('loginUserAck', { status: 'ok', user: userDetails });
          console.log('✅ User login successful:', { userId, socketId: socket.id });
        } else {
          console.log('❌ User not found in database:', userId);
          socket.emit('loginUserAck', { status: 'error', message: 'User not found' });
        }
      } catch (error) {
        console.error('💥 Error fetching user details:', error);
        socket.emit('loginUserAck', { status: 'error', message: 'Error retrieving user data' });
      }
    });

    socket.on('createRoom',async ({roomId})=>{
      let userId=roomId;
      console.log('🏠 Creating room with userId:', userId, 'socketId:', socket.id);
     
      try {
        if(roomSocketsMap[userId]) {
          console.log('⚠️ Room already exists for userId:', userId);
          return;
        }
        
        const userDetails = await getUserDetails(userId);
        userDetails.password = undefined;

        // Map userId to the new socket.id
        roomSocketsMap[userId] = [socket.id,{ socket:socket.id, userId:userId, ...userDetails._doc, isSpeaker:true}];
        io.to(userSockets[userId]).emit('assignedRole', { role: 'speaker' });
        
        console.log("🗺️ RoomSocketsMap updated:", Object.keys(roomSocketsMap));

        // Add the socket ID to the userDetails object
        const userWithRoomSocket = {
          ...userDetails._doc,  // Spread user details (assuming it's a Mongoose document)
          socketId: socket.id   // Add the socket ID to the user object
        };

        activeRoomMembers.push(userWithRoomSocket); // Add the user to the onlineUsers array
        io.to(roomSocketsMap[userId][0]).emit('assignedRole', { role: 'speaker' });

        // Emit to the room that a user has joined and update the list of users in the room
        io.to(roomSocketsMap[roomId][0]).emit('updateRoomUsers', roomSocketsMap[userId]);
        
        console.log('✅ Room created successfully for userId:', userId);
        
      } catch (error) {
        console.error('💥 Error creating room:', error);
        socket.emit('loginUserAck', { status: 'error', message: 'Error retrieving user data' });
      }
    })

    // Handle the event to check for online users
    socket.on('checkOnlineUsers', () => {
      console.log('📋 Online users check requested by:', socket.id);
      // Respond with both registered and guest online users
      socket.emit('onlineUsersResponse', { registeredUsers: onlineUsers, guestUsers });
      console.log('📤 Sent online users response:', { 
        registeredCount: onlineUsers.length, 
        guestCount: guestUsers.length 
      });
    });

    socket.on('checkLiveGroups', () => {
      console.log('🔴 Live groups check requested by:', socket.id);
      // Respond with both registered and guest online users
      socket.emit('liveGroupsResponse', { liveGroupsNow: roomSocketsMap });
      console.log('📤 Sent live groups response, total rooms:', Object.keys(roomSocketsMap).length);
    });

    // Initialize message-related events
    messageEvents(io, socket, userSockets);
    //  roomEvents(io, socket, userSockets);
    // Initialize post-related events
    postEvents(io, socket, userSockets);
    searchEvents(io, socket, userSockets);
    // Initialize comment-related events
    commentEvents(io, socket, userSockets);
    // taggingUser(io, socket);
    audioBroadcast(io, socket, userSockets)
    // room2(io, socket, userSockets, roomSocketsMap);

    questionsEvents(io, socket, userSockets);
    // answerEvents(io, socket, userSockets);
    
    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('🔌 User disconnected:', socket.id);
      console.log('📊 Remaining connected clients:', io.engine.clientsCount);

      // Find and remove the disconnected user's socketId from the mapping
      let disconnectedUserId = null;
      for (const userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          disconnectedUserId = userId;
          delete userSockets[userId]; // Clean up the mapping on disconnect
          // Remove user from the onlineUsers array
          const userIndex = onlineUsers.findIndex(u => u._id === userId);
          if (userIndex !== -1) {
            const removedUser = onlineUsers.splice(userIndex, 1)[0];
            console.log('👤 Registered user removed from online list:', removedUser.username || removedUser.name || userId);
          }
          break; // Exit the loop once the user is found and removed
        }
      }

      // Remove guest user from the guestUsers array
      const guestIndex = guestUsers.indexOf(socket.id);
      if (guestIndex !== -1) {
        guestUsers.splice(guestIndex, 1);
        console.log('👤 Guest user removed from online list:', socket.id);
      }

      // Clean up room mappings
      for (const roomId in roomSocketsMap) {
        if (roomSocketsMap[roomId][0] === socket.id) {
          delete roomSocketsMap[roomId];
          console.log('🏠 Room cleaned up for disconnected user:', roomId);
          break;
        }
      }

      console.log('📈 Current stats after disconnect:', {
        registeredUsers: onlineUsers.length,
        guestUsers: guestUsers.length,
        activeRooms: Object.keys(roomSocketsMap).length
      });

      // Emit an event to notify all clients about the disconnection
      io.emit('userDisconnected', { socketId: socket.id });
    });
  });

  return io; // Return the initialized socket instance
}

// Function to get the current io instance
function getIo() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

module.exports = {
  initSocket,
  getIo,
};