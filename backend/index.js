const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const cors = require('cors');
const { initSocket } = require("./socket/base"); // Import the Socket.IO initializer

dotenv.config();

const userRoutes = require("./routes/user-routes.js");
const userRoutesYombo = require("./routes/user-routes-yombo.js");
const postRoutes = require("./routes/post-routes.js");
const globalRoutes = require("./routes/global-routes.js");
const notificationRoutes = require("./routes/notification-routes.js");
const uploadRoutes = require("./routes/upload-routes.js");
const adminRoutes = require("./routes/admin-routes.js");
const attendanceRoutes = require("./routes/attendance-routes.js");
const answerRoutes = require("./routes/answer-routes.js");
const { initializeGlobalState } = require('./controllers/global-controller.js');
const { getAllPosts, deletePost } = require("./controllers/post-controller.js");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: process.env.ORIGIN  // Allow only this origin
}));

const server = http.createServer(app); // Create an HTTP server using the Express app

// Middleware
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 20000, // 20 seconds
    socketTimeoutMS: 45000,  // 45 seconds
})
.then(() => {
    console.log("Connected to MongoDB")
    initializeGlobalState() // Initialize global state when connected to MongoDB
})
.catch((err) => {
    console.log("NOT CONNECTED TO NETWORK", err);
});

// Initialize Socket.IO with the HTTP server
//const io = initSocket(server); // Initialize socket instance

//app.post('/get-posts', getAllPosts);
//app.post('/delete-post', deletePost);

// Routes
//app.use('/', userRoutes);
app.use('/', userRoutesYombo);
//app.use('/', globalRoutes);
app.use('/', adminRoutes);
app.use('/', attendanceRoutes);
//app.use('/', postRoutes);
//app.use('/', notificationRoutes);
//app.use('/', uploadRoutes);
//app.use('/', messageRoutes);
//app.use('/', chatlistRoutes);
//app.use('/', questionRoutes);
//app.use('/', answerRoutes);

// Start the server
server.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`);
});
