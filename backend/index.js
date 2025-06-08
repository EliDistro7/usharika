const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const cors = require('cors');
const { initSocket } = require("./socket/base"); // Import the Socket.IO initializer

dotenv.config();

//const userRoutes = require("./routes/user-routes.js");
const userRoutesYombo = require("./routes/user-routes-yombo.js");
const seriesRoutes = require("./routes/series-routes.js");
const rolesRoutes = require("./routes/roles-routes.js");
const updateRoutes = require("./routes/update-routes.js");
const futureEventRoutes = require("./routes/futureEvents-routes.js");
const adminRoutes = require("./routes/admin-routes.js");
const attendanceRoutes = require("./routes/attendance-routes.js");

//const { initializeGlobalState } = require('./controllers/global-controller.js');
//const { getAllPosts, deletePost } = require("./controllers/post-controller.js");
const highlightRoutes = require("./routes/highlight-routes.js");

const PORT = process.env.PORT || 5000;

console.log("origin", process.env.ORIGIN);
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
   // initializeGlobalState() // Initialize global state when connected to MongoDB
})
.catch((err) => {
    console.log("NOT CONNECTED TO NETWORK", err);
});

// Initialize Socket.IO with the HTTP server
const io = initSocket(server); // Initialize socket instance



// Routes

app.use('/', userRoutesYombo);

app.use('/', adminRoutes);
app.use('/', attendanceRoutes);
app.use('/', highlightRoutes);
app.use('/', futureEventRoutes);
app.use('/', updateRoutes);
app.use('/',rolesRoutes);
app.use('/', seriesRoutes);


// Start the server
server.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`);
});
